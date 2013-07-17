/**
 * Microsoft Video Editor
 *
 * @namespace collections
 * @name media
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

define(['backbone', 'underscore', 'app/models/clip'], function (Backbone, _, Model) {

    'use strict';

    return Backbone.Collection.extend({

        model: Model,

        initialize: function () {

        },

        getActive: function () {

            var targetModel;

            _.each(this.models, function (model) {
                if (model.get('status') === 'playing') {
                    targetModel = model;
                }
            }, this);

            return targetModel;

        }

    });

});
