const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateShortId = require('../utils/generateShortId');
const env = require('../config/env');
const path = require('path');
const fs = require('fs');

const getQRs = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (page - 1) * limit;

    const where = type ? { type } : {};

    const [qrs, total] = await Promise.all([
      prisma.qRCode.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.qRCode.count({ where })
    ]);

    res.json({
      data: qrs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener QRs' });
  }
};

const getQRById = async (req, res) => {
  try {
    const qr = await prisma.qRCode.findUnique({
      where: { id: req.params.id }
    });
    if (!qr) return res.status(404).json({ error: 'QR no encontrado' });
    res.json(qr);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener QR' });
  }
};

const createQR = async (req, res) => {
  try {
    const { name, type, destination_url, content_data, design_settings, file_path, is_dynamic } = req.body;
    
    let shortId = generateShortId();
    // Validar unicidad (raro que colisione, pero posible)
    let exists = await prisma.qRCode.findUnique({ where: { short_id: shortId }});
    while (exists) {
      shortId = generateShortId();
      exists = await prisma.qRCode.findUnique({ where: { short_id: shortId }});
    }

    const qr = await prisma.qRCode.create({
      data: {
        short_id: shortId,
        name: name || 'Untitled QR',
        type,
        destination_url,
        content_data,
        design_settings,
        file_path,
        is_dynamic: is_dynamic !== undefined ? is_dynamic : true
      }
    });

    res.status(201).json(qr);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear QR' });
  }
};

const updateQR = async (req, res) => {
  try {
    const { name, type, destination_url, content_data, design_settings, file_path, is_dynamic } = req.body;
    
    const qr = await prisma.qRCode.update({
      where: { id: req.params.id },
      data: {
        name,
        type,
        destination_url,
        content_data,
        design_settings,
        file_path,
        is_dynamic
      }
    });

    res.json(qr);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar QR' });
  }
};

const toggleQR = async (req, res) => {
  try {
    const { is_active } = req.body;
    const qr = await prisma.qRCode.update({
      where: { id: req.params.id },
      data: { is_active }
    });
    res.json(qr);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del QR' });
  }
};

const deleteQR = async (req, res) => {
  try {
    const qr = await prisma.qRCode.findUnique({ where: { id: req.params.id } });
    if (qr && qr.file_path) {
      // Eliminar archivo asociado si existe
      const filePath = path.resolve(__dirname, '../../../', env.UPLOAD_DIR, path.basename(qr.file_path));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.qRCode.delete({ where: { id: req.params.id } });
    res.json({ message: 'QR eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar QR' });
  }
};

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  const fileUrl = `${env.BASE_URL}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
};

module.exports = {
  getQRs, getQRById, createQR, updateQR, toggleQR, deleteQR, uploadFile
};
