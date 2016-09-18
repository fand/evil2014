const db = require('../service/db');

const getSong = (req, res) => {
  db.query(`SELECT * FROM songs WHERE id = ${req.params.id}`, (err, rows) => {
    if (err) {
      res.send('not found');
    }
    const song = rows[0].json;
    res.render('index', { song: song });
  });
};

module.exports = getSong;
