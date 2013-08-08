/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore', 'app/views/ui/layer-thumb'], function (Backbone, _, Thumb) {

    'use strict';

    return Backbone.View.extend({

        tageName: 'div',
        className: 'bar',

        initialize: function () {

            _.bindAll(this, 'resize', 'endMove', 'mouseDown', 'moveMedia', 'resize');

            this.moving = false;
            this.startMove = 0;

            this.options.model.on("change:frames", this.resize, this);

        },

        render: function () {

            var self = this;

            this.layer = document.createElement('div');
            this.layer.classList.add('layer');
            this.el.innerHTML = this.options.model.get('media')
                .get('file')
                .name;
            this.el.appendChild(this.layer);

            this.media = new Thumb({
                color: "#00ffff",
                model: this.options.model
            });
            this.layer.appendChild(this.media.render()
                .el);

            this.media.el.addEventListener('mousedown', this.mouseDown, false);
            window.addEventListener('mouseup', this.endMove, false);
            window.addEventListener('resize', this.resize, false);

            return this;

        },

        mouseDown: function (e) {

            if (e.target.getAttribute('class') === 'left' || e.target.getAttribute('class') === 'right') {
                return;
            }

            this.startMove = e.clientX - parseInt(this.media.el.style.left);
            this.moving = true;

            window.addEventListener('mousemove', this.moveMedia, true);

        },

        moveMedia: function (e) {

            if (this.moving) {
                this.media.el.style.left = (e.clientX - this.startMove) + 'px';
            }

        },

        endMove: function () {

            this.media.endMove();

            if (this.moving) {
                
                var frame = (parseInt(this.media.el.style.left) / this.$('.layer').width()) * this.options.model.collection.totalFrames;
                this.options.model.set('offset', Math.round(frame));
                this.options.model.syncFrame();
                
                window.removeEventListener('mousemove', this.moveMedia, true);
                this.moving = false;
            }

        },

        resize: function () {

            var percentage = this.options.model.get('frames') / this.options.model.collection.totalFrames;

            this.media.el.style.width = percentage * this.$('.layer')
                .width() + 'px';
            this.media.resize();

            if (this.options.model.get('offset') < 0) {
                this.media.el.style.left = '-' + ((Math.abs(this.options.model.get('offset')) / this.options.model.collection.totalFrames) * this.$('.layer').width()) + 'px';
            } else {
                this.media.el.style.left = ((this.options.model.get('offset') / this.options.model.collection.totalFrames) * this.$('.layer').width()) + 'px';
            }

        }

    });

});
