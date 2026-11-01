const app = document.getElementById('app');

const state = {
  estados: [], municipios: [], localidades: [], perfiles: [],
  estadoId: '', municipioId: '', localidadId: '', perfilId: 'todos',
  dashboard: null, fichaId: null, vista: 'dashboard',
  busy: false, ready: false, error: ''
};

const glyphs = {
  chart: '<path d="M3 3v18h18"/><path d="M7 16v-4m5 4V8m5 8V5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  filter: '<path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="8" cy="7" r="2" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  back: '<path d="M19 12H5m7 7-7-7 7-7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7V2Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  shield: '<path d="m12 22 7-4V6l-7-4-7 4v12l7 4Z"/><path d="m9 12 2 2 4-4"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a16 16 0 0 1 0 18M12 3a16 16 0 0 0 0 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>',
  up: '<path d="m5 16 5-5 4 4 5-7"/><path d="M15 8h4v4"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'
};
function icon(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${glyphs[name] || glyphs.info}</svg>`;
}
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
function fmt(n, decimals = 1) { return Number(n).toLocaleString('es-MX', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }
function options(items, selected, firstLabel, emptyValue = '') {
  return `<option value="${esc(emptyValue)}">${esc(firstLabel)}</option>` + items.map(item =>
    `<option value="${esc(item.id)}" ${selected === item.id ? 'selected' : ''}>${esc(item.nombre)}</option>`).join('');
}
async function getJSON(url, options = {}) {
  const response = await fetch(url, options);
  let data;
  try { data = await response.json(); } catch { throw new Error('No se recibió una respuesta válida del servidor.'); }
  if (!response.ok) throw new Error(data.error || 'Ocurrió un error al consultar el servidor.');
  return data;
}

function sidebar() {
  return `<aside class="sidebar">
    <a class="brand" href="/" id="brand" aria-label="Volver al inicio">
      <span class="brand-symbol">${icon('chart')}</span><span><strong>PARTICIPA</strong><small>Inteligencia cívica</small></span>
    </a>
    <div class="sidebar-caption">ESPACIO DE ANÁLISIS</div>
    <button id="nav-dashboard" class="nav-item active" type="button">${icon('grid')}<span>Dashboard</span></button>
    <div class="sidebar-caption sidebar-caption-spaced">SOBRE EL PROYECTO</div>
    <div class="sidebar-descriptor">${icon('file')}<span>Reto 1<br><small>Perfiles ciudadanos de participación</small></span></div>
    <div class="side-bottom">
      <div class="side-illustration">${icon('shield')}<span>Información agregada<br><strong>Sin datos personales</strong></span></div>
      <div class="demo-mark"><span class="demo-dot"></span> PROTOTIPO DEMOSTRATIVO</div>
    </div>
  </aside>`;
}
function topbar() {
  return `<header class="topbar"><div class="breadcrumb">Hackea la participación <span>/</span> Reto 1 <span>/</span> <b>${state.vista === 'detalle' ? 'Ficha de perfil' : 'Explorador'}</b></div><div class="topbar-right"><span class="online-circle"></span> Entorno de demostración <span class="top-icon">${icon('shield')}</span></div></header>`;
}
function introduction() {
  return `<div class="intro"><div><span class="eyebrow">EXPLORADOR DE PARTICIPACIÓN ELECTORAL</span><h1>Conoce los perfiles de<br><em>participación ciudadana.</em></h1><p>Explora cuatro perfiles identificados en el análisis 2009–2024 y consulta acciones de información y educación cívica para cada uno.</p></div><div class="intro-art" aria-hidden="true"><div class="arc arc-one"></div><div class="arc arc-two"></div><div class="arc arc-three"></div><span class="floating-shape shape-a"></span><span class="floating-shape shape-b"></span><div class="art-center">${icon('users')}</div></div></div>`;
}
function selector(id, label, htmlOptions, disabled = false, helper = '') {
  return `<label class="form-field" for="${id}"><span class="field-label">${label}</span><span class="select-wrap"><select id="${id}" ${disabled ? 'disabled' : ''}>${htmlOptions}</select><span class="select-caret">⌄</span></span>${helper ? `<small>${helper}</small>` : ''}</label>`;
}
function filters() {
  return `<section class="filter-panel" aria-labelledby="filter-title"><div class="panel-title-row"><div class="panel-heading"><div class="heading-icon">${icon('filter')}</div><div><h2 id="filter-title">Filtra la información</h2><p>Selecciona una ubicación y el perfil que deseas explorar</p></div></div><div class="panel-label">4 filtros disponibles</div></div>
  <div class="filter-form">
    ${selector('estado', '01 · Estado', options(state.estados, state.estadoId, 'Selecciona un estado'), !state.ready || state.busy)}
    ${selector('municipio', '02 · Municipio', options(state.municipios, state.municipioId, 'Todos los municipios'), !state.estadoId || state.busy)}
    ${selector('localidad', '03 · Localidad', options(state.localidades, state.localidadId, 'Todas las localidades'), !state.municipioId || state.busy)}
    ${selector('perfil', '04 · Perfil ciudadano', options(state.perfiles, state.perfilId, 'Todos los perfiles', 'todos'), !state.ready || state.busy)}
  </div>
  <div class="filter-footer"><span>${icon('info')} Los datos por perfil son fijos en esta demostración.</span><button class="primary-button" type="button" id="aplicar" ${state.busy || !state.ready ? 'disabled' : ''}>${state.busy ? 'Consultando...' : 'Aceptar'} ${icon('arrow')}</button></div></section>`;
}
function emptyState() {
  return `<section class="empty-state"><div class="empty-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="empty-center">${icon('chart')}</div><span class="empty-point point-one"></span><span class="empty-point point-two"></span><span class="empty-point point-three"></span></div><span class="empty-eyebrow">LISTO PARA EXPLORAR</span><h2>Tu análisis comienza aquí</h2><p>Selecciona un estado, ajusta los demás filtros si lo necesitas y presiona <strong>Aceptar</strong> para visualizar el dashboard.</p><div class="steps"><span><b>1</b> Elige filtros</span><span class="step-line"></span><span><b>2</b> Aceptar</span><span class="step-line"></span><span><b>3</b> Explora perfiles</span></div></section>`;
}
function statistic(label, value, suffix, name) {
  return `<div class="stat-card"><div class="stat-icon">${icon(name)}</div><div class="stat-value">${esc(value)}${suffix ? `<span>${esc(suffix)}</span>` : ''}</div><div class="stat-label">${esc(label)}</div></div>`;
}
function profileCard(p) {
  return `<article class="profile-card" style="--profile-color:${esc(p.color)}"><div class="profile-card-top"><span class="p-icon">${icon(p.id === '1' ? 'users' : p.id === '2' ? 'shield' : p.id === '3' ? 'clock' : 'up')}</span><span class="profile-num">PERFIL 0${esc(p.id)}</span></div><div class="profile-card-heading"><h3>${esc(p.nombre)}</h3><span>${esc(p.etiqueta)}</span></div><div class="participation-head"><strong>${fmt(p.participacion)}%</strong><span>participación promedio</span></div><div class="progress-track"><span style="width:${p.participacion}%"></span></div><div class="p-secondary"><div><b>${fmt(p.porcentajeListaNominal)}%</b><small>de la lista nominal</small></div><div><b>${esc(p.edad.etiqueta)}</b><small>grupo destacado</small></div></div><div class="card-strategy"><span>ESTRATEGIA DESTACADA</span><p>${esc(p.estrategiaTitulo)}</p></div><button class="card-open" data-profile="${esc(p.id)}" type="button">Ver ficha completa ${icon('arrow')}</button></article>`;
}
function chart(p) {
  return `<div class="chart-row"><div class="chart-name">${esc(p.nombre)}</div><div class="chart-lane"><div class="chart-fill" style="width:${p.participacion}%;background:${esc(p.color)}"></div></div><strong>${fmt(p.participacion)}%</strong></div>`;
}
function resultDashboard(data) {
  const sel = data.territorio;
  const per = data.perfiles;
  return `<div class="results" id="resultados"><div class="result-heading"><div><span class="eyebrow">RESULTADOS DE LA CONSULTA</span><h2>Panel de resultados</h2><p>${icon('pin')} ${esc(sel.estado)} <span class="dot-sep">·</span> ${esc(sel.municipio)} <span class="dot-sep">·</span> ${esc(sel.localidad)}</p></div><span class="result-chip">${icon('check')} Consulta aplicada</span></div>
    <div class="note-demo">${icon('info')} <span><strong>Datos fijos de demostración:</strong> la ubicación seleccionada organiza la consulta, pero las cifras mostradas corresponden a perfiles nacionales; no representan valores del municipio ni la localidad elegidos.</span></div>
    <div class="stats-grid">
      ${statistic('Perfiles visibles', per.length, '', 'users')}
      ${statistic('Lista nominal en perfiles', fmt(data.resumen.listaNominalMillones, 2), 'M', 'grid')}
      ${statistic('Participación promedio', fmt(data.resumen.participacionPromedio), '%', 'chart')}
      ${statistic('Período de análisis', data.resumen.periodo, '', 'clock')}
    </div>
    <div class="section-header"><div><span class="eyebrow">SEGMENTACIÓN CIUDADANA</span><h2>Perfiles identificados</h2></div><span class="plain-count">${per.length} ${per.length === 1 ? 'perfil' : 'perfiles'}</span></div>
    <div class="profiles-grid">${per.map(profileCard).join('')}</div>
    <div class="analytics-grid"><section class="viz-panel"><div class="viz-header"><div><h3>Participación electoral por perfil</h3><p>Promedio 2009–2024, valores nacionales del documento técnico</p></div>${icon('chart')}</div><div class="chart-body">${per.map(chart).join('')}</div><p class="viz-caption">Fuente: CCPC 2009–2024. Datos fijos por perfil.</p></section>
    <section class="impact-panel"><span class="impact-icon">${icon('target')}</span><span class="eyebrow">¿PARA QUÉ SIRVE?</span><h3>Una estrategia para cada realidad</h3><p>La misma participación promedio puede ocultar patrones distintos. Este prototipo muestra sus características y las acciones de información electoral propuestas en el documento técnico.</p><div class="impact-footer">${icon('shield')} Información agregada y sin datos personales</div></section></div>
  </div>`;
}
function detail() {
  const p = state.dashboard?.perfiles.find(item => item.id === state.fichaId);
  if (!p) { state.vista = 'dashboard'; return dashboardView(); }
  return `<main class="main-content"><div class="details-page" style="--profile-color:${esc(p.color)}"><button class="back-button" id="volver" type="button">${icon('back')} Volver a resultados</button>
    <div class="detail-hero"><div class="detail-hero-text"><span class="hero-tag">FICHA ESTÁTICA · PERFIL 0${esc(p.id)}</span><h1>${esc(p.nombre)}</h1><p>${esc(p.resumen)}</p><div class="hero-pills"><span>${icon('users')} ${fmt(p.porcentajeListaNominal)}% lista nominal</span><span>${icon('chart')} ${fmt(p.participacion)}% participación</span></div></div><div class="hero-graphic">${icon(p.id === '1' ? 'users' : p.id === '2' ? 'shield' : p.id === '3' ? 'clock' : 'up')}</div></div>
    <div class="detail-warning">${icon('info')} Esta ficha presenta indicadores nacionales fijos del perfil. No son cifras específicas del territorio seleccionado.</div>
    <div class="detail-grid"><section class="detail-card barrier-card"><div class="detail-card-label">${icon('shield')} BARRERA INTERPRETATIVA</div><h2>${esc(p.barrera)}</h2><p>${esc(p.descripcionBarrera)}</p><small>La barrera es una hipótesis de interpretación, no una causa individual demostrada.</small></section>
    <section class="detail-card"><div class="detail-card-label">${icon('pin')} DISTRIBUCIÓN POR REGIÓN</div><div class="regions-list">${p.regiones.map(r => `<div class="region-entry"><span>${esc(r.nombre)}</span><strong>${fmt(r.porcentaje)}%</strong><div class="mini-track"><i style="width:${r.porcentaje}%"></i></div></div>`).join('')}</div><small>Regiones con mayor peso dentro de este perfil.</small></section>
    <section class="detail-card"><div class="detail-card-label">${icon('users')} COMPOSICIÓN POR EDAD</div><div class="age-value">${fmt(p.edad.porcentaje)}<span>%</span></div><h3>${esc(p.edad.etiqueta)}</h3><p>Proporción del perfil perteneciente al grupo de edad señalado.</p><div class="age-progress"><div style="width:${p.edad.porcentaje}%"></div></div></section>
    <section class="detail-card"><div class="detail-card-label">${icon('users')} COMPOSICIÓN POR SEXO</div><div class="gender-metrics"><div><span class="legend-marker women"></span><b>${fmt(p.genero.mujeres)}%</b><small>Mujeres</small></div><div><span class="legend-marker men"></span><b>${fmt(p.genero.hombres)}%</b><small>Hombres</small></div></div><div class="gender-track"><div class="women-fill" style="width:${p.genero.mujeres}%"></div><div class="men-fill" style="width:${p.genero.hombres}%"></div></div></section>
    </div>
    <section class="strategy-panel"><div class="strategy-header"><div class="strategy-icon">${icon('target')}</div><div><span>PROPUESTA DE INTERVENCIÓN</span><h2>${esc(p.estrategiaTitulo)}</h2><p>${esc(p.objetivo)}</p></div></div><div class="strategy-content"><div><h3>Acciones propuestas</h3><ul class="actions">${p.estrategias.map(t => `<li>${icon('check')} <span>${esc(t)}</span></li>`).join('')}</ul></div><div class="channels-box"><h3>Canales de comunicación</h3><div class="channel-pills">${p.canales.map(c => `<span>${esc(c)}</span>`).join('')}</div><h3>Recursos institucionales</h3><p>${esc(p.recursos)}</p></div></div></section>
    <div class="detail-footnote">${icon('book')} Documento técnico «¿Por qué no voto?», Reto 1 · Conteos Censales de Participación Ciudadana 2009–2024 · Prototipo académico, no oficial.</div>
  </div></main>`;
}
function dashboardView() {
  return `<main class="main-content">${introduction()}${filters()}${state.error ? `<div class="error-message" role="alert">${icon('info')} ${esc(state.error)}</div>` : ''}${state.dashboard ? resultDashboard(state.dashboard) : emptyState()}<footer class="footer">Reto 1 · Perfiles ciudadanos de participación <span>Demostración académica · No es un sitio oficial del INE</span></footer></main>`;
}
function render() {
  app.innerHTML = `<div class="shell">${sidebar()}<div class="workspace">${topbar()}${state.vista === 'detalle' ? detail() : dashboardView()}</div></div>`;
  bind();
}
function setError(error) { state.error = error.message || 'Ocurrió un error inesperado.'; state.busy = false; render(); }
function resetResult() { state.dashboard = null; state.error = ''; state.vista = 'dashboard'; }
async function changeState(id) {
  state.estadoId = id; state.municipioId = ''; state.localidadId = '';
  state.municipios = []; state.localidades = []; resetResult();
  if (!id) { render(); return; }
  state.busy = true; render();
  try { state.municipios = await getJSON(`/api/municipios?estadoId=${encodeURIComponent(id)}`); state.busy = false; render(); }
  catch (err) { setError(err); }
}
async function changeMunicipio(id) {
  state.municipioId = id; state.localidadId = ''; state.localidades = []; resetResult();
  if (!id) { render(); return; }
  state.busy = true; render();
  try { state.localidades = await getJSON(`/api/localidades?municipioId=${encodeURIComponent(id)}`); state.busy = false; render(); }
  catch (err) { setError(err); }
}
async function apply() {
  if (!state.estadoId) { state.error = 'Primero selecciona un estado.'; render(); return; }
  state.busy = true; state.error = ''; state.dashboard = null; render();
  try {
    state.dashboard = await getJSON('/api/dashboard', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estadoId: state.estadoId, municipioId: state.municipioId, localidadId: state.localidadId, perfilId: state.perfilId })
    });
    state.busy = false; render();
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) { setError(err); }
}
function bind() {
  document.getElementById('nav-dashboard')?.addEventListener('click', () => { state.vista = 'dashboard'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.getElementById('brand')?.addEventListener('click', e => { e.preventDefault(); state.vista = 'dashboard'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.getElementById('estado')?.addEventListener('change', e => changeState(e.target.value));
  document.getElementById('municipio')?.addEventListener('change', e => changeMunicipio(e.target.value));
  document.getElementById('localidad')?.addEventListener('change', e => { state.localidadId = e.target.value; resetResult(); render(); });
  document.getElementById('perfil')?.addEventListener('change', e => { state.perfilId = e.target.value; resetResult(); render(); });
  document.getElementById('aplicar')?.addEventListener('click', apply);
  document.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', () => {
    state.fichaId = button.dataset.profile; state.vista = 'detalle'; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  document.getElementById('volver')?.addEventListener('click', () => { state.vista = 'dashboard'; render(); document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}
async function start() {
  render();
  try {
    const [estados, perfiles] = await Promise.all([getJSON('/api/estados'), getJSON('/api/perfiles')]);
    state.estados = estados; state.perfiles = perfiles; state.ready = true; render();
  } catch (err) { state.error = 'No se pudo conectar con el backend: ' + err.message; render(); }
}
start();
