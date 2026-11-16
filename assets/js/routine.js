/* Clean.World — Cleaning Routine Builder */
(function () {
  'use strict';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  function v(id) { var e = document.getElementById(id); return e.type === 'checkbox' ? e.checked : e.value; }
  function build() {
    var pets = v('r-pets'), kids = v('r-kids'), allergy = v('r-allergy'), baths = +v('r-baths'), mins = +v('r-mins'), house = v('r-type') === 'house';
    var daily = ['Make beds and open curtains/windows for 10 minutes of fresh air', 'Wipe kitchen counters, stovetop and sink after dinner', 'Load/run the dishwasher or wash up', 'Quick 5-minute declutter: return items to their homes', 'Wipe the bathroom sink and squeegee the shower'];
    if (pets) daily.push('Sweep or stick-vacuum pet hair hotspots; refresh water bowls');
    if (kids) daily.push('Toy reset: everything back in bins before bedtime');
    if (mins >= 30) daily.push('Spot-mop the kitchen floor');
    var weekly = {
      Monday: ['Clean bathroom' + (baths > 1 ? 's' : '') + ': toilet, sink, shower/tub, mirror, floor'],
      Tuesday: ['Dust all surfaces top to bottom (shelves, TV, light switches)'],
      Wednesday: ['Vacuum all floors and rugs' + (allergy ? ' with a sealed HEPA vacuum' : ''), 'Mop hard floors'],
      Thursday: ['Clean kitchen: microwave, appliance fronts, cabinet handles', 'Clear out expired food from fridge'],
      Friday: ['Change and wash bed linens' + (allergy ? ' at 60°C / 140°F' : ''), 'Wash towels'],
      Saturday: ['Empty all bins, wash the kitchen bin', 'Tidy entryway; shake out doormats'],
      Sunday: ['Rest day — 10-minute reset only', 'Plan next week\'s meals and shopping (fewer food-waste cleanups)']
    };
    if (pets) weekly.Saturday.push('Wash pet beds, bowls and toys');
    if (kids) weekly.Thursday.push('Disinfect high-touch toys and high chair');
    if (allergy) weekly.Tuesday.push('Damp-dust (not dry) to trap allergens');
    var monthly = ['Clean inside microwave, oven door glass and range hood filter', 'Wipe baseboards, door frames and skirting', 'Vacuum upholstery and under cushions', 'Clean windows and mirrors throughout', 'Descale kettle, coffee maker and shower head', 'Clean washing machine (hot empty cycle) and dishwasher filter', 'Dust ceiling fans, vents and light fixtures', 'Flip/rotate mattress (if applicable)'];
    if (allergy || pets) monthly.push('Replace or check HVAC filter (MERV 11–13)');
    var seasonal = ['Deep clean oven and fridge (inside, coils, seals)', 'Wash curtains, duvets and pillows', 'Shampoo carpets or book a pro', 'Clear gutters and wash outdoor furniture' + (house ? '' : ' / balcony'), 'Declutter one room fully — donate, recycle, sell', 'Test smoke & CO alarms; replace batteries'];
    if (house) seasonal.push('Pressure-wash driveway, deck or siding');
    return { daily: daily, weekly: weekly, monthly: monthly, seasonal: seasonal };
  }
  function list(title, items, key) {
    var done = CW.store.get('rt_' + key, {});
    return '<div class="card"><h3 class="mt0">' + title + '</h3><ul class="checklist">' + items.map(function (t, i) {
      var id = key + '_' + i, d = done[i];
      return '<li class="' + (d ? 'done' : '') + '"><input type="checkbox" id="' + id + '" data-k="' + key + '" data-i="' + i + '"' + (d ? ' checked' : '') + '><label for="' + id + '" style="font-weight:500;margin:0"><span>' + CW.esc(t) + '</span></label></li>';
    }).join('') + '</ul></div>';
  }
  function render() {
    var r = build(), out = document.getElementById('rt-out');
    var html = '<div class="g2">' + list('☀️ Every day (' + v('r-mins') + ' min)', r.daily, 'daily') + list('📅 Monthly', r.monthly, 'monthly') + '</div>';
    html += '<h3 class="mt3">🗓️ Weekly plan — one focus per day</h3><div class="g4">' + DAYS.map(function (d) { return list(d, r.weekly[d], 'w' + d); }).join('') + '</div>';
    html += '<div class="mt3">' + list('🍂 Seasonal (every 3 months)', r.seasonal, 'seasonal') + '</div>';
    out.innerHTML = html;
    CW.store.set('rt_prefs', { t: v('r-type'), b: v('r-baths'), m: v('r-mins'), p: v('r-pets'), k: v('r-kids'), a: v('r-allergy') });
  }
  document.addEventListener('DOMContentLoaded', function () {
    var f = document.getElementById('rt-form'); if (!f) return;
    var p = CW.store.get('rt_prefs', null);
    if (p) { document.getElementById('r-type').value = p.t; document.getElementById('r-baths').value = p.b; document.getElementById('r-mins').value = p.m; document.getElementById('r-pets').checked = p.p; document.getElementById('r-kids').checked = p.k; document.getElementById('r-allergy').checked = p.a; }
    f.addEventListener('change', render);
    document.getElementById('rt-out').addEventListener('change', function (e) {
      var c = e.target; if (!c.dataset.k) return;
      var key = 'rt_' + c.dataset.k, d = CW.store.get(key, {}); d[c.dataset.i] = c.checked; CW.store.set(key, d);
      c.closest('li').classList.toggle('done', c.checked);
    });
    document.getElementById('rt-print').addEventListener('click', function () { window.print(); });
    document.getElementById('rt-reset').addEventListener('click', function () {
      ['daily', 'monthly', 'seasonal'].concat(DAYS.map(function (d) { return 'w' + d; })).forEach(function (k) { CW.store.set('rt_' + k, {}); });
      render(); CW.toast('Checklist reset');
    });
    render();
  });
})();
