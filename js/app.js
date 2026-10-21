// Krillion — game flow, screens and persistence.
(function () {
  const C = window.KRILLION_CONFIG;
  const B = window.KBank;
  const N = window.KNet;
  const FX = window.KFx;
  const T = B.TIERS;
  const $ = (s, el = document) => el.querySelector(s);
  const app = document.getElementById('app');
  const SITE = location.origin + location.pathname.replace(/index\.html$/, '');

  /* ---------------- storage ---------------- */
  const KEY = 'krillion.v1';
  let S = load();
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* storage blocked */ }
    s = s || {};
    s.settings = Object.assign({ sound: true }, s.settings);
    s.daily = s.daily || {};
    s.endless = s.endless || { best: 0, runs: [] };
    s.practice = s.practice || { played: 0 };
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
  FX.sound.on = !!S.settings.sound;

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString();
  const isoDay = (d) => d.toISOString().slice(0, 10);
  const today = () => isoDay(new Date());
  const addDays = (day, n) => isoDay(new Date(Date.parse(day + 'T00:00:00Z') + n * 864e5));
  const dayIndex = (day) => Math.round((Date.parse(day + 'T00:00:00Z') - Date.parse(C.launchDay + 'T00:00:00Z')) / 864e5);
  const diveNo = (day) => dayIndex(day) + 1;
  const niceDate = (day) => new Date(day + 'T12:00:00Z').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const depthOf = (score) => score * 4;
  const emojiOf = (r) => (r.tier ? T[r.tier].emoji : B.MISS_EMOJI);

  function toast(msg, ms = 2200) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), ms);
  }
  function screen(html, cls = '') {
    stopTimer();
    app.innerHTML = `<section class="screen ${cls}">${html}</section>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { /* no-op */ } }

  /* ---------------- stats ---------------- */
  function doneDays() { return Object.keys(S.daily).filter((d) => S.daily[d].status === 'done').sort(); }
  function stats() {
    const days = doneDays();
    const scores = days.map((d) => S.daily[d].score);
    let streak = 0, cur = today();
    if (!(S.daily[cur] && S.daily[cur].status === 'done')) cur = addDays(cur, -1);
    while (S.daily[cur] && S.daily[cur].status === 'done') { streak++; cur = addDays(cur, -1); }
    let best = 0, run = 0, prev = null;
    for (const d of days) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }
    const dist = { p: 0, c: 0, s: 0, r: 0, d: 0, k: 0, x: 0 };
    for (const d of days) for (const r of S.daily[d].results) dist[r.tier || 'x']++;
    return {
      played: days.length, streak, maxStreak: best,
      bestDepth: scores.length ? depthOf(Math.max(...scores)) : 0,
      avgDepth: scores.length ? Math.round(depthOf(scores.reduce((a, b) => a + b, 0) / scores.length)) : 0,
      dist,
    };
  }

  /* ---------------- player ---------------- */
  async function ensurePlayer() {
    if (S.player) return S.player;
    const name = await askName();
    if (!name) return null;
    try {
      S.player = await N.register(name);
      save();
      return S.player;
    } catch (e) {
      toast('Could not reach the leaderboard. Your dive is saved on this device.');
      return null;
    }
  }
  function askName(initial = '') {
    return new Promise((resolve) => {
      openModal('Pick a diver name', `
        <p class="muted">Your name shows on the daily and endless leaderboards. You can change it later in settings.</p>
        <form id="nameForm">
          <div class="field"><label for="nameInput">Diver name</label>
            <input id="nameInput" type="text" maxlength="20" minlength="2" autocomplete="nickname" value="${esc(initial)}" placeholder="e.g. Captain Nemo" required></div>
          <div class="reveal-actions"><button class="btn" type="submit">Join the leaderboard</button>
          <button class="btn ghost" type="button" id="nameSkip">Not now</button></div>
        </form>`, { onClose: () => resolve(null) });
      const inp = $('#nameInput');
      setTimeout(() => inp.focus(), 50);
      $('#nameSkip').onclick = () => closeModal();
      $('#nameForm').onsubmit = (e) => {
        e.preventDefault();
        const v = inp.value.trim();
        if (v.length < 2) { toast('Use at least 2 characters.'); return; }
        modalClose = null; closeModal(); resolve(v);
      };
    });
  }

  /* ---------------- modal ---------------- */
  const modal = document.getElementById('modal');
  let modalClose = null;
  function openModal(title, html, opts = {}) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    modalClose = opts.onClose || null;
    if (!modal.open) modal.showModal();
    $('#modalBody').scrollTop = 0;
  }
  function closeModal() { if (modal.open) modal.close(); }
  modal.addEventListener('close', () => { const f = modalClose; modalClose = null; if (f) f(); });
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.open;
    if (k === 'help') showHelp(); else if (k === 'board') showBoard(); else if (k === 'history') showHistory(); else if (k === 'settings') showSettings();
  }));
  $('#homeBtn').addEventListener('click', () => { if (!run || run.phase !== 'ask' || confirmLeave()) home(); });
  function confirmLeave() { return window.confirm('Leave this dive? Your progress is saved and you can resume it later.'); }

  /* ---------------- home ---------------- */
  let clockTimer = null;
  function untilReset() {
    const now = new Date();
    const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    const s = Math.max(0, Math.floor((next - now) / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  }

  function home() {
    run = null;
    const d = today();
    const rec = S.daily[d];
    const st = stats();
    const done = rec && rec.status === 'done';
    const playing = rec && rec.status === 'playing';
    FX.setDepth(done ? depthOf(rec.score) : 0);

    let hero;
    if (done) {
      const b = B.band(depthOf(rec.score));
      hero = `
        <p class="dive-no">Dive #${diveNo(d)}, ${niceDate(d)}</p>
        <h1 class="home-title">You reached <span class="num">${fmt(depthOf(rec.score))}</span>&nbsp;m.</h1>
        <p class="home-lede">That’s the ${esc(b.name)}. ${rec.results.map(emojiOf).join('')}</p>
        <div class="home-actions"><button class="btn" id="seeResults">See today’s results</button>
        <button class="btn ghost" id="shareHome">Share</button></div>
        <p class="reset-note">Next dive in <b class="num" id="clock">${untilReset()}</b></p>`;
    } else {
      hero = `
        <p class="dive-no">Dive #${diveNo(d)}, ${niceDate(d)}</p>
        <h1 class="home-title">Obvious answers float.<span class="sink">Rare ones sink.</span></h1>
        <p class="home-lede">Seven prompts, ${C.roundSeconds} seconds each. The fewer people who’d say your answer, the deeper you go.</p>
        <div class="home-actions">
          <button class="btn krill" id="begin">${playing ? `Resume dive, prompt ${Math.min(7, rec.results.length + 1)} of 7` : 'Begin dive'}</button>
          <button class="btn ghost" id="howTo">How it works</button>
        </div>
        <p class="reset-note">Same seven prompts for everyone. New dive in <b class="num" id="clock">${untilReset()}</b></p>`;
    }

    screen(`
      <div class="home-hero">${hero}</div>
      <div class="modes">
        <button class="mode" id="goEndless"><h3>Endless</h3><p>One tank of air. Rare answers refill it. Go until you run dry.</p>
          ${S.endless.best ? `<div class="best">Your best: ${fmt(S.endless.best)} pts</div>` : ''}</button>
        <button class="mode" id="goPacks"><h3>Practice packs</h3><p>Pick a topic and dive as often as you like. No leaderboard.</p></button>
      </div>
      ${st.played ? `<div class="panel"><div class="panel-head"><h3>Your dives</h3><button class="linkish" data-hist>Full history</button></div>
        <div class="stats-row">
          <div class="stat"><b>${st.played}</b><span>played</span></div>
          <div class="stat"><b>${st.streak}</b><span>day streak</span></div>
          <div class="stat"><b>${fmt(st.bestDepth)}</b><span>best metres</span></div>
          <div class="stat"><b>${fmt(st.avgDepth)}</b><span>average metres</span></div>
        </div></div>` : ''}
      <div class="panel"><div class="panel-head"><h3>Deepest today</h3><button class="linkish" data-board>All leaderboards</button></div>
        <ol class="board" id="homeBoard"><li class="empty" style="display:block">Sounding the depths…</li></ol></div>
    `);

    const begin = $('#begin'); if (begin) begin.onclick = () => startDaily();
    const how = $('#howTo'); if (how) how.onclick = showHelp;
    const see = $('#seeResults'); if (see) see.onclick = () => summary(d);
    const sh = $('#shareHome'); if (sh) sh.onclick = () => share(d);
    $('#goEndless').onclick = startEndless;
    $('#goPacks').onclick = packs;
    const hb = app.querySelector('[data-hist]'); if (hb) hb.onclick = showHistory;
    app.querySelector('[data-board]').onclick = () => showBoard();
    clearInterval(clockTimer);
    clockTimer = setInterval(() => { const c = $('#clock'); if (c) c.textContent = untilReset(); else clearInterval(clockTimer); if (today() !== d && app.querySelector('.home-hero')) home(); }, 1000);
    loadBoardInto($('#homeBoard'), d, 5);
    if (!S.seenHelp) { S.seenHelp = true; save(); setTimeout(showHelp, 500); }
  }

  async function loadBoardInto(el, day, limit) {
    if (!el) return;
    try {
      const rows = await N.daily(day, limit);
      if (!rows.length) { el.innerHTML = `<li class="empty" style="display:block">Nobody has dived ${day === today() ? 'yet today. Be the first' : 'on this day'}.</li>`; return; }
      el.innerHTML = rows.map((r, i) => boardRow(i + 1, r.name, `${fmt(depthOf(r.score))} m`, B.band(depthOf(r.score)).name, r.tiers, S.player && r.player_id === S.player.id)).join('');
    } catch (e) {
      el.innerHTML = `<li class="empty" style="display:block">Leaderboard is unreachable right now. Your dives still save on this device.</li>`;
    }
  }
  function boardRow(rank, name, main, sub, tiers, me) {
    return `<li class="${me ? 'me' : ''}"><span class="rk">${rank}</span><span class="who"><b>${esc(name)}</b>${tiers ? `<small>${esc(tiers)}</small>` : ''}</span><span class="sc">${main}<small>${esc(sub)}</small></span></li>`;
  }

  /* ---------------- game engine ---------------- */
  let run = null;
  let timerId = null;
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function startDaily() {
    const d = today();
    let rec = S.daily[d];
    if (rec && rec.status === 'done') return summary(d);
    const ps = B.dailyPrompts(dayIndex(d));
    if (!rec) {
      rec = S.daily[d] = { status: 'playing', results: [], remaining: C.roundSeconds, tried: [], score: 0, prompts: ps.map((p) => p.id) };
      save();
    }
    FX.sfx.start();
    run = { mode: 'daily', day: d, rec, prompts: rec.prompts.map((id) => B.byId[id]).filter(Boolean), phase: 'ask' };
    nextRound();
  }

  function startPractice(cat) {
    const pool = B.prompts.filter((p) => p.cat === cat);
    const ps = B.shuffle(pool, Math.random).slice(0, 7);
    FX.sfx.start();
    run = { mode: 'practice', cat, rec: { results: [], remaining: C.roundSeconds, tried: [], score: 0 }, prompts: ps, phase: 'ask' };
    nextRound();
  }

  function nextRound() {
    const rec = run.rec;
    const i = rec.results.length;
    if (i >= run.prompts.length) return finishDive();
    const p = run.prompts[i];
    run.phase = 'ask';
    run.prompt = p;
    FX.setDepth(depthOf(rec.score));
    const pips = run.prompts.map((_, j) => {
      const r = rec.results[j];
      return `<span class="pip ${j === i ? 'now' : ''}" aria-hidden="true">${r ? emojiOf(r) : ''}</span>`;
    }).join('');
    screen(`
      <div class="game-top">
        <div class="pips" aria-label="Prompt ${i + 1} of ${run.prompts.length}">${pips}</div>
        <div class="score-now"><span id="scoreNow">${fmt(depthOf(rec.score))}</span> m <small>${run.mode === 'practice' ? esc(run.cat) : 'deep'}</small></div>
      </div>
      <div id="stage">
        <p class="prompt-cat">${esc(p.cat)}</p>
        <h1 class="prompt-q" aria-label="${esc(p.q)}">${words(p.q)}</h1>
        <div class="tank" id="tank"><div class="tank-fill" id="tankFill"></div></div>
        <div class="tank-label"><span>Air left</span><b id="timeLeft">${Math.ceil(rec.remaining)}s</b></div>
        <form class="guess" id="guessForm" autocomplete="off">
          <input id="guessInput" type="text" placeholder="Type an answer" aria-label="Your answer" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go">
          <button class="btn" type="submit">Dive</button>
        </form>
        <div class="tried" id="tried">${rec.tried.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        <p class="hint-line">Wrong guesses cost ${C.wrongPenalty} seconds. The first answer that counts ends the prompt.</p>
      </div>`);
    const inp = $('#guessInput');
    inp.focus();
    $('#guessForm').onsubmit = (e) => { e.preventDefault(); guess(inp.value); };
    runClock();
  }

  function runClock() {
    const rec = run.rec;
    let last = performance.now();
    let lastWhole = Math.ceil(rec.remaining);
    paintTank();
    timerId = setInterval(() => {
      const now = performance.now();
      rec.remaining = Math.max(0, rec.remaining - (now - last) / 1000);
      last = now;
      paintTank();
      const whole = Math.ceil(rec.remaining);
      if (whole !== lastWhole) { lastWhole = whole; if (whole <= 5 && whole > 0) FX.sfx.tick(); if (run.mode === 'daily') save(); }
      if (rec.remaining <= 0) { stopTimer(); endRound(null); }
    }, 100);
  }
  function paintTank() {
    const rec = run.rec;
    const f = $('#tankFill'); if (!f) return;
    const frac = rec.remaining / C.roundSeconds;
    f.style.transform = `scaleX(${Math.max(0, frac)})`;
    $('#tank').classList.toggle('low', rec.remaining <= 6);
    $('#timeLeft').textContent = Math.ceil(rec.remaining) + 's';
  }

  function guess(text) {
    if (!run || run.phase !== 'ask') return;
    const inp = $('#guessInput');
    const raw = String(text || '').trim();
    if (!raw) return;
    const rec = run.rec;
    const k = B.key(raw);
    if (rec.tried.some((t) => B.key(t) === k)) { toast('Already tried that one.'); inp.select(); return; }
    const hit = B.match(run.prompt, raw);
    if (hit && hit.near) { closeCall(inp); return; }
    if (hit) { stopTimer(); endRound(hit, raw); return; }
    rec.tried.push(raw);
    rec.remaining = Math.max(0, rec.remaining - C.wrongPenalty);
    FX.sfx.miss(); vibrate(40);
    const form = $('#guessForm'); form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
    $('#tried').insertAdjacentHTML('beforeend', `<span>${esc(raw)}</span>`);
    const pen = document.createElement('span'); pen.className = 'penalty'; pen.textContent = `−${C.wrongPenalty}s`;
    $('#timeLeft').after(pen); setTimeout(() => pen.remove(), 900);
    inp.value = ''; inp.focus();
    paintTank();
    if (run.mode === 'daily') save();
    if (rec.remaining <= 0) { stopTimer(); endRound(null); }
  }

  const words = (s) => s.split(' ').map((w, i) => `<span class="w" aria-hidden="true" style="animation-delay:${i * 45}ms">${esc(w)}</span>`).join(' ');
  const letters = (s) => [...s].map((ch, i) => `<span class="ch" aria-hidden="true" style="animation-delay:${180 + i * 28}ms">${esc(ch)}</span>`).join('');

  function closeCall(inp) {
    toast('So close. Check the spelling, no air lost.');
    FX.sfx.tick();
    inp.select();
  }

  function endRound(hit, typed) {
    const rec = run.rec;
    const p = run.prompt;
    run.phase = 'reveal';
    const result = { pid: p.id, tier: hit ? hit.tier : null, answer: hit ? hit.display : null, key: hit ? hit.id : null, typed: typed || null, pts: hit ? T[hit.tier].pts : 0, tried: rec.tried.slice() };
    rec.results.push(result);
    rec.score += result.pts;
    rec.remaining = C.roundSeconds;
    rec.tried = [];
    if (run.mode === 'daily') save();

    const stage = $('#stage');
    const rect = stage.getBoundingClientRect();
    if (hit) {
      FX.sfx.hit(hit.tier); vibrate(hit.tier === 'k' ? [30, 40, 30, 40, 90] : 25);
      const bx = hit.tier === 'k' && window.innerWidth > 760 ? rect.right - 60 : window.innerWidth / 2;
      FX.burst(bx, rect.top + (hit.tier === 'k' ? 220 : 140), hit.tier);
    } else { FX.sfx.out(); vibrate([60, 40, 60]); }
    FX.setDepth(depthOf(rec.score));
    $('#scoreNow').textContent = fmt(depthOf(rec.score));
    const pip = app.querySelectorAll('.pip')[rec.results.length - 1]; if (pip) { pip.textContent = emojiOf(result); pip.classList.add('hit'); }

    const last = rec.results.length >= run.prompts.length;
    const tc = hit ? 'tc-' + hit.tier : 'tc-x';
    const deeper = B.deeperExamples(p, hit ? hit.tier : null, 4);
    const sample = hit ? [] : B.shuffle(p.byTier.p, Math.random).slice(0, 2);
    stage.innerHTML = `
      <div class="reveal ${tc}">
        <p class="prompt-cat">${esc(p.q)}</p>
        ${hit ? `<span class="tier-badge"><span class="em">${T[hit.tier].emoji}</span>${esc(T[hit.tier].name)}</span>
          <h2 class="reveal-answer" aria-label="${esc(hit.display)}">${letters(hit.display)}</h2>
          <p class="reveal-pts">+${T[hit.tier].pts} points, ${T[hit.tier].pts * 4} m deeper</p>
          <p class="reveal-blurb">${esc(T[hit.tier].blurb)}</p>`
        : `<span class="tier-badge"><span class="em">${B.MISS_EMOJI}</span>Out of air</span>
          <h2 class="reveal-answer">No answer counted.</h2>
          <p class="reveal-blurb">You stay at this depth. Here’s what was down there.</p>`}
        <div class="reveal-extra">
          ${run.mode === 'daily' && hit ? `<div id="crowd"><h4>How other divers answered</h4><p class="muted" id="crowdText">Checking today’s answers…</p><div class="crowd-bar"><i id="crowdBar"></i></div></div>` : ''}
          ${!hit && sample.length ? `<div><h4>Plankton you could have grabbed</h4><div class="chips">${sample.map((a) => `<span class="chip">${esc(a.display)}</span>`).join('')}</div></div>` : ''}
          ${deeper.length ? `<div><h4>${hit && hit.tier === 'k' ? 'Other deep answers' : 'Deeper answers on the list'}</h4><div class="chips">${deeper.map((a) => `<span class="chip tc-${a.tier}"><i>${T[a.tier].emoji}</i>${esc(a.display)}</span>`).join('')}</div></div>` : ''}
          ${result.tried.length ? `<div><h4>Think a rejected guess should count?</h4><div class="chips">${result.tried.map((t, i) => `<button class="chip" data-suggest="${i}">Suggest “${esc(t)}”</button>`).join('')}</div></div>` : ''}
        </div>
        <div class="reveal-actions"><button class="btn ${last ? 'krill' : ''}" id="nextBtn">${last ? 'See your dive' : 'Next prompt'}</button>
          <span class="faint" style="font-size:14px">or press Enter</span></div>
      </div>`;
    app.querySelectorAll('[data-suggest]').forEach((b) => b.onclick = async () => {
      const t = result.tried[Number(b.dataset.suggest)];
      b.disabled = true; b.textContent = `Sent “${t}”`;
      try { await N.suggest(p.id, t, S.player && S.player.id); toast('Thanks. It’s in the review pile.'); } catch (e) { toast('Could not send that right now.'); }
    });
    const next = $('#nextBtn');
    next.focus({ preventScroll: true });
    next.onclick = () => nextRound();
    if (run.mode === 'daily' && hit) crowd(p, hit);
  }

  async function crowd(p, hit) {
    try {
      const { answers, plays } = await N.answerStats(run.day, p.id);
      const row = answers.find((a) => a.answer === hit.id);
      const n = row ? row.n : 0;
      const t = $('#crowdText'); if (!t) return;
      if (plays < 3) { t.textContent = `You’re one of the first divers today. ${plays ? `${plays} finished so far.` : ''}`; return; }
      const pct = Math.round((n / plays) * 100);
      const top = answers[0];
      const topAns = top && p.answers.find((a) => a.id === top.answer);
      t.innerHTML = n === 0
        ? `Nobody else who has finished today said ${esc(hit.display)}. ${topAns ? `Most popular: <b>${esc(topAns.display)}</b> (${Math.round(top.n / plays * 100)}%).` : ''}`
        : `${pct}% of ${fmt(plays)} divers also said ${esc(hit.display)}.${topAns && topAns.id !== hit.id ? ` Most popular: <b>${esc(topAns.display)}</b> (${Math.round(top.n / plays * 100)}%).` : ''}`;
      requestAnimationFrame(() => { const bar = $('#crowdBar'); if (bar) bar.style.width = Math.max(2, pct) + '%'; });
    } catch (e) { const c = $('#crowd'); if (c) c.remove(); }
  }

  async function finishDive() {
    if (run.mode === 'practice') { S.practice.played++; save(); return practiceSummary(); }
    const rec = run.rec;
    rec.status = 'done';
    rec.finishedAt = Date.now();
    save();
    summary(run.day, true);
  }

  async function submitDaily(day) {
    const rec = S.daily[day];
    if (!rec || rec.submitted || rec.status !== 'done') return;
    if (day < addDays(today(), -1)) return;
    const pl = await ensurePlayer();
    if (!pl) return;
    try {
      const res = await N.submitDaily(pl.id, pl.token, day, rec.score, rec.results.map(emojiOf).join(''), rec.results.map((r) => ({ p: r.pid, a: r.key })));
      rec.submitted = true; rec.rank = res.rank; rec.total = res.total; save();
      const el = $('#sumRank');
      if (el) el.innerHTML = rankLine(rec);
      const lb = $('#sumBoard'); if (lb) loadBoardInto(lb, day, 10);
    } catch (e) {
      if (/bad player/.test(e.message)) { S.player = null; save(); toast('Your diver profile was reset. Pick a name to submit.'); }
      else toast('Could not reach the leaderboard. Your dive is saved here.');
    }
  }
  function rankLine(rec) {
    if (!rec.rank) return '';
    const pct = rec.total > 1 ? Math.round(((rec.total - rec.rank) / (rec.total - 1)) * 100) : 100;
    return `Rank <b>${fmt(rec.rank)}</b> of ${fmt(rec.total)} divers today${rec.total > 4 ? `, deeper than ${pct}%` : ''}.`;
  }

  /* ---------------- summary ---------------- */
  function roundsList(results, prompts) {
    return `<ol class="rounds">${results.map((r) => {
      const p = B.byId[r.pid] || prompts.find((x) => x.id === r.pid);
      if (!p) return '';
      return `<li class="${r.tier ? 'tc-' + r.tier : 'tc-x'}"><span class="em">${emojiOf(r)}</span>
        <div><div class="q">${esc(p.q)}</div>
          <div class="a ${r.tier ? '' : 'miss'}">${r.tier ? esc(r.answer) : 'Out of air'}${r.tier ? ` <span class="faint" style="font:400 14px var(--body)">${esc(T[r.tier].name)}</span>` : ''}</div>
          ${p.krill ? `<div class="k">One in a Krillion: <b>${esc(p.krill.display)}</b></div>` : ''}</div>
        <span class="pts">${r.pts ? '+' + r.pts : '0'}</span></li>`;
    }).join('')}</ol>`;
  }

  function summary(day, fresh) {
    run = null;
    const rec = S.daily[day];
    if (!rec || rec.status !== 'done') return home();
    const depth = depthOf(rec.score);
    const b = B.band(depth);
    FX.setDepth(depth);
    screen(`
      <div class="sum-hero">
        <p class="dive-no">Dive #${diveNo(day)}, ${niceDate(day)}</p>
        <h1 class="sum-depth"><span id="countUp">${fresh ? 0 : fmt(depth)}</span><small>m</small></h1>
        <p class="sum-band">You reached the <span>${esc(b.name)}</span>.</p>
        <p class="sum-emoji" aria-label="Round results">${rec.results.map(emojiOf).join('')}</p>
        <p class="sum-rank" id="sumRank">${rankLine(rec)}</p>
        <div class="sum-actions">
          <button class="btn krill" id="shareBtn">Share your dive</button>
          <button class="btn ghost" id="endlessBtn">Keep diving in Endless</button>
        </div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Your seven answers</h3><span class="faint num">${fmt(rec.score)} pts</span></div>
        ${roundsList(rec.results, [])}</div>
      <div class="panel"><div class="panel-head"><h3>Deepest today</h3><button class="linkish" id="allBoards">All leaderboards</button></div>
        <ol class="board" id="sumBoard"><li class="empty" style="display:block">Sounding the depths…</li></ol></div>
      <p class="reset-note" style="text-align:center;margin-top:22px">Next dive in <b class="num" id="clock">${untilReset()}</b></p>
    `);
    $('#shareBtn').onclick = () => share(day);
    $('#endlessBtn').onclick = startEndless;
    $('#allBoards').onclick = () => showBoard('daily', day);
    clearInterval(clockTimer);
    clockTimer = setInterval(() => { const c = $('#clock'); if (c) c.textContent = untilReset(); else clearInterval(clockTimer); }, 1000);
    if (fresh) countUp($('#countUp'), depth);
    loadBoardInto($('#sumBoard'), day, 10);
    if (!rec.submitted) submitDaily(day);
    if (fresh && rec.results.some((r) => r.tier === 'k')) setTimeout(() => FX.burst(window.innerWidth / 2, 200, 'k'), 700);
  }

  function countUp(el, to) {
    if (!el) return;
    const start = performance.now(), dur = 1600;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function share(day) {
    const rec = S.daily[day];
    const depth = depthOf(rec.score);
    const text = `Krillion #${diveNo(day)} 🦐\nSank to ${fmt(depth)} m (${B.band(depth).name})\n${rec.results.map(emojiOf).join('')}\n${SITE}`;
    try {
      if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text);
      toast('Copied. Paste it anywhere.');
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      window.prompt('Copy your result:', text);
    }
  }

  function practiceSummary() {
    const rec = run.rec;
    const depth = depthOf(rec.score);
    const cat = run.cat;
    const ps = run.prompts;
    run = null;
    FX.setDepth(depth);
    screen(`
      <div class="sum-hero">
        <p class="dive-no">Practice: ${esc(cat)}</p>
        <h1 class="sum-depth"><span id="countUp">0</span><small>m</small></h1>
        <p class="sum-band">That’s the <span>${esc(B.band(depth * 7 / ps.length).name)}</span>.</p>
        <p class="sum-emoji">${rec.results.map(emojiOf).join('')}</p>
        <div class="sum-actions"><button class="btn krill" id="again">Dive ${esc(cat)} again</button><button class="btn ghost" id="pickPack">Pick another pack</button></div>
      </div>
      <div class="panel">${roundsList(rec.results, ps)}</div>`);
    countUp($('#countUp'), depth);
    $('#again').onclick = () => startPractice(cat);
    $('#pickPack').onclick = packs;
  }

  /* ---------------- packs ---------------- */
  function packs() {
    run = null;
    FX.setDepth(0);
    const cats = {};
    for (const p of B.prompts) cats[p.cat] = (cats[p.cat] || 0) + 1;
    screen(`
      <div class="home-hero" style="padding-bottom:0">
        <p class="dive-no">Practice packs</p>
        <h1 class="home-title" style="font-size:clamp(40px,10vw,64px)">Pick your water.</h1>
        <p class="home-lede">Seven random prompts from one topic. Same scoring, no leaderboard, play as often as you like.</p>
      </div>
      <div class="pack-grid">${Object.keys(cats).sort().map((c) => `<button class="pack" data-cat="${esc(c)}"><b>${esc(c)}</b><span>${cats[c]} prompts</span></button>`).join('')}
        <button class="pack" data-cat="*"><b>Everything</b><span>${B.prompts.length} prompts, all topics</span></button></div>`);
    app.querySelectorAll('[data-cat]').forEach((b) => b.onclick = () => {
      const c = b.dataset.cat;
      if (c === '*') {
        FX.sfx.start();
        run = { mode: 'practice', cat: 'Everything', rec: { results: [], remaining: C.roundSeconds, tried: [], score: 0 }, prompts: B.shuffle(B.prompts, Math.random).slice(0, 7), phase: 'ask' };
        nextRound();
      } else startPractice(c);
    });
  }

  /* ---------------- endless ---------------- */
  function startEndless() {
    FX.sfx.start();
    run = { mode: 'endless', queue: B.shuffle(B.prompts, Math.random), air: C.endlessAir, score: 0, cleared: 0, log: [], tried: [], phase: 'ask' };
    FX.setDepth(0);
    endlessPrompt();
  }
  function endlessPrompt() {
    if (!run.queue.length) run.queue = B.shuffle(B.prompts, Math.random);
    const p = run.prompt = run.queue.pop();
    run.phase = 'ask'; run.tried = [];
    screen(`
      <div class="game-top">
        <div class="score-now"><span id="scoreNow">${fmt(run.score)}</span> pts <small>${run.cleared} cleared</small></div>
        <button class="btn ghost small" id="skipBtn">Skip, −5s</button>
      </div>
      <div id="stage">
        <p class="prompt-cat">${esc(p.cat)}</p>
        <h1 class="prompt-q" aria-label="${esc(p.q)}">${words(p.q)}</h1>
        <div class="tank" id="tank"><div class="tank-fill" id="tankFill"></div></div>
        <div class="tank-label"><span>Air left</span><span class="endless-air"><b id="timeLeft">${Math.ceil(run.air)}s</b><span id="gain"></span></span></div>
        <form class="guess" id="guessForm" autocomplete="off">
          <input id="guessInput" type="text" placeholder="Type an answer" aria-label="Your answer" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go">
          <button class="btn" type="submit">Dive</button>
        </form>
        <div class="tried" id="tried"></div>
        <div id="flash" aria-live="polite"></div>
      </div>`);
    const inp = $('#guessInput'); inp.focus();
    $('#guessForm').onsubmit = (e) => { e.preventDefault(); endlessGuess(inp.value); };
    $('#skipBtn').onclick = () => { if (run.phase !== 'ask') return; run.air = Math.max(0, run.air - 5); run.log.push({ pid: p.id, tier: null }); paintAir(); if (run.air <= 0) return endlessOver(); stopTimer(); endlessPrompt(); };
    let last = performance.now(), lastWhole = Math.ceil(run.air);
    paintAir();
    timerId = setInterval(() => {
      const now = performance.now();
      if (run.phase === 'ask') run.air = Math.max(0, run.air - (now - last) / 1000);
      last = now; paintAir();
      const w = Math.ceil(run.air); if (w !== lastWhole) { lastWhole = w; if (w <= 5 && w > 0) FX.sfx.tick(); }
      if (run.air <= 0) { stopTimer(); endlessOver(); }
    }, 100);
  }
  function paintAir() {
    const f = $('#tankFill'); if (!f) return;
    f.style.transform = `scaleX(${Math.min(1, run.air / C.endlessAir)})`;
    $('#tank').classList.toggle('low', run.air <= 8);
    $('#timeLeft').textContent = Math.ceil(run.air) + 's';
  }
  function endlessGuess(text) {
    if (!run || run.phase !== 'ask') return;
    const raw = String(text || '').trim(); if (!raw) return;
    const inp = $('#guessInput');
    const k = B.key(raw);
    if (run.tried.includes(k)) { toast('Already tried that one.'); return; }
    const hit = B.match(run.prompt, raw);
    if (hit && hit.near) { closeCall(inp); return; }
    if (!hit) {
      run.tried.push(k);
      run.air = Math.max(0, run.air - 2);
      FX.sfx.miss(); vibrate(40);
      const form = $('#guessForm'); form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      $('#tried').insertAdjacentHTML('beforeend', `<span>${esc(raw)}</span>`);
      inp.value = ''; paintAir();
      if (run.air <= 0) { stopTimer(); endlessOver(); }
      return;
    }
    const tier = T[hit.tier];
    run.phase = 'reveal';
    run.score += tier.pts; run.cleared++;
    run.air = Math.min(C.endlessAir * 1.5, run.air + tier.air);
    run.log.push({ pid: run.prompt.id, tier: hit.tier, answer: hit.display, pts: tier.pts });
    FX.sfx.hit(hit.tier); vibrate(20);
    FX.burst(window.innerWidth / 2, $('#stage').getBoundingClientRect().top + 140, hit.tier);
    FX.setDepth(run.score * 4);
    $('#scoreNow').textContent = fmt(run.score);
    $('#gain').innerHTML = `<span class="flash-gain">+${tier.air}s</span>`;
    paintAir();
    inp.disabled = true;
    $('#flash').innerHTML = `<div class="reveal tc-${hit.tier}" style="margin-top:22px"><span class="tier-badge"><span class="em">${tier.emoji}</span>${esc(tier.name)}</span>
      <h2 class="reveal-answer" style="font-size:34px">${esc(hit.display)} <span class="reveal-pts" style="font-size:20px">+${tier.pts}</span></h2></div>`;
    setTimeout(() => { if (run && run.mode === 'endless') { stopTimer(); endlessPrompt(); } }, hit.tier === 'k' ? 1700 : 1150);
  }

  async function endlessOver() {
    FX.sfx.out();
    const r = run; run = null;
    const isBest = r.score > (S.endless.best || 0);
    S.endless.best = Math.max(S.endless.best || 0, r.score);
    S.endless.runs.push({ score: r.score, cleared: r.cleared, at: Date.now() });
    S.endless.runs = S.endless.runs.slice(-50);
    save();
    const tally = {};
    for (const l of r.log) if (l.tier) tally[l.tier] = (tally[l.tier] || 0) + 1;
    screen(`
      <div class="sum-hero">
        <p class="dive-no">Endless dive</p>
        <h1 class="sum-depth"><span id="countUp">0</span><small>pts</small></h1>
        <p class="sum-band">${isBest && r.score ? 'A new personal best.' : `Your best is ${fmt(S.endless.best)}.`} You cleared <span>${r.cleared}</span> prompt${r.cleared === 1 ? '' : 's'}.</p>
        <p class="sum-emoji">${B.ORDER.filter((t) => tally[t]).map((t) => `${T[t].emoji}${tally[t] > 1 ? '×' + tally[t] : ''}`).join(' ') || B.MISS_EMOJI}</p>
        <p class="sum-rank" id="endRank"></p>
        <div class="sum-actions"><button class="btn krill" id="again">Dive again</button><button class="btn ghost" id="toHome">Back to today’s dive</button></div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Endless, this week</h3><button class="linkish" id="allBoards">All leaderboards</button></div>
        <ol class="board" id="endBoard"><li class="empty" style="display:block">Loading…</li></ol></div>`);
    countUp($('#countUp'), r.score);
    $('#again').onclick = startEndless;
    $('#toHome').onclick = home;
    $('#allBoards').onclick = () => showBoard('endless');
    const loadEnd = () => loadEndlessInto($('#endBoard'), weekAgo(), 10);
    if (r.score > 0) {
      const pl = await ensurePlayer();
      if (pl) {
        try {
          const res = await N.submitEndless(pl.id, pl.token, r.score, r.cleared);
          const el = $('#endRank'); if (el) el.innerHTML = `All-time rank <b>${fmt(res.rank)}</b>.`;
        } catch (e) { if (!/slow down/.test(e.message)) toast('Could not reach the leaderboard.'); }
      }
    }
    loadEnd();
  }
  const weekAgo = () => new Date(Date.now() - 7 * 864e5).toISOString();
  async function loadEndlessInto(el, since, limit) {
    if (!el) return;
    try {
      const rows = await N.endless(since, limit);
      if (!rows.length) { el.innerHTML = `<li class="empty" style="display:block">No endless dives yet. Set the first mark.</li>`; return; }
      el.innerHTML = rows.map((x, i) => boardRow(i + 1, x.name, `${fmt(x.score)} pts`, `${x.cleared} cleared`, '', S.player && x.player_id === S.player.id)).join('');
    } catch (e) { el.innerHTML = `<li class="empty" style="display:block">Leaderboard is unreachable right now.</li>`; }
  }

  /* ---------------- modals ---------------- */
  function tierList() {
    return `<ul class="tier-list">${B.ORDER.map((k) => `<li class="tc-${k}"><span class="em">${T[k].emoji}</span><span><b style="color:var(--tc)">${T[k].name}</b><small>${esc(T[k].blurb)}</small></span><span class="pts">${T[k].pts}</span></li>`).join('')}</ul>`;
  }
  function showHelp() {
    openModal('How to dive', `<div class="help">
      <p>Every day at midnight UTC there are seven new prompts, the same for everyone. Name anything that fits. One answer per prompt counts, so make it a deep one.</p>
      <p>You get ${C.roundSeconds} seconds of air per prompt. A wrong or unlisted answer costs ${C.wrongPenalty} seconds, so guessing is fair game. Spelling doesn’t need to be perfect, extra words like “Mount” or “cheese” are ignored, and if you’re one letter off you’ll get a nudge instead of a penalty.</p>
      <h3>How deep each answer sends you</h3>
      ${tierList()}
      <p>Each point is 4 metres. A perfect dive of seven One in a Krillion answers reaches 2,800 m.</p>
      <h3>Depth bands</h3>
      <p>${B.BANDS.map((b) => `<b>${b.name}</b> from ${fmt(b.min)} m`).join(', ')}.</p>
      <h3>Other ways to play</h3>
      <p><b>Endless</b> gives you one ${C.endlessAir}-second tank. Every answer that counts refills it, rarer ones by more. <b>Practice packs</b> let you replay a single topic as often as you like.</p>
      <div class="reveal-actions"><button class="btn" data-close>Got it</button></div></div>`);
  }

  function showBoard(tab = 'daily', day = today()) {
    let cur = day;
    const render = () => {
      openModal('Leaderboards', `
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" aria-selected="${tab === 'daily'}" data-tab="daily">Daily dive</button>
          <button class="tab" role="tab" aria-selected="${tab === 'endless'}" data-tab="endless">Endless, this week</button>
          <button class="tab" role="tab" aria-selected="${tab === 'endless-all'}" data-tab="endless-all">Endless, all time</button>
        </div>
        ${tab === 'daily' ? `<div class="day-nav">
          <button class="icon-btn" id="prevDay" aria-label="Previous day" ${dayIndex(cur) <= 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
          <b>Dive #${diveNo(cur)}, ${niceDate(cur)}</b>
          <button class="icon-btn" id="nextDay" aria-label="Next day" ${cur >= today() ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
        </div><p class="faint" id="boardCount" style="font-size:14px;margin-bottom:6px"></p>` : ''}
        <ol class="board" id="modalBoard"><li class="empty" style="display:block">Loading…</li></ol>`);
      app && modal.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { tab = b.dataset.tab; render(); });
      if (tab === 'daily') {
        $('#prevDay').onclick = () => { cur = addDays(cur, -1); render(); };
        $('#nextDay').onclick = () => { cur = addDays(cur, 1); render(); };
        loadBoardInto($('#modalBoard'), cur, 100);
        N.dailyCount(cur).then((n) => { const el = $('#boardCount'); if (el && n) el.textContent = `${fmt(n)} diver${n === 1 ? '' : 's'}. Ties go to whoever finished first.`; }).catch(() => {});
      } else loadEndlessInto($('#modalBoard'), tab === 'endless' ? weekAgo() : null, 100);
    };
    render();
  }

  function bandColor(depth) {
    const i = B.BANDS.indexOf(B.band(depth));
    return ['#69d8e4', '#3f9fd6', '#5a6cff', '#b38bff', '#ff7aa2'][i];
  }
  function showHistory() {
    const st = stats();
    const days = doneDays().reverse();
    const totalAns = Object.values(st.dist).reduce((a, b) => a + b, 0) || 1;
    const t = today();
    // 10 weeks calendar ending this week (UTC), Monday first
    const end = new Date(t + 'T00:00:00Z');
    const dow = (end.getUTCDay() + 6) % 7;
    const startDay = addDays(t, -(dow + 63));
    const cells = [];
    for (let i = 0; i < 70; i++) {
      const d = addDays(startDay, i);
      const r = S.daily[d];
      const done = r && r.status === 'done';
      cells.push(`<span ${done ? `data-b="${d}" style="background:${bandColor(depthOf(r.score))}" title="${niceDate(d)}: ${fmt(depthOf(r.score))} m"` : `title="${d > t ? '' : niceDate(d)}"`} class="${d === t ? 'today' : ''}" ${d > t ? 'style="opacity:.25"' : ''}></span>`);
    }
    openModal('Your history', `
      <div class="stats-row" style="margin-bottom:18px">
        <div class="stat"><b>${st.played}</b><span>dives</span></div>
        <div class="stat"><b>${st.streak}</b><span>streak (best ${st.maxStreak})</span></div>
        <div class="stat"><b>${fmt(st.bestDepth)}</b><span>best metres</span></div>
        <div class="stat"><b>${fmt(st.avgDepth)}</b><span>average metres</span></div>
      </div>
      <h3 style="font-size:18px">Last ten weeks</h3>
      <div class="cal">${cells.join('')}</div>
      <div class="cal-legend">${B.BANDS.map((b) => `<span><i style="background:${bandColor(b.min)}"></i>${b.name}</span>`).join('')}</div>
      <h3 style="font-size:18px;margin-top:22px">Where your answers land</h3>
      <div class="dist">${[...B.ORDER, 'x'].map((k) => `<div class="dist-row ${'tc-' + k}"><span>${k === 'x' ? B.MISS_EMOJI : T[k].emoji}</span><span class="bar"><i style="width:${(st.dist[k] / totalAns) * 100}%;background:var(--tc)"></i></span><span class="num faint">${st.dist[k]}</span></div>`).join('')}</div>
      <h3 style="font-size:18px;margin-top:22px">Endless</h3>
      <p class="muted">Best ${fmt(S.endless.best || 0)} pts across ${S.endless.runs.length} run${S.endless.runs.length === 1 ? '' : 's'}. Practice dives: ${S.practice.played}.</p>
      <h3 style="font-size:18px;margin-top:22px">Past dives</h3>
      ${days.length ? `<ul class="past">${days.map((d) => `<li><button data-day="${d}"><span>#${diveNo(d)} <span class="faint">${niceDate(d)}</span></span><span class="e">${S.daily[d].results.map(emojiOf).join('')}</span><b class="num">${fmt(depthOf(S.daily[d].score))} m</b></button></li>`).join('')}</ul>` : '<p class="empty">No dives yet. Today’s is waiting.</p>'}
    `);
    modal.querySelectorAll('[data-day],[data-b]').forEach((el) => el.onclick = () => pastDive(el.dataset.day || el.dataset.b));
  }
  function pastDive(d) {
    const rec = S.daily[d];
    openModal(`Dive #${diveNo(d)}`, `
      <p class="muted">${niceDate(d)}. ${fmt(depthOf(rec.score))} m, the ${esc(B.band(depthOf(rec.score)).name)}.</p>
      <p class="sum-emoji" style="font-size:24px">${rec.results.map(emojiOf).join('')}</p>
      ${roundsList(rec.results, [])}
      <div class="reveal-actions"><button class="btn ghost small" id="backHist">Back to history</button><button class="btn ghost small" id="boardDay">Leaderboard for this day</button></div>`);
    $('#backHist').onclick = showHistory;
    $('#boardDay').onclick = () => showBoard('daily', d);
  }

  function showSettings() {
    openModal('Settings', `
      <form id="renameForm"><div class="field"><label for="rn">Diver name</label>
        <input id="rn" type="text" maxlength="20" value="${esc(S.player ? S.player.name : '')}" placeholder="${S.player ? '' : 'Pick one when you finish a dive'}"></div>
        <button class="btn small" type="submit">${S.player ? 'Save name' : 'Join the leaderboard'}</button></form>
      <div style="margin-top:18px">
        <label class="switch"><span>Sound<small>Soft sonar pings for answers and the timer.</small></span><input type="checkbox" id="sndToggle" ${S.settings.sound ? 'checked' : ''}></label>
      </div>
      <h3 style="font-size:18px;margin-top:22px">Your data</h3>
      <p class="muted" style="font-size:15px">History lives in this browser. Clearing it removes your stats and streak here; leaderboard entries stay.</p>
      <div class="reveal-actions"><button class="btn ghost small" id="wipe">Clear history on this device</button></div>`);
    $('#sndToggle').onchange = (e) => { S.settings.sound = e.target.checked; FX.sound.on = e.target.checked; save(); if (e.target.checked) FX.sfx.hit('s'); };
    $('#renameForm').onsubmit = async (e) => {
      e.preventDefault();
      const v = $('#rn').value.trim();
      if (v.length < 2) { toast('Use at least 2 characters.'); return; }
      try {
        if (S.player) { await N.rename(S.player.id, S.player.token, v); S.player.name = v; }
        else { S.player = await N.register(v); }
        save(); toast('Saved. You’re ' + v + ' now.');
        const d = today(); if (S.daily[d] && S.daily[d].status === 'done' && !S.daily[d].submitted) submitDaily(d);
      } catch (err) { toast('Could not save: ' + err.message); }
    };
    $('#wipe').onclick = () => {
      if (!window.confirm('Clear all Krillion history on this device?')) return;
      const keep = { player: S.player, settings: S.settings, seenHelp: true };
      S = load(); Object.assign(S, keep, { daily: {}, endless: { best: 0, runs: [] }, practice: { played: 0 } }); save();
      closeModal(); home();
    };
  }

  /* ---------------- keyboard ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && run && run.phase === 'reveal' && run.mode !== 'endless' && !modal.open) {
      const n = $('#nextBtn'); if (n && document.activeElement !== n) { e.preventDefault(); n.click(); }
    }
  });
  window.addEventListener('pagehide', save);

  // Expose for testing in the console.
  window.Krillion = { state: () => S, home };
  home();
})();
