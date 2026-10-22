// Extra play modes: Sonar Sweep, Blitz, Abyss, Pass & Play, Challenge a friend.
(function () {
  const A = window.KApp, B = window.KBank, FX = window.KFx, C = window.KRILLION_CONFIG, N = window.KNet;
  const T = B.TIERS;
  const $ = (s, el = document) => el.querySelector(s);
  const app = document.getElementById('app');
  const { esc, fmt, toast } = A;

  const stat = (id) => (A.S.modes[id] = A.S.modes[id] || { best: 0, plays: 0 });
  function record(id, score, extra = {}) {
    const s = stat(id); s.plays++;
    const isBest = score > (s.best || 0);
    if (isBest) s.best = score;
    Object.assign(s, extra); A.save();
    return isBest;
  }
  const rnd = () => Math.random();
  const pickPrompt = (exclude = []) => {
    const pool = B.prompts.filter((p) => !exclude.includes(p.id) && p.answers.length > 25);
    return pool[Math.floor(rnd() * pool.length)];
  };
  function startTimer(seconds, onTick, onEnd, opts = {}) {
    const st = { left: seconds, paused: false };
    let last = performance.now(), lastWhole = Math.ceil(seconds);
    const id = setInterval(() => {
      const now = performance.now();
      if (!st.paused) st.left = Math.max(0, st.left - (now - last) / 1000);
      last = now;
      const w = Math.ceil(st.left);
      if (w !== lastWhole) { lastWhole = w; if (w <= (opts.tickFrom || 5) && w > 0) FX.sfx.tick(); }
      onTick(st);
      if (st.left <= 0) { clearInterval(id); onEnd(); }
    }, 80);
    A.setTimer(id);
    return st;
  }
  const guessForm = (placeholder = 'Type an answer', btn = 'Dive') => `
    <form class="guess" id="guessForm" autocomplete="off">
      <input id="guessInput" type="text" placeholder="${placeholder}" aria-label="Your answer" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go">
      <button class="btn" type="submit">${btn}</button>
    </form>`;
  function bindGuess(fn) {
    const inp = $('#guessInput'); inp.focus();
    $('#guessForm').onsubmit = (e) => { e.preventDefault(); const v = inp.value.trim(); if (v) fn(v, inp); };
    return inp;
  }
  function shakeForm() { const f = $('#guessForm'); if (!f) return; f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
  function countdown(label, then) {
    A.screen(`<div class="countdown" aria-live="assertive"><p class="dive-no">${esc(label)}</p><b id="cdNum">3</b></div>`);
    FX.setDepth(0);
    let n = 3; FX.sfx.tick();
    const id = setInterval(() => {
      n--;
      const el = $('#cdNum'); if (!el) { clearInterval(id); return; }
      if (n > 0) { el.textContent = n; el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; FX.sfx.tick(); }
      else { clearInterval(id); FX.sfx.start(); then(); }
    }, 750);
    A.setTimer(id);
  }
  const tank = (id = 'tank') => `<div class="tank" id="${id}"><div class="tank-fill" id="${id}Fill"></div></div>`;
  function paintTank(id, frac, low) {
    const f = $('#' + id + 'Fill'); if (!f) return;
    f.style.transform = `scaleX(${Math.max(0, Math.min(1, frac))})`;
    $('#' + id).classList.toggle('low', !!low);
  }
  function endScreen({ kicker, big, unit, line, emoji, actions, body }) {
    A.screen(`
      <div class="sum-hero">
        <p class="dive-no">${kicker}</p>
        <h1 class="sum-depth"><span id="countUp">0</span><small>${unit}</small></h1>
        <p class="sum-band">${line}</p>
        ${emoji ? `<p class="sum-emoji">${emoji}</p>` : ''}
        <div class="sum-actions">${actions}</div>
      </div>${body || ''}`);
    A.countUp($('#countUp'), big);
  }

  /* ======================= Sonar Sweep ======================= */
  // One prompt, 60 seconds, name as many answers as you can. Each find lands on the sonar at its depth.
  const SONAR_SECS = 60;
  function sonar() {
    const p = pickPrompt();
    countdown('Sonar Sweep: ' + p.q, () => sonarPlay(p));
  }
  function sonarPlay(p) {
    const run = { mode: 'sonar', phase: 'ask', prompt: p, found: [], score: 0, chain: 1, lastHit: 0, tried: new Set() };
    A.setRun(run);
    A.screen(`
      <div class="game-top">
        <div class="score-now"><span id="scoreNow">0</span> pts <small id="foundN">0 found</small></div>
        <div class="chain" id="chain" aria-live="polite"></div>
      </div>
      <p class="prompt-cat">${esc(p.cat)}. Name as many as you can.</p>
      <h1 class="prompt-q" aria-label="${esc(p.q)}">${A.words(p.q)}</h1>
      <div class="sonar-wrap"><canvas id="sonar" width="720" height="720" aria-label="Sonar display of your answers"></canvas>
        <div class="sonar-time"><b id="timeLeft">${SONAR_SECS}</b><small>seconds</small></div></div>
      ${guessForm('Keep them coming', 'Ping')}
      <div class="chips found-chips" id="found"></div>`);
    const blips = [];
    const cv = $('#sonar'), g = cv.getContext('2d');
    let ang = 0, lastT = performance.now();
    const ringR = { p: 0.2, c: 0.32, s: 0.46, r: 0.62, d: 0.78, k: 0.92 };
    const col = { p: '#a7ecb1', c: '#cdbbff', s: '#69d8e4', r: '#5aa6ff', d: '#b38bff', k: '#ff7aa2' };
    function draw(now) {
      if (!cv.isConnected) return;
      const dt = (now - lastT) / 1000; lastT = now;
      ang = (ang + dt * 2.2) % (Math.PI * 2);
      const W = 720, R = 340, cx = 360, cy = 360;
      g.clearRect(0, 0, W, W);
      const bg = g.createRadialGradient(cx, cy, 10, cx, cy, R);
      bg.addColorStop(0, 'rgba(10,60,70,.55)'); bg.addColorStop(1, 'rgba(2,16,28,.8)');
      g.fillStyle = bg; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
      g.strokeStyle = 'rgba(124,243,230,.18)'; g.lineWidth = 1.5;
      for (const k of B.ORDER) { g.beginPath(); g.arc(cx, cy, R * ringR[k], 0, 7); g.stroke(); }
      g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke();
      // the sweep
      const sw = g.createConicGradient ? g.createConicGradient(ang - 0.9, cx, cy) : null;
      if (sw) { sw.addColorStop(0, 'rgba(124,243,230,0)'); sw.addColorStop(0.14, 'rgba(124,243,230,.32)'); sw.addColorStop(0.145, 'rgba(124,243,230,0)'); g.fillStyle = sw; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(160,255,245,.9)'; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); g.stroke();
      for (const b of blips) {
        const diff = ((ang - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.12) b.glow = 1;
        b.glow = Math.max(0.35, b.glow - dt * 0.6);
        b.born = Math.min(1, b.born + dt * 2.5);
        const x = cx + Math.cos(b.a) * R * b.r, y = cy + Math.sin(b.a) * R * b.r;
        g.save(); g.globalAlpha = b.glow;
        g.shadowColor = col[b.t]; g.shadowBlur = 24 * b.glow;
        g.fillStyle = col[b.t];
        g.beginPath(); g.arc(x, y, (b.t === 'k' ? 11 : 8) * (0.5 + 0.5 * b.born), 0, 7); g.fill();
        if (b.born < 1) { g.strokeStyle = col[b.t]; g.lineWidth = 2; g.globalAlpha = 1 - b.born; g.beginPath(); g.arc(x, y, 8 + b.born * 46, 0, 7); g.stroke(); }
        g.globalAlpha = Math.min(1, b.glow + 0.2); g.shadowBlur = 0; g.fillStyle = '#eaf7f6';
        g.font = '600 20px "Atkinson Hyperlegible", system-ui'; g.textAlign = 'center';
        g.fillText(b.label.length > 16 ? b.label.slice(0, 15) + '…' : b.label, x, y - 16);
        g.restore();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    const tmr = startTimer(SONAR_SECS, (st) => { const t = $('#timeLeft'); if (t) t.textContent = Math.ceil(st.left); }, () => sonarEnd(run), { tickFrom: 10 });
    bindGuess((v, inp) => {
      if (run.phase !== 'ask') return;
      const k = B.key(v);
      if (run.tried.has(k)) { toast('Already pinged that one.'); inp.select(); return; }
      A.ripple(inp);
      const hit = B.match(p, v);
      if (hit && hit.near) { A.closeCall(inp); return; }
      run.tried.add(k);
      inp.value = '';
      if (!hit || run.found.some((f) => f.id === hit.id)) {
        if (hit) { toast(`Already found ${hit.display}.`); return; }
        tmr.left = Math.max(0, tmr.left - 1); FX.sfx.miss(); shakeForm(); run.chain = 1; paintChain(); return;
      }
      const now = performance.now();
      run.chain = now - run.lastHit < 5000 ? Math.min(3, run.chain + 0.25) : 1;
      run.lastHit = now;
      const pts = Math.round(T[hit.tier].pts * run.chain);
      run.score += pts; run.found.push(hit);
      A.checkNiche(p, hit.tier);
      blips.push({ a: rnd() * Math.PI * 2, r: ringR[hit.tier] + (rnd() - 0.5) * 0.06, t: hit.tier, label: hit.display, glow: 1, born: 0 });
      FX.sfx.hit(hit.tier);
      const r = cv.getBoundingClientRect();
      if (hit.tier === 'k' || hit.tier === 'd') FX.burst(r.left + r.width / 2, r.top + r.height / 2, hit.tier);
      if (hit.tier === 'k') A.shake(1);
      FX.setDepth(run.score * 2);
      $('#scoreNow').textContent = fmt(run.score);
      $('#foundN').textContent = `${run.found.length} found`;
      $('#found').insertAdjacentHTML('afterbegin', `<span class="chip tc-${hit.tier} pop"><i>${T[hit.tier].emoji}</i>${esc(hit.display)} <b>+${pts}</b></span>`);
      paintChain();
    });
    function paintChain() { const c = $('#chain'); if (c) c.innerHTML = run.chain > 1 ? `<b>×${run.chain.toFixed(2).replace(/0$/, '')}</b> chain` : ''; }
  }
  function sonarEnd(run) {
    run.phase = 'done';
    FX.sfx.out();
    const p = run.prompt;
    const isBest = record('sonar', run.score);
    if (run.found.length >= 10) setTimeout(() => A.award('sonar10'), 1500);
    const got = new Set(run.found.map((f) => f.id));
    const missed = ['k', 'd', 'r'].flatMap((t) => p.byTier[t]).filter((a) => !got.has(a.id));
    const tally = {}; for (const f of run.found) tally[f.tier] = (tally[f.tier] || 0) + 1;
    endScreen({
      kicker: 'Sonar Sweep: ' + esc(p.q), big: run.score, unit: 'pts',
      line: `${isBest && run.score ? 'New best. ' : ''}You found <span>${run.found.length}</span> of ${p.answers.length} answers.`,
      emoji: B.ORDER.filter((t) => tally[t]).map((t) => `${T[t].emoji}×${tally[t]}`).join(' ') || B.MISS_EMOJI,
      actions: `<button class="btn krill" id="again">Sweep another prompt</button><button class="btn ghost" id="toHome">Back to the surface</button>`,
      body: `<div class="panel"><div class="panel-head"><h3>What you found</h3></div><div class="chips">${run.found.map((f) => `<span class="chip tc-${f.tier}"><i>${T[f.tier].emoji}</i>${esc(f.display)}</span>`).join('') || '<span class="muted">Nothing this time.</span>'}</div></div>
        <div class="panel"><div class="panel-head"><h3>Still down there</h3><span class="faint">${missed.length} rare answers you didn’t find</span></div>
        <div class="chips">${B.shuffle(missed, rnd).slice(0, 14).map((a) => `<span class="chip tc-${a.tier}"><i>${T[a.tier].emoji}</i>${esc(a.display)}</span>`).join('')}</div>
        ${p.krill && !got.has(p.krill.id) ? `<p class="k" style="margin-top:12px">One in a Krillion: <b style="color:var(--krill)">${esc(p.krill.display)}</b></p>` : ''}</div>`,
    });
    $('#again').onclick = sonar; $('#toHome').onclick = A.home;
  }

  /* ======================= Blitz ======================= */
  // 60 seconds, prompt after prompt. Any answer that counts moves you on; streaks multiply.
  const BLITZ_SECS = 60;
  function blitz() { countdown('Blitz: 60 seconds, as many prompts as you can', blitzPlay); }
  function blitzPlay() {
    const run = { mode: 'blitz', phase: 'ask', queue: B.shuffle(B.prompts, rnd), score: 0, cleared: 0, streak: 0, log: [] };
    A.setRun(run);
    A.screen(`
      <div class="game-top">
        <div class="score-now"><span id="scoreNow">0</span> pts <small id="clearedN">0 cleared</small></div>
        <button class="btn ghost small" id="skipBtn">Skip</button>
      </div>
      ${tank()}
      <div class="tank-label"><span id="streakL">Streak 0</span><b id="timeLeft">${BLITZ_SECS}s</b></div>
      <div id="blitzStage" class="blitz-stage"></div>
      ${guessForm('Anything that counts', 'Go')}
      <div class="blitz-log" id="blitzLog" aria-live="polite"></div>`);
    const tmr = startTimer(BLITZ_SECS, (st) => { paintTank('tank', st.left / BLITZ_SECS, st.left < 10); $('#timeLeft').textContent = Math.ceil(st.left) + 's'; }, () => blitzEnd(run), { tickFrom: 10 });
    const show = () => {
      run.prompt = run.queue.pop() || (run.queue = B.shuffle(B.prompts, rnd)).pop();
      $('#blitzStage').innerHTML = `<div class="blitz-card"><p class="prompt-cat">${esc(run.prompt.cat)}</p><h1 class="prompt-q" aria-label="${esc(run.prompt.q)}">${A.words(run.prompt.q)}</h1></div>`;
    };
    const mult = () => (run.streak >= 6 ? 2 : run.streak >= 3 ? 1.5 : 1);
    const paint = () => { $('#scoreNow').textContent = fmt(run.score); $('#clearedN').textContent = `${run.cleared} cleared`; $('#streakL').innerHTML = `Streak ${run.streak}${mult() > 1 ? ` <b class="mult">×${mult()}</b>` : ''}`; };
    show();
    $('#skipBtn').onclick = () => { if (run.phase !== 'ask') return; run.streak = 0; run.log.push({ q: run.prompt.q, tier: null }); paint(); exitCard('skip'); setTimeout(show, 180); };
    function exitCard(kind) { const c = $('.blitz-card'); if (c) c.classList.add(kind === 'skip' ? 'out-skip' : 'out-hit'); }
    bindGuess((v, inp) => {
      if (run.phase !== 'ask') return;
      const hit = B.match(run.prompt, v);
      A.ripple(inp);
      if (hit && hit.near) { A.closeCall(inp); return; }
      inp.value = '';
      if (!hit) { tmr.left = Math.max(0, tmr.left - 2); run.streak = 0; FX.sfx.miss(); shakeForm(); paint(); return; }
      run.streak++; run.cleared++;
      const pts = Math.round(T[hit.tier].pts * mult());
      run.score += pts;
      A.checkNiche(run.prompt, hit.tier);
      run.log.push({ q: run.prompt.q, tier: hit.tier, answer: hit.display, pts });
      FX.sfx.hit(hit.tier);
      if (hit.tier === 'k') { A.shake(0.8); A.award('krill'); }
      const st = $('#blitzStage').getBoundingClientRect();
      FX.burst(st.left + st.width / 2, st.top + 40, hit.tier);
      FX.setDepth(run.score * 2);
      $('#blitzLog').insertAdjacentHTML('afterbegin', `<span class="chip tc-${hit.tier} pop"><i>${T[hit.tier].emoji}</i>${esc(hit.display)} <b>+${pts}</b></span>`);
      paint(); exitCard('hit');
      setTimeout(show, 200);
    });
  }
  function blitzEnd(run) {
    run.phase = 'done'; FX.sfx.out();
    const isBest = record('blitz', run.score, { bestCleared: Math.max(stat('blitz').bestCleared || 0, run.cleared) });
    if (run.cleared >= 12) setTimeout(() => A.award('blitz12'), 1500);
    endScreen({
      kicker: 'Blitz', big: run.score, unit: 'pts',
      line: `${isBest && run.score ? 'New best. ' : ''}You cleared <span>${run.cleared}</span> prompt${run.cleared === 1 ? '' : 's'} in 60 seconds.`,
      emoji: run.log.map((l) => (l.tier ? T[l.tier].emoji : '⏭️')).join(''),
      actions: `<button class="btn krill" id="again">Blitz again</button><button class="btn ghost" id="toHome">Back to the surface</button>`,
      body: `<div class="panel"><ol class="rounds">${run.log.map((l) => `<li class="${l.tier ? 'tc-' + l.tier : 'tc-x'}"><span class="em">${l.tier ? T[l.tier].emoji : '⏭️'}</span><div><div class="q">${esc(l.q)}</div><div class="a ${l.tier ? '' : 'miss'}">${l.tier ? esc(l.answer) : 'Skipped'}</div></div><span class="pts">${l.pts ? '+' + l.pts : ''}</span></li>`).join('') || '<li class="empty">Nothing cleared.</li>'}</ol></div>`,
    });
    $('#again').onclick = blitz; $('#toHome').onclick = A.home;
  }

  /* ======================= Abyss ======================= */
  // Only Rare, Deep Cut and One in a Krillion count. A shallow answer cracks your hull. Three cracks and you implode.
  const ABYSS_SECS = 30;
  function abyss() { countdown('The Abyss: only rare answers count', abyssPlay); }
  function abyssPlay() {
    const run = { mode: 'abyss', phase: 'ask', hull: 3, score: 0, cleared: 0, seen: [], log: [] };
    A.setRun(run);
    abyssPrompt(run);
  }
  function hullSvg(n) {
    return [0, 1, 2].map((i) => `<svg class="porthole ${i < n ? '' : 'cracked'}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle cx="20" cy="20" r="11" class="glass"/>
      <path class="crack" d="M20 9 L18 16 L23 19 L17 24 L21 31 M18 16 L12 14 M23 19 L29 17 M17 24 L11 27"/></svg>`).join('');
  }
  function abyssPrompt(run) {
    const p = pickPrompt(run.seen); run.seen.push(p.id); run.prompt = p; run.phase = 'ask'; run.tried = new Set();
    A.screen(`
      <div class="game-top abyss-top">
        <div class="score-now"><span id="scoreNow">${fmt(run.score)}</span> pts <small>${run.cleared} survived</small></div>
        <div class="hull" id="hull" aria-label="Hull integrity ${run.hull} of 3">${hullSvg(run.hull)}</div>
      </div>
      <p class="prompt-cat">${esc(p.cat)}. Rare or deeper only.</p>
      <h1 class="prompt-q" aria-label="${esc(p.q)}">${A.words(p.q)}</h1>
      ${tank()}
      <div class="tank-label"><span>Air</span><b id="timeLeft">${ABYSS_SECS}s</b></div>
      ${guessForm('Go deep or crack', 'Dive')}
      <div class="tried" id="tried"></div>
      <p class="hint-line">Plankton, Too Clever and Schooler answers crack the hull. Unlisted guesses cost 2 seconds.</p>`);
    document.body.classList.add('abyss-mode');
    FX.setDepth(1800 + Math.min(1000, run.score * 2));
    const tmr = startTimer(ABYSS_SECS, (st) => { paintTank('tank', st.left / ABYSS_SECS, st.left < 8); const t = $('#timeLeft'); if (t) t.textContent = Math.ceil(st.left) + 's'; }, () => crack(run, null, 'Out of air'));
    bindGuess((v, inp) => {
      if (run.phase !== 'ask') return;
      const k = B.key(v);
      if (run.tried.has(k)) { toast('Already tried.'); return; }
      run.tried.add(k);
      const hit = B.match(p, v);
      A.ripple(inp);
      if (hit && hit.near) { run.tried.delete(k); A.closeCall(inp); return; }
      inp.value = '';
      if (!hit) { tmr.left = Math.max(0, tmr.left - 2); FX.sfx.miss(); shakeForm(); $('#tried').insertAdjacentHTML('beforeend', `<span>${esc(v)}</span>`); return; }
      if (['p', 'c', 's'].includes(hit.tier)) {
        $('#tried').insertAdjacentHTML('beforeend', `<span class="shallow">${esc(hit.display)}: ${T[hit.tier].name}</span>`);
        crack(run, hit, 'Too shallow');
        if (run.hull > 0) { inp.focus(); }
        return;
      }
      A.stopTimer(); run.phase = 'reveal';
      run.score += T[hit.tier].pts; run.cleared++;
      A.checkNiche(p, hit.tier);
      run.log.push({ q: p.q, tier: hit.tier, answer: hit.display });
      FX.sfx.hit(hit.tier); A.shake(hit.tier === 'k' ? 1.3 : 0.5);
      if (hit.tier === 'k') A.award('krill');
      if (run.cleared >= 5) A.award('abyss5');
      const r = $('.prompt-q').getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + 60, hit.tier);
      $('#tried').innerHTML = `<div class="reveal tc-${hit.tier}"><span class="tier-badge"><span class="em">${T[hit.tier].emoji}</span>${esc(T[hit.tier].name)}</span><h2 class="reveal-answer" style="font-size:36px" aria-label="${esc(hit.display)}">${A.letters(hit.display)}</h2></div>`;
      setTimeout(() => { if (A.getRun() === run) abyssPrompt(run); }, 1500);
    });
  }
  function crack(run, hit, why) {
    run.hull--;
    FX.sfx.out(); A.shake(1.6); A.vibrate([80, 40, 120]);
    document.body.classList.remove('crack-flash'); void document.body.offsetWidth; document.body.classList.add('crack-flash');
    const h = $('#hull'); if (h) h.innerHTML = hullSvg(run.hull);
    toast(why === 'Out of air' ? 'Out of air. The hull cracks.' : `${hit.display} is too shallow. The hull cracks.`);
    if (!hit) run.log.push({ q: run.prompt.q, tier: null });
    if (run.hull <= 0) { A.stopTimer(); run.phase = 'done'; return setTimeout(() => abyssEnd(run), 900); }
    if (!hit) { A.stopTimer(); setTimeout(() => { if (A.getRun() === run) abyssPrompt(run); }, 1000); }
  }
  function abyssEnd(run) {
    document.body.classList.remove('abyss-mode');
    const isBest = record('abyss', run.score, { bestCleared: Math.max(stat('abyss').bestCleared || 0, run.cleared) });
    endScreen({
      kicker: 'The Abyss', big: run.score, unit: 'pts',
      line: `${isBest && run.score ? 'New best. ' : ''}The hull gave out after <span>${run.cleared}</span> prompt${run.cleared === 1 ? '' : 's'}.`,
      emoji: run.log.map((l) => (l.tier ? T[l.tier].emoji : '💥')).join(''),
      actions: `<button class="btn krill" id="again">Descend again</button><button class="btn ghost" id="toHome">Back to the surface</button>`,
    });
    $('#again').onclick = abyss; $('#toHome').onclick = A.home;
  }

  /* ======================= Pass & Play ======================= */
  // 2-6 people, one device. Everyone answers the same prompt in secret. Matching answers wash out.
  const PARTY_SECS = 20;
  function party() {
    const saved = (A.S.modes.party && A.S.modes.party.names) || ['', ''];
    const render = (names, rounds) => {
      A.screen(`
        <div class="home-hero" style="padding-bottom:6px">
          <p class="dive-no">Pass &amp; Play</p>
          <h1 class="home-title" style="font-size:clamp(40px,10vw,64px)">Same prompt. Secret answers.</h1>
          <p class="home-lede">Take turns on this device. Rarer answers score more, and if two of you give the same answer, you both wash out.</p>
        </div>
        <form id="partyForm" class="party-form">
          <div id="names">${names.map((n, i) => `<div class="field name-row"><label for="pn${i}">Diver ${i + 1}</label><div><input id="pn${i}" type="text" maxlength="16" value="${esc(n)}" placeholder="Name"${i > 1 ? `><button type="button" class="icon-btn" data-rm="${i}" aria-label="Remove diver ${i + 1}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` : '>'}</div></div>`).join('')}</div>
          ${names.length < 6 ? '<button type="button" class="btn ghost small" id="addName">Add a diver</button>' : ''}
          <div class="field"><label>Rounds</label><div class="seg">${[3, 5, 7].map((r) => `<button type="button" class="tab" aria-selected="${r === rounds}" data-rounds="${r}">${r}</button>`).join('')}</div></div>
          <button class="btn krill wide" type="submit">Start the dive</button>
        </form>`);
      const read = () => [...app.querySelectorAll('#names input')].map((x) => x.value);
      const add = $('#addName'); if (add) add.onclick = () => render([...read(), ''], rounds);
      app.querySelectorAll('[data-rm]').forEach((b) => b.onclick = () => { const n = read(); n.splice(+b.dataset.rm, 1); render(n, rounds); });
      app.querySelectorAll('[data-rounds]').forEach((b) => b.onclick = () => render(read(), +b.dataset.rounds));
      $('#partyForm').onsubmit = (e) => {
        e.preventDefault();
        const n = read().map((x, i) => x.trim() || `Diver ${i + 1}`);
        if (new Set(n.map((x) => x.toLowerCase())).size !== n.length) { toast('Give everyone a different name.'); return; }
        stat('party').names = n; A.save();
        const players = n.map((name) => ({ name, score: 0, hist: [] }));
        const ps = []; while (ps.length < rounds) { const p = pickPrompt(ps.map((x) => x.id)); ps.push(p); }
        partyRound({ mode: 'party', players, prompts: ps, round: 0, phase: 'ask' }, 0);
      };
    };
    render(saved.length >= 2 ? saved : ['', ''], 5);
  }
  function partyRound(game, pi) {
    A.setRun(game);
    const p = game.prompts[game.round], pl = game.players[pi];
    if (pi === 0) game.answers = [];
    A.screen(`
      <div class="pass-screen">
        <p class="dive-no">Round ${game.round + 1} of ${game.prompts.length}</p>
        <h1 class="home-title" style="font-size:clamp(40px,11vw,72px)">Pass to ${esc(pl.name)}.</h1>
        <p class="home-lede">Everyone else, look away. ${esc(pl.name)} gets ${PARTY_SECS} seconds.</p>
        <button class="btn krill" id="ready">I’m ${esc(pl.name)}, show the prompt</button>
        <div class="party-scores">${game.players.map((x) => `<span><b>${esc(x.name)}</b> ${fmt(x.score)}</span>`).join('')}</div>
      </div>`);
    FX.setDepth(0);
    $('#ready').onclick = () => partyTurn(game, pi, p);
  }
  function partyTurn(game, pi, p) {
    const pl = game.players[pi];
    let locked = null; const tried = [];
    A.screen(`
      <div class="game-top"><div class="score-now">${esc(pl.name)} <small>round ${game.round + 1}</small></div></div>
      <p class="prompt-cat">${esc(p.cat)}</p>
      <h1 class="prompt-q" aria-label="${esc(p.q)}">${A.words(p.q)}</h1>
      ${tank()}<div class="tank-label"><span>Air</span><b id="timeLeft">${PARTY_SECS}s</b></div>
      ${guessForm('Your secret answer', 'Lock in')}
      <div class="tried" id="tried"></div>`);
    const done = () => {
      A.stopTimer();
      game.answers[pi] = locked;
      const box = $('#guessForm'); if (box) box.outerHTML = `<div class="locked">${locked ? 'Locked in. Hide the screen and pass it on.' : 'Out of air. Pass it on.'}</div>`;
      setTimeout(() => {
        if (A.getRun() !== game) return;
        if (pi + 1 < game.players.length) partyRound(game, pi + 1); else partyReveal(game, p);
      }, 1100);
    };
    const tmr = startTimer(PARTY_SECS, (st) => { paintTank('tank', st.left / PARTY_SECS, st.left < 6); const t = $('#timeLeft'); if (t) t.textContent = Math.ceil(st.left) + 's'; }, done);
    bindGuess((v, inp) => {
      if (locked) return;
      const hit = B.match(p, v);
      if (hit && hit.near) { A.closeCall(inp); return; }
      inp.value = '';
      if (!hit) { tried.push(v); tmr.left = Math.max(0, tmr.left - 2); FX.sfx.miss(); shakeForm(); $('#tried').insertAdjacentHTML('beforeend', `<span>${esc(v)}</span>`); return; }
      locked = hit; FX.sfx.hit('s'); done();
    });
  }
  function partyReveal(game, p) {
    const counts = {};
    game.answers.forEach((a) => { if (a) counts[a.id] = (counts[a.id] || 0) + 1; });
    const rows = game.players.map((pl, i) => {
      const a = game.answers[i];
      const washed = a && counts[a.id] > 1;
      const pts = a && !washed ? T[a.tier].pts : 0;
      pl.score += pts; pl.hist.push(a ? (washed ? '🌊' : T[a.tier].emoji) : B.MISS_EMOJI);
      return { pl, a, washed, pts };
    }).sort((x, y) => y.pts - x.pts);
    const last = game.round + 1 >= game.prompts.length;
    A.screen(`
      <p class="dive-no">Round ${game.round + 1} reveal</p>
      <h1 class="prompt-q" style="font-size:clamp(30px,7vw,46px)">${esc(p.q)}</h1>
      <ol class="party-reveal">${rows.map((r, i) => `<li class="${r.a ? (r.washed ? 'tc-x washed' : 'tc-' + r.a.tier) : 'tc-x'}" style="animation-delay:${i * 0.35}s">
        <span class="em">${r.a ? (r.washed ? '🌊' : T[r.a.tier].emoji) : B.MISS_EMOJI}</span>
        <div><b>${esc(r.pl.name)}</b><span>${r.a ? esc(r.a.display) + (r.washed ? ', washed out by a match' : `, ${T[r.a.tier].name}`) : 'No answer'}</span></div>
        <span class="pts">+${r.pts}</span></li>`).join('')}</ol>
      ${p.krill ? `<p class="k" style="margin:14px 0">One in a Krillion was <b style="color:var(--krill)">${esc(p.krill.display)}</b>.</p>` : ''}
      <div class="panel"><div class="panel-head"><h3>Standings</h3></div><ol class="board">${[...game.players].sort((a, b) => b.score - a.score).map((x, i) => A.boardRow(i + 1, x.name, `${fmt(x.score)}`, 'pts', x.hist.join(''), false)).join('')}</ol></div>
      <div class="reveal-actions"><button class="btn krill" id="nextR">${last ? 'Final results' : 'Next round'}</button></div>`);
    const best = rows[0];
    if (best && best.a && !best.washed) setTimeout(() => FX.burst(window.innerWidth / 2, 220, best.a.tier), 400 + 0.35 * 1000);
    $('#nextR').onclick = () => { if (last) partyEnd(game); else { game.round++; partyRound(game, 0); } };
  }
  function partyEnd(game) {
    record('party', 0);
    A.award('party');
    const order = [...game.players].sort((a, b) => b.score - a.score);
    const top = order[0];
    const tie = order.filter((x) => x.score === top.score).length > 1;
    FX.setDepth(Math.min(2800, top.score * 4));
    A.screen(`
      <div class="sum-hero podium-hero">
        <p class="dive-no">Pass &amp; Play results</p>
        <h1 class="home-title" style="font-size:clamp(44px,12vw,84px)">${tie ? 'A tie at the bottom.' : `${esc(top.name)} went deepest.`}</h1>
        <div class="podium">${order.slice(0, 3).map((x, i) => `<div class="pod pod-${i + 1}"><b>${esc(x.name)}</b><span>${fmt(x.score * 4)} m</span><i>${i + 1}</i></div>`).join('')}</div>
      </div>
      <div class="panel"><ol class="board">${order.map((x, i) => A.boardRow(i + 1, x.name, `${fmt(x.score)} pts`, `${fmt(x.score * 4)} m`, x.hist.join(''), false)).join('')}</ol></div>
      <div class="reveal-actions"><button class="btn krill" id="again">Play again</button><button class="btn ghost" id="toHome">Back to the surface</button></div>`);
    setTimeout(() => FX.burst(window.innerWidth / 2, 260, 'k'), 500);
    $('#again').onclick = party; $('#toHome').onclick = A.home;
  }

  /* ======================= Challenge a friend ======================= */
  // Seven prompts travel inside the link, so the friend gets the exact same dive.
  const b64 = { enc: (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''), dec: (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))) };
  function decode(s) {
    try {
      const o = b64.dec(s);
      const ids = (o.i || []).filter((id) => B.byId[id]).slice(0, 7);
      if (ids.length < 3) return null;
      return { ids, name: String(o.n || 'A friend').slice(0, 20), score: Number.isFinite(o.s) ? Math.max(0, Math.min(700, o.s)) : null, tiers: String(o.e || '').slice(0, 40) };
    } catch (e) { return null; }
  }
  function challengeNew() {
    const ids = B.shuffle(B.prompts.map((p) => p.id), rnd).slice(0, 7);
    challengePlay({ ids, name: null, score: null, fresh: true });
  }
  function challengePlay(ch) {
    FX.sfx.start();
    A.setRun({
      mode: 'challenge', label: ch.name ? `vs ${ch.name}` : 'challenge', phase: 'ask', challenge: ch,
      rec: { results: [], remaining: C.roundSeconds, tried: [], score: 0 }, prompts: ch.ids.map((id) => B.byId[id]),
      onFinish: (r) => challengeEnd(r),
    });
    A.nextRound();
  }
  function challengeEnd(r) {
    const ch = r.challenge, rec = r.rec;
    const me = (A.S.player && A.S.player.name) || stat('challenge').name || 'A friend';
    record('challenge', rec.score);
    A.award('challenge');
    const myDepth = A.depthOf(rec.score);
    const theirs = ch.score != null ? A.depthOf(ch.score) : null;
    const verdict = theirs == null ? 'Now send it to someone.' : myDepth > theirs ? `You beat ${esc(ch.name)} by ${fmt(myDepth - theirs)} m.` : myDepth < theirs ? `${esc(ch.name)} wins by ${fmt(theirs - myDepth)} m.` : `Dead even with ${esc(ch.name)}.`;
    history.replaceState(null, '', location.pathname);
    endScreen({
      kicker: ch.name ? `Challenge from ${esc(ch.name)}` : 'Challenge dive', big: myDepth, unit: 'm',
      line: verdict,
      emoji: rec.results.map(A.emojiOf).join('') + (ch.tiers ? `<br><small class="faint">${esc(ch.name)}: ${esc(ch.tiers)}</small>` : ''),
      actions: `<button class="btn krill" id="sendCh">${ch.name ? 'Send it back' : 'Copy challenge link'}</button><button class="btn ghost" id="toHome">Back to the surface</button>`,
      body: `<div class="panel profile-panel">${A.profileSvg(rec.results, { anim: true })}</div>
        <div class="panel">${A.roundsList(rec.results, r.prompts)}</div>
        ${A.S.player ? '' : `<div class="panel"><div class="field"><label for="chName">Your name on the link</label><input id="chName" type="text" maxlength="20" value="${esc(stat('challenge').name || '')}" placeholder="So they know who sent it"></div></div>`}`,
    });
    $('#toHome').onclick = A.home;
    $('#sendCh').onclick = async () => {
      const nameEl = $('#chName');
      const name = (A.S.player && A.S.player.name) || (nameEl && nameEl.value.trim()) || me;
      if (nameEl) { stat('challenge').name = name; A.save(); }
      const link = `${A.SITE}#c=${b64.enc({ i: ch.ids, n: name, s: rec.score, e: rec.results.map(A.emojiOf).join('') })}`;
      const text = `I sank to ${fmt(myDepth)} m on these seven Krillion prompts. Your turn: ${link}`;
      try {
        if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) { await navigator.share({ text }); return; }
        await navigator.clipboard.writeText(link); toast('Link copied. Send it to a friend.');
      } catch (e) { if (e && e.name !== 'AbortError') window.prompt('Copy this link:', link); }
    };
  }

  /* ======================= registry ======================= */
  const art = {
    sonar: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26"/><circle cx="32" cy="32" r="17"/><circle cx="32" cy="32" r="8"/><path d="M32 32 L54 18" class="beam"/><circle cx="46" cy="22" r="3" class="dot"/><circle cx="20" cy="40" r="2.5" class="dot2"/></svg>',
    blitz: '<svg viewBox="0 0 64 64"><path d="M36 6 L14 36 H30 L26 58 L50 26 H34 Z" class="bolt"/></svg>',
    abyss: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="17" class="glass"/><path d="M32 15 L29 26 L36 30 L28 37 L33 48 M29 26 L20 23 M36 30 L45 27" class="crack"/></svg>',
    party: '<svg viewBox="0 0 64 64"><circle cx="22" cy="24" r="8"/><circle cx="42" cy="24" r="8"/><path d="M8 52c2-10 8-15 14-15s12 5 14 15M28 52c2-10 8-15 14-15s12 5 14 15"/></svg>',
    challenge: '<svg viewBox="0 0 64 64"><path d="M10 54 L42 22 M54 54 L22 22"/><path d="M42 22 l6-12 l6 6 z" class="tip"/><path d="M22 22 l-6-12 l-6 6 z" class="tip"/></svg>',
    endless: '<svg viewBox="0 0 64 64"><path d="M16 32c0-7 5-11 10-11 9 0 13 22 22 22 5 0 10-4 10-11s-5-11-10-11c-9 0-13 22-22 22-5 0-10-4-10-11z"/></svg>',
    packs: '<svg viewBox="0 0 64 64"><rect x="14" y="18" width="36" height="38" rx="8"/><path d="M24 18v-4a8 8 0 0 1 16 0v4M14 34h36"/></svg>',
  };
  window.KModes = {
    list: [
      { id: 'sonar', title: 'Sonar Sweep', blurb: 'One prompt, 60 seconds. Name as many answers as you can and watch them light up the sonar.', how: 'gives you one prompt and 60 seconds to name as many answers as you can. Fast finds build a chain multiplier up to ×3.', art: art.sonar, start: sonar, best: () => (stat('sonar').best ? `Best ${fmt(stat('sonar').best)} pts` : '') },
      { id: 'blitz', title: 'Blitz', blurb: 'Sixty seconds of rapid fire. Any answer that counts moves you on. Streaks multiply.', how: 'is 60 seconds of prompt after prompt. Three clears in a row is ×1.5, six is ×2.', art: art.blitz, start: blitz, best: () => (stat('blitz').best ? `Best ${fmt(stat('blitz').best)} pts, ${stat('blitz').bestCleared || 0} cleared` : '') },
      { id: 'abyss', title: 'The Abyss', blurb: 'Hardcore. Only Rare or deeper counts. Shallow answers crack your hull. Three cracks and it’s over.', how: 'only accepts Rare, Deep Cut and One in a Krillion. Anything shallower cracks your hull; three cracks ends the run.', art: art.abyss, start: abyss, best: () => (stat('abyss').best ? `Best ${fmt(stat('abyss').best)} pts, ${stat('abyss').bestCleared || 0} survived` : '') },
      { id: 'party', title: 'Pass & Play', blurb: '2 to 6 friends, one phone. Secret answers, and matching answers wash each other out.', how: 'is for 2 to 6 people on one device. Everyone answers the same prompt in secret, and identical answers score zero.', art: art.party, start: party, best: () => (stat('party').plays ? `${stat('party').plays} game${stat('party').plays === 1 ? '' : 's'} played` : '') },
      { id: 'challenge', title: 'Challenge a friend', blurb: 'Dive seven random prompts, then send the exact same seven to someone else.', how: 'picks seven prompts, then gives you a link so a friend can dive the exact same set and compare.', art: art.challenge, start: challengeNew, best: () => (stat('challenge').best ? `Best ${fmt(A.depthOf(stat('challenge').best))} m` : '') },
    ],
    challenge: { decode, play: (c) => c && challengePlay(c) },
  };
  // the built-in modes get matching artwork
  window.KModes.art = art;
})();
