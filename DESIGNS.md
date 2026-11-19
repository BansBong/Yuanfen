# Two website designs

Both designs share the same pages, copy, forms, database and admin. Only the look differs.

| | Git ref | Look |
| --- | --- | --- |
| **v1 "classic"** | tag `design-v1-classic` | Cream and watercolour gradients, red ribbons, Marcellus headings |
| **v2 "modern maroon"** | branch `main` (also `redesign-v2`) | Deep maroon bands, gold-and-red ribbon waves, city skyline, Playfair Display headings, gold buttons on dark, 缘 watermark |

The Coming Soon page, `/login` and `/admin` look the same in both.

## Which one is deployed

`main` is v2 (chosen on 19 Nov 2026). To go back to v1:

```bash
git checkout -b classic design-v1-classic
git push -u origin classic        # then set Vercel's Production Branch to "classic"
```

Every branch also gets its own Vercel preview URL (a full-site preview, noindex), so both can be compared side by side.

## How v2 is built (so it is easy to tweak)

- Everything is scoped to the `.site-v2` class on `<body>` (`src/app/[locale]/layout.tsx`) and `src/app/globals.css`.
- Dark sections use `<Section tone="dark">` (or the `tone-dark` class), which swaps the palette: cream text on maroon.
- Decorations live in `src/components/ui/Decor.tsx`: `Skyline`, `WaveEdge`, `Glyph`.
- Poster art for launch: `design/poster/` (v1 = current artwork, v2 = new look).
