// =============================================
// models/Mensaje.js
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  emisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  receptorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  contenido: {
    type: String,
    required: [true, 'El mensaje no puede estar vacío'],
    maxlength: 2000,
    trim: true
  },
  leido: { type: Boolean, default: false },

  // Para agrupar conversaciones
  conversacionId: { type: String, required: true },

}, {
  timestamps: true
});

// Índices para consultas de mensajería
mensajeSchema.index({ conversacionId: 1, createdAt: 1 });
mensajeSchema.index({ receptorId: 1, leido: 1 });

// Genera un ID de conversación consistente entre 2 usuarios
// Siempre el mismo sin importar quién envía primero
mensajeSchema.statics.generarConversacionId = function (userId1, userId2) {
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `${ids[0]}_${ids[1]}`;
};

module.exports = mongoose.model('Mensaje', mensajeSchema);
