// routes/usuarios.routes.js
const router = require('express').Router();
const { actualizarPerfil, actualizarBanner, perfilPublico, toggleFavorito, listarFavoritos } = require('../controllers/usuarios.controller');
const { auth, esPerfil } = require('../middleware/auth.middleware');
const { uploadPerfil } = require('../config/cloudinary');

// Pública
router.get('/perfil-publico/:id', perfilPublico);

// Protegidas
router.put('/perfil', auth, uploadPerfil.single('foto'), actualizarPerfil);
router.put('/banner', auth, uploadPerfil.single('banner'), actualizarBanner);
router.post('/favorito/:artistaId', auth, esPerfil('galerista'), toggleFavorito);
router.get('/favoritos', auth, esPerfil('galerista'), listarFavoritos);

module.exports = router;