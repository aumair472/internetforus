# Internet For Us — Design Documentation

A vanilla HTML/CSS/JS build of the homepage and privacy policy for **internetforus.com**,
structured after [alllinkusa.com](https://alllinkusa.com/) and rebranded to Internet For Us.

The source is WordPress 7.0.4 + Elementor 4.2.4 on the Hello Elementor theme — but almost none of
the page is built from Elementor widgets. Nearly every section is hand-written HTML and CSS pasted
into Elementor HTML widgets: **22 inline `<style>` blocks totalling ~90KB on the homepage**, across
three class namespaces (`alusa-*` marketing sections, `alu-*` informational sections, `tm-*` ZIP
checker). The design system below was extracted from that CSS, so the values are the source's
actual values rather than approximations from screenshots.

Reference captures are generated locally rather than committed — see the README for the
capture command. They go stale on every design change, so regenerate rather than trust an old one.

---

## 0. Brand identity

The site ships its own mark rather than the reference site's logo.

### Logo

A two-part lockup: a **signal tile** plus the **internetforus wordmark**.

- **Tile** — `7.5/32` rounded square in `--brand` `#0066d4`, carrying two white Wi-Fi arcs and a
  dot at `2.6` stroke width with round caps. Two arcs rather than the conventional three, so the
  mark stays legible down to 16px.
- **Wordmark** — Plus Jakarta Sans 800, `-0.6px` tracking, split two-tone:
  `internet` in `#0d1222` and `forus` in `--brand` `#0066d4`. Held in `assets/logo.svg` for use
  off-site; **the header deliberately shows the tile alone**, with the brand name carried by the
  link's `aria-label` so the mark stays the only element competing with the CTA.

| State | Behaviour |
|---|---|
| Rest | Tile at 42px with `0 2px 8px rgba(0,102,212,.22)` |
| Hover | Lifts `1px`, tile shadow deepens to `0 5px 16px rgba(0,102,212,.34)` |
| Active | Returns to rest |
| ≤767px | Tile 36px |
| ≤480px | Tile 34px |

`assets/logo.svg` holds the same lockup as a standalone file (246×40) for use outside the site.

### Favicon

`assets/favicon.svg` — the tile alone, no wordmark, at a 32×32 viewBox. Served as
`image/svg+xml` with an `apple-touch-icon` pointing at the same file. Vector means one asset
covers every density.

---

## 1. Colour scheme

Two palettes coexist in the source: the Elementor global kit, and the hand-written section CSS.
**The section CSS is what actually renders**, so the build implements that one. Both are recorded
here.

### Brand palette (implemented)

| Token | HEX | HSL | Role |
|---|---|---|---|
| `--ink` | `#251444` | `265° 55% 17%` | Headings and body text in the informational sections; modal scrim base |
| `--brand` | `#0066d4` | `211° 100% 42%` | Hero headline, primary buttons, icon strokes, links |
| `--brand-dark` | `#004da3` | `212° 100% 32%` | Primary button hover |
| `--sky` | `#34a2e2` | `201° 74% 54%` | Header CTA, eyebrow/tag text, step badges, stat numbers |
| `--sky-dark` | `#2b8bc4` | `202° 64% 47%` | Sky hover |
| `--accent` | `#0a59e7` | `219° 92% 47%` | Footer link hover (Elementor kit accent) |
| `--danger` | `#e53935` | `1° 78% 55%` | **Connect Hotline** CTA |
| `--danger-dark` | `#c62828` | `0° 66% 47%` | Hotline hover |
| `--danger-text` | `#c0392b` | `6° 63% 46%` | Inline validation errors |
| `--gold` | `#ffc72c` | `44° 100% 59%` | "ONLINE EXCLUSIVE PRICE" badge |
| `--green` | `#10b981` | `160° 84% 39%` | "$1,000 GUARANTEE" badge |
| `--amber` | `#d97706` | `32° 95% 44%` | Important-notice heading |

### Surfaces

| Token | HEX | Role |
|---|---|---|
| `--surface` | `#ffffff` | Section and card backgrounds |
| `--surface-alt` | `#f5f5f5` | Hero fallback behind the photo |
| `--surface-soft` | `#f7f9fa` | Feature boxes, deal cards, difference cards |
| `--surface-stat` | `#f9fbfd` | Stats strip, note blocks |
| `--surface-tint` | `#eef8fd` | Icon tiles, modal success icon |
| `--surface-blue` | `#edf5ff` | Savings deal card |
| `--surface-shell` | `#f3f4f9` | Footer panel |
| `--notice-bg` / `--notice-border` | `#fff8e6` / `#ffe0b2` | Important-notice box |

### Lines & text

| Token | HEX | Role |
|---|---|---|
| `--line` | `#e2ded6` | Card borders — the most-used border in the design |
| `--line-cool` | `#e2e8f0` | Nav pills, service cards |
| `--line-card` | `#dcdfe4` | Plan cards |
| `--line-soft` | `#eef2f5` | Difference cards |
| `--line-faint` | `#f2efe9` | Row dividers in the NOT-Do list |
| `--text` | `#111928` | Footer text (Elementor kit text colour) |
| `--text-strong` | `#000000` | Section headings in marketing sections |
| `--text-dark` | `#1a1a1a` | Default body colour |
| `--text-body` | `#555555` | Paragraph copy |
| `--text-mid` | `#4a4a4a` | Secondary copy |
| `--text-muted` | `#737177` | Tertiary copy, modal close |
| `--text-dim` | `#53565a` | Hero eyebrow |
| `--text-faint` | `#767676` | Fine print |

### Elementor global kit (recorded, not implemented)

`accent #0A59E7` · `text #111928` · `primary #F3F4F9` · `secondary #F5F5F5` ·
`#1D1D1D` · `#616161` · `#B2B1B4` · `#DF6962` · `#151515` · `#B2B1B4`

### Shadows & scrim

```css
--shadow-card:  0 4px 12px rgba(37, 20, 68, .04);   /* cards at rest       */
--shadow-hover: 0 8px 20px rgba(37, 20, 68, .08);   /* card hover lift     */
--shadow-faq:   0 2px 8px  rgba(37, 20, 68, .03);   /* FAQ rows            */
--shadow-modal: 0 15px 50px rgba(37, 20, 68, .20);  /* modal card          */
--scrim:        rgba(37, 20, 68, .55);              /* modal backdrop      */
```

---

## 2. Typography

Three families are referenced by the source; all three are loaded here from Google Fonts.

| Family | Weights | Where |
|---|---|---|
| **Open Sans** | 400 / 600 / 700 / 800 | Hero, plans, deals, services, difference, legal (`--font-sans`) |
| **Outfit** | 400 / 600 / 700 / 800 | ZIP checker, modals, informational sections, FAQ (`--font-alt`) |
| **Plus Jakarta Sans** | 300 / 500 / 600 / 700 / 800 | Footer and privacy policy (`--font-brand`) |

> **Deliberate deviation:** every `alu-*` rule in the source asks for `'Outfit', sans-serif`, but
> the source never loads Outfit — so those sections currently render in the browser's default
> sans-serif. This build loads Outfit properly, which is what the original CSS intended.

### Scale

| Role | Desktop | ≤1024px | ≤767px |
|---|---|---|---|
| Hero H1 | 52px / 1.08 / 800 / −1px | 42px | 24px (22px ≤480) |
| Hero eyebrow | 13px / 700 / uppercase / 1.2px | — | 11px |
| Hero body | 16px / 1.5 / 400 | — | 12px / 1.35 |
| Marketing section H2 | 44px / 800 / −1px | 32px | 28px |
| Informational H2 | 32px / 700 | — | 24px |
| ZIP checker H2 | 38px / 700 / 1.2 | — | 20px |
| Modal "Congratulations!" | 34px / 800 / 1.2 | — | 24px (22px ≤480) |
| Plan speed | 34px / 800 | — | — |
| Plan price | 46px / 800 (unit 18px) | — | — |
| Card H3 | 18px / 700 | — | — |
| FAQ question | 16px / 700 | — | 14.5px |
| FAQ answer | 14px / 1.6 | — | 13.5px |
| Body copy | 14px / 1.5 | — | — |
| Fine print | 11.5px / 1.6 | — | — |
| Privacy H1 | 44px / 700 | — | 30px |
| Privacy H3 | 22px / 700 | — | 19px |
| Privacy body | 16px / 1.9 (max 72ch) | — | 15px / 1.8 |

---

## 3. Layout

| Container | Width | Used by |
|---|---|---|
| `--wide` | 1200px | Header, hero, plans, deals, services, difference, legal |
| 1140px | | Footer panel |
| `--mid` | 1100px | What We Do, Guidance, Steps, Why Independent |
| `--narrow` | 900px | What We Do NOT Do, FAQ |
| 820px | | Privacy policy column |
| 760px | | ZIP checker |
| 540px | | Modal card |

**Breakpoints** match the source's own Elementor configuration:

- Mobile: `≤767px`
- Tablet: `768px – 1024px`
- Desktop: `>1024px`
- Two extra fine-tuning stops the source also uses: `≤480px`, and grid shifts at `≤600px`

---

## 4. Components & states

### Header *(intentional redesign — not a clone)*

The source header is a hamburger on the **left at every breakpoint** with no desktop navigation at
all, plus a flat `#34a2e2` pill on the right. Per the brief it was replaced with a
**logo-left / CTA-right** bar:

| State | Behaviour |
|---|---|
| Rest | `position: sticky`, `rgba(255,255,255,.92)`, transparent bottom border |
| Scrolled (`>10px`) | `.is-scrolled` → `rgba(255,255,255,.72)` + `backdrop-filter: blur(14px) saturate(180%)`, `1px` bottom border in `--line`, soft shadow |
| No `backdrop-filter` support | `@supports not` fallback to opaque `rgba(255,255,255,.98)` |
| Logo hover | tile lifts `1px`, shadow deepens |
| CTA hover | `--sky-dark`, `translateY(-1px)`, deepened shadow |
| CTA active | `translateY(0)`, shadow returns to rest |
| Focus | 3px `--sky` ring, 2px offset (global `:focus-visible`) |

There is no navigation menu and no mobile drawer — the header is logo + CTA at every width.
Below 768px the CTA tightens to `10px 18px` / `13.5px` and the logo drops to 30px.

### Buttons

| Class | Rest | Hover | Active |
|---|---|---|---|
| `.cta-btn` | `--sky` fill, 999px radius, `12px 26px` | `--sky-dark` + lift | returns to baseline |
| `.btn-solid` | `--brand` fill, full width, 25px radius | `--brand-dark` | — |
| `.btn-pill` | `--brand` fill, `12px 32px` | `--brand-dark` | — |
| `.btn-outline` | transparent, 2px `--brand` border | fills `--brand`, text white | — |
| `.hotline-btn` | `--danger` fill, 50px radius | `--danger-dark` + `translateY(-1px)` | returns to baseline |
| `.footer-btn` | `--surface-shell` fill, `--text` border, `--accent` text | white fill, `--accent` border, lift | returns to baseline |

### Cards

All card families share one interaction: `translateY(-3px)` (`-4px` for plan cards) plus a
deepened shadow on hover, over `.2s`. Borders are `--line` in the informational sections,
`--line-cool` / `--line-card` / `--line-soft` in the marketing sections.

### ZIP checker & availability popup

| State | Behaviour |
|---|---|
| Input rest | `1px --line`, 6px radius, 240px wide |
| Input focus | `--sky` border + 3px `rgba(52,162,226,.18)` ring |
| Input error | `--danger-text` border + `rgba(192,57,43,.12)` ring, `aria-invalid="true"` |
| Typing | non-digits stripped live, capped at 5 characters |
| Invalid submit | inline `Please enter a valid 5-digit ZIP code.` in `--danger-text`, focus returns to the field, popup does not open |
| Valid submit (any 5 digits, e.g. `44000`) | popup opens: **Congratulations!** / **5 agents are available** / red **Connect Hotline** CTA |
| Popup enter | `tmModalFadeIn .25s` on the scrim, `tmModalSlideUp .3s` on the card |
| Popup close | × button, backdrop click, or `Esc` — each restores body scroll and returns focus to the trigger |
| Focus | trapped inside the popup while open |

Both ZIP instances on the homepage share a single popup and a single implementation
(`[data-zip-finder]` loop), where the source duplicated the whole script against hard-coded IDs.

### FAQ accordion

Native `<details>` / `<summary>` for baseline keyboard and screen-reader support, progressively
enhanced so only one row stays open. Closed: `1px --line` border. Open: border becomes `--sky`
and the chevron rotates 180° over `.25s`.

### Footer

Light `--surface-shell` panel, 10px radius, description and a **Privacy Policy** link on the left,
**Toll Free Call!** CTA on the right. Stacks vertically below 768px with a full-width button.

---

## 5. Page outlines

### Homepage — `index.html`

| # | Section | Anchor | Notes |
|---|---|---|---|
| 1 | Header | — | Logo + CTA, sticky, glass on scroll |
| 2 | Hero | `#top` | Right-anchored photo; repositions to `75% center` ≤1024px; photo is **removed** below 768px and moved to a 120px strip under the copy, exactly as the source does |
| 3 | ZIP checker | — | First instance |
| 4 | Quick-nav pills | — | Internet plans · Mobile plans · Streaming TV plans · Deals |
| 5 | Fast Internet. Clear pricing. | `#plans` | 3 plan cards — Advantage 100 Mbps $30, Premier 500 Mbps $40, Gig 1000 Mbps $60; Premier and Gig carry the gold badge |
| 6 | Deals you don't want to miss | `#deals` | Bento: Samsung card + 2 stacked sub-cards, then the $1,000 guarantee banner |
| 7 | Explore Internet For Us services | `#services` | Internet · Mobile · Streaming TV |
| 8 | The Internet For Us difference | `#difference` | 4 cards |
| 9 | ZIP checker | — | Second instance, with `90px` vertical padding |
| 10 | Legal disclaimers | — | 6 blocks of source boilerplate |
| 11 | What We Do | `#what-we-do` | 4 cards + note |
| 12 | Types of Guidance We Offer | `#guidance` | 6 cards |
| 13 | How Our Assistance Works | `#how-it-works` | 4 step cards |
| 14 | What We Do NOT Do | `#what-we-dont-do` | 6 rows + amber notice |
| 15 | Why Independent Support Matters | `#why-independent` | 4 cards + 3-up stats |
| 16 | Frequently Asked Questions | `#faq` | 5 accordion rows |
| 17 | Footer | — | Shared |

Grid behaviour: plans 3→1 at ≤1024px · deals 2→1 at ≤1024px · difference 4→2→1 ·
guidance 3→2→1 · steps 4→2→1 · pills 4-across→2→1. The stats strip **stays 3-up on mobile**,
matching the source.

### Privacy Policy — `privacy.html`

`<h1>` → eight `<h3>` sections, with **no `<h2>` and no table of contents** — this mirrors the
source's heading structure exactly rather than "correcting" it.

1. Information We Collect · 2. How We Use Your Information · 3. Sharing Your Information ·
4. SMS Messaging · 5. Cookies and Tracking Technologies · 6. Data Security · 7. Your Rights ·
8. Policy Updates

Preceded by an effective-date pill (`29/05/2025`) and the ZAZ International Inc. intro paragraph.
Measure is capped at 72ch with `1.9` line-height for readability.

---

## 6. URLs

Both pages are linked by clean, extensionless paths — never `.html`:

| Page | Canonical URL | File |
|---|---|---|
| Home | `/` | `index.html` |
| Privacy policy | `/privacy-policy` | `privacy.html` |

`.htaccess` (Apache/LiteSpeed, which is what Hostinger runs) enforces this: it 301s
`/index.html` → `/` and `/privacy.html` → `/privacy-policy`, then internally serves
`privacy.html` for the clean path. The redirect rules match on `THE_REQUEST` — the original
request line — so the internal rewrite cannot re-trigger them and loop.

It also forces HTTPS (skipped when `X-Forwarded-Proto: https` is already set, so the CDN's
TLS termination doesn't cause a loop), sets far-future caching on static assets while keeping
HTML uncached, and enables gzip.

---

## 7. Contact number

Every phone CTA across both pages is driven by **one constant** at the top of `js/main.js`:

```js
const HOTLINE = {
  tel: '+18888446168',
  display: '+1 (888) 844-6168'
};
```

It populates the `href` of every `[data-hotline]` element, and replaces the text of any element
also marked `[data-label-from-hotline]`. Changing the number is a one-line edit.

---

## 8. Accessibility

- Skip link to `#main` on both pages
- `:focus-visible` ring (3px `--sky`, 2px offset) on every interactive element
- Popup is a `role="dialog"` `aria-modal="true"` with focus trapping, `Esc` to close, and focus
  restored to the trigger on close
- ZIP errors announced via `role="alert"` + `aria-live="polite"`, field marked `aria-invalid`
- FAQ uses native `<details>` so it works without JavaScript
- Decorative SVGs are `aria-hidden="true"`; the header logo has no visible text, so its link
  carries `aria-label="internetforus — home"` as the accessible name
- `prefers-reduced-motion` disables smooth scrolling and collapses transitions
