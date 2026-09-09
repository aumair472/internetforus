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
    ├── deal-*.{webp,png}
    └── screenshots/    Reference captures at 1440px and 375px
```

## Running locally

No build step — serve the directory over HTTP:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` via `file://` also works, though the
Google Fonts request needs a network connection either way.

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
