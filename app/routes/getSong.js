const mysql = require('mysql');
const db = require('../service/db');

const getSong = (req, res) => {
  db.query(`SELECT * FROM songs WHERE id = ${req.params.id}`, (err, rows) => {
    if (err) {
      res.send('not found');
    }
    console.log(rows[0]);
    res.render('index', { song: rows[0] });
  });
};

module.exports = getSong;
