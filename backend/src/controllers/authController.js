const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos o creamos el usuario admin (solo hay 1 en el sistema)
    let user = await prisma.adminUser.findUnique({
      where: { email: env.ADMIN_EMAIL }
    });

    if (!user) {
      // Si es la primera vez, creamos el admin basado en .env
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, salt);
      user = await prisma.adminUser.create({
        data: {
          email: env.ADMIN_EMAIL,
          password_hash: hashedPassword
        }
      });
    }

    // Si el email no coincide con el admin
    if (email !== env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Validamos contraseña (contra la de la BD que se inicializó con la del .env)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getMe = async (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email } });
};

module.exports = {
  login,
  getMe
};
