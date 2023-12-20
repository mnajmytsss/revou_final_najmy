const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');
const bcrypt = require('bcrypt');

const validRoles = ['2'];

async function registerDoctor(req, res) {
  try {
    const [userData, dokterData] = req.body;
    const { user_email, user_pass, role_id } = userData;
    const { dok_name, dok_spec, dok_email, dok_telp, dok_bio, dok_nostr, dok_location, dok_exp } = dokterData;

    if (!user_email || !user_pass || !validRoles.includes(role_id)) {
      return res.status(400).json({ error: 'Silakan lengkapi semua data pada setiap objek registrasi.' });
    }

    const isTelpUsed = await isFieldUsed('DOK_TELP', dok_telp);
    const isNostrUsed = await isFieldUsed('DOK_NOSTR', dok_nostr);

    if (isTelpUsed) {
      return res.status(400).json({ error: 'Nomor telepon sudah digunakan.' });
    }

    if (isNostrUsed) {
      return res.status(400).json({ error: 'Nomor STR sudah digunakan.' });
    }

    // Hash password sebelum dimasukkan ke dalam database
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // Insert data user ke dalam tabel USERS
    const [hasilUser] = await db.execute(
      'INSERT INTO USERS (user_email, user_pass, role_id, user_verified) VALUES (?, ?, ?, 0)',
      [user_email, hashedPassword, role_id]
    );

    const insertedUserId = hasilUser.insertId;

    // Jika rolenya adalah dokter (role_id === '2'), tambahkan data dokter ke dalam tabel DOCTORS
    if (role_id === '2') {
      const [hasilDokter] = await db.execute(
        'INSERT INTO DOCTORS (USER_ID, DOK_NAME, DOK_SPEC, DOK_EMAIL, DOK_TELP, DOK_BIO, DOK_NOSTR, DOK_LOCATION, DOK_EXP, DOK_STATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [insertedUserId, dok_name, dok_spec, dok_email, dok_telp, dok_bio, dok_nostr, dok_location, dok_exp, '0']
      );

      const insertedDokId = hasilDokter.insertId;

      res.status(201).json({ user_id: insertedUserId, dok_id: insertedDokId });
    } else {
      res.status(201).json({ user_id: insertedUserId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function isFieldUsed(fieldName, value) {
  const [result] = await db.execute(`SELECT ${fieldName} FROM DOCTORS WHERE ${fieldName} = ?`, [value]);
  return result.length > 0;
}

async function getAllDoctors(req, res) {
  try {
    // Mengambil semua dokter dari tabel DOCTORS
    const [doctors] = await db.execute('SELECT * FROM DOCTORS WHERE dok_status = 1');

    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function getDoctorById(req, res) {
  try {
    const { dok_id } = req.params;

    // Memeriksa apakah dok_id disediakan
    if (!dok_id) {
      return res.status(400).json({ error: 'Parameter dok_id diperlukan.' });
    }

    // Mengambil dokter dengan ID yang spesifik dari tabel DOCTORS
    const [doctor] = await db.execute('SELECT * FROM DOCTORS WHERE USER_ID = ?', [dok_id]);

    // Memeriksa apakah dokter ditemukan
    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Dokter tidak ditemukan.' });
    }

    res.status(200).json({ doctor: doctor[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.'});
  }
}

async function updateDoctor(req, res) {
  try {
    const { dok_id } = req.params;
    const updateParams = req.body;

    // Mengambil dokter yang ada dengan ID yang spesifik
    const existingDoctor = await db.execute('SELECT * FROM DOCTORS WHERE DOK_ID = ?', [dok_id]);
    arrDoc = existingDoctor[0];
   
    // Memeriksa apakah dokter ditemukan
    if (arrDoc.length === 0) {
      return res.status(404).json({ error: 'Dokter tidak ditemukan.' });
    }

    // Memastikan bahwa pengguna yang terautentikasi adalah pemilik profil dokter
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SIGN);
    if (decoded.id !== arrDoc[0].USER_ID) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk memperbarui informasi dokter ini.' });
    }

    // Menghasilkan bagian SET dari kueri SQL berdasarkan updateParams yang diberikan
    const updateValues = Object.keys(updateParams)
      .map((key) => `${key} = ?`)
      .join(', ');

    // Menyiapkan kueri SQL dengan nilai SET dinamis
    const sqlQuery = `UPDATE DOCTORS SET ${updateValues} WHERE DOK_ID = ?`;

    // Menyiapkan nilai untuk dieksekusi
    const updateValuesArray = Object.values(updateParams);
    updateValuesArray.push(dok_id);

    // Memperbarui informasi dokter di tabel DOCTORS
    await db.execute(sqlQuery, updateValuesArray);

    res.status(200).json({ message: 'Informasi dokter berhasil diperbarui.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

module.exports = {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
