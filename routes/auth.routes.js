// routes/auth.routes.js
const router = require('express').Router();
const { registro, login, me, reenviarBienvenida } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');

router.post('/registro', registro);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/reenviar-bienvenida', reenviarBienvenida);

module.exports = router;