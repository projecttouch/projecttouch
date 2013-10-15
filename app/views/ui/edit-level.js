/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define([], function () {

    'use strict';

    return Backbone.View.extend({
        tagName: 'div',
        className: 'level',
        previousLevel: null,
        level: 0,

        initialize: function () {
            _.bindAll(this, 'mouseDownRight', 'trim', 'setLevel');
            this._trim = {
                start: 0,
                end: 0
            };
            this.levelWidth = 235;
            this.scrubberOffset = 22;
            this.level = 0;
            this.prevLevel = 0;
            this.holder = this.$('.holder')[0];
            this.render();
        },

        render: function () {
            this.right = this.$('.right')[0];
            this.hammertimeR = Hammer(this.right);
            this.hammertimeR.on("dragstart", this.mouseDownRight);
            this.hammertimeR.on("drag", this.trim);
            this.setLevel(this.level);
            this.prevLevel = this.level;
            return this;

        },

        mouseDownRight: function () {
            window.App.dragging = true;
            this.paddingRightStart = parseInt(this.holder.style.paddingRight);
        },

        trim: function (e) {
            var paddingRight, deltaX, level;
            //How far been dragged
            deltaX = e.gesture.deltaX;
            paddingRight = -deltaX + this.paddingRightStart;
            paddingRight = paddingRight < 0 ? 0 : paddingRight;
            paddingRight = paddingRight > this.levelWidth ? this.levelWidth : paddingRight;
            this.setPositions(paddingRight);
            var difference = this.levelWidth - paddingRight;

            if (this.options.type === 'rotation') {
                level = difference / (this.levelWidth / 360);
                level = level - 180;
            } else {
                level = difference / this.levelWidth;
            }
            
            this.level = level

            //DEVELOPMENT: Put this back in when finished.
            this.model.set(this.options.type, level);
            
        },

        setLevel: function (level) {
            
            
            var paddingRight;

            if (this.options.type === 'rotation') {
                if (this.prevLevel === 180 && level < 170) {
                    return;
                }
                if (this.prevLevel === -180 && level > -170) {
                    return;
                }
                this.level = level;
                paddingRight = ((360 - (level + 180)) / 360) * this.levelWidth;
            } else {
                this.level = level;
                paddingRight = (1 - level) * this.levelWidth;
            }
            this.setPositions(paddingRight);
            this.prevLevel = this.level;
            
            if(this.model) {
                this.model.set(this.options.type, this.level);
            }
            
            
        },

        getLevel: function () {
            return this.level;
        },

        setPositions: function (paddingRight) {
            this.$('.right').css('right', paddingRight - this.scrubberOffset);
            this.holder.style.paddingRight = paddingRight + 'px';
        }
    });

});
