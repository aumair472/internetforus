# internetforus.com

Static marketing site for **Internet For Us** — a homepage and a privacy policy, built as
self-contained vanilla HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

## Structure

```
├── index.html          Homepage
├── privacy.html        Privacy policy
├── DESIGN.md           Design system documentation
├── css/style.css       All styles (CSS custom properties, Flexbox/Grid)
├── js/main.js          All interactivity (vanilla ES6+)
└── assets/
    ├── logo.svg        Full horizontal logo lockup
    ├── favicon.svg     Signal-tile mark
    ├── hero.jpg        Hero photograph
    └── deal-*.{webp,png}
```

## Running locally

No build step — serve the directory over HTTP:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` via `file://` also works, though the
Google Fonts request needs a network connection either way.

## URLs

Pages are served at clean, extensionless paths. `.htaccess` 301s the `.html` forms away:

| Page | URL | File |
| --- | --- | --- |
| Home | `/` | `index.html` |
| Privacy Policy Summary | `/#privacy-policy` | `index.html` |

Internal links to the privacy policy point to `/#privacy-policy`. `/privacy-policy` redirects to `/#privacy-policy`.

## Reference screenshots

Not committed, since they go stale on every design change. Regenerate with the local server
running:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p assets/screenshots
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --screenshot=assets/screenshots/home-desktop.png --window-size=1440,8962 \
  --virtual-time-budget=8000 http://localhost:8000/index.html
```

Set `--window-size` height to the page's full `document.documentElement.scrollHeight` at that
width to capture the whole page.

## Editing CSS or JS — bump the cache version

`.htaccess` caches CSS and JS for a year, so returning visitors will not see a change to
`style.css` or `main.js` until the URL changes. Both are linked with a version query string:

```html
<link rel="stylesheet" href="css/style.css?v=2">
<script src="js/main.js?v=2"></script>
```

**Bump `?v=` in both `index.html` and `privacy.html` every time you edit either file.** HTML
itself is served uncached, so the new HTML immediately points browsers at the new asset URL.

The same applies to images: replacing `hero.jpg` in place will not reach anyone who has already
loaded it — give the replacement a new filename instead.

## Changing the phone number

Every phone CTA on both pages is driven by one constant at the top of `js/main.js`:

```js
const HOTLINE = {
  tel: '+18888446168',
  display: '+1 (888) 844-6168'
};
```

It fills the `href` of every `[data-hotline]` element and the text of any element also marked
`[data-label-from-hotline]`. That is the only place the number is stored.

## Features

- **ZIP availability checker** — two instances sharing one modal; any valid 5-digit ZIP opens the
  "Congratulations! / 5 agents are available" popup with the red Connect Hotline CTA. Non-digits
  are stripped as you type; anything shorter than 5 digits shows an inline error.
- **Sticky glass header** — logo and CTA only, with a backdrop-blur state on scroll and an opaque
  fallback where `backdrop-filter` is unsupported.
- **FAQ accordion** — native `<details>`/`<summary>`, enhanced so only one answer stays open.
- **Responsive** — mobile ≤767px, tablet 768–1024px, desktop >1024px. No horizontal overflow at
  any width down to 360px.
- **Accessible** — skip link, focus trapping in the modal, `Esc` to close, `role="alert"` on
  validation errors, visible focus rings, and `prefers-reduced-motion` support.

See [DESIGN.md](DESIGN.md) for the full colour, type and component documentation.
