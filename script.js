:root {
  --bg: #02040a;
  --bg-soft: #060914;
  --panel: rgba(8, 14, 28, 0.72);
  --panel-strong: rgba(10, 18, 38, 0.92);
  --line: rgba(98, 255, 255, 0.16);
  --line-strong: rgba(98, 255, 255, 0.34);
  --text: #eff7ff;
  --muted: #93a7bd;
  --cyan: #5ef7ff;
  --blue: #4a7dff;
  --violet: #9b5cff;
  --pink: #ff4fd8;
  --green: #68ffb8;
  --gold: #ffd56a;
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.65);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 18px;
  --max: 1180px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  background: var(--bg);
  cursor: none !important;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
  font-family: "Inter", sans-serif;
  background:
    radial-gradient(circle at 20% 15%, rgba(94, 247, 255, 0.12), transparent 28%),
    radial-gradient(circle at 80% 5%, rgba(155, 92, 255, 0.15), transparent 30%),
    radial-gradient(circle at 50% 90%, rgba(255, 79, 216, 0.1), transparent 30%),
    #02040a;
  color: var(--text);
  cursor: none !important;
}

a,
button,
input,
textarea,
select {
  cursor: none !important;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  border: 0;
  background: transparent;
  font-family: inherit;
}

img {
  max-width: 100%;
  display: block;
}

::selection {
  background: rgba(94, 247, 255, 0.35);
  color: white;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  background: var(--cyan);
  box-shadow:
    0 0 12px rgba(94, 247, 255, 0.95),
    0 0 32px rgba(94, 247, 255, 0.75),
    0 0 70px rgba(155, 92, 255, 0.55);
  transition:
    width 0.18s ease,
    height 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.cursor-dot.is-hovering {
  width: 22px;
  height: 22px;
  background: white;
  box-shadow:
    0 0 18px rgba(255, 255, 255, 0.9),
    0 0 45px rgba(94, 247, 255, 0.85),
    0 0 90px rgba(255, 79, 216, 0.65);
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  z-index: 99998;
  background: linear-gradient(90deg, var(--cyan), var(--violet), var(--pink), var(--gold));
  box-shadow: 0 0 24px rgba(94, 247, 255, 0.8);
}

.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: -5;
  pointer-events: none;
}

.page-grid {
  position: fixed;
  inset: 0;
  z-index: -4;
  pointer-events: none;
  opacity: 0.36;
  background-image:
    linear-gradient(rgba(94, 247, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 247, 255, 0.055) 1px, transparent 1px);
  background-size: 68px 68px;
  mask-image: radial-gradient(circle at center, black, transparent 78%);
}

.scanlines {
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  opacity: 0.12;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px,
    transparent 7px
  );
  animation: scanMove 9s linear infinite;
}

.page-glow {
  position: fixed;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.24;
  z-index: -6;
  pointer-events: none;
}

.page-glow-one {
  top: 10%;
  left: -120px;
  background: var(--cyan);
  animation: floatGlow 12s ease-in-out infinite;
}

.page-glow-two {
  right: -140px;
  bottom: 5%;
  background: var(--violet);
  animation: floatGlow 15s ease-in-out infinite reverse;
}

.site-header {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 1000;
  width: min(calc(100% - 32px), var(--max));
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 16px;
  border: 1px solid rgba(94, 247, 255, 0.18);
  border-radius: 999px;
  background: rgba(3, 7, 18, 0.62);
  backdrop-filter: blur(22px);
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.38);
  transition: 0.3s ease;
}

.site-header.scrolled {
  top: 10px;
  background: rgba(3, 7, 18, 0.86);
  border-color: rgba(94, 247, 255, 0.32);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-family: "Orbitron", sans-serif;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #001217;
  background: linear-gradient(135deg, var(--cyan), white, var(--violet));
  box-shadow:
    0 0 24px rgba(94, 247, 255, 0.75),
    inset 0 0 18px rgba(255, 255, 255, 0.6);
}

