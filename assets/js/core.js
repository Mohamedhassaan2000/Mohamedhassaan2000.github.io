/* Shared behaviour for every page: data binding, smooth scroll, cursor,
   split text, scroll reveals, loader and page transitions. */
(() => {
  const P = window.PROFILE;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const ANIM = root.classList.contains("anim") && !!window.gsap && !!window.ScrollTrigger;
  if (!ANIM) root.classList.remove("anim", "entering");
  if (ANIM) gsap.registerPlugin(ScrollTrigger);
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- data binding ----------
  function bind(scope = document) {
    $$("[data-p]", scope).forEach(el => (el.textContent = P[el.dataset.p] ?? ""));
    $$("[data-p-html]", scope).forEach(el => (el.innerHTML = P[el.dataset.pHtml] ?? ""));
    $$("[data-p-src]", scope).forEach(el => (el.src = P[el.dataset.pSrc]));
    $$("[data-cv]", scope).forEach(el => (el.href = P.cv));
    $$("[data-mail]", scope).forEach(el => (el.textContent = P.email));
    $$("[data-mail-href]", scope).forEach(el => (el.href = `mailto:${P.email}`));
    $$("[data-tel]", scope).forEach(el => { el.href = `tel:${P.phone.replace(/\s/g, "")}`; el.textContent = P.phone; });
    // WhatsApp chat with a ready greeting (wa.me needs the number as digits only)
    $$("[data-whatsapp]", scope).forEach(el => {
      el.href = `https://wa.me/${P.phone.replace(/\D/g, "")}?text=${encodeURIComponent(P.whatsappText || "")}`;
      el.target = "_blank"; el.rel = "noopener";
    });
    $$("[data-linkedin]", scope).forEach(el => (el.href = P.linkedin));
  }
  bind();
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
  const clock = $("#clock");
  if (clock) {
    const tick = () => (clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }).format(new Date()) + " Cairo");
    tick(); setInterval(tick, 30000);
  }

  // ---------- smooth scroll ----------
  let lenis = null;
  if (ANIM && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = target => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  // ---------- back button: closes the open menu / viewer, or returns to the previous section,
  // instead of leaving the site. Each history entry keeps the scroll position to return to. ----------
  const layers = [];   // { isOpen, close } for the menu and the viewers
  const remember = () => history.replaceState({ ...history.state, y: scrollY }, "");
  const openLayer = () => { if (!history.state?.layer) { remember(); history.pushState({ layer: 1 }, ""); } };
  const closeLayer = close => (history.state?.layer ? history.back() : close());
  const addLayer = l => layers.push(l);
  addEventListener("popstate", e => {
    const open = layers.filter(l => l.isOpen());
    if (open.length) open.forEach(l => l.close());
    else if (typeof e.state?.y === "number") scrollTo(e.state.y);
  });

  // nav gets a solid background once the page scrolls
  const nav = $(".nav");
  const onScroll = () => nav?.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---------- mobile menu ----------
  const menu = $(".menu"), menuBtn = $(".menu-btn");
  const setMenu = open => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    menuBtn.textContent = open ? "Close" : "Menu";
    menuBtn.setAttribute("aria-expanded", open);
    lenis && (open ? lenis.stop() : lenis.start());
  };
  const menuOpen = () => !!menu?.classList.contains("open");
  addLayer({ isOpen: menuOpen, close: () => setMenu(false) });
  menuBtn?.addEventListener("click", () => {
    if (menuOpen()) closeLayer(() => setMenu(false));
    else { setMenu(true); openLayer(); }
  });

  // in-page anchors (each jump is a history step, so Back returns to where you were)
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    setMenu(false);
    const y = target === 0 ? 0 : Math.round(target.getBoundingClientRect().top + scrollY);
    // a jump from the open menu takes over the menu's history entry
    if (history.state?.layer) history.replaceState({ y }, "");
    else { remember(); history.pushState({ y }, ""); }
    scrollTo(target);
  });

  // ---------- split text ----------
  function split(el) {
    if (el.dataset.splitDone) return $$(".wi", el);
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.className = "wi"; i.textContent = part;
            w.append(i); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.dataset.splitDone = "1";
    return $$(".wi", el);
  }

  // ---------- scroll reveals ----------
  function reveal(scope = document, { skip = [] } = {}) {
    if (!ANIM) return;
    $$("[data-split]", scope).forEach(el => {
      if (skip.includes(el) || el.dataset.revealed) return;
      el.dataset.revealed = 1;
      gsap.to(split(el), {
        y: 0, duration: 1.2, ease: "expo.out", stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    $$("[data-reveal]", scope).forEach(el => {
      if (el.dataset.revealed) return; el.dataset.revealed = 1;
      gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    $$("[data-mask]", scope).forEach(el => {
      if (el.dataset.revealed) return; el.dataset.revealed = 1;
      const img = $("img:not([data-parallax])", el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%" }, onStart: () => el.classList.add("is-in") });
      tl.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" });
      if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", clearProps: "transform" }, 0.1);
    });
    $$("[data-parallax]", scope).forEach(el => {
      if (el.dataset.px) return; el.dataset.px = 1;
      const v = parseFloat(el.dataset.parallax) || 10;
      gsap.fromTo(el, { yPercent: -v }, {
        yPercent: v, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  // ---------- cursor ----------
  if (ANIM && FINE) {
    root.classList.add("has-cursor");
    const dot = $(".cursor"), ring = $(".cursor-ring"), label = $("span", ring);
    const dx = gsap.quickTo(dot, "x", { duration: .12, ease: "power3" }), dy = gsap.quickTo(dot, "y", { duration: .12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: .5, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: .5, ease: "power3" });
    gsap.set([dot, ring], { opacity: 0 });
    let shown = false;
    addEventListener("mousemove", e => {
      if (!shown) { shown = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); gsap.to([dot, ring], { opacity: 1, duration: .3 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    });
    document.addEventListener("mouseover", e => {
      const v = e.target.closest('[data-cursor="view"]');
      const l = !v && e.target.closest('a, button, [data-cursor="link"]');
      ring.classList.toggle("is-view", !!v);
      ring.classList.toggle("is-link", !!l);
      if (v) label.textContent = v.dataset.cursorLabel || "View";
    });
    document.addEventListener("mouseleave", () => gsap.to([dot, ring], { opacity: 0, duration: .3 }));
    document.addEventListener("mouseenter", () => gsap.to([dot, ring], { opacity: 1, duration: .3 }));
  }

  // magnetic buttons
  function magnetic(scope = document) {
    if (!ANIM || !FINE) return;
    $$("[data-magnetic]", scope).forEach(el => {
      const xTo = gsap.quickTo(el, "x", { duration: .6, ease: "elastic.out(1, .4)" });
      const yTo = gsap.quickTo(el, "y", { duration: .6, ease: "elastic.out(1, .4)" });
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }
  magnetic();

  // ---------- block saving images / the page (the CV keeps its own Download button) ----------
  document.addEventListener("contextmenu", e => { if (e.target.closest("img, figure, .media, .card3, .feature-card, .viewer, .cv-modal")) e.preventDefault(); });
  document.addEventListener("dragstart", e => { if (e.target.closest("img")) e.preventDefault(); });
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "p")) e.preventDefault(); // save page / print to PDF
  });

  // ---------- in-site CV viewer (new tabs are blocked in some browsers) ----------
  const cvBox = document.createElement("div");
  cvBox.className = "cv-modal";
  cvBox.setAttribute("role", "dialog");
  cvBox.setAttribute("aria-modal", "true");
  cvBox.setAttribute("aria-label", "Curriculum vitae");
  cvBox.innerHTML = `
    <div class="cv-bar">
      <span class="label">Curriculum vitae — ${esc(P.fullName)}</span>
      <div class="cv-bar-actions">
        <a class="btn lime" href="${esc(P.cv)}" download>Download PDF ↓</a>
        <a class="btn" href="${esc(P.cv)}" target="_blank" rel="noopener">Open in new tab ↗</a>
        <button class="btn cv-close" aria-label="Close">Close ✕</button>
      </div>
    </div>
    <div class="cv-pages" data-lenis-prevent>${(P.cvPages || []).map((src, i) =>
      `<img src="${esc(src)}" alt="CV page ${i + 1}" loading="lazy">`).join("")}</div>`;
  document.body.append(cvBox);
  const openCV = () => {
    cvBox.classList.add("open");
    $(".cv-pages", cvBox).scrollTop = 0;
    lenis?.stop();
    if (ANIM) gsap.fromTo(cvBox, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .7, ease: "expo.inOut" });
  };
  const closeCV = () => {
    const done = () => { cvBox.classList.remove("open"); lenis?.start(); };
    ANIM ? gsap.to(cvBox, { clipPath: "inset(0 0 100% 0)", duration: .55, ease: "expo.inOut", onComplete: done }) : done();
  };
  addLayer({ isOpen: () => cvBox.classList.contains("open"), close: closeCV });
  $(".cv-close", cvBox).addEventListener("click", () => closeLayer(closeCV));
  cvBox.addEventListener("click", e => { if (e.target === cvBox) closeLayer(closeCV); });
  addEventListener("keydown", e => { if (e.key === "Escape" && cvBox.classList.contains("open")) closeLayer(closeCV); });
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-cv]");
    if (!a || a.hasAttribute("download") || !(P.cvPages || []).length) return;
    e.preventDefault();
    setMenu(false);
    openCV();
    openLayer();
  });

  // ---------- page transitions ----------
  const curtain = $(".curtain");
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!ANIM || !a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname) || (url.pathname === location.pathname && url.search === location.search)) return;
    e.preventDefault();
    $("span", curtain).textContent = a.dataset.title || "Loading";
    lenis?.stop();
    gsap.fromTo(curtain, { yPercent: 100 }, {
      yPercent: 0, duration: .9, ease: "expo.inOut",
      onComplete: () => { try { sessionStorage.setItem("pt", "1"); } catch {} location.href = url.href; }
    });
  });
  // coming back via the browser's back button restores a covered page
  addEventListener("pageshow", e => { if (e.persisted && curtain) { gsap.set(curtain, { yPercent: 100 }); lenis?.start(); } });

  // ---------- intro: loader or curtain, then page animations ----------
  const readyFns = [];
  const ready = fn => readyFns.push(fn);
  const go = () => { readyFns.forEach(fn => fn()); window.ScrollTrigger?.refresh(); };

  function start() {
    let seen = false;
    try { seen = sessionStorage.getItem("seen") === "1"; sessionStorage.setItem("seen", "1"); } catch {}
    const entering = root.classList.contains("entering");
    try { sessionStorage.removeItem("pt"); } catch {}
    const loader = $(".loader");

    if (!ANIM) { loader?.classList.add("done"); go(); return; }

    if (entering) {
      loader?.classList.add("done");
      gsap.set(curtain, { yPercent: 0 });
      root.classList.remove("entering");
      gsap.to(curtain, { yPercent: -100, duration: 1, ease: "expo.inOut", delay: .1, onComplete: () => gsap.set(curtain, { yPercent: 100 }) });
      gsap.delayedCall(.45, go);
      return;
    }
    if (!loader || seen) { loader?.classList.add("done"); go(); return; }

    // first visit: short counter while the hero image loads
    lenis?.stop();
    const count = $(".loader-count", loader), bar = $(".loader-bar i", loader);
    const hero = new Image(); hero.src = (P.hero || [])[0] || "";
    const loaded = new Promise(r => { hero.onload = hero.onerror = r; setTimeout(r, 2500); });
    const state = { v: 0 };
    gsap.to(state, {
      v: 100, duration: 1.4, ease: "power2.inOut",
      onUpdate: () => { count.textContent = Math.round(state.v); gsap.set(bar, { scaleX: state.v / 100 }); },
      onComplete: () => loaded.then(() => {
        gsap.to(loader, {
          clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut",
          onComplete: () => { loader.classList.add("done"); lenis?.start(); }
        });
        gsap.delayedCall(.35, go);
      })
    });
  }

  window.SITE = { $, $$, esc, ANIM, FINE, lenis, split, reveal, magnetic, bind, ready, scrollTo, start, addLayer, openLayer, closeLayer };
})();
