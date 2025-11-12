const { ApiError } = require('./errorHandler');

// Middleware de validación para crear contactos
function validarContacto(req, res, next) {
  try {
    const { nombre, email, mensaje } = req.body;
    
    // 1. Validar que existan todos los campos
    if (!nombre || !email || !mensaje) {
      throw new ApiError(400, 'Los campos nombre, email y mensaje son obligatorios');
    }

    // 2. Validar tipos de datos
    if (typeof nombre !== 'string' || typeof email !== 'string' || typeof mensaje !== 'string') {
      throw new ApiError(400, 'Todos los campos deben ser cadenas de texto');
    }

    // 3. Validar que no estén vacíos (después de trim)
    const nombreTrim = nombre.trim();
    const emailTrim = email.trim();
    const mensajeTrim = mensaje.trim();

    if (nombreTrim === '' || emailTrim === '' || mensajeTrim === '') {
      throw new ApiError(400, 'Los campos no pueden estar vacíos');
    }

    // 4. Validar longitudes mínimas
    if (nombreTrim.length < 2) {
      throw new ApiError(400, 'El nombre debe tener al menos 2 caracteres');
    }

    if (mensajeTrim.length < 10) {
      throw new ApiError(400, 'El mensaje debe tener al menos 10 caracteres');
    }

    // 5. Validar longitudes máximas
    if (nombreTrim.length > 100) {
      throw new ApiError(400, 'El nombre no puede exceder 100 caracteres');
    }

    if (emailTrim.length > 150) {
      throw new ApiError(400, 'El email no puede exceder 150 caracteres');
    }

    if (mensajeTrim.length > 5000) {
      throw new ApiError(400, 'El mensaje no puede exceder 5000 caracteres');
    }

    // 6. Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      throw new ApiError(400, 'El formato del email no es válido. Ejemplo: usuario@dominio.com');
    }

    // 7. Validar que el email no contenga caracteres que puedan causar fallos
    const emailDangerousChars = /[<>'"]/;
    if (emailDangerousChars.test(emailTrim)) {
      throw new ApiError(400, 'El email contiene caracteres no permitidos');
    }

    // 8. Validar que el nombre solo contenga letras, espacios y acentos
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nombreRegex.test(nombreTrim)) {
      throw new ApiError(400, 'El nombre solo puede contener letras y espacios');
    }

    // Guardar valores limpios en req.body
    req.body.nombre = nombreTrim;
    req.body.email = emailTrim.toLowerCase(); // Email en minúsculas
    req.body.mensaje = mensajeTrim;

    next();
  } catch (error) {
    next(error);
  }
}

// Middleware de validación genérico
function validarCamposRequeridos(campos) {
  return (req, res, next) => {
    try {
      const camposFaltantes = [];

      campos.forEach(campo => {
        if (!req.body[campo] || req.body[campo].toString().trim() === '') {
          camposFaltantes.push(campo);
        }
      });

      if (camposFaltantes.length > 0) {
        throw new ApiError(
          400, 
          `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  validarContacto,
  validarCamposRequeridos
};