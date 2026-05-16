// =============================================
// middleware/auth.middleware.js — Verificación JWT
// ArtGest · Proyecto de Título 2026
// =============================================

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Verificar que el usuario está autenticado
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   const usuario = await Usuario.findById(decoded.userId).select('-contrasenaHash');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token inválido. Usuario no encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token expirado. Inicia sesión nuevamente.' });
    }
    return res.status(401).json({ mensaje: 'Token inválido.' });
  }
};

// Verificar tipo de usuario (artista o galerista)
const esPerfil = (...perfiles) => {
  return (req, res, next) => {
    if (!perfiles.includes(req.usuario.tipoUsuario)) {
      return res.status(403).json({
        mensaje: `Acceso restringido. Se requiere perfil: ${perfiles.join(' o ')}.`
      });
    }
    next();
  };
};

module.exports = { auth, esPerfil };
