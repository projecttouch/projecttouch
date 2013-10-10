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
            _.bindAll(this, 'togglePanels', 'toggleVideo', 'hidePanels', 'showPanels');
            this.title = this.$('h2');
            this.hammertime = Hammer(this.el);
            this.hammertime.on('doubletap', this.togglePanels);
            this.hammertime.on('tap', this.toggleVideo);

        },

        toggleVideo: function (e) {
            if (window.App.timeline.playing) {
                window.App.timeline.play();
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
            this.title.animate({'margin-left': '40px'});
            var klass = this;
            $('#edit').slideUp();
            $('#library').slideUp();
            $('footer').animate({bottom: '-400px'});
            $('#effects').slideUp({complete: function () {
                klass.$el.animate({'left': 0, 'width': '100%'});
                $('footer').css('display', 'none');
            }});
        },

        showPanels: function () {
            this.title.animate({'margin-left': '20px'});

            var newWidth = (window.innerWidth - 620) + 'px';
            this.$el.animate({'left': '310px', 'right': '310px', 'width': newWidth}, function () {
                $('footer').animate({bottom: '0px'}).css('display', 'block');
                if(window.App.views.edit.active){
                    $('#edit').slideDown();
                }else{
                    $('#library').slideDown();
                }
                $('#effects').slideDown();
            });
        }

    });
});
