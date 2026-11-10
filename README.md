# Firefliers

A small survivors-style arena game that runs in the browser. Play it at https://firefliers.vercel.app. You're the last light in the meadow, your attacks fire on their own, and you move, dodge, and pick upgrades until dawn breaks (after the third boss, a little past 6:00).

The whole game is one file, `index.html`, with no build step and no dependencies (the Fredoka font loads from Google Fonts and falls back to the system font offline). Graphics are drawn on a canvas and the sound is synthesized with the Web Audio API.

## Play

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8765
```

- Move: WASD, arrow keys, or drag with a mouse or finger
- Dash: Space, Shift, right-click, or the DASH button on touch screens
- Upgrades: click a card or press 1, 2, 3 (R rerolls, twice per run)
- Esc pauses, M mutes

## What's in it

- 5 bugs with different starting weapons and stats (4 are unlocked by playing)
- 8 weapons, each with an evolution you get by maxing it while holding a matching boost
- 9 passive boosts, and a 5 weapon limit so every run is a different build
- 8 enemy types, elites, swarm events, and a boss every two minutes
- A daily challenge: one seeded run per day where everyone gets the same bug, the same upgrade cards, and the same waves, with a score and a result you can copy into a group chat
- Nightmare mode and an endless mode after you win
- Progress and best run saved in the browser (localStorage)

## Development notes

`window.__glow` exposes the game state and an `update(dt)` step function, which makes it possible to run fast simulated playtests from the browser console when tuning balance.
