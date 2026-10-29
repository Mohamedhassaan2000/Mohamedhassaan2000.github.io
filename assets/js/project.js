/* Project page: at-a-glance role card, what I did, my work, process, project context, sheet viewer. */
(() => {
  const { $, $$, esc, ANIM, split, reveal, magnetic, lenis, ready, start, bind, addLayer, openLayer, closeLayer } = window.SITE;
  const ALL = window.PROJECTS, P = window.PROFILE;
  const pad = n => String(n).padStart(2, "0");
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const CAT = { design: "Design", technical: "Technical", academic: "Academic" };

  const slug = new URLSearchParams(location.search).get("p");
  const p = ALL.find(x => x.slug === slug) || ALL[0];
  const idx = ALL.indexOf(p);
  const next = ALL[(idx + 1) % ALL.length];
  document.title = `${p.title} — Mohamed Hassaan`;

  // "My work" = sheets the user marked as theirs; everything else is team context
  const mine = p.work || [];
  const mineSrc = new Set(mine.map(w => w.src));
  const individual = /individual/i.test(p.team || "");
  const context = individual ? [] : p.images.filter(src => !mineSrc.has(src)).map(src => ({ src, caption: "" }));

  const glance = [
    ["My role", p.roleLine || "Role details coming soon"],
    ["Stage", (p.stage || []).join(" · ")],
    ["Team", p.team || (p.category === "academic" ? "" : "DOSOR STUDIO design team")],
    ["Tools", (p.software || []).join(", ")],
    ["Location", [p.location, p.year].filter(Boolean).join(" · ")]
  ].filter(([, v]) => v);

  // gallery rows: full, pair, inset, trio … repeated
  const PATTERN = [["full", 1], ["pair", 2], ["inset", 1], ["trio", 3]];
  const rowsOf = list => {
    const rows = [];
    for (let i = 0, k = 0; i < list.length; k++) {
      let [kind, n] = PATTERN[k % PATTERN.length];
      if (list.length - i < n) [kind, n] = ["inset", 1];
      rows.push([kind, list.slice(i, i + n), i]);
      i += n;
    }
    return rows;
  };
  const gallery = (list, set) => rowsOf(list).map(([kind, items, s]) => `<div class="g-row ${kind}">${items.map((it, j) => `
      <figure data-mask data-cursor="view" data-cursor-label="Open" data-set="${set}" data-i="${s + j}">
        <div class="ph"><img src="${esc(it.src)}" alt="${esc(it.caption || p.title)}" loading="lazy" draggable="false"></div>
        <figcaption><span class="n">${pad(s + j + 1)}</span>${esc(it.caption || "")}</figcaption>
      </figure>`).join("")}</div>`).join("");

  const stageImg = i => {
    const pool = mine.length ? mine.map(w => w.src) : p.images;
    return pool[Math.min(pool.length - 1, Math.round((i + .5) * pool.length / p.stages.length))] || p.cover;
  };

  $("#project").innerHTML = `
    <section class="p-head wrap">
      <div class="top">
        <a class="back" href="index.html#work">← All projects</a>
        <div class="counter"><span>${pad(idx + 1)}</span><span class="bar"></span><span class="of">/ ${pad(ALL.length)}</span><span class="t">${esc(CAT[p.category])}</span></div>
      </div>
      <div class="grid">
        <div>
          <h1 data-split>${esc(p.title)}</h1>
          <div class="disc">${esc(p.type)}</div>
          <p class="summary" data-reveal>${esc(p.summary)}</p>
          <div class="tag-row" data-reveal>${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        </div>
        <aside class="glance" data-reveal>
          <span class="label accent">At a glance</span>
          <dl>${glance.map(([k, v]) => `<div class="${k === "My role" ? "role-row" : ""}"><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        </aside>
      </div>
    </section>

    <div class="p-cover" data-mask><img src="${esc(p.cover)}" alt="${esc(p.title)}" data-parallax="-6" fetchpriority="high"></div>

    <section class="p-info wrap">
      <div>
        <span class="label accent">What I did</span>
        ${p.role.length
          ? `<ol class="role-list" data-reveal style="margin-top:18px">${p.role.map(r => `<li>${esc(r)}</li>`).join("")}</ol>`
          : `<p class="role-pending" data-reveal style="margin-top:18px">Details of my contribution coming soon.</p>`}
      </div>
      <div>
        <span class="label">Design idea</span>
        <p class="concept" data-reveal style="margin-top:18px">${esc(p.concept)}</p>
      </div>
    </section>

    ${(p.decisions || []).length ? `
    <section class="decisions wrap">
      <span class="label accent">Key design decisions</span>
      <ul data-reveal>${p.decisions.map((d, i) => `<li><span class="n">${pad(i + 1)}</span>${esc(d)}</li>`).join("")}</ul>
    </section>` : ""}

    ${mine.length ? `
    <section class="g-sec wrap" id="my-work">
      <div class="g-head">
        <div class="counter"><span>My work</span><span class="bar"></span><span class="of">${pad(mine.length)} sheets</span></div>
        <p>Sheets I produced on this project${individual ? "" : " — my own contribution"}.</p>
      </div>
      <div class="gallery">${gallery(mine, "mine")}</div>
    </section>` : ""}

    <section class="stages-sec wrap light${p.stages.some(s => s.mine) && !individual ? " has-mine" : ""}">
      <div class="counter"><span>Process</span><span class="bar"></span><span class="of">${pad(p.stages.length)} stages</span></div>
      <h2 data-split>From concept <i>to reality.</i></h2>
      <div class="stages">${p.stages.map((s, i) => `
        <div class="stage${s.mine ? " is-mine" : ""}" data-reveal>
          <figure><img src="${esc(stageImg(i))}" alt="${esc(s.title)}" loading="lazy" draggable="false">${s.mine && !individual ? `<span class="mine-badge">My part</span>` : ""}</figure>
          <div class="row"><span class="n">${pad(i + 1)}</span><b>${esc(s.title)}</b>${arrow}</div>
          <p>${esc(s.text)}</p>
        </div>`).join("")}
      </div>
    </section>

    ${context.length ? `
    <section class="g-sec wrap context" id="context">
      <div class="g-head">
        <div class="counter"><span>Project context</span><span class="bar"></span><span class="of">${pad(context.length)} sheets</span></div>
        <p>Work by the DOSOR STUDIO team, shown for context${mine.length ? "" : " — my own sheets will be marked here soon"}.</p>
      </div>
      <div class="gallery">${gallery(context, "context")}</div>
    </section>` : ""}

    <a class="next-proj" href="project.html?p=${encodeURIComponent(next.slug)}" data-title="${esc(next.title)}" data-cursor="view" data-cursor-label="Next">
      <img src="${esc(next.cover)}" alt="" loading="lazy">
      <div class="inner">
        <span class="label accent">Next project</span>
        <h2>${esc(next.title)}</h2>
        <span class="c-link"><span class="c">${arrow}</span>${esc(next.tags.slice(0, 2).join(" & "))}</span>
      </div>
    </a>

    <footer class="wrap copyright" style="border:0">
      <span class="label">© ${new Date().getFullYear()} Mohamed Hassaan</span>
      <a class="label" data-mail-href><span data-mail></span></a>
    </footer>`;
  bind($("#project"));

  // ---------- sheet viewer (images only, no file download) ----------
  const SETS = { mine, context };
  const V = $(".viewer"), vImg = $(".v-stage img", V), vStage = $(".v-stage", V), vThumbs = $(".v-thumbs", V);
  $(".v-mark", V).textContent = `© ${P.name}`;
  let list = [], cur = 0, setName = "";
  const show = i => {
    cur = (i + list.length) % list.length;
    vStage.classList.remove("zoomed");
    vImg.src = list[cur].src;
    $(".v-title", V).textContent = `${p.title}${list[cur].caption ? " — " + list[cur].caption : ""}`;
    $(".v-count", V).textContent = `${setName} · ${pad(cur + 1)} / ${pad(list.length)}`;
    $$("button", vThumbs).forEach((b, k) => b.classList.toggle("on", k === cur));
    $$("button", vThumbs)[cur]?.scrollIntoView({ block: "nearest", inline: "center" });
  };
  const open = (name, i) => {
    list = SETS[name];
    setName = name === "mine" ? "My work" : "Context";
    vThumbs.innerHTML = list.map(s => `<button><img src="${esc(s.src)}" alt="" loading="lazy" draggable="false"></button>`).join("");
    $$("button", vThumbs).forEach((b, k) => b.addEventListener("click", () => show(k)));
    V.classList.add("open");
    lenis?.stop();
    show(i);
    openLayer();
    if (ANIM) gsap.fromTo(V, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .7, ease: "expo.inOut" });
  };
  const shut = () => {
    const done = () => { V.classList.remove("open"); lenis?.start(); };
    ANIM ? gsap.to(V, { clipPath: "inset(0 0 100% 0)", duration: .6, ease: "expo.inOut", onComplete: done }) : done();
  };
  // Back on the phone closes the viewer instead of leaving the project
  addLayer({ isOpen: () => V.classList.contains("open"), close: shut });
  const close = () => closeLayer(shut);
  $(".v-close", V).onclick = close;
  $(".v-prev", V).onclick = () => show(cur - 1);
  $(".v-next", V).onclick = () => show(cur + 1);
  const origin = e => { const r = vStage.getBoundingClientRect(); vImg.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; };
  vStage.addEventListener("click", e => { if (vStage.classList.toggle("zoomed")) origin(e); });
  vStage.addEventListener("mousemove", e => { if (vStage.classList.contains("zoomed")) origin(e); });
  addEventListener("keydown", e => {
    if (!V.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let sx = null;
  vStage.addEventListener("touchstart", e => (sx = e.touches[0].clientX), { passive: true });
  vStage.addEventListener("touchend", e => {
    if (sx === null) return;
    const d = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1));
  });

  $$(".gallery figure").forEach(f => f.addEventListener("click", () => open(f.dataset.set, +f.dataset.i)));

  // discourage saving: no right-click or dragging on project imagery
  document.addEventListener("contextmenu", e => { if (e.target.closest(".viewer, .gallery, .p-cover, .stages")) e.preventDefault(); });

  magnetic($("#project"));

  ready(() => {
    // sheet and stage counts count up as they scroll into view (React Bits CountUp port)
    $$(".g-head .of, .stages-sec .counter .of").forEach(el => window.BITS.countUp(el, { duration: 1.4 }));
    if (!ANIM) return;
    const h1 = $(".p-head h1");
    gsap.to(split(h1), { y: 0, duration: 1.3, ease: "expo.out", stagger: .07, delay: .1 });
    gsap.fromTo(".p-head .counter .bar", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" });
    reveal(document, { skip: [h1] });
  });

  start();
})();
