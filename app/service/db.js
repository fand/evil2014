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

let connection;

const connect = () => {
  console.log('INFO.CONNECTION_DB: ');
  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      console.log('ERROR.CONNECTION_DB: ', err);
      setTimeout(connect, 1000);
    }
  });

  connection.on('error', (err) => {
    console.log('ERROR.DB: ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('ERROR.CONNECTION_LOST: ', err);
      connect();
    }
    else {
      throw err;
    }
  });
};

connect();
module.exports = connection;
