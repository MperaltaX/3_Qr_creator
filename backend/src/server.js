const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Para logos en base64
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos (ej. PDFs, logos extra)
app.use('/uploads', express.static(path.resolve(__dirname, '../../', env.UPLOAD_DIR)));

// Endpoints API
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);

// Endpoint público para redirección y tracking
app.use('/q', redirectRoutes);

// Manejo de errores
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
