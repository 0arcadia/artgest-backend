// =============================================
// controllers/auth.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

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

    // Verificar si ya existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe una cuenta con este email.' });
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      contrasenaHash,
      tipoUsuario
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
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

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // Verificar contraseña
    const coincide = await bcrypt.compare(contrasena, usuario.contrasenaHash);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        fotoUrl: usuario.fotoUrl,
        bio: usuario.bio,
        region: usuario.region,
        disciplinas: usuario.disciplinas
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
