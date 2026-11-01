const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { estados, municipios, localidades } = require('./data/geografia');
const { perfiles } = require('./data/perfiles');

const PORT = Number(process.env.PORT || 3000);
const FRONTEND = path.resolve(__dirname, '..', 'frontend');

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function validarFiltros(filtros) {
  if (!filtros || typeof filtros !== 'object' || Array.isArray(filtros)) return 'Debes enviar los filtros.';
  const { estadoId, municipioId, localidadId, perfilId } = filtros;
  if (!estadoId || !estados.some(e => e.id === estadoId)) return 'Selecciona un estado válido.';
  if (municipioId && !municipios.some(m => m.id === municipioId && m.estadoId === estadoId)) return 'El municipio no corresponde al estado.';
  if (localidadId && !municipioId) return 'Selecciona primero un municipio.';
  if (localidadId && !localidades.some(l => l.id === localidadId && l.municipioId === municipioId)) return 'La localidad no corresponde al municipio.';
  if (perfilId && perfilId !== 'todos' && !perfiles.some(p => p.id === perfilId)) return 'Selecciona un perfil válido.';
  return null;
}

function resolverTerritorio(filtros) {
  return {
    estado: estados.find(e => e.id === filtros.estadoId).nombre,
    municipio: municipios.find(m => m.id === filtros.municipioId)?.nombre || 'Todos los municipios',
    localidad: localidades.find(l => l.id === filtros.localidadId)?.nombre || 'Todas las localidades'
  };
}

async function leerCuerpo(req) {
  let texto = '';
  for await (const fragmento of req) {
    texto += fragmento;
    if (texto.length > 10000) throw new Error('La solicitud es demasiado grande.');
  }
  try { return JSON.parse(texto); } catch { throw new Error('El cuerpo debe ser JSON válido.'); }
}

function servirArchivo(ruta, res) {
  const destino = path.resolve(FRONTEND, '.' + (ruta === '/' ? '/index.html' : ruta));
  if (!destino.startsWith(FRONTEND + path.sep) && destino !== FRONTEND) {
    res.writeHead(403); return res.end();
  }
  const tipo = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }[path.extname(destino)] || 'application/octet-stream';
  fs.readFile(destino, (err, buffer) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Archivo no encontrado'); }
    res.writeHead(200, { 'Content-Type': tipo + (tipo.startsWith('text/') ? '; charset=utf-8' : '') });
    res.end(buffer);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const ruta = url.pathname;
  if (req.method === 'GET' && ruta === '/api/estado') return json(res, 200, { estado: 'ok', modo: 'demo' });
  if (req.method === 'GET' && ruta === '/api/estados') return json(res, 200, estados);
  if (req.method === 'GET' && ruta === '/api/municipios') {
    return json(res, 200, municipios.filter(m => m.estadoId === url.searchParams.get('estadoId')).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
  }
  if (req.method === 'GET' && ruta === '/api/localidades') {
    return json(res, 200, localidades.filter(l => l.municipioId === url.searchParams.get('municipioId')).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
  }
  if (req.method === 'GET' && ruta === '/api/perfiles') {
    return json(res, 200, perfiles.map(p => ({ id: p.id, nombre: p.nombre })));
  }
  if (req.method === 'POST' && ruta === '/api/dashboard') {
    try {
      const filtros = await leerCuerpo(req);
      const error = validarFiltros(filtros);
      if (error) return json(res, 400, { error });
      const seleccion = filtros.perfilId && filtros.perfilId !== 'todos' ? perfiles.filter(p => p.id === filtros.perfilId) : perfiles;
      return json(res, 200, {
        territorio: resolverTerritorio(filtros),
        filtros: { ...filtros, perfilId: filtros.perfilId || 'todos' },
        resumen: {
          perfilesVisibles: seleccion.length,
          listaNominalMillones: Number(seleccion.reduce((s, p) => s + p.millonesListaNominal, 0).toFixed(2)),
          participacionPromedio: seleccion.length === 4 ? 55.1 : seleccion[0].participacion,
          periodo: '2009–2024'
        },
        perfiles: seleccion,
        aviso: 'Demostración: los filtros eligen la vista y las fichas conservan cifras nacionales fijas. No son estadísticas locales.'
      });
    } catch (err) { return json(res, 400, { error: err.message }); }
  }
  if (ruta.startsWith('/api/')) return json(res, 404, { error: 'Ruta API no encontrada.' });
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Método no permitido.' });
  return servirArchivo(ruta, res);
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`INE Dashboard demo: http://localhost:${PORT}`));
}
module.exports = { server };
