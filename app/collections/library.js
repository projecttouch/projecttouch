/**
 * Microsoft Video Editor
 *
 * @namespace collections
 * @name media
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

define(['app/models/library'], function (Model) {

    'use strict';

    return Backbone.Collection.extend({

        model: Model,
        
        initialize: function () {
          this.on('layer', function (model) {
            window.App.timeline.collection.add({type:"video",media:model});  
          });
        },
        
        add: function (model) {
            var exist = 0;
            _.each(this.models, function (m) {                        
                if (model.get('file').name === m.get('file').name && model.get('file').size === m.get('file').size && model.get('file').type === m.get('file').type) {
                    exist += 1;
//                    this.trigger('add', m);
                }
            }, this);
            
            if(exist === 0) {
                Backbone.Collection.prototype.add.apply(this, arguments);
            }
        }

    });

});
