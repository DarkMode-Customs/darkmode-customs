const body = document.body;
const progressBar = document.querySelector(".page-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const mobileToggle = document.querySelector(".mobile-toggle");
const navLinks = document.querySelector(".nav-links");
const navCta = document.querySelector(".nav-cta");
const particleField = document.querySelector(".particle-field");
const revealElements = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");
const assetNodes = document.querySelectorAll("[data-asset-candidates]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

if (finePointer.matches) {
  body.classList.add("has-fine-pointer");
}

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });

if (cursorGlow && finePointer.matches && !prefersReducedMotion.matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
}

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = mobileToggle.classList.toggle("active");
    navLinks.classList.toggle("active", isOpen);
    body.classList.toggle("nav-open", isOpen);
    mobileToggle.setAttribute("aria-expanded", String(isOpen));

    if (navCta) {
      navCta.classList.toggle("mobile-visible", isOpen);
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileToggle.classList.remove("active");
      navLinks.classList.remove("active");
      body.classList.remove("nav-open");
      mobileToggle.setAttribute("aria-expanded", "false");

      if (navCta) {
        navCta.classList.remove("mobile-visible");
      }
    });
  });
}

if (revealElements.length) {
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
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (magneticItems.length && finePointer.matches && !prefersReducedMotion.matches) {
  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;

      item.style.setProperty("--magnet-x", `${offsetX * 0.08}px`);
      item.style.setProperty("--magnet-y", `${offsetY * 0.08}px`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--magnet-x", "0px");
      item.style.setProperty("--magnet-y", "0px");
    });
  });
}

if (particleField && !prefersReducedMotion.matches) {
  for (let index = 0; index < 36; index += 1) {
    const particle = document.createElement("span");
    const size = Math.random() * 2.6 + 1;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 12;
    const left = Math.random() * 100;
    const opacity = Math.random() * 0.35 + 0.12;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.opacity = opacity.toFixed(2);
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    particleField.appendChild(particle);
  }
}

function loadAsset(container) {
  const candidates = (container.dataset.assetCandidates || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!candidates.length) {
    return;
  }

  const trySource = (index) => {
    if (index >= candidates.length) {
      return;
    }

    const source = candidates[index];
    const testImage = new Image();

    testImage.onload = () => {
      const image = document.createElement("img");
      image.className = "asset-image";
      image.loading = "lazy";
      image.src = source;

      if (container.dataset.assetRole === "laptop") {
        image.alt = "Laptop preview of a DarkMode Customs theme";
      } else {
        image.alt = "Premium DarkMode Customs Discord preview";
      }

      container.appendChild(image);
      requestAnimationFrame(() => container.classList.add("asset-loaded"));
    };

    testImage.onerror = () => trySource(index + 1);
    testImage.src = source;
  };

  trySource(0);
}

assetNodes.forEach(loadAsset);
