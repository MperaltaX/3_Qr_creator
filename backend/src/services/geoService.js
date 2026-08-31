const geoip = require('fast-geoip');

const getLocationFromIP = async (ip) => {
  try {
    // Para entornos locales (localhost) retornará null
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
      return { country: 'Local', city: 'Local' };
    }
    
    const geo = await geoip.lookup(ip);
    if (geo) {
      return {
        country: geo.country,
        city: geo.city
      };
    }
    return { country: 'Unknown', city: 'Unknown' };
  } catch (error) {
    console.error('GeoIP lookup error:', error);
    return { country: 'Unknown', city: 'Unknown' };
  }
};

module.exports = { getLocationFromIP };
