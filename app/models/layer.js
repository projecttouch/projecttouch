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
            "rotate": 0,
            "scaleX": 0.5,
            "scaleY": 0.5,
            "frames": 0,
            "status": "notready",
            "offset": 0,
            "volume": 0,
            "trim": {
                start: 0,
                end: 0
            },
            "scale": "stretch-to-fit",
            "position": 0
        },

        initialize: function () {

            if (this.collection) {
                this.set('position', this.collection.length)
            } else {
                this.set('position', window.App.timeline.collection.length)
            }

            if (this.get("type") === "video") {
                this.on('trim:preview', this.trim, this);
                this.collection.on('seek', this.seek, this);
                this.collection.on('frame-sync', this.sync, this);
                this.collection.on('kill', this.kill, this);
                this.on('change:trim', function () {
                    this.set('status', 'idle');
                    this.syncFrame();
                    window.App.timeline.stop();
                }, this);
                this.initializeVideo();
            }

        },

        /**
         * INITIALIZES THE VIDEO ELEMENT
         */

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
            
            this.vv = document.createElement('div');
            this.vv.style.width = "600px";
            this.vv.style.height = "300px";
            this.vv.appendChild(this.video);
            
            
            this.video.setAttribute('style', '-webkit-transform: rotate(20deg);');
            return true;

        },

        /**
         * THIS WILL PLAY THE VIDEO
         */

        play: function () {

            if (this.get('status') === 'idle' || this.get('status') === 'seeking') {
                this.video.play();
                this.set('status', 'playing');
            } else if (this.get('status') === 'playing') {
                log('video ' + this.get('name') + ' is already playing', this.get('status'));
            } else {
                log('video ' + this.get('name') + ' is not ready', this.get('status'));
            }

        },

        /**
         * THIS WILL STOP THE VIDEO
         */

        stop: function () {
            this.video.pause();
            this.video.currentTime = parseInt(this.get('trim')
                .start) / 25;
            this.set('status', 'idle');
        },

        /**
         * THIS SETS ALL THE POSITIONS OF THE TRIM TO THE VALUES
         */

        syncFrame: function () {

            var frame,
            offset = this.get('offset'),
                trim = this.get('trim');

            if (offset < 0) {
                offset = Math.abs(offset);
                frame = (offset > trim.start) ? offset : trim.start;
            } else {
                frame = trim.start;
            }

            this.video.currentTime = frame / 25;

        },

        /**
         * THIS CHECKS IF THE CLIP NEEDS TO BE PLAYED ACORDING TO THE CURRENT FRAME OF THE TIMELINE
         */

        sync: function (frame) {

            var offset = this.get('offset'),
                trim = this.get('trim'),
                frames = this.get('frames'),
                status = this.get('status');

            if (frame >= (trim.start + offset) && frame < (offset + frames - trim.end) && status !== 'playing') {
                this.play();
            } else if (frame === (offset + frames - trim.end)) {
                this.stop();
            }

        },

        /**
         * THIS SETS THE FRAME OF THE VIDEO IF IT NEEDS TO BE SET
         */

        seek: function (frame) {
            var offset = this.get('offset'),
                trim = this.get('trim'),
                frames = this.get('frames');

            if (frame >= (trim.start + offset) && frame < (trim.start + frames - trim.end)) {
                if (this.get('status') === 'playing') {
                    this.video.pause();
                }
                this.set('status', 'seeking');
                this.video.currentTime = frame / 25;
            }
        },

        /**
         * THIS SETS THE CURRENTFRAME OF THE VIDEO TO PREVIEW THE SEEK POSITION
         */

        trim: function (frame) {
            this.video.currentTime = frame / 25;
        },

        /**
         * THIS WILL KILL THE VIDEO
         */

        kill: function () {
            this.stop();
            this.syncFrame();
        },

        /**
         * THIS WILL RETURN THE STARTFRAME RELATIVE TO THE TIMELINE
         */

        getStart: function () {
            return this.get('offset') + this.get('trim')
                .start;
        }

    });

});
