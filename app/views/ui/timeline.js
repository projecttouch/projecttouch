/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore', 'app/views/ui/layer'], function (Backbone, _, Layer) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'footer',

        initialize: function () {
            
            this.collection = window.App.timeline.collection;
            this.collection.on('add', this.add, this);
            
//            _.bindAll(this, 'addThumb');
//            this.options.model.on('change:thumb', this.addThumb, this);
            
        },
        
        render: function () {
            return this;
        },
        
        add: function (model) {
            var layer = new Layer({model:model});
            this.el.appendChild(layer.render().el);
        }

    });

});