const SEAT = 14, GAP = 3, PITCH = SEAT + GAP;
const CATEGORIES = {
  standard: { price: 15, color: '#a8d8b8', name: { en: 'Standard' } },
  premium:  { price: 30, color: '#4caf72', name: { en: 'Premium' } },
  vip:      { price: 60, color: '#14532d', name: { en: 'VIP' } }
};
const SECTIONS = [
  { id: 'N',  name: { en: 'North Stand' }, cat: 'standard', x: 345, y: 150, rows: 10, cols: 30 },
  { id: 'S',  name: { en: 'South Stand' }, cat: 'standard', x: 345, y: 668, rows: 10, cols: 30 },
  { id: 'VIP',name: { en: 'VIP Box' },     cat: 'vip',      x: 345, y: 580, rows: 4,  cols: 30 },
  { id: 'W',  name: { en: 'West Stand' },  cat: 'premium',  x: 100, y: 340, rows: 13, cols: 12 },
  { id: 'E',  name: { en: 'East Stand' },  cat: 'premium',  x: 896, y: 340, rows: 13, cols: 12 },
  { id: 'NW', name: { en: 'NW Corner' },   cat: 'standard', x: 100, y: 150, rows: 10, cols: 10 },
  { id: 'NE', name: { en: 'NE Corner' },   cat: 'standard', x: 930, y: 150, rows: 10, cols: 10 },
  { id: 'SW', name: { en: 'SW Corner' },   cat: 'standard', x: 100, y: 668, rows: 10, cols: 10 },
  { id: 'SE', name: { en: 'SE Corner' },   cat: 'standard', x: 930, y: 668, rows: 10, cols: 10 }
];
const I18N = {
  en: { title:'Baku Olympic Arena', match:'Football match · Blue Eagles – Green Oak', zoomIn:'Zoom In', zoomOut:'Zoom Out', up:'Move Up', down:'Move Down', left:'Move Left', right:'Move Right', reset:'Reset view', details:'Seat details', add:'ADD TO CART', cart:'Cart', total:'Total', clear:'Clear cart', pitch:'FOOTBALL PITCH', none:'Pick a seat on the map. Clicking only shows its details.', section:'Stand', row:'Row', seat:'Seat', cat:'Category', price:'Price', status:'Status', available:'Available', incart:'In cart', unavailable:'Sold', inCartBtn:'ALREADY IN CART', soldBtn:'UNAVAILABLE', remove:'Remove', empty:'Your cart is empty', tickets:'tickets', legCart:'In cart', legSel:'Selected', legOff:'Unavailable' }
};

const seats = new Map();
let cart = [];
let inspected = null;
let lang = 'en';
const view = { x: 0, y: 0, z: 1 };
const $ = id => document.getElementById(id);
const t = k => I18N[lang][k];
const fmt = n => n + ' AZN';

function isSold(i) { const h = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return (h - Math.floor(h)) < 0.12; }

function buildVenue() {
  const world = $('world');
  const pitch = document.createElement('div');
  pitch.className = 'pitch'; pitch.innerHTML = '<span id="pitchLbl"></span>';
  world.appendChild(pitch);
  const frag = document.createDocumentFragment();
  let counter = 0;
  SECTIONS.forEach(sec => {
    const lbl = document.createElement('div');
    lbl.className = 'label'; lbl.dataset.sec = sec.id;
    lbl.style.cssText = `left:${sec.x}px;top:${sec.y - 20}px;width:${sec.cols * PITCH}px`;
    frag.appendChild(lbl);
    for (let r = 0; r < sec.rows; r++) for (let c = 0; c < sec.cols; c++) {
      const rowLetter = String.fromCharCode(65 + r), num = c + 1;
      const s = { id: `${sec.id}-${rowLetter}${num}`, sec, row: rowLetter, num, cat: sec.cat,
                  price: CATEGORIES[sec.cat].price, unavailable: isSold(counter++) };
      const b = document.createElement('button');
      b.className = 'seat ' + sec.cat; b.dataset.id = s.id; b.type = 'button';
      b.style.left = sec.x + c * PITCH + 'px'; b.style.top = sec.y + r * PITCH + 'px';
      if (s.unavailable) b.disabled = true;
      s.el = b; seats.set(s.id, s); frag.appendChild(b);
    }
  });
  world.appendChild(frag);
}

const vp = $('viewport'), world = $('world');
const MIN_Z = 0.25, MAX_Z = 3, STEP = 90;
function applyView() {
  const w = vp.clientWidth, h = vp.clientHeight, ww = 1200 * view.z, wh = 900 * view.z, m = 80;
  view.x = Math.min(w - m, Math.max(m - ww, view.x));
  view.y = Math.min(h - m, Math.max(m - wh, view.y));
  world.style.transform = `translate(${view.x}px,${view.y}px) scale(${view.z})`;
}
const BOUNDS = { x: 90, y: 125, w: 1020, h: 730 }, FIT_PAD = 12;
function resetView() {
  const w = vp.clientWidth - FIT_PAD * 2, h = vp.clientHeight - FIT_PAD * 2;
  view.z = Math.min(w / BOUNDS.w, h / BOUNDS.h);
  view.x = (vp.clientWidth - BOUNDS.w * view.z) / 2 - BOUNDS.x * view.z;
  view.y = (vp.clientHeight - BOUNDS.h * view.z) / 2 - BOUNDS.y * view.z;
  applyView();
}

