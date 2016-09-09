const $        = require('jquery');
const Player   = require('./Player');
const Keyboard = require('./Keyboard');
const Midi     = require('./Midi');
const CONSTANT = require('./Constant');

const sorry = () => {
    $('#top-sorry').show();
    $('#top-logo-wrapper').addClass('logo-sorry');
};

const initEvil = () => {
    // Don't use MutekiTimer here!!
    // (it causes freeze)
    setTimeout(() => {
        $('#top').css({
            opacity: 0,
        }).delay(500).css('z-index', '-1');

        $('#top-logo').css({
            '-webkit-transform': 'translate3d(0px, -100px, 0px)',
            opacity: 0,
        });
    }, 1500);

    window.CONTEXT  = new webkitAudioContext();
    window.player   = new Player();
    window.keyboard = new Keyboard(window.player);
    window.midi     = new Midi(window.player);

    const footerSize = $(window).height()/2 - 300;
    $('footer').css('height', footerSize + 'px');

    // Read song
    if (window.song_read) {
        player.readSong(song_read);
    }
    else {
        player.readSong(CONSTANT.SONG_DEFAULT);
    }
};


// ------------------------------------------------------------------------------
// Main

$(() => {
    console.log('Welcome to evil!?????????')

    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/chrome/g)) {
        initEvil();
    }
    else {
        sorry();
    }
});
