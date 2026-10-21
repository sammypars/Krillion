# Krillion

A daily trivia dive where the obvious answer barely counts. Seven prompts a day, the same for everyone; rarer answers sink you deeper.

Play: https://sammypars.github.io/Krillion/

## How it plays
- **Daily dive**: 7 prompts, 25 s of air each, wrong guesses cost 3 s. Resets at midnight UTC.
- **Tiers**: Plankton 10 · Too Clever 15 · Schooler 30 · Rare 60 · Deep Cut 85 · One in a Krillion 100. 1 point = 4 m.
- **Endless**: one 45 s tank, correct answers refill it (rarer = more air).
- **Practice packs**: replay any topic, no leaderboard.
- History, streaks, calendar and answer distribution live in the browser (localStorage).
- Daily and endless leaderboards, live "how others answered" stats and missing-answer suggestions live in Supabase.

## Files
- `index.html`, `styles.css` — page and design
- `js/prompts-a.js`, `js/prompts-b.js`, `js/prompts-c.js` — the answer bank (85 prompts, ~12,500 answers; part C is the niche pack)
- `js/bank.js` — answer matching (accents, plurals, typos) and daily prompt selection
- `js/app.js` — game flow, screens, history, leaderboards
- `js/fx.js` — ocean, particles, sounding line, synthesized sound
- `js/net.js`, `js/config.js` — Supabase client and settings
- `supabase/schema.sql` — notes on the backend

## Adding prompts
Add an object to either prompts file:
```js
{ id: 'unique-id', q: 'Name a …', cat: 'Food & drink',
  p: 'obvious;answers', c: 'the famous clever one', s: '…', r: '…', d: '…', k: 'the single rarest' }
```
Answers are `;`-separated, aliases `/`-separated. Changing the number of prompts reshuffles future days. Days already played are pinned in `PINNED` in `js/bank.js`; add the day's ids there before adding prompts if you want to freeze it.
