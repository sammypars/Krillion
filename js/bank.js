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
  const NUMS = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', twenty: '20', hundred: '100', thousand: '1000' };
  const ABBR = { mt: 'mount', st: 'saint', ft: 'fort', dr: 'doctor', mr: 'mister', jr: 'junior', sr: 'senior', n: 'and' };
  // Words that carry no meaning in a guess: "mount hood" = "hood", "cheddar cheese" = "cheddar".
  const FILLER = new Set(['mount', 'mountain', 'lake', 'river', 'island', 'isle', 'the', 'a', 'an', 'of', 'type', 'kind', 'style', 'breed', 'variety', 'species', 'sauce', 'game', 'opening', 'defense', 'defence', 'variation', 'pose', 'knot', 'hitch', 'font', 'typeface', 'song', 'movie', 'film', 'ship', 'hms', 'uss', 'ss', 'city', 'town', 'tree', 'flower', 'mushroom', 'fungus', 'fish', 'bird', 'dog', 'cat', 'horse', 'pony', 'beer', 'cheese', 'bread', 'pasta', 'cocktail', 'language', 'dance', 'shoe', 'hat', 'rock', 'stone', 'mineral', 'gem']);
  function toks(s) {
    return norm(s).split(' ').filter(Boolean).map((w) => NUMS[w] || ABBR[w] || w).map(singular);
  }
  function key(s) { return toks(s).join(''); }
  function bare(s) {
    const t = toks(s);
    const kept = t.filter((w) => !FILLER.has(w));
    return kept.length ? kept.join('') : t.join('');
  }

  // Edit distance where swapping two neighbouring letters counts as one slip.
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let pp = null, prev = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (pp && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, pp[j - 2] + 1);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      pp = prev; prev = cur;
    }
    return prev[b.length];
  }
  // Typos allowed by length: none for 1-3 letters, then 1, 2, and 3 for long names.
  function allowed(len) { return len <= 3 ? 0 : len <= 7 ? 1 : len <= 12 ? 2 : 3; }

  // A rough "sounds like" key: fushia ~ fuchsia, chiwawa ~ chihuahua, rotwieler ~ rottweiler.
  function sound(k) {
    let t = k.replace(/[^a-z]/g, '');
    if (!t) return '';
    const first = t[0];
    t = t.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k').replace(/q/g, 'k')
      .replace(/x/g, 'ks').replace(/z/g, 's').replace(/dg/g, 'j').replace(/w/g, 'u').replace(/y/g, 'i');
    t = t[0] + t.slice(1).replace(/h/g, '');
    // vowel runs keep their first vowel, so banana and banon stay different
    t = t.replace(/(.)\1+/g, '$1').replace(/([aeiou])[aeiou]+/g, '$1');
    if (t.length > 3) t = t.replace(/[aeiou]$/, '');
    return first ? t : '';
  }
  const SMALL = new Set(['of', 'the', 'and', 'a', 'an', 'in', 'on', 'de', 'la', 'le', 'di', 'da', 'von', 'van']);
  const bag = (tk) => tk.filter((w) => !SMALL.has(w) && !FILLER.has(w)).sort().join(' ');

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
        ans.toks = toks(aliases[0]);
        ans.aliasToks = [];
        for (const al of aliases) {
          const k = key(al);
          if (k && !p.index.has(k)) { p.index.set(k, ans); fresh = true; }
          const tk = toks(al);
          if (tk.length) ans.aliasToks.push(tk);
        }
        if (fresh) { p.answers.push(ans); p.byTier[t].push(ans); }
      }
    }
    p.krill = p.byTier.k[0] || null;
    // Second index with filler words removed, only where it's unambiguous.
    p.bareIndex = new Map();
    const clash = new Set();
    for (const a of p.answers) for (const tk of a.aliasToks) {
      const b = bare(tk.join(' '));
      if (b.length < 3 || p.index.has(b)) continue;
      if (p.bareIndex.has(b) && p.bareIndex.get(b) !== a) clash.add(b); else p.bareIndex.set(b, a);
    }
    for (const b of clash) p.bareIndex.delete(b);
    // "Sounds like" and any-word-order indexes, again only where unambiguous.
    p.soundIndex = new Map(); p.bagIndex = new Map();
    const sClash = new Set(), bClash = new Set();
    for (const a of p.answers) for (const tk of a.aliasToks) {
      const sk = sound(tk.join(''));
      if (sk.length >= 4) { if (p.soundIndex.has(sk) && p.soundIndex.get(sk) !== a) sClash.add(sk); else p.soundIndex.set(sk, a); }
      if (tk.length >= 2) { const bg = bag(tk); if (bg.includes(' ')) { if (p.bagIndex.has(bg) && p.bagIndex.get(bg) !== a) bClash.add(bg); else p.bagIndex.set(bg, a); } }
    }
    for (const k of sClash) p.soundIndex.delete(k);
    for (const k of bClash) p.bagIndex.delete(k);
    prompts.push(p);
    byId[p.id] = p;
  }

  function pretty(s) {
    const small = new Set(['and', 'of', 'the', 'in', 'on', 'de', 'di', 'da', 'del', 'du', 'le', 'la', 'a', 'to', 'for', 'or', 'with', 'von', 'van']);
    const keepUpper = new Set(['blt', 'usa', 'us', 'uk', 'uae', 'drc', 'edm', 'mma', 'bjj', 'nfl', 'asl', 'jfk', 'fdr', 'lbj', 'vw', 'gmc', 'bmw', 'amc', 'byd', 'tvr', 'mg', 'r&b', 'ii', 'iii', 'iv', 'v', 'vi', 'viii', 'sql', 'php', 'css', 'html', 'vba', 'vb', 'sas', 'spss', 'abap', 'cuda', 'glsl', 'hlsl', 'apl', 'idm', 'ebm', 'mpb', 'opm', 'hema', 'pvc', 'btu', 'au', 'psi', 'mph', 'xl', 'tsv']);
    return s.split(' ').map((w, i) => {
      if (keepUpper.has(w) || /^[a-z]{1,3}\d+[a-z]?$/.test(w)) return w.toUpperCase();
      if (i > 0 && small.has(w)) return w;
      return w.replace(/(^|[-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
    }).join(' ').replace(/ S\b/g, '’s').replace(/ s\b/g, '’s').replace(/\bS Mores\b/, 'S’mores');
  }

  const tierRank = (a) => ORDER.indexOf(a.tier);
  function fuzzy(map, k) {
    const max = allowed(k.length);
    let best = null, bestD = 99;
    for (const [ak, ans] of map) {
      if (Math.abs(ak.length - k.length) > max + 1) continue;
      if (allowed(ak.length) < 1) continue;
      if (ak[0] !== k[0] && (k.length < 7 || ak[1] !== k[1])) continue; // a wrong first letter only passes on long words
      const d = lev(k, ak, max + 1);
      if (d < bestD || (d === bestD && best && tierRank(ans) < tierRank(best))) { best = ans; bestD = d; }
    }
    return { best, d: bestD, max };
  }
  // Is `small` a contiguous run inside `big`?
  function runIn(small, big) {
    outer: for (let i = 0; i + small.length <= big.length; i++) {
      for (let j = 0; j < small.length; j++) if (big[i + j] !== small[j]) continue outer;
      return true;
    }
    return false;
  }

  // Returns an answer object, or { near: answer } for a close-but-not-quite spelling, or null.
  function match(prompt, guess) {
    const k = key(guess);
    if (!k) return null;
    // 1. exact, with plurals/accents/number words/abbreviations folded
    if (prompt.index.has(k)) return prompt.index.get(k);
    // 2. ignoring filler like "Mount", "cheese", "pose"
    const b = bare(guess);
    if (prompt.bareIndex.has(b)) return prompt.bareIndex.get(b);
    if (prompt.index.has(b)) return prompt.index.get(b);
    // 3. typo tolerance
    const f1 = fuzzy(prompt.index, k);
    if (f1.best && f1.d <= f1.max && f1.max > 0) return f1.best;
    const f2 = b !== k ? fuzzy(prompt.bareIndex, b) : { best: null, d: 99, max: 0 };
    if (f2.best && f2.d <= f2.max && f2.max > 0) return f2.best;
    // 3b. any word order: "pisa leaning tower"
    const gtAll = toks(guess);
    if (gtAll.length >= 2) { const bg = bag(gtAll); if (prompt.bagIndex.has(bg)) return prompt.bagIndex.get(bg); }
    // 3c. sounds right even if spelled wrong
    const sk = sound(b.length >= 4 ? b : k);
    if (sk.length >= 4) {
      const sa = prompt.soundIndex.get(sk), cap0 = Math.ceil(k.length * 0.4);
      if (sa && lev(k, sa.id, cap0) <= cap0) return sa;
      if (sk.length >= 6) {
        let best = null, bestD = 2;
        const cap = Math.ceil(k.length * 0.34);
        for (const [ak, ans] of prompt.soundIndex) {
          if (Math.abs(ak.length - sk.length) > 1 || ak[0] !== sk[0] || ak[1] !== sk[1]) continue;
          const d = lev(sk, ak, 1);
          if (d < bestD && lev(k, ans.id, cap) <= cap) { best = ans; bestD = d; }
        }
        if (best) return best;
      }
    }
    // 4. extra words: "pablo picasso", "the mighty mississippi river" -> the longest listed answer inside the guess
    const gt = toks(guess);
    if (gt.length >= 2) {
      let best = null, bestLen = 0;
      for (const a of prompt.answers) for (const at of a.aliasToks) {
        const len = at.join('').length;
        if (len >= 4 && len >= gt.join('').length * 0.5 && at.length < gt.length && gt.length - at.length <= 2 && runIn(at, gt) && len > bestLen) { best = a; bestLen = len; }
      }
      if (best) return best;
    }
    // 5. a distinctive chunk of a longer answer: "leaning tower" -> Leaning Tower of Pisa
    const gk = gt.join('');
    if (gk.length >= 5) {
      const hits = new Set();
      for (const a of prompt.answers) for (const at of a.aliasToks) {
        if (at.length > gt.length && runIn(gt, at) && gk.length / at.join('').length >= 0.45) hits.add(a);
      }
      if (hits.size === 1) return [...hits][0];
    }
    // 6. one letter off the allowance: tell the player they're close, no penalty
    const near = [[f1, k], [f2, b]].map(([f, s]) => (s.length >= 5 ? f : null)).find((f) => f && f.best && f.d === f.max + 1);
    if (near) return { near: near.best };
    return null;
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
  // Days already played keep the prompts they launched with, even as the bank grows.
  const PINNED = { 0: ['element', 'tree', 'collective', 'cat', 'boardgame', 'nut', 'unit'] };
  function dailyPrompts(dayIndex) {
    if (PINNED[dayIndex]) return PINNED[dayIndex].map((id) => byId[id]).filter(Boolean);
    const ids = prompts.map((p) => p.id).sort();
    const perCycle = Math.floor(ids.length / 7);
    const cycle = Math.floor(dayIndex / perCycle);
    const pos = ((dayIndex % perCycle) + perCycle) % perCycle;
    const perm = shuffle(ids, mulberry(9001 + cycle * 7919)).map((id) => byId[id]);
    // Spread topics: each pick takes the topic with the most prompts left that the day doesn't have yet.
    const pool = {};
    for (const p of perm.slice(0, perCycle * 7)) (pool[p.cat] = pool[p.cat] || []).push(p);
    const days = Array.from({ length: perCycle }, () => []);
    for (let d = 0; d < perCycle; d++) {
      while (days[d].length < 7) {
        const have = new Set(days[d].map((p) => p.cat));
        const cats = Object.keys(pool).filter((c) => pool[c].length).sort((x, y) => pool[y].length - pool[x].length || (x < y ? -1 : 1));
        const c = cats.find((x) => !have.has(x)) || cats[0];
        days[d].push(pool[c].shift());
      }
    }
    return days[pos];
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

  window.KBank = { sound, TIERS, ORDER, MISS_EMOJI, BANDS, band, prompts, byId, match, key, norm, dailyPrompts, deeperExamples, shuffle, mulberry };
})();
