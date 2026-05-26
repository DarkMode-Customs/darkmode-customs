const STATUS_ENDPOINT = "https://darkmode-customs-status.matthew-wellman.workers.dev/status";

const STATUS_LABELS = {
  online: {
    key: "online",
    emoji: "🟢",
    label: "Online",
    status: "🟢 Online",
    message: "DarkMode Customs™ is online and accepting orders."
  },
  maintenance: {
    key: "maintenance",
    emoji: "🟡",
    label: "Under Maintenance",
    status: "🟡 Under Maintenance",
    message: "DarkMode Customs™ is currently under maintenance. Some services may be temporarily limited."
  },
  offline: {
    key: "offline",
    emoji: "🔴",
    label: "Offline",
    status: "🔴 Offline",
    message: "DarkMode Customs™ is currently offline. Updates will be posted when service returns."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initCursor();
  initScrollProgress();
  initMobileMenu();
  initRevealAnimations();
  initShowroomFilters();
  initAdminPanel();
  loadCompanyStatus();
});

function initYear() {
  const yearElements = document.querySelectorAll("#year");

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function initCursor() {
  const cursor = document.getElementById("cursorDot");

  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  window.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });

  const hoverSelectors = "a, button, input, textarea, select, .showroom-card, .service-card, .price-card";

  document.querySelectorAll(hoverSelectors).forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.26;
    cursorY += (mouseY - cursorY) * 0.26;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

function initScrollProgress() {
  const progress = document.getElementById("scrollProgress");

  if (!progress) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressWidth = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progress.style.width = `${progressWidth}%`;
  };

  updateProgress();

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".mobile-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    toggle.classList.toggle("active");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      toggle.classList.remove("active");
    });
  });
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    observer.observe(element);
  });
}

function initShowroomFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.classList.remove("hidden-by-filter");
        } else {
          card.classList.add("hidden-by-filter");
        }
      });
    });
  });
}

async function loadCompanyStatus() {
  const statusData = await fetchCompanyStatus();
  applyStatusToPage(statusData);
}

async function fetchCompanyStatus() {
  try {
    const response = await fetch(STATUS_ENDPOINT, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Status request failed: ${response.status}`);
    }

    const data = await response.json();
    return normalizeStatusData(data);
  } catch {
    try {
      const fallbackResponse = await fetch("status.json", {
        method: "GET",
        cache: "no-store"
      });

      if (!fallbackResponse.ok) {
        throw new Error("Local fallback failed.");
      }

      const fallbackData = await fallbackResponse.json();
      return normalizeStatusData(fallbackData);
    } catch {
      return STATUS_LABELS.online;
    }
  }
}

function normalizeStatusData(data) {
  const rawKey = String(data.key || data.status || "online").toLowerCase();

  let key = "online";

  if (rawKey.includes("maintenance") || rawKey.includes("yellow")) {
    key = "maintenance";
  } else if (rawKey.includes("offline") || rawKey.includes("red")) {
    key = "offline";
  } else if (rawKey.includes("online") || rawKey.includes("green")) {
    key = "online";
  }

  const base = STATUS_LABELS[key];

  return {
    ...base,
    ...data,
    key,
    emoji: data.emoji || base.emoji,
    label: data.label || base.label,
    status: data.status || `${data.emoji || base.emoji} ${data.label || base.label}`,
    message: data.message || base.message
  };
}

function applyStatusToPage(statusData) {
  const cleanStatus = normalizeStatusData(statusData);

  document.querySelectorAll(".status-pill").forEach((badge) => {
    badge.dataset.status = cleanStatus.key;

    const text = badge.querySelector(".status-text");

    if (text) {
      text.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
    } else {
      badge.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
    }
  });

  const heroStatusText = document.getElementById("heroStatusText");
  const panelStatusText = document.getElementById("panelStatusText");
  const showroomStatusText = document.getElementById("showroomStatusText");
  const adminCurrentStatus = document.getElementById("adminCurrentStatus");

  if (heroStatusText) heroStatusText.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
  if (panelStatusText) panelStatusText.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
  if (showroomStatusText) showroomStatusText.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
  if (adminCurrentStatus) adminCurrentStatus.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;

  const messageField = document.getElementById("statusMessage");

  if (messageField && !messageField.value.trim()) {
    messageField.placeholder = cleanStatus.message;
  }

  document.querySelectorAll("[data-admin-status]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminStatus === cleanStatus.key);
  });

  const selectedStatus = document.getElementById("selectedStatus");

  if (selectedStatus) {
    selectedStatus.value = cleanStatus.key;
  }
}

function initAdminPanel() {
  const form = document.getElementById("statusForm");

  if (!form) return;

  const statusInput = document.getElementById("selectedStatus");
  const tokenInput = document.getElementById("adminToken");
  const updatedByInput = document.getElementById("updatedBy");
  const messageInput = document.getElementById("statusMessage");
  const statusButtons = document.querySelectorAll("[data-admin-status]");

  const savedToken = localStorage.getItem("darkmode_admin_token");

  if (savedToken && tokenInput) {
    tokenInput.value = savedToken;
  }

  statusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      statusButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      if (statusInput) {
        statusInput.value = button.dataset.adminStatus;
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedStatus = statusInput ? statusInput.value : "online";
    const adminToken = tokenInput ? tokenInput.value.trim() : "";
    const updatedBy = updatedByInput ? updatedByInput.value.trim() : "DarkMode Customs™ Admin";
    const customMessage = messageInput ? messageInput.value.trim() : "";

    if (adminToken) {
      localStorage.setItem("darkmode_admin_token", adminToken);
    }

    setAdminMessage("Updating company status and Discord webhook...", "neutral");

    try {
      const headers = {
        "Content-Type": "application/json"
      };

      if (adminToken) {
        headers["X-Admin-Token"] = adminToken;
      }

      const response = await fetch(STATUS_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          status: selectedStatus,
          message: customMessage,
          updatedBy,
          adminToken
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Update failed with status ${response.status}`);
      }

      const cleanStatus = normalizeStatusData(data);

      applyStatusToPage(cleanStatus);

      if (data.discord && data.discord.sent) {
        setAdminMessage(
          `Status updated successfully: ${cleanStatus.emoji} ${cleanStatus.label}. Discord webhook sent.`,
          "success"
        );
      } else if (data.discord && data.discord.status === "skipped") {
        setAdminMessage(
          `Website status updated, but Discord was skipped: ${data.discord.reason}`,
          "error"
        );
      } else if (data.discord && data.discord.status === "failed") {
        setAdminMessage(
          `Website status updated, but Discord failed: ${data.discord.details || data.discord.reason || "Unknown Discord webhook error."}`,
          "error"
        );
      } else {
        setAdminMessage(
          `Website status updated: ${cleanStatus.emoji} ${cleanStatus.label}. Discord result unknown.`,
          "error"
        );
      }
    } catch (error) {
      setAdminMessage(error.message || "Unable to update status.", "error");
    }
  });
}

function setAdminMessage(message, type) {
  const adminMessage = document.getElementById("adminMessage");

  if (!adminMessage) return;

  adminMessage.classList.remove("success", "error");

  if (type === "success") {
    adminMessage.classList.add("success");
  }

  if (type === "error") {
    adminMessage.classList.add("error");
  }

  adminMessage.textContent = message;
}
