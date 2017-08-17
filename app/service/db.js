var mysql = require('mysql');

const config = {
  host     : 'localhost',
  port     : 3306,
  database : process.env.NODE_ENV === 'production' ? 'wasynth2db' : 'wasynth2db_dev',
  user     : 'evil',
  password : ''
};

const m = process.env.CLEARDB_DATABASE_URL.match(
  /mysql:\/\/([^:]*):([^@]*)@(.*)\/(.*)\?.*/
);
if (m) {
  config.user = m[1];
  config.password = m[2];
  config.host = m[3];
  config.database = m[4];
}
console.log('>> config', JSON.stringify(config));
var connection = mysql.createConnection(config);

connection.connect();
module.exports = connection;
