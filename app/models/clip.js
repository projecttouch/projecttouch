/**
 * Microsoft Video Editor
 *
 * @namespace models
 * @name media
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.Model.extend({

        defaults: {
            "media": null,
            "type": "video",
            "frames": 0,
            "status": "notready",
            "start": 0,
            "offset": {
                start: 0,
                end: 0
            },
            "scale": "stretch-to-fit",
            "position": 0
        },

        initialize: function () {

            if (this.get("type") === "video") {
                this.on('offset:preview', this.seek, this);
                this.collection.on('frame-sync', this.sync, this);
                this.collection.on('kill', this.kill, this);
                this.initializeVideo();
            }

        },

        initializeVideo: function () {

            var self = this;

            this.video = document.createElement('video');
            this.video.addEventListener('loadedmetadata', function () {
                self.set('frames', parseInt(self.video.duration * 1000 / 40));
                self.set('status', 'idle');
            });
            this.video.muted = true;
            this.video.src = this.get('media')
                .get('blob');
            this.video.addEventListener('ended', this.ended, false);
            this.set('status', 'idle');
            return true;

        },

        play: function () {

            if (this.get('status') === 'idle') {
                this.video.play();
                this.set('status', 'playing');
            } else if (this.get('status') === 'playing') {
                log('video ' + this.get('name') + ' is already playing', this.get('status'));
            } else {
                log('video ' + this.get('name') + ' is not ready', this.get('status'));
            }

        },

        stop: function () {

            this.video.pause();
            //            this.video.currentTime = parseInt(this.get('offset-start')) / 25;
            this.set('status', 'idle');

        },

        syncTime: function () {

            var frame,
            start = this.get('start'),
                offset = this.get('offset-start');

            if (start < 0) {
                start = Math.abs(start);
                frame = (start > offset) ? start : offset;
            } else {
                frame = offset;
            }

            this.video.currentTime = frame / 25;

        },

        kill: function () {
            this.stop();
            this.syncTime();
        },

        sync: function (frame) {

            var start = this.get('start'),
                offset = this.get('offset-start'),
                end = this.get('offset-end'),
                frames = this.get('frames'),
                status = this.get('status');

            if (frame >= (start + offset) && frame < (start + frames - end) && status !== 'playing') {
                log('PLAY');
                this.play();
            } else if (frame === (start + frames - end)) {
                this.stop();
            }

        },

        seek: function (frame) {

            if (!isNaN(frame)) {
                this.video.currentTime = frame / 25;
            }

        },

        setPosition: function (frame) {

            this.set('start', frame);
            this.syncTime();

        },

        getStart: function () {
            return this.get('start') + this.get('offset-start');
        }

    });

});
