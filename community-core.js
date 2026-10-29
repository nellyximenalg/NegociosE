// Comentarios de la Comunidad: datos compartidos por Comunidad, Campaña y Mis comentarios.
// Se guardan en localStorage; la primera vez se cargan comentarios de ejemplo de otras personas.
const COMMUNITY_KEY = 'dahlia_community_comments';

// ---------- Comentarios de ejemplo (de otras personas, con distintos productos) ----------
const COMMUNITY_SEED = [
  { productId: 1,  name: 'Daniela R.',  stars: 5, daysAgo: 2,  text: 'Me encantó el vestido, la tela cae muy bonito y no se arruga. Pedí mi talla habitual y quedó perfecto.' },
  { productId: 17, name: 'Carlos M.',   stars: 5, daysAgo: 4,  text: 'La chamarra bomber está padrísima, se siente resistente y el corte es muy actual. La uso casi diario.' },
  { productId: 25, name: 'Luis Á.',     stars: 4, daysAgo: 6,  text: 'Buen cinturón de piel, se nota la calidad. Solo le daría una estrella más si trajera una caja para regalo.' },
  { productId: 44, name: 'Mariana G.',  stars: 5, daysAgo: 8,  text: 'Lo compré para una boda y recibí muchos cumplidos. El satín es elegante sin ser pesado.' },
  { productId: 13, name: 'Jorge T.',    stars: 4, daysAgo: 11, text: 'La camisa Oxford queda bien en el hombro y la manga. Recomiendo lavarla del revés para que dure más.' },
  { productId: 31, name: 'Sofía A.',    stars: 5, daysAgo: 14, text: 'El reloj minimalista combina con todo y es muy ligero. Me llegó en tres días a Aguascalientes.' },
  { productId: 7,  name: 'Paola M.',    stars: 5, daysAgo: 17, text: 'Mi cárdigan favorito para el frío de la mañana. Es oversize de verdad, yo me fui con una talla menos.' },
  { productId: 29, name: 'Ricardo H.',  stars: 3, daysAgo: 21, text: 'La mochila se ve bien y cabe la laptop, pero esperaba bolsillos laterales más profundos.' },
  { productId: 4,  name: 'Fernanda L.', stars: 5, daysAgo: 25, text: 'La chamarra de mezclilla tiene un lavado hermoso. Va con vestidos y con jeans, súper versátil.' },
  { productId: 35, name: 'Andrea V.',   stars: 5, daysAgo: 30, text: 'La pulsera artesanal es preciosa, se nota el trabajo a mano. Ya compré otra para mi mamá.' },
  { productId: 19, name: 'Diego S.',    stars: 4, daysAgo: 36, text: 'La sudadera es calientita y la capucha queda bien. Se encoge un poquito la primera vez que la lavas.' },
  { productId: 42, name: 'Valeria C.',  stars: 5, daysAgo: 42, text: 'El blazer estructurado le da un toque formal a cualquier outfit. Excelente caída y acabados.' }
];

function communityProductName(id) {
  const p = getStoreProducts().find(x => x.id === id);
  return p ? p.name : 'Producto';
}

function loadCommunityComments() {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (raw === null) {
      const now = Date.now();
      const seeded = COMMUNITY_SEED.map((s, i) => ({
        id: 'seed_' + (i + 1),
        productId: s.productId,
        productName: communityProductName(s.productId),
        name: s.name,
        stars: s.stars,
        text: s.text,
        date: new Date(now - s.daysAgo * 86400000 - i * 3600000).toISOString(),
        mine: false
      }));
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveCommunityComments(list) {
  localStorage.setItem(COMMUNITY_KEY, JSON.stringify(list));
}