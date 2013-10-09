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
//            this.hammertime.on('pinchin', this.showPanels);
//            this.hammertime.on('pinchout', this.hidePanels);
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
            if (this.$el.css('left') === '310px') {
                this.hidePanels();
            } else {
                this.showPanels();
            }
        },

        hidePanels: function () {
            var klass = this;
            $('#library').slideUp();
            $('footer').animate({bottom: '-400px'});
            $('#effects').slideUp({complete: function () {
                klass.$el.animate({'left': 0, 'width': '100%'});
            }});
        },

        showPanels: function () {
            var newWidth = (window.innerWidth - 620) + 'px';
            this.$el.animate({'left': '310px', 'right': '310px', 'width': newWidth}, function () {
                $('footer').animate({bottom: '0px'});
                $('#library').slideDown();
                $('#effects').slideDown();
            });
        }

    });
});
