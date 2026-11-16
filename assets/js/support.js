/* Clean.World — support page */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var amt = document.getElementById('d1');
    document.querySelectorAll('input[name="amt"]').forEach(function (r) { r.addEventListener('change', function () { amt.value = r.value; document.getElementById('donate').scrollIntoView({ behavior: 'smooth' }); }); });
    var p = CW.CFG.pay, html = '';
    if (p.stripe) html += '<a class="btn btn-p" href="' + p.stripe + '" target="_blank" rel="noopener">💳 Donate by card</a>';
    if (p.paypal) html += '<a class="btn btn-o" href="' + p.paypal + '" target="_blank" rel="noopener">PayPal</a>';
    if (p.bmc) html += '<a class="btn btn-o" href="' + p.bmc + '" target="_blank" rel="noopener">☕ Buy us a coffee</a>';
    if (p.kofi) html += '<a class="btn btn-o" href="' + p.kofi + '" target="_blank" rel="noopener">Ko-fi</a>';
    document.getElementById('pay-btns').innerHTML = html;
    if (html) document.getElementById('pay-note').textContent = 'Prefer an invoice, bank transfer or monthly plan? Use the pledge form and we\'ll set it up.';
    document.getElementById('share-btn').addEventListener('click', function () {
      var d = { title: 'Clean.World', text: 'Free cleaning tools, live air quality and community cleanups', url: location.origin + CW.BASE.replace(location.origin, '') };
      if (navigator.share) navigator.share(d).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(d.url).then(function () { CW.toast('Link copied — thank you!'); });
    });
  });
})();
