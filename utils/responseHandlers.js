// Utilidades para manejar respuestas HTTP

// Error 404
function enviar404(res, mensaje = 'Ruta no encontrada') {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - No Encontrado</title>
        <link rel="stylesheet" href="/estilos.css">
      </head>
      <body>
        <h1>404 - ${mensaje}</h1>
        <p>La ruta o página solicitada no existe.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
}

// Error 500
function enviar500(res, mensaje = 'Error interno del servidor') {
  res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Error Interno</title>
        <link rel="stylesheet" href="/estilos.css">
      </head>
      <body>
        <h1>500 - ${mensaje}</h1>
        <p>Ha ocurrido un error interno en el servidor. Intenta más tarde.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
}

// Error 405
function enviar405(res) {
  res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>405 - Método No Permitido</title>
        <link rel="stylesheet" href="/estilos.css">
      </head>
      <body>
        <h1>405 - Método no permitido</h1>
        <p>El método HTTP utilizado no está permitido para esta ruta.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
}

// Escapar HTML
function escaparHtml(texto) {
  const mapa = { 
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    '"': '&quot;', 
    "'": '&#039;' 
  };
  return texto.replace(/[&<>"']/g, m => mapa[m]);
}

module.exports = {
  enviar404,
  enviar500,
  enviar405,
  escaparHtml
};