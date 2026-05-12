// =============================================
// controllers/certificados.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const Venta = require('../models/Venta');
const Obra = require('../models/Obra');

// GET /api/certificados/verificar/:codigo — Verificar certificado (público)
exports.verificar = async (req, res) => {
  try {
    const { codigo } = req.params;

    const venta = await Venta.findOne({ codigoCertificado: codigo.toUpperCase() })
      .populate({
        path: 'obraId',
        select: 'titulo tecnica dimensiones anio imagenUrl'
      })
      .populate('artistaId', 'nombre');

    if (!venta) {
      return res.status(404).json({
        verificado: false,
        mensaje: 'Certificado no encontrado. El código ingresado no corresponde a ningún certificado registrado.'
      });
    }

    res.json({
      verificado: true,
      mensaje: 'Certificado válido.',
      certificado: {
        codigo: venta.codigoCertificado,
        obra: venta.obraId,
        artista: venta.artistaId.nombre,
        comprador: venta.compradorNombre,
        fechaVenta: venta.fechaVenta,
        precioVenta: venta.precioVenta,
        moneda: venta.moneda
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar certificado.' });
  }
};

// GET /api/certificados — Listar certificados del artista
exports.listar = async (req, res) => {
  try {
    const ventas = await Venta.find({ artistaId: req.usuario._id })
      .populate('obraId', 'titulo tecnica imagenUrl anio')
      .sort({ fechaVenta: -1 });

    const stats = {
      total: ventas.length,
      verificados: ventas.filter(v => v.certificadoVerificado).length,
      montoTotal: ventas.reduce((acc, v) => acc + v.precioVenta, 0)
    };

    res.json({ ventas, stats });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener certificados.' });
  }
};

// POST /api/certificados — Registrar venta y generar certificado (artista)
exports.registrarVenta = async (req, res) => {
  try {
    const { obraId, compradorNombre, compradorEmail, compradorRut, precioVenta, moneda } = req.body;

    // Verificar que la obra existe y pertenece al artista
    const obra = await Obra.findOne({ _id: obraId, artistaId: req.usuario._id });
    if (!obra) return res.status(404).json({ mensaje: 'Obra no encontrada.' });

    if (obra.estado === 'vendida') {
      return res.status(400).json({ mensaje: 'Esta obra ya fue vendida.' });
    }

    // Crear venta
    const venta = await Venta.create({
      obraId,
      artistaId: req.usuario._id,
      compradorNombre,
      compradorEmail,
      compradorRut,
      precioVenta,
      moneda: moneda || 'CLP'
    });

    // Actualizar estado de la obra
    obra.estado = 'vendida';
    await obra.save();

    res.status(201).json({
      mensaje: 'Venta registrada y certificado generado.',
      venta,
      codigoCertificado: venta.codigoCertificado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Esta obra ya tiene un certificado de venta.' });
    }
    console.error('Error al registrar venta:', error);
    res.status(500).json({ mensaje: 'Error al registrar venta.' });
  }
};
