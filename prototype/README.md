# Offline prototype

An image-based mockup of the homepage — every section flattened to a screenshot, with the ZIP
availability popup and every call/email CTA still functional. Built for showing the design
without shipping the real copy or markup (e.g. on a call, or to someone who shouldn't get the
live source).

**Not deployed.** This folder is never uploaded to Hostinger and never linked from the live site.
`index.html` also carries `<meta name="robots" content="noindex, nofollow">` as a safety net in
case the link is ever shared.

## What's generated vs. tracked

`assets/sections/*.png` and `hotspots.json` are **gitignored** — they're rebuilt from the live
site's current HTML/CSS, not hand-maintained, so keeping them in git would just be a second copy
that silently goes stale. Everything else (`index.html`, `css/`, `js/`) is tracked normally.

## Regenerating

```bash
# 1. Serve the site locally (repo root)
python3 -m http.server 8848

# 2. Capture every section at mobile/tablet/desktop, export mobile/tablet/laptop/4k PNGs,
#    and measure every hotspot's position as a percentage of its section
node scripts/capture-sections.mjs

# 3. Turn those measured percentages into CSS (never hand-type these numbers)
node scripts/build-hotspot-css.mjs
```

Re-run both whenever the live site's sections, copy, or CTA layout change — the section list and
hotspot selectors are defined at the top of `scripts/capture-sections.mjs` and need updating to
match if sections are added, removed, or restructured (this happened once already: see commit
`0f0f41d`, which took the section count from 17 down to 13).

## How it works

Each section is a `<picture>` (`assets/sections/<key>-{mobile,tablet,laptop,4k}.png`) with real,
transparent, labelless controls positioned on top by percentage — an `<input>`/`<button>` pair
for the ZIP checker, `<a href="tel:…">`/`<a href="mailto:…">` for every CTA. Position and size
come from `css/hotspots.generated.css`, built from measurements `capture-sections.mjs` takes
directly off the live DOM — not guessed or hand-typed.

`js/prototype.js` is a trimmed copy of the live site's `../js/main.js`: the same `HOTLINE`
constant, the same ZIP-validation logic, the same modal markup and focus-trap/Esc handling. The
header-scroll and FAQ-accordion logic aren't needed here (no sticky header or expandable FAQ in
this prototype) and were left out.

**Known scope reduction:** the FAQ section is captured collapsed with no expand interaction —
that wasn't part of the original ask (popup + CTA calls). Wiring it up would mean capturing
expanded/collapsed image pairs per question instead of one flat image; ask if you want that.
