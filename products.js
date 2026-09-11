// Catálogo de productos simulado 
// Cada producto tiene: id, nombre, categoría, precio, sku, "foto" (degradado),
// tallas, colores, descripción y si aparece como destacado en Inicio.

const PRODUCTS = [
  {
    id: 1,
    name: 'Vestido Midi Fluido',
    category: 'mujer',
    price: 790,
    sku: 'DHL-101',
    gradient: 'linear-gradient(150deg,#3a222c,#d9769b)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Rosa dalia', hex: '#d9769b' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Beige', hex: '#c9b79c' }
    ],
    description: 'Vestido midi de caída suave, ideal para el trabajo o una cena. Tela ligera que no se pega y no se arruga fácil.',
    featured: true
  },
  {
    id: 2,
    name: 'Blusa Satinada',
    category: 'mujer',
    price: 520,
    sku: 'DHL-102',
    gradient: 'linear-gradient(150deg,#2a251d,#e3b23c)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dorado', hex: '#e3b23c' },
      { name: 'Blanco hueso', hex: '#f4ecd8' },
      { name: 'Vino', hex: '#7a2f4d' }
    ],
    description: 'Blusa con caída satinada y cuello sencillo. Combina con jeans o falda para looks de día o de noche.',
    featured: false
  },
  {
    id: 3,
    name: 'Falda Plisada',
    category: 'mujer',
    price: 610,
    sku: 'DHL-103',
    gradient: 'linear-gradient(150deg,#2a1f22,#7a2f4d)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Vino', hex: '#7a2f4d' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Beige', hex: '#c9b79c' }
    ],
    description: 'Falda plisada a media pierna, con caída con movimiento. Ideal para combinar con blusa o suéter.',
    featured: false
  },
  {
    id: 4,
    name: 'Chamarra de Mezclilla',
    category: 'mujer',
    price: 850,
    sku: 'DHL-104',
    gradient: 'linear-gradient(150deg,#1f2733,#4a6a8a)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Azul claro', hex: '#7a9ab8' },
      { name: 'Azul oscuro', hex: '#2b3550' }
    ],
    description: 'Chamarra de mezclilla clásica, corte entallado. Un básico que nunca pasa de moda.',
    featured: false
  },
  {
    id: 5,
    name: 'Pantalón Palazzo',
    category: 'mujer',
    price: 690,
    sku: 'DHL-105',
    gradient: 'linear-gradient(150deg,#221f1c,#8a6a3a)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Café', hex: '#4a3826' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Crema', hex: '#f4ecd8' }
    ],
    description: 'Pantalón de pierna ancha y cintura alta, fresco y cómodo para todo el día sin perder elegancia.',
    featured: false
  },
  {
    id: 6,
    name: 'Top Cuello Halter',
    category: 'mujer',
    price: 380,
    sku: 'DHL-106',
    gradient: 'linear-gradient(150deg,#2a1f22,#c1443c)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Terracota', hex: '#c1443c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Top con cuello halter, ideal para una salida de noche o combinado con blazer para la oficina.',
    featured: false
  },
  {
    id: 7,
    name: 'Cárdigan Oversize',
    category: 'mujer',
    price: 640,
    sku: 'DHL-107',
    gradient: 'linear-gradient(150deg,#22201c,#7c8a63)',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Sage', hex: '#7c8a63' },
      { name: 'Crema', hex: '#f4ecd8' },
      { name: 'Café', hex: '#4a3826' }
    ],
    description: 'Cárdigan tejido de corte holgado, perfecto para las mañanas frescas encima de cualquier outfit.',
    featured: false
  },
  {
    id: 8,
    name: 'Jumpsuit Casual',
    category: 'mujer',
    price: 820,
    sku: 'DHL-108',
    gradient: 'linear-gradient(150deg,#211d17,#3f4a3a)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Verde olivo', hex: '#3f4a3a' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Jumpsuit de una pieza, cómodo y práctico. Solo ponte unos aretes y ya estás lista.',
    featured: false
  },
  {
    id: 9,
    name: 'Falda Lápiz',
    category: 'mujer',
    price: 560,
    sku: 'DHL-109',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Gris', hex: '#6b6a63' }
    ],
    description: 'Falda lápiz de corte clásico, ideal para looks de oficina que se pueden vestir o desvestir.',
    featured: false
  },
  {
    id: 10,
    name: 'Blusa de Lino',
    category: 'mujer',
    price: 490,
    sku: 'DHL-110',
    gradient: 'linear-gradient(150deg,#2a251d,#c9b79c)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#c9b79c' },
      { name: 'Blanco hueso', hex: '#f4ecd8' }
    ],
    description: 'Blusa de lino fresca, perfecta para los días calurosos sin perder un aire elegante.',
    featured: false
  },
  {
    id: 11,
    name: 'Vestido Camisero',
    category: 'mujer',
    price: 710,
    sku: 'DHL-111',
    gradient: 'linear-gradient(150deg,#2b3550,#7a9ab8)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Azul claro', hex: '#7a9ab8' },
      { name: 'Blanco hueso', hex: '#f4ecd8' }
    ],
    description: 'Vestido tipo camisero con cinturón, versátil para la oficina o un brunch de fin de semana.',
    featured: false
  },
  {
    id: 12,
    name: 'Leggings Deportivos',
    category: 'mujer',
    price: 430,
    sku: 'DHL-112',
    gradient: 'linear-gradient(150deg,#221f1c,#2b3550)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Azul marino', hex: '#2b3550' }
    ],
    description: 'Leggings de compresión suave, ideales para entrenar o para el diario con una sudadera oversize.',
    featured: false
  },
  {
    id: 13,
    name: 'Camisa Oxford',
    category: 'hombre',
    price: 620,
    sku: 'DHL-201',
    gradient: 'linear-gradient(150deg,#22201c,#3f4a3a)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Azul marino', hex: '#2b3550' },
      { name: 'Blanco', hex: '#f4ecd8' },
      { name: 'Gris', hex: '#6b6a63' }
    ],
    description: 'Camisa de algodón Oxford, corte regular. Perfecta para la oficina o para vestir casual con jeans.',
    featured: true
  },
  {
    id: 14,
    name: 'Pantalón Chino',
    category: 'hombre',
    price: 680,
    sku: 'DHL-202',
    gradient: 'linear-gradient(150deg,#211d17,#4a5240)',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Caqui', hex: '#7c8a63' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Café', hex: '#4a3826' }
    ],
    description: 'Pantalón chino de corte recto, cómodo para todo el día. Fácil de combinar con camisa o playera.',
    featured: false
  },
  {
    id: 15,
    name: 'Playera Básica',
    category: 'hombre',
    price: 320,
    sku: 'DHL-203',
    gradient: 'linear-gradient(150deg,#221f1c,#8a8578)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blanco', hex: '#f4ecd8' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Gris', hex: '#6b6a63' },
      { name: 'Vino', hex: '#7a2f4d' }
    ],
    description: 'Playera de algodón suave, corte recto. El básico que va con todo tu clóset.',
    featured: false
  },
  {
    id: 16,
    name: 'Suéter Tejido',
    category: 'hombre',
    price: 590,
    sku: 'DHL-204',
    gradient: 'linear-gradient(150deg,#231f1a,#4a3826)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Café', hex: '#4a3826' },
      { name: 'Azul marino', hex: '#2b3550' },
      { name: 'Gris', hex: '#6b6a63' }
    ],
    description: 'Suéter de punto grueso, ideal para los días más fríos. Se ve bien solo o encima de una camisa.',
    featured: false
  },
  {
    id: 17,
    name: 'Chamarra Bomber',
    category: 'hombre',
    price: 890,
    sku: 'DHL-205',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Verde olivo', hex: '#3f4a3a' }
    ],
    description: 'Chamarra bomber ligera, con cierre frontal y puños ajustados. Un clásico urbano renovado.',
    featured: false
  },
  {
    id: 18,
    name: 'Bermuda Casual',
    category: 'hombre',
    price: 450,
    sku: 'DHL-206',
    gradient: 'linear-gradient(150deg,#211d17,#7c8a63)',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Caqui', hex: '#7c8a63' },
      { name: 'Azul marino', hex: '#2b3550' },
      { name: 'Gris', hex: '#6b6a63' }
    ],
    description: 'Bermuda de corte relajado, perfecta para los días de calor sin perder un look cuidado.',
    featured: false
  },
  {
    id: 19,
    name: 'Sudadera con Capucha',
    category: 'hombre',
    price: 560,
    sku: 'DHL-207',
    gradient: 'linear-gradient(150deg,#22201c,#6b6a63)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gris', hex: '#6b6a63' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Vino', hex: '#7a2f4d' }
    ],
    description: 'Sudadera con capucha de algodón afelpado, para los días de flojera con estilo.',
    featured: false
  },
  {
    id: 20,
    name: 'Camisa de Lino',
    category: 'hombre',
    price: 640,
    sku: 'DHL-208',
    gradient: 'linear-gradient(150deg,#2a251d,#c9b79c)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#c9b79c' },
      { name: 'Blanco', hex: '#f4ecd8' },
      { name: 'Azul claro', hex: '#7a9ab8' }
    ],
    description: 'Camisa de lino fresca de manga larga, ideal para climas cálidos sin perder formalidad.',
    featured: false
  },
  {
    id: 21,
    name: 'Pantalón de Vestir',
    category: 'hombre',
    price: 760,
    sku: 'DHL-209',
    gradient: 'linear-gradient(150deg,#1c1c1c,#2b3550)',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Azul marino', hex: '#2b3550' }
    ],
    description: 'Pantalón de vestir de corte slim, con tela que no se arruga. Ideal para la oficina o una boda.',
    featured: false
  },
  {
    id: 22,
    name: 'Playera Polo',
    category: 'hombre',
    price: 480,
    sku: 'DHL-210',
    gradient: 'linear-gradient(150deg,#221f1c,#3f4a3a)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Verde olivo', hex: '#3f4a3a' },
      { name: 'Blanco', hex: '#f4ecd8' },
      { name: 'Vino', hex: '#7a2f4d' }
    ],
    description: 'Playera polo de piqué, corte clásico. El punto medio entre casual y formal.',
    featured: false
  },
  {
    id: 23,
    name: 'Chaleco Acolchado',
    category: 'hombre',
    price: 720,
    sku: 'DHL-211',
    gradient: 'linear-gradient(150deg,#211d17,#c1443c)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Terracota', hex: '#c1443c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Chaleco acolchado sin mangas, ligero y abrigador. Perfecto para las temporadas de entretiempo.',
    featured: false
  },
  {
    id: 24,
    name: 'Pants Jogger',
    category: 'hombre',
    price: 540,
    sku: 'DHL-212',
    gradient: 'linear-gradient(150deg,#22201c,#6b6a63)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Gris', hex: '#6b6a63' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Azul marino', hex: '#2b3550' }
    ],
    description: 'Pants tipo jogger con puño ajustado, cómodo para el día a día o para entrenar.',
    featured: false
  },
  {
    id: 25,
    name: 'Cinturón de Piel',
    category: 'accesorios',
    price: 390,
    sku: 'DHL-301',
    gradient: 'linear-gradient(150deg,#2a251d,#8a6a3a)',
    sizes: ['Único'],
    colors: [
      { name: 'Café', hex: '#4a3826' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Cinturón de piel genuina con hebilla metálica. Un básico que combina con todo tu clóset.',
    featured: false
  },
  {
    id: 26,
    name: 'Gorra Bordada',
    category: 'accesorios',
    price: 290,
    sku: 'DHL-302',
    gradient: 'linear-gradient(150deg,#231f2b,#6c5ce0)',
    sizes: ['Único'],
    colors: [
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Beige', hex: '#c9b79c' }
    ],
    description: 'Gorra con bordado Dahlia, ajuste trasero. Ideal para completar cualquier outfit casual.',
    featured: true
  },
  {
    id: 27,
    name: 'Bufanda de Punto',
    category: 'accesorios',
    price: 340,
    sku: 'DHL-303',
    gradient: 'linear-gradient(150deg,#2a251d,#c1443c)',
    sizes: ['Único'],
    colors: [
      { name: 'Terracota', hex: '#c1443c' },
      { name: 'Beige', hex: '#c9b79c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Bufanda tejida, suave y abrigadora. El accesorio que le da personalidad a cualquier outfit de invierno.',
    featured: false
  },
  {
    id: 28,
    name: 'Lentes de Sol',
    category: 'accesorios',
    price: 450,
    sku: 'DHL-304',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: ['Único'],
    colors: [
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Café', hex: '#4a3826' }
    ],
    description: 'Lentes de sol con protección UV y armazón resistente. El toque final para tu look del día.',
    featured: false
  },
  {
    id: 29,
    name: 'Mochila Urbana',
    category: 'accesorios',
    price: 680,
    sku: 'DHL-305',
    gradient: 'linear-gradient(150deg,#211d17,#4a5240)',
    sizes: ['Único'],
    colors: [
      { name: 'Verde olivo', hex: '#3f4a3a' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Mochila resistente al agua con compartimento para laptop. Práctica para el diario o para viajar.',
    featured: false
  },
  {
    id: 30,
    name: 'Cartera de Piel',
    category: 'accesorios',
    price: 420,
    sku: 'DHL-306',
    gradient: 'linear-gradient(150deg,#2a251d,#4a3826)',
    sizes: ['Único'],
    colors: [
      { name: 'Café', hex: '#4a3826' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Cartera de piel genuina con varios compartimentos. Sencilla, resistente y minimalista.',
    featured: false
  },
  {
    id: 31,
    name: 'Reloj Minimalista',
    category: 'accesorios',
    price: 890,
    sku: 'DHL-307',
    gradient: 'linear-gradient(150deg,#1c1c1c,#e3b23c)',
    sizes: ['Único'],
    colors: [
      { name: 'Dorado', hex: '#e3b23c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Reloj de carátula limpia y correa delgada. Combina con looks formales y casuales por igual.',
    featured: false
  },
  {
    id: 32,
    name: 'Paliacate Estampado',
    category: 'accesorios',
    price: 190,
    sku: 'DHL-308',
    gradient: 'linear-gradient(150deg,#2a1f22,#d9769b)',
    sizes: ['Único'],
    colors: [
      { name: 'Rosa dalia', hex: '#d9769b' },
      { name: 'Terracota', hex: '#c1443c' }
    ],
    description: 'Paliacate de algodón con estampado propio. Úsalo en el cuello, la muñeca o la mochila.',
    featured: false
  },
  {
    id: 33,
    name: 'Calcetines Pack x3',
    category: 'accesorios',
    price: 220,
    sku: 'DHL-309',
    gradient: 'linear-gradient(150deg,#221f1c,#6b6a63)',
    sizes: ['Único'],
    colors: [
      { name: 'Gris', hex: '#6b6a63' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Blanco', hex: '#f4ecd8' }
    ],
    description: 'Pack de 3 pares de calcetines de algodón. Cómodos, duraderos y básicos que siempre faltan.',
    featured: false
  },
  {
    id: 34,
    name: 'Guantes de Punto',
    category: 'accesorios',
    price: 260,
    sku: 'DHL-310',
    gradient: 'linear-gradient(150deg,#211d17,#4a3826)',
    sizes: ['Único'],
    colors: [
      { name: 'Café', hex: '#4a3826' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Beige', hex: '#c9b79c' }
    ],
    description: 'Guantes tejidos, calientitos para el invierno sin perder estilo.',
    featured: false
  },
  {
    id: 35,
    name: 'Pulsera Artesanal',
    category: 'accesorios',
    price: 180,
    sku: 'DHL-311',
    gradient: 'linear-gradient(150deg,#2a251d,#e3b23c)',
    sizes: ['Único'],
    colors: [
      { name: 'Dorado', hex: '#e3b23c' },
      { name: 'Café', hex: '#4a3826' }
    ],
    description: 'Pulsera hecha a mano por artesanos locales. Cada pieza es ligeramente distinta.',
    featured: false
  },
  {
    id: 36,
    name: 'Sombrero de Palma',
    category: 'accesorios',
    price: 480,
    sku: 'DHL-312',
    gradient: 'linear-gradient(150deg,#2a251d,#c9b79c)',
    sizes: ['Único'],
    colors: [
      { name: 'Beige', hex: '#c9b79c' },
      { name: 'Café', hex: '#4a3826' }
    ],
    description: 'Sombrero de palma tejido a mano, ligero y fresco para los días de sol.',
    featured: false
  },
  {
    id: 37,
    name: 'Chamarra Acolchada',
    category: 'novedades',
    price: 990,
    sku: 'DHL-401',
    gradient: 'linear-gradient(150deg,#2a251d,#c1443c)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Terracota', hex: '#c1443c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Chamarra ligera acolchada, perfecta para los días de otoño. Nueva colección, edición limitada.',
    featured: true
  },
  {
    id: 38,
    name: 'Suéter Cuello Alto',
    category: 'novedades',
    price: 590,
    sku: 'DHL-402',
    gradient: 'linear-gradient(150deg,#22201c,#7c8a63)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sage', hex: '#7c8a63' },
      { name: 'Crema', hex: '#f4ecd8' },
      { name: 'Vino', hex: '#7a2f4d' }
    ],
    description: 'Suéter de punto suave con cuello alto. Se ve bien solo o en capas con una chamarra.',
    featured: false
  },
  {
    id: 39,
    name: 'Falda Cargo',
    category: 'novedades',
    price: 690,
    sku: 'DHL-403',
    gradient: 'linear-gradient(150deg,#211d17,#7c8a63)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Caqui', hex: '#7c8a63' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Falda cargo con bolsas laterales, mezcla lo funcional con lo urbano. Parte de la colección nueva.',
    featured: false
  },
  {
    id: 40,
    name: 'Vestido de Punto',
    category: 'novedades',
    price: 760,
    sku: 'DHL-404',
    gradient: 'linear-gradient(150deg,#2a1f22,#d9769b)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Rosa dalia', hex: '#d9769b' },
      { name: 'Crema', hex: '#f4ecd8' }
    ],
    description: 'Vestido de punto entallado, cómodo y abrigador sin perder silueta. Recién llegado a la colección.',
    featured: false
  },
  {
    id: 41,
    name: 'Abrigo Largo',
    category: 'novedades',
    price: 1290,
    sku: 'DHL-405',
    gradient: 'linear-gradient(150deg,#1c1c1c,#4a3826)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Café', hex: '#4a3826' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Beige', hex: '#c9b79c' }
    ],
    description: 'Abrigo largo de corte recto, la pieza estrella de la temporada de frío. Edición limitada.',
    featured: true
  },
  {
    id: 42,
    name: 'Blazer Estructurado',
    category: 'novedades',
    price: 940,
    sku: 'DHL-406',
    gradient: 'linear-gradient(150deg,#211d17,#2b3550)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Azul marino', hex: '#2b3550' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Blazer de hombros estructurados, entalla sin apretar. Sube de nivel cualquier outfit casual.',
    featured: false
  },
  {
    id: 43,
    name: 'Conjunto Deportivo',
    category: 'novedades',
    price: 780,
    sku: 'DHL-407',
    gradient: 'linear-gradient(150deg,#221f1c,#6c5ce0)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Morado', hex: '#6c5ce0' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Gris', hex: '#6b6a63' }
    ],
    description: 'Conjunto de sudadera y pants a juego, cómodo pero con estilo. Recién llegado.',
    featured: false
  },
  {
    id: 44,
    name: 'Vestido Satinado',
    category: 'novedades',
    price: 890,
    sku: 'DHL-408',
    gradient: 'linear-gradient(150deg,#2a1f22,#e3b23c)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Dorado', hex: '#e3b23c' },
      { name: 'Negro', hex: '#231f1a' },
      { name: 'Vino', hex: '#7a2f4d' }
    ],
    description: 'Vestido satinado de caída elegante, perfecto para una fiesta o cena especial.',
    featured: false
  },
  {
    id: 45,
    name: 'Chamarra Vinil',
    category: 'novedades',
    price: 1050,
    sku: 'DHL-409',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Chamarra de vinil con brillo sutil, la pieza statement de la colección nueva.',
    featured: false
  },
  {
    id: 46,
    name: 'Pantalón Wide Leg',
    category: 'novedades',
    price: 710,
    sku: 'DHL-410',
    gradient: 'linear-gradient(150deg,#211d17,#c9b79c)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#c9b79c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Pantalón de pierna ancha con caída fluida, la silueta que está dominando esta temporada.',
    featured: false
  },
  {
    id: 47,
    name: 'Top Corset',
    category: 'novedades',
    price: 460,
    sku: 'DHL-411',
    gradient: 'linear-gradient(150deg,#2a1f22,#c1443c)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Terracota', hex: '#c1443c' },
      { name: 'Negro', hex: '#231f1a' }
    ],
    description: 'Top estilo corset con costuras estructuradas, para un look de noche con actitud.',
    featured: false
  },
  {
    id: 48,
    name: 'Gabardina Oversize',
    category: 'novedades',
    price: 980,
    sku: 'DHL-412',
    gradient: 'linear-gradient(150deg,#211d17,#c9b79c)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#c9b79c' },
      { name: 'Café', hex: '#4a3826' }
    ],
    description: 'Gabardina de corte oversize, versátil entre estaciones. Nueva colección, piezas limitadas.',
    featured: false
  }
];