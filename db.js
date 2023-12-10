// db.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!F4r@#mulaC0mpleja',
  database: 'gestiontareas',
});

module.exports = connection;
