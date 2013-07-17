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

            this.width = 720;
            this.height = 360;

        },

        setSource: function (model) {

            if (model !== undefined && model !== null) {
                this.source = model.video;
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

            return filter.apply(null, args);
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

            this.el.style.position = "absolute";
            this.el.style.top = "50%";
            this.el.style.left = "50%";
            this.el.style.margin = '-' + (this.height / 2) + 'px 0 0 -' + (this.width / 2) + 'px';

            return this;

        },

        toggleEffect: function () {
            this.effect = this.effect === false;
        },

        renderLoop: function () {

            if (this.source !== null && this.source !== undefined) {

                var width,
                height,
                posX,
                posY;

                width = this.width;
                height = this.height;
                posX = 0;
                posY = 0;

                if (window.App.filter !== null) {

                    var pixelData;

                    this.effectContext.drawImage(this.source, 0, 0, this.source.videoWidth, this.source.videoHeight, posX, posY, width, height);
                    pixelData = this.filterImage(App.filter, this.effectContext.getImageData(0, 0, this.width, this.height));
                    this.context.putImageData(pixelData, 0, 0);

                } else {
                    this.context.drawImage(this.source, 0, 0, this.source.videoWidth, this.source.videoHeight, posX, posY, width, height);
                }

            }

            window.requestAnimationFrame(this.renderLoop);

        }

    });

});
