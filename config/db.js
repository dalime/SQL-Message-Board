const mysql = require('mysql');
/*const error = require('chalk').white.bgRed.bold;

if(!process.env.MYSQL_PASSWORD) {
  throw error("Missing environment variable: MYSQL_PASSWORD");
}
*/
const db = mysql.createConnection(process.env.JAWSDB_URL || {
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'testdb'
});

db.connect();

module.exports = db;
