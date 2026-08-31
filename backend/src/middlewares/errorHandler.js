const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de Multer (archivo muy grande, etc.)
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  // Errores comunes de base de datos o lógica
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
