/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

	    className: 'mediaLibraryItem',
	    template: _.template('\
	        <li data-id="<%= cid %>">\
	            <h3><%= filename %></h3>\
	            <button>Add</button>\
	        </li>\
	      '),

        events: {
            'click button': 'add'
        },

        initialize: function () {
            log('new lib item');
            _.bindAll(this, 'addThumb');
            this.options.model.on('change:thumb', this.addThumb, this);
        },

        render: function () {
	        var templateVars = { cid: this.options.model.cid, filename: this.options.model.get('file').name },
		        templateResult = this.template( templateVars );

	        this.$el.html( templateResult );

            return this;
        },

        add: function () {
            this.options.model.collection.trigger('layer', this.options.model);
        },

        addThumb: function () {
            var img = new Image();
            this.el.appendChild(img);
            img.src = this.options.model.get('thumb');
        }

    });

});
