// Datos compartidos de la subasta: los usan la pantalla de la subasta (subasta.js)
// y el panel de administrador (admin-subasta.js). Todo se guarda en localStorage.
const AUCTION_KEYS = {
  config: 'dahlia_auction_config',
  bids: 'dahlia_auction_bids_v2',
  end: 'dahlia_auction_end_v2'
};

// Subasta que se muestra mientras el admin no la haya editado.
const AUCTION_DEFAULT = {
  name: 'Vestido de tirantes con olanes',
  description: 'Vestido mini de tirantes finos y escote en V, en tono marfil, con paneles de encaje y un vuelo de olanes que le da movimiento al caminar. Pieza de edición única, ideal para una ocasión especial o para combinar con una chamarra esponjosa.',
  details: [
    ['Color', 'Marfil'],
    ['Material', 'Gasa ligera con aplicaciones de encaje'],
    ['Largo', 'Mini, con vuelo de olanes'],
    ['Escote', 'En V, con tirantes finos'],
    ['Edición', 'Única, numerada 1/1']
  ],
  images: ['img/subasta/subasta-1.png', 'img/subasta/subasta-2.png', 'img/subasta/subasta-3.png'],
  startPrice: 400,
  increment: 50,
  durationHours: 48
};

// Ofertas de ejemplo de otras personas: k = cuántos incrementos arriba del precio inicial.
const AUCTION_SEED = [
  { name: 'Laura P.',    k: 1,  minAgo: 46 * 60 },
  { name: 'Carlos M.',   k: 2,  minAgo: 40 * 60 },
  { name: 'Daniela R.',  k: 3,  minAgo: 33 * 60 },
  { name: 'Jorge T.',    k: 4,  minAgo: 26 * 60 },
  { name: 'Sofía A.',    k: 6,  minAgo: 20 * 60 },
  { name: 'Carlos M.',   k: 7,  minAgo: 14 * 60 },
  { name: 'Paola M.',    k: 9,  minAgo: 8 * 60 },
  { name: 'Fernanda L.', k: 10, minAgo: 3 * 60 }
];

function getAuctionConfig() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(AUCTION_KEYS.config)); } catch (e) { /* se usa el predeterminado */ }
  const cfg = Object.assign({}, AUCTION_DEFAULT, saved || {});
  if (!Array.isArray(cfg.details)) cfg.details = AUCTION_DEFAULT.details;
  if (!Array.isArray(cfg.images)) cfg.images = AUCTION_DEFAULT.images;
  cfg.startPrice = Math.max(1, Math.round(Number(cfg.startPrice) || AUCTION_DEFAULT.startPrice));
  cfg.increment = Math.max(1, Math.round(Number(cfg.increment) || AUCTION_DEFAULT.increment));
  cfg.durationHours = Math.max(1, Number(cfg.durationHours) || AUCTION_DEFAULT.durationHours);
  return cfg;
}

// Devuelve false si no cupo en el almacenamiento (por ejemplo, fotos muy pesadas).
function saveAuctionConfig(cfg) {
  try {
    localStorage.setItem(AUCTION_KEYS.config, JSON.stringify(cfg));
    return true;
  } catch (e) {
    return false;
  }
}

function buildAuctionSeedBids(cfg) {
  const now = Date.now();
  return AUCTION_SEED.map((b, i) => ({
    id: 'seed_' + i,
    name: b.name,
    amount: cfg.startPrice + cfg.increment * b.k,
    date: new Date(now - b.minAgo * 60000).toISOString(),
    email: ''
  }));
}

// Lista de ofertas; la primera vez se cargan las de ejemplo.
function getAuctionBids(cfg) {
  try {
    const raw = localStorage.getItem(AUCTION_KEYS.bids);
    if (raw === null) {
      const seeded = buildAuctionSeedBids(cfg || getAuctionConfig());
      localStorage.setItem(AUCTION_KEYS.bids, JSON.stringify(seeded));
      return seeded;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}

function saveAuctionBids(list) {
  try { localStorage.setItem(AUCTION_KEYS.bids, JSON.stringify(list)); return true; } catch (e) { return false; }
}

// Momento (en milisegundos) en que termina la subasta; la primera vez se calcula desde ahora.
function getAuctionEnd(cfg) {
  let end = parseInt(localStorage.getItem(AUCTION_KEYS.end), 10);
  if (!end) {
    end = Date.now() + (cfg || getAuctionConfig()).durationHours * 3600000;
    localStorage.setItem(AUCTION_KEYS.end, String(end));
  }
  return end;
}

function setAuctionEnd(ts) {
  localStorage.setItem(AUCTION_KEYS.end, String(ts));
}

// Empieza una subasta nueva: tiempo completo y, según se pida, con ofertas de ejemplo o vacía.
function restartAuction(cfg, withSampleBids) {
  setAuctionEnd(Date.now() + cfg.durationHours * 3600000);
  saveAuctionBids(withSampleBids ? buildAuctionSeedBids(cfg) : []);
}