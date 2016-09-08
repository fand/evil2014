const top = (req, res) => {
  const ua = req.headers['user-agent'];

  if (ua.match(/msie/)) {
      return res.render('ie', { phone: 1 });
  }
  if (ua.match(/iPhone|iPod|Android/i)) {
      return res.render('smartphone', { phone: 1 });
  }
  res.render('index');
};

module.exports = top;
