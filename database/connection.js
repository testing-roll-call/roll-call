const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL, {
  connectionLimit: 5
});

module.exports = {
  pool
};
