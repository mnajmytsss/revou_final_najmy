const dotenv = require("dotenv");

dotenv.config();

const JWT_SIGN = process.env.JWT_SIGN;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10; 

module.exports = {
  JWT_SIGN,
  BCRYPT_SALT_ROUNDS,
};
