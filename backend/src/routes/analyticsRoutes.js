const express = require('express');
const { getQROverview, getQRAnalytics } = require('../controllers/analyticsController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

// Analytics globales de todos los QRs
router.get('/overview', getQROverview);

// Analytics de un QR específico
router.get('/:qrId', getQRAnalytics);

module.exports = router;
