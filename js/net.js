// Tiny Supabase REST client: reads via PostgREST, writes via RPC functions.
(function () {
  const C = window.KRILLION_CONFIG;
  const headers = { apikey: C.supabaseKey, 'Content-Type': 'application/json' };
  if (!C.supabaseKey.startsWith('sb_')) headers.Authorization = 'Bearer ' + C.supabaseKey;

  async function req(path, opts = {}) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 9000);
    try {
      const res = await fetch(C.supabaseUrl + path, { ...opts, headers: { ...headers, ...(opts.headers || {}) }, signal: ctl.signal });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error((data && (data.message || data.hint)) || res.statusText);
      return data;
    } finally { clearTimeout(timer); }
  }
  const rpc = (fn, body) => req('/rest/v1/rpc/' + fn, { method: 'POST', body: JSON.stringify(body) });
  const get = (table, query) => req('/rest/v1/' + table + '?' + query);

  window.KNet = {
    register: (name) => rpc('register_player', { p_name: name }),
    rename: (id, token, name) => rpc('rename_player', { p_player: id, p_token: token, p_name: name }),
    submitDaily: (id, token, day, score, tiers, answers) =>
      rpc('submit_daily', { p_player: id, p_token: token, p_day: day, p_score: score, p_tiers: tiers, p_answers: answers }),
    submitEndless: (id, token, score, cleared) => rpc('submit_endless', { p_player: id, p_token: token, p_score: score, p_cleared: cleared }),
    suggest: (promptId, answer, id) => rpc('suggest_answer', { p_prompt: promptId, p_answer: answer, p_player: id || null }),
    daily: (day, limit = 50) =>
      get('daily_scores', `day=eq.${day}&select=name,score,tiers,player_id&order=score.desc,created_at.asc&limit=${limit}`),
    dailyCount: async (day) => {
      const res = await fetch(C.supabaseUrl + `/rest/v1/daily_scores?day=eq.${day}&select=player_id`, {
        method: 'HEAD', headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
      });
      const r = res.headers.get('content-range') || '';
      return Number(r.split('/')[1] || 0);
    },
    endless: (sinceIso, limit = 50) =>
      get('endless_scores', `select=name,score,cleared,player_id,created_at${sinceIso ? '&created_at=gte.' + sinceIso : ''}&order=score.desc,created_at.asc&limit=${limit}`),
    answerStats: (day, promptId) =>
      Promise.all([
        get('answer_counts', `day=eq.${day}&prompt_id=eq.${encodeURIComponent(promptId)}&select=answer,n&order=n.desc&limit=200`),
        get('prompt_plays', `day=eq.${day}&prompt_id=eq.${encodeURIComponent(promptId)}&select=n`),
      ]).then(([answers, plays]) => ({ answers, plays: (plays[0] && plays[0].n) || 0 })),
  };
})();
