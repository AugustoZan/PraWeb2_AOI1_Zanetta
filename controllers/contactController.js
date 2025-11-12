const fs = require('fs').promises;
const path = require('path');
const { ApiError } = require('../middlewares/errorHandler');

const DIR_DATOS = path.join(__dirname, '..', 'data');
const ARCHIVO_CONSULTAS = path.join(DIR_DATOS, 'consultas.txt');

// Se asegura que exista el directorio de datos
async function asegurarDirDatos() {
  try {
    await fs.mkdir(DIR_DATOS, { recursive: true });
  } catch (err) {
    console.error('Error al crear directorio de datos:', err);
  }
}

// Controlador: Guardar consulta
async function guardarConsulta(req, res, next) {
  try {
    const { nombre, email, mensaje } = req.body;
    
    // Se valida
    if (!nombre || !email || !mensaje) {
      throw new ApiError(400, 'Todos los campos son obligatorios');
    }

    if (!email.includes('@')) {
      throw new ApiError(400, 'El email no es válido');
    }

    // Se formatea la fecha
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 19).replace('T', ' ');

    const entrada = `-------------------------\n` +
                    `Fecha: ${fecha}\n` +
                    `Nombre: ${nombre}\n` +
                    `Email: ${email}\n` +
                    `Mensaje: ${mensaje}\n` +
                    `-------------------------\n`;

    await asegurarDirDatos();
    await fs.appendFile(ARCHIVO_CONSULTAS, entrada, 'utf8');
    
    // Se da como respuesta en formato HTML
    res.status(201).send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AgroTrack - Contacto Enviado</title>
          <link rel="stylesheet" href="/estilos.css">
        </head>
        <body>
          <h1>¡Mensaje enviado exitosamente!</h1>
          <p>Gracias por contactarnos, ${nombre}. Tu consulta ha sido guardada.</p>
          <a href="/contacto">Volver al formulario</a> | 
          <a href="/contacto/listar">Ver consultas guardadas</a> | 
          <a href="/">Volver al inicio</a>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
}

// Controlador: Listar consultas
async function listarConsultas(req, res, next) {
  try {
    let contenidoHtml;
    
    try {
      const datos = await fs.readFile(ARCHIVO_CONSULTAS, 'utf8');
      const contenido = datos.trim();
      
      contenidoHtml = contenido.length > 0 
        ? `<pre>${escaparHtml(contenido)}</pre>`
        : '<p>Aún no hay consultas.</p>';
    } catch (err) {
      if (err.code === 'ENOENT') {
        contenidoHtml = '<p>Aún no hay consultas.</p>';
      } else {
        throw err;
      }
    }

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AgroTrack - Consultas Guardadas</title>
          <link rel="stylesheet" href="/estilos.css">
        </head>
        <body>
          <header>
            <h1>Consultas Guardadas</h1>
            <nav>
              <a href="/contacto.html">Nuevo Mensaje</a> | 
              <a href="/">Inicio</a>
            </nav>
          </header>
          <main>
            <h2>Lista de Consultas</h2>
            ${contenidoHtml}
          </main>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
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
  guardarConsulta,
  listarConsultas
};