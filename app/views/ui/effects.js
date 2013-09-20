/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 'app/filters'], function (Panel, Filter) {

    return Panel.extend({

        id: 'effects',
        el: '#effects',

        events: {
            "click ul a": "toggleEffect"
//            'change input': 'handleFileSelect'

        },
        toggleEffect: function(e){
            e.preventDefault();
            var filterName = e.currentTarget.getAttribute('href');
            window.App.filter = Filter[filterName];
        },
        initialize: function () {
            Panel.prototype.initialize.call(this);
            for (var f in Filter) {
                this.$el.find('ul').append('<li><a href="' + f + '">' + f + '</a></li>');
            }
//            var Collection = require('app/collections/library')
//            this.collection = new Collection();
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
