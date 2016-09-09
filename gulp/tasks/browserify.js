const gulp       = require('gulp');
const gutil      = require('gulp-util');
const gulpif     = require('gulp-if');
const browserify = require('browserify');
const watchify   = require('watchify');
const uglify     = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const reload     = require('browser-sync').reload;
const config     = require('../config').browserify;
const notify     = require('../utils/notify');

const env = {
  ENABLE_MINIFY     : process.env.NODE_ENV === 'production',
  ENABLE_SOURCEMAPS : process.env.NODE_ENV !== 'production',
};

/**
 * utils
 */

const bundler = (entries, isWatching) => {
    const opts = {
        cache        : {},
        packageCache : {},
        extensions   : ['.coffee'],
        transform    : ['coffeeify', 'babelify'],
        paths        : config.paths,
        debug        : env.ENABLE_SOURCEMAPS,
        entries,
    };

    if (isWatching) {
        return watchify(browserify({ ...watchify.args, ...opts }));
    }
    else {
        return browserify(opts);
    }
};

/**
 * 設定を受け取り、bundle streamを作る関数を返す
 * @param {Object} c - config
 * @param {boolean} isWatching - watchifyするかどうか
 * @returns {Stream} bundle
 */
const setupBundle = (c, isWatching) => {
  const b = bundler(c.entries, isWatching);

  // JSファイル更新時に毎回呼ばれる関数
  // browserify実行結果のstreamを返す
  const bundle = () => {
    return b.bundle()
      .on('error', (e) => { console.log(e); return notify.error('Compile Error'); })
      .pipe(source(c.dstFile))
      .pipe(buffer())
      .pipe(gulpif(env.ENABLE_SOURCEMAPS, sourcemaps.init({ loadMaps : true })))
      .pipe(gulpif(env.ENABLE_MINIFY, uglify({ preserveComments : 'license' })))
      .pipe(gulpif(env.ENABLE_SOURCEMAPS, sourcemaps.write()))
      .pipe(gulp.dest(config.dst))
      .pipe(gulpif(isWatching, reload({stream: true})));
  };

  b.on('update', bundle);
  b.on('log', gutil.log);

  return bundle;
};

/**
 * Tasks
 */
gulp.task('browserify', setupBundle(config));
gulp.task('watchify', setupBundle(config, true));
