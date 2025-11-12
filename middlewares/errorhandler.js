function errorHandler(err, req, res, next) {
  // Log del error en consola para debugging
  console.error('❌ Error capturado:');
  console.error('   Ruta:', req.method, req.path);
  console.error('   Mensaje:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('   Stack:', err.stack);
  }

  // Determinar código de estado
  const statusCode = err.statusCode || 500;
  
  // Mensaje de error
  let message = err.message || 'Error interno del servidor';

  // Errores específicos de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    message = 'El registro ya existe en la base de datos';
  } else if (err.code === 'ER_NO_SUCH_TABLE') {
    message = 'Error de configuración de base de datos';
  } else if (err.code === 'ECONNREFUSED') {
    message = 'No se pudo conectar a la base de datos';
  }

  // Respuesta JSON
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  // En desarrollo, se incluye información adicional
  if (process.env.NODE_ENV === 'development') {
    response.details = {
      statusCode,
      path: req.path,
      method: req.method,
      stack: err.stack
    };
  }

  res.status(statusCode).json(response);
}

// Clase personalizada para manejar errores de API
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para rutas no encontradas (404)
function notFoundHandler(req, res, next) {
  const error = new ApiError(404, `Ruta no encontrada: ${req.method} ${req.path}`);
  next(error);
}

module.exports = { 
  errorHandler,
  ApiError,
  notFoundHandler
};