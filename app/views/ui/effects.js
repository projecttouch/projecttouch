/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel'], function (Panel) {

    return Panel.extend({

        id: 'effects',
        el: '#effects',

//        events: {
//            'change input': 'handleFileSelect'
//        },

        initialize: function () {
            Panel.prototype.initialize.call(this);
//            var Collection = require('app/collections/library')
//            this.collection = new Collection();
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
