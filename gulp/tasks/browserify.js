const gulp       = require('gulp');
const gutil      = require('gulp-util');
const gulpif     = require('gulp-if');
const browserify = require('browserify');
const watchify   = require('watchify');
const source     = require('vinyl-source-stream');
const reload     = require('browser-sync').reload;
const config     = require('../config').browserify;
const notify     = require('../utils/notify');

/**
 * utils
 */
let is_dev = true;
let is_watching = false;

// Call cb after called num times.
const counter = (num, callback) => {
  let called = 0;
  return () => {
    called += 1;
    if (called === num) { callback(); }
  };
};

// Bundle each config
const cafe = (c, callback) => {
  const bundler = browserify({
    entries      : c.src,
    extensions   : ['.coffee'],
    debug        : is_dev,
    cache        : {},
    packageCache : {},
    fullPaths    : true,
  });

  bundler.transform('coffeeify');

  console.log('#### browserify: rebuild');

  bundler.bundle()
    .on('error', (e) => { console.log(e); return notify.error('Compile Error'); })
    .pipe(source(c.name))
    .pipe(gulp.dest(c.dst))
    .pipe(gulpif(is_watching, reload({stream: true})));

  callback();
};

/**
 * Tasks
 */
gulp.task('browserify', (cb) => {
  if (process.env.NODE_ENV === 'production') {
    is_dev = false
  }
  const count = counter(config.length, cb);
  config.forEach(c => cafe(c, count));
});

gulp.task('browserify-watch', () => {
  is_watching = true;
  gulp.start('browserify');
});
