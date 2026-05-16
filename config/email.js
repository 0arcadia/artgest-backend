// =============================================
// config/email.js — Servicio de correo (Resend)
// ArtGest · Proyecto de Título 2026
// =============================================

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Verificar configuración al iniciar
if (process.env.RESEND_API_KEY) {
  console.log('✓ Servicio de correo configurado (Resend)');
} else {
  console.warn('⚠ Correo no configurado: falta RESEND_API_KEY');
}

// ── FRONTEND URL ──
const frontendUrl = process.env.FRONTEND_URL || 'https://artgest.netlify.app';

// ── TEMPLATE DE BIENVENIDA ──
function templateBienvenida(nombre, tipoUsuario) {
  const esArtista = tipoUsuario === 'artista';
  const rol = esArtista ? 'Artista' : 'Galerista';
  const mensaje = esArtista
    ? 'Tu espacio para gestionar tu obra, postular a convocatorias y conectar con galeristas ya está listo.'
    : 'Tu espacio para publicar convocatorias, descubrir artistas y gestionar postulaciones ya está listo.';

  const funcionalidades = esArtista
    ? `<tr><td style="padding:8px 0;font-size:15px;color:#555555;">🖼️ <strong style="color:#0A0A0A;">Inventario de obras</strong> — Cataloga tu trabajo con fichas técnicas e imágenes</td></tr>
       <tr><td style="padding:8px 0;font-size:15px;color:#555555;">📣 <strong style="color:#0A0A0A;">Convocatorias</strong> — Postula a fondos, residencias y exposiciones</td></tr>
       <tr><td style="padding:8px 0;font-size:15px;color:#555555;">📄 <strong style="color:#0A0A0A;">Certificados</strong> — Genera certificados de autenticidad con QR verificable</td></tr>
       <tr><td style="padding:8px 0;font-size:15px;color:#555555;">👤 <strong style="color:#0A0A0A;">Portafolio público</strong> — Comparte tu trabajo con el mundo</td></tr>`
    : `<tr><td style="padding:8px 0;font-size:15px;color:#555555;">📣 <strong style="color:#0A0A0A;">Convocatorias</strong> — Publica y gestiona convocatorias artísticas</td></tr>
       <tr><td style="padding:8px 0;font-size:15px;color:#555555;">🔍 <strong style="color:#0A0A0A;">Descubre artistas</strong> — Explora portafolios y encuentra talento</td></tr>
       <tr><td style="padding:8px 0;font-size:15px;color:#555555;">📋 <strong style="color:#0A0A0A;">Postulaciones</strong> — Revisa y gestiona las postulaciones recibidas</td></tr>
       <tr><td style="padding:8px 0;font-size:15px;color:#555555;">⭐ <strong style="color:#0A0A0A;">Favoritos</strong> — Guarda artistas y obras que te interesen</td></tr>`;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:30px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr>
    <td style="background:#0A0A0A;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:2px;">ArtGest</h1>
      <div style="width:60px;height:3px;background:#C1440E;margin:12px auto 0;border-radius:2px;"></div>
    </td>
  </tr>

  <!-- BIENVENIDA -->
  <tr>
    <td style="padding:40px 40px 20px;">
      <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#0A0A0A;">¡Bienvenid@ a ArtGest, ${nombre}!</h2>
      <p style="margin:0 0 4px;font-size:13px;color:#C1440E;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Cuenta ${rol}</p>
      <p style="margin:16px 0 0;font-size:15px;color:#555555;line-height:1.6;">${mensaje}</p>
    </td>
  </tr>

  <!-- FUNCIONALIDADES -->
  <tr>
    <td style="padding:10px 40px 30px;">
      <p style="margin:0 0 16px;font-size:13px;color:#999999;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Lo que puedes hacer</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${funcionalidades}
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 30px;text-align:center;">
      <a href="${frontendUrl}/login" style="display:inline-block;background:#C1440E;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.5px;">Ir a mi cuenta →</a>
    </td>
  </tr>

  <!-- PRÓXIMOS PASOS -->
  <tr>
    <td style="padding:0 40px 35px;">
      <p style="margin:0 0 16px;font-size:13px;color:#999999;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Próximos pasos</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#555555;">
            <span style="display:inline-block;width:22px;height:22px;background:#FDF4F0;color:#C1440E;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:600;margin-right:10px;">1</span>
            Completa tu perfil con tu biografía y foto
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
    const { data, error } = await resend.emails.send({
      from: 'ArtGest <onboarding@resend.dev>',
      to: email,
      subject: `¡Bienvenid@ a ArtGest, ${nombre}! 🎨`,
      html: templateBienvenida(nombre, tipoUsuario),
    });

    if (error) {
      console.error('Error enviando correo:', error);
      return;
    }

    console.log(`✓ Correo de bienvenida enviado a ${email} (id: ${data.id})`);
  } catch (error) {
    console.error('Error enviando correo:', error.message);
  }
}

module.exports = { enviarBienvenida };