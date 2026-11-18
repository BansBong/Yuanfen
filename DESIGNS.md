# Two website designs

Both designs share the same pages, copy, forms, database and admin. Only the look differs.

| | Git ref | Look |
| --- | --- | --- |
| **v1 "classic"** | tag `design-v1-classic` (also `main`) | Cream and watercolour gradients, red ribbons, Marcellus headings |
| **v2 "modern maroon"** | branch `redesign-v2` | Deep maroon bands, gold-and-red ribbon waves, city skyline, Playfair Display headings, gold buttons on dark, 缘 watermark |

The Coming Soon page, `/login` and `/admin` look the same in both.

## Deploy one of them

- **v1:** deploy branch `main` as Production (nothing to do).
- **v2:** either set Vercel's Production Branch to `redesign-v2`, or merge it: `git checkout main && git merge redesign-v2`.
- **Compare first:** every branch gets its own Vercel preview URL (a full-site preview, noindex). Open both previews side by side.
- **Switch back later:** `git checkout main && git reset --hard design-v1-classic` (or change Production Branch back).

## How v2 is built (so it is easy to tweak)

- Everything is scoped to the `.site-v2` class on `<body>` (`src/app/[locale]/layout.tsx`) and `src/app/globals.css`.
- Dark sections use `<Section tone="dark">` (or the `tone-dark` class), which swaps the palette: cream text on maroon.
- Decorations live in `src/components/ui/Decor.tsx`: `Skyline`, `WaveEdge`, `Glyph`.
- Poster art for launch: `design/poster/` (v1 = current artwork, v2 = new look).
