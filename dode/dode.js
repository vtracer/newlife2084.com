(() => {
  const todayEls = document.querySelectorAll("[data-today]");
  if (todayEls.length) {
    const d = new Date();
    const fmt = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    todayEls.forEach(el => (el.textContent = fmt));
  }

  // Wire this to a real search later if wanted.
  const form = document.getElementById("siteSearch");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (form.querySelector("input")?.value || "").trim();
      if (!q) return;

      const target = document.getElementById("advisories");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();