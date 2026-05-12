// =============================================
// controllers/certificados.controller.js
// ArteGest · Proyecto de Título 2026
// =============================================

const Venta = require('../models/Venta');
const Obra = require('../models/Obra');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// GET /api/certificados/verificar/:codigo — Verificar certificado (público)
exports.verificar = async (req, res) => {
  try {
    const { codigo } = req.params;

    const venta = await Venta.findOne({ codigoCertificado: codigo.toUpperCase() })
      .populate({
        path: 'obraId',
        select: 'titulo tecnica dimensiones anio imagenUrl'
      })
      .populate('artistaId', 'nombre');

    if (!venta) {
      return res.status(404).json({
        verificado: false,
        mensaje: 'Certificado no encontrado. El código ingresado no corresponde a ningún certificado registrado.'
      });
    }

    res.json({
      verificado: true,
      mensaje: 'Certificado válido.',
      certificado: {
        codigo: venta.codigoCertificado,
        obra: venta.obraId,
        artista: venta.artistaId.nombre,
        comprador: venta.compradorNombre,
        fechaVenta: venta.fechaVenta,
        precioVenta: venta.precioVenta,
        moneda: venta.moneda
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar certificado.' });
  }
};

// GET /api/certificados — Listar certificados del artista
exports.listar = async (req, res) => {
  try {
    const ventas = await Venta.find({ artistaId: req.usuario._id })
      .populate('obraId', 'titulo tecnica imagenUrl anio')
      .sort({ fechaVenta: -1 });

    const stats = {
      total: ventas.length,
      verificados: ventas.filter(v => v.certificadoVerificado).length,
      montoTotal: ventas.reduce((acc, v) => acc + v.precioVenta, 0)
    };

    res.json({ ventas, stats });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener certificados.' });
  }
};

// POST /api/certificados — Registrar venta y generar certificado (artista)
exports.registrarVenta = async (req, res) => {
  try {
    const { obraId, compradorNombre, compradorEmail, compradorRut, precioVenta, moneda } = req.body;

    const obra = await Obra.findOne({ _id: obraId, artistaId: req.usuario._id });
    if (!obra) return res.status(404).json({ mensaje: 'Obra no encontrada.' });

    if (obra.estado === 'vendida') {
      return res.status(400).json({ mensaje: 'Esta obra ya fue vendida.' });
    }

    const venta = await Venta.create({
      obraId,
      artistaId: req.usuario._id,
      compradorNombre,
      compradorEmail,
      compradorRut,
      precioVenta,
      moneda: moneda || 'CLP'
    });

    obra.estado = 'vendida';
    await obra.save();

    res.status(201).json({
      mensaje: 'Venta registrada y certificado generado.',
      venta,
      codigoCertificado: venta.codigoCertificado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Esta obra ya tiene un certificado de venta.' });
    }
    console.error('Error al registrar venta:', error);
    res.status(500).json({ mensaje: 'Error al registrar venta.' });
  }
};

// GET /api/certificados/pdf/:codigo — Generar y descargar PDF con QR
exports.descargarPDF = async (req, res) => {
  try {
    const { codigo } = req.params;

    const venta = await Venta.findOne({ codigoCertificado: codigo.toUpperCase() })
      .populate({ path: 'obraId', select: 'titulo tecnica dimensiones anio' })
      .populate('artistaId', 'nombre');

    if (!venta) {
      return res.status(404).json({ mensaje: 'Certificado no encontrado.' });
    }

    const obra = venta.obraId;
    const artista = venta.artistaId.nombre;
    const fechaFmt = new Date(venta.fechaVenta).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const precioFmt = '$' + venta.precioVenta.toLocaleString('es-CL');
    const frontendUrl = process.env.FRONTEND_URL || 'https://artegest.netlify.app';
    const verificarUrl = `${frontendUrl}/verificar/${venta.codigoCertificado}`;

    // Generar QR como buffer PNG
    const qrBuffer = await QRCode.toBuffer(verificarUrl, {
      width: 140,
      margin: 1,
      color: { dark: '#0A0A0A', light: '#FFFFFF' }
    });

    // Crear PDF
    const doc = new PDFDocument({ size: 'A4', margin: 60 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=certificado_${venta.codigoCertificado}.pdf`);
    doc.pipe(res);

    const pageW = doc.page.width;
    const marginL = 60;
    const marginR = 60;
    const contentW = pageW - marginL - marginR;
    let y = 50;

    // ── BORDE DECORATIVO ──
    doc.rect(30, 30, pageW - 60, doc.page.height - 60)
       .lineWidth(1.5).stroke('#C1440E');
    doc.rect(35, 35, pageW - 70, doc.page.height - 70)
       .lineWidth(0.5).stroke('#E0D9D0');

    // ── ENCABEZADO ──
    y = 60;
    doc.fontSize(11).fillColor('#C1440E').font('Helvetica-Bold')
       .text('ARTGEST', marginL, y, { align: 'center' });
    y += 28;
    doc.fontSize(22).fillColor('#0A0A0A').font('Helvetica-Bold')
       .text('Certificado de Autenticidad', marginL, y, { align: 'center' });
    y += 32;
    doc.fontSize(10).fillColor('#888888').font('Helvetica')
       .text('Certificate of Authenticity', marginL, y, { align: 'center' });
    y += 20;

    // ── LÍNEA SEPARADORA ──
    doc.moveTo(marginL + 40, y).lineTo(pageW - marginR - 40, y)
       .lineWidth(1).stroke('#C1440E');
    y += 25;

    // ── CÓDIGO ──
    doc.fontSize(11).fillColor('#888888').font('Helvetica')
       .text('Código de verificación', marginL, y, { align: 'center' });
    y += 18;
    doc.fontSize(18).fillColor('#C1440E').font('Helvetica-Bold')
       .text(venta.codigoCertificado, marginL, y, { align: 'center' });
    y += 35;

    // ── DATOS DE LA OBRA ──
    const labelX = marginL + 20;
    const valueX = marginL + 160;

    function addField(label, value) {
      doc.fontSize(9).fillColor('#888888').font('Helvetica')
         .text(label, labelX, y);
      doc.fontSize(11).fillColor('#0A0A0A').font('Helvetica-Bold')
         .text(value || '—', valueX, y);
      y += 22;
    }

    doc.fontSize(12).fillColor('#0A0A0A').font('Helvetica-Bold')
       .text('Datos de la obra', labelX, y);
    y += 5;
    doc.moveTo(labelX, y + 10).lineTo(pageW - marginR - 20, y + 10)
       .lineWidth(0.5).stroke('#E0D9D0');
    y += 20;

    addField('Título', obra.titulo);
    addField('Técnica', obra.tecnica);
    addField('Dimensiones', obra.dimensiones || 'No especificado');
    addField('Año', obra.anio ? String(obra.anio) : 'No especificado');
    addField('Artista', artista);
    y += 10;

    // ── DATOS DE LA VENTA ──
    doc.fontSize(12).fillColor('#0A0A0A').font('Helvetica-Bold')
       .text('Datos de la transacción', labelX, y);
    y += 5;
    doc.moveTo(labelX, y + 10).lineTo(pageW - marginR - 20, y + 10)
       .lineWidth(0.5).stroke('#E0D9D0');
    y += 20;

    addField('Adquirida por', venta.compradorNombre);
    if (venta.compradorRut) addField('RUT', venta.compradorRut);
    addField('Fecha de venta', fechaFmt);
    addField('Precio', precioFmt + ' ' + (venta.moneda || 'CLP'));
    y += 15;

    // ── QR ──
    const qrSize = 120;
    const qrX = (pageW - qrSize) / 2;
    doc.image(qrBuffer, qrX, y, { width: qrSize, height: qrSize });
    y += qrSize + 10;

    doc.fontSize(8).fillColor('#888888').font('Helvetica')
       .text('Escanea para verificar autenticidad', marginL, y, { align: 'center' });
    y += 12;
    doc.fontSize(7).fillColor('#AAAAAA').font('Helvetica')
       .text(verificarUrl, marginL, y, { align: 'center' });
    y += 30;

    // ── DECLARACIÓN ──
    doc.fontSize(8).fillColor('#888888').font('Helvetica')
       .text(
         'Este certificado acredita la autenticidad y procedencia de la obra descrita. ' +
         'Ha sido emitido a través de la plataforma ArtGest y puede ser verificado en cualquier ' +
         'momento escaneando el código QR o ingresando el código en artgest.netlify.app/verificar.',
         marginL + 20, y, { width: contentW - 40, align: 'center', lineGap: 3 }
       );

    // ── FOOTER ──
    doc.fontSize(7).fillColor('#AAAAAA').font('Helvetica')
       .text('ArtGest · Plataforma de gestión para artistas visuales · artgest.netlify.app',
         marginL, doc.page.height - 55, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ mensaje: 'Error al generar el certificado PDF.' });
  }
};