const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');

const validDokStatusValues = [0, 1];

async function activateDoctorAccountController(req, res) {
  try {
    // Mendapatkan dok_id dan dok_status dari params dan body
    const { dok_id } = req.params;
    let { dok_status } = req.body;

    // Memastikan bahwa dok_status adalah nilai yang valid
    dok_status = parseInt(dok_status); 
    if (!validDokStatusValues.includes(dok_status)) {
      return res.status(400).json({ error: 'Nilai dok_status tidak valid. Hanya 0 atau 1 yang diperbolehkan.' });
    }

    // Mendapatkan informasi dokter yang akan diupdate
    const [existingDoctor] = await db.execute('SELECT * FROM DOCTORS WHERE DOK_ID = ?', [dok_id]);

    // Memeriksa apakah dokter ditemukan
    if (existingDoctor.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Memeriksa apakah user yang mengakses memiliki role 3 (admin)
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SIGN);
    if (decoded.role !== 3) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk memperbarui status dokter.' });
    }

    // Update dok_status pada tabel DOCTORS
    await db.execute('UPDATE DOCTORS SET DOK_STATUS = ? WHERE DOK_ID = ?', [dok_status, dok_id]);

    res.status(200).json({ message: 'Doctor status updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

module.exports = {
  activateDoctorAccountController,
};
