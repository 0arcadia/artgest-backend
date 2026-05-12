// =============================================
// controllers/obras.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const Obra = require('../models/Obra');
const { subirACloudinary } = require('../config/cloudinary');

// GET /api/obras
exports.listar = async (req, res) => {
  try {
    const { estado, busqueda, orden } = req.query;
    const filtro = { artistaId: req.usuario._id };
    if (estado && estado !== 'todas') filtro.estado = estado;
    if (busqueda) {
      filtro.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { tecnica: { $regex: busqueda, $options: 'i' } },
        { serie: { $regex: busqueda, $options: 'i' } }
      ];
    }
    let sort = { createdAt: -1 };
    if (orden === 'titulo') sort = { titulo: 1 };
    if (orden === 'precio-asc') sort = { precio: 1 };
    if (orden === 'precio-desc') sort = { precio: -1 };
    if (orden === 'anio') sort = { anio: -1 };

    const obras = await Obra.find(filtro).sort(sort);
    const total = await Obra.countDocuments({ artistaId: req.usuario._id });
    const disponibles = await Obra.countDocuments({ artistaId: req.usuario._id, estado: 'disponible' });
    const reservadas = await Obra.countDocuments({ artistaId: req.usuario._id, estado: 'reservada' });
    const vendidas = await Obra.countDocuments({ artistaId: req.usuario._id, estado: 'vendida' });
    res.json({ obras, stats: { total, disponibles, reservadas, vendidas } });
  } catch (error) {
    console.error('Error al listar obras:', error);
    res.status(500).json({ mensaje: 'Error al obtener obras.' });
  }
};

// GET /api/obras/:id
exports.detalle = async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id).populate('artistaId', 'nombre fotoUrl region disciplinas');
    if (!obra) return res.status(404).json({ mensaje: 'Obra no encontrada.' });
    res.json({ obra });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la obra.' });
  }
};

// POST /api/obras
exports.crear = async (req, res) => {
  try {
    const datos = { ...req.body, artistaId: req.usuario._id };
    if (req.file) {
      const result = await subirACloudinary(req.file.buffer, {
        folder: 'artgest/obras',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
      });
      datos.imagenUrl = result.secure_url;
      datos.imagenPublicId = result.public_id;
    }
    const obra = await Obra.create(datos);
    res.status(201).json({ mensaje: 'Obra creada con éxito.', obra });
  } catch (error) {
    console.error('Error al crear obra:', error);
    res.status(500).json({ mensaje: 'Error al crear la obra.' });
  }
};

// PUT /api/obras/:id
exports.actualizar = async (req, res) => {
  try {
    const obra = await Obra.findOne({ _id: req.params.id, artistaId: req.usuario._id });
    if (!obra) return res.status(404).json({ mensaje: 'Obra no encontrada.' });
    if (req.file) {
      const result = await subirACloudinary(req.file.buffer, {
        folder: 'artgest/obras',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
      });
      req.body.imagenUrl = result.secure_url;
      req.body.imagenPublicId = result.public_id;
    }
    Object.assign(obra, req.body);
    await obra.save();
    res.json({ mensaje: 'Obra actualizada.', obra });
  } catch (error) {
    console.error('Error al actualizar obra:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la obra.' });
  }
};

// DELETE /api/obras/:id
exports.eliminar = async (req, res) => {
  try {
    const obra = await Obra.findOneAndDelete({ _id: req.params.id, artistaId: req.usuario._id });
    if (!obra) return res.status(404).json({ mensaje: 'Obra no encontrada.' });
    res.json({ mensaje: 'Obra eliminada.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la obra.' });
  }
};

// GET /api/obras/portafolio/:artistaId
exports.portafolioPublico = async (req, res) => {
  try {
    const obras = await Obra.find({ artistaId: req.params.artistaId, enPortafolio: true })
      .sort({ ordenPortafolio: 1, createdAt: -1 });
    res.json({ obras });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener portafolio.' });
  }
};