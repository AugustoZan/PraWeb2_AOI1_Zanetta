const express = require('express');
const router = express.Router();
const path = require('path');

// Rutas para páginas HTML estáticas

// GET /productos.html
router.get('/productos.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'productos.html'));
});

// GET /contacto.html - Solo la página, NO las rutas /contacto/cargar o /contacto/listar
router.get('/contacto.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contacto.html'));
});

// GET /login.html - Página de login
router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

module.exports = router;