const contactoModel = require('../models/contactoModel');
const { ApiError } = require('../middlewares/errorHandler');

// GET /api/contactos - Listar todos los contactos
async function listarContactos(req, res, next) {
  try {
    const contactos = await contactoModel.obtenerTodos();
    
    res.status(200).json({
      success: true,
      count: contactos.length,
      data: contactos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/contactos - Crear nuevo contacto
// Las validaciones se hacen en el middleware validarContacto
async function crearContacto(req, res, next) {
  try {
    const { nombre, email, mensaje } = req.body;

    // Se crea contacto en la base de datos
    const nuevoContacto = await contactoModel.crear(nombre, email, mensaje);
    
    res.status(201).json({
      success: true,
      message: 'Contacto creado exitosamente',
      data: nuevoContacto,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Si es un error de BD, crear un ApiError apropiado
    if (error.message.includes('Error al crear contacto')) {
      next(new ApiError(500, 'No se pudo guardar el contacto. Por favor, intente nuevamente.'));
    } else {
      next(error);
    }
  }
}

module.exports = {
  listarContactos,
  crearContacto
};