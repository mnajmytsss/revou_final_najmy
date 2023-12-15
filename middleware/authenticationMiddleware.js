const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');
const db = require('../db');

async function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SIGN);
    if (!decoded.id) {
        return res.status(401).json({ error: 'token salah - user ID tidak ditemukan' });
      }
    const [user] = await db.execute('SELECT * FROM USERS WHERE user_id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({ error: 'token salah - User tidak ditemukan' });
    }

    // req.user = user[0].ROLE_ID;
    req.decodedToken = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'token salah - verifikasi token gagal' });
  }
}

module.exports = authenticationMiddleware;
