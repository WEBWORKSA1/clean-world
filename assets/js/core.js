/* Clean.World core — layout behaviour, forms, helpers. No build step. */
(function () {
  'use strict';
  var me = document.currentScript && document.currentScript.src || '';
  var BASE = me ? me.replace(/assets\/js\/core\.js.*$/, '') : './';

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('cw_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('cw_' + k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---------- config ----------
  var CFG = {
    site: 'Clean.World',
    // Optional instant-payment links for the Support page. Leave '' to hide a button.
    pay: { paypal: '', bmc: '', stripe: '', kofi: '' }
  };
  // The form relay address is assembled at runtime; it never appears in HTML or on screen.
  function relay() {
    var u = String.fromCharCode(119, 101, 98, 119, 111, 114, 107, 115, 97, 49);
    var d = 'moc.liamg'.split('').reverse().join('');
    return 'https://formsubmit.co/ajax/' + u + String.fromCharCode(64) + d;
  }

  // ---------- theme ----------
  var theme = store.get('theme', (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function toast(msg) {
    var el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.style.display = 'block';
    clearTimeout(el._t); el._t = setTimeout(function () { el.style.display = 'none'; }, 2800);
  }
  function fetchJSON(url, ttlMin, timeoutMs) {
    var key = 'cwc_' + url;
    try { var c = JSON.parse(sessionStorage.getItem(key) || 'null'); if (c && Date.now() - c.t < (ttlMin || 10) * 60000) return Promise.resolve(c.d); } catch (e) {}
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { ctrl && ctrl.abort(); }, timeoutMs || 10000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(to); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json();
    }).then(function (d) { try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} return d; });
  }

  // US AQI bands
  function aqiBand(v) {
    if (v == null || isNaN(v)) return { c: 'a0', l: 'No data', a: 'Air-quality data is not available right now.' };
    if (v <= 50) return { c: 'a1', l: 'Good', a: 'Air is clean. Great time to open windows and get outside.' };
    if (v <= 100) return { c: 'a2', l: 'Moderate', a: 'Acceptable. Unusually sensitive people should limit long, heavy outdoor exertion.' };
    if (v <= 150) return { c: 'a3', l: 'Unhealthy for sensitive groups', a: 'Children, older adults and people with heart or lung conditions should reduce prolonged outdoor exertion. Keep windows closed.' };
    if (v <= 200) return { c: 'a4', l: 'Unhealthy', a: 'Everyone may feel effects. Limit outdoor exertion, run a HEPA purifier and keep windows shut.' };
    if (v <= 300) return { c: 'a5', l: 'Very unhealthy', a: 'Health alert. Avoid outdoor exertion; stay indoors with filtered air where possible.' };
    return { c: 'a6', l: 'Hazardous', a: 'Emergency conditions. Stay indoors, seal gaps and follow local authority guidance.' };
  }
  function aqiLive(lat, lon) {
    var u = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + lon + '&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide&timezone=auto';
    return fetchJSON(u, 30).then(function (d) { return d && d.current; });
  }

  // ---------- nav ----------
  function initNav() {
    var b = document.querySelector('.burger'), l = document.querySelector('.links');
    if (b && l) b.addEventListener('click', function () { var o = l.classList.toggle('open'); b.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    var t = document.querySelector('[data-theme-toggle]');
    if (t) {
      var paint = function () { t.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙'; };
      paint();
      t.addEventListener('click', function () {
        theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme); store.set('theme', theme); paint();
      });
    }
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.links a').forEach(function (a) {
      var h = (a.getAttribute('href') || '').split('/').pop();
      if (h && h === here) a.setAttribute('aria-current', 'page');
    });
    document.querySelectorAll('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  }

  // ---------- footer columns (keeps static HTML light) ----------
  function initFooter() {
    var f = document.querySelector('#foot .wrap'); if (!f || f.querySelector('.cols')) return;
    var B = BASE, L = function (h, t) { return '<li><a href="' + B + h + '">' + t + '</a></li>'; };
    var cols = document.createElement('div'); cols.className = 'cols'; cols.style.marginBottom = '26px';
    cols.innerHTML = '<div><a class="logo" href="' + B + 'index.html" style="color:#fff"><span>Clean<b>.</b>World</span></a>' +
      '<p class="small" style="margin-top:10px">Cleaner homes, cleaner air, a cleaner planet. Free expert guides, smart tools, live air-quality data, community cleanups — and free quotes from vetted local cleaning pros.</p>' +
      '<form class="news-form" data-form="Newsletter" data-ok="You\'re in! Watch your inbox for the weekly Clean Sheet."><label class="sr" for="nl-email">Email</label><input id="nl-email" type="email" name="email" placeholder="Your email — weekly Clean Sheet" required><input type="hidden" name="list" value="Clean Sheet newsletter"><div class="hp"><input name="_hp" tabindex="-1" autocomplete="off"></div><button class="btn btn-l btn-s" type="submit">Join</button></form><div class="form-msg" id="nl-msg"></div></div>' +
      '<div><h4>Tools</h4><ul>' + L('cost.html', 'Cleaning Cost Calculator') + L('stains.html', 'Stain Removal Wizard') + L('routine.html', 'Routine Builder') + L('air.html', 'Live Clean Air Index') + L('recipes.html', 'Green Cleaner Recipes') + L('quotes.html', 'Free Cleaning Quotes') + '</ul></div>' +
      '<div><h4>Community</h4><ul>' + L('cleanups.html', 'Cleanup Movement') + L('contests.html', 'Contests &amp; Prizes') + L('support.html', 'Donate / Support') + L('careers.html', 'Careers &amp; Talent') + L('news.html', 'Clean World News') + L('videos.html', 'Video Library') + '</ul></div>' +
      '<div><h4>Company</h4><ul>' + L('about.html', 'About') + L('guides/index.html', 'All Guides') + L('pros.html', 'For Cleaning Pros') + L('advertise.html', 'Advertise &amp; Sponsor') + L('contact.html', 'Contact') + '</ul></div>';
    f.insertBefore(cols, f.firstChild);
    var nf = cols.querySelector('form'); nf.appendChild(document.getElementById('nl-msg'));
  }

  // ---------- news (snapshot from workflow, live GDELT fallback) ----------
  function topicOf(t) { t = (t || '').toLowerCase(); return /plastic|recycl/.test(t) ? 'plastic' : /air|smog|pollut|emission/.test(t) ? 'air' : /clean ?up|litter|beach|river|trash|garbage/.test(t) ? 'cleanup' : 'tech'; }
  function loadNews() {
    return fetchJSON(BASE + 'data/news.json', 20).then(function (d) {
      if (!d.items || !d.items.length || Date.now() - new Date(d.updated).getTime() > 2 * 864e5) throw 0; return d;
    }).catch(function () {
      var q = encodeURIComponent('(recycling OR "plastic pollution" OR "air pollution" OR "beach cleanup" OR litter OR cleantech) sourcelang:english');
      return fetchJSON('https://api.gdeltproject.org/api/v2/doc/doc?query=' + q + '&mode=artlist&maxrecords=75&format=json&sort=datedesc', 30, 15000).then(function (d) {
        var seen = {};
        return { updated: new Date().toISOString(), items: (d.articles || []).filter(function (a) { var k = (a.title || '').toLowerCase().slice(0, 80); if (!a.title || seen[k]) return false; seen[k] = 1; return true; }).map(function (a) {
          var s = a.seendate || ''; return { title: a.title, url: a.url, source: a.domain, date: s.length >= 8 ? s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) : '', topic_key: topicOf(a.title) };
        }) };
      });
    });
  }

  // ---------- forms ----------
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (f) {
      // carry ?service= etc into hidden/visible fields
      try {
        var q = new URLSearchParams(location.search);
        q.forEach(function (v, k) { var el = f.querySelector('[name="' + k + '"]'); if (!el) return;
          if (el.type === 'radio' || el.type === 'checkbox') { f.querySelectorAll('[name="' + k + '"]').forEach(function (r) { if (r.value === v) r.checked = true; }); }
          else if (el.tagName === 'SELECT') { Array.prototype.forEach.call(el.options, function (o) { if (o.value === v || o.text === v) el.value = o.value; }); }
          else if (!el.value) el.value = v; });
      } catch (e) {}
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (f.querySelector('.hp input') && f.querySelector('.hp input').value) return; // bot
        if (!f.checkValidity()) { f.reportValidity(); return; }
        var msg = f.querySelector('.form-msg');
        var btn = f.querySelector('[type="submit"]');
        var fd = new FormData(f), data = {};
        fd.forEach(function (v, k) { if (k === '_hp') return; data[k] = data[k] ? data[k] + ', ' + v : v; });
        data._subject = '[Clean.World] ' + (f.getAttribute('data-form') || 'Form') + ' — ' + (data.name || data.company || data.email || 'new submission');
        data._template = 'table';
        data._captcha = 'false';
        data.page = location.href;
        data.submitted_at = new Date().toISOString();
        if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = 'Sending…'; }
        fetch(relay(), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'Failed'); return j; }); })
          .then(function () {
            var ok = f.getAttribute('data-ok') || 'Thank you! We received your submission and will get back to you shortly.';
            if (msg) { msg.className = 'form-msg ok'; msg.textContent = ok; }
            toast('Sent ✓'); f.reset();
            var steps = f.querySelectorAll('.step'); if (steps.length) { f.dispatchEvent(new CustomEvent('cw:reset')); }
            store.set('lastForm', f.getAttribute('data-form'));
            if (window.gtag) try { gtag('event', 'generate_lead', { form: f.getAttribute('data-form') }); } catch (e) {}
          })
          .catch(function () {
            if (msg) { msg.className = 'form-msg err'; msg.textContent = 'Sorry — that did not go through. Please check your connection and try again in a moment.'; }
          })
          .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
      });
    });
  }

  // multi-step forms
  function initSteps() {
    document.querySelectorAll('form[data-steps]').forEach(function (f) {
      var steps = Array.prototype.slice.call(f.querySelectorAll('.step'));
      var bar = f.querySelector('.stepper'), i = 0;
      if (bar) bar.innerHTML = steps.map(function () { return '<i></i>'; }).join('');
      function show(n) {
        i = Math.max(0, Math.min(steps.length - 1, n));
        steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
        if (bar) bar.querySelectorAll('i').forEach(function (b, k) { b.classList.toggle('on', k <= i); });
        var fe = steps[i].querySelector('input,select,textarea'); if (fe && n !== 0) setTimeout(function () { try { fe.focus({ preventScroll: true }); } catch (e) {} }, 50);
      }
      function valid() {
        var ok = true;
        steps[i].querySelectorAll('input,select,textarea').forEach(function (el) { if (ok && !el.checkValidity()) { el.reportValidity(); ok = false; } });
        return ok;
      }
      f.addEventListener('click', function (e) {
        var n = e.target.closest('[data-next]'), p = e.target.closest('[data-prev]');
        if (n) { e.preventDefault(); if (valid()) show(i + 1); }
        if (p) { e.preventDefault(); show(i - 1); }
      });
      f.addEventListener('change', function (e) {
        if (e.target.type === 'radio' && e.target.closest('.step') && e.target.closest('[data-auto]')) { setTimeout(function () { if (valid()) show(i + 1); }, 180); }
      });
      f.addEventListener('cw:reset', function () { show(0); });
      show(0);
      if (/[?&]service=/.test(location.search) && steps[0] && steps[0].querySelector('input:checked')) show(1);
    });
  }

  // ---------- YouTube facade ----------
  function initYT() {
    document.querySelectorAll('.yt[data-id]').forEach(function (el) {
      var id = el.getAttribute('data-id'), t = el.getAttribute('data-title') || 'Video';
      if (!el.querySelector('img')) el.innerHTML = '<img loading="lazy" alt="' + esc(t) + '" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg">';
      el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-label', 'Play: ' + t);
      function play() {
        if (el.classList.contains('on')) return;
        el.classList.add('on');
        el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(t) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }
      el.addEventListener('click', play);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    });
  }

  // ---------- cookie notice ----------
  function initCookie() {
    if (store.get('cookie', null)) return;
    var c = document.createElement('div'); c.className = 'cookie'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', 'Cookie notice');
    c.innerHTML = '<strong>Cookies on Clean.World</strong><br>We use cookies to remember your preferences, measure traffic and show ads (including personalised ads from Google and its partners where you allow it). See our <a href="' + BASE + 'privacy.html">Privacy Policy</a>.' +
      '<div class="cta-row"><button class="btn btn-p btn-s" data-c="all">Accept</button><button class="btn btn-o btn-s" data-c="min">Essential only</button></div>';
    document.body.appendChild(c); c.style.display = 'block';
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]'); if (!b) return;
      store.set('cookie', b.getAttribute('data-c'));
      if (b.getAttribute('data-c') === 'min') { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; }
      c.remove();
    });
  }

  // ---------- tip of the day ----------
  var TIPS = [
    'Clean top to bottom, dry to wet: dust first, then vacuum, then mop — gravity does half the work.',
    'Never mix bleach with ammonia or vinegar. The fumes are toxic. Rinse surfaces between products.',
    'Let cleaner sit. Most sprays need 3–10 minutes of contact time to lift grime or disinfect.',
    'Microfibre cloths trap dust instead of pushing it around — wash them without fabric softener.',
    'Blot stains, never rub. Work from the outside of the stain toward the centre.',
    'Vacuum slowly: one pass forward and one back at half speed picks up far more fine dust.',
    'Run the kitchen extractor fan for 15 minutes after cooking to cut indoor PM2.5.',
    'Swap your HVAC filter every 1–3 months; MERV 11–13 is the sweet spot for most homes.',
    'A 10-minute daily reset beats a 4-hour weekend marathon. Set a timer and stop when it rings.',
    'Baking soda paste + time beats elbow grease on baked-on oven grime.',
    'Wash bedding weekly in the hottest water the fabric label allows to control dust mites.',
    'Keep a doormat outside and inside each entry — it can stop most tracked-in dirt.',
    'Refill, don\'t rebuy: concentrated cleaners in reusable bottles cut plastic waste dramatically.',
    'Pick up five pieces of litter on every walk. Small habits scale when millions share them.',
    'Ventilate when you clean: open two windows on opposite sides for a cross-breeze.'
  ];
  function tipToday() { var d = Math.floor(Date.now() / 864e5); return TIPS[d % TIPS.length]; }
  function initTip() { document.querySelectorAll('[data-tip]').forEach(function (e) { e.textContent = tipToday(); }); }

  // ---------- counters ----------
  function countUp(el, to, ms) {
    var s = performance.now(), from = 0; ms = ms || 1400;
    function f(t) { var p = Math.min(1, (t - s) / ms); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { countUp(e.target, +e.target.getAttribute('data-count')); io.unobserve(e.target); } });
    }) : null;
    els.forEach(function (e) { io ? io.observe(e) : (e.textContent = (+e.getAttribute('data-count')).toLocaleString()); });
  }

  // impact data (refreshed by the daily workflow)
  function initImpact() {
    var els = document.querySelectorAll('[data-impact]');
    if (!els.length) return;
    fetchJSON(BASE + 'data/impact.json', 30).then(function (d) {
      els.forEach(function (e) {
        var k = e.getAttribute('data-impact'), v = d[k];
        if (k === 'pledges') v = (v || 0) + (store.get('pledged', false) ? 1 : 0);
        if (v != null) { e.setAttribute('data-count', v); countUp(e, v); }
      });
    }).catch(function () {});
  }

  window.CW = { loadNews: loadNews, BASE: BASE, CFG: CFG, store: store, esc: esc, toast: toast, fetchJSON: fetchJSON, aqiBand: aqiBand, aqiLive: aqiLive, countUp: countUp, tipToday: tipToday };

  document.addEventListener('DOMContentLoaded', function () {
    initNav(); initFooter(); initForms(); initSteps(); initYT(); initTip(); initCounters(); initImpact(); initCookie();
  });
})();
