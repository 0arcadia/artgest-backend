// =============================================
// controllers/usuarios.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const Usuario = require('../models/Usuario');
const Obra = require('../models/Obra');
const { subirACloudinary } = require('../config/cloudinary');

// PUT /api/usuarios/perfil
exports.actualizarPerfil = async (req, res) => {
  try {
    const campos = [
      'nombre', 'bio', 'region', 'sitioWeb', 'instagram',
      'disciplinas', 'formacion', 'portafolioPublico',
      'nombreGaleria', 'descripcionGaleria'
    ];

    const actualizacion = {};
    campos.forEach(c => {
      if (req.body[c] !== undefined) actualizacion[c] = req.body[c];
    });

    if (req.file) {
      const result = await subirACloudinary(req.file.buffer, {
        folder: 'artgest/perfiles',
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }]
      });
      actualizacion.fotoUrl = result.secure_url;
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      actualizacion,
      { new: true, runValidators: true }
    ).select('-contrasenaHash');

    res.json({ mensaje: 'Perfil actualizado.', usuario });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil.' });
  }
};

// PUT /api/usuarios/banner
exports.actualizarBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se recibió imagen.' });
    }

    const result = await subirACloudinary(req.file.buffer, {
      folder: 'artgest/banners',
      transformation: [{ width: 1400, height: 500, crop: 'fill', gravity: 'center', quality: 'auto' }]
    });

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { bannerUrl: result.secure_url },
      { new: true }
    ).select('-contrasenaHash');

    res.json({ mensaje: 'Imagen de fondo actualizada.', bannerUrl: result.secure_url, usuario });
  } catch (error) {
    console.error('Error al subir banner:', error);
    res.status(500).json({ mensaje: 'Error al subir imagen de fondo.' });
  }
};

// GET /api/usuarios/perfil-publico/:id
exports.perfilPublico = async (req, res) => {
  try {
    const artista = await Usuario.findOne({
      _id: req.params.id,
      tipoUsuario: 'artista',
      portafolioPublico: true
    }).select('nombre bio fotoUrl bannerUrl region disciplinas sitioWeb instagram formacion createdAt');

    if (!artista) return res.status(404).json({ mensaje: 'Artista no encontrado.' });

    const totalObras = await Obra.countDocuments({ artistaId: artista._id, enPortafolio: true });
    const obrasDisponibles = await Obra.countDocuments({
      artistaId: artista._id, enPortafolio: true, estado: 'disponible'
    });

    res.json({ artista, stats: { totalObras, obrasDisponibles } });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil.' });
  }
};

// POST /api/usuarios/favorito/:artistaId
exports.toggleFavorito = async (req, res) => {
  try {
    const galerista = await Usuario.findById(req.usuario._id);
    const artistaId = req.params.artistaId;
    const idx = galerista.artistasFavoritos.indexOf(artistaId);

    if (idx > -1) {
      galerista.artistasFavoritos.splice(idx, 1);
      await galerista.save();
      res.json({ mensaje: 'Artista removido de favoritos.', guardado: false });
    } else {
      galerista.artistasFavoritos.push(artistaId);
      await galerista.save();
      res.json({ mensaje: 'Artista guardado en favoritos.', guardado: true });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar favoritos.' });
  }
};

// GET /api/usuarios/favoritos
exports.listarFavoritos = async (req, res) => {
  try {
    const galerista = await Usuario.findById(req.usuario._id)
      .populate('artistasFavoritos', 'nombre fotoUrl disciplinas region');
    res.json({ favoritos: galerista.artistasFavoritos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener favoritos.' });
  }
};