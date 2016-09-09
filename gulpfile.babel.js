const gulp = require('gulp');

require('./gulp/tasks/browserify');
require('./gulp/tasks/browserSync');
require('./gulp/tasks/build');
require('./gulp/tasks/nodemon');
require('./gulp/tasks/sass');
require('./gulp/tasks/watch');

gulp.task('dev', () => {
    process.env.NODE_ENV = 'development';
    gulp.start(['build', 'watch', 'nodemon']);
});
gulp.task('pro', () => {
    process.env.NODE_ENV = 'production';
    gulp.start(['build', 'nodemon']);
});

gulp.task('default', ['dev']);
