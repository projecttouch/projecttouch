/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

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
        },
        
        captureAsCanvas: function (video, options, handle) {

            // Create canvas and call handle function
            var callback = function () {
                // Create canvas
                var canvas = document.createElement('canvas');
                canvas.width = options.width;
                canvas.height = options.height;
                // Get context and draw screen on it
                canvas.getContext('2d').drawImage(video, 0, 0, options.width, options.height);
                // Call handle function (because of event)
                handle.call(this, canvas);
            }
            // If we have time in options
            if (options.time && !isNaN(parseInt(options.time))) {
                // Seek to any other time
                video.currentTime = options.time;
                // Wait for seeked event
                $(video).bind('seeked', callback);
                return;
            }
            // Otherwise callback with video context - just for compatibility with calling in the seeked event
            return callback.apply(video);
        }
    };

});
