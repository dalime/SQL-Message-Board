const mysql = require('mysql');

const db = mysql.createConnection(process.env.JAWSDB_URL || {
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'testdb'
});

db.connect();

module.exports = db;
