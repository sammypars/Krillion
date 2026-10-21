// Ocean, particles, sounding line and sound.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('fx');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let depthT = 0;   // 0 (surface) .. 1 (trench), eased toward target
  let depthTarget = 0;
  const MAX_DEPTH = 2800;
  const parts = [];
  const bursts = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function seed() {
    parts.length = 0;
    const n = Math.round((W * H) / 14000);
    for (let i = 0; i < n; i++) parts.push(newPart(true));
  }
  function newPart(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: Math.random() * 2.2 + 0.4,
      v: Math.random() * 0.35 + 0.08,
      w: Math.random() * Math.PI * 2,
      a: Math.random() * 0.5 + 0.15,
      glow: Math.random() < 0.12,
    };
  }
  seed();
  window.addEventListener('resize', seed);

  function burst(x, y, kind) {
    if (reduce.matches) return;
    const krill = kind === 'k';
    const n = krill ? 70 : kind === 'd' || kind === 'r' ? 34 : 18;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = (krill ? 4.2 : 2.6) * (0.4 + Math.random());
      bursts.push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - (krill ? 1 : 1.6),
        life: 1, decay: 0.012 + Math.random() * 0.014, r: krill ? 2 + Math.random() * 3 : 1.5 + Math.random() * 3.5,
        krill,
      });
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(48, now - last) / 16.67; last = now;
    depthT += (depthTarget - depthT) * Math.min(1, 0.04 * dt);
    document.documentElement.style.setProperty('--depth', depthT.toFixed(4));
    ctx.clearRect(0, 0, W, H);

    const snow = depthT; // deeper water: slow falling marine snow instead of rising bubbles
    for (const p of parts) {
      if (!reduce.matches) {
        p.w += 0.01 * dt;
        const rise = p.v * (1 - snow * 1.4);
        p.y -= rise * dt;
        p.x += Math.sin(p.w) * 0.2 * dt;
        if (p.y < -10) Object.assign(p, newPart(false));
        if (p.y > H + 12) { p.y = -8; p.x = Math.random() * W; }
      }
      const glow = p.glow && depthT > 0.35;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (glow) {
        ctx.fillStyle = `rgba(124, 243, 230, ${p.a * depthT})`;
        ctx.shadowColor = 'rgba(124,243,230,.9)'; ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(220, 245, 250, ${p.a * (0.65 - depthT * 0.35)})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= 0.97; b.vy = b.vy * 0.97 - 0.03 * dt; b.life -= b.decay * dt;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, b.life);
      if (b.krill) {
        ctx.translate(b.x, b.y); ctx.rotate(Math.atan2(b.vy, b.vx));
        ctx.fillStyle = '#ff7aa2'; ctx.shadowColor = '#ff7aa2'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.ellipse(0, 0, b.r * 2.2, b.r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(230,250,255,.85)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Sounding line
  const track = document.getElementById('soundingTrack');
  const marker = document.getElementById('soundingMarker');
  const readout = document.getElementById('soundingReadout');
  for (let m = 0; m <= MAX_DEPTH; m += 200) {
    const t = document.createElement('div');
    t.className = 'tick' + (m % 400 === 0 ? ' major' : '');
    t.style.top = (m / MAX_DEPTH) * 100 + '%';
    if (m % 400 === 0) t.dataset.m = m === 0 ? 'surface' : m + ' m';
    track.appendChild(t);
  }
  let shownDepth = 0, animFrom = 0, animTo = 0, animStart = 0;
  function animateReadout(now) {
    const t = Math.min(1, (now - animStart) / 900);
    const e = 1 - Math.pow(1 - t, 3);
    shownDepth = Math.round(animFrom + (animTo - animFrom) * e);
    readout.textContent = shownDepth.toLocaleString() + ' m';
    if (t < 1) requestAnimationFrame(animateReadout);
  }

  function setDepth(metres, opts = {}) {
    const m = Math.max(0, Math.min(MAX_DEPTH, metres));
    depthTarget = Math.pow(m / MAX_DEPTH, 0.75);
    marker.style.top = (m / MAX_DEPTH) * 100 + '%';
    animFrom = shownDepth; animTo = Math.round(m); animStart = performance.now();
    if (opts.instant || reduce.matches) { depthT = depthTarget; shownDepth = animTo; readout.textContent = animTo.toLocaleString() + ' m'; }
    else requestAnimationFrame(animateReadout);
  }

  // Sound: small synthesized sonar pings, no audio files.
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
      if (tier === 'k') { tone(base * 2, 0.9, 'triangle', 0.06, 0, 0.18); tone(base * 3, 1.1, 'sine', 0.04, 0, 0.32); }
    },
    miss() { tone(180, 0.22, 'triangle', 0.12, -60); },
    tick() { tone(1200, 0.05, 'square', 0.025); },
    out() { tone(240, 0.9, 'sine', 0.12, -150); },
    start() { tone(520, 0.25, 'sine', 0.08, 300); tone(260, 0.6, 'sine', 0.06, -80, 0.12); },
  };

  window.KFx = { setDepth, burst, sfx, sound, MAX_DEPTH };
})();
