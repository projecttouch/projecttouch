/**
 * Project Touch
 *
 * @date: 8/07/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        id: 'composition',
        el: '#composition',

        events: {
            'click button': 'clickHandler'
        },

        clickHandler: function (e) {

            switch (e.currentTarget.getAttribute('class')) {
            case 'play':
                window.App.timeline.play();
                break;
            case 'pause':
            case 'stop':
                window.App.timeline.stop();
                break;

            }

        }
    });
});
