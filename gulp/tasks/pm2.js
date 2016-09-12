const gulp = require('gulp');
const pm2  = require('pm2');
const c    = require('../config').pm2;

const opts = {
  script: c.script,
  exec_mode : 'cluster',
  instances : 4,
};

gulp.task('pm2', (done) => {
  pm2.connect((err) => {
    if (err) { console.error(err); process.exit(2); }
    pm2.start(opts, (err, apps) => {
      pm2.disconnect();
      done();
      if (err) { throw err; }
    });
  });
});
