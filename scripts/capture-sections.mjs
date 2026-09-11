// ---------------------------------------------------------------------------
// Dev-only tool. Generates the flattened section screenshots + hotspot
// coordinates consumed by prototype/. Reads the LOCAL dev server (never the
// live site), writes into prototype/assets/sections/ and prototype/hotspots.json.
//
// Usage:  node scripts/capture-sections.mjs
// Needs:  the site served locally, e.g.  python3 -m http.server 8848
// ---------------------------------------------------------------------------
import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'prototype', 'assets', 'sections');
const HOTSPOTS_PATH = path.join(ROOT, 'prototype', 'hotspots.json');
const BASE_URL = process.env.CAPTURE_BASE_URL || 'http://localhost:8848';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Layout captures — these get their own hotspot coordinates because the
// actual button/input positions shift between them.
const LAYOUTS = [
  { name: 'mobile', width: 390 },
  { name: 'tablet', width: 768 },
  { name: 'desktop', width: 1440 }, // shared by both "laptop" and "4k" exports
];

// Exported image files per section. laptop/4k both render the *same*
// desktop layout (same viewport width, so hotspot percentages measured
// once are valid for both) — 4k just raises deviceScaleFactor enough to
// land at a true ~3840px-wide raster. It is not a distinct 5th breakpoint.
const DESKTOP_WIDTH = LAYOUTS.find((l) => l.name === 'desktop').width;
const FOUR_K_TARGET_WIDTH = 3840;

const EXPORTS = [
  { name: 'mobile', layout: 'mobile', scale: 2 },
  { name: 'tablet', layout: 'tablet', scale: 2 },
  { name: 'laptop', layout: 'desktop', scale: 1 },
  { name: '4k', layout: 'desktop', scale: FOUR_K_TARGET_WIDTH / DESKTOP_WIDTH },
];

// Sections to capture — the site is single-page (index.html only) as of
// the "Sync git to the live site" commit. `hotspots` lists selectors,
// relative to the section root, whose getBoundingClientRect() should be
// recorded as a percentage of the section's own box.
const SECTIONS = [
  { key: 'header', page: 'index.html', selector: '.site-header',
    hotspots: { cta: '.cta-btn' } },
  { key: 'hero', page: 'index.html', selector: '#top', hotspots: {} },
  // Both on-page ZIP-finder instances share this one measurement/export set.
  { key: 'zip-finder', page: 'index.html', selector: '.zip-finder',
    hotspots: { input: '[data-zip-input]', button: '[data-zip-btn]' } },
  { key: 'services', page: 'index.html', selector: '#services',
    hotspots: { btn1: '.service-card:nth-of-type(1) .btn-outline',
                btn2: '.service-card:nth-of-type(2) .btn-outline',
                btn3: '.service-card:nth-of-type(3) .btn-outline' } },
  { key: 'difference', page: 'index.html', selector: '#difference',
    hotspots: { btn1: '.diff-card:nth-of-type(1) .btn-outline',
                btn2: '.diff-card:nth-of-type(2) .btn-outline',
                btn3: '.diff-card:nth-of-type(3) .btn-outline',
                btn4: '.diff-card:nth-of-type(4) .btn-outline' } },
  { key: 'what-we-do', page: 'index.html', selector: '#what-we-do', hotspots: {} },
  { key: 'guidance', page: 'index.html', selector: '#guidance', hotspots: {} },
  { key: 'how-it-works', page: 'index.html', selector: '#how-it-works', hotspots: {} },
  { key: 'what-we-dont-do', page: 'index.html', selector: '#what-we-dont-do', hotspots: {} },
  { key: 'why-independent', page: 'index.html', selector: '#why-independent', hotspots: {} },
  { key: 'faq', page: 'index.html', selector: '#faq', hotspots: {} },
  { key: 'privacy-policy', page: 'index.html', selector: '#privacy-policy',
    hotspots: { email: '.privacy-contact-btn--secondary',
                call: '.privacy-contact-btn--primary' } },
  { key: 'footer', page: 'index.html', selector: '.site-footer',
    hotspots: { call: '.footer-btn', privacy: '.footer-link' } },
];

