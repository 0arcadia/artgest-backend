// =============================================
// controllers/postulaciones.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const Postulacion = require('../models/Postulacion');
const Convocatoria = require('../models/Convocatoria');

// GET /api/postulaciones — Listar postulaciones del artista
exports.listar = async (req, res) => {
  try {
    let filtro = {};

    if (req.usuario.tipoUsuario === 'artista') {
      filtro.artistaId = req.usuario._id;
    } else {
      // Galerista ve postulaciones a SUS convocatorias
      const misConvs = await Convocatoria.find({ galeristaId: req.usuario._id }).select('_id');
      const idsConvs = misConvs.map(c => c._id);
      filtro.convocatoriaId = { $in: idsConvs };
    }

    if (req.query.estado && req.query.estado !== 'todas') {
      filtro.estado = req.query.estado;
    }

    const postulaciones = await Postulacion.find(filtro)
      .populate('convocatoriaId', 'titulo tipo entidad fechaCierre')
      .populate('artistaId', 'nombre fotoUrl disciplinas')
      .populate('obrasAdjuntas', 'titulo imagenUrl tecnica')
      .sort({ createdAt: -1 });

    res.json({ postulaciones });
  } catch (error) {
    console.error('Error al listar postulaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener postulaciones.' });
  }
};

// POST /api/postulaciones — Postular a convocatoria (artista)
exports.crear = async (req, res) => {
  try {
    const { convocatoriaId, declaracionArtista, linkPortafolio, obrasAdjuntas } = req.body;

    // Verificar que la convocatoria existe y está activa
    const conv = await Convocatoria.findById(convocatoriaId);
    if (!conv) return res.status(404).json({ mensaje: 'Convocatoria no encontrada.' });
    if (!conv.activa || new Date(conv.fechaCierre) < new Date()) {
      return res.status(400).json({ mensaje: 'Esta convocatoria ya está cerrada.' });
    }

    // Verificar que no haya postulado antes
    const yaPostulo = await Postulacion.findOne({
      artistaId: req.usuario._id,
      convocatoriaId
    });
    if (yaPostulo) {
      return res.status(400).json({ mensaje: 'Ya postulaste a esta convocatoria.' });
    }

    const datos = {
      artistaId: req.usuario._id,
      convocatoriaId,
      declaracionArtista,
      linkPortafolio,
      obrasAdjuntas: obrasAdjuntas || []
    };

    // PDF adjunto
    if (req.file) {
      datos.archivoPdfUrl = req.file.path;
      datos.archivoPdfPublicId = req.file.filename;
    }

    const postulacion = await Postulacion.create(datos);
    res.status(201).json({ mensaje: 'Postulación enviada con éxito.', postulacion });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya postulaste a esta convocatoria.' });
    }
    console.error('Error al postular:', error);
    res.status(500).json({ mensaje: 'Error al enviar postulación.' });
  }
};

// PUT /api/postulaciones/:id/estado — Cambiar estado (galerista)
exports.cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['enviada', 'en revisión', 'aceptada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido.' });
    }

    const postulacion = await Postulacion.findById(req.params.id)
      .populate('convocatoriaId', 'galeristaId');

    if (!postulacion) return res.status(404).json({ mensaje: 'Postulación no encontrada.' });

    // Verificar que la convocatoria pertenece al galerista
    if (postulacion.convocatoriaId.galeristaId.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar esta postulación.' });
    }

    postulacion.estado = estado;
    await postulacion.save();

    res.json({ mensaje: `Estado actualizado a "${estado}".`, postulacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado.' });
  }
};
