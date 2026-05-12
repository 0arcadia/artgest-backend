// =============================================
// controllers/mensajes.controller.js
// ArtGest · Proyecto de Título 2026
// =============================================

const Mensaje = require('../models/Mensaje');
const Usuario = require('../models/Usuario');

// GET /api/mensajes/conversaciones — Lista de conversaciones del usuario
exports.conversaciones = async (req, res) => {
  try {
    const userId = req.usuario._id;

    // Obtener todos los mensajes donde participo
    const mensajes = await Mensaje.find({
      $or: [{ emisorId: userId }, { receptorId: userId }]
    }).sort({ createdAt: -1 });

    // Agrupar por conversación y obtener el último mensaje
    const convsMap = new Map();
    for (const msg of mensajes) {
      if (!convsMap.has(msg.conversacionId)) {
        const otroId = msg.emisorId.toString() === userId.toString()
          ? msg.receptorId
          : msg.emisorId;
        convsMap.set(msg.conversacionId, {
          conversacionId: msg.conversacionId,
          otroUsuarioId: otroId,
          ultimoMensaje: msg.contenido,
          fecha: msg.createdAt,
          noLeidos: 0
        });
      }
    }

    // Contar no leídos y obtener datos del otro usuario
    const conversaciones = [];
    for (const [convId, conv] of convsMap) {
      const noLeidos = await Mensaje.countDocuments({
        conversacionId: convId,
        receptorId: userId,
        leido: false
      });
      conv.noLeidos = noLeidos;

      const otroUsuario = await Usuario.findById(conv.otroUsuarioId)
        .select('nombre fotoUrl tipoUsuario disciplinas');
      conv.otroUsuario = otroUsuario;

      conversaciones.push(conv);
    }

    res.json({ conversaciones });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener conversaciones.' });
  }
};

// GET /api/mensajes/:receptorId — Mensajes de una conversación
exports.obtenerMensajes = async (req, res) => {
  try {
    const conversacionId = Mensaje.generarConversacionId(req.usuario._id, req.params.receptorId);

    const mensajes = await Mensaje.find({ conversacionId })
      .populate('emisorId', 'nombre fotoUrl')
      .sort({ createdAt: 1 });

    // Marcar como leídos los recibidos
    await Mensaje.updateMany(
      { conversacionId, receptorId: req.usuario._id, leido: false },
      { leido: true }
    );

    res.json({ mensajes, conversacionId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mensajes.' });
  }
};

// POST /api/mensajes — Enviar mensaje
exports.enviar = async (req, res) => {
  try {
    const { receptorId, contenido } = req.body;

    if (!receptorId || !contenido) {
      return res.status(400).json({ mensaje: 'Destinatario y contenido son obligatorios.' });
    }

    // Verificar que el receptor existe
    const receptor = await Usuario.findById(receptorId);
    if (!receptor) return res.status(404).json({ mensaje: 'Destinatario no encontrado.' });

    const conversacionId = Mensaje.generarConversacionId(req.usuario._id, receptorId);

    const mensaje = await Mensaje.create({
      emisorId: req.usuario._id,
      receptorId,
      contenido,
      conversacionId
    });

    const msgPopulado = await Mensaje.findById(mensaje._id)
      .populate('emisorId', 'nombre fotoUrl');

    res.status(201).json({ mensaje: msgPopulado });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ mensaje: 'Error al enviar mensaje.' });
  }
};
