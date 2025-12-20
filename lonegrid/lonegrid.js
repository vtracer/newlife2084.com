(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // --- clock ---
  function pad(n){ return String(n).padStart(2,"0"); }
  function tickClock(){
    const d = new Date();
    const t = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const el = $("#netTime");
    if(el) el.textContent = t;
  }
  tickClock();
  setInterval(tickClock, 1000);

  // --- synthetic status numbers ---
  const state = {
    load: 71.2,
    reserves: 18.4,
    latency: 22,
    contUptime: 99.94,
    drift: 0.02,
    idOps: 340,
    revokes: 2,
    peering: "STABLE",
    dispatch: "AUTO",
    frictionYield: 420,
		frictionIndex: 62,
  };

  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function jitter(v, amt){ return v + (Math.random()*2-1)*amt; }

  function updateStatus(){
    state.load = clamp(jitter(state.load, 1.8), 42, 96);
    state.reserves = clamp(jitter(state.reserves, 1.2), 4, 30);
    state.latency = Math.round(clamp(jitter(state.latency, 3.0), 12, 95));

    state.drift = clamp(jitter(state.drift, 0.03), 0, 0.8);
    state.idOps = Math.round(clamp(jitter(state.idOps, 25), 120, 980));
    state.revokes = Math.max(0, Math.round(jitter(state.revokes, 1)));
    
    state.frictionIndex = Math.round(clamp(jitter(state.frictionIndex, 3.5), 15, 95));
		state.frictionYield = Math.round(clamp((state.load * 6.2) + ((30 - state.reserves) * 9.5) + (state.frictionIndex * 4.1), 120, 980));

    // badges
    const loadBadge = $("#badgeLoad");
    const routeBadge = $("#badgeRoute");
    const contBadge = $("#badgeCont");
    const idBadge = $("#badgeId");
    const overall = $("#overallPill");

    // Load badge
    setBadge(loadBadge, state.load < 86 ? "OK" : state.load < 93 ? "MONITOR" : "DEGRADED",
      state.load < 86 ? "ok" : state.load < 93 ? "warn" : "down");

    // Routing badge
    setBadge(routeBadge, state.latency < 55 ? "OK" : state.latency < 75 ? "MONITOR" : "DEGRADED",
      state.latency < 55 ? "ok" : state.latency < 75 ? "warn" : "down");

    // Continuity badge
    const contClass = state.drift < 0.18 ? "warn" : "down";
    setBadge(contBadge, state.drift < 0.18 ? "MONITOR" : "DEGRADED", contClass);

    // Identity badge
    setBadge(idBadge, state.revokes < 6 ? "OK" : "MONITOR", state.revokes < 6 ? "ok" : "warn");

    // overall pill: degrade if anything is "down"
    const anyDown = [loadBadge, routeBadge, contBadge, idBadge].some(b => b && b.classList.contains("down"));
    const anyWarn = [loadBadge, routeBadge, contBadge, idBadge].some(b => b && b.classList.contains("warn"));
    if(overall){
      overall.classList.remove("ok","warn","danger");
      if(anyDown){
        overall.classList.add("danger");
        overall.textContent = "DEGRADED";
      }else if(anyWarn){
        overall.classList.add("warn");
        overall.textContent = "MONITORING";
      }else{
        overall.classList.add("ok");
        overall.textContent = "OPERATIONAL";
      }
    }

    // numbers
    text("#gridLoad", `${state.load.toFixed(1)}%`);
    text("#routeLatency", `${state.latency}ms`);
    text("#contUptime", `${state.contUptime.toFixed(2)}%`);
    text("#drift", `${state.drift.toFixed(2)}%`);
    text("#idOps", `${state.idOps}/s`);
    text("#revokes", `${state.revokes}`);
    text("#peering", state.peering);
    text("#dispatchMode", state.dispatch);

    const loadLine = $("#loadLine");
    if(loadLine){
      loadLine.textContent = `LOAD: ${state.load.toFixed(1)}% • RESERVES: ${state.reserves.toFixed(1)}% • LATENCY: ${state.latency}ms`;
    }
  }

  function text(sel, val){
    const el = $(sel);
    if(el) el.textContent = val;
  }

  function setBadge(el, label, cls){
    if(!el) return;
    el.textContent = label;
    el.classList.remove("ok","warn","down");
    el.classList.add(cls);
  }

  updateStatus();
  setInterval(updateStatus, 2400);

  // --- outage list (filterable) ---
  const outages = [
    {
      kind: "backbone",
      title: "Metro Ring 3 • jitter observed",
      region: "AUS-MR3",
      level: "warn",
      desc: "Peering normalization in progress. Brief latency spikes possible during inspection."
    },
    {
      kind: "power",
      title: "District Load Shed • rotating",
      region: "SPNS-12",
      level: "warn",
      desc: "Demand exceeds reserve targets. Dispatch algorithm initiating short cycle reductions."
    },
    {
      kind: "continuity",
      title: "Continuity Rail • session drift",
      region: "CR-ESCROW",
      level: "warn",
      desc: "Some sessions may re-authenticate under stability checks. No action required. (Sure.)"
    },
    {
      kind: "identity",
      title: "Identity Relay • revocation burst",
      region: "ID-RELAY-01",
      level: "warn",
      desc: "Atypical revocation pattern detected. Compliance review scheduled."
    },
    {
      kind: "backbone",
      title: "Route flap • edge node",
      region: "EDGE-07",
      level: "down",
      desc: "Interruption confirmed. Traffic rerouting in effect. Estimated restoration: unknown."
    }
  ];

  function pillHTML(level){
    if(level === "down") return `<span class="pill danger rowpill">INTERRUPTION</span>`;
    if(level === "warn") return `<span class="pill warn rowpill">DEGRADED</span>`;
    return `<span class="pill ok rowpill">OPERATIONAL</span>`;
  }

  function renderOutages(filter="all"){
    const list = $("#outageList");
    if(!list) return;
    list.innerHTML = "";

    const rows = outages.filter(o => filter === "all" ? true : o.kind === filter);

    if(rows.length === 0){
      list.innerHTML = `<div class="rowitem"><div class="rowtitle">No matching incidents.</div><div class="rowdesc">Enjoy this brief illusion of stability.</div></div>`;
      return;
    }

    for(const o of rows){
      const row = document.createElement("div");
      row.className = "rowitem";
      row.innerHTML = `
        <div class="rowtop">
          <div>
            <div class="rowtitle">${escapeHTML(o.title)}</div>
            <div class="rowdesc">${escapeHTML(o.desc)}</div>
          </div>
          <div class="rowmeta">${escapeHTML(o.region)} • ${escapeHTML(o.kind.toUpperCase())}</div>
        </div>
        ${pillHTML(o.level)}
      `;
      list.appendChild(row);
    }
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  renderOutages("all");

  $$(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderOutages(btn.dataset.filter || "all");
    });
  });

  const form = $("#loginForm");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ps = $("#portalStatus");
      if(ps){
        ps.textContent = "AUTH PENDING";
        setTimeout(() => {
          ps.textContent = "DENIED";
          ps.style.color = "var(--warn)";
        }, 700);
        setTimeout(() => {
          ps.textContent = "AVAILABLE";
          ps.style.color = "";
        }, 1900);
      }
    });
  }
})();