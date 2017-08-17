const gulp        = require('gulp');
const browserSync = require('browser-sync');

gulp.task('browserSync', () => {
    browserSync({ proxy: 'localhost:9000', open: false })
});
