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
        active: true,

        events: {
            "click #btnCloseEdit": "closeEdit"
        },

        initialize: function () {
            Panel.prototype.initialize.call(this);
            this.options.collection.on("open", this.open, this);
            _.bindAll(this, 'pinch');
            this.right = $('#level-scale .right');
            this.holder = $('#level-scale .holder');
            this.scaleView = new LevelView({el: '#level-scale', type: 'scale'});
            this.rotationView = new LevelView({el: '#level-rotation', type: 'rotation'});
            this.volumeView = new LevelView({el: '#level-volume', type: 'volume'});
            this.hammertime = Hammer(window.App.composition.el);
            this.hammertime.on('pinch', this.pinch);

        },

        levelWidth: null,
        timer: null,
        usablePixels: null,
        startPaddingRight: null,
        pinchThrottle: 0,
        pinching: false,

        pinch: function (e) {
            if (!this.active) {
                return;
            }
            this.pinchThrottle += 1;
            if (this.pinchThrottle < 2) {
                return;
            }
            this.levelWidth = parseInt(window.App.views.edit.scaleView.levelWidth);

            var klass = this,
                newPaddingRight,
                right;
            if (!this.pinching) {
                this.pinching = true;
                this.startPaddingRight = parseInt(window.App.views.edit.scaleView.holder.style.paddingRight);
                if (this.startPaddingRight === this.levelWidth) {
                    this.usablePixels = this.levelWidth;
                } else {
                    this.usablePixels = this.levelWidth - this.startPaddingRight;
                }
                log('usablePixels', this.usablePixels);
                log('this.startPaddingRight', this.startPaddingRight);
            }

            newPaddingRight = this.usablePixels / e.gesture.scale;

            if (newPaddingRight > this.levelWidth) {
                newPaddingRight = this.levelWidth;
            }
            if (newPaddingRight < 0) {
                newPaddingRight = 0;
            }
            right = newPaddingRight - 22;
            newPaddingRight += 'px';
            log('newPaddingRight', newPaddingRight);


            this.holder.css('padding-right', newPaddingRight);
            this.right.css('right', right);
            this.pinchThrottle = 0;
            window.setTimeout(function () {
                klass.pinching = false;
            }, 2000);
        },


        /* this will be triggered when a layer is selected
         * ---------------------------------------------------------------------- */

        open: function (model) {
            this.active = true;
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
            this.active = false;
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
