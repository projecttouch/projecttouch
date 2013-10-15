/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define([], function () {

    'use strict';

    return Backbone.Model.extend({

        defaults: {
            "media": null,
            "type": "video",
            "name": null,
            "rotation": 0,
            "frames": 0,
            "status": "notready",
            "offset": 0,
            "volume": 0,
            "trim": {
                start: 0,
                end: 0
            },
            "scale": 0.5,
            "position": 0
        },

        initialize: function() {

            if (this.collection) {
                this.set('position', this.collection.length)
            } else {
                this.set('position', window.App.timeline.collection.length)
            }

            if (this.get("type") === "video") {
                this.on('trim:preview', this.setFrame, this);
                this.collection.on('seek', this.seek, this);
                this.collection.on('frame-sync', this.sync, this);
                this.collection.on('kill', this.kill, this);
                this.collection.on('pause', this.pause, this);
                this.on('change:volume', this.setVolume, this);
                this.on('change:trim', function() {
                    this.set('status', 'idle');
                    this.syncFrame();
                    window.App.timeline.stop();
                }, this);
                this.initializeVideo();
            }
            
            if (this.get("type") === "audio") {
                this.on('change:trim', function() {
                    this.set('status', 'idle');
                    this.syncFrame();
                    window.App.timeline.stop();
                }, this);
                this.collection.on('pause', this.pause, this);
                this.collection.on('kill', this.kill, this);
                this.collection.on('frame-sync', this.sync, this);
                this.collection.on('seek', this.seek, this);
                this.initializeVideo();  
                this.video.volume = 1; 
            }
            
        },

        
		/* Initializes the video element
		 * ---------------------------------------------------------------------- */
		
        initializeVideo: function() {

            var self = this;

            this.video = document.createElement('video');
            this.video.addEventListener('loadedmetadata', function() {
                self.set('frames', parseInt(self.video.duration * 1000 / 40));
                self.set('status', 'idle');
            });
            this.video.volume = 0;
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
        
        
        /* Sets the volume for the video
         * ---------------------------------------------------------------------- */
        
        setVolume: function() {
            if (this.video) {
                this.video.volume = this.get('volume');
            }
        },


        /* Plays the video
         * ---------------------------------------------------------------------- */

        play: function() {

            if (this.get('status') === 'idle' || this.get('status') === 'seeking') {
                this.video.play();
                this.set('status', 'playing');
            } else if (this.get('status') === 'playing') {
                log('video ' + this.get('name') + ' is already playing', this.get('status'));
            } else {
                log('video ' + this.get('name') + ' is not ready', this.get('status'));
            }

        },
        
        
        /* Pauses the video
         * ---------------------------------------------------------------------- */
        
        pause: function () {
            this.video.pause();  
            this.set('status', 'idle');
        },


        /* Stops the video
         * ---------------------------------------------------------------------- */

        stop: function() {
            this.video.pause();
            this.video.currentTime = parseInt(this.get('trim')
                .start) / 25;
            this.set('status', 'idle');
        },


		/* this will set all the correct trim positions for the video/audio
		 * ---------------------------------------------------------------------- */

        syncFrame: function() {
            
            var frame,
                offset = this.get('offset'),
                frames = this.get('frames'),
                trim = this.get('trim');
            if (offset < 0) {
                offset = Math.abs(offset);
                frame = (offset > trim.start) ? offset : trim.start;
                
            } else {
                frame = trim.start;
            }
            
            if (App.timeline._frame < (this.get('offset') + frames - trim.end) && App.timeline._frame >= (trim.start + this.get('offset'))) {
                
                frame = App.timeline._frame - this.get('offset')
                                
            }
            
            this.video.currentTime = frame / 25;
            
        },


		/* Checks if the video/audio needs to be played
		 * ---------------------------------------------------------------------- */
		
        sync: function(frame) {
            
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

        
		/* Check if the video is in frame and sets the time
         * ---------------------------------------------------------------------- */
        
        seek: function(frame) {
            
            var offset = this.get('offset'),
                trim = this.get('trim'),
                frames = this.get('frames');

            if (frame >= (trim.start + offset) && frame < (trim.start + frames - trim.end)) {
                if (this.get('status') === 'playing') {
                    this.video.pause();
                }
                
                this.setFrame(frame);
                this.set('status', 'seeking');
                                
            } else {
                this.set('status', 'idle');
            }
        },


		/* Sets the current time to the correct frame
		 * ---------------------------------------------------------------------- */
		
        setFrame: function(frame) {
            this.video.currentTime = frame / 25;
        },


        /* kills the video
         * ---------------------------------------------------------------------- */

        kill: function() {
            log('kill')
            this.stop();
            this.syncFrame();
        },


		/* Returns the start frame
		 * ---------------------------------------------------------------------- */
		
        getStart: function() {
            return this.get('offset') + this.get('trim')
                .start;
        }

    });

});
