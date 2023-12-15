const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config/index');

const middlewareOtorisasi = (peranDiizinkan) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Tidak diizinkan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenTerdekripsi = jwt.verify(token, JWT_SIGN);
    
    // Periksa apakah peran token yang terdekripsi termasuk dalam peran yang diizinkan
    if (peranDiizinkan.includes(tokenTerdekripsi.role)) {
      next();
    } else {
      return res.status(403).json({ error: 'Akses ditolak!' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const middlewareOtorisasiUntukPeran1 = middlewareOtorisasi("1");
const middlewareOtorisasiUntukPeran2 = middlewareOtorisasi("2");
const middlewareOtorisasiUntukPeran3 = middlewareOtorisasi("3");

module.exports = {
  middlewareOtorisasiUntukPeran1,
  middlewareOtorisasiUntukPeran2,
  middlewareOtorisasiUntukPeran3
};
