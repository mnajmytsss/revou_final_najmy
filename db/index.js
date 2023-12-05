// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql-week16-adriantori11-revou.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_KEUOJt8hmNbC-eGDKyE',
  database: 'revou_project',
  port: 28384,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
