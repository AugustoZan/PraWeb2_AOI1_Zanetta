// Controlador: Recuperar cuenta
async function recuperarCuenta(req, res, next) {
  try {
    const { usuario, clave } = req.body;
    
    // Validaciones básicas como usuario y contraseña
    if (!usuario || !clave) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Error - Datos incompletos</title>
          <link rel="stylesheet" href="/estilos.css">
        </head>
        <body>
          <h1>Error: Datos incompletos</h1>
          <p>Usuario y contraseña son obligatorios.</p>
          <a href="/login.html">Volver al formulario</a>
        </body>
        </html>
      `);
    }

    // Respuesta HTML
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AgroTrack - Datos Recibidos</title>
          <link rel="stylesheet" href="/estilos.css">
        </head>
        <body>
          <h1>Datos Recibidos</h1>
          <p><strong>Usuario:</strong> ${escaparHtml(usuario)}</p>
          <p><strong>Contraseña:</strong> ${'*'.repeat(clave.length)}</p>
          <p><em>Nota: Esta es una demostración. En producción, aquí se validarían las credenciales.</em></p>
          <p>
            <a href="/login.html">Volver al formulario</a> | 
            <a href="/">Volver al inicio</a>
          </p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error al procesar recuperación:', err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>Error</title></head>
      <body>
        <h1>Error al procesar la solicitud</h1>
        <a href="/login.html">Volver</a>
      </body>
      </html>
    `);
  }
}

// Escapar HTML
function escaparHtml(texto) {
  if (!texto) return '';
  const mapa = { 
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    '"': '&quot;', 
    "'": '&#039;' 
  };
  return texto.toString().replace(/[&<>"']/g, m => mapa[m]);
}

module.exports = {
  recuperarCuenta
};