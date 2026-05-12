// routes/certificados.routes.js
const router = require('express').Router();
const { verificar, listar, registrarVenta } = require('../controllers/certificados.controller');
const { auth, esPerfil } = require('../middleware/auth.middleware');

// Pública — verificar certificado por código QR
router.get('/verificar/:codigo', verificar);

// Protegidas — artista
router.get('/', auth, esPerfil('artista'), listar);
router.post('/', auth, esPerfil('artista'), registrarVenta);

module.exports = router;