.brand-text {
  font-family: "Orbitron", sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.nav-links,
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-links a,
.nav-link-discord {
  padding: 10px 12px;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 700;
  transition: 0.25s ease;
}

.nav-links a:hover,
.nav-link-discord:hover {
  color: white;
  background: rgba(94, 247, 255, 0.08);
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 24px;
  overflow: hidden;
  border-radius: 999px;
  font-weight: 900;
  letter-spacing: -0.02em;
  isolation: isolate;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.btn::before {
  content: "";
  position: absolute;
  inset: -40%;
  z-index: -1;
  opacity: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.42), transparent);
  transform: translateX(-120%) rotate(15deg);
  transition: 0.5s ease;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn:hover::before {
  opacity: 1;
  transform: translateX(120%) rotate(15deg);
}

.btn-primary {
  color: #001117;
  background: linear-gradient(135deg, var(--cyan), white 48%, var(--violet));
  box-shadow:
    0 0 28px rgba(94, 247, 255, 0.42),
    0 16px 42px rgba(0, 0, 0, 0.44);
}

.btn-primary:hover {
  box-shadow:
    0 0 38px rgba(94, 247, 255, 0.62),
    0 0 70px rgba(155, 92, 255, 0.32),
    0 20px 50px rgba(0, 0, 0, 0.5);
}

.btn-secondary {
  color: white;
  border: 1px solid rgba(94, 247, 255, 0.24);
  background: rgba(255, 255, 255, 0.045);
}

.btn-secondary:hover {
  border-color: rgba(94, 247, 255, 0.55);
  background: rgba(94, 247, 255, 0.08);
  box-shadow: 0 0 30px rgba(94, 247, 255, 0.18);
}

.btn-small {
  min-height: 42px;
  padding: 0 18px;
  font-size: 0.85rem;
}

.mobile-toggle {
  display: none;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(94, 247, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
}

.mobile-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 4px auto;
  border-radius: 999px;
  background: white;
}

.mobile-menu {
  position: fixed;
  top: 90px;
  left: 50%;
  z-index: 999;
  width: min(calc(100% - 32px), 520px);
  padding: 18px;
  border: 1px solid rgba(94, 247, 255, 0.18);
  border-radius: 26px;
  background: rgba(3, 7, 18, 0.92);
  backdrop-filter: blur(24px);
  box-shadow: var(--shadow);
  transform: translateX(-50%) translateY(-18px);
  opacity: 0;
  pointer-events: none;
  transition: 0.25s ease;
}

.mobile-menu.open {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.mobile-menu a {
  display: block;
  padding: 14px 12px;
  border-radius: 16px;
  color: var(--muted);
  font-weight: 800;
}

.mobile-menu a:hover {
  color: white;
  background: rgba(94, 247, 255, 0.08);
}

.section {
  width: min(calc(100% - 32px), var(--max));
  margin-inline: auto;
  padding: 110px 0;
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  align-items: center;
  gap: 54px;
  min-height: 100vh;
  padding-top: 160px;
}

.eyebrow,
.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  color: var(--cyan);
  font-family: "Orbitron", sans-serif;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.live-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--green);
  box-shadow: 0 0 18px rgba(104, 255, 184, 0.9);
  animation: pulseDot 1.4s ease-in-out infinite;
}

.hero h1,
.section-heading h2,
.showcase-copy h2,
.founder-card h2,
.cta-box h2 {
  font-family: "Orbitron", sans-serif;
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.hero h1 {
  max-width: 820px;
  font-size: clamp(3.2rem, 8vw, 7.8rem);
  font-weight: 900;
}

.hero h1 span {
  display: block;
  color: transparent;
  background: linear-gradient(100deg, var(--cyan), white 38%, var(--pink), var(--gold));
  background-size: 220%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: textShine 6s ease-in-out infinite;
}

.hero-subtitle {
  max-width: 690px;
  margin-top: 26px;
  color: var(--muted);
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 40px;
}

.hero-stats div {
  padding: 18px;
  border: 1px solid rgba(94, 247, 255, 0.14);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(18px);
}

.hero-stats strong {
  display: block;
  margin-bottom: 6px;
  font-family: "Orbitron", sans-serif;
  font-size: 1.35rem;
  color: white;
}

.hero-stats span {
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.4;
}

.hero-visual {
  position: relative;
  min-height: 620px;
  display: grid;
  place-items: center;
}

.device-frame {
  position: relative;
  width: min(100%, 540px);
  min-height: 430px;
  padding: 14px;
  border: 1px solid rgba(94, 247, 255, 0.28);
  border-radius: 34px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent),
    rgba(7, 13, 26, 0.78);
  backdrop-filter: blur(28px);
  box-shadow:
    0 0 80px rgba(94, 247, 255, 0.12),
    0 35px 110px rgba(0, 0, 0, 0.78);
  transform-style: preserve-3d;
}

.device-topbar {
  display: flex;
  gap: 8px;
  padding: 8px 10px 14px;
}

.device-topbar span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
}

