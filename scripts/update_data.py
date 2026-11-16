#!/usr/bin/env python3
"""Clean.World data refresher (runs in GitHub Actions on a schedule).

- data/air.json  : live US AQI + pollutants for every city in data/cities.json (Open-Meteo, no key)
- data/news.json : latest clean-world headlines (GDELT DOC API, Google News RSS fallback)
- data/impact.json: edited by hand from real submissions (not touched here)
Pages and sitemap are built by GitHub Pages (Jekyll) on every commit.
Standard library only.
"""
import json, os, re, sys, time, datetime, urllib.request, urllib.parse, xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
UA = {"User-Agent": "Clean.World data bot (+https://clean.world)"}


def get(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def save(name, obj):
    with open(os.path.join(DATA, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)


def refresh_air():
    cities = json.load(open(os.path.join(DATA, "cities.json"), encoding="utf-8"))
    out = []
    for i in range(0, len(cities), 30):
        ch = cities[i:i + 30]
        q = urllib.parse.urlencode({
            "latitude": ",".join(str(c["lat"]) for c in ch),
            "longitude": ",".join(str(c["lon"]) for c in ch),
            "current": "us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide",
        })
        d = json.loads(get("https://air-quality-api.open-meteo.com/v1/air-quality?" + q))
        if isinstance(d, dict):
            d = [d]
        for c, r in zip(ch, d):
            cur = (r or {}).get("current", {})
            out.append({"name": c["name"], "country": c["country"], "lat": c["lat"], "lon": c["lon"],
                        "aqi": cur.get("us_aqi"), "pm25": cur.get("pm2_5"), "pm10": cur.get("pm10"),
                        "o3": cur.get("ozone"), "no2": cur.get("nitrogen_dioxide")})
        time.sleep(1)
    good = [c for c in out if c["aqi"] is not None]
    if len(good) < len(cities) // 2:
        raise RuntimeError("too few AQI values")
    save("air.json", {"updated": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
                      "source": "Open-Meteo Air Quality API (CC BY 4.0)", "cities": out})
    print("air:", len(good), "cities")


def topic_of(title):
    t = title.lower()
    if re.search(r"plastic|recycl", t): return "plastic"
    if re.search(r"air|smog|pollut|emission", t): return "air"
    if re.search(r"clean ?up|litter|beach|river|trash|garbage", t): return "cleanup"
    return "tech"


def refresh_news():
    items = []
    try:
        q = urllib.parse.quote('(recycling OR "plastic pollution" OR "air pollution" OR "beach cleanup" OR litter OR cleantech) sourcelang:english')
        d = json.loads(get(f"https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=artlist&maxrecords=75&format=json&sort=datedesc"))
        for a in d.get("articles", []):
            sd = a.get("seendate", "")
            items.append({"title": a.get("title", "").strip(), "url": a.get("url"), "source": a.get("domain"),
                          "date": f"{sd[0:4]}-{sd[4:6]}-{sd[6:8]}" if len(sd) >= 8 else "", "topic_key": topic_of(a.get("title", ""))})
    except Exception as e:  # noqa
        print("gdelt failed:", e)
    if len(items) < 10:
        for term in ["recycling", "plastic pollution", "air quality", "beach cleanup", "clean technology"]:
            try:
                x = get("https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": term, "hl": "en-US", "gl": "US", "ceid": "US:en"}))
                for it in ET.fromstring(x).iter("item"):
                    title = it.findtext("title", "")
                    src = it.find("source")
                    pd = it.findtext("pubDate", "")
                    try:
                        ds = datetime.datetime.strptime(pd[:25], "%a, %d %b %Y %H:%M:%S").date().isoformat()
                    except Exception:
                        ds = ""
                    items.append({"title": re.sub(r"\s+-\s+[^-]+$", "", title), "url": it.findtext("link"),
                                  "source": src.text if src is not None else "", "date": ds, "topic_key": topic_of(title)})
            except Exception as e:  # noqa
                print("rss failed:", term, e)
    seen, clean = set(), []
    for n in items:
        k = n["title"].lower()[:80]
        if n["title"] and n["url"] and k not in seen:
            seen.add(k); clean.append(n)
    clean.sort(key=lambda n: n["date"], reverse=True)
    if clean:
        save("news.json", {"updated": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z", "items": clean[:90]})
    print("news:", len(clean))


def main():
    ok = True
    for fn in (refresh_air, refresh_news):
        try:
            fn()
        except Exception as e:
            ok = False
            print(fn.__name__, "failed:", e, file=sys.stderr)
    return 0 if ok else 0  # never fail the workflow on a flaky upstream


if __name__ == "__main__":
    sys.exit(main())
