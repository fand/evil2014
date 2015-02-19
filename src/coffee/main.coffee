$ = require 'jquery'

Player   = require './Player'
Keyboard = require './Keyboard'

# ------------------------------------------------------------------------------
# CONSTANT

CONSTANT = require './Constant'

sorry = ->
    $('#top-sorry').show()
    $('#top-logo-wrapper').addClass('logo-sorry')


initEvil = ->

    # Don't use MutekiTimer here!!
    # (it causes freeze)
    setTimeout((() =>
        $('#top').css(
            opacity: '0'
        ).delay(500).css('z-index', '-1')
        $('#top-logo').css(
            '-webkit-transform': 'translate3d(0px, -100px, 0px)'
            opacity: '0'
        )
    ), 1500)

    window.CONTEXT  = new webkitAudioContext()
    window.player   = new Player()
    window.keyboard = new Keyboard(window.player)

    footer_size = $(window).height()/2 - 300
    $('footer').css('height', footer_size + 'px')


    # Read song
    if song_read?
        player.readSong(song_read)
    else
        player.readSong(CONSTANT.SONG_DEFAULT)


# ------------------------------------------------------------------------------
# Main

$(() ->

    console.log('Welcome to evil!')

    ua = window.navigator.userAgent.toLowerCase()
    if ua.match(/chrome/g)
        initEvil()
    else
        sorry()

)
