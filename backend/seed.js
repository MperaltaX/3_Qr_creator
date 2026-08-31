require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { nanoid } = require('nanoid');

const generateShortId = () => nanoid(6);

const devices = ['Mobile', 'Desktop', 'Tablet'];
const osList = ['iOS', 'Android', 'Windows', 'MacOS', 'Linux'];
const countries = ['Argentina', 'Mexico', 'Spain', 'Colombia', 'Chile', 'Peru', 'Uruguay'];
const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

async function main() {
  console.log('Seeding data...');

  // Delete all existing data to prevent duplicates during multiple seeds
  await prisma.scan.deleteMany();
  await prisma.qRCode.deleteMany();

  console.log('Deleted existing records.');

  const qrData = [
    { name: 'Menú Restaurante Centro (Dinámico)', type: 'URL', scansToCreate: 1250, is_dynamic: true },
    { name: 'WiFi Recepción (Estático)', type: 'WIFI', scansToCreate: 430, is_dynamic: false },
    { name: 'Campaña Instagram Verano (Dinámico)', type: 'URL', scansToCreate: 890, is_dynamic: true },
    { name: 'Contacto Soporte Técnico (Estático)', type: 'VCARD', scansToCreate: 120, is_dynamic: false },
  ];

  for (const data of qrData) {
    const qr = await prisma.qRCode.create({
      data: {
        short_id: generateShortId(),
        name: data.name,
        type: data.type,
        destination_url: 'https://ejemplo.com',
        content_data: { url: 'https://ejemplo.com' },
        design_settings: {},
        is_dynamic: data.is_dynamic,
        total_scans: data.scansToCreate
      }
    });

    const scansToInsert = [];
    const today = new Date();

    for (let i = 0; i < data.scansToCreate; i++) {
      // Distribución aleatoria en los últimos 14 días
      const daysAgo = Math.floor(Math.random() * 14);
      const scannedAt = new Date(today);
      scannedAt.setDate(scannedAt.getDate() - daysAgo);
      // Hora aleatoria
      scannedAt.setHours(Math.floor(Math.random() * 24));
      scannedAt.setMinutes(Math.floor(Math.random() * 60));

      scansToInsert.push({
        qr_id: qr.id,
        scanned_at: scannedAt,
        device_type: devices[Math.floor(Math.random() * devices.length)],
        os: osList[Math.floor(Math.random() * osList.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)]
      });
    }

    // Insertar scans en batches para evitar límite de consultas
    const batchSize = 250;
    for (let i = 0; i < scansToInsert.length; i += batchSize) {
      const batch = scansToInsert.slice(i, i + batchSize);
      await prisma.scan.createMany({ data: batch });
    }

    console.log(`Created QR: ${qr.name} with ${data.scansToCreate} scans.`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
