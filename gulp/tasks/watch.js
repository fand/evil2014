const gulp   = require('gulp');
const config = require('../config').watch;

gulp.task('watch', () => {
    gulp.watch(config.server, gulp.parallel('pm2'));
    gulp.watch(config.coffee, gulp.parallel('browserify-watch'));
    gulp.watch(config.client, gulp.parallel('browserify-watch'));
    gulp.watch(config.sass,   gulp.parallel('sass-watch'));
});
