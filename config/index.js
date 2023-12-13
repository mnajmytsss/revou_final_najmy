const dotenv = require("dotenv");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

dotenv.config();

const JWT_SIGN = process.env.JWT_SIGN;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10; 
const AWS_REGION = process.env.AWS_REGION;

// Konfigurasi kredensial AWS
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = {
  JWT_SIGN,
  BCRYPT_SALT_ROUNDS,
  AWS_REGION,
};

