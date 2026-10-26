// Guía de tallas: tablas de medidas por línea y una pequeña calculadora de talla.
(function () {
  const tabs = document.getElementById('sizeTabs');
  if (!tabs) return;

  // Medidas del cuerpo en cm: [mín, máx] para cada talla.
  const GUIDE = {
    mujer: {
      cols: ['Talla', 'Busto', 'Cintura', 'Cadera'],
      sizes: [
        ['XS', [82, 86], [62, 66], [88, 92]],
        ['S',  [86, 90], [66, 70], [92, 96]],
        ['M',  [90, 94], [70, 74], [96, 100]],
        ['L',  [94, 98], [74, 78], [100, 104]],
        ['XL', [98, 104], [78, 84], [104, 110]]
      ],
      labels: ['Busto (cm)', 'Cintura (cm)', 'Cadera (cm)'],
      note: 'Medidas del cuerpo en centímetros. La ropa de mujer de Dahlia tiene un corte regular.'
    },
    hombre: {
      cols: ['Talla', 'Pecho', 'Cintura', 'Cadera'],
      sizes: [
        ['XS', [84, 88], [70, 74], [88, 92]],
        ['S',  [88, 96], [74, 82], [92, 98]],
        ['M',  [96, 104], [82, 90], [98, 104]],
        ['L',  [104, 112], [90, 98], [104, 110]],
        ['XL', [112, 120], [98, 106], [110, 116]]
      ],
      labels: ['Pecho (cm)', 'Cintura (cm)', 'Cadera (cm)'],
      note: 'Medidas del cuerpo en centímetros. Las prendas oversize (chamarras y sudaderas) quedan más holgadas.'
    }
  };

  const ACCESORIOS = {
    cols: ['Talla', 'Cinturón (cintura, cm)', 'Gorra (contorno de cabeza, cm)'],
    rows: [
      ['S', '70 – 80', '54 – 56'],
      ['M', '80 – 90', '56 – 58'],
      ['L', '90 – 100', '58 – 60'],
      ['XL', '100 – 110', '60 – 62']
    ],
    note: 'Bolsas, relojes, collares y pulseras son de talla única. En los cinturones elige la talla según tu cintura sin contar el cinturón actual.'
  };

  const wrap = document.getElementById('sizeTableWrap');
  const noteEl = document.getElementById('sizeNote');
  const calc = document.getElementById('sizeCalc');
  const resultEl = document.getElementById('sizeResult');
  let tab = 'mujer';
  let matched = null;

  const range = ([a, b]) => `${a} – ${b}`;

  function renderTable() {
    if (tab === 'accesorios') {
      wrap.innerHTML = `<table class="size-table"><thead><tr>${ACCESORIOS.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${ACCESORIOS.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      noteEl.textContent = ACCESORIOS.note;
      calc.hidden = true;
      return;
    }
    const g = GUIDE[tab];
    calc.hidden = false;
    document.getElementById('szBustLabel').textContent = g.labels[0];
    wrap.innerHTML = `<table class="size-table"><thead><tr>${g.cols.map(c => `<th>${c === 'Talla' ? c : c + ' (cm)'}</th>`).join('')}</tr></thead>
      <tbody>${g.sizes.map(s => `<tr class="${s[0] === matched ? 'is-match' : ''}"><td>${s[0]}</td><td>${range(s[1])}</td><td>${range(s[2])}</td><td>${range(s[3])}</td></tr>`).join('')}</tbody></table>`;
    noteEl.textContent = g.note;
  }

  function switchTab(next) {
    tab = next;
    matched = null;
    resultEl.hidden = true;
    tabs.querySelectorAll('[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
      b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    });
    renderTable();
  }
  tabs.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

  // Para cada medida se busca la primera talla que la cubre; se recomienda la mayor de las tres.
  document.getElementById('sizeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const g = GUIDE[tab];
    const values = ['szBust', 'szWaist', 'szHip'].map(id => parseFloat(document.getElementById(id).value));
    resultEl.hidden = false;
    resultEl.classList.remove('size-result--error');

    if (values.some(v => !v || v <= 0)) {
      resultEl.textContent = 'Escribe las tres medidas para calcular tu talla.';
      resultEl.classList.add('size-result--error');
      return;
    }
    let idx = 0;
    let beyond = false;
    values.forEach((v, i) => {
      let found = g.sizes.findIndex(s => v <= s[i + 1][1]);
      if (found === -1) { found = g.sizes.length - 1; beyond = true; }
      idx = Math.max(idx, found);
    });
    matched = g.sizes[idx][0];
    renderTable();
    resultEl.innerHTML = beyond
      ? `Tus medidas superan nuestra talla más grande. Te sugerimos <strong>${matched}</strong>; escríbenos y te ayudamos a elegir.`
      : `Tu talla recomendada es <strong>${matched}</strong>.`;
  });

  renderTable();
})();