# Clean.World — Concept, Research & Phase-Wise Build Prompt

## 1. The winning idea (and why)

**Clean.World = the world's cleaning & clean-living hub with a built-in quote marketplace.**
"Cleaner homes. Cleaner air. A cleaner planet."

Three revenue engines on one domain:

| Engine | What it is | Why it pays |
|---|---|---|
| **Search traffic → AdSense** | Evergreen "how to clean X", stain removal, cost guides, green recipes | Huge, recession-proof search demand; home-services advertisers bid aggressively (cleaning, restoration, HVAC, mould, junk removal) |
| **Lead generation** | 5-step "Get 3 free cleaning quotes" form + B2B "For Pros" network | Residential leads sell for ~$15–$50, commercial/mould/restoration far more; one visitor can be worth more than hundreds of ad impressions |
| **Community & sponsorship** | Live Clean Air Index, cleanup pledges/registration, contests, donations | Gives brands a reason to sponsor (contests, tools, cleanups), earns links/PR, and creates returning visitors |

Rejected alternatives: pure eco-NGO site (donation-dependent, low RPM); pure cleaning blog (no lead revenue, commodity content); pure air-quality site (IQAir/AQICN own it). The hybrid wins because each part feeds the others: tools rank → ads monetise → calculators push to the quote form → community + live data keep the site fresh for Google.

## 2. Benchmark research (39 sites visited)

| Site | Key takeaways adopted |
|---|---|
| Molly Maid, Merry Maids | "Request a free quote" everywhere, ZIP-first, trust badges (insured, checklist, guarantee) |
| Thumbtack, Angi, HomeAdvisor | Describe-job-first lead flow, cost guides with ranges + factors + ZIP CTA |
| TaskRabbit, Handy | Category picker, protection/guarantee messaging |
| Jani-King, ServiceMaster Clean | Commercial industries list, "Get a quote" + franchise/partner CTA |
| 1-800-GOT-JUNK, Stanley Steemer, Chem-Dry | Service menus, instant estimates, health claims backed by data |
| The Ocean Cleanup, 4ocean, #TeamSeas | Live impact counters, $1 = 1 lb style framing, leaderboards, fundraisers, careers |
| World Cleanup Day, Keep America Beautiful, Keep Britain Tidy, Clean Up Australia, Ocean Conservancy, Surfrider, Earth Day, Plastic Oceans | Register-a-cleanup flows, volunteer kits, donation tiers, corporate partners, campaigns |
| IQAir, AQICN, PurpleAir | Live AQI ranking tables, cleanest/most-polluted toggles, AQI legend with health advice |
| Litterati | Litter data as evidence → "report what you collected" |
| EWG cleaners guide, EPA Safer Choice | Safer-product education, ingredient transparency |
| Clean Mama, Apartment Therapy, Bob Vila, Family Handyman, Housekeeping Channel, Cleanipedia | Printable routines, stain wizard, room categories, newsletter, series |
| Grove, Blueland | Refill/plastic-reduction messaging, subscription mechanics |
| Zero Waste Home, Home Stratosphere | 5R method, calculators/quizzes, media kit and multi-stream monetisation |

## 3. Phase-wise build prompt

> Use each phase as a self-contained prompt. Brand everywhere as **Clean.World** (with the dot). Static HTML/CSS/vanilla JS, deployable on GitHub Pages (main branch, root) using GitHub's built-in Jekyll for the shared layout.

### Phase 1 — Foundation & compliance
Build a responsive static site for **Clean.World** with a shared layout (`_layouts/default.html`). Every page: AdSense script `ca-pub-6620975821265271` in `<head>`, `google-adsense-account` meta, canonical + OG + JSON-LD, a top band reading "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linked to `https://web.works/contact` (link text must not show the URL), light/dark theme, skip link, cookie notice, 404, `ads.txt`, `robots.txt`, sitemap (jekyll-sitemap), manifest, favicon. Legal: Privacy (AdSense cookie wording, opt-out links, GDPR/CCPA rights), Terms, Disclaimer with **trademark disclosure** (not affiliated with any "Clean World/CleanWorld" mark) and copyright/DMCA notice. About page with editorial standards and "how we make money".

### Phase 2 — Lead generation (the money page)
`quotes.html`: 5-step form (service → property → frequency/timing/budget → location/details → contact + explicit consent), progress bar, URL pre-fill (`?service=&zip=`), skip step 1 when pre-filled, FAQ, typical prices sidebar. Quick-quote widget on home. `pros.html`: B2B partner application with plans (pay-per-lead, Territory Pro, Exclusive City). All forms post via AJAX to FormSubmit with the destination email assembled at runtime in JS — never in HTML or on screen. Honeypot field on every form.

### Phase 3 — Traffic tools
Cost Calculator (service, size, baths, condition, extras, carpet rooms, frequency discount, region factor → range + hours + pre-filled quote CTA), 2026 price table. Stain Removal Wizard (19 stains × 6 surfaces, safety "avoid" notes, shareable URL state). Routine Builder (personalised daily/weekly/monthly/seasonal checklists saved in localStorage, printable). Green Recipes with a never-mix safety box.

### Phase 4 — Live & self-updating data
Live Clean Air Index (64 cities, Open-Meteo, search, sort, geolocation "my air", AQI legend). News page (GDELT live + optional snapshot). Optional GitHub Actions job every 3 h: `scripts/update_data.py` refreshes `data/air.json` and `data/news.json` and commits. Browser falls back to live APIs if a snapshot is missing or stale. Tip of the day and contest countdown rotate automatically.

### Phase 5 — Content for AdSense approval
10+ original long-form guides (oven, mould, move-out, indoor air, kitchen, bathroom, hiring a cleaner, community cleanup, carpets, starting a cleaning business) with TOC, safety notes, related guides, quote CTA band and sidebar tools. Video library with privacy-enhanced YouTube facades (load on click).

### Phase 6 — Community, donations, talent, contests, sponsorship
Cleanups (pledge, register a cleanup, safety kit, litter report, honest progress-to-goal counters from `data/impact.json`). Support (tiers, allocation bars: operations, promotion/marketing, hiring, contests/prizes, cleanup grants; pledge form + optional PayPal/Stripe/BMC/Ko-fi links in `CFG.pay`). Contests (4 monthly contests, countdown, entry form, official rules, prize sponsors). Careers (writers, creators, ambassadors, partnerships, developers). Advertise (sponsored tools/guides/contests, newsletter, lead partnerships, enquiry form).

### Phase 7 — Launch & growth
Enable Pages, connect clean.world DNS, submit sitemap to Search Console, apply to AdSense, enable Google CMP for EEA/UK. Then: add city-level "cleaning services in {city}" pages, more guides weekly, a monthly Clean Sheet newsletter, and sell territory lead packages to local cleaning companies.
