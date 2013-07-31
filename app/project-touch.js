/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require, console  */

define(['backbone', 'app/views/player', 'app/filters', 'app/collections/library', 'app/collections/timeline', 'app/controllers/timeline', 'app/models/media', 'app/views/library/list'], function (Backbone, Player, Filters, Library, Timeline, TimelineController, Media, LibView) {

    'use strict';

    return Backbone.View.extend({

        filter: null,
        debug: true,

        events: {
            "click button": "handler"
        },

        R: 1,
        G: 1,
        B: 1,
        Sat: 100,
        C: 0,

        initialize: function () {

            var self = this;

            window.log = function () {
                if (self.debug) {
                    console.log.apply(console, arguments);
                }
            }

            this.library = new Library();
            this.player = new Player();
            this.timeline = new Timeline();
            this.timelineController = new TimelineController(this.timeline);

            this.library.on('add', function (model) {
                log('model', this.library.models.length, model)
            }, this);

            //setInterval(this.getRGB, 600);
        },

        render: function () {

            _.bindAll(this, 'handleFileSelect');

            this.el.appendChild(this.player.render()
                .el);

            this.form = document.createElement('form');
            this.input = document.createElement('input');
            this.input.setAttribute('type', 'file');
            this.input.setAttribute('name', 'file-upload');
            this.input.setAttribute('style', 'position: absolute; display: block; height: 10%; width: 10%;');

            this.form.appendChild(this.input);
            this.el.insertBefore(this.form, this.el.firstChild);

            this.el.addEventListener('dragenter', this.dragEscape, false);
            this.el.addEventListener('dragexit', this.dragEscape, false);

            this.el.addEventListener('dragover', this.handleDragOver, false);
            this.el.addEventListener('drop', this.handleFileSelect, false);

            this.input.addEventListener('change', this.handleFileSelect, false);

            this.libView = new LibView();
            this.el.appendChild(this.libView.render()
                .el);
            this.library.on('add', this.libView.add);

        },

        handleFileSelect: function (evt) {

            var files;

            if (evt.type === 'change') {
                files = evt.target.files;
            } else {
                files = evt.dataTransfer.files;
                evt.preventDefault();
                evt.stopPropagation();
            }

            _.each(files, function (file) {

                if (file.type !== "video/mp4") {
                    console.warn('file must be mp4');
                } else {
                    this.library.add(new Media({
                        file: file
                    }));
                }
            }, this);

        },

        handler: function (e) {

            var className = e.currentTarget.getAttribute('class');

            switch (className) {
            case "play":
                this.timelineController.play();
                e.currentTarget.setAttribute('class', 'pause');
                break;
            case "pause":

                e.currentTarget.setAttribute('class', 'play');
                break;
            case "stop":
                if (document.querySelector('.pause')) {
                    this.timelineController.stop();
                    document.querySelector('.pause')
                        .setAttribute('class', 'play');
                }
                break;

            case "grayscale":
            case "threshold":
            case "pixelize":
            case "red":
            case "green":
            case "contrast":
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

        getRGB: function () {

            (Math.floor(Math.random() * 11)) / 10

            App.R = 0;//(Math.floor(Math.random() * 11)) / 10;
            App.G = 0;//(Math.floor(Math.random() * 11)) / 10;
            App.B = 0;//(Math.floor(Math.random() * 11)) / 10;
            App.C = 0;//(parseFloat(document.getElementById('c').value));
        }

    });
});
