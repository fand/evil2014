const saveSong = (req, res) => {
  console.log(req.body.song);
  res.status(404).send('foo');
};

module.exports = saveSong;
