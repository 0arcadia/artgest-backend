// =============================================
// models/Usuario.js
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email no válido']
  },
  contrasenaHash: {
    type: String,
    required: true
  },
  tipoUsuario: {
    type: String,
    enum: ['artista', 'galerista'],
    required: [true, 'El tipo de usuario es obligatorio']
  },

  // ── Perfil artista ──
  bio: { type: String, maxlength: 500, default: '' },
  fotoUrl: { type: String, default: '' },
  region: { type: String, default: '' },
  sitioWeb: { type: String, default: '' },
  instagram: { type: String, default: '' },
  disciplinas: [{ type: String }],
  formacion: { type: String, default: '' },
  portafolioPublico: { type: Boolean, default: true },

  // ── Perfil galerista ──
  nombreGaleria: { type: String, default: '' },
  descripcionGaleria: { type: String, default: '' },

  // ── Favoritos (galerista guarda artistas) ──
  artistasFavoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],

}, {
  timestamps: true // createdAt, updatedAt automáticos
});

// Índice para búsquedas por tipo
usuarioSchema.index({ tipoUsuario: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);
