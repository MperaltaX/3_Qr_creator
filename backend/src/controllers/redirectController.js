const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { trackScan } = require('../services/trackingService');

const handleRedirect = async (req, res) => {
  try {
    const { shortId } = req.params;

    const qr = await prisma.qRCode.findUnique({
      where: { short_id: shortId }
    });

    if (!qr) {
      // Idealmente, redirigir a una página 404 del frontend
      return res.status(404).send('<h1>QR no encontrado</h1>');
    }

    if (!qr.is_active) {
      return res.status(403).send('<h1>Este código QR ha sido desactivado temporalmente.</h1>');
    }

    // Tracking asíncrono
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referer = req.headers['referer'] || null;

    trackScan(qr.id, ip, userAgent, referer).catch(err => {
      console.error('Error tracking scan:', err);
    });

    // Actualizamos el contador general
    await prisma.qRCode.update({
      where: { id: qr.id },
      data: { total_scans: { increment: 1 } }
    });

    // Dependiendo del tipo, decidimos qué hacer
    if (qr.type === 'FILE' && qr.file_path) {
      const fileUrl = `${process.env.BASE_URL}/uploads/${qr.file_path}`;
      return res.redirect(302, fileUrl);
    }

    if (qr.type === 'URL' && qr.destination_url) {
      return res.redirect(302, qr.destination_url);
    }

    if (qr.type === 'TEXT') {
      const text = qr.content_data.text || '';
      return res.send(`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f3f4f6; }
              .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 90%; text-align: center; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>Mensaje</h2>
              <p>${text.replace(/\n/g, '<br>')}</p>
            </div>
          </body>
        </html>
      `);
    }

    if (qr.type === 'EMAIL') {
      const { email = '', subject = '', message = '' } = qr.content_data || {};
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      return res.redirect(302, mailtoUrl);
    }

    if (qr.type === 'VCARD') {
      const { firstName = '', lastName = '', phone = '', vcardEmail = '', company = '', job = '' } = qr.content_data || {};
      const vcfData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${firstName} ${lastName}`,
        `ORG:${company}`,
        `TITLE:${job}`,
        `TEL;TYPE=WORK,VOICE:${phone}`,
        `EMAIL:${vcardEmail}`,
        'END:VCARD'
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', `attachment; filename="${firstName}_${lastName}.vcf"`);
      return res.send(vcfData);
    }

    // Fallback if type not handled
    return res.redirect(302, `${process.env.FRONTEND_URL}/`);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = {
  handleRedirect
};
