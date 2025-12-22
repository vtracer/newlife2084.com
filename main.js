function applySeasonalTheme() {
  const month = new Date().getMonth(); // 0=Jan ... 11=Dec
  if (month === 11) document.body.setAttribute("data-theme", "corpo-xmas");
  else document.body.removeAttribute("data-theme");
}

function initFallingSpurs() {
  // Only run when the Christmas theme is active
  if (document.body.getAttribute("data-theme") !== "corpo-xmas") return;

  const wrap = document.getElementById("falling-spurs");
  if (!wrap) return;

  // Prevent duplicates if the page hot-reloads
  wrap.innerHTML = "";

  const svg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <g fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">
        <path d="M32 8v12"/><path d="M32 44v12"/>
        <path d="M8 32h12"/><path d="M44 32h12"/>
        <path d="M15 15l8 8"/><path d="M41 41l8 8"/>
        <path d="M49 15l-8 8"/><path d="M23 41l-8 8"/>
        <path d="M32 24l4 8-4 8-4-8z"/>
      </g>
    </svg>
  `)}`;

  const count = 24;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "spurflake";

    const size = 12 + Math.random() * 18; // 12–30px
    const x = Math.random() * 100;        // vw
    const o = 0.25 + Math.random() * 0.65;
    const d = 8 + Math.random() * 10;
    const d2 = 2.8 + Math.random() * 3.5;
    const d3 = 4 + Math.random() * 8;
    const drift = (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 35);
    const delay = Math.random() * 10;

    el.style.setProperty("--img", `url("${svg}")`);
    el.style.setProperty("--s", `${size}px`);
    el.style.setProperty("--x", `${x}vw`);
    el.style.setProperty("--o", `${o}`);
    el.style.setProperty("--d", `${d}s`);
    el.style.setProperty("--d2", `${d2}s`);
    el.style.setProperty("--d3", `${d3}s`);
    el.style.setProperty("--drift", `${drift}px`);
    el.style.setProperty("--delay", `-${delay}s`);

    wrap.appendChild(el);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Theme first
  applySeasonalTheme();

  // 2) Spurs (only if theme is Xmas)
  initFallingSpurs();

  // 3) Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, observerOptions);

  document.querySelectorAll(".section").forEach(section => observer.observe(section));

  // 4) Social share links
  const shareText =
    "I have chosen the side of Continuity. My consciousness is ready to outlive the flesh. No pain. No fear. Ever again. @newlife2084.com #NewLife2084 #maroonseries #PerpetuityGuaranteed";
  const encodedText = encodeURIComponent(shareText);

  const twitterBtn = document.getElementById("share-twitter");
  if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedText}`;

  const bskyBtn = document.getElementById("share-bsky");
  if (bskyBtn) bskyBtn.href = `https://bsky.app/intent/compose?text=${encodedText}`;
});