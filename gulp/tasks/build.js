const gulp = require('gulp');
// require('./browserify');
// require('./sass');

gulp.task('build', gulp.parallel('browserify', 'sass'));
