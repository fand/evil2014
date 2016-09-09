const gulp   = require('gulp');
const $      = require('gulp-load-plugins')();
const reload = require('browser-sync').reload;
const config = require('../config').sass;
const notify = require('../utils/notify');

let is_watching = false;

gulp.task('sass', () => {
  return gulp.src(config.src)
    .pipe($.sass())
    .pipe($.plumber())
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest(config.dst))
    .pipe($.size())
    .pipe($.if(is_watching, reload({ stream: true })));
});


gulp.task('sass-watch', () => {
    is_watching = true;
    gulp.start('sass');
});
