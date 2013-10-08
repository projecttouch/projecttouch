/**
 * Microsoft Video Editor
 *
 * @namespace controllers
 * @name timeline
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

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
//            this.collection.initTime();
//            this.collection.on('play', this.play);
//            this.collection.on('stop', this.stop);
//            App.Views.interface.effects.on('change', this.changeFilter);

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
                this.stop();
                return;
            }

            this.playing = true;
            this.timer = window.setInterval(this.frame, 40);

        },
        
        /*
         * Seeks to a frame
         */
        
        seek: function (frame) {
            this.stop();
            this._frame = !isNaN(frame) ? frame : this._frame;
            this.collection.trigger('seek', this._frame, this.collection.totalFrames);
            log('seek', this.collection.getActive())
            window.App.player.setSource(this.collection.getActive());
        },

        /*
         * Syncs all the layers and sends the current layer to the Player API
         */

        frame: function () {

            this.collection.trigger('frame-sync', this._frame, this.collection.totalFrames);
            window.App.player.setSource(this.collection.getActive());
            //window.App.player.setSource([this.collection.models[0], this.collection.models[1]]);

            if (this._frame === this.collection.totalFrames) {
                this.stop();
            } else {
                this._frame += 1;
            }

            var effects = this.collection.where({type:'effect'});
            var _len = effects.length;
            if(_len === 0){
                window.App.filter = null;
            }else{
                for(var x = 0; x < _len; x++){
                    if(effects[x].get('type') !== 'effect'){
                        continue;
                    }
//                    log('Effects:', effects[x]);
                    var trim = effects[x].get('trim');
                    var offset = effects[x].get('offset');
                    var effectFrames = effects[x].get('frames');
                    var endEffect = effectFrames + offset - trim.end;
                    var startEffect = trim.start + offset;
//                    log('Start: ' + startEffect + '; End: ' + endEffect + '; Current Frame: ' + this._frame);
                    if(this._frame >= startEffect && this._frame <= endEffect){
//                        log('Set effect:', effects[x].get('name'));
                        window.App.filter = Filter[effects[x].get('name')];
                        break;
                    }
                    if(x === (_len - 1)){
//                        log('Remove effect');
                        window.App.filter = null;
                        break;
                    }
                }
            }

        },

        stop: function () {

            this.playing = false;

            window.clearInterval(this.timer);
            window.App.player.setSource();

            this._frame = 0;
            this.collection.trigger('kill');

        }

    };

    _.extend(Timeline.prototype, Backbone.Events);

    return Timeline;

});
