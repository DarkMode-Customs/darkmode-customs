const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursorDot) {
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;

  if (cursorRing) {
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll("a, button, .tilt-card, .magnetic").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    cursorRing?.classList.add("active");
  });

  item.addEventListener("mouseleave", () => {
    cursorRing?.classList.remove("active");
  });
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * 0.15}px, ${y * 0.18}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "translate(0, 0)";
  });
});

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
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -7;
    const rotateY = ((x / rect.width) - 0.5) * 7;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 1250;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);

      counter.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statObserver.disconnect();
      }
    });
  },
  { threshold: 0.35 }
);

const stats = document.querySelector(".hero-stats");

if (stats) {
  statObserver.observe(stats);
}

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((item) => item.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(target)?.classList.add("active");
  });
});

const image = document.querySelector(".monitor-screen img");
const fallback = document.querySelector(".screen-fallback");

if (image && fallback) {
  image.addEventListener("error", () => {
    image.style.display = "none";
    fallback.style.display = "block";
  });

  image.addEventListener("load", () => {
    fallback.style.display = "none";
  });
}

const canvas = document.getElementById("techCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let sparks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  createParticles();
}

function createParticles() {
  const count = Math.min(Math.floor(window.innerWidth / 8), 170);

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    size: Math.random() * 1.7 + 0.5,
    alpha: Math.random() * 0.52 + 0.15,
  }));
}

function addSpark(x, y) {
  if (prefersReducedMotion) return;

  for (let i = 0; i < 4; i++) {
    sparks.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      life: 1,
      size: Math.random() * 2 + 1,
    });
  }

  if (sparks.length > 90) {
    sparks.splice(0, sparks.length - 90);
  }
}

let lastSpark = 0;

window.addEventListener("mousemove", (event) => {
  const now = performance.now();

  if (now - lastSpark > 40) {
    addSpark(event.clientX, event.clientY);
    lastSpark = now;
  }
});

function drawCanvas() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const gradient = ctx.createRadialGradient(
    mouseX,
    mouseY,
    0,
    mouseX,
    mouseY,
    Math.max(window.innerWidth, window.innerHeight) * 0.62
  );

  gradient.addColorStop(0, "rgba(99, 247, 255, 0.085)");
  gradient.addColorStop(0.34, "rgba(183, 92, 255, 0.04)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    const dxMouse = mouseX - particle.x;
    const dyMouse = mouseY - particle.y;
    const mouseDistance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

    if (mouseDistance < 145) {
      particle.x -= dxMouse * 0.003;
      particle.y -= dyMouse * 0.003;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99, 247, 255, ${particle.alpha})`;
    ctx.shadowColor = "rgba(99, 247, 255, 0.9)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    for (let j = index + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 110) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(99, 247, 255, ${0.1 * (1 - distance / 110)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  sparks.forEach((spark, index) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.life -= 0.025;

    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 79, 216, ${Math.max(spark.life, 0)})`;
    ctx.shadowColor = "rgba(255, 79, 216, 0.9)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (spark.life <= 0) {
      sparks.splice(index, 1);
    }
  });

  requestAnimationFrame(drawCanvas);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

if (!prefersReducedMotion) {
  drawCanvas();
}
