/**
 * Microsoft Video Editor
 *
 * @namespace models
 * @name media
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

define([], function () {

    'use strict';

    return Backbone.Model.extend({

        defaults: {
            "blob": null,
            "file": null
        },

        initialize: function () {
            this.set('blob', window.URL.createObjectURL(this.get('file')));
            this.getThumb();
        },

        getThumb: function () {

            var self = this,
                canvas = document.createElement('canvas'),
                video = document.createElement('video'),
                ctx = canvas.getContext('2d');

            canvas.width = 260;
            canvas.height = 140;

            video.addEventListener('canplaythrough', function () {
                _.delay(function () {
                    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 263, 140);
                    self.set('thumb', canvas.toDataURL('image/jpeg'));    
                }, 1000);
            });

            video.src = this.get('blob');
        },

        clear: function () {
            window.URL.revokeObjectURL(this.get('blob'));
            Backbone.Model.prototype.clear.apply(this, arguments);
        }

    });

});
