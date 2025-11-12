const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /contacto/cargar - Guardar consulta
router.post('/cargar', contactController.guardarConsulta);

// GET /contacto/listar - Listar consultas guardadas
router.get('/listar', contactController.listarConsultas);

module.exports = router;