// =============================================
// controllers/convocatorias.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const Convocatoria = require('../models/Convocatoria');
const Postulacion = require('../models/Postulacion');

// GET /api/convocatorias — Listar convocatorias (artista ve activas, galerista ve las suyas)
exports.listar = async (req, res) => {
  try {
    const { tipo, region, busqueda, orden } = req.query;
    const filtro = {};

    // Si es artista, solo ve activas con cierre futuro
    if (req.usuario.tipoUsuario === 'artista') {
      filtro.activa = true;
      filtro.fechaCierre = { $gte: new Date() };
    } else {
      // Galerista ve las suyas
      filtro.galeristaId = req.usuario._id;
    }

    if (tipo && tipo !== 'todas') filtro.tipo = tipo;
    if (region) filtro.region = region;
    if (busqueda) {
      filtro.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { entidad: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } }
      ];
    }

    let sort = { fechaCierre: 1 }; // más urgentes primero
    if (orden === 'recientes') sort = { createdAt: -1 };
    if (orden === 'titulo') sort = { titulo: 1 };

    const convocatorias = await Convocatoria.find(filtro)
      .populate('galeristaId', 'nombre nombreGaleria')
      .sort(sort);

    // Para artista: marcar en cuáles ya postuló
    if (req.usuario.tipoUsuario === 'artista') {
      const postulaciones = await Postulacion.find({ artistaId: req.usuario._id })
        .select('convocatoriaId');
      const idsPostulados = postulaciones.map(p => p.convocatoriaId.toString());

      const resultado = convocatorias.map(c => ({
        ...c.toObject(),
        yaPostulo: idsPostulados.includes(c._id.toString())
      }));

      return res.json({ convocatorias: resultado });
    }

    // Para galerista: agregar conteo de postulaciones
    const resultado = await Promise.all(convocatorias.map(async c => {
      const totalPost = await Postulacion.countDocuments({ convocatoriaId: c._id });
      return { ...c.toObject(), totalPostulaciones: totalPost };
    }));

    res.json({ convocatorias: resultado });
  } catch (error) {
    console.error('Error al listar convocatorias:', error);
    res.status(500).json({ mensaje: 'Error al obtener convocatorias.' });
  }
};

// GET /api/convocatorias/:id — Detalle
exports.detalle = async (req, res) => {
  try {
    const conv = await Convocatoria.findById(req.params.id)
      .populate('galeristaId', 'nombre nombreGaleria');
    if (!conv) return res.status(404).json({ mensaje: 'Convocatoria no encontrada.' });
    res.json({ convocatoria: conv });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener convocatoria.' });
  }
};

// POST /api/convocatorias — Crear (galerista)
exports.crear = async (req, res) => {
  try {
    const conv = await Convocatoria.create({
      ...req.body,
      galeristaId: req.usuario._id
    });
    res.status(201).json({ mensaje: 'Convocatoria publicada.', convocatoria: conv });
  } catch (error) {
    console.error('Error al crear convocatoria:', error);
    res.status(500).json({ mensaje: 'Error al publicar convocatoria.' });
  }
};

// PUT /api/convocatorias/:id — Actualizar (galerista)
exports.actualizar = async (req, res) => {
  try {
    const conv = await Convocatoria.findOneAndUpdate(
      { _id: req.params.id, galeristaId: req.usuario._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!conv) return res.status(404).json({ mensaje: 'Convocatoria no encontrada.' });
    res.json({ mensaje: 'Convocatoria actualizada.', convocatoria: conv });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar convocatoria.' });
  }
};
