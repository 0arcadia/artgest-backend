// routes/auth.routes.js
const router = require('express').Router();
const { registro, login, me } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');

router.post('/registro', registro);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
