const bcrypt = require('bcrypt');
const db = require('../db'); 
const { JWT_SIGN } = require('../config');
const jwt = require('jsonwebtoken')

const validRoles = ['1', '2'];

async function register(req, res) {
  try {
    const { user_email, user_pass, role_id } = req.body;

    if (!user_email || !user_pass || !validRoles.includes(role_id)) {
      let errorMessage = 'Silakan lengkapi semua data';
      if (role_id && !validRoles.includes(role_id)) {
        errorMessage = 'role_id yang Anda masukkan salah';
      }
      return res.status(400).json({ error: errorMessage });
    }

    const hashedPassword = await bcrypt.hash(user_pass, 10);

    const [result] = await db.execute(
      'INSERT INTO USERS (user_email, user_pass, role_id) VALUES (?, ?, ?)',
      [user_email, hashedPassword, role_id]
    );

    const insertedUserId = result.insertId;

    res.status(201).json({ user_id: insertedUserId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

async function login(req, res) {
  try {
    const { user_email, user_pass } = req.body;

    if (!user_email || !user_pass) {
      return res.status(400).json({ error: 'Silakan lengkapi semua data.' });
    }

    const [users] = await db.execute('SELECT * FROM USERS WHERE user_email = ?', [user_email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    }

    const user = users[0]; 

    const passwordMatch = await bcrypt.compare(user_pass, user.USER_PASS);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    }

    const tokenPayload = {
      email: user.user_email, 
      id: user.user_id, 
      role: user.role_id, 
    };

    const token = jwt.sign(tokenPayload, JWT_SIGN, {
      expiresIn: '1h', 
    });

    res.status(200).json({
      message: 'User successfully logged in',
      data: {
        token
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
    register,
    login
}
