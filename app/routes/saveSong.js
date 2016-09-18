const db = require('../service/db');

const saveSong = (req, res) => {
  const song = req.body.song;
  try {
    JSON.parse(song);
    db.query('INSERT INTO songs SET ?', { json : song }, (err, result) => {
      if (err) {
        return res.sendStatus(400);
      }
      console.log(result.insertId);
      res.json({ id : result.insertId });
    });
  }
  catch (e) {
    res.sendStatus(400);
  }
};

module.exports = saveSong;
