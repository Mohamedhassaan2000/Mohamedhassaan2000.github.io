/* Vanilla-JS ports of four React Bits components (https://github.com/DavidHDev/react-bits):
   BlurText, LightRays, CountUp and StarBorder — same props and behaviour, no React needed.
   Every effect falls back to its final state when animation is off (prefers-reduced-motion). */
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ON = () => !REDUCED && !!window.gsap && document.documentElement.classList.contains("anim");

  // ---------- BlurText: words fade in from blur, staggered ----------
  // defaults follow React Bits: animateBy "words", direction "top", delay 200ms, stepDuration .35s, blur 10px, distance 50px
  function blurText(el, { delay = 200, direction = "top", stepDuration = 0.35, blur = 10, distance = 50, start = 0 } = {}) {
    if (!el.dataset.blurDone) {
      const walk = node => [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(document.createTextNode(" "));
            const s = document.createElement("span"); s.className = "bw"; s.textContent = part; frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
      walk(el);
      el.dataset.blurDone = "1";
    }
    const words = [...el.querySelectorAll(".bw")];
    if (!ON()) { words.forEach(w => (w.style.cssText = "opacity:1;filter:none;transform:none")); return null; }
    const y = direction === "top" ? -distance : distance;
    const tl = gsap.timeline({ delay: start });
    words.forEach((w, i) => {
      const at = i * delay / 1000;
      tl.fromTo(w, { opacity: 0, filter: `blur(${blur}px)` }, { opacity: 1, filter: "blur(0px)", duration: stepDuration * 2, ease: "none" }, at)
        .fromTo(w, { y }, { y: 0, duration: stepDuration * 2, ease: "back.out(1.3)" }, at);
    });
    return tl;
  }

  // ---------- LightRays: WebGL rays from an edge, gently following the cursor ----------
  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
  const FRAG = `
    precision highp float;
    uniform vec2 uRes; uniform float uTime; uniform vec2 uPos; uniform vec2 uDir; uniform vec3 uColor;
    uniform float uSpread; uniform float uLength; uniform float uFade; uniform float uSat; uniform float uPulse;

    float ray(vec2 src, vec2 dir, vec2 c, float a, float b, float speed) {
      vec2 d = c - src;
      float cosA = dot(normalize(d), dir);
      float spread = pow(max(cosA, 0.0), 1.0 / max(uSpread, 0.001));
      float dist = length(d);
      float maxLen = uRes.x * uLength;
      float lenF = clamp((maxLen - dist) / maxLen, 0.0, 1.0);
      float fadeF = clamp((uRes.x * uFade - dist) / (uRes.x * uFade), 0.5, 1.0);
      float pulse = uPulse > 0.5 ? (0.8 + 0.2 * sin(uTime * speed * 3.0)) : 1.0;
      float base = clamp((0.45 + 0.15 * sin(cosA * a + uTime * speed)) + (0.3 + 0.2 * cos(-cosA * b + uTime * speed)), 0.0, 1.0);
      return base * lenF * fadeF * spread * pulse;
    }

    void main() {
      vec2 c = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
      float r1 = ray(uPos, uDir, c, 36.22, 21.11, 1.5);
      float r2 = ray(uPos, uDir, c, 22.40, 18.02, 1.1);
      float k = r1 * 0.5 + r2 * 0.4;
      float fall = 1.0 - 0.75 * (c.y / uRes.y);          // brighter near the source
      float i = clamp(k * fall * 2.2, 0.0, 1.0);
      vec3 col = uColor;
      float g = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(g), col, uSat);
      gl_FragColor = vec4(col, i);
    }`;

  const ORIGINS = {
    "top-center": [[0.5, -0.2], [0, 1]], "top-left": [[0, -0.2], [0, 1]], "top-right": [[1, -0.2], [0, 1]],
    "left": [[-0.2, 0.5], [1, 0]], "right": [[1.2, 0.5], [-1, 0]], "bottom-center": [[0.5, 1.2], [0, -1]]
  };
  const hex = h => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };

  // defaults follow React Bits: raysOrigin "top-center", raysSpeed 1, lightSpread .5, rayLength 3, fadeDistance 1, saturation 1, followMouse true, mouseInfluence .1
  function lightRays(host, {
    raysOrigin = "top-center", raysColor = "#ffffff", raysSpeed = 1, lightSpread = 0.5, rayLength = 3,
    pulsating = false, fadeDistance = 1, saturation = 1, followMouse = true, mouseInfluence = 0.1
  } = {}) {
    const canvas = document.createElement("canvas");
    canvas.className = "light-rays";
    host.append(canvas);
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) { canvas.remove(); return null; }

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return null; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one oversized triangle
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const U = n => gl.getUniformLocation(prog, n);
    const u = { res: U("uRes"), time: U("uTime"), pos: U("uPos"), dir: U("uDir"), color: U("uColor"), spread: U("uSpread"), len: U("uLength"), fade: U("uFade"), sat: U("uSat"), pulse: U("uPulse") };
    gl.uniform3fv(u.color, hex(raysColor));
    gl.uniform1f(u.spread, lightSpread);
    gl.uniform1f(u.len, rayLength);
    gl.uniform1f(u.fade, fadeDistance);
    gl.uniform1f(u.sat, saturation);
    gl.uniform1f(u.pulse, pulsating ? 1 : 0);

    const [anchor, baseDir] = ORIGINS[raysOrigin] || ORIGINS["top-center"];
    let W = 0, H = 0, src = [0, 0];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(host.clientWidth * dpr)); H = Math.max(1, Math.round(host.clientHeight * dpr));
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
      gl.uniform2f(u.res, W, H);
      src = [anchor[0] * W, anchor[1] * H];
      gl.uniform2f(u.pos, src[0], src[1]);
    };
    resize();
    new ResizeObserver(resize).observe(host);

    // cursor: the aim point eases toward the pointer (time constant ~0.2s)
    const aim = [W / 2, H / 2], target = [W / 2, H / 2];
    if (followMouse && !REDUCED) host.closest("section, body").addEventListener("mousemove", e => {
      const r = canvas.getBoundingClientRect(), k = W / r.width;
      target[0] = (e.clientX - r.left) * k; target[1] = (e.clientY - r.top) * k;
    });

    let visible = true, t0 = performance.now(), last = t0, raf = 0;
    const frame = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const ease = 1 - Math.exp(-dt / 0.2);
      aim[0] += (target[0] - aim[0]) * ease; aim[1] += (target[1] - aim[1]) * ease;
      let dx = baseDir[0], dy = baseDir[1];
      if (followMouse && mouseInfluence > 0) {
        let mx = aim[0] - src[0], my = aim[1] - src[1]; const l = Math.hypot(mx, my) || 1;
        dx = dx * (1 - mouseInfluence) + mx / l * mouseInfluence; dy = dy * (1 - mouseInfluence) + my / l * mouseInfluence;
      }
      const l = Math.hypot(dx, dy) || 1;
      gl.uniform2f(u.dir, dx / l, dy / l);
      gl.uniform1f(u.time, (now - t0) / 1000 * raysSpeed);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !REDUCED) raf = requestAnimationFrame(frame);
    };
    // only animate while the hero is on screen and the tab is visible
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }).observe(host);
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden; cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });
    requestAnimationFrame(frame); // reduced motion: draws one still frame
    return canvas;
  }

  // ---------- CountUp: numbers count from 0 when they scroll into view ----------
  function countUp(el, { duration = 1.6, from = 0 } = {}) {
    const text = el.textContent;
    const m = text.match(/\d+/);
    if (!m) return;
    const to = +m[0], width = m[0].length;
    const fmt = v => text.replace(m[0], String(Math.round(v)).padStart(width, "0"));
    if (!ON() || !window.ScrollTrigger) { el.textContent = fmt(to); return; }
    const st = { v: from };
    el.textContent = fmt(from);
    gsap.to(st, {
      v: to, duration, ease: "power2.out",
      onUpdate: () => (el.textContent = fmt(st.v)),
      scrollTrigger: { trigger: el, start: "top 92%", once: true }
    });
  }

  // ---------- StarBorder: two soft lights travelling along the button edge ----------
  // React Bits defaults: speed "6s", thickness 1px; markup is added around the existing content
  function starBorder(el, { color = "#faf1ea", speed = "6s", thickness = 1.5 } = {}) {
    if (el.classList.contains("star-border")) return;
    const inner = document.createElement("span");
    inner.className = "sb-inner";
    while (el.firstChild) inner.append(el.firstChild);
    el.classList.add("star-border");
    el.style.setProperty("--sb-color", color);
    el.style.setProperty("--sb-speed", speed);
    el.style.setProperty("--sb-thick", thickness + "px");
    el.innerHTML = `<i class="sb-light sb-bottom" aria-hidden="true"></i><i class="sb-light sb-top" aria-hidden="true"></i>`;
    el.append(inner);
  }

  window.BITS = { blurText, lightRays, countUp, starBorder, REDUCED };
})();
