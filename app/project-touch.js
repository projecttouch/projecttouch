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

        initialize: function () {
            console.log('application initiated');

            this.player = new Player();

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
                if (this.filter === Filters[className]) {
                    this.filter = null;
                } else {
                    this.filter = Filters[className];
                }
                break;

            }
        }
    });

});
