require('dotenv').config();
const mysql = require('mysql2');

const pool  = mysql.createPool(
  process.env.CLEARDB_DATABASE_URL_DEV, {
  connectionLimit : 5,
});

module.exports = {
  pool
};
