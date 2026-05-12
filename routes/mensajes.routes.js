// routes/mensajes.routes.js
const router = require('express').Router();
const { conversaciones, obtenerMensajes, enviar } = require('../controllers/mensajes.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/conversaciones', auth, conversaciones);
router.get('/:receptorId', auth, obtenerMensajes);
router.post('/', auth, enviar);

module.exports = router;
