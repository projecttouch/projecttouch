/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'canvas',
        id: 'player',

        initialize: function () {

            window.requestAnimationFrame = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            _.bindAll(this, 'render', 'renderLoop', 'toggleEffect');

            this.source = null;
            this.effect = false;

            this.width = 640;
            this.height = 360;

        },

        setSource: function (model) {

            if (model !== undefined && model !== null) {
                this.source = model;
            } else {
                this.source = null;
                this.context.clearRect(0, 0, this.width, this.height);
            }

        },

        setEffect: function (effect) {

        },

        setOverLay: function (overlay) {

        },

        filterImage: function (filter, data, var_args) {
            var args = [data];

            _.each(arguments, function (arg) {
                args.push(arg);
            });

            return filter.apply(App, args);
        },

        render: function () {

            this.effectCanvas = document.createElement('canvas');
            this.effectContext = this.effectCanvas.getContext('2d');

            this.effectCanvas.width = this.width;
            this.effectCanvas.height = this.height;

            this.el.setAttribute('id', 'player');

            this.el.width = this.width;
            this.el.height = this.height;

            this.context = this.el.getContext('2d');

            this.renderLoop();

            this.el.addEventListener('click', this.toggleEffect, false);

            return this;

        },

        toggleEffect: function () {
            this.effect = this.effect === false;
        },

        rendering: function (source, opacity) {
            var width,
            height,
            posX,
            posY;
            
            if(source !== undefined) {
                width = source.video.videoWidth * source.get('scaleX');
                height = source.video.videoHeight * source.get('scaleY');

                posX = -(width / 2);
                posY = -(height / 2);

                this.context.save();
                this.context.globalAlpha = this.source.length > 1 ? 0.5 : 1;
                this.context.translate(this.width / 2, this.height / 2);
                this.context.rotate(source.get('rotate'));

                this.context.drawImage(source.video, 0, 0, source.video.videoWidth, source.video.videoHeight, posX, posY, width, height);
                this.context.restore();
            }
        },

        renderLoop: function () {

            if (this.source !== null && this.source !== undefined) {

                var width,
                height,
                posX,
                posY;

                if (this.source.length > 1) {
                    _.each(this.source, this.rendering, this);
                } else {
                    this.rendering(this.source[0]);
                }
                if (window.App.filter !== null) {
                    this.context.putImageData(this.filterImage(App.filter, this.context.getImageData(0, 0, this.width, this.height)), 0, 0);
                }

            }

            window.requestAnimationFrame(this.renderLoop);

        }

    });

});
