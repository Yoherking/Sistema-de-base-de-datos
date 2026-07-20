const API_BASE = 'http://localhost:8083/api';
const endpointMap = {
  repuestos: 'repuestos',
  clientes: 'clientes',
  vehiculos: 'vehiculos',
  pedidos: 'pedidos',
  ventas: 'ventas',
  'detalle-pedido': 'detalle-pedido',
  compatibilidad: 'compatibilidad'
};

const state = {
  currentSection: 'repuestos',
  currentMode: 'create',
  currentId: null,
  currentSecondaryId: null,
  data: {},
  references: {
    repuestos: [],
    clientes: [],
    vehiculos: [],
    pedidos: []
  }
};

const modal = new bootstrap.Modal(document.getElementById('modalEntidad'));
const form = document.getElementById('formEntidad');
const modalTitle = document.getElementById('modalTitle');
const idEntidadInput = document.getElementById('idEntidad');
const formFields = document.getElementById('formFields');
const btnNuevo = document.getElementById('btnNuevo');
const btnLogout = document.getElementById('btnLogout');
const pageTitle = document.getElementById('pageTitle');

const tables = {
  repuestos: document.getElementById('tablaRepuestos'),
  clientes: document.getElementById('tablaClientes'),
  vehiculos: document.getElementById('tablaVehiculos'),
  pedidos: document.getElementById('tablaPedidos'),
  ventas: document.getElementById('tablaVentas'),
  'detalle-pedido': document.getElementById('tablaDetallePedido'),
  compatibilidad: document.getElementById('tablaCompatibilidad')
};

function ensureAuthenticated() {
  const auth = localStorage.getItem('tiendaAuth');
  if (!auth) {
    window.location.href = 'login.html';
  }
}

function setActiveSection(section) {
  state.currentSection = section;
  document.querySelectorAll('.nav-link').forEach((btn) => btn.classList.toggle('active', btn.dataset.section === section));
  document.querySelectorAll('.content-section').forEach((el) => el.classList.toggle('active', el.id === `${section}Section`));
  const titles = {
    repuestos: 'Gestión de repuestos',
    clientes: 'Gestión de clientes',
    vehiculos: 'Gestión de vehículos',
    pedidos: 'Gestión de pedidos',
    ventas: 'Gestión de ventas',
    'detalle-pedido': 'Detalle de pedidos',
    compatibilidad: 'Compatibilidad de vehículos'
  };
  pageTitle.textContent = titles[section];
  loadSectionData(section);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDateTime(value) {
  if (!value) return '—';
  return String(value).replace('T', ' ').replace(':00', '').replace('.000000', '');
}

function getReferenceLabel(section, value) {
  const items = state.references[section] || [];
  const item = items.find((entry) => String(entry.idRepuesto ?? entry.idCliente ?? entry.idVehiculo ?? entry.idPedido) === String(value));
  if (!item) return value;
  if (section === 'repuestos') return `${item.nombre} (${item.codigoParte || 'Sin código'})`;
  if (section === 'clientes') return `${item.nombre} (${item.telefono || 'Sin teléfono'})`;
  if (section === 'vehiculos') return `${item.marca} ${item.modelo}`;
  if (section === 'pedidos') return `Pedido #${item.idPedido}`;
  return value;
}

function renderTable(section, items = []) {
  const table = tables[section];
  if (!table) return;

  if (!items.length) {
    table.innerHTML = '<tr><td colspan="10" class="text-muted">No hay registros para mostrar.</td></tr>';
    return;
  }

  const rows = {
    repuestos: items.map((item) => `
      <tr>
        <td>${escapeHtml(item.idRepuesto)}</td>
        <td>${escapeHtml(item.nombre)}</td>
        <td>${escapeHtml(item.codigoParte)}</td>
        <td>${escapeHtml(item.precio)}</td>
        <td>${escapeHtml(item.stock)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('repuestos', ${item.idRepuesto})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('repuestos', ${item.idRepuesto})">Eliminar</button>
        </td>
      </tr>`),
    clientes: items.map((item) => `
      <tr>
        <td>${escapeHtml(item.idCliente)}</td>
        <td>${escapeHtml(item.nombre)}</td>
        <td>${escapeHtml(item.telefono)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('clientes', ${item.idCliente})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('clientes', ${item.idCliente})">Eliminar</button>
        </td>
      </tr>`),
    vehiculos: items.map((item) => `
      <tr>
        <td>${escapeHtml(item.idVehiculo)}</td>
        <td>${escapeHtml(item.marca)}</td>
        <td>${escapeHtml(item.modelo)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('vehiculos', ${item.idVehiculo})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('vehiculos', ${item.idVehiculo})">Eliminar</button>
        </td>
      </tr>`),
    pedidos: items.map((item) => `
      <tr>
        <td>${escapeHtml(item.idPedido)}</td>
        <td>${escapeHtml(getReferenceLabel('clientes', item.idCliente))}</td>
        <td>${escapeHtml(getReferenceLabel('vehiculos', item.idVehiculo))}</td>
        <td>${escapeHtml(formatDateTime(item.fechaPedido))}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('pedidos', ${item.idPedido})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('pedidos', ${item.idPedido})">Eliminar</button>
        </td>
      </tr>`),
    ventas: items.map((item) => `
      <tr>
        <td>${escapeHtml(item.idVenta)}</td>
        <td>${escapeHtml(getReferenceLabel('pedidos', item.idPedido))}</td>
        <td>${escapeHtml(formatDateTime(item.fechaVenta))}</td>
        <td>${escapeHtml(item.metodoPago)}</td>
        <td>${escapeHtml(item.montoTotal)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('ventas', ${item.idVenta})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('ventas', ${item.idVenta})">Eliminar</button>
        </td>
      </tr>`),
    'detalle-pedido': items.map((item) => `
      <tr>
        <td>${escapeHtml(item.idDetalle)}</td>
        <td>${escapeHtml(getReferenceLabel('pedidos', item.idPedido))}</td>
        <td>${escapeHtml(getReferenceLabel('repuestos', item.idRepuesto))}</td>
        <td>${escapeHtml(item.cantidad)}</td>
        <td>${escapeHtml(item.precioUnitario)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('detalle-pedido', ${item.idDetalle})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('detalle-pedido', ${item.idDetalle})">Eliminar</button>
        </td>
      </tr>`),
    compatibilidad: items.map((item) => `
      <tr>
        <td>${escapeHtml(getReferenceLabel('repuestos', item.idRepuesto))}</td>
        <td>${escapeHtml(getReferenceLabel('vehiculos', item.idVehiculo))}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarItem('compatibilidad', ${item.idRepuesto}, ${item.idVehiculo})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('compatibilidad', ${item.idRepuesto}, ${item.idVehiculo})">Eliminar</button>
        </td>
      </tr>`)
  };

  table.innerHTML = (rows[section] || []).join('');
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Solicitud fallida');
  }
  return response.json();
}

