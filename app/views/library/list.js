/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'ul',
        id: 'library',

        events: {
            'click li': 'addToTimeline'
        },

        initialize: function () {
            _.bindAll(this, 'add', 'addToTimeline');
        },

        add: function (model) {
            var item = document.createElement('li');

            item.setAttribute('data-id', model.cid);
            item.innerHTML = model.get('file')
                .name;
            this.el.appendChild(item);
            this.delegateEvents();

        },

        addToTimeline: function (e) {

            var id = e.target.getAttribute('data-id');

            window.App.timeline.add({
                media: window.App.library.get(id)
            });

        }

    });

});
