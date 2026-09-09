// Catálogo de productos simulado (sin backend ni base de datos real).
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
  }
];