const gulp  = require('gulp');
const spawn = require('child_process').spawn;

let nodemon = null;

gulp.task('nodemon', () => {
    if (nodemon) { nodemon.kill(); }
    nodemon = spawn(
        './node_modules/.bin/nodemon',
        ['--watch', './lib', '--exec', 'sh', './script/dev.sh'],
        { env: process.env, stdio: 'inherit' }
    )
    .on('close', () => {
      console.log('nodemon: process killed!');
    });
});
