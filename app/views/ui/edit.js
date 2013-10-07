/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel',
        'app/views/ui/edit-level'], function (Panel, LevelView) {

    'use strict';

    return Panel.extend({

        id: 'edit',
        el: '#edit',

        events: {
            "click #btnCloseEdit": "closeEdit"
        },

        initialize: function () {
            Panel.prototype.initialize.call(this);

            this.options.collection.on("open", this.open, this);

            this.scaleView = new LevelView({el:'#level-scale', type: 'scale'});
            this.rotationView = new LevelView({el:'#level-rotation', type:'rotation'});
            this.volumeView = new LevelView({el:'#level-volume', type: 'volume'});

        },

        },


        /* this will be triggered when a layer is selected
         * ---------------------------------------------------------------------- */

        open: function (model) {
            this.scaleView.model = model;
            this.rotationView.model = model;
            this.volumeView.model = model;

            this.scaleView.setLevel(model.get('scale'));
            this.rotationView.setLevel(model.get('rotation'));
            this.volumeView.setLevel(model.get('volume'));
            $('#library').slideUp(500, function () {
                $('#edit').slideDown(500);
            });
        },

        closeEdit: function () {
            $('#edit').slideUp(500, function () {
                $('#library').slideDown(500);
            });
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