.device-topbar span:nth-child(1) {
  background: var(--pink);
}

.device-topbar span:nth-child(2) {
  background: var(--gold);
}

.device-topbar span:nth-child(3) {
  background: var(--green);
}

.device-screen {
  display: grid;
  grid-template-columns: 76px 1fr;
  min-height: 360px;
  overflow: hidden;
  border: 1px solid rgba(94, 247, 255, 0.16);
  border-radius: 24px;
  background:
    radial-gradient(circle at 70% 20%, rgba(155, 92, 255, 0.18), transparent 36%),
    radial-gradient(circle at 20% 70%, rgba(94, 247, 255, 0.14), transparent 40%),
    rgba(2, 5, 12, 0.96);
}

.screen-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 18px 0;
  border-right: 1px solid rgba(94, 247, 255, 0.12);
  background: rgba(255, 255, 255, 0.035);
}

.screen-sidebar div {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background:
    linear-gradient(135deg, rgba(94, 247, 255, 0.22), rgba(155, 92, 255, 0.12)),
    rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 18px rgba(94, 247, 255, 0.12);
}

.screen-main {
  padding: 20px;
}

.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  font-family: "Orbitron", sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
}

.screen-header small {
  padding: 6px 10px;
  border: 1px solid rgba(104, 255, 184, 0.3);
  border-radius: 999px;
  color: var(--green);
  background: rgba(104, 255, 184, 0.08);
  box-shadow: 0 0 22px rgba(104, 255, 184, 0.12);
}

.terminal-card {
  padding: 18px;
  border: 1px solid rgba(94, 247, 255, 0.16);
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.24);
}

.terminal-line {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  color: var(--muted);
  font-size: 0.86rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-line:last-child {
  border-bottom: 0;
}

.terminal-key {
  min-width: 72px;
  color: var(--cyan);
  font-family: "Orbitron", sans-serif;
  font-size: 0.72rem;
  font-weight: 900;
}

.holo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.holo-grid div {
  min-height: 76px;
  border: 1px solid rgba(94, 247, 255, 0.14);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(94, 247, 255, 0.1), rgba(155, 92, 255, 0.06)),
    rgba(255, 255, 255, 0.035);
  animation: holoPulse 4s ease-in-out infinite;
}

.holo-grid div:nth-child(2),
.holo-grid div:nth-child(5) {
  animation-delay: 1s;
}

.holo-grid div:nth-child(3),
.holo-grid div:nth-child(6) {
  animation-delay: 2s;
}

.device-glow {
  position: absolute;
  inset: 10%;
  z-index: -1;
  border-radius: 50%;
  background: rgba(94, 247, 255, 0.22);
  filter: blur(80px);
}

.floating-chip {
  position: absolute;
  padding: 12px 16px;
  border: 1px solid rgba(94, 247, 255, 0.22);
  border-radius: 999px;
  color: white;
  font-size: 0.82rem;
  font-weight: 900;
  background: rgba(8, 14, 28, 0.72);
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.38);
  animation: floatChip 5s ease-in-out infinite;
}

.chip-one {
  top: 90px;
  left: 10px;
}

.chip-two {
  right: 4px;
  top: 240px;
  animation-delay: 1.2s;
}

.chip-three {
  bottom: 95px;
  left: 70px;
  animation-delay: 2.2s;
}

.marquee-section {
  overflow: hidden;
  border-block: 1px solid rgba(94, 247, 255, 0.14);
  background: rgba(255, 255, 255, 0.025);
}

.marquee {
  display: flex;
  width: 100%;
  padding: 18px 0;
}

.marquee-track {
  display: flex;
  min-width: max-content;
  gap: 42px;
  padding-left: 42px;
  animation: marquee 24s linear infinite;
}

.marquee-track span {
  color: transparent;
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1rem, 2vw, 1.45rem);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  -webkit-text-stroke: 1px rgba(94, 247, 255, 0.5);
}

.section-heading {
  max-width: 760px;
  margin-bottom: 46px;
}

.section-heading h2,
.showcase-copy h2,
.founder-card h2,
.cta-box h2 {
  font-size: clamp(2.4rem, 5vw, 5rem);
  font-weight: 900;
}

.section-heading p,
.showcase-copy p,
.founder-card p,
.cta-box p {
  margin-top: 18px;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.8;
}

.service-grid,
.pricing-grid,
.process-grid {
  display: grid;
  gap: 18px;
}

.service-grid {
  grid-template-columns: repeat(4, 1fr);
}

