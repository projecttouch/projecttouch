/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define(['app/collections/timeline', 'app/filters'], function (Collection, Filter) {

    'use strict';

    var Timeline = function () {
        this.initialize();
    };

    Timeline.prototype = {

        _frame: 0,
        playing: false,

        initialize: function () {

            this.layers = [];
            this.videos = [];
            this.filter = null;
            this.collection = new Collection();

            this.collection.on('trim:start', function (model) {
                window.App.player.setSource([model]);
            }, this);

            this.collection.on('change:trim', this.seek, this);

            _.bindAll(this, 'addEventListeners', 'changeFilter', 'play', 'stop', 'frame');

            this.addEventListeners();
        },

        addEventListeners: function () {
            document.querySelector('header').addEventListener('click', this.play);
        },

        changeFilter: function (filter) {

            switch (filter) {
                case 'gray':
                    this.filter = Filters.grayscale;
                    break;
                case 'thres':
                    this.filter = Filters.threshold;
                    break;
                case 'pixel':
                    this.filter = Filters.pixelize;
                    break;
                default:
                    this.filter = null;
            }

        },

        play: function () {

            if (this.playing) {
                this.playing = false;

                window.clearInterval(this.timer);
                this.collection.trigger('pause');
                
                this.trigger('pause', 'pause');

                return;
            }

            this.trigger('play', 'play');
            this.playing = true;
            this.timer = window.setInterval(this.frame, 40);

        },


        /* Scrubs/Seek to frame 
         * ---------------------------------------------------------------------- */

        seek: function (frame) {
            if (this.playing) {
                this.stop();
            }
            this._frame = !isNaN(frame) ? frame : this._frame;
            this.collection.trigger('seek', this._frame, this.collection.totalFrames);
            window.App.player.setSource(this.collection.getActive());
            window.App.filter = window.App.timeline.collection.getFilter(this._frame);
        },


        /* Syncs all the layers and sends the current layer to the Player API
         * ---------------------------------------------------------------------- */

        frame: function () {

            this.collection.trigger('frame-sync', this._frame, this.collection.totalFrames);
            window.App.player.setSource(this.collection.getActive());
            //window.App.player.setSource([this.collection.models[0], this.collection.models[1]]);

            if (this._frame === this.collection.totalFrames) {
                this.stop();
            } else {
                this._frame += 1;
            }
            window.App.filter = window.App.timeline.collection.getFilter(this._frame);
        },

        stop: function () {

            this.playing = false;
            this.trigger('stop', 'stop');

            window.clearInterval(this.timer);
            window.App.player.setSource();

            this._frame = 0;
            this.collection.trigger('kill', 0);

        }

    };

    _.extend(Timeline.prototype, Backbone.Events);

    return Timeline;

});
