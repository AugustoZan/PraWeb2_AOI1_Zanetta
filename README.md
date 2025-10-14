# AgroTrack - Portal Web Interno

## Descripción
AgroTrack es una PYME ficticia agroindustrial que desarrolla un portal web interno para su personal. Este proyecto es la primera versión (MVP) de un servidor HTTP básico en Node.js puro (sin frameworks como Express), que permite:
- Consultar páginas estáticas (inicio, productos, contacto y login).
- Iniciar sesión de demostración y recuperar credenciales.
- Enviar formularios de contacto, que se guardan en un archivo.
- Listar consultas previas guardadas.

El servidor usa módulos nativos de Node.js (http, fs, url, os) para manejar rutas, servir archivos estáticos, procesar formularios y gestionar errores (404 y 500). El enfoque es en simplicidad y funcionalidad interna.

## Estructura del Proyecto
- **server.js**: El archivo principal del servidor HTTP.
- **public/**: Contiene archivos estáticos como HTML, CSS e imágenes (ej. index.html, productos.html, contacto.html, login.html, estilos.css, trigo.jpg, maiz.jpg, fertilizante.jpg, inicio.png).
- **data/**: Almacena archivos generados, como consultas.txt (ignorado en .gitignore para no subirlo).
- **.gitignore**: Configura qué archivos ignorar en el repositorio.
- **README.md**: Este archivo.

## Requisitos
- Node.js versión 14 o superior (instala con `nvm install 14` si es necesario).
- Un editor de código (ej. VS Code).

## Instalación y Ejecución
1. **Clona el repositorio**:  
   `git clone <URL-de-tu-repo>` (o crea uno en GitHub/GitLab y sube los archivos).

2. **Ejecuta el servidor**:  
   - Navega al directorio: `cd agrotrack`.  
   - Inicia el servidor: `node server.js`.  
   - El servidor correrá en http://localhost:3000.

3. **Accede al portal**:  
   Abre un navegador y ve a http://localhost:3000. Explora las páginas:  
   - `/` para el inicio.  
   - `/productos.html` para ver los productos en galería.  
   - `/contacto` para enviar un mensaje.  
   - `/login` para la demostración de login.

## Funcionalidades
- **Páginas Estáticas**: Accede a información básica en `/` e `/productos.html`.
- **Formulario de Contacto**: Envía datos vía POST `/contacto/cargar`, que se guardan en `data/consultas.txt`. Usa GET `/contacto/listar` para ver las consultas.
- **Inicio de Sesión**: POST `/auth/recuperar` muestra los datos enviados (usuario y clave oculta por seguridad).
- **Manejo de Errores**: Rutas inválidas devuelven 404 HTML; errores internos, 500 HTML.
- **Galería de Productos**: En `/productos.html`, las imágenes se muestran en baldosas horizontales (3 columnas en desktop).
