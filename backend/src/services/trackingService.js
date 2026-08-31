const bowser = require('bowser');
const { getLocationFromIP } = require('./geoService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const trackScan = async (qrId, ip, userAgentStr, referer) => {
  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'Unknown';

  if (userAgentStr) {
    const ua = bowser.getParser(userAgentStr);
    browser = ua.getBrowserName() || 'Unknown';
    os = ua.getOSName() || 'Unknown';
    
    // Bowser device type mapping: mobile, tablet, desktop, tv
    const type = ua.getPlatformType();
    if (type === 'mobile') deviceType = 'Mobile';
    else if (type === 'tablet') deviceType = 'Tablet';
    else if (type === 'desktop') deviceType = 'Desktop';
    else deviceType = 'Other';
  }

  // Si la app está tras un proxy (como Nginx o Docker de red local), 
  // 'ip' puede venir como una lista. Tomamos el primer valor.
  let cleanIp = ip;
  if (ip && ip.includes(',')) {
    cleanIp = ip.split(',')[0].trim();
  }

  const location = await getLocationFromIP(cleanIp);

  await prisma.scan.create({
    data: {
      qr_id: qrId,
      ip_address: cleanIp,
      country: location.country,
      city: location.city,
      device_type: deviceType,
      os: os,
      browser: browser,
      referer: referer
    }
  });
};

module.exports = { trackScan };
