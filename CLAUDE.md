# Firefliers

A one-file browser game (`index.html`). Live at https://firefliers.vercel.app.

- **Art:** before drawing, restyling or adding any visual (sprites, tiles, icons, UI, hub), read `design/ART_DIRECTION.md` and follow it. Reuse the sprite helpers rather than drawing vector shapes.
- **Design sources:** `design/src/` holds the hub, Root Tree, icon, projectile and UI-kit art. `python design/src/build.py` (run from the repo root) rebuilds `design/the-hollow.html`.
- **Testing:** `.claude/bot.js` runs simulated games (it mutes the game). Keep test runs silent.
