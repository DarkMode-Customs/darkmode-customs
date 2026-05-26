document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("animations-ready");

  const cursorDot = document.getElementById("cursorDot");
  const scrollProgress = document.getElementById("scrollProgress");
  const siteHeader = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const canvas = document.getElementById("cyberCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const companyStatusCard = document.getElementById("companyStatusCard");
  const companyStatusOrb = document.getElementById("companyStatusOrb");
  const companyStatusLabel = document.getElementById("companyStatusLabel");
  const companyStatusMessage = document.getElementById("companyStatusMessage");
  const companyOrdersStatus = document.getElementById("companyOrdersStatus");
  const companySupportStatus = document.getElementById("companySupportStatus");
  const companyResponseTime = document.getElementById("companyResponseTime");
  const companyStatusUpdated = document.getElementById("companyStatusUpdated");
  const hudStatusLabel = document.getElementById("hudStatusLabel");
  const hudStatusText = document.getElementById("hudStatusText");
  const headerStatusPill = document.getElementById("headerStatusPill");
  const headerStatusText = document.getElementById("headerStatusText");

  const WORKER_STATUS_URL =
    "https://darkmode-customs-status.matthew-wellman.workers.dev/status";

  const statusSettings = {
    online: {
      emoji: "🟢",
      label: "Online",
      message: "DarkMode Customs™ is currently online and accepting new orders.",
      orders: "Accepting Orders",
      support: "Active",
      responseTime: "Within 24 hours",
      hud: "ONLINE",
      hudText: "Ready for deployment",
    },
    maintenance: {
      emoji: "🟡",
      label: "Under Maintenance",
      message:
        "DarkMode Customs™ is currently under maintenance. Orders and support may be delayed.",
      orders: "Limited Availability",
      support: "Delayed",
      responseTime: "Longer than usual",
      hud: "MAINTENANCE",
      hudText: "Maintenance mode active",
    },
    offline: {
      emoji: "🔴",
      label: "Offline",
      message:
        "DarkMode Customs™ is currently offline. New orders are temporarily paused.",
      orders: "Closed",
      support: "Unavailable",
      responseTime: "Unavailable",
      hud: "OFFLINE",
      hudText: "Systems temporarily offline",
    },
    loading: {
      emoji: "⚪",
      label: "Checking",
      message: "Checking DarkMode Customs™ system status...",
      orders: "Checking...",
      support: "Checking...",
      responseTime: "Checking...",
      hud: "CHECKING",
      hudText: "Checking system status",
    },
  };

  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 680px)").matches;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let particles = [];

  function applyCompanyStatus(statusData = {}) {
    const statusKey = statusSettings[statusData.status]
      ? statusData.status
      : "online";

    const fallback = statusSettings[statusKey];

    const finalStatus = {
      ...fallback,
      ...statusData,
      status: statusKey,
    };

    document.body.dataset.companyStatus = finalStatus.status;

    if (companyStatusCard) {
      companyStatusCard.dataset.status = finalStatus.status;
    }

    if (companyStatusOrb) {
      companyStatusOrb.dataset.status = finalStatus.status;
    }

    if (headerStatusPill) {
      headerStatusPill.dataset.status = finalStatus.status;
    }

    if (companyStatusLabel) {
      companyStatusLabel.textContent = `${finalStatus.emoji} ${finalStatus.label}`;
    }

    if (companyStatusMessage) {
      companyStatusMessage.textContent = finalStatus.message;
    }

    if (companyOrdersStatus) {
      companyOrdersStatus.textContent = finalStatus.orders;
    }

    if (companySupportStatus) {
      companySupportStatus.textContent = finalStatus.support;
    }

    if (companyResponseTime) {
      companyResponseTime.textContent = finalStatus.responseTime;
    }

    if (companyStatusUpdated) {
      companyStatusUpdated.textContent = `Last Updated: ${
        finalStatus.lastUpdated || "Recently"
      }`;
    }

    if (hudStatusLabel) {
      hudStatusLabel.textContent = finalStatus.hud || finalStatus.label.toUpperCase();
    }

    if (hudStatusText) {
      hudStatusText.textContent = finalStatus.hudText || finalStatus.message;
    }

    if (headerStatusText) {
      headerStatusText.textContent = finalStatus.label;
    }
  }

  async function loadCompanyStatus() {
    try {
      const response = await fetch(`${WORKER_STATUS_URL}?cache=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Status endpoint could not be loaded.");
      }

      const statusData = await response.json();
      applyCompanyStatus(statusData);
    } catch (error) {
      console.warn("Company status fallback active:", error);
      applyCompanyStatus({
        status: "online",
        label: "Online",
        message: "DarkMode Customs™ is currently online.",
        lastUpdated: "Recently",
      });
    }
  }

  loadCompanyStatus();
  setInterval(loadCompanyStatus, 60000);

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
      "a, button, .tilt-card, .service-card, .price-card, .process-card, .founder-card, .final-card, .company-status-card, .showroom-card, .tech-frame, .preview-screen"
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

      const rotateY = (cardX / rect.width - 0.5) * 10;
      const rotateX = (cardY / rect.height - 0.5) * -10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
