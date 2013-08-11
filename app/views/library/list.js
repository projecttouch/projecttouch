/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

/* seems unused at 2013.08.11. Commented out to prevent confusion
define(['backbone', 'underscore', 'app/views/library/media'], function (Backbone, _, Media) {

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
            
            var item = new Media({model:model});
            this.el.appendChild(item.render().el);
            this.delegateEvents();

        },

        addToTimeline: function (e) {

            var id = e.currentTarget.getAttribute('data-id');
           
            window.App.timeline.add({
                media: window.App.library.get(id)
            });

        }

    });

});
