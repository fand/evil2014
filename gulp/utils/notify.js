const gulp     = require('gulp');
const notifier = require('gulp-notify');

const error = function (title) {
    return function (...args) {
        const n = notifier.onError({
            title   : `Gulp : ${title}`,
            message : '<%= error.message %>',
        });
        n.apply(this, args);
        this.emit('end');
    };
};

const ok = function (title, message) {
    const n = notifier.notify({
        title   : title,
        message : message,
    });
    n.apply(this);
    this.emit('end');
};

module.exports = { ok, error };
