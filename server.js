const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const path = require('path');
const os = require('os');

const PUERTO = 3000;
const DIR_PUBLICA = path.join(__dirname, 'public');
const DIR_DATOS = path.join(__dirname, 'data');

// Se verifica que el directorio de datos exista, de lo contrario, arroja un mensaje de error
async function asegurarDirDatos() {
  try {
    await fs.mkdir(DIR_DATOS, { recursive: true });
  } catch (err) {
    console.error('Error al crear directorio de datos:', err);
  }
}

const TIPOS_MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

// Acá se encuentra el apartado del manejo de errores en casos de encontrar la página, lanzando el error 404
function enviar404(res, mensaje = 'Ruta no encontrada') {
  res.writeHead(404, { 'Content-Type': 'text/html' });
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
//Acá se maneja el error 500 en casos que haya problemas con el servidor interno
function enviar500(res, mensaje = 'Error interno del servidor') {
  res.writeHead(500, { 'Content-Type': 'text/html' });
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

function enviar405(res) {
  res.writeHead(405, { 'Content-Type': 'text/html' });
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

// Servir archivo estático
async function servirArchivoEstatico(req, res, urlAnalizada, archivoObjetivo = null) {
  let rutaArchivo;
  if (archivoObjetivo) {
    rutaArchivo = path.join(DIR_PUBLICA, archivoObjetivo);
  } else {
    rutaArchivo = path.join(DIR_PUBLICA, urlAnalizada.pathname === '/' ? 'index.html' : urlAnalizada.pathname);
  }
  
  try {
    const datos = await fs.readFile(rutaArchivo);
    const extension = path.extname(rutaArchivo);
    res.writeHead(200, { 'Content-Type': TIPOS_MIME[extension] || 'text/plain' });
    res.end(datos);
  } catch (err) {
    // 404 si el archivo no se encuentra
    if (err.code === 'ENOENT') {
      enviar404(res, 'Página no encontrada');
    } else {
      // 500 para otros errores
      console.error('Error al leer archivo:', err);
      enviar500(res);
    }
  }
}

// Analizar cuerpo POST (codificado URL) - Usando URLSearchParams para decodificación robusta
function analizarDatosPost(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    req.on('data', chunk => {
      cuerpo += chunk.toString();  // Asegurar string UTF-8
    });
    req.on('end', () => {
      try {
        const parametros = new URLSearchParams(cuerpo);
        const params = {};
        for (const [clave, valor] of parametros) {
          params[clave] = valor;  // Ya decodificados automáticamente ( + → espacio, %XX → chars )
        }
        resolve(params);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Analizar cuerpo POST para login/recuperar usando URLSearchParams
function analizarDatosPostRecuperar(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    req.on('data', chunk => {
      cuerpo += chunk;
    });
    req.on('end', () => {
      try {
        const parametros = new URLSearchParams(cuerpo);
        const usuario = parametros.get('usuario');
        const clave = parametros.get('clave');
        resolve({ usuario, clave });
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Manejar POST login/recuperar
async function manejarRecuperar(req, res, datosPost) {
  const { usuario, clave } = datosPost;  // Extrae los datos enviados
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AgroTrack - Datos Recibidos</title>
        <link rel="stylesheet" href="/estilos.css">
      </head>
      <body>
        <h1>Datos Enviados Recibidos</h1>
        <p>Usuario: ${usuario || 'No proporcionado'}</p>
        <p>Clave: ${clave || 'No proporcionada'}</p>
        <p>¡Gracias por enviar los datos!</p>
        <a href="/login">Volver al formulario</a> | <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
}

// Manejar POST /contacto/cargar (actualizado para usar el nuevo parsing)
async function manejarCargar(req, res, datosPost) {
  const { nombre, email, mensaje } = datosPost;
  if (!nombre || !email || !mensaje) {
    enviar404(res, 'Datos incompletos');
    return;
  }

  // Formatear fecha actual como YYYY-MM-DD HH:MM:SS
  const ahora = new Date();
  const fecha = ahora.toISOString().slice(0, 19).replace('T', ' ');  // ej., "2024-10-07 14:30:00"

  const entrada = `-------------------------\n` +
                  `Fecha: ${fecha}\n` +
                  `Nombre: ${nombre}\n` +
                  `Email: ${email}\n` +
                  `Mensaje: ${mensaje}\n` +  // Ahora con espacios correctos
                  `-------------------------\n`;

  try {
    await asegurarDirDatos();
    await fs.appendFile(path.join(DIR_DATOS, 'consultas.txt'), entrada, 'utf8');  // Especificar encoding UTF-8 para acentos
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
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
    console.error('Error al escribir en archivo:', err);
    enviar500(res, 'Error al guardar el mensaje');
  }
}

// Manejar GET /contacto/listar
async function manejarListar(req, res) {
  const rutaArchivo = path.join(DIR_DATOS, 'consultas.txt');
  try {
    const datos = await fs.readFile(rutaArchivo, 'utf8');
    const contenido = datos.trim();
    let contenidoHtml;
    if (contenido.length > 0) {
      contenidoHtml = `<pre>${escaparHtml(contenido)}</pre>`;  // Escapar HTML para seguridad
    } else {
      contenidoHtml = '<p>Aún no hay consultas.</p>';
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
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
              <a href="/contacto">Nuevo Mensaje</a> | 
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
    // Si el archivo no existe, tratar como vacío (200 con mensaje)
    if (err.code === 'ENOENT') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
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
                <a href="/contacto">Nuevo Mensaje</a> | 
                <a href="/">Inicio</a>
              </nav>
            </header>
            <main>
              <h2>Lista de Consultas</h2>
              <p>Aún no hay consultas.</p>
            </main>
          </body>
        </html>
      `);
    } else {
      console.error('Error al leer consultas.txt:', err);
      enviar500(res, 'Error al leer las consultas');
    }
  }
}

// Escapar HTML simple para contenido <pre> (básico, para MVP)
function escaparHtml(texto) {
  const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return texto.replace(/[&<>"']/g, m => mapa[m]);
}

// Manejador principal de solicitudes (con try-catch global para errores no manejados)
// Manejador principal de solicitudes (actualizado el bloque GET para servir assets genéricos)
async function manejadorSolicitud(req, res) {
  const urlAnalizada = url.parse(req.url, true);
  console.log(`${req.method} ${req.url}`);

  // Establecer cabecera CORS por simplicidad (portal interno, pero buena práctica)
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (req.method === 'GET') {
      // Rutas especiales dinámicas primero
      if (urlAnalizada.pathname === '/contacto/listar') {
        await manejarListar(req, res);
        return;  // Salir temprano
      }

      // Intentar servir archivo estático genérico (para imágenes, CSS, etc.)
      const extension = path.extname(urlAnalizada.pathname);
      if (extension && TIPOS_MIME[extension]) {
        // Si tiene extensión MIME conocida, servir directamente desde public/
        await servirArchivoEstatico(req, res, urlAnalizada);
        return;
      }

      // Rutas mapeadas específicas (para HTML sin extensión o root)
      let archivoObjetivo = null;
      if (urlAnalizada.pathname === '/') {
        archivoObjetivo = 'index.html';
      } else if (urlAnalizada.pathname === '/productos.html') {
        archivoObjetivo = 'productos.html';
      } else if (urlAnalizada.pathname === '/contacto') {
        archivoObjetivo = 'contacto.html';
      } else if (urlAnalizada.pathname === '/login') {
        archivoObjetivo = 'login.html';
      } else if (urlAnalizada.pathname === '/estilos.css') {
        archivoObjetivo = 'estilos.css';
      }

      if (archivoObjetivo) {
        await servirArchivoEstatico(req, res, urlAnalizada, archivoObjetivo);
      } else {
        // Para otros paths sin extensión, intentar servir como estático (ej. /imagen.png ya cubierto arriba)
        await servirArchivoEstatico(req, res, urlAnalizada);
      }
    } else if (req.method === 'POST') {
      // ... (sin cambios: POST handling igual)
      if (urlAnalizada.pathname === '/contacto/cargar') {
        const datosPost = await analizarDatosPost(req);
        await manejarCargar(req, res, datosPost);
      } else if (urlAnalizada.pathname === '/auth/recuperar') {
        const datosPost = await analizarDatosPostRecuperar(req);
        await manejarRecuperar(req, res, datosPost);
      } else {
        enviar404(res, 'Ruta POST no encontrada');
      }
    } else {
      enviar405(res);
    }
  } catch (err) {
    console.error('Error no manejado en el manejador de solicitudes:', err);
    enviar500(res);
  }
}


// Crear servidor
const servidor = http.createServer(manejadorSolicitud);

servidor.listen(PUERTO, () => {
  console.log(`Servidor AgroTrack corriendo en http://localhost:${PUERTO}`);
  asegurarDirDatos(); // Inicializar al inicio
});