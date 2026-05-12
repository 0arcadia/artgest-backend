// routes/certificados.routes.js
const router = require('express').Router();
const { verificar, listar, registrarVenta, descargarPDF } = require('../controllers/certificados.controller');
const { auth, esPerfil } = require('../middleware/auth.middleware');

// Públicas
router.get('/verificar/:codigo', verificar);
router.get('/pdf/:codigo', descargarPDF);

// Protegidas — artista
router.get('/', auth, esPerfil('artista'), listar);
router.post('/', auth, esPerfil('artista'), registrarVenta);

module.exports = router;