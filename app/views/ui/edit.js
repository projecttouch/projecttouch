/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define(['app/views/panel',
    'app/views/ui/edit-level'], function (Panel, LevelView) {

    'use strict';

    return Panel.extend({

        id: 'edit',
        el: '#edit',
        active: false,
        levelWidth: null,
        usablePixels: null,
        scaleStartPaddingRight: null,
        rotationStartPaddingRight: null,
        currentRotation: null,

        events: {
            "click #btnCloseEdit": "closeEdit"
        },

        initialize: function () {
            Panel.prototype.initialize.call(this);
            this.options.collection.on("open", this.open, this);
            _.bindAll(this, 'transform');

            this.scaleRight = $('#level-scale .right');
            this.scaleHolder = $('#level-scale .holder');

            this.rotationRight = $('#level-rotation .right');
            this.rotationHolder = $('#level-rotation .holder');

            this.scaleView = new LevelView({el: '#level-scale', type: 'scale'});
            this.rotationView = new LevelView({el: '#level-rotation', type: 'rotation'});
            this.volumeView = new LevelView({el: '#level-volume', type: 'volume'});
            this.hammertime = Hammer(window.App.composition.el);
            this.hammertime.on('transformstart', this.transform);
            this.hammertime.on('transform', this.transform);
            this.hammertime.on('transformend', this.transform);

        },


        render: function () {
            Panel.prototype.render.call(this);
            return this;
        },


        transform: function (e) {
            if (!this.active) {
                return;
            }
            var newDegree = this.convertDegree(e.gesture.rotation);
            this.rotationView.setLevel(newDegree);

            var klass = this,
                right,
                scalePositions,
                scale = e.gesture.scale,
                rotation = e.gesture.rotation;
            this.levelWidth = parseInt(window.App.views.edit.scaleView.levelWidth);
            if (e.type === 'transformstart') {
                this.scaleStartPaddingRight = parseInt(window.App.views.edit.scaleView.holder.style.paddingRight);
            }
            scalePositions = this.calculateScalePositions(this.scaleStartPaddingRight, scale, this.levelWidth);
            this.scaleHolder.css('padding-right', scalePositions.padding);
            this.scaleRight.css('right', scalePositions.right);
            if (e.type === 'transformend') {
                this.scaleStartPaddingRight = null;
            }
        },


        calculateScalePositions: function (startPadding, scale, levelWidth) {
            var newValues = {};
            if (startPadding === 0) {
                newValues.padding = this.levelWidth - (levelWidth * scale);
            } else {
                newValues.padding = startPadding / scale;
            }
            if (newValues.padding > levelWidth) {
                newValues.padding = levelWidth;
            }
            if (newValues.padding < 0) {
                newValues.padding = 0;
            }
            newValues.right = (newValues.padding - 22) + 'px';
            newValues.padding += 'px';
            return newValues;
        },
        convertDegree: function (degree) {
            //Convert -270 to 90 and compare to current level
            if (degree < -180) {
                degree =  360 + degree;
            } else if (degree > 180) {
                degree = -360 + degree;
            }

            degree = degree + this.rotationView.getLevel();
            if(degree > 180){
                degree = 180;
            }
            if(degree < -180){
                degree = -180;
            }
            return degree;
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
                $('.media').removeClass('selected');
            });
        }

    });

});
