document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("animations-ready");

  const cursorDot = document.getElementById("cursorDot");
  const scrollProgress = document.getElementById("scrollProgress");
  const siteHeader = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const canvas = document.getElementById("cyberCanvas");
  const ctx = canvas.getContext("2d");

  const siteStatusPill = document.getElementById("siteStatusPill");
  const mobileStatusPill = document.getElementById("mobileStatusPill");
  const statusLabel = document.getElementById("statusLabel");
  const mobileStatusLabel = document.getElementById("mobileStatusLabel");
  const statusPanel = document.getElementById("statusPanel");
  const statusPanelTitle = document.getElementById("statusPanelTitle");
  const statusPanelMessage = document.getElementById("statusPanelMessage");
  const hudStatusText = document.getElementById("hudStatusText");
  const terminalStatusText = document.getElementById("terminalStatusText");

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 680px)").matches;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let particles = [];

  const STATUS_CONFIG = {
    online: {
      className: "status-online",
      emoji: "🟢",
      label: "Online",
      hud: "ONLINE",
      terminal: "Ready for deployment",
      message: "DarkMode Customs™ is online and accepting new custom design requests.",
    },
    maintenance: {
      className: "status-maintenance",
      emoji: "🟡",
      label: "Under Maintenance",
      hud: "MAINTENANCE",
      terminal: "Maintenance in progress",
      message: "DarkMode Customs™ is currently under maintenance. Orders and support may be delayed.",
    },
    offline: {
      className: "status-offline",
      emoji: "🔴",
      label: "Offline",
      hud: "OFFLINE",
      terminal: "Operations paused",
      message: "DarkMode Customs™ is currently offline. New orders and support are temporarily unavailable.",
    },
  };

  function applyCompanyStatus(statusData = {}) {
    const key = String(statusData.status || "online").toLowerCase();
    const config = STATUS_CONFIG[key] || STATUS_CONFIG.online;
    const label = statusData.label || config.label;
    const emoji = statusData.emoji || config.emoji;
    const message = statusData.message || config.message;
    const classNames = ["status-online", "status-maintenance", "status-offline"];

    document.body.classList.remove(...classNames);
    document.body.classList.add(config.className);

    [siteStatusPill, mobileStatusPill, statusPanel].forEach((element) => {
      if (!element) return;
      element.classList.remove(...classNames);
      element.classList.add(config.className);
    });

    if (statusLabel) statusLabel.textContent = label;
    if (mobileStatusLabel) mobileStatusLabel.textContent = label;
    if (statusPanelTitle) statusPanelTitle.textContent = `${emoji} ${label}`;
    if (statusPanelMessage) statusPanelMessage.textContent = message;
    if (hudStatusText) hudStatusText.textContent = config.hud;
    if (terminalStatusText) terminalStatusText.textContent = statusData.terminal || config.terminal;
  }

  async function loadCompanyStatus() {
    try {
      const response = await fetch(`https://darkmode-customs-status.matthew-wellman.workers.dev/status?cache=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Status file not found");

      const statusData = await response.json();
      applyCompanyStatus(statusData);
    } catch (error) {
      applyCompanyStatus({ status: "online" });
    }
  }

  loadCompanyStatus();

  function moveCursor(event) {
    if (!cursorDot || isTouchDevice) return;

    mouseX = event.clientX;
    mouseY = event.clientY;

    cursorDot.classList.add("active");
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }

  function hideCursor() {
    if (!cursorDot || isTouchDevice) return;
    cursorDot.classList.remove("active");
  }

  function showCursor() {
    if (!cursorDot || isTouchDevice) return;
    cursorDot.classList.add("active");
  }

  if (!isTouchDevice && cursorDot) {
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseleave", hideCursor);
    window.addEventListener("mouseenter", showCursor);

    const hoverTargets = document.querySelectorAll(
      "a, button, .tilt-card, .service-card, .price-card, .process-card, .founder-card, .final-card"
    );

    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        cursorDot.classList.add("hovering");
      });

      target.addEventListener("mouseleave", () => {
        cursorDot.classList.remove("hovering");
      });
    });
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (siteHeader) {
      if (scrollTop > 30) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    }
  }

  window.addEventListener("scroll", updateScrollProgress);
  updateScrollProgress();

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
  }

  function createParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 11), 120);

    particles = Array.from({ length: count }, () => {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.36,
        vy: (Math.random() - 0.5) * 0.36,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.6 + 0.22,
      };
    });
  }

  function drawParticles() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) {
        particle.vx *= -1;
      }

      if (particle.y < 0 || particle.y > window.innerHeight) {
        particle.vy *= -1;
      }

      const mouseDistance = Math.hypot(mouseX - particle.x, mouseY - particle.y);

      if (!isTouchDevice && mouseDistance < 150) {
        const angle = Math.atan2(particle.y - mouseY, particle.x - mouseX);
        particle.x += Math.cos(angle) * 0.42;
        particle.y += Math.sin(angle) * 0.42;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(89, 247, 255, ${particle.alpha})`;
      ctx.shadowColor = "rgba(89, 247, 255, 0.9)";
      ctx.shadowBlur = 12;
      ctx.fill();

      for (let j = index + 1; j < particles.length; j++) {
        const other = particles[j];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

        if (distance < 125) {
          const opacity = (1 - distance / 125) * 0.18;

          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(89, 247, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  drawParticles();

  window.addEventListener("resize", resizeCanvas);

  const tiltCards = document.querySelectorAll(".tilt-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (isTouchDevice) return;

      const rect = card.getBoundingClientRect();
      const cardX = event.clientX - rect.left;
      const cardY = event.clientY - rect.top;

      const rotateY = ((cardX / rect.width) - 0.5) * 10;
      const rotateX = ((cardY / rect.height) - 0.5) * -10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
