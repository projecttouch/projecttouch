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
            "blob": null,
            "file": null
        },

        initialize: function () {
            this.set('blob', window.URL.createObjectURL(this.get('file')));
        },
        
        clear: function () {
            window.URL.revokeObjectURL(this.get('blob'));
            Backbone.Model.prototype.clear.apply(this, arguments);
        }

    });

});
