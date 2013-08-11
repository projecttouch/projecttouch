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
	    className: 'mediaLibraryItem',
	    template: _.template('\
	            <h3><%= filename %></h3>\
	            <button class="play">Play</button>\
	            <button class="add">Add</button>\
	      '),

        events: {
            'click .add': 'add',
            'click .play': 'play'
        },

        initialize: function () {
            log('new lib item');
            _.bindAll(this, 'addThumb');
            this.options.model.on('change:thumb', this.addThumb, this);
        },

        render: function () {
	        var cid = this.options.model.cid,
		        filename = this.options.model.get('file').name,
		        templateVars = { filename: filename },
		        templateResult = this.template( templateVars );

	        this.$el.attr('data-id', cid);
	        this.$el.html( templateResult );

            return this;
        },

        add: function () {
            this.options.model.collection.trigger('layer', this.options.model);
        },

        play: function () {
            console.log('play');
        },

        addThumb: function () {
            var img = new Image();
            this.$el.prepend(img);
            img.src = this.options.model.get('thumb');
        }

    });

});
