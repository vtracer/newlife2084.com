(() => {
  // Set "Updated Today" date in a stable, non-annoying way.
  const todayEls = document.querySelectorAll("[data-today]");
  if (todayEls.length) {
    const d = new Date();
    const fmt = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    todayEls.forEach(el => (el.textContent = fmt));
  }

  // Search is a stub: keeps the form from navigating away.
  // You can wire this to a real search later.
  const form = document.getElementById("siteSearch");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (form.querySelector("input")?.value || "").trim();
      if (!q) return;

      // Minimal behavior: jump to advisories section so it feels like "results".
      const target = document.getElementById("advisories");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();