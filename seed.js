// =============================================
// seed.js — Datos de prueba
// ArtGest · Proyecto de Título 2026
// Ejecutar: npm run seed
// =============================================

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const conectarDB = require('./config/db');

const Usuario = require('./models/Usuario');
const Obra = require('./models/Obra');
const Convocatoria = require('./models/Convocatoria');
const Postulacion = require('./models/Postulacion');
const Mensaje = require('./models/Mensaje');
const Venta = require('./models/Venta');

const seed = async () => {
  await conectarDB();

  // Limpiar colecciones
  await Promise.all([
    Usuario.deleteMany({}),
    Obra.deleteMany({}),
    Convocatoria.deleteMany({}),
    Postulacion.deleteMany({}),
    Mensaje.deleteMany({}),
    Venta.deleteMany({})
  ]);
  console.log('✓ Colecciones limpiadas');

  const hash = await bcrypt.hash('12345678', 10);

  // ── USUARIOS ──
  const [artista1, artista2, galerista1] = await Usuario.create([
    {
      nombre: 'Valentina Rojas',
      email: 'valentina@artgest.cl',
      contrasenaHash: hash,
      tipoUsuario: 'artista',
      bio: 'Artista visual emergente, explorando la intersección entre naturaleza y memoria a través de técnicas mixtas.',
      region: 'Región Metropolitana',
      disciplinas: ['Pintura', 'Técnica mixta', 'Instalación'],
      formacion: 'Licenciatura en Artes Visuales, Universidad de Chile',
      instagram: '@valentinarojas.art'
    },
    {
      nombre: 'Martín Soto',
      email: 'martin@artgest.cl',
      contrasenaHash: hash,
      tipoUsuario: 'artista',
      bio: 'Fotógrafo y grabador. Trabajo en torno al paisaje urbano y la memoria colectiva.',
      region: 'Región de Valparaíso',
      disciplinas: ['Fotografía', 'Grabado'],
      formacion: 'Artes Visuales, PUCV'
    },
    {
      nombre: 'Camila Fuentes',
      email: 'camila@artgest.cl',
      contrasenaHash: hash,
      tipoUsuario: 'galerista',
      nombreGaleria: 'Galería Austral',
      descripcionGaleria: 'Espacio dedicado al arte contemporáneo emergente chileno.',
      region: 'Región Metropolitana'
    }
  ]);
  console.log('✓ 3 usuarios creados (contraseña: 12345678)');

  // ── OBRAS ──
  const obras = await Obra.create([
    {
      artistaId: artista1._id,
      titulo: 'Raíces de invierno',
      tecnica: 'Óleo sobre tela',
      dimensiones: '120 x 80 cm',
      anio: 2024,
      descripcion: 'Exploración del paisaje interior, donde las raíces del subconsciente emergen como formas orgánicas.',
      estado: 'disponible',
      precio: 450000,
      imagenUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'
    },
    {
      artistaId: artista1._id,
      titulo: 'Fragmentos de luz',
      tecnica: 'Acrílico y collage',
      dimensiones: '100 x 100 cm',
      anio: 2025,
      descripcion: 'Serie sobre la memoria fragmentada y cómo reconstruimos los recuerdos.',
      estado: 'disponible',
      precio: 380000,
      imagenUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600'
    },
    {
      artistaId: artista1._id,
      titulo: 'Territorio invisible',
      tecnica: 'Técnica mixta sobre madera',
      dimensiones: '90 x 60 cm',
      anio: 2025,
      descripcion: 'Mapas emocionales de lugares que ya no existen.',
      estado: 'reservada',
      precio: 520000,
      imagenUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600'
    },
    {
      artistaId: artista1._id,
      titulo: 'Silencio acumulado',
      tecnica: 'Instalación / Objeto',
      dimensiones: 'Variable',
      anio: 2024,
      estado: 'vendida',
      precio: 600000,
      imagenUrl: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600'
    },
    {
      artistaId: artista2._id,
      titulo: 'Edificio Fantasma',
      tecnica: 'Fotografía digital',
      dimensiones: '60 x 40 cm',
      anio: 2025,
      estado: 'disponible',
      precio: 180000,
      imagenUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600'
    },
    {
      artistaId: artista2._id,
      titulo: 'Trama urbana III',
      tecnica: 'Grabado en metal',
      dimensiones: '30 x 40 cm',
      anio: 2024,
      estado: 'disponible',
      precio: 150000,
      imagenUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'
    }
  ]);
  console.log(`✓ ${obras.length} obras creadas`);

  // ── CONVOCATORIAS ──
  const ahora = new Date();
  const en30dias = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);
  const en7dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
  const en60dias = new Date(ahora.getTime() + 60 * 24 * 60 * 60 * 1000);

  const convocatorias = await Convocatoria.create([
    {
      galeristaId: galerista1._id,
      titulo: 'Convocatoria Abierta — Galería Austral 2026',
      entidad: 'Galería Austral',
      tipo: 'galeria',
      disciplina: 'Pintura, Técnica mixta',
      descripcion: 'Buscamos artistas emergentes para exposición colectiva en sala principal durante julio 2026.',
      requisitos: 'Portfolio con mínimo 5 obras, declaración artística, CV actualizado.',
      region: 'Región Metropolitana',
      fechaApertura: ahora,
      fechaCierre: en30dias
    },
    {
      galeristaId: galerista1._id,
      titulo: 'Residencia Artística Patagonia',
      entidad: 'Fundación Austral',
      tipo: 'residencia',
      disciplina: 'Todas las disciplinas',
      descripcion: 'Residencia de 3 semanas en Puerto Natales para desarrollar obra in situ.',
      requisitos: 'Propuesta de proyecto, presupuesto estimado, cronograma.',
      region: 'Región de Magallanes',
      fechaApertura: ahora,
      fechaCierre: en7dias
    },
    {
      galeristaId: galerista1._id,
      titulo: 'FONDART Regional — Artes Visuales 2026',
      entidad: 'Ministerio de las Culturas',
      tipo: 'fondart',
      disciplina: 'Artes Visuales',
      descripcion: 'Fondo de financiamiento para proyectos artísticos regionales.',
      requisitos: 'Formulario oficial, presupuesto detallado, cartas de apoyo.',
      region: 'Nacional',
      fechaApertura: ahora,
      fechaCierre: en60dias
    }
  ]);
  console.log(`✓ ${convocatorias.length} convocatorias creadas`);

  // ── POSTULACIÓN ──
  const postulacion = await Postulacion.create({
    artistaId: artista1._id,
    convocatoriaId: convocatorias[0]._id,
    declaracionArtista: 'Mi trabajo explora la relación entre memoria y paisaje, buscando crear un diálogo entre lo personal y lo colectivo.',
    obrasAdjuntas: [obras[0]._id, obras[1]._id],
    estado: 'en revisión'
  });
  console.log('✓ 1 postulación creada');

  // ── MENSAJES ──
  const convId = Mensaje.generarConversacionId(artista1._id, galerista1._id);
  await Mensaje.create([
    {
      emisorId: galerista1._id,
      receptorId: artista1._id,
      contenido: 'Hola Valentina, vi tu portafolio y me interesa mucho tu serie "Fragmentos de luz". ¿Tendías disponibilidad para una reunión?',
      conversacionId: convId
    },
    {
      emisorId: artista1._id,
      receptorId: galerista1._id,
      contenido: '¡Hola Camila! Muchas gracias por contactarme. Claro, estoy disponible esta semana. ¿Qué día te acomoda?',
      conversacionId: convId
    },
    {
      emisorId: galerista1._id,
      receptorId: artista1._id,
      contenido: '¿Te parece el jueves a las 16:00 en la galería? Está en Lastarria 307.',
      conversacionId: convId,
      leido: false
    }
  ]);
  console.log('✓ 3 mensajes creados');

  // ── VENTA + CERTIFICADO ──
  const venta = await Venta.create({
    obraId: obras[3]._id, // "Silencio acumulado" que está vendida
    artistaId: artista1._id,
    compradorNombre: 'Roberto Méndez',
    compradorEmail: 'roberto@ejemplo.cl',
    compradorRut: '12.345.678-9',
    precioVenta: 600000,
    moneda: 'CLP'
  });
  console.log(`✓ 1 venta creada — Certificado: ${venta.codigoCertificado}`);

  console.log('\n══════════════════════════════════════');
  console.log('  SEED COMPLETADO');
  console.log('══════════════════════════════════════');
  console.log('  Usuarios de prueba:');
  console.log('  → valentina@artgest.cl  / 12345678 (artista)');
  console.log('  → martin@artgest.cl     / 12345678 (artista)');
  console.log('  → camila@artgest.cl     / 12345678 (galerista)');
  console.log(`  → Certificado QR: ${venta.codigoCertificado}`);
  console.log('══════════════════════════════════════\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('Error en seed:', err);
  process.exit(1);
});