async function loadReferenceData() {
  const references = ['repuestos', 'clientes', 'vehiculos', 'pedidos'];
  await Promise.all(references.map(async (section) => {
    try {
      const data = await fetchJson(`${API_BASE}/${endpointMap[section]}`);
      state.references[section] = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(error);
    }
  }));
}

async function loadSectionData(section) {
  try {
    if (!state.references.repuestos.length || !state.references.vehiculos.length || !state.references.pedidos.length) {
      await loadReferenceData();
    }

    const response = await fetch(`${API_BASE}/${endpointMap[section]}`);
    if (!response.ok) throw new Error('Error cargando datos');
    state.data[section] = await response.json();
    renderTable(section, state.data[section]);
  } catch (error) {
    console.error(error);
    tables[section].innerHTML = '<tr><td colspan="10" class="text-danger">No se pudieron cargar los datos.</td></tr>';
  }
}

function getFieldConfig(section) {
  const configs = {
    repuestos: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'codigoParte', label: 'Código de parte', type: 'text' },
      { name: 'precio', label: 'Precio', type: 'number' },
      { name: 'stock', label: 'Stock', type: 'number' }
    ],
    clientes: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' }
    ],
    vehiculos: [
      { name: 'marca', label: 'Marca', type: 'text' },
      { name: 'modelo', label: 'Modelo', type: 'text' }
    ],
    pedidos: [
      { name: 'idCliente', label: 'Cliente', type: 'select', optionsKey: 'clientes', optionValue: 'idCliente', optionLabel: (item) => `${item.nombre} (${item.telefono || 'Sin teléfono'})` },
      { name: 'idVehiculo', label: 'Vehículo', type: 'select', optionsKey: 'vehiculos', optionValue: 'idVehiculo', optionLabel: (item) => `${item.marca} ${item.modelo}` },
      { name: 'fechaPedido', label: 'Fecha del pedido', type: 'datetime-local' }
    ],
    ventas: [
      { name: 'idPedido', label: 'Pedido', type: 'select', optionsKey: 'pedidos', optionValue: 'idPedido', optionLabel: (item) => `Pedido #${item.idPedido}` },
      { name: 'fechaVenta', label: 'Fecha de venta', type: 'datetime-local' },
      { name: 'metodoPago', label: 'Método de pago', type: 'text' },
      { name: 'montoTotal', label: 'Monto total', type: 'number' }
    ],
    'detalle-pedido': [
      { name: 'idPedido', label: 'Pedido', type: 'select', optionsKey: 'pedidos', optionValue: 'idPedido', optionLabel: (item) => `Pedido #${item.idPedido}` },
      { name: 'idRepuesto', label: 'Repuesto', type: 'select', optionsKey: 'repuestos', optionValue: 'idRepuesto', optionLabel: (item) => `${item.nombre} (${item.codigoParte || 'Sin código'})` },
      { name: 'cantidad', label: 'Cantidad', type: 'number' },
      { name: 'precioUnitario', label: 'Precio unitario', type: 'number' }
    ],
    compatibilidad: [
      { name: 'idRepuesto', label: 'Repuesto', type: 'select', optionsKey: 'repuestos', optionValue: 'idRepuesto', optionLabel: (item) => `${item.nombre} (${item.codigoParte || 'Sin código'})` },
      { name: 'idVehiculo', label: 'Vehículo', type: 'select', optionsKey: 'vehiculos', optionValue: 'idVehiculo', optionLabel: (item) => `${item.marca} ${item.modelo}` }
    ]
  };
  return configs[section] || [];
}

