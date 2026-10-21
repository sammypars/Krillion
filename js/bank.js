// Parses the answer bank and matches typed guesses against it.
(function () {
  const TIERS = {
    p: { key: 'p', name: 'Plankton', pts: 10, emoji: '🦠', air: 8, blurb: 'The answer almost everyone gives first.' },
    c: { key: 'c', name: 'Too Clever', pts: 15, emoji: '🤓', air: 9, blurb: 'The famous "obscure" answer. Everyone thinks of it.' },
    s: { key: 's', name: 'Schooler', pts: 30, emoji: '🐟', air: 10, blurb: 'Common, just not top of mind.' },
    r: { key: 'r', name: 'Rare', pts: 60, emoji: '🐙', air: 11, blurb: 'Few divers get here.' },
    d: { key: 'd', name: 'Deep Cut', pts: 85, emoji: '🦑', air: 12, blurb: 'Almost nobody says this.' },
    k: { key: 'k', name: 'One in a Krillion', pts: 100, emoji: '🦐', air: 16, blurb: 'The single rarest answer on the list.' },
  };
  const ORDER = ['p', 'c', 's', 'r', 'd', 'k'];
  const MISS_EMOJI = '⬛';

  const BANDS = [
    { name: 'Shallows', min: 0 },
    { name: 'Schooler', min: 400 },
    { name: 'Thermocline', min: 900 },
    { name: 'Deep Cut', min: 1500 },
    { name: 'Trench', min: 2100 },
  ];
  function band(depth) {
    let b = BANDS[0];
    for (const x of BANDS) if (depth >= x.min) b = x;
    return b;
  }

  function norm(s) {
    let t = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    t = t.replace(/&/g, ' and ').replace(/[’'`ʻ]/g, '').replace(/[^a-z0-9#+]+/g, ' ').trim();
    t = t.replace(/^(the|a|an) (?=\S)/, '');
    return t;
  }
  function singular(w) {
    if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.length > 4 && /(ses|xes|zes|ches|shes)$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) return w.slice(0, -1);
    return w;
  }
  function key(s) {
    return norm(s).split(' ').filter(Boolean).map(singular).join('');
  }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function allowed(len) { return len <= 4 ? 0 : len <= 8 ? 1 : 2; }

  const prompts = [];
  const byId = {};
  for (const raw of window.KRILLION_PROMPTS || []) {
    const p = { id: raw.id, q: raw.q, cat: raw.cat, answers: [], index: new Map(), byTier: {} };
    for (const t of ORDER) {
      p.byTier[t] = [];
      for (const chunk of String(raw[t] || '').split(';')) {
        const aliases = chunk.split('/').map((x) => x.trim()).filter(Boolean);
        if (!aliases.length) continue;
        const id = key(aliases[0]);
        if (!id || p.index.has(id)) continue; // first (more common) tier wins
        const ans = { id, display: pretty(aliases[0]), tier: t };
        let fresh = false;
        for (const al of aliases) {
          const k = key(al);
          if (k && !p.index.has(k)) { p.index.set(k, ans); fresh = true; }
        }
        if (fresh) { p.answers.push(ans); p.byTier[t].push(ans); }
      }
    }
    p.krill = p.byTier.k[0] || null;
    prompts.push(p);
    byId[p.id] = p;
  }

  function pretty(s) {
    const small = new Set(['and', 'of', 'the', 'in', 'on', 'de', 'di', 'da', 'del', 'du', 'le', 'la', 'a', 'to', 'for', 'or', 'with', 'von', 'van']);
    const keepUpper = new Set(['blt', 'usa', 'us', 'uk', 'uae', 'drc', 'edm', 'mma', 'bjj', 'nfl', 'asl', 'jfk', 'fdr', 'lbj', 'vw', 'gmc', 'bmw', 'amc', 'byd', 'tvr', 'mg', 'r&b', 'ii', 'iii', 'iv', 'v', 'vi', 'viii', 'sql', 'php', 'css', 'html', 'vba', 'vb', 'sas', 'spss', 'abap', 'cuda', 'glsl', 'hlsl', 'apl', 'idm', 'ebm', 'mpb', 'opm', 'hema', 'pvc', 'btu', 'au', 'psi', 'mph', 'xl', 'tsv']);
    return s.split(' ').map((w, i) => {
      if (keepUpper.has(w)) return w.toUpperCase();
      if (i > 0 && small.has(w)) return w;
      return w.replace(/(^|[-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
    }).join(' ').replace(/ S\b/g, '’s').replace(/ s\b/g, '’s').replace(/\bS Mores\b/, 'S’mores');
  }

  function match(prompt, guess) {
    const k = key(guess);
    if (!k) return null;
    if (prompt.index.has(k)) return prompt.index.get(k);
    const max = allowed(k.length);
    if (!max) return null;
    let best = null, bestD = max + 1;
    for (const [ak, ans] of prompt.index) {
      if (Math.abs(ak.length - k.length) > max) continue;
      if (allowed(ak.length) < 1) continue;
      const d = lev(k, ak, max);
      if (d < bestD || (d === bestD && best && ORDER.indexOf(ans.tier) < ORDER.indexOf(best.tier))) { best = ans; bestD = d; }
    }
    return bestD <= max ? best : null;
  }

  // Deterministic PRNG for daily picks.
  function mulberry(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function dailyPrompts(dayIndex) {
    const ids = prompts.map((p) => p.id).sort();
    const perCycle = Math.floor(ids.length / 7);
    const cycle = Math.floor(dayIndex / perCycle);
    const pos = ((dayIndex % perCycle) + perCycle) % perCycle;
    const perm = shuffle(ids, mulberry(9001 + cycle * 7919));
    // Spread categories: greedy reorder so the same category rarely appears twice in a day.
    const pick = perm.slice(pos * 7, pos * 7 + 7).map((id) => byId[id]);
    return pick;
  }

  // A few example answers from tiers deeper than the one hit, for the reveal.
  function deeperExamples(prompt, fromTier, n, rnd) {
    rnd = rnd || Math.random;
    let start = fromTier ? ORDER.indexOf(fromTier) + 1 : 2;
    if (start >= 5) start = 3; // after a krill hit, show other deep answers
    const pool = [];
    for (const t of ORDER.slice(Math.max(start, 2), 5)) pool.push(...prompt.byTier[t]);
    return shuffle(pool, rnd).slice(0, n);
  }

  window.KBank = { TIERS, ORDER, MISS_EMOJI, BANDS, band, prompts, byId, match, key, norm, dailyPrompts, deeperExamples, shuffle, mulberry };
})();
