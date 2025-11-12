const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/recuperar - Recuperar cuenta
router.post('/recuperar', authController.recuperarCuenta);

module.exports = router;