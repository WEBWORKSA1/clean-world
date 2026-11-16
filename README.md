# Clean.World

**Cleaner homes. Cleaner air. A cleaner planet.** Expert cleaning guides, free tools (cost calculator, stain wizard, routine builder, green recipes), a live Clean Air Index for 64 world cities, auto-updating news, community cleanups, contests, donations, careers, sponsorship — and a free cleaning-quote lead engine (`quotes.html`) plus a B2B pro network (`pros.html`).

Static site on **GitHub Pages (main branch, root)**, built by GitHub's built-in Jekyll — no Actions or build step required. Google AdSense `ca-pub-6620975821265271` is in every page's `<head>` via `_layouts/default.html`.

## Structure
| Path | Purpose |
|---|---|
| `_layouts/default.html` | Shared head (SEO, AdSense, JSON-LD), top contact band, nav, guide template, footer |
| `*.html`, `guides/*.html` | Page bodies with YAML front matter (`title`, `description`, `js`, …). Guides use `layout_guide: true` + `order` |
| `assets/css/site.css`, `assets/js/*.js` | Design system and all interactive tools (vanilla JS) |
| `data/cities.json` | Cities for the Clean Air Index — add a city and push |
| `data/impact.json` | Movement counters — update by hand from real submissions (never inflate) |
| `automation/update.yml` + `scripts/update_data.py` | Optional scheduled snapshot of air + news data (see below) |
| `BUILD-PROMPT.md` | Concept, revenue model, 39-site benchmark, phase-wise build prompt |

**Self-updating:** the Air Index and News pages fetch live data in the browser (Open-Meteo, GDELT) whenever no fresh snapshot exists, and the tip of the day and contest countdown rotate automatically. To also store snapshots in the repo every 3 hours, move `automation/update.yml` to `.github/workflows/update.yml` in the GitHub web editor (the API token used to publish could not write workflow files).

## Forms
All forms post via AJAX to FormSubmit. The destination address is assembled at runtime in `assets/js/core.js` and never appears in HTML or on screen. **The first submission triggers a one-time activation email from FormSubmit — click Activate once.**

## Launch checklist
1. Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
2. Point clean.world DNS to GitHub Pages (A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `webworksa1.github.io`), then add `clean.world` as the custom domain in Settings → Pages and tick *Enforce HTTPS*.
3. AdSense → Sites → add `clean.world` → request review (`ads.txt` is in place).
4. AdSense → Privacy & messaging → enable the Google-certified CMP for EEA/UK/CH.
5. Optional: add PayPal / Stripe / Buy Me a Coffee / Ko-fi links in `CFG.pay` (`assets/js/core.js`) to show instant donate buttons.

## Data sources
Open-Meteo Air Quality (CC BY 4.0) · GDELT Project · Google News RSS · YouTube embeds (privacy-enhanced).
