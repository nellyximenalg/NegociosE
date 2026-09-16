

const PRODUCTS = [
  {
    id: 1,
    name: 'Vestido Midi Fluido',
    category: 'mujer',
    price: 790,
    sku: 'DHL-101',
    gradient: 'linear-gradient(150deg,#3a222c,#d9769b)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '97 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '98 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '99 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '101 cm' } }
    ],
    colors: [
      { name: 'Rosa dalia', hex: '#d9769b', images: ['img/productos/dhl-101-rosa-dalia-1.jpg', 'img/productos/dhl-101-rosa-dalia-2.jpg', 'img/productos/dhl-101-rosa-dalia-3.jpg'], note: 'nuestro tono insignia: vibrante, femenino y muy Dahlia.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-101-negro-1.jpg', 'img/productos/dhl-101-negro-2.jpg', 'img/productos/dhl-101-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-101-beige-1.jpg', 'img/productos/dhl-101-beige-2.jpg', 'img/productos/dhl-101-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' }
    ],
    description: 'Vestido midi de caída suave, ideal para el trabajo o una cena. Tela ligera que no se pega y no se arruga fácil.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: true
  },
  {
    id: 2,
    name: 'Blusa Satinada',
    category: 'mujer',
    price: 520,
    sku: 'DHL-102',
    gradient: 'linear-gradient(150deg,#2a251d,#e3b23c)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '67 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } }
    ],
    colors: [
      { name: 'Dorado', hex: '#e3b23c', images: ['img/productos/dhl-102-dorado-1.jpg', 'img/productos/dhl-102-dorado-2.jpg', 'img/productos/dhl-102-dorado-3.jpg'], note: 'un tono llamativo pensado para destacar.' },
      { name: 'Blanco hueso', hex: '#f4ecd8', images: ['img/productos/dhl-102-blanco-hueso-1.jpg', 'img/productos/dhl-102-blanco-hueso-2.jpg', 'img/productos/dhl-102-blanco-hueso-3.jpg'], note: 'un tono suave y elegante, ideal para looks de oficina.' },
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-102-vino-1.jpg', 'img/productos/dhl-102-vino-2.jpg', 'img/productos/dhl-102-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' }
    ],
    description: 'Blusa con caída satinada y cuello sencillo. Combina con jeans o falda para looks de día o de noche.',
    details: {
      tela: 'Satén ligero con caída fluida',
      cuidado: 'Lavado en seco recomendado, o ciclo delicado en bolsa de malla y agua fría.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 3,
    name: 'Falda Plisada',
    category: 'mujer',
    price: 610,
    sku: 'DHL-103',
    gradient: 'linear-gradient(150deg,#2a1f22,#7a2f4d)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '51 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '52 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '53 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '55 cm' } }
    ],
    colors: [
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-103-vino-1.jpg', 'img/productos/dhl-103-vino-2.jpg', 'img/productos/dhl-103-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-103-negro-1.jpg', 'img/productos/dhl-103-negro-2.jpg', 'img/productos/dhl-103-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-103-beige-1.jpg', 'img/productos/dhl-103-beige-2.jpg', 'img/productos/dhl-103-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' }
    ],
    description: 'Falda plisada a media pierna, con caída con movimiento. Ideal para combinar con blusa o suéter.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 4,
    name: 'Chamarra de Mezclilla',
    category: 'mujer',
    price: 850,
    sku: 'DHL-104',
    gradient: 'linear-gradient(150deg,#1f2733,#4a6a8a)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '61 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '62 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '63 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '65 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '67 cm' } }
    ],
    colors: [
      { name: 'Azul claro', hex: '#7a9ab8', images: ['img/productos/dhl-104-azul-claro-1.jpg', 'img/productos/dhl-104-azul-claro-2.jpg', 'img/productos/dhl-104-azul-claro-3.jpg'], note: 'un tono fresco, ideal para el clima cálido.' },
      { name: 'Azul oscuro', hex: '#2b3550', images: ['img/productos/dhl-104-azul-oscuro-1.jpg', 'img/productos/dhl-104-azul-oscuro-2.jpg', 'img/productos/dhl-104-azul-oscuro-3.jpg'], note: 'un tono profundo con mucho carácter.' }
    ],
    description: 'Chamarra de mezclilla clásica, corte entallado. Un básico que nunca pasa de moda.',
    details: {
      tela: 'Mezclilla de algodón resistente',
      cuidado: 'Lavar del revés en agua fría, separado de otras prendas. Evitar secadora para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 5,
    name: 'Pantalón Palazzo',
    category: 'mujer',
    price: 690,
    sku: 'DHL-105',
    gradient: 'linear-gradient(150deg,#221f1c,#8a6a3a)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '103 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '104 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '105 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '107 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '109 cm' } }
    ],
    colors: [
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-105-cafe-1.jpg', 'img/productos/dhl-105-cafe-2.jpg', 'img/productos/dhl-105-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-105-negro-1.jpg', 'img/productos/dhl-105-negro-2.jpg', 'img/productos/dhl-105-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Crema', hex: '#f4ecd8', images: ['img/productos/dhl-105-crema-1.jpg', 'img/productos/dhl-105-crema-2.jpg', 'img/productos/dhl-105-crema-3.jpg'], note: 'un tono cálido que suaviza cualquier combinación.' }
    ],
    description: 'Pantalón de pierna ancha y cintura alta, fresco y cómodo para todo el día sin perder elegancia.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 6,
    name: 'Top Cuello Halter',
    category: 'mujer',
    price: 380,
    sku: 'DHL-106',
    gradient: 'linear-gradient(150deg,#2a1f22,#c1443c)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '43 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '44 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '45 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '47 cm' } }
    ],
    colors: [
      { name: 'Terracota', hex: '#c1443c', images: ['img/productos/dhl-106-terracota-1.jpg', 'img/productos/dhl-106-terracota-2.jpg', 'img/productos/dhl-106-terracota-3.jpg'], note: 'un tono cálido, ideal para la temporada de otoño.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-106-negro-1.jpg', 'img/productos/dhl-106-negro-2.jpg', 'img/productos/dhl-106-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Top con cuello halter, ideal para una salida de noche o combinado con blazer para la oficina.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 7,
    name: 'Cárdigan Oversize',
    category: 'mujer',
    price: 640,
    sku: 'DHL-107',
    gradient: 'linear-gradient(150deg,#22201c,#7c8a63)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } }
    ],
    colors: [
      { name: 'Sage', hex: '#7c8a63', images: ['img/productos/dhl-107-sage-1.jpg', 'img/productos/dhl-107-sage-2.jpg', 'img/productos/dhl-107-sage-3.jpg'], note: 'un verde suave inspirado en la naturaleza.' },
      { name: 'Crema', hex: '#f4ecd8', images: ['img/productos/dhl-107-crema-1.jpg', 'img/productos/dhl-107-crema-2.jpg', 'img/productos/dhl-107-crema-3.jpg'], note: 'un tono cálido que suaviza cualquier combinación.' },
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-107-cafe-1.jpg', 'img/productos/dhl-107-cafe-2.jpg', 'img/productos/dhl-107-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' }
    ],
    description: 'Cárdigan tejido de corte holgado, perfecto para las mañanas frescas encima de cualquier outfit.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 8,
    name: 'Jumpsuit Casual',
    category: 'mujer',
    price: 820,
    sku: 'DHL-108',
    gradient: 'linear-gradient(150deg,#211d17,#3f4a3a)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '67 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } }
    ],
    colors: [
      { name: 'Verde olivo', hex: '#3f4a3a', images: ['img/productos/dhl-108-verde-olivo-1.jpg', 'img/productos/dhl-108-verde-olivo-2.jpg', 'img/productos/dhl-108-verde-olivo-3.jpg'], note: 'un tono terroso muy fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-108-negro-1.jpg', 'img/productos/dhl-108-negro-2.jpg', 'img/productos/dhl-108-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Jumpsuit de una pieza, cómodo y práctico. Solo ponte unos aretes y ya estás lista.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 9,
    name: 'Falda Lápiz',
    category: 'mujer',
    price: 560,
    sku: 'DHL-109',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '51 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '52 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '53 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '55 cm' } }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-109-negro-1.jpg', 'img/productos/dhl-109-negro-2.jpg', 'img/productos/dhl-109-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-109-gris-1.jpg', 'img/productos/dhl-109-gris-2.jpg', 'img/productos/dhl-109-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' }
    ],
    description: 'Falda lápiz de corte clásico, ideal para looks de oficina que se pueden vestir o desvestir.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 10,
    name: 'Blusa de Lino',
    category: 'mujer',
    price: 490,
    sku: 'DHL-110',
    gradient: 'linear-gradient(150deg,#2a251d,#c9b79c)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '67 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } }
    ],
    colors: [
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-110-beige-1.jpg', 'img/productos/dhl-110-beige-2.jpg', 'img/productos/dhl-110-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' },
      { name: 'Blanco hueso', hex: '#f4ecd8', images: ['img/productos/dhl-110-blanco-hueso-1.jpg', 'img/productos/dhl-110-blanco-hueso-2.jpg', 'img/productos/dhl-110-blanco-hueso-3.jpg'], note: 'un tono suave y elegante, ideal para looks de oficina.' }
    ],
    description: 'Blusa de lino fresca, perfecta para los días calurosos sin perder un aire elegante.',
    details: {
      tela: 'Lino 100% transpirable',
      cuidado: 'Lavado a mano o ciclo delicado en agua fría. Planchar tibio mientras la prenda esté ligeramente húmeda.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 11,
    name: 'Vestido Camisero',
    category: 'mujer',
    price: 710,
    sku: 'DHL-111',
    gradient: 'linear-gradient(150deg,#2b3550,#7a9ab8)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '97 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '98 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '99 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '101 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '103 cm' } }
    ],
    colors: [
      { name: 'Azul claro', hex: '#7a9ab8', images: ['img/productos/dhl-111-azul-claro-1.jpg', 'img/productos/dhl-111-azul-claro-2.jpg', 'img/productos/dhl-111-azul-claro-3.jpg'], note: 'un tono fresco, ideal para el clima cálido.' },
      { name: 'Blanco hueso', hex: '#f4ecd8', images: ['img/productos/dhl-111-blanco-hueso-1.jpg', 'img/productos/dhl-111-blanco-hueso-2.jpg', 'img/productos/dhl-111-blanco-hueso-3.jpg'], note: 'un tono suave y elegante, ideal para looks de oficina.' }
    ],
    description: 'Vestido tipo camisero con cinturón, versátil para la oficina o un brunch de fin de semana.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 12,
    name: 'Leggings Deportivos',
    category: 'mujer',
    price: 430,
    sku: 'DHL-112',
    gradient: 'linear-gradient(150deg,#221f1c,#2b3550)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '67 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-112-negro-1.jpg', 'img/productos/dhl-112-negro-2.jpg', 'img/productos/dhl-112-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-112-azul-marino-1.jpg', 'img/productos/dhl-112-azul-marino-2.jpg', 'img/productos/dhl-112-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' }
    ],
    description: 'Leggings de compresión suave, ideales para entrenar o para el diario con una sudadera oversize.',
    details: {
      tela: 'Algodón afelpado (french terry)',
      cuidado: 'Lavado a máquina en agua fría, secado a baja temperatura para conservar la felpa interior.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 13,
    name: 'Camisa Oxford',
    category: 'hombre',
    price: 620,
    sku: 'DHL-201',
    gradient: 'linear-gradient(150deg,#22201c,#3f4a3a)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } },
      { label: 'XXL', measurements: { 'Busto/Pecho': '105 cm', 'Cintura': '85 cm', 'Cadera': '111 cm', 'Largo': '75 cm' } }
    ],
    colors: [
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-201-azul-marino-1.jpg', 'img/productos/dhl-201-azul-marino-2.jpg', 'img/productos/dhl-201-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' },
      { name: 'Blanco', hex: '#f4ecd8', images: ['img/productos/dhl-201-blanco-1.jpg', 'img/productos/dhl-201-blanco-2.jpg', 'img/productos/dhl-201-blanco-3.jpg'], note: 'un tono limpio y fresco, perfecto para el día a día.' },
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-201-gris-1.jpg', 'img/productos/dhl-201-gris-2.jpg', 'img/productos/dhl-201-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' }
    ],
    description: 'Camisa de algodón Oxford, corte regular. Perfecta para la oficina o para vestir casual con jeans.',
    details: {
      tela: 'Algodón Oxford',
      cuidado: 'Lavado a máquina en agua fría, secar a la sombra y planchar tibio si es necesario.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: true
  },
  {
    id: 14,
    name: 'Pantalón Chino',
    category: 'hombre',
    price: 680,
    sku: 'DHL-202',
    gradient: 'linear-gradient(150deg,#211d17,#4a5240)',
    sizes: [
      { label: '28', measurements: { 'Cintura': '71 cm', 'Cadera': '85 cm', 'Largo de pierna': '104 cm' } },
      { label: '30', measurements: { 'Cintura': '76 cm', 'Cadera': '90 cm', 'Largo de pierna': '104 cm' } },
      { label: '32', measurements: { 'Cintura': '81 cm', 'Cadera': '95 cm', 'Largo de pierna': '104 cm' } },
      { label: '34', measurements: { 'Cintura': '86 cm', 'Cadera': '100 cm', 'Largo de pierna': '104 cm' } },
      { label: '36', measurements: { 'Cintura': '91 cm', 'Cadera': '105 cm', 'Largo de pierna': '104 cm' } }
    ],
    colors: [
      { name: 'Caqui', hex: '#7c8a63', images: ['img/productos/dhl-202-caqui-1.jpg', 'img/productos/dhl-202-caqui-2.jpg', 'img/productos/dhl-202-caqui-3.jpg'], note: 'un neutro con un toque casual y urbano.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-202-negro-1.jpg', 'img/productos/dhl-202-negro-2.jpg', 'img/productos/dhl-202-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-202-cafe-1.jpg', 'img/productos/dhl-202-cafe-2.jpg', 'img/productos/dhl-202-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' }
    ],
    description: 'Pantalón chino de corte recto, cómodo para todo el día. Fácil de combinar con camisa o playera.',
    details: {
      tela: 'Algodón chino con un toque de elastano',
      cuidado: 'Lavado a máquina en agua fría, secar a la sombra y planchar tibio si es necesario.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 15,
    name: 'Playera Básica',
    category: 'hombre',
    price: 320,
    sku: 'DHL-203',
    gradient: 'linear-gradient(150deg,#221f1c,#8a8578)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } },
      { label: 'XXL', measurements: { 'Busto/Pecho': '105 cm', 'Cintura': '85 cm', 'Cadera': '111 cm', 'Largo': '75 cm' } }
    ],
    colors: [
      { name: 'Blanco', hex: '#f4ecd8', images: ['img/productos/dhl-203-blanco-1.jpg', 'img/productos/dhl-203-blanco-2.jpg', 'img/productos/dhl-203-blanco-3.jpg'], note: 'un tono limpio y fresco, perfecto para el día a día.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-203-negro-1.jpg', 'img/productos/dhl-203-negro-2.jpg', 'img/productos/dhl-203-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-203-gris-1.jpg', 'img/productos/dhl-203-gris-2.jpg', 'img/productos/dhl-203-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' },
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-203-vino-1.jpg', 'img/productos/dhl-203-vino-2.jpg', 'img/productos/dhl-203-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' }
    ],
    description: 'Playera de algodón suave, corte recto. El básico que va con todo tu clóset.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 16,
    name: 'Suéter Tejido',
    category: 'hombre',
    price: 590,
    sku: 'DHL-204',
    gradient: 'linear-gradient(150deg,#231f1a,#4a3826)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '64 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '65 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '67 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '69 cm' } }
    ],
    colors: [
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-204-cafe-1.jpg', 'img/productos/dhl-204-cafe-2.jpg', 'img/productos/dhl-204-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' },
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-204-azul-marino-1.jpg', 'img/productos/dhl-204-azul-marino-2.jpg', 'img/productos/dhl-204-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' },
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-204-gris-1.jpg', 'img/productos/dhl-204-gris-2.jpg', 'img/productos/dhl-204-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' }
    ],
    description: 'Suéter de punto grueso, ideal para los días más fríos. Se ve bien solo o encima de una camisa.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 17,
    name: 'Chamarra Bomber',
    category: 'hombre',
    price: 890,
    sku: 'DHL-205',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '62 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '63 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '65 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '67 cm' } }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-205-negro-1.jpg', 'img/productos/dhl-205-negro-2.jpg', 'img/productos/dhl-205-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Verde olivo', hex: '#3f4a3a', images: ['img/productos/dhl-205-verde-olivo-1.jpg', 'img/productos/dhl-205-verde-olivo-2.jpg', 'img/productos/dhl-205-verde-olivo-3.jpg'], note: 'un tono terroso muy fácil de combinar.' }
    ],
    description: 'Chamarra bomber ligera, con cierre frontal y puños ajustados. Un clásico urbano renovado.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 18,
    name: 'Bermuda Casual',
    category: 'hombre',
    price: 450,
    sku: 'DHL-206',
    gradient: 'linear-gradient(150deg,#211d17,#7c8a63)',
    sizes: [
      { label: '30', measurements: { 'Cintura': '76 cm', 'Cadera': '90 cm', 'Largo de pierna': '48 cm' } },
      { label: '32', measurements: { 'Cintura': '81 cm', 'Cadera': '95 cm', 'Largo de pierna': '48 cm' } },
      { label: '34', measurements: { 'Cintura': '86 cm', 'Cadera': '100 cm', 'Largo de pierna': '48 cm' } },
      { label: '36', measurements: { 'Cintura': '91 cm', 'Cadera': '105 cm', 'Largo de pierna': '48 cm' } },
      { label: '38', measurements: { 'Cintura': '97 cm', 'Cadera': '111 cm', 'Largo de pierna': '48 cm' } }
    ],
    colors: [
      { name: 'Caqui', hex: '#7c8a63', images: ['img/productos/dhl-206-caqui-1.jpg', 'img/productos/dhl-206-caqui-2.jpg', 'img/productos/dhl-206-caqui-3.jpg'], note: 'un neutro con un toque casual y urbano.' },
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-206-azul-marino-1.jpg', 'img/productos/dhl-206-azul-marino-2.jpg', 'img/productos/dhl-206-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' },
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-206-gris-1.jpg', 'img/productos/dhl-206-gris-2.jpg', 'img/productos/dhl-206-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' }
    ],
    description: 'Bermuda de corte relajado, perfecta para los días de calor sin perder un look cuidado.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 19,
    name: 'Sudadera con Capucha',
    category: 'hombre',
    price: 560,
    sku: 'DHL-207',
    gradient: 'linear-gradient(150deg,#22201c,#6b6a63)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '66 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '67 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '69 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '71 cm' } },
      { label: 'XXL', measurements: { 'Busto/Pecho': '105 cm', 'Cintura': '85 cm', 'Cadera': '111 cm', 'Largo': '73 cm' } }
    ],
    colors: [
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-207-gris-1.jpg', 'img/productos/dhl-207-gris-2.jpg', 'img/productos/dhl-207-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-207-negro-1.jpg', 'img/productos/dhl-207-negro-2.jpg', 'img/productos/dhl-207-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-207-vino-1.jpg', 'img/productos/dhl-207-vino-2.jpg', 'img/productos/dhl-207-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' }
    ],
    description: 'Sudadera con capucha de algodón afelpado, para los días de flojera con estilo.',
    details: {
      tela: 'Algodón afelpado (french terry)',
      cuidado: 'Lavado a máquina en agua fría, secado a baja temperatura para conservar la felpa interior.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 20,
    name: 'Camisa de Lino',
    category: 'hombre',
    price: 640,
    sku: 'DHL-208',
    gradient: 'linear-gradient(150deg,#2a251d,#c9b79c)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } }
    ],
    colors: [
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-208-beige-1.jpg', 'img/productos/dhl-208-beige-2.jpg', 'img/productos/dhl-208-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' },
      { name: 'Blanco', hex: '#f4ecd8', images: ['img/productos/dhl-208-blanco-1.jpg', 'img/productos/dhl-208-blanco-2.jpg', 'img/productos/dhl-208-blanco-3.jpg'], note: 'un tono limpio y fresco, perfecto para el día a día.' },
      { name: 'Azul claro', hex: '#7a9ab8', images: ['img/productos/dhl-208-azul-claro-1.jpg', 'img/productos/dhl-208-azul-claro-2.jpg', 'img/productos/dhl-208-azul-claro-3.jpg'], note: 'un tono fresco, ideal para el clima cálido.' }
    ],
    description: 'Camisa de lino fresca de manga larga, ideal para climas cálidos sin perder formalidad.',
    details: {
      tela: 'Lino 100% transpirable',
      cuidado: 'Lavado a mano o ciclo delicado en agua fría. Planchar tibio mientras la prenda esté ligeramente húmeda.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 21,
    name: 'Pantalón de Vestir',
    category: 'hombre',
    price: 760,
    sku: 'DHL-209',
    gradient: 'linear-gradient(150deg,#1c1c1c,#2b3550)',
    sizes: [
      { label: '28', measurements: { 'Cintura': '71 cm', 'Cadera': '85 cm', 'Largo de pierna': '104 cm' } },
      { label: '30', measurements: { 'Cintura': '76 cm', 'Cadera': '90 cm', 'Largo de pierna': '104 cm' } },
      { label: '32', measurements: { 'Cintura': '81 cm', 'Cadera': '95 cm', 'Largo de pierna': '104 cm' } },
      { label: '34', measurements: { 'Cintura': '86 cm', 'Cadera': '100 cm', 'Largo de pierna': '104 cm' } },
      { label: '36', measurements: { 'Cintura': '91 cm', 'Cadera': '105 cm', 'Largo de pierna': '104 cm' } }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-209-negro-1.jpg', 'img/productos/dhl-209-negro-2.jpg', 'img/productos/dhl-209-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-209-azul-marino-1.jpg', 'img/productos/dhl-209-azul-marino-2.jpg', 'img/productos/dhl-209-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' }
    ],
    description: 'Pantalón de vestir de corte slim, con tela que no se arruga. Ideal para la oficina o una boda.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 22,
    name: 'Playera Polo',
    category: 'hombre',
    price: 480,
    sku: 'DHL-210',
    gradient: 'linear-gradient(150deg,#221f1c,#3f4a3a)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '68 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '69 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '71 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '73 cm' } },
      { label: 'XXL', measurements: { 'Busto/Pecho': '105 cm', 'Cintura': '85 cm', 'Cadera': '111 cm', 'Largo': '75 cm' } }
    ],
    colors: [
      { name: 'Verde olivo', hex: '#3f4a3a', images: ['img/productos/dhl-210-verde-olivo-1.jpg', 'img/productos/dhl-210-verde-olivo-2.jpg', 'img/productos/dhl-210-verde-olivo-3.jpg'], note: 'un tono terroso muy fácil de combinar.' },
      { name: 'Blanco', hex: '#f4ecd8', images: ['img/productos/dhl-210-blanco-1.jpg', 'img/productos/dhl-210-blanco-2.jpg', 'img/productos/dhl-210-blanco-3.jpg'], note: 'un tono limpio y fresco, perfecto para el día a día.' },
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-210-vino-1.jpg', 'img/productos/dhl-210-vino-2.jpg', 'img/productos/dhl-210-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' }
    ],
    description: 'Playera polo de piqué, corte clásico. El punto medio entre casual y formal.',
    details: {
      tela: 'Piqué de algodón',
      cuidado: 'Lavado a máquina en agua fría, secar a la sombra y planchar tibio si es necesario.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 23,
    name: 'Chaleco Acolchado',
    category: 'hombre',
    price: 720,
    sku: 'DHL-211',
    gradient: 'linear-gradient(150deg,#211d17,#c1443c)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '62 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '63 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '65 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '67 cm' } }
    ],
    colors: [
      { name: 'Terracota', hex: '#c1443c', images: ['img/productos/dhl-211-terracota-1.jpg', 'img/productos/dhl-211-terracota-2.jpg', 'img/productos/dhl-211-terracota-3.jpg'], note: 'un tono cálido, ideal para la temporada de otoño.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-211-negro-1.jpg', 'img/productos/dhl-211-negro-2.jpg', 'img/productos/dhl-211-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Chaleco acolchado sin mangas, ligero y abrigador. Perfecto para las temporadas de entretiempo.',
    details: {
      tela: 'Exterior acolchado con relleno térmico',
      cuidado: 'Lavado a máquina en ciclo suave, agua fría. No planchar directamente sobre el relleno.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 24,
    name: 'Pants Jogger',
    category: 'hombre',
    price: 540,
    sku: 'DHL-212',
    gradient: 'linear-gradient(150deg,#22201c,#6b6a63)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '104 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '105 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '107 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '109 cm' } }
    ],
    colors: [
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-212-gris-1.jpg', 'img/productos/dhl-212-gris-2.jpg', 'img/productos/dhl-212-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-212-negro-1.jpg', 'img/productos/dhl-212-negro-2.jpg', 'img/productos/dhl-212-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-212-azul-marino-1.jpg', 'img/productos/dhl-212-azul-marino-2.jpg', 'img/productos/dhl-212-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' }
    ],
    description: 'Pants tipo jogger con puño ajustado, cómodo para el día a día o para entrenar.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 25,
    name: 'Cinturón de Piel',
    category: 'accesorios',
    price: 390,
    sku: 'DHL-301',
    gradient: 'linear-gradient(150deg,#2a251d,#8a6a3a)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-301-cafe-1.jpg', 'img/productos/dhl-301-cafe-2.jpg', 'img/productos/dhl-301-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-301-negro-1.jpg', 'img/productos/dhl-301-negro-2.jpg', 'img/productos/dhl-301-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Cinturón de piel genuina con hebilla metálica. Un básico que combina con todo tu clóset.',
    details: {
      tela: 'Piel genuina',
      cuidado: 'Limpiar con paño húmedo y dejar secar a la sombra. No sumergir en agua ni exponer al sol directo por tiempo prolongado.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Largo ajustable de 90 a 120 cm, ancho de 3.5 cm.'
    },
    featured: false
  },
  {
    id: 26,
    name: 'Gorra Bordada',
    category: 'accesorios',
    price: 290,
    sku: 'DHL-302',
    gradient: 'linear-gradient(150deg,#231f2b,#6c5ce0)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-302-negro-1.jpg', 'img/productos/dhl-302-negro-2.jpg', 'img/productos/dhl-302-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-302-beige-1.jpg', 'img/productos/dhl-302-beige-2.jpg', 'img/productos/dhl-302-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' }
    ],
    description: 'Gorra con bordado Dahlia, ajuste trasero. Ideal para completar cualquier outfit casual.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Contorno ajustable de 54 a 60 cm.'
    },
    featured: true
  },
  {
    id: 27,
    name: 'Bufanda de Punto',
    category: 'accesorios',
    price: 340,
    sku: 'DHL-303',
    gradient: 'linear-gradient(150deg,#2a251d,#c1443c)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Terracota', hex: '#c1443c', images: ['img/productos/dhl-303-terracota-1.jpg', 'img/productos/dhl-303-terracota-2.jpg', 'img/productos/dhl-303-terracota-3.jpg'], note: 'un tono cálido, ideal para la temporada de otoño.' },
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-303-beige-1.jpg', 'img/productos/dhl-303-beige-2.jpg', 'img/productos/dhl-303-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-303-negro-1.jpg', 'img/productos/dhl-303-negro-2.jpg', 'img/productos/dhl-303-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Bufanda tejida, suave y abrigadora. El accesorio que le da personalidad a cualquier outfit de invierno.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Aproximadamente 180 x 30 cm.'
    },
    featured: false
  },
  {
    id: 28,
    name: 'Lentes de Sol',
    category: 'accesorios',
    price: 450,
    sku: 'DHL-304',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-304-negro-1.jpg', 'img/productos/dhl-304-negro-2.jpg', 'img/productos/dhl-304-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-304-cafe-1.jpg', 'img/productos/dhl-304-cafe-2.jpg', 'img/productos/dhl-304-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' }
    ],
    description: 'Lentes de sol con protección UV y armazón resistente. El toque final para tu look del día.',
    details: {
      tela: 'Armazón de acetato con lente polarizado',
      cuidado: 'Guardar en su estuche, limpiar el lente con paño de microfibra.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Ancho de armazón: 14 cm. Incluye estuche.'
    },
    featured: false
  },
  {
    id: 29,
    name: 'Mochila Urbana',
    category: 'accesorios',
    price: 680,
    sku: 'DHL-305',
    gradient: 'linear-gradient(150deg,#211d17,#4a5240)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Verde olivo', hex: '#3f4a3a', images: ['img/productos/dhl-305-verde-olivo-1.jpg', 'img/productos/dhl-305-verde-olivo-2.jpg', 'img/productos/dhl-305-verde-olivo-3.jpg'], note: 'un tono terroso muy fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-305-negro-1.jpg', 'img/productos/dhl-305-negro-2.jpg', 'img/productos/dhl-305-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Mochila resistente al agua con compartimento para laptop. Práctica para el diario o para viajar.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: '30 x 42 x 15 cm. Capacidad aproximada de 18 litros.'
    },
    featured: false
  },
  {
    id: 30,
    name: 'Cartera de Piel',
    category: 'accesorios',
    price: 420,
    sku: 'DHL-306',
    gradient: 'linear-gradient(150deg,#2a251d,#4a3826)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-306-cafe-1.jpg', 'img/productos/dhl-306-cafe-2.jpg', 'img/productos/dhl-306-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-306-negro-1.jpg', 'img/productos/dhl-306-negro-2.jpg', 'img/productos/dhl-306-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Cartera de piel genuina con varios compartimentos. Sencilla, resistente y minimalista.',
    details: {
      tela: 'Piel genuina',
      cuidado: 'Limpiar con paño húmedo y dejar secar a la sombra. No sumergir en agua ni exponer al sol directo por tiempo prolongado.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: '11 x 9 cm, con 4 compartimentos internos.'
    },
    featured: false
  },
  {
    id: 31,
    name: 'Reloj Minimalista',
    category: 'accesorios',
    price: 890,
    sku: 'DHL-307',
    gradient: 'linear-gradient(150deg,#1c1c1c,#e3b23c)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Dorado', hex: '#e3b23c', images: ['img/productos/dhl-307-dorado-1.jpg', 'img/productos/dhl-307-dorado-2.jpg', 'img/productos/dhl-307-dorado-3.jpg'], note: 'un tono llamativo pensado para destacar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-307-negro-1.jpg', 'img/productos/dhl-307-negro-2.jpg', 'img/productos/dhl-307-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Reloj de carátula limpia y correa delgada. Combina con looks formales y casuales por igual.',
    details: {
      tela: 'Caja de acero inoxidable y correa de piel',
      cuidado: 'Limpiar con paño húmedo y dejar secar a la sombra. No sumergir en agua ni exponer al sol directo por tiempo prolongado.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Caja de 38 mm, correa ajustable de 16 a 21 cm.'
    },
    featured: false
  },
  {
    id: 32,
    name: 'Paliacate Estampado',
    category: 'accesorios',
    price: 190,
    sku: 'DHL-308',
    gradient: 'linear-gradient(150deg,#2a1f22,#d9769b)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Rosa dalia', hex: '#d9769b', images: ['img/productos/dhl-308-rosa-dalia-1.jpg', 'img/productos/dhl-308-rosa-dalia-2.jpg', 'img/productos/dhl-308-rosa-dalia-3.jpg'], note: 'nuestro tono insignia: vibrante, femenino y muy Dahlia.' },
      { name: 'Terracota', hex: '#c1443c', images: ['img/productos/dhl-308-terracota-1.jpg', 'img/productos/dhl-308-terracota-2.jpg', 'img/productos/dhl-308-terracota-3.jpg'], note: 'un tono cálido, ideal para la temporada de otoño.' }
    ],
    description: 'Paliacate de algodón con estampado propio. Úsalo en el cuello, la muñeca o la mochila.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Aproximadamente 55 x 55 cm.'
    },
    featured: false
  },
  {
    id: 33,
    name: 'Calcetines Pack x3',
    category: 'accesorios',
    price: 220,
    sku: 'DHL-309',
    gradient: 'linear-gradient(150deg,#221f1c,#6b6a63)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-309-gris-1.jpg', 'img/productos/dhl-309-gris-2.jpg', 'img/productos/dhl-309-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-309-negro-1.jpg', 'img/productos/dhl-309-negro-2.jpg', 'img/productos/dhl-309-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Blanco', hex: '#f4ecd8', images: ['img/productos/dhl-309-blanco-1.jpg', 'img/productos/dhl-309-blanco-2.jpg', 'img/productos/dhl-309-blanco-3.jpg'], note: 'un tono limpio y fresco, perfecto para el día a día.' }
    ],
    description: 'Pack de 3 pares de calcetines de algodón. Cómodos, duraderos y básicos que siempre faltan.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Talla única, cómodo para pie de 24 a 28 cm.'
    },
    featured: false
  },
  {
    id: 34,
    name: 'Guantes de Punto',
    category: 'accesorios',
    price: 260,
    sku: 'DHL-310',
    gradient: 'linear-gradient(150deg,#211d17,#4a3826)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-310-cafe-1.jpg', 'img/productos/dhl-310-cafe-2.jpg', 'img/productos/dhl-310-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-310-negro-1.jpg', 'img/productos/dhl-310-negro-2.jpg', 'img/productos/dhl-310-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-310-beige-1.jpg', 'img/productos/dhl-310-beige-2.jpg', 'img/productos/dhl-310-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' }
    ],
    description: 'Guantes tejidos, calientitos para el invierno sin perder estilo.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Talla única con puño elástico ajustable.'
    },
    featured: false
  },
  {
    id: 35,
    name: 'Pulsera Artesanal',
    category: 'accesorios',
    price: 180,
    sku: 'DHL-311',
    gradient: 'linear-gradient(150deg,#2a251d,#e3b23c)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Dorado', hex: '#e3b23c', images: ['img/productos/dhl-311-dorado-1.jpg', 'img/productos/dhl-311-dorado-2.jpg', 'img/productos/dhl-311-dorado-3.jpg'], note: 'un tono llamativo pensado para destacar.' },
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-311-cafe-1.jpg', 'img/productos/dhl-311-cafe-2.jpg', 'img/productos/dhl-311-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' }
    ],
    description: 'Pulsera hecha a mano por artesanos locales. Cada pieza es ligeramente distinta.',
    details: {
      tela: 'Materiales artesanales, pieza hecha a mano',
      cuidado: 'Limpiar en seco con un paño suave. Evitar la humedad prolongada para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Ajustable de 16 a 20 cm de contorno de muñeca.'
    },
    featured: false
  },
  {
    id: 36,
    name: 'Sombrero de Palma',
    category: 'accesorios',
    price: 480,
    sku: 'DHL-312',
    gradient: 'linear-gradient(150deg,#2a251d,#c9b79c)',
    sizes: [
      { label: 'Único', measurements: null }
    ],
    colors: [
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-312-beige-1.jpg', 'img/productos/dhl-312-beige-2.jpg', 'img/productos/dhl-312-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' },
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-312-cafe-1.jpg', 'img/productos/dhl-312-cafe-2.jpg', 'img/productos/dhl-312-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' }
    ],
    description: 'Sombrero de palma tejido a mano, ligero y fresco para los días de sol.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.',
      dimensiones: 'Contorno de 56 a 58 cm, ala de 8 cm.'
    },
    featured: false
  },
  {
    id: 37,
    name: 'Chamarra Acolchada',
    category: 'novedades',
    price: 990,
    sku: 'DHL-401',
    gradient: 'linear-gradient(150deg,#2a251d,#c1443c)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '62 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '63 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '65 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '67 cm' } }
    ],
    colors: [
      { name: 'Terracota', hex: '#c1443c', images: ['img/productos/dhl-401-terracota-1.jpg', 'img/productos/dhl-401-terracota-2.jpg', 'img/productos/dhl-401-terracota-3.jpg'], note: 'un tono cálido, ideal para la temporada de otoño.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-401-negro-1.jpg', 'img/productos/dhl-401-negro-2.jpg', 'img/productos/dhl-401-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Chamarra ligera acolchada, perfecta para los días de otoño. Nueva colección, edición limitada.',
    details: {
      tela: 'Exterior acolchado con relleno térmico',
      cuidado: 'Lavado a máquina en ciclo suave, agua fría. No planchar directamente sobre el relleno.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: true
  },
  {
    id: 38,
    name: 'Suéter Cuello Alto',
    category: 'novedades',
    price: 590,
    sku: 'DHL-402',
    gradient: 'linear-gradient(150deg,#22201c,#7c8a63)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '63 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '64 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '65 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '67 cm' } }
    ],
    colors: [
      { name: 'Sage', hex: '#7c8a63', images: ['img/productos/dhl-402-sage-1.jpg', 'img/productos/dhl-402-sage-2.jpg', 'img/productos/dhl-402-sage-3.jpg'], note: 'un verde suave inspirado en la naturaleza.' },
      { name: 'Crema', hex: '#f4ecd8', images: ['img/productos/dhl-402-crema-1.jpg', 'img/productos/dhl-402-crema-2.jpg', 'img/productos/dhl-402-crema-3.jpg'], note: 'un tono cálido que suaviza cualquier combinación.' },
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-402-vino-1.jpg', 'img/productos/dhl-402-vino-2.jpg', 'img/productos/dhl-402-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' }
    ],
    description: 'Suéter de punto suave con cuello alto. Se ve bien solo o en capas con una chamarra.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 39,
    name: 'Falda Cargo',
    category: 'novedades',
    price: 690,
    sku: 'DHL-403',
    gradient: 'linear-gradient(150deg,#211d17,#7c8a63)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '51 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '52 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '53 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '55 cm' } }
    ],
    colors: [
      { name: 'Caqui', hex: '#7c8a63', images: ['img/productos/dhl-403-caqui-1.jpg', 'img/productos/dhl-403-caqui-2.jpg', 'img/productos/dhl-403-caqui-3.jpg'], note: 'un neutro con un toque casual y urbano.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-403-negro-1.jpg', 'img/productos/dhl-403-negro-2.jpg', 'img/productos/dhl-403-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Falda cargo con bolsas laterales, mezcla lo funcional con lo urbano. Parte de la colección nueva.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 40,
    name: 'Vestido de Punto',
    category: 'novedades',
    price: 760,
    sku: 'DHL-404',
    gradient: 'linear-gradient(150deg,#2a1f22,#d9769b)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '97 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '98 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '99 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '101 cm' } }
    ],
    colors: [
      { name: 'Rosa dalia', hex: '#d9769b', images: ['img/productos/dhl-404-rosa-dalia-1.jpg', 'img/productos/dhl-404-rosa-dalia-2.jpg', 'img/productos/dhl-404-rosa-dalia-3.jpg'], note: 'nuestro tono insignia: vibrante, femenino y muy Dahlia.' },
      { name: 'Crema', hex: '#f4ecd8', images: ['img/productos/dhl-404-crema-1.jpg', 'img/productos/dhl-404-crema-2.jpg', 'img/productos/dhl-404-crema-3.jpg'], note: 'un tono cálido que suaviza cualquier combinación.' }
    ],
    description: 'Vestido de punto entallado, cómodo y abrigador sin perder silueta. Recién llegado a la colección.',
    details: {
      tela: 'Punto de algodón y acrílico',
      cuidado: 'Lavado a mano en agua fría y secar en superficie plana para que no pierda la forma.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 41,
    name: 'Abrigo Largo',
    category: 'novedades',
    price: 1290,
    sku: 'DHL-405',
    gradient: 'linear-gradient(150deg,#1c1c1c,#4a3826)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '108 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '109 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '111 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '113 cm' } }
    ],
    colors: [
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-405-cafe-1.jpg', 'img/productos/dhl-405-cafe-2.jpg', 'img/productos/dhl-405-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-405-negro-1.jpg', 'img/productos/dhl-405-negro-2.jpg', 'img/productos/dhl-405-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-405-beige-1.jpg', 'img/productos/dhl-405-beige-2.jpg', 'img/productos/dhl-405-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' }
    ],
    description: 'Abrigo largo de corte recto, la pieza estrella de la temporada de frío. Edición limitada.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: true
  },
  {
    id: 42,
    name: 'Blazer Estructurado',
    category: 'novedades',
    price: 940,
    sku: 'DHL-406',
    gradient: 'linear-gradient(150deg,#211d17,#2b3550)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '69 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '70 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '71 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '73 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '75 cm' } }
    ],
    colors: [
      { name: 'Azul marino', hex: '#2b3550', images: ['img/productos/dhl-406-azul-marino-1.jpg', 'img/productos/dhl-406-azul-marino-2.jpg', 'img/productos/dhl-406-azul-marino-3.jpg'], note: 'un tono clásico con un toque más formal.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-406-negro-1.jpg', 'img/productos/dhl-406-negro-2.jpg', 'img/productos/dhl-406-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Blazer de hombros estructurados, entalla sin apretar. Sube de nivel cualquier outfit casual.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 43,
    name: 'Conjunto Deportivo',
    category: 'novedades',
    price: 780,
    sku: 'DHL-407',
    gradient: 'linear-gradient(150deg,#221f1c,#6c5ce0)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '64 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '65 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '67 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '69 cm' } }
    ],
    colors: [
      { name: 'Morado', hex: '#6c5ce0', images: ['img/productos/dhl-407-morado-1.jpg', 'img/productos/dhl-407-morado-2.jpg', 'img/productos/dhl-407-morado-3.jpg'], note: 'un tono llamativo, perfecto para looks con personalidad.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-407-negro-1.jpg', 'img/productos/dhl-407-negro-2.jpg', 'img/productos/dhl-407-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Gris', hex: '#6b6a63', images: ['img/productos/dhl-407-gris-1.jpg', 'img/productos/dhl-407-gris-2.jpg', 'img/productos/dhl-407-gris-3.jpg'], note: 'un neutro discreto que nunca pasa de moda.' }
    ],
    description: 'Conjunto de sudadera y pants a juego, cómodo pero con estilo. Recién llegado.',
    details: {
      tela: 'Algodón afelpado (french terry)',
      cuidado: 'Lavado a máquina en agua fría, secado a baja temperatura para conservar la felpa interior.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 44,
    name: 'Vestido Satinado',
    category: 'novedades',
    price: 890,
    sku: 'DHL-408',
    gradient: 'linear-gradient(150deg,#2a1f22,#e3b23c)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '97 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '98 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '99 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '101 cm' } }
    ],
    colors: [
      { name: 'Dorado', hex: '#e3b23c', images: ['img/productos/dhl-408-dorado-1.jpg', 'img/productos/dhl-408-dorado-2.jpg', 'img/productos/dhl-408-dorado-3.jpg'], note: 'un tono llamativo pensado para destacar.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-408-negro-1.jpg', 'img/productos/dhl-408-negro-2.jpg', 'img/productos/dhl-408-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' },
      { name: 'Vino', hex: '#7a2f4d', images: ['img/productos/dhl-408-vino-1.jpg', 'img/productos/dhl-408-vino-2.jpg', 'img/productos/dhl-408-vino-3.jpg'], note: 'un tono profundo que le da personalidad al look.' }
    ],
    description: 'Vestido satinado de caída elegante, perfecto para una fiesta o cena especial.',
    details: {
      tela: 'Satén ligero con caída fluida',
      cuidado: 'Lavado en seco recomendado, o ciclo delicado en bolsa de malla y agua fría.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 45,
    name: 'Chamarra Vinil',
    category: 'novedades',
    price: 1050,
    sku: 'DHL-409',
    gradient: 'linear-gradient(150deg,#1c1c1c,#3a3a3a)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '62 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '63 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '65 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '67 cm' } }
    ],
    colors: [
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-409-negro-1.jpg', 'img/productos/dhl-409-negro-2.jpg', 'img/productos/dhl-409-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Chamarra de vinil con brillo sutil, la pieza statement de la colección nueva.',
    details: {
      tela: 'Vinil sintético con forro interior',
      cuidado: 'Limpiar con paño húmedo. No lavar en máquina ni exponer a fuentes de calor directas.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 46,
    name: 'Pantalón Wide Leg',
    category: 'novedades',
    price: 710,
    sku: 'DHL-410',
    gradient: 'linear-gradient(150deg,#211d17,#c9b79c)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '103 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '104 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '105 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '107 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '109 cm' } }
    ],
    colors: [
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-410-beige-1.jpg', 'img/productos/dhl-410-beige-2.jpg', 'img/productos/dhl-410-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-410-negro-1.jpg', 'img/productos/dhl-410-negro-2.jpg', 'img/productos/dhl-410-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Pantalón de pierna ancha con caída fluida, la silueta que está dominando esta temporada.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 47,
    name: 'Top Corset',
    category: 'novedades',
    price: 460,
    sku: 'DHL-411',
    gradient: 'linear-gradient(150deg,#2a1f22,#c1443c)',
    sizes: [
      { label: 'XS', measurements: { 'Busto/Pecho': '82 cm', 'Cintura': '62 cm', 'Cadera': '88 cm', 'Largo': '43 cm' } },
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '44 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '45 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '47 cm' } }
    ],
    colors: [
      { name: 'Terracota', hex: '#c1443c', images: ['img/productos/dhl-411-terracota-1.jpg', 'img/productos/dhl-411-terracota-2.jpg', 'img/productos/dhl-411-terracota-3.jpg'], note: 'un tono cálido, ideal para la temporada de otoño.' },
      { name: 'Negro', hex: '#231f1a', images: ['img/productos/dhl-411-negro-1.jpg', 'img/productos/dhl-411-negro-2.jpg', 'img/productos/dhl-411-negro-3.jpg'], note: 'un básico infalible que combina con prácticamente todo tu clóset.' }
    ],
    description: 'Top estilo corset con costuras estructuradas, para un look de noche con actitud.',
    details: {
      tela: 'Mezcla de algodón premium',
      cuidado: 'Lavado a máquina en agua fría, ciclo delicado. Secar a la sombra para conservar el color.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  },
  {
    id: 48,
    name: 'Gabardina Oversize',
    category: 'novedades',
    price: 980,
    sku: 'DHL-412',
    gradient: 'linear-gradient(150deg,#211d17,#c9b79c)',
    sizes: [
      { label: 'S', measurements: { 'Busto/Pecho': '86 cm', 'Cintura': '66 cm', 'Cadera': '92 cm', 'Largo': '108 cm' } },
      { label: 'M', measurements: { 'Busto/Pecho': '90 cm', 'Cintura': '70 cm', 'Cadera': '96 cm', 'Largo': '109 cm' } },
      { label: 'L', measurements: { 'Busto/Pecho': '95 cm', 'Cintura': '75 cm', 'Cadera': '101 cm', 'Largo': '111 cm' } },
      { label: 'XL', measurements: { 'Busto/Pecho': '100 cm', 'Cintura': '80 cm', 'Cadera': '106 cm', 'Largo': '113 cm' } }
    ],
    colors: [
      { name: 'Beige', hex: '#c9b79c', images: ['img/productos/dhl-412-beige-1.jpg', 'img/productos/dhl-412-beige-2.jpg', 'img/productos/dhl-412-beige-3.jpg'], note: 'un neutro versátil que combina con casi cualquier prenda.' },
      { name: 'Café', hex: '#4a3826', images: ['img/productos/dhl-412-cafe-1.jpg', 'img/productos/dhl-412-cafe-2.jpg', 'img/productos/dhl-412-cafe-3.jpg'], note: 'un tono cálido y clásico, fácil de combinar.' }
    ],
    description: 'Gabardina de corte oversize, versátil entre estaciones. Nueva colección, piezas limitadas.',
    details: {
      tela: 'Gabardina de algodón repelente al agua',
      cuidado: 'Guardar en su estuche, limpiar el lente con paño de microfibra.',
      origen: 'Diseñado en Aguascalientes y confeccionado por talleres locales aliados de Dahlia.'
    },
    featured: false
  }
];