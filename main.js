function pickThemeForToday() {
  const now = new Date();
  const y = now.getFullYear();

  const inRange = (start, end) => now >= start && now < end;

  const THEMES = [
    {
      name: "corpo-xmas",
      start: new Date(y, 11, 1),     // Dec 1
      end:   new Date(y + 1, 0, 1),  // Jan 1
      decorations: ["titleLights", "spurSnow"] // <- NOT always lights, just whatever you want
    },
    {
      name: "corpo-halloween",
      start: new Date(y, 9, 1),      // Oct 1
      end:   new Date(y, 10, 1),     // Nov 1
      decorations: ["titleGarland"]  // placeholder example
    },
    { name: "", start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1), decorations: [] }
  ];

  // Manual override for testing: ?theme=corpo-xmas
  const urlTheme = new URLSearchParams(location.search).get("theme");
  if (urlTheme) return THEMES.find(t => t.name === urlTheme) || { name: urlTheme, decorations: [] };

  return THEMES.find(t => t.name && inRange(t.start, t.end)) || THEMES[THEMES.length - 1];
}

function clearDecorations() {
  const layer = document.getElementById("decor-layer");
  if (layer) layer.innerHTML = "";
  document.querySelectorAll(".decor-slot").forEach(s => (s.innerHTML = ""));
}

const Decorations = {
  titleLights() {
  const slot = document.querySelector(".decor-slot--title");
  if (!slot) return;

  const wrap = document.createElement("div");
  wrap.className = "decor-lights";

  // ---- wire + sag settings ----
  const baseY = 14;   // where the wire starts (px)
  const sag = 12;     // slack amount (px). Increase for more droop.

  // Build a sagging wire as SVG so it scales cleanly
  const wireSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 32" preserveAspectRatio="none">
      <path d="M0 ${baseY} C 25 ${baseY + sag}, 75 ${baseY + sag}, 100 ${baseY}"
            fill="none" stroke="white" stroke-opacity="0.22" stroke-width="2"/>
    </svg>
  `)}`;

  const wire = document.createElement("div");
  wire.className = "decor-wire";
  wire.style.setProperty("--wire-bg", `url("${wireSvg}")`);
  // Make the wire element actually use the variable
  wire.style.backgroundImage = `url("${wireSvg}")`;

  wrap.appendChild(wire);

  // ---- bulbs ----
  const colors = ["#d4af37", "#1fbf7a", "#b0122a", "#ffffff"]; // corpo-xmas
  const bulbs = 18;

  for (let i = 0; i < bulbs; i++) {
    const t = bulbs === 1 ? 0.5 : i / (bulbs - 1); // 0..1 across the line

    // Match the same "droop" shape as the wire.
    // Sin curve reads very natural: 0 at ends, max in middle.
    const y = baseY + sag * Math.sin(Math.PI * t);

    const b = document.createElement("span");
    b.className = "decor-bulb";
    b.style.left = `${t * 100}%`;
    b.style.setProperty("--c", colors[i % colors.length]);
    b.style.setProperty("--y", `${y}px`);
    b.style.setProperty("--delay", `${Math.random() * 1.8}s`);
    b.style.setProperty("--dur", `${1.6 + Math.random() * 1.8}s`);

    wrap.appendChild(b);
  }

  slot.appendChild(wrap);
},

  spurSnow() {
    const layer = document.getElementById("decor-layer");
    if (!layer) return;

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

      const size = 12 + Math.random() * 18;
      const x = Math.random() * 100;
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

      layer.appendChild(el);
    }
  },

  // Placeholder: easy to add later
  titleGarland() {
    const slot = document.querySelector(".decor-slot--title");
    if (!slot) return;
    slot.innerHTML = `<div style="position:absolute;left:-8%;right:-8%;top:-34px;height:32px;opacity:.55;color:var(--accent);font-size:12px;letter-spacing:.2em;text-transform:uppercase;text-align:center;">
      SEASONAL COMPLIANCE DECOR PENDING
    </div>`;
  }
};

function initDecorationsForTheme() {
  clearDecorations();
  const picked = window.__DECOR__;
  if (!picked?.decorations?.length) return;

  picked.decorations.forEach(key => {
    if (typeof Decorations[key] === "function") Decorations[key]();
  });
}

function applySeasonalTheme() {
  const picked = pickThemeForToday();
  if (picked.name) document.body.setAttribute("data-theme", picked.name);
  else document.body.removeAttribute("data-theme");
  window.__DECOR__ = picked;
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
	initDecorationsForTheme();
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
  
  async function loadBlueskyFeed(handle = "newlife2084.com", limit = 6) {
  const statusEl = document.getElementById("signal-status");
  const feedEl = document.getElementById("bsky-feed");
  if (!feedEl) return;

  const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };

  try {
    setStatus("Link established. Decrypting…");

    // 1) Resolve handle -> profile (gives us DID + canonical handle)
    const profRes = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`
    );
    if (!profRes.ok) throw new Error("Profile fetch failed");
    const profile = await profRes.json();

    // 2) Get author feed (use DID if available)
    const actor = profile.did || profile.handle || handle;
    const feedRes = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(actor)}&limit=${limit}`
    );
    if (!feedRes.ok) throw new Error("Feed fetch failed");
    const data = await feedRes.json();

    const items = (data.feed || []).map(x => x.post).filter(Boolean);

    feedEl.innerHTML = "";

    for (const post of items) {
      const text = post.record?.text || "";
      const createdAt = post.record?.createdAt ? new Date(post.record.createdAt) : null;

      // at://did/app.bsky.feed.post/<rkey> -> https://bsky.app/profile/<handle>/post/<rkey>
      const uri = post.uri || "";
      const rkey = uri.split("/").pop();
      const postUrl = `https://bsky.app/profile/${profile.handle}/post/${rkey}`; // common web view pattern  [oai_citation:2‡GitHub](https://github.com/bluesky-social/atproto/discussions/2523?utm_source=chatgpt.com)

      const card = document.createElement("div");
      card.className = "signal-post";
      card.innerHTML = `
        <div class="signal-text">${escapeHtml(truncate(text, 280))}</div>
        <div class="signal-foot">
          <span>${createdAt ? createdAt.toLocaleString() : ""}</span>
          <a class="signal-link" href="${postUrl}" target="_blank" rel="noopener">View on Bluesky</a>
        </div>
      `;
      feedEl.appendChild(card);
    }

    setStatus(`Live from @${profile.handle} • last ${Math.min(limit, items.length)} posts`);
  } catch (err) {
    setStatus("Signal lost. Try again later.");
    feedEl.innerHTML = `<div class="signal-post"><div class="signal-text">No transmissions available.</div></div>`;
    console.error(err);
  }
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

  // 4) Social share links
  const shareText =
    "I have chosen the side of Continuity. My consciousness is ready to outlive the flesh. No pain. No fear. Ever again. @newlife2084.com #NewLife2084 #maroonseries #PerpetuityGuaranteed";
  const encodedText = encodeURIComponent(shareText);

  const twitterBtn = document.getElementById("share-twitter");
  if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedText}`;

  const bskyBtn = document.getElementById("share-bsky");
  if (bskyBtn) bskyBtn.href = `https://bsky.app/intent/compose?text=${encodedText}`;
});