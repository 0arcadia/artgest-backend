// =============================================
// models/Obra.js
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');

const obraSchema = new mongoose.Schema({
  artistaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: 150
  },
  tecnica: {
    type: String,
    required: [true, 'La técnica es obligatoria'],
    trim: true
  },
  dimensiones: { type: String, default: '' },
  anio: { type: Number },
  descripcion: { type: String, maxlength: 1000, default: '' },
  serie: { type: String, default: '' },

  // Imagen principal (Cloudinary)
  imagenUrl: { type: String, default: '' },
  imagenPublicId: { type: String, default: '' },

  // Estado y precio
  estado: {
    type: String,
    enum: ['disponible', 'reservada', 'vendida', 'no disponible'],
    default: 'disponible'
  },
  precio: { type: Number, default: 0 },
  moneda: { type: String, enum: ['CLP', 'USD', 'EUR'], default: 'CLP' },

  // Visibilidad en portafolio público
  enPortafolio: { type: Boolean, default: true },
  ordenPortafolio: { type: Number, default: 0 },

}, {
  timestamps: true
});

// Índices para consultas frecuentes
obraSchema.index({ artistaId: 1, estado: 1 });
obraSchema.index({ artistaId: 1, enPortafolio: 1 });

module.exports = mongoose.model('Obra', obraSchema);
