const gulp = require('gulp');

require('./gulp/tasks/browserify');
require('./gulp/tasks/browserSync');
require('./gulp/tasks/pm2');
require('./gulp/tasks/sass');
require('./gulp/tasks/build');
require('./gulp/tasks/watch');

gulp.task('dev', gulp.series(
    () => { process.env.NODE_ENV = 'development'; },
    gulp.parallel('build', 'watch', 'pm2')
));
gulp.task('pro', gulp.series(
    () => { process.env.NODE_ENV = 'production'; },
    gulp.parallel('build', 'pm2')
));

gulp.task('default', gulp.series('dev'));
