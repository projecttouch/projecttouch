/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require, console  */

define(['backbone', 'app/views/player', 'app/filters'], function (Backbone, Player, Filters) {

    'use strict';

    return Backbone.View.extend({

        filter: null,

        events: {
            "click button": "handler"
        },

        R: 1,
        G: 1,
        B: 1,

        initialize: function () {

            this.player = new Player();

            setInterval(this.getRGB, 1000);


            console.log((4278452999 >> 0) & 0xff);
            console.log((4278452999 >> 16) & 0xff);
            console.log((4278452999 >> 8) & 0xff);
            console.log((4278452999 >> 24) & 0xff);

        },

        render: function () {

            this.el.appendChild(this.player.render()
                .el);

            this.video = document.createElement('video');
//            this.video.muted = true;
            this.video.src = "clip.mp4";

            this.player.setSource(this.video);

            this.video.play();
            document.querySelector('.play')
                .setAttribute('class', 'pause');

        },

        handler: function (e) {

            var className = e.currentTarget.getAttribute('class');

            switch (className) {
            case "play":
                this.video.play();
                e.currentTarget.setAttribute('class', 'pause');
                break;
            case "pause":
                this.video.pause();
                e.currentTarget.setAttribute('class', 'play');
                break;
            case "stop":
                this.video.pause();
                this.video.load();
                if (document.querySelector('.pause')) {
                    document.querySelector('.pause')
                        .setAttribute('class', 'play');
                }
                break;

            case "grayscale":
            case "threshold":
            case "pixelize":
            case "red":
            case "green":
            case "blue":
            case "hipster":
                if (this.filter === Filters[className]) {
                    console.log('disabling filter', className);
                    this.filter = null;
                } else {
                    console.log('enabling filter', className);
                    this.filter = Filters[className];
                }
                break;

            }
        },

        getRGB: function() {
            App.R = parseFloat(document.getElementById('r').value);
            App.G = parseFloat(document.getElementById('g').value);
            App.B = parseFloat(document.getElementById('b').value);
        }
    });
});
