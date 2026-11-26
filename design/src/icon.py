# Builds the site icons (favicon, home-screen icons, and a large square for Discord) from the
# game's own Firefly sprite: the bug on a 32 by 32 pixel night, with stepped warm rings of light
# centred on its lantern and a few stray sparks. Run from the repo root: python design/src/icon.py
from PIL import Image, ImageDraw
import os

# the Firefly sprite (ART.BUGS.firefly, frame 0), one colour per pixel
SPRITE = """
. . . . . #050608 #050608 . . . . . . . . . . .
. . . . #050608 #f6fbff #a8bfd4 #050608 . . . . #050608 . . #050608 . .
. . . #050608 #f6fbff #f6fbff #a8bfd4 #a8bfd4 #050608 . . #050608 #4a3a6a #050608 #050608 #4a3a6a #050608 .
. . #050608 #a8bfd4 #6a8098 #a8bfd4 #6a8098 #a8bfd4 #6a8098 #050608 #050608 #050608 #050608 #4a3a6a #4a3a6a #050608 . .
. #050608 #050608 #050608 #3a4a5e #3a4a5e #3a4a5e #3a4a5e #3a4a5e #3a4a5e #56447a #3d2f5a #3d2f5a #2b2140 #050608 . . .
#050608 #fff3a0 #fff3a0 #ffe066 #56447a #7a68a0 #7a68a0 #7a68a0 #56447a #56447a #2b2140 #3d2f5a #56447a #20163a #2b2140 #050608 . .
#050608 #fff3a0 #ffffe0 #d8a820 #56447a #3d2f5a #3d2f5a #3d2f5a #3d2f5a #3d2f5a #2b2140 #3d2f5a #20163a #ffffff #2b2140 #050608 . .
#050608 #ffe066 #d8a820 #d8a820 #2b2140 #2b2140 #2b2140 #2b2140 #2b2140 #2b2140 #1a1028 #2b2140 #20163a #2b2140 #120a1e #050608 . .
. #050608 #8a6a10 #8a6a10 #8a6a10 #1a1028 #1a1028 #1a1028 #1a1028 #1a1028 #1a1028 #120a1e #120a1e #120a1e #050608 . . .
. . #050608 #050608 #050608 #2b2140 #050608 #050608 #2b2140 #050608 #050608 #2b2140 #050608 #050608 . . . .
. . . #050608 #2b2140 #050608 #050608 #2b2140 #050608 #050608 #2b2140 #050608 . . . . . .
. . . . #050608 . . #050608 . . #050608 . . . . . . .
"""
GRID = [row.split() for row in SPRITE.strip().splitlines()]
SW, SH = len(GRID[0]), len(GRID)
RINGS = [(17, '#131c1b'), (13, '#1f2a1e'), (10, '#3d3a17'), (7.5, '#6e5614'), (5, '#a07a16')]
SPARKS = [(4, 6, '#ffe066'), (27, 5, '#fff3a0'), (28, 26, '#ffe066'), (3, 25, '#d8a820'), (21, 3, '#d8a820'), (25, 15, '#8a6a10')]


def art():
    """The 32 by 32 picture, one cell per art pixel."""
    k = max(1, 28 // SW)  # sprite scale inside the grid (1 here, the grid itself is scaled later)
    ox, oy = round((32 - SW * k) / 2) + 2, round((33 - SH * k) / 2)
    lit = [(x, y) for y, r in enumerate(GRID) for x, c in enumerate(r) if c in ('#ffe066', '#d8a820')]
    cx = ox + (sum(x for x, _ in lit) / len(lit) + .5) * k
    cy = oy + (sum(y for _, y in lit) / len(lit) + .5) * k
    im = Image.new('RGBA', (32, 32), '#0b1113')
    px = im.load()
    for r, col in RINGS:
        for y in range(32):
            for x in range(32):
                if (x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 < r * r:
                    px[x, y] = Image.new('RGBA', (1, 1), col).getpixel((0, 0))
    for x, y, col in SPARKS:
        px[x, y] = Image.new('RGBA', (1, 1), col).getpixel((0, 0))
    for y, r in enumerate(GRID):
        for x, c in enumerate(r):
            if c != '.':
                px[ox + x, oy + y] = Image.new('RGBA', (1, 1), c).getpixel((0, 0))
    return im


def icon(n, round_corners):
    big = art().resize((n * 4, n * 4) if n < 64 else (n, n), Image.NEAREST)
    im = big.resize((n, n), Image.NEAREST) if n < 64 else big
    if round_corners:  # favicons get soft corners; app icons stay square because the phone rounds them
        m = Image.new('L', (n * 4, n * 4), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, n * 4 - 1, n * 4 - 1), radius=int(n * 4 * .2), fill=255)
        im.putalpha(m.resize((n, n), Image.LANCZOS))
    return im


os.makedirs('icons', exist_ok=True)
for name, n, rc in [('favicon-32.png', 32, True), ('favicon-64.png', 64, True), ('apple-touch-icon.png', 180, False),
                    ('icon-192.png', 192, False), ('icon-512.png', 512, False), ('firefliers-discord-1024.png', 1024, False)]:
    icon(n, rc).save(os.path.join('icons', name))
icon(64, True).save('icons/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print('ok')
