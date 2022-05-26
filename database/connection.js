const mysql = require('mysql2');

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL, {
  connectionLimit: 5,
});

module.exports = {
  pool,
};
