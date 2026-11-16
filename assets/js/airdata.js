/* Clean.World — shared air-quality loader. Snapshot from the daily workflow, live Open-Meteo fallback. */
(function () {
  'use strict';
  function live(cities) {
    // Open-Meteo accepts comma-separated coordinate lists (one call per chunk).
    var chunks = [], out = [];
    for (var i = 0; i < cities.length; i += 30) chunks.push(cities.slice(i, i + 30));
    return Promise.all(chunks.map(function (ch) {
      var u = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + ch.map(function (c) { return c.lat; }).join(',') +
        '&longitude=' + ch.map(function (c) { return c.lon; }).join(',') + '&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide';
      return CW.fetchJSON(u, 30, 15000).then(function (d) {
        if (!Array.isArray(d)) d = [d];
        d.forEach(function (r, k) {
          var c = ch[k], cur = r && r.current || {};
          out.push({ name: c.name, country: c.country, lat: c.lat, lon: c.lon, aqi: cur.us_aqi, pm25: cur.pm2_5, pm10: cur.pm10, o3: cur.ozone, no2: cur.nitrogen_dioxide });
        });
      });
    })).then(function () { return { updated: new Date().toISOString(), source: 'live', cities: out }; });
  }
  window.loadAir = function () {
    return CW.fetchJSON(CW.BASE + 'data/air.json', 20).then(function (s) {
      var age = Date.now() - new Date(s.updated).getTime();
      if (!s.cities || !s.cities.length || age > 6 * 3600e3) throw new Error('stale');
      s.source = 'snapshot'; return s;
    }).catch(function () {
      return CW.fetchJSON(CW.BASE + 'data/cities.json', 600).then(live);
    });
  };
  window.aqiCell = function (v) { var b = CW.aqiBand(v); return '<span class="aqi ' + b.c + '" title="' + b.l + '">' + (v == null ? '–' : Math.round(v)) + '</span>'; };
})();
