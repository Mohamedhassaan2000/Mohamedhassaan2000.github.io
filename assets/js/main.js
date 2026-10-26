(() => {
  const P = window.PROFILE;
  const ALL = window.PROJECTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M8 7h9v9"/></svg>';

  // ---------- shared ----------
  $$("[data-p]").forEach(el => (el.textContent = P[el.dataset.p] ?? ""));
  $$("[data-p-html]").forEach(el => (el.innerHTML = P[el.dataset.pHtml] ?? ""));
  $$("[data-p-src]").forEach(el => (el.src = P[el.dataset.pSrc]));
  $$("[data-cv]").forEach(el => (el.href = P.cv));
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const menu = $(".nav ul");
  $(".menu-btn")?.addEventListener("click", () => menu.classList.toggle("open"));
  $$(".nav ul a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  const observe = root => $$(".reveal", root).forEach(el => io.observe(el));

  const thumb = p => p.cover
    ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">`
    : `<div class="ph">${esc(p.title)}</div>`;

  // ---------- home ----------
  const grid = $("#grid");
  if (grid) {
    const count = c => ALL.filter(p => p.category === c).length;
    $$("[data-count]").forEach(el => {
      const target = count(el.dataset.count); let n = 0;
      const tick = () => { el.textContent = String(n).padStart(2, "0"); if (n++ < target) setTimeout(tick, 90); };
      setTimeout(tick, 600);
    });

    const words = ["Revit", "AutoCAD", "Working Drawings", "Shop Drawings", "SketchUp", "Lumion", "3ds Max", "Photoshop", "Design Development", "Detailing"];
    $("#marquee").innerHTML = [...words, ...words].map(w => `<span>${w}</span>`).join("");

    $("#timeline").innerHTML = P.experience.map(x =>
      `<li><div class="when">${esc(x.when)}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join("");

    $("#skills").innerHTML = Object.entries(P.skills).map(([k, v]) =>
      `<div class="card reveal"><h4>${esc(k)}</h4><div class="chips">${v.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>`).join("")
      + `<div class="card reveal"><h4>Languages</h4><div class="chips">${P.languages.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>`;

    const tabs = $$(".tabs button");
    tabs.forEach(b => {
      const n = count(b.dataset.filter);
      b.querySelector("sup").textContent = String(n).padStart(2, "0");
      if (!n) b.hidden = true;
    });
    const show = cat => {
      tabs.forEach(b => b.classList.toggle("active", b.dataset.filter === cat));
      grid.innerHTML = ALL.filter(p => p.category === cat).map((p, i) => `
        <a class="project reveal" href="project.html?p=${encodeURIComponent(p.slug)}">
          <div class="thumb">${thumb(p)}<span class="go">${arrow}</span></div>
          <div class="meta">
            <div><h3>${esc(p.title)}</h3><div class="type">${esc(p.type)}</div></div>
            <span class="num">${String(i + 1).padStart(2, "0")}</span>
          </div>
        </a>`).join("");
      observe(grid);
    };
    tabs.forEach(b => b.addEventListener("click", () => show(b.dataset.filter)));
    show("design");

    const links = [
      { label: "Email me", href: `mailto:${P.email}`, solid: true },
      { label: P.phone, href: `tel:${P.phone.replace(/\s/g, "")}` },
      P.linkedin && { label: "LinkedIn", href: P.linkedin, ext: true },
      { label: "Download CV", href: P.cv, dl: true }
    ].filter(Boolean);
    $("#contact-links").innerHTML = links.map(l =>
      `<a class="btn${l.solid ? " solid" : ""}" href="${esc(l.href)}"${l.ext ? ' target="_blank" rel="noopener"' : ""}${l.dl ? " download" : ""}>${esc(l.label)}</a>`).join("");
  }

  // ---------- project page ----------
  const page = $("#project");
  if (page) {
    const slug = new URLSearchParams(location.search).get("p");
    const p = ALL.find(x => x.slug === slug) || ALL[0];
    document.title = `${p.title} — Mohamed Hassaan`;
    const label = { design: "Design", technical: "Technical", academic: "Academic" }[p.category];
    const facts = [["Category", label], ["Type", p.type], ["Location", p.location], ["Year", p.year], ["Team", p.team],
      ["Software", (p.software || []).join(", ")]].filter(([, v]) => v);
    const sameCat = ALL.filter(x => x.category === p.category);
    const next = sameCat[(sameCat.indexOf(p) + 1) % sameCat.length];
    const imgs = (p.images || []).filter(src => src !== p.cover);

    page.innerHTML = `
      <section class="p-hero"><div class="wrap">
        <a class="back" href="index.html#work">← All projects</a>
        <span class="eyebrow" style="display:flex;margin-top:28px">${esc(label)}</span>
        <h1>${esc(p.title)}</h1>
        ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ""}
      </div></section>
      ${p.cover ? `<div class="wrap"><div class="p-cover"><img src="${esc(p.cover)}" alt="${esc(p.title)}"></div></div>` : ""}
      <div class="wrap p-info">
        <dl class="facts-list reveal">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="role reveal"><h2>My role</h2>
          ${p.role.length ? `<ul>${p.role.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : `<p class="type">Role description coming soon.</p>`}
        </div>
      </div>
      <div class="wrap gallery">${imgs.map((src, i) =>
        `<figure class="reveal" data-i="${i}"><img src="${esc(src)}" alt="${esc(p.title)} — sheet ${i + 1}" loading="lazy"></figure>`).join("")}</div>
      ${next && next !== p ? `<div class="wrap"><a class="next" href="project.html?p=${encodeURIComponent(next.slug)}">
        <small>Next project</small><h3>${esc(next.title)} →</h3></a></div>` : ""}`;
    observe(page);

    // lightbox
    const lb = $(".lightbox"), lbImg = $("img", lb), cnt = $(".count", lb);
    let cur = 0;
    const open = i => { cur = (i + imgs.length) % imgs.length; lbImg.src = imgs[cur]; cnt.textContent = `${cur + 1} / ${imgs.length}`; lb.classList.add("open"); };
    const close = () => lb.classList.remove("open");
    $$(".gallery figure").forEach(f => f.addEventListener("click", () => open(+f.dataset.i)));
    $(".x", lb).onclick = close;
    $(".prev", lb).onclick = e => { e.stopPropagation(); open(cur - 1); };
    $(".nxt", lb).onclick = e => { e.stopPropagation(); open(cur + 1); };
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") open(cur - 1);
      if (e.key === "ArrowRight") open(cur + 1);
    });
  }

  observe(document);
})();
