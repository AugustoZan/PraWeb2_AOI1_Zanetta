const fs = require('fs').promises;
const path = require('path');
const { enviar404, enviar500 } = require('../utils/responseHandlers');

const DIR_PUBLICA = path.join(__dirname, '..', 'public');

const TIPOS_MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json'
};

// Se sirve un archivo específico
async function serveFile(req, res, nombreArchivo) {
  const rutaArchivo = path.join(DIR_PUBLICA, nombreArchivo);
  
  try {
    const datos = await fs.readFile(rutaArchivo);
    const extension = path.extname(rutaArchivo);
    const contentType = TIPOS_MIME[extension] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(datos);
  } catch (err) {
    if (err.code === 'ENOENT') {
      enviar404(res, 'Página no encontrada');
    } else {
      console.error('Error al leer archivo:', err);
      enviar500(res);
    }
  }
}

// Se sirve un archivo genérico desde URL
async function serveGenericFile(req, res, urlAnalizada) {
  const rutaArchivo = path.join(DIR_PUBLICA, urlAnalizada.pathname);
  
  try {
    const datos = await fs.readFile(rutaArchivo);
    const extension = path.extname(rutaArchivo);
    const contentType = TIPOS_MIME[extension] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(datos);
  } catch (err) {
    if (err.code === 'ENOENT') {
      enviar404(res, 'Recurso no encontrado');
    } else {
      console.error('Error al leer archivo:', err);
      enviar500(res);
    }
  }
}

module.exports = {
  serveFile,
  serveGenericFile
};