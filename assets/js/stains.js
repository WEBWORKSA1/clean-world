/* Clean.World — Stain Removal Wizard data + UI */
(function () {
  'use strict';
  var S = [
    { id: 'red-wine', n: 'Red wine', e: '🍷', cat: 'tannin',
      fabric: ['Blot (don\'t rub) with a clean white cloth to lift as much as possible.', 'Rinse from the back of the fabric with cold water to push the stain out the way it came in.', 'Cover with a little dish soap mixed with hydrogen peroxide (1 tsp soap : 1 tbsp 3% peroxide) — test on a hidden seam first; peroxide can lighten coloured fabric.', 'Leave 10–15 minutes, blot, rinse cold.', 'Wash in the warmest water the label allows. Air-dry and check before using the dryer.'],
      carpet: ['Blot immediately with paper towels, working from the outside in.', 'Pour a little cold water on the spot and blot again; repeat until no more colour transfers.', 'Mix 1 tbsp dish soap + 1 tbsp white vinegar + 2 cups warm water. Sponge on, wait 5 minutes, blot.', 'Rinse with plain water and blot dry. Weigh down a stack of towels overnight.'],
      avoid: 'Salt and heat can set wine stains. Never put a stained item in the dryer.' },
    { id: 'coffee', n: 'Coffee / tea', e: '☕', cat: 'tannin',
      fabric: ['Rinse from behind under cold running water.', 'Rub in a drop of liquid laundry detergent; leave 5 minutes.', 'For old stains, soak 30 minutes in cool water with an oxygen-based bleach (sodium percarbonate) following the pack dose.', 'Wash as normal; air-dry and check.'],
      carpet: ['Blot up excess.', 'Sponge with 1 tbsp dish soap + 1 tbsp white vinegar in 2 cups warm water.', 'Blot until dry; rinse with cold water and blot again.'],
      avoid: 'Milky coffee contains protein — keep water cool, not hot, on the first rinse.' },
    { id: 'grease', n: 'Grease / cooking oil', e: '🍳', cat: 'oil',
      fabric: ['Scrape or blot off excess oil.', 'Sprinkle cornstarch or baking soda; leave 15–30 minutes to absorb, then brush off.', 'Work a drop of grease-cutting dish soap into the stain with your fingers or a soft brush.', 'Wash in the hottest water the label allows.', 'Air-dry — heat sets any leftover oil.'],
      carpet: ['Blot, then cover with baking soda for 30 minutes and vacuum.', 'Dab with a cloth dampened with a few drops of dish soap in warm water.', 'Rinse with clean water and blot dry.'],
      avoid: 'Don\'t use plain water first — it spreads oil. Never machine-dry until the spot is fully gone.' },
    { id: 'blood', n: 'Blood', e: '🩸', cat: 'protein',
      fabric: ['Rinse with COLD water from the back of the fabric as quickly as possible.', 'Rub with a little bar soap or enzyme detergent.', 'For dried blood, soak in cold water with enzyme detergent for 30–60 minutes.', 'On white cotton only: dab with 3% hydrogen peroxide, then rinse.', 'Wash cold; check before drying.'],
      carpet: ['Blot with a cloth dampened in cold water.', 'Mix 1 tsp mild dish soap in 1 cup cold water; dab on and blot.', 'Rinse with cold water and blot dry.'],
      avoid: 'Hot water cooks the protein into the fibres. Keep everything cold.' },
    { id: 'grass', n: 'Grass', e: '🌱', cat: 'dye',
      fabric: ['Pre-treat with enzyme laundry detergent and gently brush.', 'Leave 15 minutes.', 'If colour remains, dab with rubbing alcohol (test first on a hidden spot), then rinse.', 'Wash in warm water with oxygen bleach.'],
      carpet: ['Blot with dish-soap solution.', 'Dab lightly with rubbing alcohol on a cloth (test first).', 'Rinse and blot dry.'],
      avoid: 'Avoid alkaline cleaners like ammonia — they can set the green dye.' },
    { id: 'ink', n: 'Ballpoint ink', e: '🖊️', cat: 'dye',
      fabric: ['Place a paper towel under the stain.', 'Dab with rubbing alcohol or hand sanitizer on a cotton ball — dab, don\'t rub. Move the towel as it absorbs ink.', 'Rinse, apply detergent, and wash as normal.'],
      carpet: ['Dab with a small amount of rubbing alcohol on a white cloth.', 'Blot with a dry cloth; repeat.', 'Finish with a dish-soap solution and rinse.'],
      avoid: 'Hairspray is an old trick but newer formulas contain little alcohol and can leave residue.' },
    { id: 'makeup', n: 'Makeup / foundation', e: '💄', cat: 'oil',
      fabric: ['Scrape off excess.', 'Work in a little micellar water or dish soap.', 'For lipstick, dab with rubbing alcohol first (test), then soap.', 'Wash warm.'],
      carpet: ['Blot with dish-soap solution.', 'Dab with rubbing alcohol for pigment.', 'Rinse and blot.'],
      avoid: 'Don\'t rub — it spreads pigment and oil wider.' },
    { id: 'sweat', n: 'Sweat / deodorant', e: '👕', cat: 'protein',
      fabric: ['Make a paste of baking soda and water; scrub gently into underarm areas.', 'Leave 30 minutes.', 'Soak in cool water with oxygen bleach or enzyme detergent for 1 hour.', 'Wash warm. For whites, a final rinse with 1 cup white vinegar helps.'],
      carpet: ['Not typical — follow the upholstery method.'],
      avoid: 'Chlorine bleach reacts with sweat proteins and can turn yellow stains darker.' },
    { id: 'pet-urine', n: 'Pet urine', e: '🐾', cat: 'protein',
      fabric: ['Rinse in cold water.', 'Soak in enzyme cleaner (pet-specific) for the time on the label.', 'Wash with detergent; add 1 cup white vinegar to the rinse to neutralise odour.'],
      carpet: ['Blot as much as possible — stand on towels.', 'Saturate with a pet enzyme cleaner so it reaches the pad; leave as directed (often 10–15 minutes or more).', 'Blot and let air-dry fully.', 'Once dry, sprinkle baking soda, wait an hour, vacuum.'],
      avoid: 'Ammonia-based cleaners smell like urine to pets and invite repeat accidents. Avoid steam cleaning until odour is gone — heat can set it.' },
    { id: 'vomit', n: 'Vomit', e: '🤢', cat: 'protein',
      fabric: ['Remove solids with a paper towel or spatula (wear gloves).', 'Rinse from the back with cold water.', 'Soak in enzyme detergent for 30 minutes.', 'Wash on the hottest setting the label allows.'],
      carpet: ['Scoop solids; sprinkle baking soda to absorb, wait 15 minutes, vacuum.', 'Apply enzyme cleaner, wait as directed, blot.', 'Rinse with cold water, blot dry. Disinfect if anyone is sick.'],
      avoid: 'Hot water first will set proteins; wear gloves and wash hands well.' },
    { id: 'mud', n: 'Mud / dirt', e: '🟫', cat: 'particulate',
      fabric: ['Let mud dry completely.', 'Brush or vacuum off as much as possible.', 'Pre-treat with liquid detergent, rinse cold, wash warm.'],
      carpet: ['Let dry, then vacuum thoroughly from several directions.', 'Blot residue with dish-soap solution and rinse.'],
      avoid: 'Wiping wet mud smears it deeper into the fibres.' },
    { id: 'wax', n: 'Candle wax', e: '🕯️', cat: 'particulate',
      fabric: ['Harden wax with an ice pack in a bag; scrape off gently.', 'Place paper towel above and below; press with a warm (not hot) iron to wick up wax. Move to clean towel areas.', 'Treat any colour left with rubbing alcohol (test), then wash.'],
      carpet: ['Freeze with an ice pack; break and vacuum.', 'Lay a brown paper bag over remaining wax; press with a warm iron for a few seconds at a time.', 'Treat remaining dye with dish soap solution.'],
      avoid: 'Don\'t let a hot iron touch synthetic carpet fibres directly — they can melt.' },
    { id: 'gum', n: 'Chewing gum', e: '🍬', cat: 'particulate',
      fabric: ['Put the item in a bag in the freezer for an hour.', 'Scrape the brittle gum off with a dull knife.', 'Dab residue with a little vegetable oil or dish soap, then wash.'],
      carpet: ['Freeze gum with an ice pack; shatter and pick out.', 'Dab residue with dish soap solution; rinse.'],
      avoid: 'Pulling warm gum spreads it and pulls fibres.' },
    { id: 'rust', n: 'Rust', e: '🟠', cat: 'mineral',
      fabric: ['Squeeze lemon juice on the stain and sprinkle with salt.', 'Leave in the sun for an hour (white fabrics only).', 'Rinse and wash. Commercial rust removers work for stubborn stains — follow label safety.'],
      carpet: ['Dab with lemon juice and blot.', 'Use a carpet-safe rust remover if needed and rinse well.'],
      avoid: 'Chlorine bleach makes rust permanent.' },
    { id: 'nail-polish', n: 'Nail polish', e: '💅', cat: 'dye',
      fabric: ['Blot (don\'t smear) wet polish.', 'Test non-acetone remover on a hidden spot — acetone dissolves acetate, triacetate and some synthetics.', 'Dab with remover on a cotton ball from the back of the fabric.', 'Rinse, pre-treat, wash.'],
      carpet: ['Blot; test acetone-free remover on a hidden area.', 'Dab, blot, then clean with dish soap solution and rinse.'],
      avoid: 'Never use acetone on acetate fabrics or synthetic carpet without testing.' },
    { id: 'curry', n: 'Curry / turmeric', e: '🍛', cat: 'dye',
      fabric: ['Scrape off excess and rinse from behind with cold water.', 'Rub in dish soap to break the oil; rinse.', 'Soak in oxygen bleach solution for 1–2 hours.', 'Wash and dry in direct sunlight — UV fades turmeric remarkably well.'],
      carpet: ['Blot; sponge with dish soap solution.', 'Dab with 3% hydrogen peroxide on light carpets only (test).', 'Rinse and blot.'],
      avoid: 'Alkaline products (like baking soda) can turn turmeric red-brown temporarily — don\'t panic, rinse with vinegar.' },
    { id: 'chocolate', n: 'Chocolate', e: '🍫', cat: 'oil',
      fabric: ['Scrape off solids once cool.', 'Rinse from behind in cold water.', 'Rub in liquid detergent; leave 5 minutes.', 'Soak 30 minutes in cool water + enzyme detergent, then wash.'],
      carpet: ['Scrape; blot with dish-soap solution.', 'Rinse and blot dry.'],
      avoid: 'Hot water melts fat deeper and sets the milk protein.' },
    { id: 'ketchup', n: 'Ketchup / tomato sauce', e: '🍅', cat: 'tannin',
      fabric: ['Scrape off excess with a spoon.', 'Rinse from behind with cold water.', 'Rub in liquid detergent, leave 10 minutes.', 'Dab with white vinegar if colour remains; wash.'],
      carpet: ['Scoop up; blot with cold water.', 'Sponge with dish soap + vinegar solution.', 'Rinse and blot.'],
      avoid: 'Avoid hot water and the dryer until the red is gone.' },
    { id: 'mold', n: 'Mildew spots', e: '🦠', cat: 'mineral',
      fabric: ['Take outside and brush off loose spores (wear a mask).', 'Soak in hot water with oxygen bleach (or chlorine bleach on white cotton only).', 'Wash hot and dry in the sun.'],
      carpet: ['Small spots: spray white vinegar, wait 1 hour, scrub and dry fast with a fan.', 'Large areas (more than about 1 m² / 10 sq ft) or musty smells: call a pro — the pad is likely affected.'],
      avoid: 'Never mix bleach with vinegar or ammonia — it releases toxic gas. Fix the moisture source first.' }
  ];
  var SURF = [
    { id: 'fabric', n: 'Washable clothes / linens', e: '👕' },
    { id: 'delicate', n: 'Silk / wool / dry-clean only', e: '🧣' },
    { id: 'carpet', n: 'Carpet / rug', e: '🟫' },
    { id: 'upholstery', n: 'Sofa / upholstery', e: '🛋️' },
    { id: 'hard', n: 'Counters / tile / grout', e: '🧱' },
    { id: 'wood', n: 'Finished wood', e: '🪵' }
  ];
  function stepsFor(s, surf) {
    if (surf === 'fabric') return s.fabric;
    if (surf === 'carpet') return s.carpet;
    if (surf === 'upholstery') return ['Check the cleaning code on the tag: W = water-based OK, S = solvent only, WS = either, X = vacuum only (call a pro).', 'For W/WS codes, follow these carpet steps using as little liquid as possible:'].concat(s.carpet).concat(['Dry quickly with a fan to avoid water rings.']);
    if (surf === 'delicate') return ['Blot gently with a white cloth — never rub silk or wool.', 'Rinse the spot from behind with cool water.', s.cat === 'protein' ? 'Do NOT use enzyme detergents — they digest silk and wool fibres. Use a wool/silk wash instead.' : 'Dab with a few drops of wool/silk wash diluted in cool water.', 'Blot dry between towels; lay flat to dry.', 'For valuable or dry-clean-only items, take it to a professional quickly and name the stain.'];
    if (surf === 'hard') {
      var h = { tannin: 'Make a paste of baking soda and water, leave 10 minutes, wipe.', oil: 'Degrease with warm water + dish soap; rinse.', protein: 'Wipe with cool soapy water, then disinfect with a surface-appropriate disinfectant.', dye: 'Apply a baking-soda paste; on sealed tile or quartz only, dab with 3% hydrogen peroxide.', particulate: 'Remove residue with a plastic scraper; wipe with soapy water.', mineral: 'Use a dedicated rust/mineral remover suitable for your surface.' }[s.cat];
      return ['Wipe up what you can.', h, 'Rinse with clean water and dry.', 'Natural stone (marble, limestone, travertine): avoid acids like vinegar and lemon — they etch. Use a pH-neutral stone cleaner or a poultice.'];
    }
    return ['Wipe immediately with a barely damp cloth.', s.cat === 'oil' ? 'Sprinkle cornstarch to absorb grease; wipe away after 15 minutes.' : 'Clean with a drop of dish soap in warm water on a well-wrung cloth.', 'Dry right away — standing water causes white rings.', 'For white rings, use a wood-specific ring remover; for deep stains in the finish, consult a refinisher.'];
  }
  var state = { s: null, f: null };
  function pills(list, key, el) {
    el.innerHTML = list.map(function (x) { return '<li><button type="button" data-' + key + '="' + x.id + '">' + x.e + ' ' + CW.esc(x.n) + '</button></li>'; }).join('');
  }
  function render() {
    document.querySelectorAll('[data-s]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-s') === state.s); });
    document.querySelectorAll('[data-f]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === state.f); });
    var out = document.getElementById('sw-out');
    if (!state.s || !state.f) { out.innerHTML = '<p class="muted mb0">Choose a stain and a surface to see the fix.</p>'; return; }
    var s = S.filter(function (x) { return x.id === state.s; })[0], f = SURF.filter(function (x) { return x.id === state.f; })[0];
    out.innerHTML = '<h3 class="mt0">' + s.e + ' ' + CW.esc(s.n) + ' on ' + CW.esc(f.n.toLowerCase()) + '</h3><ol class="steps-list">' + stepsFor(s, state.f).map(function (t) { return '<li>' + CW.esc(t) + '</li>'; }).join('') + '</ol>' +
      '<div class="note safe"><strong>Avoid:</strong> ' + CW.esc(s.avoid) + '</div><p class="small muted mb0">Always test on a hidden area first. Still there? <a href="quotes.html?service=' + encodeURIComponent(state.f === 'carpet' || state.f === 'upholstery' ? 'Carpet & upholstery cleaning' : 'Deep cleaning') + '">Get a pro quote</a>.</p>';
    try { history.replaceState(null, '', '?stain=' + state.s + '&surface=' + state.f); } catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () {
    var a = document.getElementById('sw-stains'), b = document.getElementById('sw-surf'); if (!a) return;
    pills(S, 's', a); pills(SURF, 'f', b);
    var q = new URLSearchParams(location.search); state.s = q.get('stain'); state.f = q.get('surface') || 'fabric';
    a.addEventListener('click', function (e) { var t = e.target.closest('[data-s]'); if (t) { state.s = t.getAttribute('data-s'); render(); document.getElementById('sw-out').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } });
    b.addEventListener('click', function (e) { var t = e.target.closest('[data-f]'); if (t) { state.f = t.getAttribute('data-f'); render(); } });
    var srch = document.getElementById('sw-q');
    srch.addEventListener('input', function () { var v = srch.value.toLowerCase(); a.querySelectorAll('li').forEach(function (li) { li.style.display = li.textContent.toLowerCase().indexOf(v) > -1 ? '' : 'none'; }); });
    render();
  });
})();
