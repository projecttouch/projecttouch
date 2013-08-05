/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'div',
        className: 'bar',
        offset: {},

        events: {
            "mousedown .left": "mouseDownLeft",
            "mousedown .right": "mouseDownRight"
        },

        initialize: function () {

            _.bindAll(this, 'resize', 'shrinkMedia');

            this.options.model.collection.on('resize', this.resize, this);
            this.options.model.on('change:frames', this.resize, this);
        },

        render: function () {

            var line = document.createElement('div');

            this.part = this.constructHandler();

            line.setAttribute('class', 'line');
            this.el.innerHTML = this.options.model.get('media')
                .get('file')
                .name;

            this.el.appendChild(line);
            line.appendChild(this.part);


            return this;

        },

        constructHandler: function () {
            var handler = document.createElement('div'),
                left = document.createElement('div'),
                rigth = document.createElement('div');

            handler.classList.add('part');
            left.classList.add('left');
            rigth.classList.add('right');

            handler.appendChild(left);
            handler.appendChild(rigth);

            return handler;
        },

        mouseDownLeft: function () {

            this.moving = 'left';

            window.addEventListener('mousemove', this.shrinkMedia, true);

            this.trigger('offsetpreviewstart');

        },

        mouseDownRight: function () {

            this.moving = 'right';

            window.addEventListener('mousemove', this.shrinkMedia, true);

            this.trigger('offsetpreviewstart');

        },

        shrinkMedia: function (e) {

            var left,
            offset,
            margin,
            _left = this.el.querySelector('.left'),
            _right = this.el.querySelector('.right');

            if (this.moving === 'left') {

                left = e.clientX + this.el.parentNode.parentNode.parentNode.scrollLeft;
                offset = parseInt(this.el.style.left);
                margin = left - offset;

                if (margin < 0) {
                    margin = 0;
                }

                this.el.style.paddingLeft = margin + 'px';
                _left.style.left = margin + 'px';

                this.offset.start = margin / parseInt(this.el.style.width);

            }

            if (this.moving === 'right') {

                left = e.clientX + this.el.parentNode.parentNode.parentNode.scrollLeft;
                offset = parseInt(this.el.style.left);
                margin = left - (offset + parseInt(this.el.style.width));

                if (margin > 0) {
                    margin = 0;
                }

                margin = Math.abs(margin);

                this.el.style.paddingRight = margin + 'px';
                _right.style.right = margin + 'px';

                this.offset.end = margin / parseInt(this.el.style.width);

                margin = left - offset;
            }

            this.trigger('offsetpreview', margin / parseInt(this.el.style.width));
        },

        endMove: function () {

            if (this.moving) {
                window.removeEventListener('mousemove', this.shrinkMedia, true);
                this.moving = false;
                this.trigger('offset', this.offset);
            }

        },

        resize: function (e) {

            this.part.style.width = ((e.get('frames') / e.collection.totalFrames) * 100) + '%';

            //            this.el.style.paddingLeft = (this.offset.start * parseInt(this.el.style.width)) + 'px';
            //            this.left.style.left = (this.offset.start * parseInt(this.el.style.width)) + 'px';
            //
            //            this.el.style.paddingRight = (this.offset.end * parseInt(this.el.style.width)) + 'px';
            //            this.right.style.right = (this.offset.end * parseInt(this.el.style.width)) + 'px';

        }

    });

});
