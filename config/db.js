// =============================================
// config/db.js — Conexión a MongoDB Atlas
// ArtGest · Proyecto de Título 2026
// =============================================

const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Atlas conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;
