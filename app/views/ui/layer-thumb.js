/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        tageName: 'div',
        className: 'media',
        resource: null,
        video: null,

        initialize: function () {

            this.offset = {
                start: 0,
                end: 0
            };

            _.bindAll(this,
                'mouseDownLeft',
                'mouseDownRight',
                'shrinkMedia',
                'endMove',
                'resize');

            this.moving = false;

        },

        hexToRgb: function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
        },

        render: function () {

            var rgb = this.hexToRgb(this.options.color);

            this.el.style.left = '0px';

            this.el.style.backgroundColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.4)';

            this.left = document.createElement('div');
            this.left.setAttribute('class', 'left');

            this.middle = document.createElement('div');
            this.middle.setAttribute('class', 'middle');
            this.middle.style.backgroundColor = this.options.color;

            this.right = document.createElement('div');
            this.right.setAttribute('class', 'right');

            this.el.appendChild(this.left);
            this.el.appendChild(this.middle);
            this.el.appendChild(this.right);

            this.left.addEventListener('mousedown', this.mouseDownLeft, false);
            this.right.addEventListener('mousedown', this.mouseDownRight, false);
        
            return this;

        },

        mouseDownLeft: function () {

            this.moving = 'left';
            window.addEventListener('mousemove', this.shrinkMedia, true);
            this.options.model.trigger('offset:start', this.options.model);

        },

        mouseDownRight: function () {

            this.moving = 'right';
            window.addEventListener('mousemove', this.shrinkMedia, true);
            this.options.model.trigger('offset:start', this.options.model);

        },

        shrinkMedia: function (e) {

            var left,
                offset,
                margin;

            if (this.moving === 'left') {

                left = e.clientX + this.el.parentNode.parentNode.parentNode.scrollLeft;
                offset = parseInt(this.el.style.left) + 200;
                margin = left - offset;

                if (margin < 0) {
                    margin = 0;
                }

                this.el.style.paddingLeft = margin + 'px';
                this.left.style.left = margin + 'px';

                this.offset.start = parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames'));

            }

            if (this.moving === 'right') {

                left = e.clientX + this.el.parentNode.parentNode.parentNode.scrollLeft;
                offset = parseInt(this.el.style.left) + 200;
                margin = left - (offset + parseInt(this.el.style.width));

                if (margin > 0) {
                    margin = 0;
                }

                margin = Math.abs(margin);

                this.el.style.paddingRight = margin + 'px';
                this.right.style.right = margin + 'px';

                this.offset.end = parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames'));
                
                margin = left - offset;
            }

            this.options.model.trigger('offset:preview', parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames')));
        },

        endMove: function () {

            if (this.moving) {
                window.removeEventListener('mousemove', this.shrinkMedia, true);
                
                this.moving = false;
                this.options.model.set('offset', {start:this.offset.start, end:this.offset.end});
            }

        },

        resize: function () {

            this.el.style.paddingLeft = (this.offset.start * parseInt(this.el.style.width)) + 'px';
            this.left.style.left = (this.offset.start * parseInt(this.el.style.width)) + 'px';

            this.el.style.paddingRight = (this.offset.end * parseInt(this.el.style.width)) + 'px';
            this.right.style.right = (this.offset.end * parseInt(this.el.style.width)) + 'px';

        }

    });

});