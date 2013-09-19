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

            var spans = this.el.querySelectorAll('.time span'),
                devidedFrames = this.collection.totalFrames / 10;
            
            _.each(spans, function (span, id) {
                if (id !== 0) span.innerHTML = '<div>' + (devidedFrames * id / 25).toMMSS() + '</div>';
            });
        
        },
        
        add: function (model) {
            var layer = new Layer({model:model});
            this.el.querySelector('.layers').appendChild(layer.render().el);

            if (model.get('frames') !== 0) {
                layer.resize();
            }
        },
        
        progress: function (frame) {
            var current = frame / 25,
                total = this.collection.totalFrames / 25;
                
            this.el.querySelector('#scrubber').innerHTML = current.toMMSS();
            this.el.querySelector('#scrubber').style.left = ((current / total) * 100) + "%";
            
        }   

    });

});