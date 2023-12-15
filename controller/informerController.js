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

    // Insert data user ke dalam tabel USERS
    let hasilUser;
    try {
      [hasilUser] = await db.execute(
        'INSERT INTO USERS (user_email, user_pass, role_id, user_verified) VALUES (?, ?, ?, 0)',
        [user_email, hashedPassword, role_id]
      );

    } catch (error) {
      console.error("Error during user insertion:", error);
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
        console.error("Error during informer insertion:", error);
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

async function getAllInformer(req, res) {
  try {
    // Fetch all informer from the INFORMER table
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

    // Check if inf_id is provided
    if (!inf_id) {
      return res.status(400).json({ error: 'Parameter inf_id is required.' });
    }

    // Fetch the informer with the specified ID from the INFORMER table
    const [informer] = await db.execute('SELECT * FROM INFORMER WHERE INF_ID = ?', [inf_id]);

    // Check if the informer is found
    if (informer.length === 0) {
      return res.status(404).json({ error: 'Informer tidak ditemukan' });
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

    // Fetch the existing informer with the specified ID
    const existingInformer = await db.execute('SELECT * FROM INFORMER WHERE INF_ID = ?', [inf_id]);
    arrInf = existingInformer[0];
   
    // Check if the informer is found
    if (arrInf.length === 0) {
      return res.status(404).json({ error: 'Informer not found.' });
    }

    // Ensure that the authenticated user is the owner of the informer profile
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SIGN);
    if (decoded.id !== arrInf[0].USER_ID) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk memperbarui informasi informer ini.' });
    }
    ;
    // Generate the SET part of the SQL query based on the provided updateParams
    const updateValues = Object.keys(updateParams)
      .map((key) => `${key} = ?`)
      .join(', ');

    // Prepare the SQL query with dynamic SET values
    const sqlQuery = `UPDATE INFORMER SET ${updateValues} WHERE INF_ID = ?`;

    // Prepare the values for execution
    const updateValuesArray = Object.values(updateParams);
    updateValuesArray.push(inf_id);

    // Update the informer's information in the INFORMER table
    await db.execute(sqlQuery, updateValuesArray);

    res.status(200).json({ message: 'Informasi informer berhasil diperbarui.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

module.exports = {
    registerInformer,
    getAllInformer,
    getInformerById,
    updateInformer
};
