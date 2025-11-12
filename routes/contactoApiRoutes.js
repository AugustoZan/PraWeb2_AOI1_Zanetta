const express = require('express');
const router = express.Router();
const contactoApiController = require('../controllers/contactoApiController');
const { validarContacto } = require('../middlewares/validationMiddleware');

// GET /api/contactos - Listar todos los contactos
router.get('/', contactoApiController.listarContactos);

// POST /api/contactos - Crear nuevo contacto
// Se aplica el middleware de validación ANTES del controlador
router.post('/', validarContacto, contactoApiController.crearContacto);

module.exports = router;