gulp = require 'gulp'

path = require 'path'
BASE_DIR = __dirname + './../'
BASE = (p) -> path.join(BASE_DIR, p)

module.exports =
    browserify: [{
        src: [BASE 'src/coffee/main.coffee'],
        dst: BASE('static/js'),
        name: 'evil.js'
    }],
    sass:
        src: BASE 'src/scss/**/*.scss'
        dst: BASE 'static/css'
    watch:
        server: BASE('server/**/*'),
        coffee: BASE('src/coffee/**/*'),
        client: BASE('src/**/*'),
        sass  : BASE('src/scss/**/*')
