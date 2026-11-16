/* Clean.World — Live Clean Air Index page */
(function () {
  'use strict';
  var data = [], dir = 'asc';
  function f1(v) { return v == null ? '–' : (Math.round(v * 10) / 10); }
  function draw() {
    var q = (document.getElementById('aq-q').value || '').toLowerCase();
    var rows = data.filter(function (c) { return c.aqi != null && (c.name + ' ' + c.country).toLowerCase().indexOf(q) > -1; })
      .sort(function (a, b) { return dir === 'asc' ? a.aqi - b.aqi : b.aqi - a.aqi; });
    document.getElementById('aq-body').innerHTML = rows.length ? rows.map(function (c, i) {
      var b = CW.aqiBand(c.aqi);
      return '<tr><td>' + (i + 1) + '</td><td><strong>' + CW.esc(c.name) + '</strong><br><span class="muted small">' + CW.esc(c.country) + '</span></td><td>' + aqiCell(c.aqi) + '</td><td class="small">' + b.l + '</td><td>' + f1(c.pm25) + '</td><td>' + f1(c.pm10) + '</td><td>' + f1(c.o3) + '</td><td>' + f1(c.no2) + '</td></tr>';
    }).join('') : '<tr><td colspan="8" class="muted">No matching cities.</td></tr>';
  }
  document.addEventListener('DOMContentLoaded', function () {
    loadAir().then(function (d) {
      data = d.cities || [];
      document.getElementById('aq-meta').textContent = 'Last updated: ' + new Date(d.updated).toLocaleString() + ' (' + (d.source === 'live' ? 'live from Open-Meteo' : 'daily snapshot, auto-refreshed') + ').';
      draw();
    }).catch(function () { document.getElementById('aq-body').innerHTML = '<tr><td colspan="8">Live data is temporarily unavailable. Please try again shortly.</td></tr>'; });
    document.getElementById('aq-q').addEventListener('input', draw);
    document.querySelectorAll('[data-sort]').forEach(function (b) {
      b.addEventListener('click', function () { dir = b.getAttribute('data-sort'); document.querySelectorAll('[data-sort]').forEach(function (x) { x.classList.toggle('on', x === b); }); draw(); });
    });
    var gb = document.getElementById('geo-btn'), out = document.getElementById('my-air-out');
    gb.addEventListener('click', function () {
      if (!navigator.geolocation) { out.textContent = 'Geolocation not supported.'; return; }
      out.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(function (p) {
        CW.aqiLive(p.coords.latitude.toFixed(3), p.coords.longitude.toFixed(3)).then(function (c) {
          var b = CW.aqiBand(c.us_aqi);
          out.innerHTML = aqiCell(c.us_aqi) + ' <strong>' + b.l + '</strong> · PM2.5 ' + f1(c.pm2_5) + ' µg/m³ — ' + b.a;
        }).catch(function () { out.textContent = 'Could not load air data right now.'; });
      }, function () { out.textContent = 'Permission denied — search a nearby city below.'; }, { timeout: 10000 });
    });
  });
})();
