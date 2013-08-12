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

            this._trim = {
                start: 0,
                end: 0
            };

            _.bindAll(this,
                'mouseDownLeft',
                'mouseDownRight',
                'trim',
                'endTrim',
                'resize');

            this.moving = false;

        },

        render: function () {

            this.el.style.left = '0px';

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
            window.addEventListener('mousemove', this.trim, true);
            this.options.model.trigger('trim:start', this.options.model);

        },

        mouseDownRight: function () {

            this.moving = 'right';
            window.addEventListener('mousemove', this.trim, true);
            this.options.model.trigger('trim:start', this.options.model);

        },

        trim: function (e) {

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

                this._trim.start = parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames'));

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

                this._trim.end = parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames'));
                
                margin = left - offset;
            }

            this.options.model.trigger('trim:preview', parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames')));
        },

        endTrim: function () {

            if (this.moving) {
                window.removeEventListener('mousemove', this.trim, true);
                
                this.moving = false;
                this.options.model.set('trim', {start:this._trim.start, end:this._trim.end});
            }

        },

        resize: function () {
            
            var trim = this.options.model.get('trim'),
                frames = this.options.model.get('frames');

            this.el.style.paddingLeft = ((trim.start / frames) * parseInt(this.el.style.width)) + 'px';
            this.left.style.left = ((trim.start / frames) * parseInt(this.el.style.width)) + 'px';

            this.el.style.paddingRight = ((trim.end / frames) * parseInt(this.el.style.width)) + 'px';
            this.right.style.right = ((trim.end / frames) * parseInt(this.el.style.width)) + 'px';

        }

    });

});