function getFieldValue(field, item) {
  const value = item?.[field.name];
  if (field.type === 'datetime-local' && value) {
    return String(value).replace(' ', 'T').slice(0, 16);
  }
  return value ?? '';
}

function renderFormFields(section, item = {}) {
  const fields = getFieldConfig(section);
  formFields.innerHTML = fields.map((field) => {
    if (field.type === 'select') {
      const options = state.references[field.optionsKey] || [];
      const selectedValue = getFieldValue(field, item);
      const optionMarkup = options.map((option) => `<option value="${option[field.optionValue]}" ${String(option[field.optionValue]) === String(selectedValue) ? 'selected' : ''}>${escapeHtml(field.optionLabel(option))}</option>`).join('');
      return `
        <div class="mb-3">
          <label class="form-label">${field.label}</label>
          <select class="form-select" name="${field.name}">
            <option value="">Seleccione...</option>
            ${optionMarkup}
          </select>
        </div>`;
    }

    return `
      <div class="mb-3">
        <label class="form-label">${field.label}</label>
        <input class="form-control" name="${field.name}" type="${field.type}" value="${escapeHtml(getFieldValue(field, item))}" />
      </div>`;
  }).join('');
}

function resetForm() {
  form.reset();
  idEntidadInput.value = '';
  state.currentMode = 'create';
  state.currentId = null;
  state.currentSecondaryId = null;
  formFields.innerHTML = '';
  modalTitle.textContent = 'Registrar elemento';
}

async function openCreateModal(section) {
  resetForm();
  await loadReferenceData();
  renderFormFields(section);
  modalTitle.textContent = `Registrar ${section}`;
  modal.show();
}

async function editarItem(section, id, secondaryId = null) {
  try {
    let item = null;
    if (section === 'compatibilidad') {
      item = state.data[section]?.find((entry) => String(entry.idRepuesto) === String(id) && String(entry.idVehiculo) === String(secondaryId)) || { idRepuesto: id, idVehiculo: secondaryId };
    } else {
      const response = await fetch(`${API_BASE}/${endpointMap[section]}/${id}`);
      if (!response.ok) throw new Error('No se pudo cargar');
      item = await response.json();
    }

    state.currentMode = 'edit';
    state.currentId = id;
    state.currentSecondaryId = secondaryId;
    idEntidadInput.value = id;
    await loadReferenceData();
    renderFormFields(section, item);
    modalTitle.textContent = `Editar ${section}`;
    modal.show();
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el elemento para editar.');
  }
}

async function eliminarItem(section, id, secondaryId = null) {
  if (!confirm('¿Desea eliminar este registro?')) return;
  try {
    const url = section === 'compatibilidad' ? `${API_BASE}/${endpointMap[section]}/${id}/${secondaryId}` : `${API_BASE}/${endpointMap[section]}/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error('No se pudo eliminar');
    await loadSectionData(section);
  } catch (error) {
    console.error(error);
    alert('No se pudo eliminar el registro.');
  }
}

function buildPayload(section) {
  const formData = Object.fromEntries(new FormData(form).entries());
  const fields = getFieldConfig(section);
  const payload = {};

  fields.forEach((field) => {
    const value = formData[field.name];
    if (field.type === 'number') {
      payload[field.name] = value === '' ? null : Number(value);
    } else if (field.type === 'datetime-local') {
      payload[field.name] = value ? `${value.replace('T', ' ')}:00` : null;
    } else {
      payload[field.name] = value;
    }
  });

  return payload;
}

async function guardarEntidad(event) {
  event.preventDefault();
  const section = state.currentSection;
  const payload = buildPayload(section);
  const url = state.currentMode === 'edit' && section !== 'compatibilidad'
    ? `${API_BASE}/${endpointMap[section]}/${state.currentId}`
    : state.currentMode === 'edit' && section === 'compatibilidad'
      ? `${API_BASE}/${endpointMap[section]}/${state.currentId}/${state.currentSecondaryId}`
      : `${API_BASE}/${endpointMap[section]}`;
  const method = state.currentMode === 'edit' ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('No se pudo guardar');
    modal.hide();
    resetForm();
    await loadSectionData(section);
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al guardar el registro.');
  }
}

document.querySelectorAll('.nav-link').forEach((btn) => btn.addEventListener('click', () => setActiveSection(btn.dataset.section)));
btnNuevo.addEventListener('click', () => openCreateModal(state.currentSection));
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('tiendaAuth');
  window.location.href = 'login.html';
});
form.addEventListener('submit', guardarEntidad);

window.addEventListener('DOMContentLoaded', async () => {
  ensureAuthenticated();
  await loadReferenceData();
  setActiveSection('repuestos');
});

window.editarItem = editarItem;
window.eliminarItem = eliminarItem;
