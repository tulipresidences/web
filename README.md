# Tulip Residences — Redesigned Website

A refreshed version of the Tulip Residences site: same content and same brand
pink (`#FF1AAB`), rebuilt with a proper design system, mobile navigation,
scroll animations, a photo lightbox, and cleaner semantic HTML.

## What changed

- **Design system** — new colour palette built around the brand pink
  (`#FF1AAB` for accents/buttons, a deep rose `#7A0C56` for headings and
  gradients, warm cream and sand backgrounds). Two paired fonts: **Fraunces**
  for headings, **Work Sans** for body text, and **JetBrains Mono** for
  labels, phone numbers and addresses.
- **Signature detail** — a tulip‑petal clip‑path frame is used for the logo,
  hero photo and facility images, plus a soft scalloped divider between
  sections, echoing the "Tulip" name instead of using generic rectangles.
- **Responsive, mobile‑first layout** — a real hamburger menu on small
  screens (the old site had a fixed header with no way to browse the nav on
  mobile), fluid type sizes, and a masonry‑style photo grid.
- **Cleaned‑up markup** — removed the old `<center>` tags and long chains of
  `<br>` used for spacing; layout is now done in CSS with `flex`/`grid`.
- **Working photo gallery** — click any photo to open a full‑size lightbox
  with keyboard (←/→/Esc) support.
- **Fixed the map/script bug** — the old `script.js` had a broken
  `initMap()` function calling the Google Maps *JavaScript* API with the
  wrong coordinates (New York, not Noida), and that API was never even
  loaded in the HTML. The site actually displays the map via the Google
  Maps **embed iframe** (already correctly pointed at your Noida address),
  so the dead code was removed and `script.js` was rewritten to power the
  menu, animations, lightbox and contact form instead.
- **Working contact form** — validates the fields client‑side and opens the
  visitor's email app with a pre‑filled message (see the note in
  `script.js` about swapping in a real backend later, e.g. Formspree or your
  own API).
- **Accessibility basics** — visible focus outlines, `aria-live` status text
  on the form, `alt` text on every image, reduced‑motion support.

## Files

```
tulip-site/
├── index.html      Home page
├── photos.html      Photo gallery + lightbox
├── location.html    Map + address
├── contact.html      Contact details + enquiry form
├── style.css      All styling (design tokens at the top)
├── script.js      Nav, scroll reveal, lightbox, form handling
└── images/          Put your photos here (see below)
```

## Images

The pages reference the same filenames your original site used
(`images/0.jpeg` through `images/21.jpeg`) — `0.jpeg` is the logo, `1–4` are
the facility photos, and the rest are the gallery photos. Copy your existing
`images` folder into this project folder so the paths keep working. If a
filename is missing, that spot will just show a broken image icon — nothing
else breaks.

## Running it locally

No build step or install is required — it's plain HTML/CSS/JS. Two ways to
view it:

**Option A — just open it**
Double‑click `index.html` (or right‑click → Open with → your browser).
This works for browsing the pages, but some browsers restrict things like
`fetch` on the `file://` protocol, so Option B is safer if you later wire up
a real backend for the form.

**Option B — a tiny local server (recommended)**
From inside the `tulip-site` folder, run one of these, then open
`http://localhost:8000` in your browser:

```bash
# Python 3 (already on most Macs/Linux, and on Windows via python.org)
python3 -m http.server 8000

# Node.js, if you have it installed
npx serve .
```

## Next steps you may want

- Swap the mailto‑based contact form for a real form backend (Formspree,
  Getform, or your own server) — the code comment in `script.js` marks
  exactly where to make that change.
- Replace the sample copy on the home page with anything more specific
  (rent, room types, mess/food details) if you'd like the site to cover it.
