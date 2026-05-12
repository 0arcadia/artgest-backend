// =============================================
// models/Convocatoria.js
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');

const convocatoriaSchema = new mongoose.Schema({
  galeristaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: 200
  },
  entidad: { type: String, default: '' },
  tipo: {
    type: String,
    enum: ['fondart', 'residencia', 'concurso', 'feria', 'galeria', 'otro'],
    required: true
  },
  disciplina: { type: String, default: '' },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: 2000
  },
  requisitos: { type: String, maxlength: 2000, default: '' },
  region: { type: String, default: '' },

  // Fechas
  fechaApertura: { type: Date, required: true },
  fechaCierre: { type: Date, required: true },

  // Estado
  activa: { type: Boolean, default: true },

}, {
  timestamps: true
});

// Índices
convocatoriaSchema.index({ activa: 1, fechaCierre: 1 });
convocatoriaSchema.index({ galeristaId: 1 });
convocatoriaSchema.index({ tipo: 1 });

module.exports = mongoose.model('Convocatoria', convocatoriaSchema);
