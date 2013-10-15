/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define([], function () {

    'use strict';

    return Backbone.Model.extend({

        defaults: {
            "blob": null,
            "file": null
        },

        initialize: function () {
            this.set('blob', window.URL.createObjectURL(this.get('file')));
            
            if (this.get('file').type.indexOf('audio') === -1) {
                this.getThumb();
                this.set('type', 'video');
            } else {
                this.set('type', 'audio');
            }
            
        },
        

        /* Gets the base64 thumb of the video element
         * ---------------------------------------------------------------------- */

        getThumb: function () {

            var self = this,
                canvas = document.createElement('canvas'),
                video = document.createElement('video'),
                ctx = canvas.getContext('2d');

            canvas.width = 260;
            canvas.height = 140;

            video.addEventListener('canplaythrough', function () {
                _.delay(function () {
                    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 263, 140);
                    self.set('thumb', canvas.toDataURL('image/jpeg'));    
                }, 1000);
            });

            video.src = this.get('blob');
        },
        
        
        /* Clears the ObjectURL
         * ---------------------------------------------------------------------- */
        
        clear: function () {
            window.URL.revokeObjectURL(this.get('blob'));
            Backbone.Model.prototype.clear.apply(this, arguments);
        }

    });

});
