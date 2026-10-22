// Ocean, krill, creatures, sounding line and sound.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('fx');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let depthT = 0, depthTarget = 0; // 0 surface .. 1 trench
  const MAX_DEPTH = 2800;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', () => { resize(); seed(); });
  resize();

  /* ---------------- krill sprite ----------------
     Drawn facing +x at the origin, roughly 64 units long.
     t: time in seconds, beat: how hard the swimmerets paddle (0..2),
     flip: abdominal curl for the tail-flip escape (0..1), glow: photophores (0..1). */
  function krill(c, x, y, ang, s, t, o = {}) {
    const beat = o.beat == null ? 1 : o.beat;
    const flip = o.flip || 0;
    const glow = o.glow || 0;
    const a = o.alpha == null ? 1 : o.alpha;
    const hue = o.hue == null ? 350 : o.hue;
    c.save();
    c.translate(x, y); c.rotate(ang); c.scale(s, s);
    c.globalAlpha = a;
    const body = `hsla(${hue}, 85%, 68%, .92)`;
    const shell = `hsla(${hue}, 90%, 78%, .95)`;
    const dark = `hsla(${hue}, 70%, 42%, .9)`;
    c.lineCap = 'round'; c.lineJoin = 'round';

    // antennae: two long whips that trail and wave
    c.strokeStyle = `hsla(${hue}, 80%, 80%, .55)`; c.lineWidth = 0.9;
    for (let i = 0; i < 2; i++) {
      const w = Math.sin(t * 3 + i * 1.7) * 6;
      c.beginPath(); c.moveTo(22, -4 + i * 2);
      c.bezierCurveTo(34, -10 - i * 3 + w * .3, 46, -16 + w, 58, -14 + i * 6 + w);
      c.stroke();
    }
    // short antennules
    c.beginPath(); c.moveTo(23, -2); c.quadraticCurveTo(30, -1, 34, 3 + Math.sin(t * 4) * 2); c.stroke();

    // abdomen: six segments curling down and back
    let px = -1, py = 0.5, dir = Math.PI + 0.06;
    const curl = 0.11 + flip * 0.42;
    const segs = [];
    for (let i = 0; i < 6; i++) {
      const L = 6.6 - i * 0.25, w = 9.4 - i * 1.1;
      dir -= curl;
      const nx = px + Math.cos(dir) * L, ny = py + Math.sin(dir) * L;
      segs.push({ x: (px + nx) / 2, y: (py + ny) / 2, dir, L, w, ex: nx, ey: ny });
      px = nx; py = ny;
    }
    // swimmerets: metachronal wave, back to front
    c.strokeStyle = `hsla(${hue}, 80%, 80%, .6)`; c.lineWidth = 0.9;
    for (let i = 0; i < 5; i++) {
      const g = segs[i];
      const nX = Math.sin(g.dir), nY = -Math.cos(g.dir); // belly-side normal
      const swing = Math.sin(t * 14 * beat - i * 1.1) * 0.7 * Math.min(1, beat);
      const bx = g.x + nX * g.w * 0.4, by = g.y + nY * g.w * 0.4;
      const la = g.dir - Math.PI / 2 - 0.5 + swing; // angled back along the body
      const tipX = bx + Math.cos(la) * 5.5;
      const tipY = by + Math.sin(la) * 5.5;
      c.beginPath(); c.moveTo(bx, by); c.lineTo(tipX, tipY); c.stroke();
      c.beginPath(); c.moveTo((bx + tipX) / 2, (by + tipY) / 2); c.lineTo(tipX - 2, tipY + 1.5); c.stroke();
    }
    // segments, drawn tail first
    for (let i = segs.length - 1; i >= 0; i--) {
      const g = segs[i];
      c.save(); c.translate(g.x, g.y); c.rotate(g.dir);
      c.fillStyle = i % 2 ? body : shell;
      c.beginPath(); c.ellipse(0, 0, g.L * 0.95, g.w / 2, 0, 0, TAU); c.fill();
      c.strokeStyle = `hsla(${hue}, 60%, 90%, .28)`; c.lineWidth = 0.6;
      c.beginPath(); c.ellipse(0, 0, g.L * 0.95, g.w / 2, 0, -2.4, -0.7); c.stroke();
      c.fillStyle = dark; // chromatophore speckle
      c.beginPath(); c.arc(-1, -g.w * 0.18, 0.9, 0, TAU); c.fill();
      c.restore();
    }
    // tail fan: telson plus two pairs of uropods, spreading on the flick
    const tail = segs[5];
    c.save(); c.translate(tail.ex, tail.ey); c.rotate(tail.dir);
    const spread = 0.35 + flip * 0.5 + Math.sin(t * 6) * 0.05;
    c.fillStyle = `hsla(${hue}, 85%, 80%, .75)`;
    for (const k of [-1, -0.45, 0, 0.45, 1]) {
      c.save(); c.rotate(k * spread);
      c.beginPath(); c.ellipse(4.5, 0, 5.5, 1.5, 0, 0, TAU); c.fill();
      c.restore();
    }
    c.restore();

    // thoracic legs: the feeding basket under the carapace
    c.strokeStyle = `hsla(${hue}, 75%, 78%, .65)`; c.lineWidth = 0.9;
    for (let i = 0; i < 6; i++) {
      const lx = 2 + i * 3.2, sw = Math.sin(t * 5 - i * 0.8) * 1.5;
      c.beginPath(); c.moveTo(lx, 4); c.quadraticCurveTo(lx + 1, 9, lx + 2 + sw, 12); c.stroke();
    }
    // carapace
    const grd = c.createLinearGradient(0, -6, 0, 6);
    grd.addColorStop(0, shell); grd.addColorStop(1, body);
    c.fillStyle = grd;
    c.beginPath();
    c.moveTo(-3, -5); c.quadraticCurveTo(10, -8.5, 22, -4.5);
    c.quadraticCurveTo(27, -2.5, 28, 0.5);               // rostrum
    c.quadraticCurveTo(22, 4.5, 12, 5.2);
    c.quadraticCurveTo(2, 5.5, -3, 4.5);
    c.closePath(); c.fill();
    c.strokeStyle = `hsla(${hue}, 60%, 92%, .35)`; c.lineWidth = 0.7;
    c.beginPath(); c.moveTo(0, -4.5); c.quadraticCurveTo(12, -7.2, 21, -4); c.stroke();
    // gut and heart show through the shell
    c.fillStyle = `hsla(${hue + 25}, 90%, 55%, .55)`;
    c.beginPath(); c.ellipse(8, -0.5, 6, 2, -0.05, 0, TAU); c.fill();
    // compound eye on a short stalk
    c.fillStyle = '#05111f';
    c.beginPath(); c.arc(23.5, -2.2, 3, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.85)';
    c.beginPath(); c.arc(24.4, -3.1, 0.9, 0, TAU); c.fill();

    // photophores: real krill carry blue-green lights under the eyes, chest and belly
    if (glow > 0.02) {
      c.shadowColor = 'rgba(110,240,255,1)';
      c.shadowBlur = 10 * glow;
      c.fillStyle = `rgba(150,250,255,${0.55 + 0.45 * glow})`;
      const spots = [[21, 2.2], [9, 5], [2, 5]].concat(segs.slice(0, 4).map((g) => [g.x + Math.sin(g.dir) * g.w * 0.42, g.y - Math.cos(g.dir) * g.w * 0.42]));
      for (const [sx, sy] of spots) { c.beginPath(); c.arc(sx, sy, 1.2, 0, TAU); c.fill(); }
      c.shadowBlur = 0;
    }
    c.restore();
  }

  /* ---------------- ambient life ---------------- */
  const motes = [];
  const school = [];
  const jellies = [];
  let lure = null;

  function seed() {
    motes.length = 0;
    const n = Math.round((W * H) / 15000);
    for (let i = 0; i < n; i++) motes.push(newMote(true));
    school.length = 0;
    const k = W < 600 ? 5 : 9;
    for (let i = 0; i < k; i++) school.push(newSwimmer(true));
    jellies.length = 0;
    for (let i = 0; i < (W < 600 ? 2 : 3); i++) jellies.push(newJelly(true));
    lure = { x: W * 0.82, y: H * 0.7, ph: 0 };
  }
  function newMote(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: rand(0.4, 2.4), v: rand(0.08, 0.42), w: rand(0, TAU), a: rand(0.15, 0.6), glow: Math.random() < 0.14 };
  }
  function newSwimmer(anywhere) {
    const fromLeft = Math.random() < 0.5;
    return {
      x: anywhere ? Math.random() * W : (fromLeft ? -60 : W + 60), y: rand(H * 0.12, H * 0.92),
      vx: (fromLeft ? 1 : -1) * rand(0.25, 0.6), vy: rand(-0.06, 0.06),
      s: rand(0.32, 0.62), t: rand(0, 10), flip: 0, hue: rand(340, 360),
    };
  }
  function newJelly(anywhere) {
    return { x: rand(W * 0.05, W * 0.95), y: anywhere ? rand(H * 0.2, H) : H + 80, s: rand(0.6, 1.25), ph: rand(0, TAU), hue: Math.random() < 0.5 ? 190 : 290 };
  }
  seed();

  function jelly(c, j, t, alpha) {
    const pulse = (Math.sin(j.ph) + 1) / 2;
    const s = j.s;
    c.save(); c.translate(j.x, j.y); c.scale(s, s); c.globalAlpha = alpha;
    c.shadowColor = `hsla(${j.hue},100%,70%,.9)`; c.shadowBlur = 18;
    const bw = 22 + pulse * 5, bh = 16 - pulse * 4;
    const g = c.createRadialGradient(0, -bh * 0.4, 2, 0, 0, bw);
    g.addColorStop(0, `hsla(${j.hue},100%,85%,.55)`); g.addColorStop(1, `hsla(${j.hue},100%,60%,.08)`);
    c.fillStyle = g;
    c.beginPath(); c.ellipse(0, 0, bw, bh, 0, Math.PI, TAU); c.quadraticCurveTo(0, 4, -bw, 0); c.fill();
    c.shadowBlur = 0;
    c.strokeStyle = `hsla(${j.hue},100%,80%,.35)`; c.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      c.beginPath(); c.moveTo(i * bw / 4, 2);
      for (let k = 1; k <= 6; k++) c.lineTo(i * bw / 4 + Math.sin(t * 2 + k * 0.7 + i) * 4, 2 + k * 9);
      c.stroke();
    }
    c.restore();
  }

  function anglerLure(c, t, alpha) {
    const x = lure.x + Math.sin(t * 0.4) * 30, y = lure.y + Math.sin(t * 0.9) * 14;
    c.save(); c.globalAlpha = alpha;
    // the fish itself is barely visible: a dark bulk under the light
    const body = c.createRadialGradient(x - 20, y + 20, 4, x - 34, y + 34, 60);
    body.addColorStop(0, 'rgba(40,70,80,.55)'); body.addColorStop(1, 'rgba(3,8,14,0)');
    c.fillStyle = body;
    c.beginPath(); c.ellipse(x - 34, y + 34, 50, 32, -0.2, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(90,140,150,.25)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(x - 20, y + 10); c.quadraticCurveTo(x - 14, y - 8, x, y); c.stroke();
    const flick = 0.7 + 0.3 * Math.sin(t * 3.1) * Math.sin(t * 1.7);
    const g = c.createRadialGradient(x, y, 0, x, y, 38);
    g.addColorStop(0, `rgba(200,255,240,${0.9 * flick})`); g.addColorStop(0.08, `rgba(124,243,230,${0.6 * flick})`); g.addColorStop(1, 'rgba(124,243,230,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, 38, 0, TAU); c.fill();
    c.fillStyle = `rgba(230,255,250,${flick})`; c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill();
    // teeth glint
    c.fillStyle = 'rgba(200,230,230,.25)';
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x - 8 - i * 6, y + 30); c.lineTo(x - 5 - i * 6, y + 36); c.lineTo(x - 2 - i * 6, y + 30); c.fill(); }
    c.restore();
  }

  /* ---------------- big scenery ---------------- */
  const whale = { x: -600, y: 0, t: 0, next: 4 };
  const manta = { x: -300, y: 0, t: 0, next: 12 };
  function humpback(c, x, y, s, t, alpha) {
    // a far-off humpback: long body, knobbly head, very long pectoral fins, flukes that beat slowly
    c.save(); c.translate(x, y); c.scale(-s, s); c.globalAlpha = alpha; // swims right-to-left, head first
    const beat = Math.sin(t * 0.9);
    c.fillStyle = 'rgba(4,26,44,.9)';
    c.beginPath();
    c.moveTo(150, 0);                                   // rostrum
    c.bezierCurveTo(140, -26, 60, -40, -20, -32);       // back
    c.bezierCurveTo(-90, -24, -150, -10, -205, -4 + beat * 6);
    c.lineTo(-210, 4 + beat * 6);
    c.bezierCurveTo(-150, 12, -80, 26, 0, 30);          // belly with throat grooves
    c.bezierCurveTo(70, 32, 130, 22, 150, 0);
    c.fill();
    // flukes
    c.save(); c.translate(-210, beat * 6); c.rotate(beat * 0.25);
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-20, -30, -55, -42, -70, -36); c.bezierCurveTo(-50, -18, -30, -4, -18, 0);
    c.bezierCurveTo(-30, 4, -50, 18, -70, 36); c.bezierCurveTo(-55, 42, -20, 30, 0, 0); c.fill();
    c.restore();
    // pectoral fin, a third of the body length, with a slow stroke
    c.save(); c.translate(40, 20); c.rotate(0.5 + beat * 0.15);
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-20, 30, -60, 70, -110, 88); c.bezierCurveTo(-80, 60, -30, 20, -16, -4); c.fill();
    c.restore();
    // throat grooves catching a little light
    c.strokeStyle = 'rgba(120,190,210,.14)'; c.lineWidth = 2;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(130 - i * 4, 8 + i * 3); c.quadraticCurveTo(60, 22 + i * 2, 0, 24 + i * 1.2); c.stroke(); }
    c.restore();
  }
  function mantaRay(c, x, y, s, t, alpha) {
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = alpha;
    const flap = Math.sin(t * 1.6);
    c.fillStyle = 'rgba(3,20,36,.92)';
    c.beginPath();
    c.moveTo(40, 0);
    c.bezierCurveTo(20, -10 - flap * 10, -10, -60 - flap * 30, -30, -90 - flap * 40);
    c.bezierCurveTo(-34, -50, -50, -12, -60, 0);
    c.bezierCurveTo(-50, 12, -34, 50, -30, 90 + flap * 40);
    c.bezierCurveTo(-10, 60 + flap * 30, 20, 10 + flap * 10, 40, 0);
    c.fill();
    c.strokeStyle = 'rgba(3,20,36,.9)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-60, 0); c.quadraticCurveTo(-110, 4 + flap * 4, -150, 2); c.stroke(); // tail
    c.beginPath(); c.moveTo(40, -8); c.lineTo(52, -16); c.moveTo(40, 8); c.lineTo(52, 16); c.stroke(); // cephalic fins
    c.restore();
  }
  function lightShafts(c, t, alpha) {
    if (alpha <= 0.01) return;
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const x0 = W * (i / 5) + Math.sin(t * 0.13 + i * 1.7) * 60;
      const w = 50 + (i % 3) * 40;
      const g = c.createLinearGradient(0, 0, 0, H * 0.85);
      g.addColorStop(0, `rgba(200,250,255,${0.09 * alpha})`); g.addColorStop(1, 'rgba(200,250,255,0)');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(x0, -10); c.lineTo(x0 + w, -10); c.lineTo(x0 + w * 2.4 - 180, H * 0.85); c.lineTo(x0 - 180, H * 0.85); c.fill();
    }
    c.restore();
  }
  const vents = [];
  function seafloor(c, t, amt) {
    if (amt <= 0.01) return;
    const base = H + 10 - amt * Math.min(170, H * 0.22);
    c.save();
    // rock silhouette with a faint rim light from the vents
    c.fillStyle = '#01050b';
    c.beginPath(); c.moveTo(0, H);
    for (let x = 0; x <= W + 20; x += 20) c.lineTo(x, base + Math.sin(x * 0.013) * 18 + Math.sin(x * 0.047) * 9 + (x % 140 < 20 ? -10 : 0));
    c.lineTo(W, H); c.fill();
    if (!vents.length || vents.W !== W) {
      vents.length = 0; vents.W = W;
      for (const fx of W < 700 ? [0.78] : [0.14, 0.72, 0.9]) vents.push({ x: W * fx, h: rand(50, 90), smoke: [] });
    }
    for (const v of vents) {
      const vy = base + Math.sin(v.x * 0.013) * 18;
      // chimney
      c.fillStyle = '#060b10';
      c.beginPath(); c.moveTo(v.x - 16, vy + 4); c.lineTo(v.x - 6, vy - v.h); c.lineTo(v.x + 6, vy - v.h); c.lineTo(v.x + 18, vy + 4); c.fill();
      const glow = c.createRadialGradient(v.x, vy - v.h, 1, v.x, vy - v.h, 26);
      glow.addColorStop(0, `rgba(255,150,70,${0.55 * amt})`); glow.addColorStop(1, 'rgba(255,120,40,0)');
      c.fillStyle = glow; c.beginPath(); c.arc(v.x, vy - v.h, 26, 0, TAU); c.fill();
      // black smoker plume
      if (Math.random() < 0.5) v.smoke.push({ x: v.x + rand(-3, 3), y: vy - v.h, r: rand(4, 8), a: 0.5, vx: rand(-0.2, 0.2) });
      for (let i = v.smoke.length - 1; i >= 0; i--) {
        const p = v.smoke[i]; p.y -= 0.7; p.x += p.vx + Math.sin(t + p.y * 0.05) * 0.15; p.r += 0.12; p.a -= 0.004;
        if (p.a <= 0) { v.smoke.splice(i, 1); continue; }
        c.fillStyle = `rgba(20,24,28,${p.a * amt})`; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill();
      }
      // giant tube worms with red plumes
      for (let k = 0; k < 6; k++) {
        const wx = v.x - 40 + k * 15 + (k > 2 ? 24 : 0), wy = vy + 2, wh = 24 + (k * 7) % 20;
        const sway = Math.sin(t * 1.3 + k) * 3;
        c.strokeStyle = 'rgba(220,220,210,.5)'; c.lineWidth = 3;
        c.beginPath(); c.moveTo(wx, wy); c.quadraticCurveTo(wx + sway * 0.5, wy - wh / 2, wx + sway, wy - wh); c.stroke();
        c.fillStyle = `rgba(230,40,60,${0.85 * amt})`;
        c.beginPath(); c.ellipse(wx + sway, wy - wh - 4, 4.5, 6, 0, 0, TAU); c.fill();
      }
    }
    c.restore();
  }

  // descent rush: streaks race upward when you sink
  let rush = 0;
  const streaks = [];
  function drawRush(c, dt) {
    if (rush <= 0.01) { streaks.length = 0; return; }
    while (streaks.length < 50 * rush) streaks.push({ x: Math.random() * W, y: Math.random() * H, l: rand(20, 90), v: rand(12, 30) });
    c.save(); c.strokeStyle = 'rgba(210,250,255,.5)'; c.lineCap = 'round';
    for (const p of streaks) {
      p.y -= p.v * rush * dt;
      if (p.y < -p.l) { p.y = H + p.l; p.x = Math.random() * W; }
      c.globalAlpha = rush * 0.55; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, p.y + p.l * rush); c.stroke();
    }
    c.restore();
    rush = Math.max(0, rush - 0.018 * dt);
  }

  // bioluminescent plankton that light up where you touch
  const sparks = [];
  let lastPt = null;
  window.addEventListener('pointermove', (e) => {
    if (reduce.matches) return;
    const p = { x: e.clientX, y: e.clientY };
    const d = lastPt ? Math.hypot(p.x - lastPt.x, p.y - lastPt.y) : 0;
    lastPt = p;
    const n = Math.min(4, Math.floor(d / 14));
    for (let i = 0; i < n && sparks.length < 260; i++) sparks.push({ x: p.x + rand(-10, 10), y: p.y + rand(-10, 10), vx: rand(-0.3, 0.3), vy: rand(-0.5, 0.1), life: 1, r: rand(0.8, 2.2) });
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (reduce.matches) return;
    for (let i = 0; i < 18 && sparks.length < 260; i++) { const a = rand(0, TAU), sp = rand(0.5, 2.2); sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, r: rand(1, 2.4) }); }
  }, { passive: true });
  function drawSparks(c, dt) {
    if (!sparks.length) return;
    const glow = 0.35 + depthT * 0.65;
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.life -= 0.016 * dt;
      if (p.life <= 0) { sparks.splice(i, 1); continue; }
      const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, `rgba(170,255,245,${p.life * glow})`); g.addColorStop(1, 'rgba(124,243,230,0)');
      c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, p.r * 5, 0, TAU); c.fill();
    }
    c.restore();
  }

  /* ---------------- events: bubbles, divers, swarms ---------------- */
  const bubbles = [];
  const divers = [];
  let markerPos = { x: 22, y: 80 };
  let markerFalling = 0;

  function burst(x, y, tier) {
    if (reduce.matches) return;
    const krillTier = tier === 'k';
    const deep = tier === 'd' || tier === 'r';
    const nb = krillTier ? 50 : deep ? 30 : 16;
    for (let i = 0; i < nb; i++) {
      const ang = rand(0, TAU), sp = rand(0.6, 2.8);
      bubbles.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.4, r: rand(1.2, 4.2), life: 1, decay: rand(0.01, 0.022) });
    }
    if (!tier || tier === 'x') return;
    // every scoring answer releases krill that tail-flip and dive for the depth gauge
    const n = krillTier ? 34 : tier === 'd' ? 5 : tier === 'r' ? 3 : 1;
    for (let i = 0; i < n; i++) {
      divers.push({
        x: x + rand(-30, 30), y: y + rand(-12, 12), t: rand(0, 5), age: 0,
        dur: krillTier ? rand(2.4, 3.6) : rand(1.5, 1.9), delay: i * (krillTier ? 0.03 : 0.12),
        s: krillTier ? rand(0.45, 0.9) : 0.9, swarm: krillTier, ang0: rand(0, TAU), orbit: rand(60, 150), spin: rand(0.8, 1.6) * (Math.random() < 0.5 ? -1 : 1),
        hue: krillTier ? rand(335, 360) : 350, sx: x, sy: y,
      });
    }
    markerFalling = 1.6;
  }

  function stepDivers(dt, t) {
    for (let i = divers.length - 1; i >= 0; i--) {
      const d = divers[i];
      d.t += dt / 60; d.age += dt / 60;
      if (d.age < d.delay) continue;
      const k = Math.min(1, (d.age - d.delay) / d.dur);
      let x, y, ang, flip = 0, s = d.s, alpha = 1;
      if (d.swarm) {
        // school spirals out from the answer, then pours down toward the gauge
        const spiral = Math.min(1, k / 0.55);
        const a = d.ang0 + d.spin * k * 6;
        const r = d.orbit * Math.sin(spiral * Math.PI * 0.5);
        const cx = d.sx + (markerPos.x - d.sx) * Math.max(0, (k - 0.45) / 0.55) ** 2;
        const cy = d.sy + (H + 80 - d.sy) * Math.max(0, (k - 0.5) / 0.5) ** 2;
        x = cx + Math.cos(a) * r * (1 - Math.max(0, k - 0.6));
        y = cy + Math.sin(a) * r * 0.55;
        ang = a + (d.spin > 0 ? Math.PI / 2 : -Math.PI / 2);
        alpha = k > 0.85 ? (1 - k) / 0.15 : 1;
        if (Math.random() < 0.04) bubbles.push({ x, y, vx: rand(-0.3, 0.3), vy: -0.8, r: rand(0.8, 2), life: 0.8, decay: 0.02 });
      } else {
        // tail flip backwards and up first (how real krill escape), then a dive into the gauge
        const flipPhase = Math.min(1, k / 0.22);
        const ex = markerPos.x, ey = markerPos.y;
        const bx = d.sx + 40, by = d.sy - 50;
        if (k < 0.22) {
          x = d.sx + (bx - d.sx) * flipPhase; y = d.sy + (by - d.sy) * Math.sin(flipPhase * Math.PI / 2);
          ang = -Math.PI / 2 + 0.4; flip = Math.sin(flipPhase * Math.PI);
        } else {
          const u = (k - 0.22) / 0.78, e = u * u * (3 - 2 * u);
          const c1x = bx - 80, c1y = by + 140;
          x = (1 - e) ** 2 * bx + 2 * (1 - e) * e * c1x + e * e * ex;
          y = (1 - e) ** 2 * by + 2 * (1 - e) * e * c1y + e * e * ey;
          const dx = 2 * (1 - e) * (c1x - bx) + 2 * e * (ex - c1x), dy = 2 * (1 - e) * (c1y - by) + 2 * e * (ey - c1y);
          ang = Math.atan2(dy, dx);
          s = d.s * (1 - e * 0.6);
          if (Math.random() < 0.25) bubbles.push({ x, y, vx: rand(-0.2, 0.2), vy: -0.6, r: rand(0.6, 1.6), life: 0.7, decay: 0.03 });
        }
      }
      krill(ctx, x, y, ang, s, d.t, { beat: 1.8, flip, glow: 0.4 + depthT, alpha, hue: d.hue });
      if (k >= 1) divers.splice(i, 1);
    }
  }

  /* ---------------- main loop ---------------- */
  const marker = document.getElementById('soundingMarker');
  let last = performance.now(), clock = 0;
  function frame(now) {
    const dt = Math.min(48, now - last) / 16.67; last = now;
    const still = reduce.matches;
    clock += still ? 0 : dt / 60;
    depthT += (depthTarget - depthT) * Math.min(1, 0.04 * dt);
    document.documentElement.style.setProperty('--depth', depthT.toFixed(4));
    ctx.clearRect(0, 0, W, H);

    lightShafts(ctx, clock, 1 - depthT * 2.6);
    // a humpback passes in the shallows now and then, a manta in the mid-water
    if (!still) {
      whale.t += dt / 60; manta.t += dt / 60;
      if (whale.x < -500 && (whale.next -= dt / 60) <= 0) { whale.x = W + 420; whale.y = rand(H * 0.25, H * 0.6); whale.next = rand(25, 45); }
      if (whale.x > -500) whale.x -= 0.32 * dt;
      if (manta.x < -260 && (manta.next -= dt / 60) <= 0) { manta.x = W + 200; manta.y = rand(H * 0.3, H * 0.75); manta.next = rand(18, 30); }
      if (manta.x > -260) manta.x -= 0.7 * dt;
    }
    const wa = Math.max(0, 1 - depthT / 0.32) * 0.5;
    if (wa > 0.01 && whale.x > -500) humpback(ctx, whale.x, whale.y + Math.sin(whale.t * 0.4) * 10, W < 700 ? 0.7 : 1.15, whale.t, wa);
    const ma = Math.max(0, 1 - Math.abs(depthT - 0.42) / 0.22) * 0.55;
    if (ma > 0.01 && manta.x > -260) mantaRay(ctx, manta.x, manta.y + Math.sin(manta.t * 0.8) * 14, W < 700 ? 0.45 : 0.7, manta.t, ma);

    // marine snow drifts down in the deep; bubbles rise near the surface
    for (const p of motes) {
      if (!still) {
        p.w += 0.01 * dt;
        p.y -= p.v * (1 - depthT * 1.5) * dt;
        p.x += Math.sin(p.w) * 0.2 * dt;
        if (p.y < -10) Object.assign(p, newMote(false));
        if (p.y > H + 12) { p.y = -8; p.x = Math.random() * W; }
      }
      const glow = p.glow && depthT > 0.3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU);
      if (glow) { ctx.fillStyle = `rgba(124,243,230,${p.a * depthT})`; ctx.shadowColor = 'rgba(124,243,230,.9)'; ctx.shadowBlur = 8; }
      else { ctx.fillStyle = `rgba(220,245,250,${p.a * (0.6 - depthT * 0.3)})`; ctx.shadowBlur = 0; }
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // jellyfish fade in below the thermocline, the anglerfish light only in the trench
    const ja = Math.max(0, Math.min(1, (depthT - 0.25) / 0.3)) * 0.8;
    for (const j of jellies) {
      if (!still) { j.ph += 0.03 * dt; j.y -= (0.12 + Math.max(0, Math.sin(j.ph)) * 0.5) * dt * j.s; }
      if (j.y < -100) Object.assign(j, newJelly(false));
      if (ja > 0.01) jelly(ctx, j, clock, ja);
    }
    const la = Math.max(0, Math.min(1, (depthT - 0.7) / 0.2));
    if (la > 0.01 && W > 700) anglerLure(ctx, clock, la);
    seafloor(ctx, clock, Math.max(0, Math.min(1, (depthT - 0.78) / 0.18)));

    // the ambient school
    for (const k of school) {
      if (!still) {
        k.t += dt / 60;
        // occasional startle: a tail flip that jolts it backwards
        if (k.flip <= 0 && Math.random() < 0.0015 * dt) k.flip = 1;
        const back = k.flip > 0 ? -2.6 * k.flip : 1;
        k.x += k.vx * back * dt; k.y += (k.vy + Math.sin(k.t * 0.8) * 0.12) * dt;
        k.flip = Math.max(0, k.flip - 0.03 * dt);
        if (k.x < -80 || k.x > W + 80) Object.assign(k, newSwimmer(false));
      }
      const tilt = Math.sin(k.t * 0.8) * 0.12;
      ctx.save(); ctx.translate(k.x, k.y); if (k.vx < 0) ctx.scale(-1, 1);
      krill(ctx, 0, 0, tilt, k.s, k.t, { beat: 0.7 + k.flip, flip: k.flip, glow: depthT * 1.1, alpha: 0.3 + depthT * 0.35, hue: k.hue });
      ctx.restore();
    }

    // bubbles from answers
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (!still) { b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 0.96; b.vy = b.vy * 0.97 - 0.035 * dt; b.life -= b.decay * dt; }
      if (b.life <= 0) { bubbles.splice(i, 1); continue; }
      ctx.globalAlpha = b.life;
      ctx.strokeStyle = 'rgba(230,250,255,.85)'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // the krill riding the sounding line, head down, paddling harder while it sinks
    const r = marker.getBoundingClientRect();
    markerPos = { x: r.left + 9, y: r.top + r.height / 2 };
    markerFalling = Math.max(0, markerFalling - dt / 60);
    const sinking = Math.abs(markerPos.y - (frame.lastY || markerPos.y)) > 0.05 || markerFalling > 0;
    frame.lastY = markerPos.y;
    const sway = Math.sin(clock * 1.6) * 0.12;
    krill(ctx, markerPos.x, markerPos.y, Math.PI / 2 + sway, W < 720 ? 0.36 : 0.62, clock, { beat: sinking ? 2 : 0.6, glow: 0.5 + depthT * 0.5, flip: sinking ? 0.15 : 0 });

    stepDivers(still ? 0 : dt, clock);
    drawSparks(ctx, still ? 0 : dt);
    if (!still) drawRush(ctx, dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------------- sounding line ---------------- */
  const track = document.getElementById('soundingTrack');
  const readout = document.getElementById('soundingReadout');
  for (let m = 0; m <= MAX_DEPTH; m += 200) {
    const tk = document.createElement('div');
    tk.className = 'tick' + (m % 400 === 0 ? ' major' : '');
    tk.style.top = (m / MAX_DEPTH) * 100 + '%';
    if (m % 400 === 0) tk.dataset.m = m === 0 ? 'surface' : m + ' m';
    track.appendChild(tk);
  }
  let shownDepth = 0, animFrom = 0, animTo = 0, animStart = 0;
  function animateReadout(now) {
    const t = Math.min(1, (now - animStart) / 1100);
    const e = 1 - Math.pow(1 - t, 3);
    shownDepth = Math.round(animFrom + (animTo - animFrom) * e);
    readout.textContent = shownDepth.toLocaleString() + ' m';
    if (t < 1) requestAnimationFrame(animateReadout);
  }
  function setDepth(metres, opts = {}) {
    const m = Math.max(0, Math.min(MAX_DEPTH, metres));
    if (m - animTo > 30 && !opts.instant) rush = Math.min(1, 0.35 + (m - animTo) / 500);
    depthTarget = Math.pow(m / MAX_DEPTH, 0.75);
    marker.style.top = (m / MAX_DEPTH) * 100 + '%';
    animFrom = shownDepth; animTo = Math.round(m); animStart = performance.now();
    if (opts.instant || reduce.matches) { depthT = depthTarget; shownDepth = animTo; readout.textContent = animTo.toLocaleString() + ' m'; }
    else requestAnimationFrame(animateReadout);
  }

  /* ---------------- sound: synthesized, no files ---------------- */
  let actx = null;
  const sound = { on: true };
  function ac() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur, type = 'sine', vol = 0.12, slide = 0, when = 0) {
    if (!sound.on) return;
    const a = ac(); if (!a) return;
    const t0 = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  const sfx = {
    hit(tier) {
      const base = { p: 880, c: 820, s: 700, r: 560, d: 440, k: 330 }[tier] || 700;
      tone(base, 0.5, 'sine', 0.14, -base * 0.3);
      tone(base * 1.5, 0.35, 'sine', 0.05, 0, 0.06);
      if (tier === 'r' || tier === 'd' || tier === 'k') tone(base / 2, 1.2, 'sine', 0.07, -base * 0.15, 0.1); // sonar tail
      if (tier === 'k') { tone(base * 2, 0.9, 'triangle', 0.06, 0, 0.18); tone(base * 3, 1.1, 'sine', 0.04, 0, 0.32); tone(base * 4, 1.3, 'sine', 0.025, 0, 0.46); }
    },
    miss() { tone(180, 0.22, 'triangle', 0.12, -60); },
    tick() { tone(1200, 0.05, 'square', 0.025); },
    out() { tone(240, 0.9, 'sine', 0.12, -150); },
    start() { tone(520, 0.25, 'sine', 0.08, 300); tone(260, 0.6, 'sine', 0.06, -80, 0.12); },
  };

  window.KFx = { setDepth, burst, sfx, sound, MAX_DEPTH, krill };
})();
