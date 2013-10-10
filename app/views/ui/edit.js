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
        active: false,

        events: {
            "click #btnCloseEdit": "closeEdit"
        },

        initialize: function () {
            Panel.prototype.initialize.call(this);
            this.options.collection.on("open", this.open, this);
            _.bindAll(this, 'pinch');

            this.scaleRight = $('#level-scale .right');
            this.scaleHolder = $('#level-scale .holder');

            this.rotationRight = $('#level-rotation .right');
            this.rotationHolder = $('#level-rotation .holder');

            this.scaleView = new LevelView({el: '#level-scale', type: 'scale'});
            this.rotationView = new LevelView({el: '#level-rotation', type: 'rotation'});
            this.volumeView = new LevelView({el: '#level-volume', type: 'volume'});
            
            
            this.hammertime = Hammer(window.App.composition.el);
            this.hammertime.on('transformstart', this.pinch);
            this.hammertime.on('transform', this.pinch);
            this.hammertime.on('transformend', this.pinch);
            
        },

        levelWidth: null,
        usablePixels: null,
        scaleStartPaddingRight: null,
        rotationStartPaddingRight: null,

        pinch: function (e) {
            if (!this.active) {
                return;
            }
            var klass = this,
                right,
                scalePositions,
                rotationPositions,
                scale = e.gesture.scale,
                rotation = e.gesture.rotation;
            this.levelWidth = parseInt(window.App.views.edit.scaleView.levelWidth);
            if (e.type === 'transformstart') {
                this.scaleStartPaddingRight = parseInt(window.App.views.edit.scaleView.holder.style.paddingRight);
                this.rotationStartPaddingRight = parseInt(window.App.views.edit.rotationView.holder.style.paddingRight);
            }
            scalePositions = this.calculateScalePositions(this.scaleStartPaddingRight, scale, this.levelWidth);
            rotationPositions = this.calculateRotationPositions(this.rotationStartPaddingRight, rotation, this.levelWidth);
            this.scaleHolder.css('padding-right', scalePositions.padding);
            this.scaleRight.css('right', scalePositions.right);
            this.rotationHolder.css('padding-right', rotationPositions.padding);
            this.rotationRight.css('right', rotationPositions.right);
            if (e.type === 'transformend') {
                this.scaleStartPaddingRight = null;
                this.rotationStartPaddingRight = null;
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

        calculateRotationPositions: function (startPadding, rotation, levelWidth) {
            log('Rotation', rotation);
//            return;

            var degree = levelWidth / 360,
                startingPoint = startPadding * degree,
                newDegreePoint = startingPoint - rotation,
                newPadding = newDegreePoint / degree,
                newRight,
                newRotationPositions;
            if (newPadding > levelWidth) {
                newPadding = levelWidth;
            }

            if (newPadding < 0) {
                newPadding = 0;
            }
            log('New padding', newPadding);
            newRight = (newPadding - 22) + 'px';

            newRotationPositions = {
                padding: newPadding + 'px',
                right: newRight
            };
            return newRotationPositions;
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
        },


        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
