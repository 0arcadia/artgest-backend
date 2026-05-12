// routes/postulaciones.routes.js
const router = require('express').Router();
const { listar, crear, cambiarEstado } = require('../controllers/postulaciones.controller');
const { auth, esPerfil } = require('../middleware/auth.middleware');
const { uploadPDF } = require('../config/cloudinary');

router.get('/', auth, listar);
router.post('/', auth, esPerfil('artista'), uploadPDF.single('archivoPdf'), crear);
router.put('/:id/estado', auth, esPerfil('galerista'), cambiarEstado);

module.exports = router;
