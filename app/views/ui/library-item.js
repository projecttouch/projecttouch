/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'li',
        className: 'library-item',
        template: _.template('\
	            <h3><%= filename %></h3>\
	            <button class="add">Add</button>\
	      '),

        events: {
            'click .add': 'add',
            'click .play': 'play'
        },

        initialize: function () {
            _.bindAll(this, 'addThumb');
            
            log('new library item:',this.options.model.get('file').name);
            
            this.options.model.on('change:thumb', this.addThumb, this);
        },

        render: function () {
            var templateResult = this.template({
                    filename: this.options.model.get('file')
                });

            this.$el.attr('data-id', this.options.model.cid);
            this.$el.html(templateResult);

            return this;
        },

        add: function () {
            this.options.model.collection.trigger('layer', this.options.model);
        },

        play: function () {
            log('play');
            var video = document.createElement('video');
            video.src = this.options.model.get('blob');

            this.$el.find('img')
                .after(video);

            video.play();
        },

        addThumb: function () {
            var img = new Image();
            this.$el.prepend(img);
            img.src = this.options.model.get('thumb');
        }

    });

});
