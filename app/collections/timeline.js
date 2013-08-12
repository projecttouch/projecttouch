/**
 * Microsoft Video Editor
 *
 * @namespace collections
 * @name media
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

define(['backbone', 'underscore', 'app/models/layer'], function (Backbone, _, Model) {

    'use strict';

    return Backbone.Collection.extend({

        model: Model,
        totalFrames: 5000,
        
        getActive: function () {

            var targetModel,
                position = 99999;

            _.each(this.models, function (model) {
                
                log(model.getStart());
                
                if (model.get('status') === 'playing' || model.get('status') === 'seeking') {
                    
                    if (model.get('position') < position) {
                        targetModel = model;
                        position = model.get('position');
                    }
                    
                }
            }, this);

            return targetModel;

        }

    });

});