.service-card,
.price-card,
.process-card,
.founder-card,
.cta-box,
.showcase-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(94, 247, 255, 0.15);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.075), transparent),
    rgba(7, 13, 26, 0.68);
  backdrop-filter: blur(24px);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.38);
}

.service-card::before,
.price-card::before,
.process-card::before,
.founder-card::before,
.cta-box::before,
.showcase-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent, rgba(94, 247, 255, 0.14), transparent);
  transform: translateX(-120%);
  transition: 0.7s ease;
}

.service-card:hover::before,
.price-card:hover::before,
.process-card:hover::before,
.founder-card:hover::before,
.cta-box:hover::before,
.showcase-panel:hover::before {
  transform: translateX(120%);
}

.service-card {
  min-height: 320px;
  padding: 26px;
  border-radius: var(--radius-lg);
  transform-style: preserve-3d;
}

.card-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 26px;
  border: 1px solid rgba(94, 247, 255, 0.22);
  border-radius: 18px;
  color: var(--cyan);
  font-size: 1.2rem;
  background: rgba(94, 247, 255, 0.07);
  box-shadow: inset 0 0 20px rgba(94, 247, 255, 0.1);
}

.service-card h3,
.price-card h3,
.process-card h3 {
  margin-bottom: 14px;
  font-family: "Orbitron", sans-serif;
  font-size: 1.15rem;
  line-height: 1.2;
}

.service-card p,
.process-card p,
.price-card li {
  color: var(--muted);
  line-height: 1.7;
  font-size: 0.95rem;
}

.showcase-panel {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 32px;
  align-items: center;
  min-height: 620px;
  padding: clamp(28px, 5vw, 56px);
  border-radius: var(--radius-xl);
}

.feature-list {
  display: grid;
  gap: 14px;
  margin-top: 26px;
}

.feature-list div {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 800;
}

.feature-list span {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--cyan);
  box-shadow: 0 0 18px rgba(94, 247, 255, 0.8);
}

.showcase-display {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 480px;
  border-radius: 30px;
  background:
    radial-gradient(circle at center, rgba(94, 247, 255, 0.16), transparent 36%),
    radial-gradient(circle at center, rgba(155, 92, 255, 0.12), transparent 56%),
    rgba(0, 0, 0, 0.18);
  transform-style: preserve-3d;
}

.orbital-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(94, 247, 255, 0.25);
}

.ring-one {
  width: 310px;
  height: 310px;
  animation: rotate 12s linear infinite;
}

.ring-two {
  width: 230px;
  height: 230px;
  border-color: rgba(255, 79, 216, 0.28);
  animation: rotate 9s linear infinite reverse;
}

.ring-three {
  width: 390px;
  height: 390px;
  border-color: rgba(255, 213, 106, 0.18);
  animation: rotate 18s linear infinite;
}

.orbital-ring::after {
  content: "";
  position: absolute;
  top: 12%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--cyan);
  box-shadow: 0 0 22px rgba(94, 247, 255, 0.9);
}

.core-orb {
  position: relative;
  display: grid;
  place-items: center;
  width: 152px;
  height: 152px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, white, var(--cyan) 28%, var(--violet) 70%);
  box-shadow:
    0 0 60px rgba(94, 247, 255, 0.5),
    0 0 120px rgba(155, 92, 255, 0.35);
}

