const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /health - Verificación del estado del servidor
router.get('/', healthController.checkHealth);

module.exports = router;