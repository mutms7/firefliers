# Firefliers

**Play it here: https://firefliers.vercel.app**

You're the last light in the meadow, and the night wants it gone. Firefliers is a small survivors-style game that runs in your browser, on a laptop or a phone, with nothing to install and no account to make. Your attacks fire on their own, so all you do is move, dodge, and pick what to grow into, and a full run takes about seven minutes.

I wanted something a friend could open from a link and be playing ten seconds later, and then want one more run because the last build almost worked.

## Why it's fun to come back to

- **A daily challenge you can compare.** Once a day everyone gets the same bug, the same upgrade cards, and the same waves, so the only difference is how you play it. When the run ends you can copy your result and paste it into a group chat.
- **Your flight is a weapon.** Stray fireflies are lost out in the dark. Rescue them and they trail behind you in a glowing rope. Fly a closed loop around your enemies and everything inside the ring burns, bullets included. Nightjars swoop in to snatch the firefly at the end of the line, and you can chase them down to free it.
- **Every run is a different build.** There are 8 weapons and you can only carry 5, each one evolves into a stronger form if you pair it with the right boost, and the cards you're offered change every time.
- **Five bugs to unlock.** Each one starts with a different weapon and plays differently, like the fast, fragile Moth or the slow, armored Beetle. You unlock them by playing well.
- **It gets harder when you're ready.** Beat the third boss to see the dawn, then keep going in endless mode or turn on Nightmare.

A copied daily result looks like this:

```
Firefliers Daily #1
Moth · 2:09 · the night won 🌙
375 squashed · level 11
◉ ✢ ❄ ☁ ✺
1,020 points (attempt 4)
https://firefliers.vercel.app/
```

## How the daily score works

The score is built so that dragging a run out earns nothing.

| What | Points |
|---|---|
| Time survived | 5 per second, and it stops counting at 6:00 |
| Enemies squashed | 1 each, and it stops counting at 6:00 |
| Bosses beaten | 400 each |
| Fireflies in your flight at the end | 60 each |
| Seeing the dawn | 2,000, plus 15 for every second you beat the last boss faster than 2:30 |

The last boss arrives at 6:00. From then on the only way to score more is to beat it quickly and keep your flight alive.

## How to play

| | Keyboard and mouse | Phone |
|---|---|---|
| Move | WASD or arrow keys, or click and drag | Drag anywhere |
| Dash | Space, Shift, or right-click | DASH button, or tap with a second finger |
| Pick an upgrade | Click a card, or press 1, 2, 3 | Tap a card |
| Reroll the cards | R (twice per run) | Reroll button |
| Pause and mute | Esc and M | Buttons in the top right |

Dashing makes you untouchable for a moment and hurts whatever you fly through, so it's your way out when you're surrounded. Your progress, unlocks, and best runs are saved in your browser.

## Where to find it

- **Live game:** https://firefliers.vercel.app (hosted on Vercel)
- **Source:** this repository. The whole game is one file, `index.html`.

## Running it yourself

There's no build step and nothing to install. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8765
```

Then go to http://localhost:8765.

## How it's built

Everything is in `index.html`: the graphics are drawn on a canvas, the sound effects and music are synthesized with the Web Audio API, and the only thing loaded from outside is the Fredoka font from Google Fonts (it falls back to your system font offline).

The daily challenge works without a server. The day's bug, upgrade offers, and enemy waves all come from a hash of the UTC date, so two people who open the game on the same day get the same run.

For tuning balance, `window.__glow` exposes the game state and an `update(dt)` step function, which lets you run fast simulated playtests from the browser console. Those bots are useful for catching errors and big balance swings, but they aren't a substitute for real people playing.

## What's next

A shared leaderboard for the daily challenge, permanent upgrades that carry between runs, and new meadows with their own enemies and bosses.
