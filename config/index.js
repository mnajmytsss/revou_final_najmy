const dotenv = require('dotenv');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { s3 } = require('./awsConfig');

dotenv.config();

const JWT_SIGN = process.env.JWT_SIGN;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const AWS_REGION = process.env.AWS_REGION;

module.exports = {
  JWT_SIGN,
  BCRYPT_SALT_ROUNDS,
  AWS_REGION,
  s3
};
