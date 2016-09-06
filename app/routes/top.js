const top = (req, res) => {
  const ua = req.headers['user-agent'];

  if (ua.match(/msie/)) {
      return res.send('ie.tx'); //TODO:render
  }
  if (ua.match(/iPhone|iPod|Android/i)) {
      return res.send('smartphone.tx');//TODO:render
  }

  // Render route.
  res.render('index');
};

module.exports = top;