.core-orb span {
  color: #001117;
  font-family: "Orbitron", sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.data-pill {
  position: absolute;
  padding: 12px 16px;
  border: 1px solid rgba(94, 247, 255, 0.24);
  border-radius: 999px;
  color: white;
  font-size: 0.82rem;
  font-weight: 900;
  background: rgba(8, 14, 28, 0.72);
  backdrop-filter: blur(18px);
}

.data-pill-one {
  top: 72px;
  left: 44px;
}

.data-pill-two {
  right: 50px;
  top: 160px;
}

.data-pill-three {
  bottom: 88px;
  left: 110px;
}

.process-grid {
  grid-template-columns: repeat(4, 1fr);
}

.process-card {
  min-height: 240px;
  padding: 26px;
  border-radius: var(--radius-lg);
}

.process-card span {
  display: block;
  margin-bottom: 42px;
  color: transparent;
  font-family: "Orbitron", sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  -webkit-text-stroke: 1px rgba(94, 247, 255, 0.5);
}

.pricing-grid {
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
}

.price-card {
  padding: 28px;
  border-radius: var(--radius-xl);
  transform-style: preserve-3d;
}

.price-card.featured {
  border-color: rgba(94, 247, 255, 0.36);
  box-shadow:
    0 0 80px rgba(94, 247, 255, 0.14),
    0 28px 90px rgba(0, 0, 0, 0.48);
}

.featured-badge {
  display: inline-flex;
  margin-bottom: 20px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #001117;
  background: linear-gradient(135deg, var(--cyan), white);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.price-top p {
  margin-top: 6px;
  color: var(--muted);
}

.price {
  margin: 32px 0 24px;
  font-family: "Orbitron", sans-serif;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.price-card ul {
  display: grid;
  gap: 12px;
  margin-bottom: 28px;
  list-style: none;
}

.price-card li {
  position: relative;
  padding-left: 24px;
}

.price-card li::before {
  content: "";
  position: absolute;
  top: 11px;
  left: 0;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--cyan);
  box-shadow: 0 0 14px rgba(94, 247, 255, 0.8);
}

.price-card .btn {
  width: 100%;
}

.founder-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
  padding: clamp(28px, 5vw, 48px);
  border-radius: var(--radius-xl);
}

.founder-mark {
  display: grid;
  place-items: center;
  width: 94px;
  height: 94px;
  border: 1px solid rgba(94, 247, 255, 0.25);
  border-radius: 30px;
  font-size: 2.2rem;
  background: rgba(94, 247, 255, 0.07);
  box-shadow: inset 0 0 30px rgba(94, 247, 255, 0.12);
}

.final-cta {
  padding-top: 40px;
}

.cta-box {
  padding: clamp(34px, 7vw, 74px);
  border-radius: var(--radius-xl);
  text-align: center;
  background:
    radial-gradient(circle at 50% 0%, rgba(94, 247, 255, 0.16), transparent 44%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.075), transparent),
    rgba(7, 13, 26, 0.75);
}

.cta-box .hero-actions {
  justify-content: center;
}

.site-footer {
  width: min(calc(100% - 32px), var(--max));
  margin: 0 auto;
  padding: 36px 0 52px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid rgba(94, 247, 255, 0.14);
  color: var(--muted);
}

.site-footer strong {
  display: block;
  margin-bottom: 8px;
  color: white;
  font-family: "Orbitron", sans-serif;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-links a {
  color: var(--muted);
  font-weight: 800;
  transition: 0.25s ease;
}

.footer-links a:hover {
  color: var(--cyan);
}

.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.tilt-card {
  transition: transform 0.18s ease, border-color 0.25s ease;
}

.tilt-card:hover {
  border-color: rgba(94, 247, 255, 0.36);
}

@keyframes scanMove {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(80px);
  }
}

@keyframes floatGlow {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(60px, -50px, 0) scale(1.14);
  }
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.55;
    transform: scale(1.6);
  }
}

@keyframes textShine {
  0%,
  100% {
    background-position: 0% center;
  }

  50% {
    background-position: 100% center;
  }
}

@keyframes holoPulse {
  0%,
  100% {
    opacity: 0.72;
    transform: translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-6px);
  }
}

@keyframes floatChip {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-14px);
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1050px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 150px;
  }

  .hero-visual {
    min-height: auto;
  }

  .service-grid,
  .process-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .showcase-panel,
  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .founder-card {
    grid-template-columns: 1fr;
  }

  .nav-links,
  .nav-actions {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }
}

@media (max-width: 680px) {
  html,
  body,
  a,
  button,
  input,
  textarea,
  select {
    cursor: auto !important;
  }

  .cursor-dot {
    display: none;
  }

  .site-header {
    top: 12px;
    border-radius: 24px;
  }

  .brand-text {
    font-size: 0.76rem;
  }

  .brand-mark {
    width: 38px;
    height: 38px;
  }

  .section {
    padding: 82px 0;
  }

  .hero {
    padding-top: 130px;
  }

  .hero-stats,
  .service-grid,
  .process-grid {
    grid-template-columns: 1fr;
  }

  .device-screen {
    grid-template-columns: 56px 1fr;
  }

  .screen-sidebar div {
    width: 30px;
    height: 30px;
    border-radius: 11px;
  }

  .holo-grid {
    grid-template-columns: 1fr 1fr;
  }

  .floating-chip,
  .data-pill {
    display: none;
  }

  .showcase-display {
    min-height: 360px;
  }

  .ring-one {
    width: 230px;
    height: 230px;
  }

  .ring-two {
    width: 170px;
    height: 170px;
  }

  .ring-three {
    width: 290px;
    height: 290px;
  }

  .site-footer {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
