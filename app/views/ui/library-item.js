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

        events: {
            "click button": "add"
        },

        initialize: function () {
            log('new lib item');
            _.bindAll(this, 'addThumb');
            this.options.model.on('change:thumb', this.addThumb, this);
        },

        render: function () {

            var title = document.createElement('div'),
                button = document.createElement('button');

            this.el.setAttribute('data-id', this.options.model.cid);
            title.innerHTML = this.options.model.get('file')
                .name;
            this.el.appendChild(title);

            button.innerHTML = 'Add';
            this.el.appendChild(button);

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
