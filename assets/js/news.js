/* Clean.World — news page: daily snapshot (GitHub Actions) + live GDELT fallback */
(function () {
  'use strict';
  var TOPICS = [
    { k: 'all', n: 'All', q: '' },
    { k: 'plastic', n: '♻️ Plastic & recycling', q: '(recycling OR "plastic pollution")' },
    { k: 'air', n: '🌬️ Air quality', q: '"air quality" OR "air pollution"' },
    { k: 'cleanup', n: '🧤 Cleanups', q: '"beach cleanup" OR "river cleanup" OR "litter pick"' },
    { k: 'tech', n: '🔬 Clean tech', q: '"clean technology" OR "cleantech"' }
  ];
  var all = [], cur = 'all';
  function card(n) {
    return '<a class="card" href="' + CW.esc(n.url) + '" target="_blank" rel="noopener nofollow"><span class="tag">' + CW.esc(n.source || 'News') + '</span>' +
      '<h3 class="mt2" style="font-size:1.03rem">' + CW.esc(n.title) + '</h3><p class="muted small mb0">' + CW.esc(n.date || '') + (n.topic ? ' · ' + CW.esc(n.topic) : '') + '</p></a>';
  }
  function draw() {
    var items = all.filter(function (n) { return cur === 'all' || n.topic_key === cur; });
    document.getElementById('nw-list').innerHTML = items.length ? items.slice(0, 45).map(card).join('') : '<p class="muted">No stories in this topic right now — check back soon.</p>';
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('nw-tabs').innerHTML = TOPICS.map(function (t) { return '<li><button type="button" data-t="' + t.k + '"' + (t.k === 'all' ? ' class="on"' : '') + '>' + t.n + '</button></li>'; }).join('');
    document.getElementById('nw-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-t]'); if (!b) return; cur = b.getAttribute('data-t');
      document.querySelectorAll('[data-t]').forEach(function (x) { x.classList.toggle('on', x === b); }); draw();
    });
    CW.loadNews().then(function (d) {
      all = d.items || [];
      TOPICS.forEach(function (t) { all.forEach(function (n) { if (n.topic_key === t.k) n.topic = t.n.replace(/^\S+\s/, ''); }); });
      document.getElementById('nw-meta').textContent = 'Updated ' + new Date(d.updated).toLocaleString() + '.';
      draw();
    }).catch(function () { document.getElementById('nw-list').innerHTML = '<p class="muted">News is temporarily unavailable. Please check back shortly.</p>'; });
  });
})();
