// =============================================
// config/cloudinary.js — Upload directo a Cloudinary
// ArtGest · Proyecto de Título 2026
// =============================================

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer guarda en memoria, luego subimos a Cloudinary
const storage = multer.memoryStorage();

const uploadObra = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tipos = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, tipos.includes(file.mimetype));
  }
});

const uploadPerfil = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tipos = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, tipos.includes(file.mimetype));
  }
});

const uploadPDF = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  }
});

// Subir buffer a Cloudinary
function subirACloudinary(fileBuffer, opciones = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(opciones, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });
}

module.exports = { cloudinary, uploadObra, uploadPerfil, uploadPDF, subirACloudinary };