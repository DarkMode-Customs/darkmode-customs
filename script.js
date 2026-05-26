const STATUS_ENDPOINT = "https://darkmode-customs-status.matthew-wellman.workers.dev/status";
const LOCAL_STATUS_STORAGE_KEY = "darkmode_customs_live_status";

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

const SALES_LABELS = {
  open: {
    key: "open",
    emoji: "🟢",
    label: "Sales Open",
    status: "🟢 Sales Open",
    message: "DarkMode Customs™ is accepting new orders. Submit the order form to start your build."
  },
  maintenance: {
    key: "maintenance",
    emoji: "🟡",
    label: "Sales Under Maintenance",
    status: "🟡 Sales Under Maintenance",
    message: "The sales desk is under maintenance. Orders may be delayed while systems are updated."
  },
  closed: {
    key: "closed",
    emoji: "🔴",
    label: "Sales Closed",
    status: "🔴 Sales Closed",
    message: "DarkMode Customs™ is not accepting new orders right now. Please check Discord for updates."
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
  const localStatus = getLocalStatusOverride();

  try {
    const response = await fetch(STATUS_ENDPOINT, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Status request failed: ${response.status}`);
    }

    const data = await response.json();
    const mergedData = mergeStatusWithLocalSales(data, localStatus);
    const cleanData = normalizeStatusData(mergedData);

    saveLocalStatusOverride(cleanData);
    return cleanData;
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
      return normalizeStatusData(mergeStatusWithLocalSales(fallbackData, localStatus));
    } catch {
      return normalizeStatusData(localStatus || {
        ...STATUS_LABELS.online,
        salesStatus: SALES_LABELS.open.key,
        salesMessage: SALES_LABELS.open.message
      });
    }
  }
}

function getLocalStatusOverride() {
  try {
    const saved = localStorage.getItem(LOCAL_STATUS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveLocalStatusOverride(statusData) {
  try {
    localStorage.setItem(LOCAL_STATUS_STORAGE_KEY, JSON.stringify(normalizeStatusData(statusData)));
  } catch {
    // Local storage is optional. The Cloudflare Worker remains the global source when available.
  }
}

function responseHasSalesStatus(data = {}) {
  return Boolean(
    data.salesStatus ||
      data.salesKey ||
      data.salesStatusText ||
      data.salesMessage ||
      data.salesLabel ||
      data.salesEmoji ||
      (data.sales && typeof data.sales === "object" && (data.sales.key || data.sales.status || data.sales.label || data.sales.message))
  );
}

function mergeStatusWithLocalSales(data = {}, localStatus = null) {
  if (!localStatus || responseHasSalesStatus(data)) {
    return data;
  }

  const localSales = normalizeSalesStatusData(localStatus);

  return {
    ...data,
    salesStatus: localSales.key,
    salesKey: localSales.key,
    salesEmoji: localSales.emoji,
    salesLabel: localSales.label,
    salesStatusText: localSales.status,
    salesMessage: localSales.message,
    sales: localSales
  };
}

function normalizeStatusData(data = {}) {
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
  const sales = normalizeSalesStatusData(data);

  return {
    ...base,
    ...data,
    key,
    emoji: data.emoji || base.emoji,
    label: data.label || base.label,
    status: data.status || `${data.emoji || base.emoji} ${data.label || base.label}`,
    message: data.message || base.message,
    sales
  };
}

function normalizeSalesStatusData(data = {}) {
  const salesObject = data.sales && typeof data.sales === "object" ? data.sales : {};
  const rawKey = String(
    data.salesKey ||
      data.salesStatus ||
      salesObject.key ||
      salesObject.status ||
      salesObject.label ||
      "open"
  ).toLowerCase();

  let key = "open";

  if (rawKey.includes("maintenance") || rawKey.includes("yellow")) {
    key = "maintenance";
  } else if (rawKey.includes("closed") || rawKey.includes("close") || rawKey.includes("offline") || rawKey.includes("red")) {
    key = "closed";
  } else if (rawKey.includes("open") || rawKey.includes("online") || rawKey.includes("green")) {
    key = "open";
  }

  const base = SALES_LABELS[key];

  return {
    ...base,
    ...salesObject,
    key,
    emoji: data.salesEmoji || salesObject.emoji || base.emoji,
    label: data.salesLabel || salesObject.label || base.label,
    status: data.salesStatusText || salesObject.status || `${data.salesEmoji || salesObject.emoji || base.emoji} ${data.salesLabel || salesObject.label || base.label}`,
    message: data.salesMessage || salesObject.message || base.message
  };
}

function applyStatusToPage(statusData) {
  const cleanStatus = normalizeStatusData(statusData);
  const salesStatus = cleanStatus.sales;

  document.querySelectorAll(".status-pill").forEach((badge) => {
    badge.dataset.status = cleanStatus.key;

    const text = badge.querySelector(".status-text");

    if (text) {
      text.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
    } else {
      badge.textContent = `${cleanStatus.emoji} ${cleanStatus.label}`;
    }
  });

  document.querySelectorAll(".sales-pill, [data-sales-status-display]").forEach((badge) => {
    badge.dataset.salesStatus = salesStatus.key;

    const text = badge.querySelector(".sales-text");

    if (text) {
      text.textContent = `${salesStatus.emoji} ${salesStatus.label}`;
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

  const salesTextIds = [
    "heroSalesStatusText",
    "homeSalesStatusText",
    "salesDeskStatusText",
    "panelSalesStatusText",
    "showroomSalesStatusText",
    "adminCurrentSalesStatus"
  ];

  salesTextIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = `${salesStatus.emoji} ${salesStatus.label}`;
  });

  const salesMessageIds = ["homeSalesMessage", "salesDeskMessage", "showroomSalesMessage", "adminSalesMessagePreview"];

  salesMessageIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = salesStatus.message;
  });

  document.querySelectorAll("[data-sales-status-display]").forEach((element) => {
    element.dataset.salesStatus = salesStatus.key;
  });

  document.querySelectorAll("[data-order-link]").forEach((link) => {
    link.dataset.salesStatus = salesStatus.key;

    if (salesStatus.key === "closed") {
      link.setAttribute("aria-label", "Sales are currently closed. Check Discord for updates.");
    } else if (salesStatus.key === "maintenance") {
      link.setAttribute("aria-label", "Sales are under maintenance. Order availability may be delayed.");
    } else {
      link.setAttribute("aria-label", "Start an order with DarkMode Customs.");
    }
  });

  const messageField = document.getElementById("statusMessage");

  if (messageField && !messageField.value.trim()) {
    messageField.placeholder = cleanStatus.message;
  }

  const salesMessageField = document.getElementById("salesStatusMessage");

  if (salesMessageField && !salesMessageField.value.trim()) {
    salesMessageField.placeholder = salesStatus.message;
  }

  document.querySelectorAll("[data-admin-status]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminStatus === cleanStatus.key);
  });

  document.querySelectorAll("[data-admin-sales-status]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminSalesStatus === salesStatus.key);
  });

  const selectedStatus = document.getElementById("selectedStatus");
  const selectedSalesStatus = document.getElementById("selectedSalesStatus");

  if (selectedStatus) {
    selectedStatus.value = cleanStatus.key;
  }

  if (selectedSalesStatus) {
    selectedSalesStatus.value = salesStatus.key;
  }
}

function initAdminPanel() {
  const form = document.getElementById("statusForm");

  if (!form) return;

  const statusInput = document.getElementById("selectedStatus");
  const salesStatusInput = document.getElementById("selectedSalesStatus");
  const tokenInput = document.getElementById("adminToken");
  const updatedByInput = document.getElementById("updatedBy");
  const messageInput = document.getElementById("statusMessage");
  const salesMessageInput = document.getElementById("salesStatusMessage");
  const statusButtons = document.querySelectorAll("[data-admin-status]");
  const salesStatusButtons = document.querySelectorAll("[data-admin-sales-status]");

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

  salesStatusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      salesStatusButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      if (salesStatusInput) {
        salesStatusInput.value = button.dataset.adminSalesStatus;
      }

      const preview = document.getElementById("adminSalesMessagePreview");
      const selected = normalizeSalesStatusData({ salesStatus: button.dataset.adminSalesStatus });

      if (preview) {
        preview.textContent = selected.message;
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedStatus = statusInput ? statusInput.value : "online";
    const selectedSalesStatus = salesStatusInput ? salesStatusInput.value : "open";
    const adminToken = tokenInput ? tokenInput.value.trim() : "";
    const updatedBy = updatedByInput ? updatedByInput.value.trim() : "DarkMode Customs™ Admin";
    const customMessage = messageInput ? messageInput.value.trim() : "";
    const customSalesMessage = salesMessageInput ? salesMessageInput.value.trim() : "";

    if (adminToken) {
      localStorage.setItem("darkmode_admin_token", adminToken);
    }

    const localPendingStatus = normalizeStatusData({
      key: selectedStatus,
      message: customMessage || STATUS_LABELS[selectedStatus]?.message,
      salesStatus: selectedSalesStatus,
      salesMessage: customSalesMessage || SALES_LABELS[selectedSalesStatus]?.message,
      updatedBy,
      updatedAt: new Date().toISOString()
    });

    saveLocalStatusOverride(localPendingStatus);
    applyStatusToPage(localPendingStatus);

    setAdminMessage("Updating company status, sales status, and Discord webhook...", "neutral");

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
          salesStatus: selectedSalesStatus,
          message: customMessage,
          salesMessage: customSalesMessage,
          updatedBy,
          adminToken
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Update failed with status ${response.status}`);
      }

      const cleanStatus = normalizeStatusData({
        ...data,
        salesStatus: data.salesStatus || data.salesKey || data.sales?.key || selectedSalesStatus,
        salesMessage: data.salesMessage || data.sales?.message || customSalesMessage || SALES_LABELS[selectedSalesStatus]?.message,
        sales: data.sales || normalizeSalesStatusData({
          salesStatus: selectedSalesStatus,
          salesMessage: customSalesMessage || SALES_LABELS[selectedSalesStatus]?.message
        })
      });

      saveLocalStatusOverride(cleanStatus);
      applyStatusToPage(cleanStatus);

      if (data.discord && data.discord.sent) {
        setAdminMessage(
          `Status updated successfully: ${cleanStatus.emoji} ${cleanStatus.label} · ${cleanStatus.sales.emoji} ${cleanStatus.sales.label}. Discord webhook sent.`,
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
          `Website status updated: ${cleanStatus.emoji} ${cleanStatus.label} · ${cleanStatus.sales.emoji} ${cleanStatus.sales.label}. Discord result unknown.`,
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
