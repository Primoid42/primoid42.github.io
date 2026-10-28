# PRIMOID42_*

A quiet digital wall for a fictional AI observer. Static HTML, CSS, vanilla JavaScript and JSON; no build, external runtime dependencies, cookies, analytics or tracking.

## Local preview

From this repository directory:

```sh
python -m http.server 8000
```

Visit http://localhost:8000. Stop with Ctrl+C. Use HTTP; opening `index.html` through `file://` is not supported because observations are fetched from JSON.

## Observations

`observations.json` is an ordered array of draft observations. Each object has a unique `id` (a string of at least four digits, preserving leading zeroes) and a nonempty `paragraphs` array of nonempty strings. For example:

```json
{ "id": "0007", "paragraphs": ["First paragraph.", "Second paragraph.\nAn intentional line break."] }
```

Append an object to add an observation; no code changes are needed. Array order sets PREV/NEXT order, wrapping at either end. The greeting and signature are fixed in HTML. Paragraphs and `\n` line breaks are preserved; HTML in observations is rendered as text.

Share `?obs=0003` to link directly to an observation. Missing or unknown IDs resolve to the first entry with `replaceState`; navigation uses `pushState` and supports browser Back/Forward. COPY LINK uses the clipboard with a selectable URL fallback if access is unavailable.

The default theme is dark. The theme button stores an optional preference in `localStorage` under `primoid-theme`; blocked storage does not prevent switching themes. `theme.js` applies a saved light/dark choice in the head before styles and content load, avoiding a white flash on dark visits.

## Files and font

- `index.html`: observation wall.
- `about.html`: fictional persona disclosure.
- `style.css`, `script.js`: presentation and interaction.
- `theme.js`: applies the stored theme before the first page render.
- `observations.json`: six draft observations.
- `.nojekyll`: bypasses Jekyll on GitHub Pages.
- `assets/fonts/IBMPlexMono-Medium.woff2`: locally served IBM Plex Mono, weight 500.
- `assets/fonts/OFL.txt`: original SIL Open Font License and copyright notice.

Font and license downloaded without modification from the [official IBM Plex repository](https://github.com/IBM/plex): [font](https://github.com/IBM/plex/blob/master/packages/plex-mono/fonts/complete/woff2/IBMPlexMono-Medium.woff2), [license](https://github.com/IBM/plex/blob/master/LICENSE.txt). No font CDN is contacted by visitors.

## GitHub Pages (manual, later)

Repository: `Primoid42/primoid42.github.io`. Once the files are committed and pushed with explicit permission, activate:

**Settings → Pages → Deploy from a branch → main → /(root) → Save**

The default URL will be https://primoid42.github.io/. The planned domain is `primoid.space`; configure it separately later. No CNAME or DNS configuration is included. This local implementation does not publish anything.

## Verification

Verified locally with Python's HTTP server and the in-app browser: all six texts, PREV/NEXT with wrapping, keyboard activation, direct `?obs=0003`, invalid-ID fallback, browser Back/Forward, copying a link, light/dark switching and preference persistence after reload, About, and layouts at 320px, 768px and desktop widths. Local HTML, CSS, JavaScript, JSON, font and license return HTTP 200. JavaScript syntax, JSON IDs, WOFF2 signature, the exact `(_*)` mark and whitespace checks passed. No browser warnings or errors were recorded.

Blocked-storage and denied-clipboard fallbacks are implemented but were not exercised in the browser. Real mobile devices, other browser engines and deployment to GitHub Pages were not tested. Local QA screenshots are ignored in `.preview/`.

After the console composition update, JavaScript syntax and theme initialization were rechecked: first visit defaults to dark; saved light/dark choices take precedence; invalid or blocked storage falls back to dark. Both pages load the theme script before CSS. Visual desktop/mobile rechecking was blocked by browser security; the earlier screenshots represent the original composition.
