// =============================================
// config/email.js — Servicio de correo
// ArtGest · Proyecto de Título 2026
// =============================================

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar conexión al iniciar
transporter.verify()
  .then(() => console.log('✓ Servicio de correo configurado'))
  .catch(err => console.warn('⚠ Correo no configurado:', err.message));

// ── TEMPLATE DE BIENVENIDA ──
function templateBienvenida(nombre, tipoUsuario) {
  const esArtista = tipoUsuario === 'artista';
  const rol = esArtista ? 'Artista' : 'Galerista';
  const mensaje = esArtista
    ? 'Tu espacio para gestionar tu obra, postular a convocatorias y conectar con galeristas ya está listo.'
    : 'Tu espacio para publicar convocatorias, descubrir artistas y gestionar postulaciones ya está listo.';

  const funcionalidades = esArtista
    ? `
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">🖼️ <strong style="color:#0A0A0A;">Inventario de obras</strong> — Cataloga tu trabajo con fichas técnicas e imágenes</td></tr>
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">📣 <strong style="color:#0A0A0A;">Convocatorias</strong> — Postula a fondos, residencias y exposiciones</td></tr>
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">📄 <strong style="color:#0A0A0A;">Certificados</strong> — Genera certificados de autenticidad con QR verificable</td></tr>
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">👤 <strong style="color:#0A0A0A;">Portafolio público</strong> — Comparte tu trabajo con el mundo</td></tr>
    `
    : `
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">📣 <strong style="color:#0A0A0A;">Publicar convocatorias</strong> — Llega a artistas de todo Chile</td></tr>
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">🔍 <strong style="color:#0A0A0A;">Explorar artistas</strong> — Descubre nuevos talentos y portafolios</td></tr>
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">✅ <strong style="color:#0A0A0A;">Gestionar postulaciones</strong> — Revisa y selecciona artistas</td></tr>
      <tr><td style="padding:8px 0;font-size:15px;color:#555555;">💬 <strong style="color:#0A0A0A;">Mensajería directa</strong> — Contacta artistas sin intermediarios</td></tr>
    `;

  const frontendUrl = process.env.FRONTEND_URL || 'https://artegest.netlify.app';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<!-- CONTENEDOR PRINCIPAL -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr>
    <td style="background:#0A0A0A;padding:40px 40px 35px;text-align:center;">
      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">ArtGest</h1>
      <p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.4);">Plataforma de gestión para artistas visuales</p>
    </td>
  </tr>

  <!-- LÍNEA TERRA -->
  <tr><td style="background:#C1440E;height:4px;"></td></tr>

  <!-- BIENVENIDA -->
  <tr>
    <td style="padding:45px 40px 10px;">
      <p style="margin:0 0 6px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#C1440E;font-weight:500;">Bienvenid@ a ArtGest</p>
      <h2 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#0A0A0A;line-height:1.2;">¡Hola, ${nombre}!</h2>
      <p style="margin:0 0 25px;font-size:16px;color:#555555;line-height:1.7;">
        Tu cuenta como <strong style="color:#C1440E;">${rol}</strong> se ha creado exitosamente. ${mensaje}
      </p>
    </td>
  </tr>

  <!-- SEPARADOR -->
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #EDE6DC;"></div></td></tr>

  <!-- FUNCIONALIDADES -->
  <tr>
    <td style="padding:30px 40px;">
      <p style="margin:0 0 15px;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#888888;font-weight:500;">Lo que puedes hacer</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${funcionalidades}
      </table>
    </td>
  </tr>

  <!-- BOTÓN CTA -->
  <tr>
    <td style="padding:10px 40px 40px;text-align:center;">
      <a href="${frontendUrl}/login" style="display:inline-block;background:#C1440E;color:#ffffff;padding:14px 36px;border-radius:6px;font-size:15px;font-weight:500;text-decoration:none;letter-spacing:0.02em;">
        Ingresar a mi cuenta →
      </a>
    </td>
  </tr>

  <!-- SEPARADOR -->
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #EDE6DC;"></div></td></tr>

  <!-- PRÓXIMOS PASOS -->
  <tr>
    <td style="padding:30px 40px;">
      <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#888888;font-weight:500;">Próximos pasos</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#555555;">
            <span style="display:inline-block;width:22px;height:22px;background:#FDF4F0;color:#C1440E;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:600;margin-right:10px;">1</span>
            Completa tu perfil con tu bio y foto
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#555555;">
            <span style="display:inline-block;width:22px;height:22px;background:#FDF4F0;color:#C1440E;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:600;margin-right:10px;">2</span>
            ${esArtista ? 'Sube tus primeras obras al inventario' : 'Publica tu primera convocatoria'}
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#555555;">
            <span style="display:inline-block;width:22px;height:22px;background:#FDF4F0;color:#C1440E;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:600;margin-right:10px;">3</span>
            ${esArtista ? 'Explora convocatorias abiertas y postula' : 'Explora artistas y guarda tus favoritos'}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#0A0A0A;padding:30px 40px;text-align:center;">
      <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:#ffffff;">ArtGest</p>
      <p style="margin:0 0 15px;font-size:12px;color:rgba(255,255,255,0.4);">Plataforma de gestión para artistas visuales</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6;">
        Este correo fue enviado porque creaste una cuenta en ArtGest.<br>
        Si no fuiste tú, puedes ignorar este mensaje.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}

// ── ENVIAR CORREO DE BIENVENIDA ──
async function enviarBienvenida(email, nombre, tipoUsuario) {
  try {
    await transporter.sendMail({
      from: `"ArtGest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `¡Bienvenid@ a ArtGest, ${nombre}! 🎨`,
      html: templateBienvenida(nombre, tipoUsuario),
    });
    console.log(`✓ Correo de bienvenida enviado a ${email}`);
  } catch (error) {
    console.error('Error enviando correo:', error.message);
    // No lanzar error — el registro no debe fallar por el correo
  }
}

module.exports = { enviarBienvenida };