function pct(child, parent) {
  // Puppeteer's boundingBox() returns {x, y, width, height} — not
  // {left, top, ...}. (An earlier version of this read .left/.top, which
  // are undefined on that object, silently producing NaN → null in the
  // written JSON for every left/top value.)
  return {
    left: +(((child.x - parent.x) / parent.width) * 100).toFixed(3),
    top: +(((child.y - parent.y) / parent.height) * 100).toFixed(3),
    width: +((child.width / parent.width) * 100).toFixed(3),
    height: +((child.height / parent.height) * 100).toFixed(3),
  };
}

async function neutralizeChrome(page) {
  // Sticky header can paint over the top strip of whatever section is
  // scrolled into view for its own screenshot — pin it static instead.
  // Also kill transitions/animations so hover/lift states can't be caught
  // mid-motion.
  await page.addStyleTag({
    content: `
      .site-header { position: static !important; }
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
      }
    `,
  });
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb'],
  });

  const hotspots = {}; // { sectionKey: { layoutName: { hotspotName: {left,top,width,height} } } }
  const pageCache = new Map(); // "page.html|layout" -> puppeteer Page, reused across exports of the same layout

  try {
    for (const section of SECTIONS) hotspots[section.key] = {};

    for (const layout of LAYOUTS) {
      // One page load per (source file, layout) pair, reused for every
      // section+export that needs this layout — not one launch per shot.
      const pagesNeeded = [...new Set(SECTIONS.map((s) => s.page))];

      for (const pageFile of pagesNeeded) {
        const cacheKey = `${pageFile}|${layout.name}`;
        const browserPage = await browser.newPage();
        await browserPage.setViewport({ width: layout.width, height: 1200, deviceScaleFactor: 1 });
        await browserPage.goto(`${BASE_URL}/${pageFile}`, { waitUntil: 'networkidle0' });
        await neutralizeChrome(browserPage);
        // Let images finish decoding after the header-static reflow.
        await browserPage.evaluate(() => new Promise((r) => setTimeout(r, 250)));
        pageCache.set(cacheKey, browserPage);
      }

      for (const section of SECTIONS) {
        const browserPage = pageCache.get(`${section.page}|${layout.name}`);
        const handle = await browserPage.$(section.selector);
        if (!handle) {
          console.warn(`  ! selector not found: ${section.selector} (${section.key}) on ${section.page}`);
          continue;
        }

        // Measure hotspots relative to this section, once per layout.
        const parentBox = await handle.boundingBox();
        const measured = {};
        for (const [name, hotspotSelector] of Object.entries(section.hotspots)) {
          const hotspotHandle = await handle.$(hotspotSelector);
          if (!hotspotHandle) {
            console.warn(`  ! hotspot not found: ${hotspotSelector} in ${section.key} (${layout.name})`);
            continue;
          }
          const childBox = await hotspotHandle.boundingBox();
          if (childBox && parentBox) measured[name] = pct(childBox, parentBox);
        }
        hotspots[section.key][layout.name] = measured;

        // Emit every export file that shares this layout.
        for (const exp of EXPORTS.filter((e) => e.layout === layout.name)) {
          await browserPage.setViewport({
            width: layout.width,
            height: 1200,
            deviceScaleFactor: exp.scale,
          });
          const outPath = path.join(OUT_DIR, `${section.key}-${exp.name}.png`);
          await handle.screenshot({ path: outPath });
          console.log(`  wrote ${path.relative(ROOT, outPath)}`);
        }

        // Restore deviceScaleFactor to 1 for the next section's measurement.
        await browserPage.setViewport({ width: layout.width, height: 1200, deviceScaleFactor: 1 });
      }

      for (const pageFile of pagesNeeded) {
        const p = pageCache.get(`${pageFile}|${layout.name}`);
        await p.close();
        pageCache.delete(`${pageFile}|${layout.name}`);
      }
    }

    await writeFile(HOTSPOTS_PATH, JSON.stringify(hotspots, null, 2));
    console.log(`\nWrote ${HOTSPOTS_PATH}`);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
