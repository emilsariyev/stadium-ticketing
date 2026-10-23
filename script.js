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

console.log('Planned seats:', SECTIONS.reduce((n, s) => n + s.rows * s.cols, 0));
