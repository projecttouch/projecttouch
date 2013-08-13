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

            this.width = 1280;
            this.height = 720;

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

        renderLoop: function () {

            if (this.source !== null && this.source !== undefined) {

                var width,
                height,
                posX,
                posY;

                width = this.source.video.videoWidth * this.source.get('scaleX');
                height = this.source.video.videoHeight * this.source.get('scaleY');
              
                posX = -(width /2);
                posY = -(height /2);

                if (window.App.filter !== null) {

                    var pixelData;

                    this.effectContext.drawImage(this.source.video, 0, 0, this.source.video.videoWidth, this.source.video.videoHeight, posX, posY, width, height);
                    pixelData = this.filterImage(App.filter, this.effectContext.getImageData(0, 0, this.width, this.height));
                    this.context.putImageData(pixelData, 0, 0);

                } else {
                    
                    this.context.save();
                    this.context.translate(this.width /2, this.height /2);
                    this.context.rotate(this.source.get('rotate'));
                    
                    this.context.drawImage(this.source.video, 0,0, this.source.video.videoWidth, this.source.video.videoHeight, posX, posY, width, height);
                    this.context.restore(); 
                    
                }

            }

            window.requestAnimationFrame(this.renderLoop);

        }

    });

});
