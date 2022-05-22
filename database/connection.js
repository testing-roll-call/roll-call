require('dotenv').config();
const mysql = require('mysql2');

const pool  = mysql.createPool(
  process.env.CLEARDB_DATABASE_URL, {
  connectionLimit : 5,
});

const testPool  = mysql.createPool({
  host     : process.env.HOST,
  database : process.env.DATABASE,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  connectionLimit : 5,
}); 

module.exports = {
  pool, testPool
};
