const url = require('url');
const staticRoutes = require('./staticRoutes');
const contactRoutes = require('./contactRoutes');
const authRoutes = require('./authRoutes');
const { enviar404, enviar405 } = require('../utils/responseHandlers');

// Mapa de rutas: { método: { ruta: callback } }
const routes = {
  GET: {
    ...staticRoutes.GET,
    ...contactRoutes.GET
  },
  POST: {
    ...contactRoutes.POST,
    ...authRoutes.POST
  }
};

// Router principal - Inyecta callbacks según la ruta
async function router(req, res) {
  const urlAnalizada = url.parse(req.url, true);
  const metodo = req.method;
  const ruta = urlAnalizada.pathname;
  
  // Buscar callback para el método y ruta
  const routeHandler = routes[metodo]?.[ruta];
  
  if (routeHandler) {
    // Ejecutar callback asíncrono inyectado
    await routeHandler(req, res, urlAnalizada);
  } else if (metodo === 'GET') {
    // Fallback: intentar servir archivo estático
    await staticRoutes.serveStaticFile(req, res, urlAnalizada);
  } else if (metodo !== 'GET' && metodo !== 'POST') {
    enviar405(res);
  } else {
    enviar404(res, 'Ruta no encontrada');
  }
}

module.exports = router;