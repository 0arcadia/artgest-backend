// routes/convocatorias.routes.js
const router = require('express').Router();
const { listar, detalle, crear, actualizar } = require('../controllers/convocatorias.controller');
const { auth, esPerfil } = require('../middleware/auth.middleware');

router.get('/', auth, listar);
router.get('/:id', auth, detalle);
router.post('/', auth, esPerfil('galerista'), crear);
router.put('/:id', auth, esPerfil('galerista'), actualizar);

module.exports = router;
