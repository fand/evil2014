const gulp = require('gulp');

const path     = require('path');
const BASE_DIR = `${__dirname}/../`;
const BASE     = (p) => path.join(BASE_DIR, p);

module.exports = {
  browserify : {
      src     : BASE('src/js/**/*'),
      dst     : BASE('static/js'),
      paths   : ['src'],
      entries : ['src/js/index.js'],
      dstFile : 'evil.js',
  },
  sass : {
    src : BASE('src/scss/**/*.scss'),
    dst : BASE('static/css'),
  },
  watch : {
    server : BASE('server/**/*'),
    client : BASE('src/js/**/*'),
    sass   : BASE('src/scss/**/*'),
  },
  pm2 : {
    script : BASE('app/index.js'),
  },
};