function zoomAt(f, cx, cy) {
  const nz = Math.min(MAX_Z, Math.max(MIN_Z, view.z * f)), k = nz / view.z;
  view.x = cx - (cx - view.x) * k; view.y = cy - (cy - view.y) * k; view.z = nz; applyView();
}
const move = (dx, dy) => { view.x += dx; view.y += dy; applyView(); };
$('zoomIn').onclick  = () => zoomAt(1.25, vp.clientWidth / 2, vp.clientHeight / 2);
$('zoomOut').onclick = () => zoomAt(0.8, vp.clientWidth / 2, vp.clientHeight / 2);
$('moveUp').onclick = () => move(0, STEP);  $('moveDown').onclick = () => move(0, -STEP);
$('moveLeft').onclick = () => move(STEP, 0); $('moveRight').onclick = () => move(-STEP, 0);
$('resetView').onclick = resetView;

function paintSeat(s) {
  s.el.classList.toggle('incart', cart.includes(s.id));
  s.el.classList.toggle('inspected', inspected === s.id);
  s.el.setAttribute('aria-label', `${s.sec.name[lang]} ${t('row')} ${s.row} ${t('seat')} ${s.num}, ${fmt(s.price)}, ` +
    (s.unavailable ? t('unavailable') : cart.includes(s.id) ? t('incart') : t('available')));
}
function renderDetails() {
  const s = seats.get(inspected), btn = $('addBtn');
  if (!s) { $('details').innerHTML = `<p class="empty">${t('none')}</p>`; btn.disabled = true; btn.textContent = t('add'); return; }
  const inCart = cart.includes(s.id);
  const status = s.unavailable ? t('unavailable') : inCart ? t('incart') : t('available');
  $('details').innerHTML = `<dl><dt>${t('section')}</dt><dd>${s.sec.name[lang]}</dd><dt>${t('row')}</dt><dd>${s.row}</dd>
    <dt>${t('seat')}</dt><dd>${s.num}</dd><dt>${t('cat')}</dt><dd>${CATEGORIES[s.cat].name[lang]}</dd>
    <dt>${t('price')}</dt><dd>${fmt(s.price)}</dd><dt>${t('status')}</dt><dd>${status}</dd></dl>`;
  btn.disabled = s.unavailable || inCart;
  btn.textContent = s.unavailable ? t('soldBtn') : inCart ? t('inCartBtn') : t('add');
}
function renderCart() {
  const list = $('cartList');
  list.innerHTML = cart.length ? '' : `<li class="empty-cart">${t('empty')}</li>`;
  let total = 0;
  cart.forEach(id => {
    const s = seats.get(id); total += s.price;
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.sec.name[lang]}<small>${t('row')} ${s.row} · ${t('seat')} ${s.num} · ${CATEGORIES[s.cat].name[lang]}</small></span>
      <span>${fmt(s.price)} <button type="button" data-remove="${id}">${t('remove')}</button></span>`;
    list.appendChild(li);
  });
  $('total').textContent = fmt(total);
  $('count').textContent = cart.length ? `(${cart.length} ${t('tickets')})` : '';
  $('clearBtn').disabled = !cart.length;
}
function refresh(ids) { (ids || [...seats.keys()]).forEach(id => paintSeat(seats.get(id))); renderDetails(); renderCart(); }
function inspect(id) { const prev = inspected; inspected = id; refresh([prev, id].filter(Boolean)); }
function addToCart() {
  const s = seats.get(inspected);
  if (!s || s.unavailable || cart.includes(s.id)) return;
  cart.push(s.id);
  refresh([s.id]);
}

function removeFromCart(id) {
  cart = cart.filter(x => x !== id);
  refresh([id]);
}

vp.addEventListener('click', e => {
  const b = e.target.closest('.seat');
  if (b && !b.disabled) inspect(b.dataset.id);
});

function applyLabels() {
  $('pitchLbl').textContent = t('pitch');
  document.querySelectorAll('.label').forEach(l => {
    const sec = SECTIONS.find(s => s.id === l.dataset.sec);
    l.textContent = sec.name[lang];
  });
}

function renderLegend() {
  $('legend').innerHTML = Object.values(CATEGORIES).map(c => `<span><i style="background:${c.color}"></i>${c.name[lang]} ${fmt(c.price)}</span>`).join('') +
    `<span><i style="background:var(--cart)"></i>${t('legCart')}</span><span><i style="background:#fff;border:3px solid #111"></i>${t('legSel')}</span>` +
    `<span><i style="background:var(--off)"></i>${t('legOff')}</span>`;
}

let lastW = innerWidth;
window.addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; resetView(); } else applyView(); });

$('addBtn').onclick = addToCart;
$('clearBtn').onclick = () => { const old = cart; cart = []; refresh(old); };
$('cartList').addEventListener('click', e => { const id = e.target.dataset.remove; if (id) removeFromCart(id); });
buildVenue();
applyLabels();
renderLegend();
refresh();
resetView();
