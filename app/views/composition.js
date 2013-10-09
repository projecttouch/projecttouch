/**
 * Project Touch
 *
 * @date: 8/07/13
 */

/*global define, window, document, $, requirejs, require  */

define([], function () {

    'use strict';

    return Backbone.View.extend({

        id: 'composition',
        el: '#composition',
        initialize: function () {
            _.bindAll(this, 'togglePanels', 'toggleVideo');
            this.hammertime = Hammer(this.el);
            this.hammertime.on('doubletap', this.togglePanels);
            this.hammertime.on('tap', this.toggleVideo);
        },

        toggleVideo: function () {
            if (window.App.timeline.playing) {
                window.App.timeline.stop();
            } else {
                window.App.timeline.play();
            }
        },

        togglePanels: function () {
            var klass = this;
            if (this.$el.css('left') === '310px') {
                $('#library').slideUp();
                $('#effects').slideUp({complete: function () {
                    klass.$el.animate({'left': 0, 'width': '100%'});
                }});
            } else {
                var newWidth = (window.innerWidth - 620) + 'px';
                this.$el.animate({'left': '310px', 'right': '310px', 'width': newWidth}, function () {
                    $('#library').slideDown();
                    $('#effects').slideDown();
                });
            }
        }

    });
});
