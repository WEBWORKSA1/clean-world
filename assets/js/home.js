/* Clean.World — home page widgets */
(function () {
  'use strict';
  function row(c, i) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed var(--line)"><span><strong>' + (i + 1) + '.</strong> ' + CW.esc(c.name) + ' <span class="muted small">' + CW.esc(c.country) + '</span></span>' + aqiCell(c.aqi) + '</div>';
  }
  document.addEventListener('DOMContentLoaded', function () {
    loadAir().then(function (d) {
      var ok = d.cities.filter(function (c) { return c.aqi != null; }).sort(function (a, b) { return a.aqi - b.aqi; });
      document.getElementById('clean-list').innerHTML = ok.slice(0, 5).map(row).join('');
      document.getElementById('dirty-list').innerHTML = ok.slice(-5).reverse().map(row).join('');
    }).catch(function () {
      ['clean-list', 'dirty-list'].forEach(function (id) { document.getElementById(id).innerHTML = '<p class="muted">Live data is temporarily unavailable. <a href="air.html">Try the full index</a>.</p>'; });
    });

    var gb = document.getElementById('geo-btn'), out = document.getElementById('my-air-out');
    if (gb) gb.addEventListener('click', function () {
      if (!navigator.geolocation) { out.textContent = 'Geolocation is not supported on this device.'; return; }
      out.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(function (p) {
        CW.aqiLive(p.coords.latitude.toFixed(3), p.coords.longitude.toFixed(3)).then(function (c) {
          var b = CW.aqiBand(c.us_aqi);
          out.innerHTML = aqiCell(c.us_aqi) + ' <strong>' + b.l + '</strong> — PM2.5 ' + (c.pm2_5 != null ? c.pm2_5.toFixed(1) : '–') + ' µg/m³. ' + b.a;
        }).catch(function () { out.textContent = 'Could not load air data right now.'; });
      }, function () { out.textContent = 'Location permission denied — try the city search on the Air Index page.'; }, { timeout: 10000 });
    });

    CW.loadNews().then(function (d) {
      var items = (d.items || []).slice(0, 3);
      if (!items.length) throw 0;
      document.getElementById('home-news').innerHTML = items.map(function (n) {
        return '<a class="card" href="' + CW.esc(n.url) + '" target="_blank" rel="noopener nofollow"><span class="tag">' + CW.esc(n.source || 'News') + '</span><h3 class="mt2" style="font-size:1.05rem">' + CW.esc(n.title) + '</h3><p class="muted small mb0">' + CW.esc(n.date || '') + '</p></a>';
      }).join('');
    }).catch(function () { document.getElementById('home-news').innerHTML = '<p class="muted">News is refreshing — <a href="news.html">open the news page</a>.</p>'; });
  });
})();
