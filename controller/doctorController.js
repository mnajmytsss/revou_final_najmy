const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');

async function registerDoctor(req, res) {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  try {
    const { dok_name, dok_spec, dok_email, dok_telp, dok_bio, dok_nostr, dok_location, dok_exp } = req.body;

    // memastikan user telah login dan memiliki role dengan value 2
    const decoded = jwt.verify(token, JWT_SIGN);
    const user_id = decoded.id
    console.log(decoded.role);
    console.log(decoded.id, dok_name, dok_spec, dok_email, dok_telp, dok_bio, dok_nostr, dok_location, dok_exp);

    if (decoded.role !== (2)) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk mendaftar sebagai dokter.' });
    }

    // mengecek apakah user_id yang diberikan valid
    const [existingUser] = await db.execute('SELECT * FROM USERS WHERE user_id = ?', [user_id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User dengan ID yang diberikan tidak ditemukan.' });
    }
    // Insert data dokter ke dalam tabel DOKTERS
    const [result] = await db.execute(
      'INSERT INTO DOCTORS (USER_ID, DOK_NAME, DOK_SPEC, DOK_EMAIL, DOK_TELP, DOK_BIO, DOK_NOSTR, DOK_LOCATION, DOK_EXP, DOK_STATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [decoded.id, dok_name, dok_spec, dok_email, dok_telp, dok_bio, dok_nostr, dok_location, dok_exp, '0']
    );

    const insertedDokId = result.insertId;

    res.status(201).json({ dok_id: insertedDokId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function getAllDoctors(req, res) {
  try {
    // Fetch all doctors from the DOKTERS table
    const [doctors] = await db.execute('SELECT * FROM DOCTORS');

    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function getDoctorById(req, res) {
  try {
    const { dok_id } = req.params;

    // Check if dok_id is provided
    if (!dok_id) {
      return res.status(400).json({ error: 'Parameter dok_id is required.' });
    }

    // Fetch the doctor with the specified ID from the DOCTORS table
    const [doctor] = await db.execute('SELECT * FROM DOCTORS WHERE DOK_ID = ?', [dok_id]);

    // Check if the doctor is found
    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    res.status(200).json({ doctor: doctor[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

module.exports = {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
};
