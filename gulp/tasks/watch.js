const gulp   = require('gulp');
const config = require('../config').watch;

gulp.task('watch:server', () => gulp.watch(config.server, gulp.parallel('pm2')));
gulp.task('watch:js', () => gulp.watch(config.client, gulp.parallel('browserify-watch')));
gulp.task('watch:css', () => gulp.watch(config.sass,   gulp.parallel('sass-watch')));

gulp.task('watch', gulp.parallel('watch:server', 'watch:js', 'watch:css'));
