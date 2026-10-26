/* Home page: hero, selected works (bento + tabs), about + skills, contact. */
(() => {
  const { $, $$, esc, ANIM, FINE, reveal, magnetic, ready, start } = window.SITE;
  const { blurText, lightRays, countUp, starBorder } = window.BITS;
  const P = window.PROFILE, ALL = window.PROJECTS;
  const pad = n => String(n).padStart(2, "0");
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // ---------- hero ----------
  const feat = ALL.find(p => p.slug === P.featured) || ALL[0];
  const fc = $("#feature-card");
  fc.href = `project.html?p=${encodeURIComponent(feat.slug)}`;
  fc.dataset.title = feat.title;
  $(".fc-img img", fc).src = feat.cover;
  $(".fc-title", fc).textContent = feat.title;

  // ---------- selected works: tabs + bento grid ----------
  const TABS = [
    ["design", "Design", "Concept and design development: massing, façades, interiors, landscape and visualization."],
    ["technical", "Technical", "Technical office work: working drawings, blow-up elevations, details and tender packages."],
    ["academic", "Academic", "Graduation projects — designed individually from brief to final presentation."]
  ].filter(([k]) => ALL.some(p => p.category === k));
  const tabs = $("#tabs"), grid = $("#works"), note = $("#tab-note"), section = $("#work");
  tabs.innerHTML = `<span class="ind" aria-hidden="true"></span>` + TABS.map(([k, l], i) =>
    `<button role="tab" data-f="${k}" class="${i ? "" : "active"}" aria-selected="${!i}">${l}<sup>${pad(ALL.filter(p => p.category === k).length)}</sup></button>`).join("");

  // sliding pill behind the active tab
  const ind = $(".ind", tabs);
  const moveInd = () => {
    const b = $("button.active", tabs); if (!b) return;
    ind.style.width = b.offsetWidth + "px";
    ind.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  tabs.classList.add("has-ind");
  moveInd();
  addEventListener("resize", moveInd);
  document.fonts && document.fonts.ready.then(moveInd);

  // bento rhythm: big, small, small, wide, wide — repeated
  const SIZE = ["b-big", "b-small", "b-small", "b-wide", "b-wide"];
  // two projects (technical, academic) sit side by side as two equal big cards
  const card = (p, i, list) => `
    <a class="card3 ${list.length === 2 ? "b-big" : SIZE[i % SIZE.length]}" href="project.html?p=${encodeURIComponent(p.slug)}" data-cursor="view" data-title="${esc(p.title)}" data-mask>
      <div class="media"><img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy" draggable="false"></div>
      <span class="num"><i></i>${pad(i + 1)}</span>
      <div class="body">
        <div><h3>${esc(p.title)}</h3><div class="disc">${p.tags.slice(0, 2).map(t => `<span>${esc(t)}</span>`).join("")}</div></div>
        <span class="go">${arrow}</span>
      </div>
    </a>`;

  function render(f, animate) {
    const [, , text] = TABS.find(t => t[0] === f);
    const list = ALL.filter(p => p.category === f);
    section.dataset.cat = f;
    const paint = () => {
      note.textContent = text;
      grid.innerHTML = list.map(card).join("");
      if (!ANIM) return;
      if (!animate) { reveal(grid); return; }
      const cards = $$(".card3", grid);
      cards.forEach(c => { c.dataset.revealed = 1; c.classList.add("is-in"); });
      gsap.fromTo(cards, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.inOut", stagger: .07, clearProps: "clipPath" });
      gsap.fromTo($$(".card3 img", grid), { scale: 1.25 }, { scale: 1, duration: 1.5, ease: "expo.out", stagger: .07, clearProps: "transform" });
      gsap.fromTo(note, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6 });
      ScrollTrigger.refresh();
    };
    if (animate && ANIM && grid.children.length) gsap.to($$(".card3", grid), { opacity: 0, y: 14, duration: .3, stagger: .02, onComplete: paint });
    else paint();
  }
  tabs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.classList.contains("active")) return;
    $$("button", tabs).forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
    moveInd();
    render(b.dataset.f, true);
  });

  // spotlight that follows the cursor across a card
  if (FINE) grid.addEventListener("pointermove", e => {
    const c = e.target.closest(".card3"); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${e.clientX - r.left}px`);
    c.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
  render(TABS[0][0], false);

  // ---------- skills ----------
  const ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
    doc: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5L12 12l8-4.5M12 12v9"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>'
  };
  // titles only; "Digital Tools" is shown as the software belt below
  $("#skill-cards").innerHTML = P.skillGroups.filter(g => g.icon !== "monitor").map((g, i) => `
    <div class="skill" data-reveal>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${ICONS[g.icon] || ""}</svg>
      <h4>${esc(g.title)}</h4>
      <span class="skill-n">${pad(i + 1)}</span>
    </div>`).join("");

  // ---------- software belt: logo tiles in brand colours, scrolling slowly ----------
  const MARKS = {
    D5: '<b>D5</b>',
    ai: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>',
    office: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>'
  };
  const swItem = s => `
    <div class="sw-item" style="--b:${esc(s.color)}">
      <span class="sw-logo">${s.logo
        // mask set inline so the url resolves from the page, not from theme.css
        ? `<i style="-webkit-mask-image:url(assets/img/logos/${esc(s.logo)}.svg);mask-image:url(assets/img/logos/${esc(s.logo)}.svg)"></i>`
        : MARKS[s.mark] || ""}</span>
      <span class="sw-name">${esc(s.name)}${s.note ? `<small>${esc(s.note)}</small>` : ""}</span>
    </div>`;
  const sw = (P.software || []).map(swItem).join("");
  // two copies so the loop is seamless; the copy is hidden from screen readers
  $("#sw-track").innerHTML = `<div class="sw-set">${sw}</div><div class="sw-set" aria-hidden="true">${sw}</div>`;

  // ---------- contact ----------
  $("#c-tel").href = `tel:${P.phone.replace(/\s/g, "")}`;
  // Behance link shows only once it is set in data.js
  const be = $("#c-behance");
  if (P.behance) $("a", be).href = P.behance;
  else be.hidden = true;

  // email button opens a new Gmail message addressed to me
  $("#c-gmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(P.email)}`;

  // "Let's work" is split into letters; they rise in on scroll and lift away from the cursor
  const firstRow = $(".c2-row");
  firstRow.innerHTML = [...firstRow.textContent].map(c => c === " " ? " " : `<span class="ch">${esc(c)}</span>`).join("");
  const chars = $$(".ch", firstRow);
  if (ANIM && FINE) {
    const head = $(".c2-h");
    const lift = chars.map(ch => gsap.quickTo(ch, "y", { duration: .5, ease: "power3" }));
    head.addEventListener("pointermove", e => chars.forEach((ch, i) => {
      const r = ch.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      lift[i](-Math.max(0, 1 - d / 220) * 26);
    }));
    head.addEventListener("pointerleave", () => lift.forEach(f => f(0)));
  }

  // ---------- nav: highlight the section in view ----------
  if (ANIM) {
    const links = $$(".nav-links a");
    ["#top", "#about", "#work", "#contact"].forEach(id => ScrollTrigger.create({
      trigger: id, start: "top 45%", end: "bottom 45%",
      onToggle: s => s.isActive && links.forEach(a => a.classList.toggle("current", a.getAttribute("href") === id))
    }));
  }

  // ---------- React Bits ports ----------
  lightRays($("#rays"), { raysOrigin: "top-center", raysColor: "#b8c29b", raysSpeed: 0.5, lightSpread: 0.8, rayLength: 2, fadeDistance: 1, saturation: 0.8, followMouse: true, mouseInfluence: 0.06 });
  $$("[data-star]").forEach(el => starBorder(el, { color: "#f4f1ea", speed: "6s" }));
  magnetic();

  ready(() => {
    blurText($(".hero3-name"), { delay: 200, direction: "top", start: .25 });
    $$("#tabs sup").forEach(el => countUp(el, { duration: 1.4 }));
    if (!ANIM) return;

    const photo = $("[data-hero-photo]");
    gsap.timeline()
      .fromTo(photo, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2, ease: "expo.out" }, 0)
      .fromTo("#rays", { opacity: 0 }, { opacity: 1, duration: 2.4, ease: "power2.out" }, .2)
      .to("[data-hero-in]", { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .08 }, .55);

    if (FINE) {
      const px = gsap.quickTo(".hero3-photo img", "x", { duration: 1.2, ease: "power3" });
      $(".hero3").addEventListener("mousemove", e => px((e.clientX / innerWidth - .5) * -14));
    }
    gsap.to(photo, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero3", start: "top top", end: "bottom top", scrub: true } });

    // each section eases in softly as it reaches the viewport
    $$("[data-section]").forEach(sec => gsap.to(sec, {
      opacity: 1, y: 0, duration: 1.3, ease: "power3.out",
      scrollTrigger: { trigger: sec, start: "top 88%", once: true }
    }));

    // contact headline: letters rise one by one, then "together." slides up under them
    gsap.timeline({ scrollTrigger: { trigger: ".c2-h", start: "top 85%" } })
      .fromTo(chars, { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: .035 })
      .fromTo(".c2-line:last-child .c2-row", { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: "expo.out" }, .25);
    // the two lines drift apart a little while the section scrolls past
    gsap.fromTo(".c2-line:first-child", { xPercent: -4 }, { xPercent: 2, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".c2-line:last-child", { xPercent: 4 }, { xPercent: -2, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: true } });

    reveal(document);
  });

  start();
})();
