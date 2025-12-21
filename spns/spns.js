(function(){
  const $ = (s, r=document) => r.querySelector(s);

  function pad(n){ return String(n).padStart(2,"0"); }
  function tickClock(){
    const d = new Date();
    const el = $("#netTime");
    if(!el) return;
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  const ticker = $("#ticker");
  const lines = [
    "Visitor advisory: Hydration strongly encouraged. Optimism also encouraged.",
    "Civic update: District NAS recalibration scheduled overnight.",
    "Utilities: LoneGrid reports stable conditions. Please refrain from panic.",
    "DoDE notice: Context handling standards updated for “clarity.”",
    "Public safety: Rangers presence increased for “visible comfort.”",
    "Investment office: Founder Fast-Track appointments available this week."
  ];
  let idx = 0;

  function renderTicker(){
    if(!ticker) return;
    const next = lines[idx % lines.length];
    idx += 1;

    const now = new Date();
    const stamp = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    ticker.innerHTML = `<div>[${stamp}] ${escapeHTML(next)}</div>` + ticker.innerHTML;
    const children = Array.from(ticker.children);
    if(children.length > 5) children.slice(5).forEach(n => n.remove());
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  renderTicker();
  setInterval(renderTicker, 2600);

  const happy = $("#happinessVal");
  const permits = $("#permitsVal");
  const grid = $("#gridVal");

  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function jitter(v, amt){ return v + (Math.random()*2-1)*amt; }

  let h = 92;
  let p = 4;
  let g = 99.4;

  function updateMetrics(){
    h = clamp(jitter(h, 1.2), 80, 99);
    p = Math.round(clamp(jitter(p, 0.8), 1, 18));
    g = clamp(jitter(g, 0.12), 96.5, 99.99);

    if(happy) happy.textContent = String(Math.round(h));
    if(permits) permits.textContent = String(p);
    if(grid) grid.textContent = g.toFixed(1);
  }

  setInterval(updateMetrics, 2200);

  const form = $("#citizenForm");
  const note = $("#applyNote");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if(note){
        note.textContent = "Application received. Screening: gentle, automated, non-optional.";
      }
      setTimeout(() => {
        if(note) note.textContent = "We respect privacy, within reason and policy.";
      }, 3200);
    });
  }
})();