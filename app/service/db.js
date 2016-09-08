var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  database : process.env.NODE_ENV === 'production' ? 'wasynth2db' : 'wasynth2db_dev',
  user     : 'evil',
  password : ''
});

connection.connect();
module.exports = connection;
