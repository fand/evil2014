gulp  = require 'gulp'
spawn = require('child_process').spawn

nodemon = null

gulp.task 'nodemon', ->
    nodemon.kill() if nodemon?
    nodemon = spawn('./node_modules/.bin/nodemon',
                    ['--watch', './lib', '--exec', 'sh', './script/dev.sh'],
                    { env: process.env, stdio: 'inherit' })
        .on 'close', ->
            console.log 'nodemon: process killed!'
