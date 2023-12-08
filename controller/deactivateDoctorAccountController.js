const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');

async function deactivateDoctorStatus(req, res) {
  try {
    const { dok_id } = req.params;
    let dok_status = 0; 
    const existingDoctor = await db.execute('SELECT * FROM DOCTORS WHERE DOK_ID = ?', [dok_id]);
    arrDoc = existingDoctor[0];

    // Memeriksa apakah dokter ditemukan
    if (existingDoctor.length === 0) {
      return res.status(404).json({ error: 'Dokter dengan id tersebut tidak ditemukan' });
    }

    // Memeriksa apakah user yang mengakses memiliki role 3 dan pemilik akun dokter itu sendiri
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SIGN);
    if (decoded.role !== 3 && arrDoc[0].USER_ID !== decoded.id) {
        return res.status(403).json({ error: 'Anda tidak memiliki izin untuk memperbarui status dokter.' });
      }

    // Memeriksa apakah dokter memiliki dok_status yang sedang aktif (1)
    if (arrDoc[0].DOK_STATUS !== 1) {
      return res.status(400).json({ error: 'Status dokter belum aktif' });
    }

    // Update dok_status pada tabel DOCTORS
    await db.execute('UPDATE DOCTORS SET DOK_STATUS = ? WHERE DOK_ID = ?', [dok_status, dok_id]);

    res.status(200).json({ message: 'Status dokter sudah tidak aktif' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

module.exports = {
  deactivateDoctorStatus,
};
