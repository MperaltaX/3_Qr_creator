const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getQROverview = async (req, res) => {
  try {
    const totalQRs = await prisma.qRCode.count();
    
    // Suma total de scans
    const sumResult = await prisma.qRCode.aggregate({
      _sum: {
        total_scans: true
      }
    });
    
    const totalScans = sumResult._sum.total_scans || 0;

    // Scans de los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentScans = await prisma.scan.count({
      where: {
        scanned_at: {
          gte: sevenDaysAgo
        }
      }
    });

    res.json({
      totalQRs,
      totalScans,
      recentScans
    });
  } catch (error) {
    console.error('Error overview analytics:', error);
    res.status(500).json({ error: 'Error al obtener analytics overview' });
  }
};

const getQRAnalytics = async (req, res) => {
  try {
    const { qrId } = req.params;

    const qr = await prisma.qRCode.findUnique({
      where: { id: qrId }
    });

    if (!qr) return res.status(404).json({ error: 'QR no encontrado' });

    // Scans timeline (por día) de este QR
    const scans = await prisma.scan.findMany({
      where: { qr_id: qrId },
      orderBy: { scanned_at: 'asc' }
    });

    // Procesar datos para charts
    const timeline = {};
    const devices = {};
    const countries = {};
    const browsers = {};
    const os = {};

    scans.forEach(scan => {
      // Agrupar por día (YYYY-MM-DD)
      const day = scan.scanned_at.toISOString().split('T')[0];
      timeline[day] = (timeline[day] || 0) + 1;

      // Otros grupos
      if (scan.device_type) devices[scan.device_type] = (devices[scan.device_type] || 0) + 1;
      if (scan.country) countries[scan.country] = (countries[scan.country] || 0) + 1;
      if (scan.browser) browsers[scan.browser] = (browsers[scan.browser] || 0) + 1;
      if (scan.os) os[scan.os] = (os[scan.os] || 0) + 1;
    });

    // Formatear timeline para Recharts
    const timelineArray = Object.keys(timeline).map(date => ({
      date,
      scans: timeline[date]
    }));

    res.json({
      qrInfo: {
        name: qr.name,
        type: qr.type,
        content_data: qr.content_data,
        short_id: qr.short_id,
        design_settings: qr.design_settings,
        total_scans: qr.total_scans,
        created_at: qr.created_at
      },
      timeline: timelineArray,
      devices,
      countries,
      browsers,
      os,
      recentScans: scans.slice(-50).reverse() // Últimos 50
    });
  } catch (error) {
    console.error('Error QR analytics:', error);
    res.status(500).json({ error: 'Error al obtener analytics del QR' });
  }
};

module.exports = {
  getQROverview,
  getQRAnalytics
};
