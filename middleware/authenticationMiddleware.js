const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');
const db = require('../db');

async function middlewareAutentikasi(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak tersedia' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SIGN);
    if (!decoded.id) {
      return res.status(401).json({ error: 'Token tidak valid - ID pengguna tidak tersedia' });
    }
    const [user] = await db.execute('SELECT * FROM USERS WHERE user_id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({ error: 'Token tidak valid - Pengguna tidak ditemukan' });
    }

    // req.user = user[0].ROLE_ID;
    req.decodedToken = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token tidak valid - Verifikasi token gagal' });
  }
}

module.exports = middlewareAutentikasi;
