# Clean.World

**Cleaner homes. Cleaner air. A cleaner planet.** Expert cleaning guides, free tools (cost calculator, stain wizard, routine builder, green recipes), a live Clean Air Index for 64 world cities, community cleanups, contests, donations — and a free cleaning-quote lead engine.

Static site · no server · GitHub Pages (main branch, root) · Google AdSense `ca-pub-6620975821265271`.

## Structure
| Path | Purpose |
|---|---|
| `src/pages/*.html`, `src/guides/*.html` | **Edit these.** Page bodies with a one-line META header |
| `scripts/build.py` | Wraps sources with header/footer/SEO/AdSense → root `*.html`, `guides/`, `sitemap.xml` |
| `scripts/update_data.py` | Refreshes `data/air.json` + `data/news.json`, then rebuilds |
| `.github/workflows/update.yml` | Runs every 3 h and on source pushes; commits the results |
| `quotes.html` / `pros.html` | Lead generation: consumer quotes / B2B partner network |
| `cost.html`, `stains.html`, `routine.html`, `recipes.html`, `air.html` | Tools |
| `cleanups.html`, `contests.html`, `support.html`, `careers.html`, `advertise.html` | Community, prizes, donations, hiring, sponsorship |
| `data/impact.json` | Movement counters — update by hand from real submissions |
| `BUILD-PROMPT.md` | Concept, revenue model, 39-site benchmark, phase-wise build prompt |

## Forms
All forms post via AJAX to FormSubmit. The destination address is assembled in `assets/js/core.js` at runtime and never appears in HTML or on screen. **The first submission triggers a one-time activation email from FormSubmit — click Activate once.**

## Launch checklist
1. Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
2. Point clean.world DNS to GitHub Pages (A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `webworksa1.github.io`), set the custom domain in Settings → Pages, tick *Enforce HTTPS*.
3. AdSense → Sites → add `clean.world` → request review (`ads.txt` is in place).
4. AdSense → Privacy & messaging → enable the Google-certified CMP for EEA/UK/CH.
5. Optional: add payment links in `CFG.pay` (`assets/js/core.js`) to show instant donate buttons.
6. Actions → *Refresh live data and rebuild pages* → *Run workflow* once.

## Data sources
Open-Meteo Air Quality (CC BY 4.0) · GDELT Project · Google News RSS · YouTube embeds (privacy-enhanced).
