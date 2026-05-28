# Signalyse website

Static multi-page site. No build step. Open `index.html` in a browser to preview locally.

---

## Pre-launch checklist — work through these in order

### 1. Replace or hide testimonials (index.html) — DO THIS FIRST

The testimonials section in `index.html` has `hidden` on the `<section>` element, so it is not visible. Before launch, choose one:

**Option A — you have real quotes:** Replace the three placeholder `<article class="testimonial">` blocks with real names, businesses, and quotes. Then remove the `hidden` attribute from `<section ... hidden>`.

**Option B — launch without testimonials:** Leave the section hidden. The site works without it.

**Do not launch with placeholder quotes live.** Fake testimonials destroy credibility with the exact audience this site targets.

---

### 2. Add real phone number (contact.html)

Search for `[PLACEHOLDER NUMBER]` in `contact.html` and replace with the real number. Update the `href="tel:..."` value at the same time.

---

### 3. Replace founder portrait (about.html)

Find the `<img src="assets/images/founder-portrait.svg">` in `about.html` and replace with:

```html
<img src="assets/images/alex-morgan.jpg"
     alt="Alex Morgan, founder of Signalyse"
     class="portrait-placeholder"
     width="480" height="480">
```

Photo guidelines: square crop, 800×800px minimum, well-lit, neutral background.

---

### 4. Add Cal.com booking embed (contact.html)

Find the `<!-- EDIT ME: Replace this placeholder with your Cal.com inline embed -->` comment in `contact.html`. Replace the `modal-embed-placeholder` div with your Cal.com embed:

```html
<div id="cal-inline" style="width:100%;height:500px;overflow:scroll"></div>
<script src="https://cal.com/embed.js" async></script>
<script>
  Cal("inline", {
    calLink: "alex-signalyse/intro",
    elementOrSelector: "#cal-inline"
  });
</script>
```

Also update the `href="tel:..."` on the phone button and add your real phone number.

---

### 5. Replace report preview images (solutions.html)

The three report preview images are placeholder SVGs. To replace them:

1. Export each page from your report PDF at approximately **600×848px**.
2. Save as `assets/images/report-preview-read.png` (and `standing-view.png`, `forecast.png`).
3. In `solutions.html`, update each `<img src="...">` and `alt` attribute to match.

---

### 6. Replace NDA PDF (contact.html, all footers)

Save your real NDA as `assets/pdf/signalyse-nda-template.pdf`. Delete the placeholder `.txt` file. The download links on `contact.html` and all five footers already point to this path.

---

### 7. Connect the contact form (contact.html + main.js)

The form currently uses a `mailto:` fallback. To connect a real form backend:

In `main.js`, find the comment `EDIT ME: Replace the window.location.href line` and replace with a `fetch()` call:

```js
// Formspree example
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ name: name, email: email, message: message })
}).then(function(r) {
  if (r.ok) { /* show a success message */ }
});
e.preventDefault();
```

---

### 8. Add analytics (all five pages)

Each page `<head>` contains a commented-out analytics placeholder. When ready:

```html
<!-- Plausible (no cookies, GDPR-compliant) -->
<script defer data-domain="signalyse.co.uk" src="https://plausible.io/js/script.js"></script>
```

Uncomment and update the domain on all five pages.

---

### 9. Add privacy policy and terms PDFs (all five footers)

The footer on all five pages links to `#` placeholders for Privacy policy and Terms. Replace these with real PDF paths or page URLs once documents are drafted.

---

## File structure

```
website/
├── index.html          Home
├── problems.html       Problems we solve
├── solutions.html      Our solutions (three tiers)
├── about.html          About Alex Morgan
├── contact.html        Process, NDA, and contact
├── styles.css          All styles — design tokens in :root at top
├── main.js             All JS behaviour
├── README.md           This file
└── assets/
    ├── images/
    │   ├── report-preview-read.svg           → replace with real report page
    │   ├── report-preview-standing-view.svg  → replace with real dashboard screenshot
    │   ├── report-preview-forecast.svg       → replace with real forecast page
    │   └── founder-portrait.svg              → replace with real photo
    └── pdf/
        └── signalyse-nda-template.txt        → replace with real NDA PDF
```

---

## Design tokens

All colours and font families are CSS custom properties at the top of `styles.css` in `:root`. Change them there — nothing else needs touching.

| Token | Value | Used for |
|---|---|---|
| `--bg-primary` | `#FAF7F0` | Main background, newsprint cream |
| `--bg-secondary` | `#F2EEE2` | Alternating section background |
| `--bg-dark` | `#1A1A1A` | Footer |
| `--accent` | `#C8102E` | FT red — CTAs, labels, key numbers |
| `--ink` | `#1A1A1A` | Body text |
| `--ink-muted` | `#5A5A55` | Secondary text |
| `--ink-light` | `#8A8A82` | Tertiary text, metadata |

---

## Deployment

No build step needed. Upload the full `website/` folder to any static host:

- **Netlify / Vercel:** drag the folder into the dashboard, or connect via GitHub.
- **Cloudflare Pages:** same — point at the folder or repository.
- **GitHub Pages:** push to a `gh-pages` branch.

The only external requests on page load are the Google Fonts stylesheet.

---

## Editing the nav or footer

The nav and footer markup is copied across all five HTML pages (no templating). If you change one, change all five. Each copy has a comment block at the top reminding you.
