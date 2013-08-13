/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore', 'app/views/ui/timeline-layer'], function (Backbone, _, Layer) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'footer',
        el: 'body > footer',

        initialize: function () {
            
            this.time = this.el.querySelector('#time .line');
            
            this.collection = window.App.timeline.collection;
            this.collection.on('add', this.add, this);
            this.collection.on('frame-sync', this.progress, this);
            
//            _.bindAll(this, 'addThumb');
//            this.options.model.on('change:thumb', this.addThumb, this);
            
        },
        
        render: function () {
            return this;
        },
        
        add: function (model) {
            var layer = new Layer({model:model});
            this.el.appendChild(layer.render().el);
        },
        
        progress: function (frame) {
            var current = frame / 25,
                currentMinutes = Math.floor(current / 60),
                total = this.collection.totalFrames / 25;
                
            
            this.time.innerHTML = currentMinutes + ":" + (current - currentMinutes * 60) + " - " + total;
        }   

    });

});