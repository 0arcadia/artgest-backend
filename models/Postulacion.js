// =============================================
// models/Postulacion.js
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');

const postulacionSchema = new mongoose.Schema({
  artistaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  convocatoriaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Convocatoria',
    required: true
  },

  // Datos del formulario de postulación
  declaracionArtista: { type: String, maxlength: 2000, default: '' },
  linkPortafolio: { type: String, default: '' },

  // Obras adjuntas (referencias)
  obrasAdjuntas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obra'
  }],

  // Archivo PDF adjunto (Cloudinary)
  archivoPdfUrl: { type: String, default: '' },
  archivoPdfPublicId: { type: String, default: '' },

  // Estado de la postulación
  estado: {
    type: String,
    enum: ['enviada', 'en revisión', 'aceptada', 'rechazada'],
    default: 'enviada'
  },

  fechaPostulacion: { type: Date, default: Date.now },

}, {
  timestamps: true
});

// Un artista solo puede postular una vez a cada convocatoria
postulacionSchema.index({ artistaId: 1, convocatoriaId: 1 }, { unique: true });
postulacionSchema.index({ convocatoriaId: 1, estado: 1 });

module.exports = mongoose.model('Postulacion', postulacionSchema);
