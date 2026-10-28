/* KettyMon prototype engine: catalogue, cart and hash routing.
   Each design direction supplies its own views; this file owns behaviour only.
   Every Product is a bed with a Pad (customer copy: "jastuk") and a Shell ("spoljni deo").
   The Customer picks a Fabric for each, and the price depends only on the Size. */
(function () {
  'use strict';

  var fabrics = {
    siva: { name: 'Siva tkanina', img: 'img/fabric-siva.webp', pad: true, shell: true },
    lan: { name: 'Bež lan', img: 'img/fabric-lan.webp', pad: false, shell: true },
    bez: { name: 'Bež pliš', img: 'img/fabric-bez.webp', pad: true, shell: true },
    roze: { name: 'Roze pliš', img: 'img/fabric-roze.webp', pad: true, shell: false }
  };
  var fabricIds = ['siva', 'lan', 'bez', 'roze'];
  var padIds = fabricIds.filter(function (k) { return fabrics[k].pad; });
  var shellIds = fabricIds.filter(function (k) { return fabrics[k].shell; });
  var COLLECTION = 'Poznato. Ali novo.';

  var products = [
    { id: 'luna', name: 'Luna', kind: 'Pravougaoni krevetić', collection: COLLECTION, isNew: true,
      blurb: 'Visoke, mekane ivice na koje ljubimac rado spusti glavu i debeo jastuk za miran san.',
      photos: ['img/bed-bolster-plants.webp', 'img/dog-blanket-close.webp'],
      pad: 'bez', shell: 'siva',
      sizes: [
        { id: 'S', dims: '50 × 40 cm', pet: 'do 5 kg', price: 3990 },
        { id: 'M', dims: '70 × 55 cm', pet: 'do 15 kg', price: 4990 },
        { id: 'L', dims: '90 × 70 cm', pet: 'do 30 kg', price: 6490 },
        { id: 'XL', dims: '110 × 85 cm', pet: 'do 45 kg', price: 7990 }] },
    { id: 'oblak', name: 'Oblak', kind: 'Okrugli krevetić', collection: COLLECTION, isNew: true,
      blurb: 'Nizak, zaobljen rub i mekan jastuk. Dovoljno je nizak da i starijim ljubimcima bude lako da uđu.',
      photos: ['img/room-wide-saluki.webp', 'img/puppy-sherpa.webp'],
      pad: 'bez', shell: 'bez',
      sizes: [
        { id: 'S', dims: 'Ø 50 cm', pet: 'do 5 kg', price: 3490 },
        { id: 'M', dims: 'Ø 70 cm', pet: 'do 15 kg', price: 4490 },
        { id: 'L', dims: 'Ø 90 cm', pet: 'do 30 kg', price: 5790 }] },
    { id: 'klupko', name: 'Klupko', kind: 'Okrugli krevetić', collection: '',
      blurb: 'Okrugao krevetić sa visokim rubom, za ljubimce koji vole da spavaju sklupčani.',
      photos: ['img/cat-round-sherpa.webp', 'img/cat-fireplace.webp'],
      pad: 'bez', shell: 'lan',
      sizes: [
        { id: 'S', dims: 'Ø 50 cm', pet: 'do 4 kg', price: 3490 },
        { id: 'M', dims: 'Ø 60 cm', pet: 'do 7 kg', price: 3990 }] },
    { id: 'medo', name: 'Medo', kind: 'Ovalni krevetić', collection: '',
      blurb: 'Prostran krevetić za veće ljubimce koji vole da se ispruže koliko su dugi.',
      photos: ['img/dog-large-bed.webp', 'img/bed-oval-room.webp'],
      pad: 'siva', shell: 'siva',
      sizes: [
        { id: 'M', dims: '75 × 60 cm', pet: 'do 15 kg', price: 5490 },
        { id: 'L', dims: '95 × 75 cm', pet: 'do 30 kg', price: 6990 },
        { id: 'XL', dims: '120 × 90 cm', pet: 'do 50 kg', price: 8490 }] },
    { id: 'mezimce', name: 'Mezimče', kind: 'Ovalni krevetić', collection: '',
      blurb: 'Mali, topao krevetić za štence, mačiće i druge male ljubimce.',
      photos: ['img/bed-oval-room.webp', 'img/puppy-sherpa.webp'],
      pad: 'roze', shell: 'lan',
      sizes: [
        { id: 'S', dims: '45 × 35 cm', pet: 'do 4 kg', price: 3290 },
        { id: 'M', dims: '60 × 45 cm', pet: 'do 8 kg', price: 3790 }] },
    { id: 'roza', name: 'Roza', kind: 'Pravougaoni krevetić', collection: COLLECTION,
      blurb: 'Pliš krevetić sa niskim rubom, za ljubimce koji vole da spavaju ispruženi.',
      photos: ['img/cat-pink-cushion.webp', 'img/cat-fireplace.webp'],
      pad: 'roze', shell: 'bez',
      sizes: [
        { id: 'S', dims: '45 × 40 cm', pet: 'do 4 kg', price: 2990 },
        { id: 'M', dims: '55 × 50 cm', pet: 'do 7 kg', price: 3490 }] }
  ];

  /* Testimonials: a photo of the pet, the Customer's words, or both, about exactly one Product.
     Staff enter them by hand from Instagram. They may name the pet, never the Customer.
     These are invented examples; the stand-in photos are cropped onto the pet with `pos`. */
  var testimonials = [
    { id: 't1', pid: 'luna', pet: 'Šarko', photo: 'img/dog-blanket-close.webp', pos: '50% 38%', text: 'Šarko je od prvog dana spavao samo na svom KettyMon krevetiću. Sad ne može da ga namami ni kauč.' },
    { id: 't7', pid: 'oblak', pet: 'Sultan', photo: 'img/room-wide-saluki.webp', pos: '79% 70%' },
    { id: 't12', pid: 'medo', pet: 'Rex', text: 'Konačno krevet u koji Rex stane ceo, a da mu šape ne vise napolju.' },
    { id: 't10', pid: 'klupko', pet: 'Mica', photo: 'img/cat-round-sherpa.webp', pos: '38% 40%', text: 'Mica u njemu spava sklupčana po ceo dan. Rub je taman toliko visok koliko ona voli.' },
    { id: 't2', pid: 'luna', pet: 'Bruno', text: 'Stigao je u petak, a u subotu ujutru Bruno već nije hteo da izađe iz njega. Hvala vam!' },
    { id: 't6', pid: 'oblak', pet: 'Mrvica', photo: 'img/puppy-sherpa.webp', pos: '42% 60%', text: 'Mrvica se ne odvaja od njega. Nosimo ga sa sobom i kad idemo kod bake.' },
    { id: 't15', pid: 'roza', pet: 'Pegica', photo: 'img/cat-pink-cushion.webp', pos: '52% 55%', text: 'Roze nam je bio rizik, ali Pegica je odmah legla i nije se pomerila do jutra.' },
    { id: 't13', pid: 'medo', pet: 'Bela', photo: 'img/bed-oval-room.webp', pos: '50% 72%' },
    { id: 't9', pid: 'oblak', pet: 'Žuća', text: 'Žuća ima četrnaest godina i teško joj je da se penje. U ovaj ulazi sama.' },
    { id: 't3', pid: 'luna', pet: 'Maza', photo: 'img/bed-bolster-plants.webp', pos: '50% 52%' },
    { id: 't14', pid: 'mezimce', pet: 'Kiki', photo: 'img/cushion-window.webp', pos: '44% 74%', text: 'Kupili smo ga za štene, a sada u njemu spavaju i Kiki i mačka.' },
    { id: 't4', pid: 'luna', text: 'Ovo nam je drugi krevetić od vas. Prvi je posle tri godine i dalje kao nov ❤️' },
    { id: 't11', pid: 'klupko', pet: 'Tigar', photo: 'img/cat-fireplace.webp', pos: '42% 55%' },
    { id: 't5', pid: 'luna', pet: 'Lord', photo: 'img/dog-large-bed.webp', pos: '50% 44%', text: 'Lord je veliki pas, a ovo je prvi krevet koji mu je zaista dovoljno velik.' },
    { id: 't16', pid: 'roza', text: 'Stigao je za četiri dana, šavovi su uredni, a mačka ga je zauzela pre nego što smo skinuli kesu.' },
    { id: 't8', pid: 'oblak', pet: 'Tara', text: 'Tara ga je prvo samo njušila, a već treće večeri nije htela da spava nigde drugde.' }
  ];
  var T_MIN_ON_PRODUCT = 4;
  function testimonialsFor(pid) { return testimonials.filter(function (t) { return t.pid === pid; }); }

  var SHIPPING_FEE = 450;
  var FREE_FROM = 10000;
  var DELIVERY = 'Šaljemo za 3–7 radnih dana';
  var SELLER = '[Ime i prezime], fizičko lice, [adresa]';

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' RSD'; }
  function find(id) { for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i]; return null; }
  function sizeOf(p, sid) { for (var i = 0; i < p.sizes.length; i++) if (p.sizes[i].id === sid) return p.sizes[i]; return p.sizes[0]; }
  function sizeLabel(p) {
    var n = p.sizes.length;
    return n + (n === 1 ? ' veličina' : n < 5 ? ' veličine' : ' veličina');
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fabricText(pad, shell) { return 'Jastuk: ' + fabrics[pad].name + ' · Spoljni deo: ' + fabrics[shell].name; }

  /* The chosen pair as two real Fabric swatches: the Pad laid over the Shell, the way it sits in the bed.
     Product photos of every pairing won't exist for a while. */
  function pair(shellId, padId) {
    var sf = fabrics[shellId], pf = fabrics[padId];
    return '<span class="km-pair" role="img" aria-label="' + esc('Spoljni deo ' + sf.name + ', jastuk ' + pf.name) + '">' +
      '<img class="km-shell" src="' + sf.img + '" alt=""><img class="km-pad" src="' + pf.img + '" alt=""></span>';
  }

  /* One Testimonial as a figure. The Product link is left out where the page is already that Product's.
     `copy` marks the duplicate set of a moving row: hidden from assistive tech and out of the tab order. */
  function tcard(t, opts) {
    opts = opts || {};
    var p = find(t.pid);
    var kind = t.photo && t.text ? 'both' : t.photo ? 'photo' : 'words';
    var who = t.pet ? t.pet + ' na krevetiću ' + p.name : 'Ljubimac na krevetiću ' + p.name;
    var tab = opts.copy ? ' tabindex="-1"' : '';
    return '<figure class="km-t km-t--' + kind + '">' +
      (t.photo ? '<span class="km-t-photo"><img src="' + t.photo + '" alt="' + esc(who) + '" loading="lazy" style="object-position:' + (t.pos || '50% 50%') + '"></span>' : '') +
      (t.text ? '<blockquote class="km-t-words"><p>„' + esc(t.text) + '“</p></blockquote>' : '') +
      '<figcaption class="km-t-cap">' + (t.pet ? '<span class="km-t-pet">' + esc(t.pet) + '</span>' : '') +
      (opts.product === false ? '' : '<a class="km-t-prod" href="#/p/' + p.id + '"' + tab + '>Krevetić ' + p.name + '</a>') + '</figcaption></figure>';
  }

  /* The homepage's slowly moving row: the list twice over so the loop has no seam, and a control to stop it. */
  function trow(list, label) {
    var set = function (copy) { return '<div class="km-row-set"' + (copy ? ' aria-hidden="true"' : '') + '>' + list.map(function (t) { return tcard(t, { copy: copy }); }).join('') + '</div>'; };
    return '<div class="km-row' + (state.rowPaused ? ' paused' : '') + '" role="region" aria-label="' + esc(label || 'Vaši utisci') + '" style="--km-row-dur:' + list.length * 8 + 's"><div class="km-row-track">' + set(false) + set(true) + '</div></div>';
  }
  function trowToggle(cls) {
    var on = !state.rowPaused;
    return '<button type="button" class="' + (cls || 'km-row-toggle') + '" data-act="trow" aria-pressed="' + !on + '">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (on ? '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>' : '<path d="M7 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 7 5.5Z"/>') + '</svg>' +
      '<span>' + (on ? 'Zaustavi' : 'Pokreni') + '</span></button>';
  }

  function load(key, fallback) { try { var v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(key, v) { try { sessionStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* storage unavailable: keep in memory */ } }

  var state = {
    route: { name: 'home' },
    coll: '',
    pick: {},
    cart: load('km-cart', []).filter(function (l) { var f = fabrics[l.pad], g = fabrics[l.shell]; return f && f.pad && g && g.shell && find(l.pid); }),
    lastOrder: null,
    rowPaused: false
  };

  function pickFor(p) {
    if (!state.pick[p.id]) state.pick[p.id] = { pad: p.pad, shell: p.shell, size: p.sizes[Math.min(1, p.sizes.length - 1)].id, qty: 1, view: 0 };
    return state.pick[p.id];
  }

  function options(ids, current) {
    return ids.map(function (k) { var f = fabrics[k]; return { id: k, name: f.name, img: f.img, on: k === current }; });
  }

  function cartView() {
    var subtotal = 0, count = 0;
    var lines = state.cart.map(function (l, i) {
      var p = find(l.pid), z = sizeOf(p, l.size);
      subtotal += z.price * l.qty; count += l.qty;
      return { index: i, product: p, size: z, pad: fabrics[l.pad], shell: fabrics[l.shell], padId: l.pad, shellId: l.shell,
        fabricText: fabricText(l.pad, l.shell), pair: pair(l.shell, l.pad), qty: l.qty, total: fmt(z.price * l.qty), unit: fmt(z.price) };
    });
    var fee = subtotal === 0 || subtotal >= FREE_FROM ? 0 : SHIPPING_FEE;
    return {
      lines: lines, count: count, empty: lines.length === 0,
      subtotal: fmt(subtotal), shipping: fee === 0 ? 'Besplatna' : fmt(fee), total: fmt(subtotal + fee),
      freeLeft: fee > 0 ? fmt(FREE_FROM - subtotal) : '', freeProgress: Math.min(100, Math.round(subtotal / FREE_FROM * 100))
    };
  }

  function catalogue() {
    return products.filter(function (p) { return !state.coll || p.collection === state.coll; });
  }

  function productView(p) {
    var pk = pickFor(p), z = sizeOf(p, pk.size);
    var gallery = p.photos.map(function (src) { return { src: src, alt: p.kind + ' ' + p.name }; });
    return {
      p: p, pick: pk, size: z,
      pad: fabrics[pk.pad], shell: fabrics[pk.shell], padId: pk.pad, shellId: pk.shell,
      padOptions: options(padIds, pk.pad), shellOptions: options(shellIds, pk.shell),
      fabricText: fabricText(pk.pad, pk.shell), pair: pair(pk.shell, pk.pad),
      price: fmt(z.price), addTotal: fmt(z.price * pk.qty), sizeLabel: sizeLabel(p),
      gallery: gallery, view: Math.min(pk.view, gallery.length - 1),
      testimonials: (function (l) { return l.length >= T_MIN_ON_PRODUCT ? l : []; })(testimonialsFor(p.id))
    };
  }

  /* The "Vaši utisci" page: every Testimonial, or one Product's. */
  function testimonialPage(pid) {
    var p = pid ? find(pid) : null;
    return {
      list: p ? testimonialsFor(pid) : testimonials, product: p, total: testimonials.length,
      filters: [{ id: '', label: 'Svi', count: testimonials.length, on: !p, href: '#/utisci' }].concat(products.map(function (q) {
        return { id: q.id, label: q.name, count: testimonialsFor(q.id).length, on: !!p && p.id === q.id, href: '#/utisci/' + q.id };
      }).filter(function (f) { return f.count; }))
    };
  }

  function parse(hash) {
    var h = (hash || '').replace(/^#\/?/, '');
    var parts = h.split('/');
    if (parts[0] === 'p' && find(parts[1])) return { name: 'product', id: parts[1] };
    if (parts[0] === 'korpa') return { name: 'cart' };
    if (parts[0] === 'porucivanje') return { name: 'checkout' };
    if (parts[0] === 'hvala') return { name: 'done' };
    if (parts[0] === 'utisci') return { name: 'utisci', pid: find(parts[1]) ? parts[1] : '' };
    if (parts[0] === 'kolekcija') return { name: 'home', anchor: 'kolekcija' };
    return { name: 'home', anchor: parts[0] || '' };
  }

  var views = null;
  var root = null;

  function render(opts) {
    if (!views || !root) return;
    var r = state.route;
    var ctx = { state: state, cart: cartView(), fmt: fmt, collection: COLLECTION,
      filterNote: state.coll ? 'Kolekcija ' + state.coll : '', esc: esc, sizeLabel: sizeLabel, fabrics: fabrics, fabricIds: fabricIds, pair: pair,
      delivery: DELIVERY, freeFrom: fmt(FREE_FROM), fee: fmt(SHIPPING_FEE), seller: SELLER,
      testimonials: testimonials, tcard: tcard, trow: trow, trowToggle: trowToggle };
    var main;
    if (r.name === 'product') { ctx.pv = productView(find(r.id)); main = views.product(ctx); }
    else if (r.name === 'cart') main = views.cart(ctx);
    else if (r.name === 'checkout') main = ctx.cart.empty ? views.cart(ctx) : views.checkout(ctx);
    else if (r.name === 'done') { ctx.order = state.lastOrder; main = views.done(ctx); }
    else if (r.name === 'utisci') { ctx.tp = testimonialPage(r.pid); main = views.utisci(ctx); }
    else { ctx.products = catalogue().map(function (p) { return Object.assign({ sizeLabel: sizeLabel(p), from: 'od ' + fmt(p.sizes[0].price) }, p); }); main = views.home(ctx); }
    root.innerHTML = views.header(ctx) + '<main id="glavno" tabindex="-1">' + main + '</main>' + views.footer(ctx);
    if (views.after) views.after(ctx, root);
    if (opts && opts.scroll) {
      var target = r.anchor ? document.getElementById(r.anchor) : null;
      if (target) target.scrollIntoView({ block: 'start' });
      else window.scrollTo(0, 0);
      var m = document.getElementById('glavno');
      if (m && opts.focus) m.focus({ preventScroll: true });
    }
  }

  function go(hash) { if (location.hash === hash) { state.route = parse(hash); render({ scroll: true }); } else location.hash = hash; }

  function act(el, ev) {
    var a = el.getAttribute('data-act');
    var r = state.route;
    var p = r.name === 'product' ? find(r.id) : null;
    var pk = p ? pickFor(p) : null;
    switch (a) {
      case 'coll': state.coll = el.getAttribute('data-coll') || ''; render(); break;
      case 'browse':
        state.coll = el.getAttribute('data-coll') || '';
        if (views.closeMenu) views.closeMenu();
        if (location.hash === '#/proizvodi') { render(); var t = document.getElementById('proizvodi'); if (t) t.scrollIntoView({ block: 'start' }); }
        else location.hash = '#/proizvodi';
        break;
      case 'pad': pk.pad = el.getAttribute('data-fabric'); render(); break;
      case 'shell': pk.shell = el.getAttribute('data-fabric'); render(); break;
      case 'size': pk.size = el.getAttribute('data-size'); render(); break;
      case 'view': pk.view = +el.getAttribute('data-view'); render(); break;
      case 'qty': pk.qty = Math.max(1, Math.min(9, pk.qty + (+el.getAttribute('data-d')))); render(); break;
      case 'add':
        var found = state.cart.filter(function (l) { return l.pid === p.id && l.pad === pk.pad && l.shell === pk.shell && l.size === pk.size; })[0];
        if (found) found.qty = Math.min(9, found.qty + pk.qty); else state.cart.push({ pid: p.id, pad: pk.pad, shell: pk.shell, size: pk.size, qty: pk.qty });
        save('km-cart', state.cart); pk.qty = 1;
        if (views.added) { render(); views.added(cartView(), root); } else go('#/korpa');
        break;
      case 'line':
        var i = +el.getAttribute('data-i');
        state.cart[i].qty = Math.max(1, Math.min(9, state.cart[i].qty + (+el.getAttribute('data-d'))));
        save('km-cart', state.cart); render(); break;
      case 'trow':
        state.rowPaused = !state.rowPaused;
        root.querySelectorAll('.km-row').forEach(function (row) { row.classList.toggle('paused', state.rowPaused); });
        var fresh = document.createElement('div'); fresh.innerHTML = trowToggle();
        el.setAttribute('aria-pressed', String(state.rowPaused)); el.innerHTML = fresh.firstChild.innerHTML;
        break;
      case 'remove':
        state.cart.splice(+el.getAttribute('data-i'), 1); save('km-cart', state.cart); render(); break;
      default: if (views.act) views.act(a, el, ev, state, render);
    }
  }

  function mount(v) {
    views = v;
    root = document.getElementById('app');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-act]');
      if (el) { ev.preventDefault(); act(el, ev); }
    });
    document.addEventListener('submit', function (ev) {
      var f = ev.target;
      if (f.getAttribute('data-form') !== 'order') return;
      ev.preventDefault();
      f.querySelectorAll('input').forEach(function (inp) {
        var err = inp.parentNode.querySelector('.err');
        if (!err) return;
        var v = inp.validity;
        err.textContent = v.valueMissing ? 'Popunite ovo polje.' : v.patternMismatch ? 'Poštanski broj ima 5 cifara, na primer 11000.' : v.typeMismatch ? 'Unesite email u obliku ime@primer.rs.' : '';
      });
      var bad = f.querySelector(':invalid');
      f.classList.add('was-validated');
      if (bad) { bad.focus(); if (views.invalid) views.invalid(f); return; }
      var data = new FormData(f);
      state.lastOrder = { number: 'KM-1042', phone: data.get('telefon'), email: data.get('email'), name: data.get('ime') };
      state.cart = []; save('km-cart', []);
      go('#/hvala');
    });
    window.addEventListener('hashchange', function () { state.route = parse(location.hash); render({ scroll: true, focus: true }); });
    state.route = parse(location.hash);
    render({ scroll: !!state.route.anchor });
  }

  window.KM = { mount: mount, fmt: fmt, products: products, fabrics: fabrics, fabricIds: fabricIds, pair: pair, find: find,
    testimonials: testimonials, tcard: tcard, trow: trow, go: go, render: function () { render(); }, state: state };
})();
