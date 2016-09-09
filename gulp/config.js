const gulp = require('gulp');

const path     = require('path');
const BASE_DIR = `${__dirname}/../`;
const BASE     = (p) => path.join(BASE_DIR, p);

module.exports = {
  browserify : [{
    src  : [BASE('src/coffee/main.coffee')],
    dst  : BASE('static/js'),
    name : 'evil.js',
  }],
  sass : {
    src : BASE('src/scss/**/*.scss'),
    dst : BASE('static/css'),
  },
  watch : {
    server : BASE('server/**/*'),
    coffee : BASE('src/coffee/**/*'),
    client : BASE('src/**/*'),
    sass   : BASE('src/scss/**/*'),
  },
  pm2 : {
    script : BASE('app/index.js'),
  },
};
