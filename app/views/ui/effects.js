/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 'app/filters', 'app/models/layer'], function (Panel, Filter, Layer) {

    return Panel.extend({

        id: 'effects',
        el: '#effects',

        events: {
            "click ul a": "toggleEffect"
//            'change input': 'handleFileSelect'

        },
        toggleEffect: function (e) {
            e.preventDefault();
            var filterName = e.currentTarget.getAttribute('href');
            var effect = window.App.timeline.collection.findWhere({name: filterName});
            if (effect) {
                e.currentTarget.offsetParent.className = 'off';
                var m = window.App.timeline.collection.findWhere({name: filterName});
                m.destroy();
            } else {
                e.currentTarget.offsetParent.className = 'on';
                var layer = new Layer({type: "effect", name: filterName, frames: 5000});
                window.App.timeline.collection.add(layer);
            }
        },
        initialize: function () {
            Panel.prototype.initialize.call(this);
            for (var f in Filter) {
                this.$el.find('ul').append('<li class="off"><span></span><img data-effect="' + f + '" ><a href="' + f + '">' + f + '</a></li>');
            }
//            var Collection = require('app/collections/library')
//            this.collection = new Collection();
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        },

        updateThumbs: function (thumb) {
            var lis = this.$el.find('ul li');
            var img;
            for (var x = 0, _len = lis.length; x < _len; x++) {
                img = '<img src="' + thumb + '"/>';
                lis[x].append(img);
            }
        }

    });

});
