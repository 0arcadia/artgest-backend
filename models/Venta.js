// =============================================
// models/Venta.js
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');
const crypto = require('crypto');

const ventaSchema = new mongoose.Schema({
  obraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obra',
    required: true,
    unique: true // Una obra solo se vende una vez
  },
  artistaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  // Datos del comprador
  compradorNombre: { type: String, required: true, trim: true },
  compradorEmail: { type: String, default: '' },
  compradorRut: { type: String, default: '' },

  // Venta
  precioVenta: { type: Number, required: true },
  moneda: { type: String, enum: ['CLP', 'USD', 'EUR'], default: 'CLP' },
  fechaVenta: { type: Date, default: Date.now },

  // Certificado de autenticidad
  codigoCertificado: {
    type: String,
    unique: true,
    default: function () {
      const random = crypto.randomBytes(4).toString('hex').toUpperCase();
      return `ARTG-${random}`;
    }
  },
  certificadoVerificado: { type: Boolean, default: true },

}, {
  timestamps: true
});

// Índices
ventaSchema.index({ artistaId: 1 });
ventaSchema.index({ codigoCertificado: 1 });

module.exports = mongoose.model('Venta', ventaSchema);
