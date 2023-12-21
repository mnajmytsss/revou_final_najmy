const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');
const bcrypt = require('bcrypt');

const validRoles = ['1'];

async function registerInformer(req, res) {
  try {
    const [userData, informerData] = req.body;
    const { user_email, user_pass, role_id } = userData;
    const { inf_name, inf_nik, inf_telp } = informerData;

    if (!user_email || !user_pass || !validRoles.includes(role_id)) {
      return res.status(400).json({ error: 'Silakan lengkapi semua data pada setiap objek registrasi.' });
    }

    console.log("Request Body:", req.body);

    const hashedPassword = await bcrypt.hash(user_pass, 10);

    const isNikUsed = await isFieldUsed('INF_NIK', inf_nik);

    if (isNikUsed) {
      return res.status(400).json({ error: 'NIK sudah terdaftar.' });
    }

    // Insert data user ke dalam tabel USERS
    let hasilUser;
    try {
      [hasilUser] = await db.execute(
        'INSERT INTO USERS (user_email, user_pass, role_id, user_verified) VALUES (?, ?, ?, 0)',
        [user_email, hashedPassword, role_id]
      );

    } catch (error) {
      console.error("Error selama penyisipan pengguna:", error);
      throw error; // Untuk melihat stack trace lengkap pada console
    }

    const insertedUserId = hasilUser.insertId;

    // Jika rolenya adalah informer (role_id === '1'), tambahkan data informer ke dalam tabel INFORMER
    if (role_id === '1') {
      try {
        const [hasilInformer] = await db.execute(
          'INSERT INTO INFORMER (USER_ID, INF_NAME, INF_NIK, INF_TELP) VALUES (?, ?, ?, ?)',
          [insertedUserId, inf_name, inf_nik, inf_telp]
        );

        const insertedInfId = hasilInformer.insertId;

        res.status(201).json({ user_id: insertedUserId, inf_id: insertedInfId });
      } catch (error) {
        console.error("Error selama penyisipan informer:", error);
        throw error; // Untuk melihat stack trace lengkap pada console
      }
    } else {
      res.status(201).json({ user_id: insertedUserId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function isFieldUsed(fieldName, value) {
  const [result] = await db.execute(`SELECT ${fieldName} FROM INFORMER WHERE ${fieldName} = ?`, [value]);
  return result.length > 0;
}

async function getAllInformer(req, res) {
  try {
    // Mengambil semua informer dari tabel INFORMER
    const [informer] = await db.execute('SELECT * FROM INFORMER');

    res.status(200).json({ informer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function getInformerById(req, res) {
  try {
    const { inf_id } = req.params;

    // Memeriksa apakah inf_id disediakan
    if (!inf_id) {
      return res.status(400).json({ error: 'Parameter inf_id diperlukan.' });
    }

    // Mengambil informer dengan ID yang spesifik dari tabel INFORMER
    const [informer] = await db.execute('SELECT * FROM INFORMER WHERE USER_ID = ?', [inf_id]);

    // Memeriksa apakah informer ditemukan
    if (informer.length === 0) {
      return res.status(404).json({ error: 'Informer tidak ditemukan.' });
    }

    res.status(200).json({ informer: informer[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.'});
  }
}

async function updateInformer(req, res) {
  try {
    const { inf_id } = req.params;
    const updateParams = req.body;

    // Mengambil informer yang ada dengan ID yang spesifik
    const existingInformer = await db.execute('SELECT * FROM INFORMER WHERE USER_ID = ?', [inf_id]);
    const arrInf = existingInformer[0];
   
    // Memeriksa apakah informer ditemukan
    if (arrInf.length === 0) {
      return res.status(404).json({ error: 'Informer tidak ditemukan.' });
    }

    // Memastikan bahwa pengguna yang terautentikasi adalah pemilik profil informer
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SIGN);
    if (decoded.id !== arrInf[0].USER_ID) {
      return res.status  (403).json({ error: 'Anda tidak memiliki izin untuk memperbarui informasi informer ini.' });
    }

    // Pemeriksaan untuk memastikan hanya nama yang diperbarui
    if ('NIK' in updateParams || 'nomor_telepon' in updateParams) {
      return res.status(400).json({ error: 'Anda tidak diizinkan untuk memperbarui NIK atau nomor telepon.' });
    }

    // Menghasilkan bagian SET dari kueri SQL berdasarkan updateParams yang diberikan
    const updateValues = Object.keys(updateParams)
      .map((key) => `${key} = ?`)
      .join(', ');

    // Menyiapkan kueri SQL dengan nilai SET dinamis
    const sqlQuery = `UPDATE INFORMER SET ${updateValues} WHERE USER_ID = ?`;

    // Menyiapkan nilai untuk dieksekusi
    const updateValuesArray = Object.values(updateParams);
    updateValuesArray.push(inf_id);

    // Memperbarui informasi informer di tabel INFORMER
    await db.execute(sqlQuery, updateValuesArray);

    res.status(200).json({ message: 'Informasi informer berhasil diperbarui.' });
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      // Kesalahan duplicate entry
      res.status(400).json({ error: 'NIK atau nomor telepon sudah terdaftar.' });
    } else {
      // Kesalahan lainnya
      res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
  }
}



module.exports = {
    registerInformer,
    getAllInformer,
    getInformerById,
    updateInformer
};
