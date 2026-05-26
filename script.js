export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
      "Access-Control-Max-Age": "86400"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (request.method === "GET" && (path === "/" || path === "/status")) {
        const statusData = await getStatus(env);

        return jsonResponse(
          {
            ok: true,
            ...statusData
          },
          200,
          corsHeaders
        );
      }

      if (
        request.method === "POST" &&
        ["/status", "/admin/status", "/admin/update", "/update-status"].includes(path)
      ) {
        const body = await safeJson(request);

        const authResult = await validateAdmin(request, body, env);
        if (!authResult.ok) {
          return jsonResponse(
            {
              ok: false,
              error: authResult.error
            },
            authResult.status,
            corsHeaders
          );
        }

        const normalized = normalizeStatus(body.status || body.key || body.value);

        if (!normalized) {
          return jsonResponse(
            {
              ok: false,
              error: "Invalid status. Use online, maintenance, or offline."
            },
            400,
            corsHeaders
          );
        }

        const payload = {
          key: normalized.key,
          emoji: normalized.emoji,
          label: normalized.label,
          status: `${normalized.emoji} ${normalized.label}`,
          message: body.message || defaultMessage(normalized.key),
          updatedAt: new Date().toISOString(),
          updatedBy: body.updatedBy || body.admin || "DarkMode Customs™ Admin"
        };

        await env.STATUS_KV.put("company_status", JSON.stringify(payload));

        await sendDiscordWebhook(env, payload);

        return jsonResponse(
          {
            ok: true,
            saved: true,
            ...payload
          },
          200,
          corsHeaders
        );
      }

      return jsonResponse(
        {
          ok: false,
          error: "Route not found."
        },
        404,
        corsHeaders
      );
    } catch (error) {
      return jsonResponse(
        {
          ok: false,
          error: "Worker error.",
          details: String(error && error.message ? error.message : error)
        },
        500,
        corsHeaders
      );
    }
  }
};

async function getStatus(env) {
  const fallback = {
    key: "online",
    emoji: "🟢",
    label: "Online",
    status: "🟢 Online",
    message: "DarkMode Customs™ is online and accepting orders.",
    updatedAt: null,
    updatedBy: "System"
  };

  const saved = await env.STATUS_KV.get("company_status");

  if (!saved) {
    return fallback;
  }

  try {
    return {
      ...fallback,
      ...JSON.parse(saved)
    };
  } catch {
    return fallback;
  }
}

function normalizeStatus(input) {
  if (!input) return null;

  const value = String(input).trim().toLowerCase();

  const map = {
    online: {
      key: "online",
      emoji: "🟢",
      label: "Online"
    },
    "🟢 online": {
      key: "online",
      emoji: "🟢",
      label: "Online"
    },
    green: {
      key: "online",
      emoji: "🟢",
      label: "Online"
    },
    maintenance: {
      key: "maintenance",
      emoji: "🟡",
      label: "Under Maintenance"
    },
    "under maintenance": {
      key: "maintenance",
      emoji: "🟡",
      label: "Under Maintenance"
    },
    "🟡 under maintenance": {
      key: "maintenance",
      emoji: "🟡",
      label: "Under Maintenance"
    },
    yellow: {
      key: "maintenance",
      emoji: "🟡",
      label: "Under Maintenance"
    },
    offline: {
      key: "offline",
      emoji: "🔴",
      label: "Offline"
    },
    "🔴 offline": {
      key: "offline",
      emoji: "🔴",
      label: "Offline"
    },
    red: {
      key: "offline",
      emoji: "🔴",
      label: "Offline"
    }
  };

  return map[value] || null;
}

function defaultMessage(key) {
  if (key === "online") {
    return "DarkMode Customs™ is online and accepting orders.";
  }

  if (key === "maintenance") {
    return "DarkMode Customs™ is currently under maintenance. Some services may be temporarily limited.";
  }

  if (key === "offline") {
    return "DarkMode Customs™ is currently offline. Updates will be posted when service returns.";
  }

  return "DarkMode Customs™ status has been updated.";
}

async function validateAdmin(request, body, env) {
  /*
    Optional security:
    - Add ADMIN_TOKEN as a Worker secret.
    - Your admin.html can send it as:
      header: X-Admin-Token
      or Authorization: Bearer YOUR_TOKEN
      or body.adminToken

    If ADMIN_TOKEN is not set, this Worker allows updates.
  */

  if (!env.ADMIN_TOKEN) {
    return {
      ok: true
    };
  }

  const headerToken = request.headers.get("X-Admin-Token");
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const bodyToken = body.adminToken || body.token || body.secret;

  const providedToken = headerToken || bearerToken || bodyToken;

  if (providedToken !== env.ADMIN_TOKEN) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized admin request."
    };
  }

  return {
    ok: true
  };
}

async function sendDiscordWebhook(env, statusData) {
  /*
    Required Worker secret:
    DISCORD_STATUS_WEBHOOK = your Discord company-status webhook URL
  */

  if (!env.DISCORD_STATUS_WEBHOOK) {
    return;
  }

  const colorMap = {
    online: 0x31ff9b,
    maintenance: 0xffd84d,
    offline: 0xff4d6d
  };

  const discordPayload = {
    username: "DarkMode Customs™ Status",
    avatar_url: "https://raw.githubusercontent.com/github/explore/main/topics/github/github.png",
    embeds: [
      {
        title: "DarkMode Customs™ Company Status Updated",
        description: `**Current Status:** ${statusData.status}\n\n${statusData.message}`,
        color: colorMap[statusData.key] || 0x00eaff,
        fields: [
          {
            name: "Website",
            value: "GitHub Pages",
            inline: true
          },
          {
            name: "Founder",
            value: "🪖𝕊𝔾𝕋. ℝℍ𝕀ℕ𝕆™",
            inline: true
          },
          {
            name: "Updated By",
            value: statusData.updatedBy || "DarkMode Customs™ Admin",
            inline: true
          }
        ],
        footer: {
          text: "DarkMode Customs™ • Company Status System"
        },
        timestamp: statusData.updatedAt
      }
    ]
  };

  await fetch(env.DISCORD_STATUS_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(discordPayload)
  });
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders
    }
  });
}
