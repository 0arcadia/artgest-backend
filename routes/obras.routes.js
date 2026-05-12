// routes/obras.routes.js
const router = require('express').Router();
const { listar, detalle, crear, actualizar, eliminar, portafolioPublico } = require('../controllers/obras.controller');
const { auth, esPerfil } = require('../middleware/auth.middleware');
const { uploadObra } = require('../config/cloudinary');

// Pública — portafolio de un artista
router.get('/portafolio/:artistaId', portafolioPublico);

// Protegidas — artista
router.get('/', auth, esPerfil('artista'), listar);
router.get('/:id', auth, detalle);
router.post('/', auth, esPerfil('artista'), uploadObra.single('imagen'), crear);
router.put('/:id', auth, esPerfil('artista'), uploadObra.single('imagen'), actualizar);
router.delete('/:id', auth, esPerfil('artista'), eliminar);

module.exports = router;
