const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getQRs, getQRById, createQR, updateQR, toggleQR, deleteQR, uploadFile } = require('../controllers/qrController');
const authenticate = require('../middlewares/auth');
const env = require('../config/env');

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, '../../../', env.UPLOAD_DIR);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE }
});

router.use(authenticate);

router.get('/', getQRs);
router.get('/:id', getQRById);
router.post('/', createQR);
router.put('/:id', updateQR);
router.patch('/:id/toggle', toggleQR);
router.delete('/:id', deleteQR);
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
