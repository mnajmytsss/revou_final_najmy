const db = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config');

async function registerInformer(req, res) {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  try {
    const { inf_name, inf_nik, inf_telp } = req.body;

    // memastikan user telah login dan memiliki role dengan value 1
    const decoded = jwt.verify(token, JWT_SIGN);
    const user_id = decoded.id

    if (decoded.role !== (1)) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk mendaftar sebagai informer.' });
    }

    // mengecek apakah user_id yang diberikan valid
    const [existingUser] = await db.execute('SELECT * FROM USERS WHERE user_id = ?', [user_id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User dengan ID yang diberikan tidak ditemukan.' });
    }

    // Check if the user has already registered as an informer
    const [existingInformer] = await db.execute('SELECT * FROM INFORMER WHERE USER_ID = ?', [user_id]);
    if (existingInformer.length > 0) {
      return res.status(400).json({ error: 'Anda sudah terdaftar sebagai pelapor.' });
    }

    // Insert data informer ke dalam tabel INFORMER
    const [result] = await db.execute(
      'INSERT INTO INFORMER (USER_ID, INF_NAME, INF_NIK, INF_TELP) VALUES (?, ?, ?, ?)',
      [decoded.id, inf_name, inf_nik, inf_telp]
    );

    const insertedInfId = result.insertId;

    res.status(201).json({ inf_id: insertedInfId });
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
