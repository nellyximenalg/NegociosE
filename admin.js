// ---------- Acceso: solo cuentas con rol admin pueden ver este panel ----------
function checkAdminAccess() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html?redirect=admin.html';
    return false;
  }
  if (!isAdmin()) {
    window.location.href = 'inicio.html#inicio';
    return false;
  }
  return true;
}

if (checkAdminAccess()) {

  // ---------- Cerrar sesión ----------
  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    localStorage.removeItem('dahlia_logged_in');
    localStorage.removeItem('dahlia_user_role');
    window.location.href = 'inicio.html#inicio';
  });

  // ---------- Navegación del menú lateral ----------
  const navLinks = document.querySelectorAll('.admin-nav-link');
  const views = document.querySelectorAll('.admin-view');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      link.classList.add('active');
      document.getElementById(`view-${link.dataset.view}`).classList.add('active');
    });
  });

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function slugStatus(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  }

  // ---------- Resumen ----------
  function renderStats() {
    const products = getStoreProducts();
    const promos = products.filter(p => isPromoActive(p)).length;
    const accounts = Object.keys(JSON.parse(localStorage.getItem('dahlia_accounts') || '{}')).length;
    const stockTracked = products.map(p => getTotalStock(p)).filter(s => s !== null);
    const totalStock = stockTracked.reduce((sum, s) => sum + s, 0);
    const outOfStock = products.filter(p => getTotalStock(p) === 0).length;
    const stats = [
      { label: 'Productos', value: products.length },
      { label: 'Pedidos', value: FAKE_ORDERS.length },
      { label: 'Promociones activas', value: promos },
      { label: 'Cuentas registradas', value: accounts + 128 },
      { label: 'Unidades en stock', value: stockTracked.length ? totalStock : '—' },
      { label: 'Productos agotados', value: outOfStock }
    ];
    document.getElementById('adminStats').innerHTML = stats.map(s => `
      <div class="admin-stat-card">
        <span class="admin-stat-value">${s.value}</span>
        <span class="admin-stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  // ---------- Pedidos (simulado, datos fijos) ----------
  const FAKE_ORDERS = [
    { id: '#DHL-1042', cliente: 'Marisol Reyes', productos: 3, total: 1850, estado: 'Enviado' },
    { id: '#DHL-1041', cliente: 'Diego Torres', productos: 1, total: 610, estado: 'En preparación' },
    { id: '#DHL-1040', cliente: 'Ana Camacho', productos: 2, total: 1340, estado: 'Entregado' },
    { id: '#DHL-1039', cliente: 'Luis Fernández', productos: 4, total: 2960, estado: 'Entregado' },
    { id: '#DHL-1038', cliente: 'Paola Sánchez', productos: 1, total: 790, estado: 'Cancelado' }
  ];

  function renderOrders() {
    document.getElementById('adminOrdersBody').innerHTML = FAKE_ORDERS.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.cliente}</td>
        <td>${o.productos}</td>
        <td>$${o.total.toLocaleString('es-MX')} MXN</td>
        <td><span class="admin-status admin-status--${slugStatus(o.estado)}">${o.estado}</span></td>
      </tr>
    `).join('');
  }

  function renderBadgesCell(p) {
    const html = renderProductBadges(p);
    if (!html) return '—';
    return html.replace('class="prod-badges"', 'class="prod-badges prod-badges--inline"');
  }

  // ---------- Tabla de productos ----------
  function renderStockCell(p) {
    const total = getTotalStock(p);
    if (total === null) return '<span class="admin-field-hint">—</span>';
    if (total === 0) return '<span class="admin-stock-pill admin-stock-pill--out">Agotado</span>';
    return `<span class="admin-stock-pill">${total}</span>`;
  }

  function renderProductsTable() {
    const products = getStoreProducts();
    document.getElementById('adminProductsBody').innerHTML = products.map(p => `
      <tr>
        <td><span class="admin-swatch" style="background:${p.gradient}"></span></td>
        <td>${p.name}</td>
        <td>${p.sku}</td>
        <td>${capitalize(p.category)}</td>
        <td>${isPromoActive(p) && p.discountPrice ? `<span class="prod-price-old">$${p.price}</span> $${p.discountPrice}` : `$${p.price}`}</td>
        <td>${renderStockCell(p)}</td>
        <td>${renderBadgesCell(p)}</td>
        <td class="admin-table-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-edit="${p.id}">Editar</button>
          <button type="button" class="btn btn-ghost btn-sm admin-btn-danger" data-delete="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openProductForm(parseInt(btn.dataset.edit, 10)));
    });
    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.delete, 10)));
    });
  }

  // ---------- Modal de confirmación (reemplaza al confirm() nativo del navegador) ----------
  let confirmModalEl = null;

  function buildConfirmModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'confirmModal';
    overlay.innerHTML = `
      <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
        <h3 id="confirmModalTitle">Confirmar</h3>
        <p class="admin-confirm-message" id="confirmModalMessage"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="confirmModalCancel">Cancelar</button>
          <button type="button" class="btn btn-primary admin-btn-danger-solid" id="confirmModalAccept">Eliminar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close();
    });
    overlay.querySelector('#confirmModalCancel').addEventListener('click', close);
    overlay._close = close;
    return overlay;
  }

  // ---------- Notificaciones (reemplaza alert() nativo) ----------
  function showToast(message) {
    let stack = document.getElementById('adminToastStack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'adminToastStack';
      stack.className = 'admin-toast-stack';
      document.body.appendChild(stack);
    }
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = message;
    stack.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2600);
  }

  function showConfirmModal(message, onConfirm) {
    const overlay = confirmModalEl || (confirmModalEl = buildConfirmModal());
    overlay.querySelector('#confirmModalMessage').textContent = message;

    const acceptBtn = overlay.querySelector('#confirmModalAccept');
    const freshAccept = acceptBtn.cloneNode(true);
    acceptBtn.parentNode.replaceChild(freshAccept, acceptBtn);
    freshAccept.addEventListener('click', () => {
      overlay._close();
      onConfirm();
    });

    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function deleteProduct(id) {
    const products = getStoreProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;

    showConfirmModal(`¿Seguro que quieres eliminar "${product.name}"? Esta acción no se puede deshacer.`, () => {
      const ov = getAdminOverrides();
      const isAdded = ov.added.some(p => p.id === id);
      if (isAdded) {
        ov.added = ov.added.filter(p => p.id !== id);
      } else {
        if (!ov.deletes.includes(id)) ov.deletes.push(id);
        delete ov.edits[id];
      }
      saveAdminOverrides(ov);
      renderProductsTable();
      renderStats();
      renderPromosTable();
      showToast('Producto eliminado correctamente.');
    });
  }

  // ---------- Formulario: agregar / editar producto ----------
  let productModalEl = null;

  const SIZE_PRESETS = {
    mujer: [{ key: 'letra', label: 'Letra', options: ['XS', 'S', 'M', 'L', 'XL'] }],
    hombre: [
      { key: 'letra', label: 'Letra', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { key: 'numerica', label: 'Numérica (cintura)', options: ['28', '30', '32', '34', '36', '38'] }
    ],
    accesorios: []
  };

  // Campos de medida según el tipo de talla (mismos nombres que ya usa el catálogo).
  const MEASURE_FIELDS = {
    letra: ['Busto/Pecho', 'Cintura', 'Cadera', 'Largo'],
    numerica: ['Cintura', 'Cadera', 'Largo de pierna']
  };

  // Guarda las medidas ya capturadas mientras el formulario está abierto, para
  // no perderlas si el admin marca/desmarca tallas o cambia de pestaña.
  let sizeMeasurementsState = {};

  // Pinta las opciones de talla según la categoría. `selectedLabels` marca
  // como elegidas las que ya traía el producto (al editar).
  function renderSizeOptions(overlay, category, selectedLabels) {
    const wrap = overlay.querySelector('#pfSizesOptions');
    const groups = SIZE_PRESETS[category] || [];

    if (category === 'accesorios') {
      wrap.innerHTML = '<p class="admin-field-hint">Los accesorios solo manejan talla única — no hay nada que elegir aquí.</p>';
      overlay.querySelector('#pfMeasurementsWrap').innerHTML = '';
      renderColorCards(overlay);
      return;
    }

    const typeTabs = groups.length > 1 ? `
      <div class="admin-size-type-tabs" id="pfSizeTypeTabs">
        ${groups.map((g, i) => `<button type="button" class="admin-size-type-tab${i === 0 ? ' active' : ''}" data-size-type="${g.key}">${g.label}</button>`).join('')}
      </div>
    ` : '';

    const groupsHtml = groups.map((g, i) => `
      <div class="admin-size-checks" data-size-group="${g.key}" ${i === 0 ? '' : 'hidden'}>
        ${g.options.map(label => `
          <label class="checkbox-field checkbox-field--chip">
            <input type="checkbox" value="${label}" ${selectedLabels.includes(label) ? 'checked' : ''}> ${label}
          </label>
        `).join('')}
      </div>
    `).join('');

    wrap.innerHTML = typeTabs + groupsHtml;

    function currentGroupKey() {
      const visible = wrap.querySelector('[data-size-group]:not([hidden])');
      return visible ? visible.dataset.sizeGroup : groups[0].key;
    }

    wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        renderMeasurementFields(overlay, currentGroupKey());
        renderColorCards(overlay);
      });
    });

    if (groups.length > 1) {
      // Si el producto que se edita ya tenía tallas numéricas, abre esa pestaña.
      const activeGroup = groups.find(g => g.options.some(o => selectedLabels.includes(o))) || groups[0];
      wrap.querySelectorAll('[data-size-type]').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.sizeType === activeGroup.key);
      });
      wrap.querySelectorAll('[data-size-group]').forEach(group => {
        group.hidden = group.dataset.sizeGroup !== activeGroup.key;
      });
      wrap.querySelectorAll('[data-size-type]').forEach(tab => {
        tab.addEventListener('click', () => {
          wrap.querySelectorAll('[data-size-type]').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          wrap.querySelectorAll('[data-size-group]').forEach(group => {
            group.hidden = group.dataset.sizeGroup !== tab.dataset.sizeType;
          });
          renderMeasurementFields(overlay, tab.dataset.sizeType);
          renderColorCards(overlay);
        });
      });
    }

    renderMeasurementFields(overlay, currentGroupKey());
    renderColorCards(overlay);
  }

  // Pinta un mini-formulario de medidas por cada talla marcada, para que la
  // guía de tallas del producto (la que se ve al elegir la talla) tenga datos.
  function renderMeasurementFields(overlay, groupKey) {
    const measWrap = overlay.querySelector('#pfMeasurementsWrap');
    const labels = getSelectedSizeLabels(overlay, overlay.querySelector('#pfCategory').value);
    const fields = MEASURE_FIELDS[groupKey] || [];

    if (!labels.length || !fields.length) {
      measWrap.innerHTML = '';
      return;
    }

    measWrap.innerHTML = `
      <label>Medidas por talla <span class="admin-field-hint">(opcional — se muestran en la ficha del producto)</span></label>
      ${labels.map(label => `
        <div class="admin-measure-row">
          <span class="admin-measure-size">${label}</span>
          ${fields.map(key => `
            <div class="admin-measure-field">
              <label>${key}</label>
              <input type="text" data-ms-label="${label}" data-ms-key="${key}" placeholder="Ej. 90 cm" value="${(sizeMeasurementsState[label] && sizeMeasurementsState[label][key]) || ''}">
            </div>
          `).join('')}
        </div>
      `).join('')}
    `;

    measWrap.querySelectorAll('input[data-ms-label]').forEach(input => {
      input.addEventListener('input', () => {
        const label = input.dataset.msLabel;
        const key = input.dataset.msKey;
        sizeMeasurementsState[label] = sizeMeasurementsState[label] || {};
        sizeMeasurementsState[label][key] = input.value;
      });
    });
  }

  // Lee del formulario las tallas marcadas (solo del grupo visible, si hay pestañas).
  function getSelectedSizeLabels(overlay, category) {
    if (category === 'accesorios') return ['Única'];
    const visibleGroup = overlay.querySelector('#pfSizesOptions [data-size-group]:not([hidden])');
    const scope = visibleGroup || overlay.querySelector('#pfSizesOptions');
    return Array.from(scope.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  }

  // Arma, para cada talla marcada, el objeto de medidas capturado (sin campos vacíos).
  function getMeasurementsForLabels(labels) {
    const result = {};
    labels.forEach(label => {
      const raw = sizeMeasurementsState[label];
      if (!raw) return;
      const clean = {};
      Object.keys(raw).forEach(key => {
        if (raw[key] && raw[key].trim()) clean[key] = raw[key].trim();
      });
      if (Object.keys(clean).length) result[label] = clean;
    });
    return result;
  }

  // ---------- Colores del producto (paleta + tarjetas editables) ----------
  // Colores propios de Dahlia primero, luego una paleta extra para variedad.
  const COLOR_PALETTE = [
    { name: 'Negro', hex: '#231f1a' }, { name: 'Blanco hueso', hex: '#f4ecd8' },
    { name: 'Beige', hex: '#c9b79c' }, { name: 'Gris', hex: '#6b6a63' },
    { name: 'Café', hex: '#4a3826' }, { name: 'Sage', hex: '#7c8a63' },
    { name: 'Verde olivo', hex: '#3f4a3a' }, { name: 'Azul oscuro', hex: '#2b3550' },
    { name: 'Azul claro', hex: '#7a9ab8' }, { name: 'Vino', hex: '#7a2f4d' },
    { name: 'Rosa dalia', hex: '#d9769b' }, { name: 'Dorado', hex: '#e3b23c' },
    { name: 'Terracota', hex: '#c1443c' }, { name: 'Morado', hex: '#6c5ce0' },
    { name: 'Negro puro', hex: '#000000' }, { name: 'Gris oscuro', hex: '#404040' },
    { name: 'Gris medio', hex: '#737373' }, { name: 'Gris claro', hex: '#bfbfbf' },
    { name: 'Blanco', hex: '#ffffff' }, { name: 'Rojo', hex: '#ff3b30' },
    { name: 'Coral', hex: '#ff6b6b' }, { name: 'Rosa mexicano', hex: '#ff69b4' },
    { name: 'Lavanda', hex: '#d9b3ff' }, { name: 'Orquídea', hex: '#b366d9' },
    { name: 'Violeta', hex: '#7c4dff' }, { name: 'Índigo', hex: '#4b0082' },
    { name: 'Petróleo', hex: '#008080' }, { name: 'Cian', hex: '#17becf' },
    { name: 'Turquesa', hex: '#5eead4' }, { name: 'Azul', hex: '#3b82f6' },
    { name: 'Azul rey', hex: '#4361ee' }, { name: 'Azul marino', hex: '#1e3a8a' },
    { name: 'Verde esmeralda', hex: '#10b981' }, { name: 'Verde limón', hex: '#7ed957' },
    { name: 'Amarillo', hex: '#ffd93d' }, { name: 'Durazno', hex: '#ffb347' },
    { name: 'Naranja', hex: '#ff8c42' }, { name: 'Naranja quemado', hex: '#ff6b1a' }
  ];

  // Estado de los colores del producto mientras el formulario está abierto.
  let formColors = [];

  function renderColorPalette(overlay) {
    const wrap = overlay.querySelector('#pfColorPalette');
    wrap.innerHTML = COLOR_PALETTE.map(c => `
      <button type="button" class="admin-palette-swatch" style="background:${c.hex}" data-hex="${c.hex}" data-name="${c.name}" title="${c.name}"></button>
    `).join('');
    wrap.querySelectorAll('.admin-palette-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        formColors.push({ hex: btn.dataset.hex, name: btn.dataset.name, note: '', images: ['', '', ''], stock: {} });
        renderColorCards(overlay);
      });
    });
  }

  function renderColorCards(overlay) {
    const list = overlay.querySelector('#pfColorsList');
    const category = overlay.querySelector('#pfCategory').value;
    const sizeLabels = getSelectedSizeLabels(overlay, category);

    if (!formColors.length) {
      list.innerHTML = '<p class="admin-field-hint">Elige uno o más colores de la paleta de arriba.</p>';
      return;
    }

    list.innerHTML = formColors.map((c, i) => {
      if (!c.stock) c.stock = {};
      return `
      <div class="admin-color-card" data-color-index="${i}">
        <div class="admin-color-card-head">
          <span class="admin-swatch admin-swatch--lg" style="background:${c.hex}"></span>
          <input type="text" class="pf-color-name" placeholder="Nombre del color" value="${c.name.replace(/"/g, '&quot;')}">
          ${formColors.length > 1 ? `<button type="button" class="admin-color-remove" data-remove-color="${i}" aria-label="Quitar color">×</button>` : ''}
        </div>
        <textarea class="pf-color-note" rows="2" placeholder="Descripción de este color (aparece debajo del selector de color)">${c.note}</textarea>
        <div class="admin-form-row admin-form-row--3">
          <input type="text" class="pf-color-img" data-img-index="0" placeholder="Imagen 1 (ruta o URL)" value="${c.images[0]}">
          <input type="text" class="pf-color-img" data-img-index="1" placeholder="Imagen 2 (ruta o URL)" value="${c.images[1]}">
          <input type="text" class="pf-color-img" data-img-index="2" placeholder="Imagen 3 (ruta o URL)" value="${c.images[2]}">
        </div>
        ${sizeLabels.length ? `
          <div class="admin-color-stock">
            <label>Stock de este color por talla</label>
            <div class="admin-stock-rows">
              ${sizeLabels.map(label => `
                <div class="admin-stock-row">
                  <span class="admin-measure-size">${label}</span>
                  <input type="number" min="0" data-stock-color="${i}" data-stock-label="${label}" placeholder="0" value="${c.stock[label] != null ? c.stock[label] : ''}">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
    }).join('');

    list.querySelectorAll('.admin-color-card').forEach(card => {
      const i = parseInt(card.dataset.colorIndex, 10);
      card.querySelector('.pf-color-name').addEventListener('input', (e) => { formColors[i].name = e.target.value; });
      card.querySelector('.pf-color-note').addEventListener('input', (e) => { formColors[i].note = e.target.value; });
      card.querySelectorAll('.pf-color-img').forEach(input => {
        input.addEventListener('input', (e) => {
          formColors[i].images[parseInt(e.target.dataset.imgIndex, 10)] = e.target.value;
        });
      });
      card.querySelectorAll('[data-stock-label]').forEach(input => {
        input.addEventListener('input', (e) => {
          formColors[i].stock[e.target.dataset.stockLabel] = e.target.value;
        });
      });
    });

    list.querySelectorAll('[data-remove-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        formColors.splice(parseInt(btn.dataset.removeColor, 10), 1);
        renderColorCards(overlay);
      });
    });
  }

  function buildProductModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'productFormModal';
    overlay.innerHTML = `
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="productFormTitle">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <h3 id="productFormTitle">Agregar producto</h3>
        <form id="productForm">
          <div class="login-field">
            <label for="pfName">Nombre</label>
            <input type="text" id="pfName" required>
          </div>
          <div class="admin-form-row">
            <div class="login-field">
              <label for="pfSku">SKU</label>
              <input type="text" id="pfSku" required>
            </div>
            <div class="login-field">
              <label for="pfCategory">Categoría</label>
              <select id="pfCategory">
                <option value="mujer">Mujer</option>
                <option value="hombre">Hombre</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
          </div>
          <div class="login-field">
            <label for="pfPrice">Precio (MXN)</label>
            <input type="number" id="pfPrice" min="0" required>
          </div>
          <div class="login-field">
            <label for="pfDesc">Descripción</label>
            <textarea id="pfDesc" rows="3"></textarea>
          </div>
          <div class="login-field" id="pfColorsSection">
            <label>Colores del producto</label>
            <div class="admin-color-palette" id="pfColorPalette"></div>
            <div id="pfColorsList"></div>
          </div>
          <div class="login-field" id="pfSizesGroup">
            <label>Tallas disponibles</label>
            <div id="pfSizesOptions"></div>
            <div id="pfMeasurementsWrap"></div>
          </div>
          <div class="admin-form-row admin-form-row--checks">
            <label class="checkbox-field"><input type="checkbox" id="pfIsNew"> Marcar como "Nuevo"</label>
            <label class="checkbox-field"><input type="checkbox" id="pfOnSale"> Marcar como "Oferta"</label>
          </div>
          <div class="login-field" id="pfDiscountGroup" hidden>
            <label for="pfDiscountPercent">Porcentaje de descuento (%)</label>
            <input type="number" id="pfDiscountPercent" min="1" max="90" placeholder="Ej. 20">
            <p class="admin-field-hint" id="pfDiscountPreview"></p>
          </div>
          <div class="login-field">
            <label>Detalles del producto</label>
            <div class="admin-form-row">
              <div class="login-field">
                <label for="pfTela">Tela</label>
                <input type="text" id="pfTela" placeholder="Ej. Algodón Oxford">
              </div>
              <div class="login-field">
                <label for="pfOrigen">Origen</label>
                <input type="text" id="pfOrigen" placeholder="Ej. Diseñado en Aguascalientes...">
              </div>
            </div>
            <div class="login-field">
              <label for="pfCuidado">Cuidado</label>
              <textarea id="pfCuidado" rows="2" placeholder="Ej. Lavado a máquina en agua fría..."></textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="pfCancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeProductForm();
    });
    overlay.querySelector('.modal-close').addEventListener('click', closeProductForm);
    overlay.querySelector('#pfCancel').addEventListener('click', closeProductForm);
    overlay.querySelector('#pfOnSale').addEventListener('change', (event) => {
      overlay.querySelector('#pfDiscountGroup').hidden = !event.target.checked;
      updateDiscountPreview(overlay);
    });
    overlay.querySelector('#pfDiscountPercent').addEventListener('input', () => updateDiscountPreview(overlay));
    overlay.querySelector('#pfPrice').addEventListener('input', () => updateDiscountPreview(overlay));
    overlay.querySelector('#pfCategory').addEventListener('change', (event) => {
      renderSizeOptions(overlay, event.target.value, []);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('open')) closeProductForm();
    });

    return overlay;
  }

  function calcDiscountPrice(price, percent) {
    if (!price || !percent) return null;
    return Math.round(price * (1 - percent / 100));
  }

  function updateDiscountPreview(overlay) {
    const preview = overlay.querySelector('#pfDiscountPreview');
    const onSale = overlay.querySelector('#pfOnSale').checked;
    const price = parseInt(overlay.querySelector('#pfPrice').value, 10) || 0;
    const percent = parseInt(overlay.querySelector('#pfDiscountPercent').value, 10) || 0;
    if (!onSale || !price || !percent) {
      preview.textContent = '';
      return;
    }
    const discountPrice = calcDiscountPrice(price, percent);
    preview.innerHTML = `Precio de oferta: <span class="prod-price-old">$${price}</span> $${discountPrice} MXN`;
  }

  function closeProductForm() {
    if (!productModalEl) return;
    productModalEl.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function openProductForm(editId) {
    const overlay = productModalEl || (productModalEl = buildProductModal());
    const products = getStoreProducts();
    const editing = editId ? products.find(p => p.id === editId) : null;

    overlay.querySelector('#productFormTitle').textContent = editing ? 'Editar producto' : 'Agregar producto';
    overlay.querySelector('#pfName').value = editing ? editing.name : '';
    overlay.querySelector('#pfSku').value = editing ? editing.sku : '';
    overlay.querySelector('#pfCategory').value = editing ? editing.category : 'mujer';
    overlay.querySelector('#pfPrice').value = editing ? editing.price : '';
    overlay.querySelector('#pfDesc').value = editing ? (editing.description || '') : '';
    overlay.querySelector('#pfIsNew').checked = editing ? !!editing.isNew : false;
    overlay.querySelector('#pfOnSale').checked = editing ? !!editing.onSale : false;
    overlay.querySelector('#pfDiscountPercent').value = (editing && editing.discountPercent) ? editing.discountPercent : '';
    overlay.querySelector('#pfDiscountGroup').hidden = !(editing && editing.onSale);
    updateDiscountPreview(overlay);

    // Colores: si se está editando, se parte de los colores reales que ya
    // tenía (con sus fotos); si es nuevo, se empieza sin ninguno.
    formColors = editing && editing.colors
      ? editing.colors.map(c => ({
          hex: c.hex,
          name: c.name || '',
          note: c.note || '',
          images: [0, 1, 2].map(i => (c.images && c.images[i]) || ''),
          stock: Object.assign({}, c.stock || {})
        }))
      : [];
    renderColorCards(overlay);
    renderColorPalette(overlay);

    const category = editing ? editing.category : 'mujer';
    const existingLabels = editing && editing.sizes ? editing.sizes.map(s => s.label) : [];
    sizeMeasurementsState = {};
    if (editing && editing.sizes) {
      editing.sizes.forEach(s => {
        if (s.measurements && Object.keys(s.measurements).length) {
          sizeMeasurementsState[s.label] = Object.assign({}, s.measurements);
        }
      });
    }
    renderSizeOptions(overlay, category, existingLabels);

    const details = (editing && editing.details) || {};
    overlay.querySelector('#pfTela').value = details.tela || '';
    overlay.querySelector('#pfOrigen').value = details.origen || '';
    overlay.querySelector('#pfCuidado').value = details.cuidado || '';

    const form = overlay.querySelector('#productForm');
    form.onsubmit = (event) => {
      event.preventDefault();
      saveProductForm(overlay, editing);
    };

    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function saveProductForm(overlay, editing) {
    if (!formColors.length) {
      showToast('Agrega al menos un color antes de guardar.');
      return;
    }

    const name = overlay.querySelector('#pfName').value.trim();
    const sku = overlay.querySelector('#pfSku').value.trim();
    const category = overlay.querySelector('#pfCategory').value;
    const price = parseInt(overlay.querySelector('#pfPrice').value, 10) || 0;
    const description = overlay.querySelector('#pfDesc').value.trim();
    const isNew = overlay.querySelector('#pfIsNew').checked;
    const onSale = overlay.querySelector('#pfOnSale').checked;
    const discountPercent = onSale ? (parseInt(overlay.querySelector('#pfDiscountPercent').value, 10) || null) : null;
    const discountPrice = onSale ? calcDiscountPrice(price, discountPercent) : null;

    const selectedLabels = getSelectedSizeLabels(overlay, category);
    const measurementsByLabel = getMeasurementsForLabels(selectedLabels);
    const sizes = selectedLabels.map(label => ({
      label,
      measurements: measurementsByLabel[label] || {}
    }));

    const details = {
      tela: overlay.querySelector('#pfTela').value.trim(),
      cuidado: overlay.querySelector('#pfCuidado').value.trim(),
      origen: overlay.querySelector('#pfOrigen').value.trim()
    };

    // El primer color de la lista es el que define el degradado de la
    // tarjeta (catálogo, inicio y tabla del admin). El stock se guarda por
    // talla dentro de cada color, para que varíe entre uno y otro.
    const colors = formColors.map(c => {
      const stock = {};
      selectedLabels.forEach(label => {
        const n = parseInt(c.stock[label], 10);
        stock[label] = isNaN(n) || n < 0 ? 0 : n;
      });
      return {
        name: c.name.trim() || 'Color',
        hex: c.hex,
        note: c.note.trim(),
        images: c.images.map(i => i.trim()).filter(Boolean),
        stock
      };
    });
    const gradient = `linear-gradient(150deg,#221f1a,${colors[0].hex})`;

    const ov = getAdminOverrides();
    const patch = { name, sku, category, price, description, isNew, onSale, discountPercent, discountPrice, sizes, details, colors, gradient };

    if (editing) {
      const isAdded = ov.added.some(p => p.id === editing.id);
      if (isAdded) {
        ov.added = ov.added.map(p => (p.id === editing.id ? Object.assign({}, p, patch) : p));
      } else {
        ov.edits[editing.id] = Object.assign({}, ov.edits[editing.id], patch);
      }
    } else {
      const allIds = PRODUCTS.map(p => p.id).concat(ov.added.map(p => p.id));
      const newId = allIds.length ? Math.max(...allIds) + 1 : 1;
      ov.added.push(Object.assign({
        id: newId,
        sizes: sizes.length ? sizes : [{ label: 'Única', measurements: {} }],
        featured: false
      }, patch));
    }

    saveAdminOverrides(ov);
    closeProductForm();
    renderProductsTable();
    renderStats();
    renderPromosTable();
    showToast(editing ? 'Producto editado correctamente.' : 'Producto agregado correctamente.');
  }

  // ---------- Promociones ----------
  function promoStatus(p) {
    const today = new Date().toISOString().slice(0, 10);
    if (p.saleStart && today < p.saleStart) return { label: 'Programada', slug: 'en-preparacion' };
    if (p.saleEnd && today > p.saleEnd) return { label: 'Expirada', slug: 'cancelado' };
    return { label: 'Activa', slug: 'entregado' };
  }

  function formatDateEs(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  function renderPromosTable() {
    const promos = getStoreProducts().filter(p => p.onSale);
    document.getElementById('adminPromosBody').innerHTML = promos.map(p => {
      const status = promoStatus(p);
      const vigencia = (p.saleStart || p.saleEnd)
        ? `${formatDateEs(p.saleStart) || '—'} – ${formatDateEs(p.saleEnd) || '—'}`
        : 'Sin fecha límite';
      return `
      <tr>
        <td><span class="admin-swatch" style="background:${p.gradient}"></span></td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td>${p.discountPercent ? `-${p.discountPercent}%` : '—'}</td>
        <td>$${p.discountPrice || '—'}</td>
        <td>${vigencia}</td>
        <td><span class="admin-status admin-status--${status.slug}">${status.label}</span></td>
        <td class="admin-table-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-edit-promo="${p.id}">Editar</button>
          <button type="button" class="btn btn-ghost btn-sm admin-btn-danger" data-remove-promo="${p.id}">Quitar</button>
        </td>
      </tr>
    `;
    }).join('');
    document.getElementById('adminPromosEmpty').hidden = promos.length > 0;

    document.querySelectorAll('[data-edit-promo]').forEach(btn => {
      btn.addEventListener('click', () => openPromoForm(parseInt(btn.dataset.editPromo, 10)));
    });
    document.querySelectorAll('[data-remove-promo]').forEach(btn => {
      btn.addEventListener('click', () => removePromo(parseInt(btn.dataset.removePromo, 10)));
    });
  }

  function removePromo(id) {
    const product = getStoreProducts().find(p => p.id === id);
    if (!product) return;
    showConfirmModal(`¿Quitar la promoción de "${product.name}"? El producto seguirá existiendo, solo dejará de estar en oferta.`, () => {
      applyProductPatch(id, { onSale: false, discountPercent: null, discountPrice: null, saleStart: '', saleEnd: '' });
      renderProductsTable();
      renderStats();
      renderPromosTable();
      showToast('Promoción eliminada correctamente.');
    });
  }

  // Aplica un patch a un producto existente (editado por el admin o agregado por él),
  // usado tanto por el formulario de productos como por el de promociones.
  function applyProductPatch(id, patch) {
    const ov = getAdminOverrides();
    const isAdded = ov.added.some(p => p.id === id);
    if (isAdded) {
      ov.added = ov.added.map(p => (p.id === id ? Object.assign({}, p, patch) : p));
    } else {
      ov.edits[id] = Object.assign({}, ov.edits[id], patch);
    }
    saveAdminOverrides(ov);
  }

  // ---------- Formulario: agregar / editar promoción ----------
  let promoModalEl = null;

  function buildPromoModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'promoFormModal';
    overlay.innerHTML = `
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="promoFormTitle">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <h3 id="promoFormTitle">Agregar promoción</h3>
        <form id="promoForm">
          <div class="login-field">
            <label for="pmProduct">Producto</label>
            <select id="pmProduct" required></select>
          </div>
          <div class="login-field">
            <label for="pmPercent">Porcentaje de descuento (%)</label>
            <input type="number" id="pmPercent" min="1" max="90" placeholder="Ej. 20" required>
            <p class="admin-field-hint" id="pmPreview"></p>
          </div>
          <div class="admin-form-row">
            <div class="login-field">
              <label for="pmStart">Vigente desde</label>
              <input type="date" id="pmStart" required>
            </div>
            <div class="login-field">
              <label for="pmEnd">Vigente hasta</label>
              <input type="date" id="pmEnd" required>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="pmCancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closePromoForm();
    });
    overlay.querySelector('.modal-close').addEventListener('click', closePromoForm);
    overlay.querySelector('#pmCancel').addEventListener('click', closePromoForm);
    const updatePreview = () => {
      const select = overlay.querySelector('#pmProduct');
      const price = parseInt(select.selectedOptions[0]?.dataset.price, 10) || 0;
      const percent = parseInt(overlay.querySelector('#pmPercent').value, 10) || 0;
      const preview = overlay.querySelector('#pmPreview');
      if (!price || !percent) { preview.textContent = ''; return; }
      preview.innerHTML = `Precio de oferta: <span class="prod-price-old">$${price}</span> $${calcDiscountPrice(price, percent)} MXN`;
    };
    overlay.querySelector('#pmProduct').addEventListener('change', updatePreview);
    overlay.querySelector('#pmPercent').addEventListener('input', updatePreview);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('open')) closePromoForm();
    });

    return overlay;
  }

  function closePromoForm() {
    if (!promoModalEl) return;
    promoModalEl.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function openPromoForm(editId) {
    const overlay = promoModalEl || (promoModalEl = buildPromoModal());
    const products = getStoreProducts();
    const editing = editId ? products.find(p => p.id === editId) : null;

    const select = overlay.querySelector('#pmProduct');
    select.innerHTML = products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} (${p.sku})</option>`).join('');
    select.disabled = !!editing;

    overlay.querySelector('#promoFormTitle').textContent = editing ? 'Editar promoción' : 'Agregar promoción';
    if (editing) {
      select.value = editing.id;
      overlay.querySelector('#pmPercent').value = editing.discountPercent || '';
      overlay.querySelector('#pmStart').value = editing.saleStart || todayStr();
      overlay.querySelector('#pmEnd').value = editing.saleEnd || '';
    } else {
      overlay.querySelector('#pmPercent').value = '';
      overlay.querySelector('#pmStart').value = todayStr();
      overlay.querySelector('#pmEnd').value = '';
    }
    select.dispatchEvent(new Event('change'));

    overlay.querySelector('#promoForm').onsubmit = (event) => {
      event.preventDefault();
      const productId = parseInt(select.value, 10);
      const percent = parseInt(overlay.querySelector('#pmPercent').value, 10) || 0;
      const start = overlay.querySelector('#pmStart').value;
      const end = overlay.querySelector('#pmEnd').value;

      if (end && start && end < start) {
        showToast('La fecha "hasta" no puede ser antes que la fecha "desde".');
        return;
      }

      const product = products.find(p => p.id === productId);
      const discountPrice = calcDiscountPrice(product.price, percent);

      applyProductPatch(productId, {
        onSale: true,
        discountPercent: percent,
        discountPrice,
        saleStart: start,
        saleEnd: end
      });

      closePromoForm();
      renderProductsTable();
      renderStats();
      renderPromosTable();
      showToast(editing ? 'Promoción editada correctamente.' : 'Promoción agregada correctamente.');
    };

    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  // ---------- Inicializar ----------
  document.getElementById('btnAddProduct').addEventListener('click', () => openProductForm(null));
  document.getElementById('btnAddPromo').addEventListener('click', () => openPromoForm(null));

  renderStats();
  renderOrders();
  renderProductsTable();
  renderPromosTable();
}