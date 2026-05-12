// =============================================
// server.js — Servidor Express
// ArtGest · Proyecto de Título 2026
// =============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

// Conectar a MongoDB Atlas
conectarDB();

const app = express();

// ── Middlewares globales ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ── Rutas API ──
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/obras', require('./routes/obras.routes'));
app.use('/api/convocatorias', require('./routes/convocatorias.routes'));
app.use('/api/postulaciones', require('./routes/postulaciones.routes'));
app.use('/api/mensajes', require('./routes/mensajes.routes'));
app.use('/api/certificados', require('./routes/certificados.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));

// ── Ruta de salud ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'ArtGest API funcionando' });
});

// ── Manejo de errores global ──
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor'
  });
});

// ── Levantar servidor ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ ArtGest API corriendo en puerto ${PORT}`);
  console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
});
