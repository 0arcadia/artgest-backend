// =============================================
// controllers/auth.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { enviarBienvenida } = require('../config/email');

// POST /api/auth/registro
exports.registro = async (req, res) => {
  try {
    const { nombre, email, contrasena, tipoUsuario } = req.body;

    // Validaciones
    if (!nombre || !email || !contrasena || !tipoUsuario) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }
    if (contrasena.length < 8) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (!['artista', 'galerista'].includes(tipoUsuario)) {
      return res.status(400).json({ mensaje: 'Tipo de usuario no válido.' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta con este correo.' });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(contrasena, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      contrasenaHash: hash,
      tipoUsuario,
    });

    const token = jwt.sign(
      { userId: usuario._id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Cuenta creada con éxito.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        fotoUrl: usuario.fotoUrl
      }
    });

    // Enviar correo de bienvenida (no bloquea la respuesta)
    enviarBienvenida(usuario.email, usuario.nombre, usuario.tipoUsuario);

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al crear la cuenta.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const match = await bcrypt.compare(contrasena, usuario.contrasenaHash);
    if (!match) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { userId: usuario._id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Sesión iniciada.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        fotoUrl: usuario.fotoUrl
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión.' });
  }
};

// GET /api/auth/me — obtener perfil del usuario autenticado
exports.me = async (req, res) => {
  try {
    res.json({ usuario: req.usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil.' });
  }
};

// POST /api/auth/reenviar-bienvenida — Reenviar correo de bienvenida
exports.reenviarBienvenida = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ mensaje: 'El email es obligatorio.' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'No se encontró un usuario con ese correo.' });
    }

    await enviarBienvenida(usuario.email, usuario.nombre, usuario.tipoUsuario);
    res.json({ mensaje: `Correo de bienvenida reenviado a ${email}` });
  } catch (error) {
    console.error('Error al reenviar correo:', error);
    res.status(500).json({ mensaje: 'Error al reenviar el correo.' });
  }
};