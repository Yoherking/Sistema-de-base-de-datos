const API_URL = '/api/repuestos';
const tablaBody = document.getElementById('tablaRepuestos');
const contador = document.getElementById('contador');
const estadoTabla = document.getElementById('estadoTabla');
const buscador = document.getElementById('buscador');
const totalRepuestosEl = document.getElementById('totalRepuestos');
const valorInventarioEl = document.getElementById('valorInventario');
const stockBajoEl = document.getElementById('stockBajo');
const form = document.getElementById('formRepuesto');
const modalElement = document.getElementById('modalRepuesto');
const modal = new bootstrap.Modal(modalElement);

const modalTitle = document.getElementById('modalTitle');
const idRepuestoInput = document.getElementById('idRepuesto');
const nombreInput = document.getElementById('nombre');
const codigoParteInput = document.getElementById('codigoParte');
const precioInput = document.getElementById('precio');
const stockInput = document.getElementById('stock');

let repuestosData = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(value || 0);
}

function resetForm() {
  form.reset();
  idRepuestoInput.value = '';
  modalTitle.textContent = 'Registrar repuesto';
}

function actualizarMetricas() {
  totalRepuestosEl.textContent = repuestosData.length;
  const valorInventario = repuestosData.reduce((total, repuesto) => total + (Number(repuesto.precio) * Number(repuesto.stock || 0)), 0);
  valorInventarioEl.textContent = formatCurrency(valorInventario);
  const stockBajo = repuestosData.filter((repuesto) => Number(repuesto.stock || 0) < 5).length;
  stockBajoEl.textContent = stockBajo;
}

function renderTabla(repuestos) {
  const filtro = buscador.value.trim().toLowerCase();
  const filtrados = repuestos.filter((repuesto) => {
    const texto = `${repuesto.nombre || ''} ${repuesto.codigoParte || ''} ${repuesto.stock || ''}`.toLowerCase();
    return texto.includes(filtro);
  });

  if (!filtrados.length) {
    tablaBody.innerHTML = '<tr><td colspan="6" class="text-muted">No hay repuestos que coincidan con la búsqueda.</td></tr>';
    contador.textContent = '0 registros';
    return;
  }

  contador.textContent = `${filtrados.length} registro${filtrados.length > 1 ? 's' : ''}`;
  tablaBody.innerHTML = filtrados.map((repuesto) => `
    <tr>
      <td>${escapeHtml(repuesto.idRepuesto)}</td>
      <td>${escapeHtml(repuesto.nombre)}</td>
      <td>${escapeHtml(repuesto.codigoParte)}</td>
      <td>${formatCurrency(Number(repuesto.precio || 0))}</td>
      <td>${escapeHtml(repuesto.stock)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-2" onclick="editarRepuesto(${repuesto.idRepuesto})">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarRepuesto(${repuesto.idRepuesto})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function cargarRepuestos() {
  estadoTabla.textContent = 'Cargando repuestos...';
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar los repuestos');
    repuestosData = await response.json();
    actualizarMetricas();
    renderTabla(repuestosData);
    estadoTabla.textContent = 'Lista actualizada correctamente.';
  } catch (error) {
    console.error(error);
    tablaBody.innerHTML = '<tr><td colspan="6" class="text-danger">No se pudieron cargar los repuestos.</td></tr>';
    estadoTabla.textContent = 'No se pudo cargar la información. Intenta de nuevo.';
  }
}

async function guardarRepuesto(event) {
  event.preventDefault();

  const nombre = nombreInput.value.trim();
  const codigoParte = codigoParteInput.value.trim();
  const precio = parseFloat(precioInput.value);
  const stock = parseInt(stockInput.value, 10);

  if (!nombre || !codigoParte || Number.isNaN(precio) || Number.isNaN(stock)) {
    alert('Completa todos los campos para guardar el repuesto.');
    return;
  }

  const payload = {
    nombre,
    codigoParte,
    precio,
    stock
  };

  const id = idRepuestoInput.value;

  try {
    const options = {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('No se pudo guardar el repuesto');

    modal.hide();
    resetForm();
    await cargarRepuestos();
  } catch (error) {
    console.error(error);
    alert('Ocurrió un error al guardar el repuesto.');
  }
}

async function editarRepuesto(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Repuesto no encontrado');
    const repuesto = await response.json();

    idRepuestoInput.value = repuesto.idRepuesto;
    nombreInput.value = repuesto.nombre;
    codigoParteInput.value = repuesto.codigoParte;
    precioInput.value = repuesto.precio;
    stockInput.value = repuesto.stock;
    modalTitle.textContent = 'Editar repuesto';
    modal.show();
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el repuesto para editar.');
  }
}

async function eliminarRepuesto(id) {
  const confirmado = confirm('¿Desea eliminar este repuesto?');
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('No se pudo eliminar');
    await cargarRepuestos();
  } catch (error) {
    console.error(error);
    alert('No se pudo eliminar el repuesto.');
  }
}

document.getElementById('btnNuevo').addEventListener('click', () => {
  resetForm();
  modal.show();
});

document.getElementById('btnRefrescar').addEventListener('click', cargarRepuestos);
buscador.addEventListener('input', () => renderTabla(repuestosData));
form.addEventListener('submit', guardarRepuesto);

window.addEventListener('DOMContentLoaded', cargarRepuestos);
