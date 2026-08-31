const { customAlphabet } = require('nanoid');

// Usamos un alfabeto amigable para URLs (sin caracteres confusos)
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

const generateShortId = () => {
  return nanoid();
};

module.exports = generateShortId;
