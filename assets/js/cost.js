/* Clean.World — cleaning cost calculator */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function money(n) { return '$' + Math.round(n / 5) * 5; }
  function calc() {
    var size = +$('c-size').value, bath = +$('c-bath').value, svc = +$('c-svc').value, cond = +$('c-cond').value,
      freq = +$('c-freq').value, reg = +$('c-reg').value, carpet = +$('c-carpet').value, extras = 0;
    document.querySelectorAll('.ex:checked').forEach(function (e) { extras += +e.value; });
    $('c-carpet-v').textContent = carpet + (carpet === 1 ? ' room' : ' rooms') + (carpet ? ' (~$' + carpet * 50 + ')' : '');
    var oneTime = svc === 1.8 || svc === 2.1 || svc === 2.6;
    var f = oneTime ? 1 : freq;
    $('c-freq').disabled = oneTime;
    var mid = ((size + bath) * svc * cond + extras) * reg * f + carpet * 50 * reg;
    var lo = mid * 0.82, hi = mid * 1.18;
    $('c-out').textContent = money(lo) + ' – ' + money(hi);
    var hours = mid / 50;
    $('c-hours').textContent = '≈ ' + (Math.round(hours * 2) / 2) + ' cleaner-hours (e.g. a team of 2 for ' + (Math.round(hours) / 2) + ' h)';
    $('c-mark').style.left = Math.max(2, Math.min(97, mid / 900 * 100)) + '%';
    var svcName = $('c-svc').options[$('c-svc').selectedIndex].text;
    var map = { 'Standard / regular': 'Regular house cleaning', 'Deep clean': 'Deep cleaning', 'Move-in / move-out': 'Move-in / move-out cleaning', 'Airbnb / rental turnover': 'Airbnb / rental turnover', 'Post-construction': 'Post-construction cleaning' };
    $('c-cta').href = 'quotes.html?service=' + encodeURIComponent(map[svcName] || svcName) + '&budget=' + encodeURIComponent(mid < 150 ? 'Under $150' : mid < 300 ? '$150–$300' : mid < 600 ? '$300–$600' : mid < 1500 ? '$600–$1,500' : '$1,500+');
  }
  document.addEventListener('DOMContentLoaded', function () {
    var f = $('calc'); if (!f) return;
    f.addEventListener('input', calc); f.addEventListener('change', calc); calc();
  });
})();
