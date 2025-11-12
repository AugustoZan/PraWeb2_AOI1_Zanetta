require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Importar rutas
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const contactoApiRoutes = require('./routes/contactoApiRoutes');

// Importar middlewares personalizados
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger } = require('./middlewares/requestLogger');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Logger de peticiones
app.use(requestLogger);

// CORS
app.use(cors());

// Parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde /public
// Esto automáticamente sirve index.html cuando accedes a /
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// RUTAS
// ============================================

// Health check - Verificación del servidor
app.use('/health', healthRoutes);

// Rutas de contacto (API)
app.use('/api/contactos', contactoApiRoutes);

// Rutas de contacto HTML (sistema legacy)
app.use('/contacto', contactRoutes);


// Rutas de autenticación
app.use('/auth', authRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Middleware de manejo de errores global
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`AgroTrack V2.0 iniciado`);
  console.log(`Puerto: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
  console.log('=================================');
});

module.exports = app;