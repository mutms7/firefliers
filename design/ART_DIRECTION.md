# Firefliers art direction

Read this before drawing or restyling anything. It records the rules the current art follows, so new pieces match without anyone having to re-derive them. The living examples are in `index.html` (enemies, HUD, menus) and `design/src/` (the Haven, Root Tree, icons, projectiles, UI kit). `design/the-hollow.html` is the built review page.

## The one-line direction

A firefly's night: pixel art with Vampire Survivors' readability, Rain World's moody atmosphere, and none of the medieval trim. Warm light against a cold, quiet dark.

## Pillars

1. **Silhouette first.** Every creature, station and icon must read as a solid black shape. If it doesn't, fix the shape before adding detail.
2. **Warm light, cold night.** The world is muted teal-grey and dark. Light is warm amber and gold, or a station's own colour. Bright, saturated colour is saved for creatures, pickups and light.
3. **Simple hub, deep tree.** A few stations, close together, each with its own light. Depth lives in the Root Tree, not in more rooms or menus.
4. **Few words.** Descriptions are a few words ("Dashes leave fire"). Players learn by trying things.

## Pixels

- Everything is drawn as small character grids and baked to canvas at load (`bake()` in `design/src/core.js`, `bakeFrame()` in `index.html`). Upper-case letters are shaded materials, lower-case letters are flat colours, `.` is empty.
- **Shading:** light comes from the top left. Each material uses a five-step ramp: deep shadow, shadow, base, light, highlight. Shadows lean cooler and more purple, highlights lean warmer. A dithered band runs into the lower third.
- **Outline:** one pixel, darker than both the sprite and the ground (near-black, slightly tinted to the creature). Elites swap it for a gold outline. The hit flash turns the body white and keeps the outline.
- **One pixel size per family:** every regular enemy uses `PX = 1.85` world units per art pixel, and every boss uses `PX_BOSS = 3.6`. Never mix pixel sizes side by side.
- **Never rotate sprites freely.** Creatures face right and flip to face the player. The only exceptions are things that are round or top-down (Eclipse, Weaver, thorns).
- **Two frames** are enough for most animation (walk, flap, flicker). Keep idle motion small.
- Draw at whole-number scale, with `imageSmoothingEnabled = false` and `image-rendering: pixelated`.

## Palette

| Use | Colours |
|---|---|
| Night ground | `#0a0c0d` to `#1a2c28` (hub grass is a little greener than the run's) |
| UI ink, dim, mute | `#e9e4d6`, `#8d9491`, `#5d6563` |
| UI lines | `#283030`, `#465150`, highlight `#d8d2c2` |
| Gold (levels, primary buttons, owned) | `#f2c14e` |
| Mint (daily, done) | `#7fd6c2` |
| Danger | `#e8604c` |
| Amber ramp (currency, Root Tree) | `#5a2408 #9a4a10 #e08a1c #ffb83a #ffe7a0` |
| Stone / mossy stone / bark / leaf | see `P` in `design/src/core.js` |

Station lights: the Lantern Gate is warm `255,200,110`, the Elder Root is amber `255,170,60`, the Moonstone is mint `127,214,194` and the Roost is rose `255,150,170`.

## Creatures

- Each enemy is a night creature whose shape says what it does: fast things are narrow and pointy (gnat), tanks are wide and squat (toad), ranged enemies show where their shots come from (the bombardier beetle's tail nozzle), and splitters show what they split into (the brood jelly's grubs).
- Wind-ups must be visible: the puffcap swells and its cracks glow before it bursts, the Maw's jaw gapes when it inhales, and the Weaver tucks its legs before it pounces.
- Minions are smaller than the creature they serve, and bosses are much larger.

## Projectiles

- **Yours:** warm, bright and pointed in the direction they fly.
- **Theirs:** round, deep red or magenta, with a dark core and a bright rim.
- They must never read alike, even in a crowd of both.

## World tiles

- 16×16 tiles, with 3 or 4 tones per material. Clusters wrap across tile edges so the grid doesn't show, and each ground type has at least two variants.
- Shadows go on one or two faces only and are never longer than a tile.
- The run's meadow is colder and darker than the hub, so creatures and your light pop.

## The Haven (hub)

- The game always opens on the main menu (logo, bug cards, every way to play in one "Fly out" box). The Haven is a walkable place you visit from there. It was called the Hollow until 2026-11-25.
- **Stations:** the Lantern Gate and the Moonstone share the central plaza, because everything to do with playing lives in one spot (the Gate offers Night, Daily, Nightmare and How to play). Around it: the Elder Root (the Root Tree), the Roost (one domed mushroom per bug, with its bug perched on the cap, or a silhouette if it's locked) and the Records board.
- **Unbuilt places** (the Pond, the Market, the Old Road) are paths into soft, feathered, slowly drifting mist with no hard edges. Their art is finished, so opening one only means lifting its mist.
- Every station sits on its own dirt clearing with its own coloured light, joined to the plaza by stepping stones. The space between stations is darker than the stations.
- The camera is 3x (2x on phones), follows your bug, and can glide to a station when a resident points at it. Entering opens with a circle of light growing from your bug. You can dash in the Haven; it does nothing but look nice.

## Root Tree

- One tree, growing up from First Light. **Light** (gold) is attacks, **Wing** (mint) is dashing and fireflies, **Root** (green) is survival and amber. Bridge nodes between neighbouring branches unlock weapons.
- Prefer nodes that add something new (a new weapon, a new mechanic, a new bug) over bigger numbers.
- Nodes are 34px round badges in the branch colour. Grown nodes are lit with a glow, nodes you can grow next have a coloured ring, and locked nodes are dimmed.

## Characters

- Three bugs: the Firefly (steady), the Moth (fast, fragile) and the Beetle (slow, tough). The Moth and the Beetle are grown on the tree.
- **Residents** (added 2026-11-25, each with their own pixel sprite and lines):
  - **Glim:** an old moth who built the Haven. Proud of it, a bit vain about it, warm but dry, and always "renovating". He gives the first-time tour and takes feedback for the maker.
  - **Shellby:** a snail by the Market that has been "opening any day now" forever. Brisk, a haggler and an incurable gossip whose gossip is real boss tips.
  - **Wick:** a young firefly with big round glasses who keeps the Records. An overexcited stat nerd.
  - **Pell:** a sleepy frog who fishes for reflected stars at the edge of the Pond and says one slow, odd thought at a time.
- Don't add more residents lightly. Each one needs a personality that shows in every line.

## UI

- Pixel 9-slice pieces (`design/src/ui.js`): flat dark slabs with corner brackets, chunky buttons with a hard bottom bevel that moves to the top when pressed, and a lantern-knob slider, toggle and key caps.
- Only add controls the game actually needs. Settings are Music, Sounds and Screen shake; the game already follows the device's reduce-motion setting.
- **Font: Jersey 20** (Google Fonts), picked on 2026-11-25. Its strokes are two pixels thick and its letters are plain, so labels read at a glance while it still looks chunky and pixel-drawn. Rejected: Pixelify Sans (quirky letter shapes) and DotGothic16 (one-pixel strokes look thin). Jersey 20's letters are small for their size, so body text is 20px, small text never below 18px, and headings around 40px. It has one weight; for emphasis use colour or size, not bold. Headings are uppercase with a hard drop shadow. Keep ligatures off.

## Writing

- Labels and descriptions are as short as possible: names of one or two words, descriptions of a few words, no em dashes.
- Resident dialogue is the exception. It is written in full, natural sentences in the character's voice, never clipped or list-like, and each line says one thing.
