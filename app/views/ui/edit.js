/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 'app/filters', 'jquery-ui'], function (Panel, Filter) {

    return Panel.extend({

        id: 'edit',
        el: '#edit',
        initialize: function () {
            Panel.prototype.initialize.call(this);
            this.$(".slider").slider({
                range: "min"
            });
            this.$(".slider-range").slider({
                range: true,
                min: 0,
                max: 500,
                values: [ 75, 300 ],
                slide: function (event, ui) {
                    console.log(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
                }
            });
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
