const mysql = require('mysql2');
// const fs = require('fs');
require('dotenv').config();

// const cert = fs.readFileSync('database/BaltimoreCyberTrustRoot.crt.pem');

const config = {
  host: process.env.AZURE_HOST,
  user: process.env.AZURE_USER,
  password: process.env.AZURE_PASSWORD,
  database: process.env.AZURE_DATABASE,
  port: 3306,
  connectionLimit: 10
  // ssl: { ca: cert }
};

const pool = mysql.createPool(config);

module.exports = {
  pool
};
