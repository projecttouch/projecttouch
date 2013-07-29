/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define([], function () {

    'use strict';

    return {
        screenshot: function (source, width, height) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = width ? width : 260;
            canvas.height = height ? height : 140;

            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 263, 140);
            return canvas.toDataURL('image/jpeg');
        }
    };

});
