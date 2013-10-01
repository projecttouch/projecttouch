/**
 * projecttouch
 *
 * @namespace
 * @name edit-level
 * @author rupertrutland | Code d'Azur
 * @date: 26/09/2013 10:20
 */

/*global define, window, document, $, requirejs, require  */

define([], function () {

    'use strict';

    return Backbone.View.extend({
        tagName: 'div',
        className: 'level',

        initialize: function () {
            _.bindAll(this, 'mouseDownRight', 'trim');
            this._trim = {
                start: 0,
                end: 0
            };
            this.levelWidth = 235;
            this.scrubberOffset = 22;
            this.level = 0;
            this.holder = this.$('.holder')[0];
            this.render();
        },

        render: function () {
            this.right = this.$('.right')[0];
            this.hammertimeR = Hammer(this.right);
            this.hammertimeR.on("dragstart", this.mouseDownRight);
            this.hammertimeR.on("drag", this.trim);
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
            this.holder.style.paddingRight = paddingRight + 'px';
            this.$('.right').css('right', paddingRight - this.scrubberOffset);
            var levelId = this.el.id.replace('level-', '');
            var difference = this.levelWidth - paddingRight;
            if(levelId === 'rotation'){
                level = difference / (this.levelWidth/360);
                level = level - 180;
            }else{
                level = difference / this.levelWidth;
            }
            log(levelId, level);
            this.model.set(levelId, level);
        },

        setLevel: function(level){
            var paddingRight;
            if (this.el.id.replace('level-', '') === 'rotation') {
                paddingRight = ((360 - (level + 180))/360) * 235;

//                paddingRight = ((540 - level)/360) * 235;
            } else {
                paddingRight = (1 - level) * 235;
            }
            this.$('.right').css('right', paddingRight - this.scrubberOffset);
            this.holder.style.paddingRight = paddingRight + 'px';
        }


    });

});