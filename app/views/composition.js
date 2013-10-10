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
            _.bindAll(this, 'togglePanels', 'toggleVideo', 'hidePanels', 'showPanels', 'pinch');
            this.title = this.$('h2');
            this.hammertime = Hammer(this.el);
            this.hammertime.on('doubletap', this.togglePanels);
            this.hammertime.on('pinch', this.pinch);
            this.hammertime.on('tap', this.toggleVideo);
            this.right = $('#level-scale .right');
            this.holder = $('#level-scale .holder');
        },
        levelWidth: null,
        timer: null,
        usablePixels: null,
        startPaddingRight: null,
        pinchThrottle: 0,

        pinch: function (e) {
            this.pinchThrottle += 1;
            if (this.pinchThrottle < 2) {
                return;
            }
            this.levelWidth = parseInt(window.App.views.edit.scaleView.levelWidth);

            var klass = this,
                newLevel,
                right;
            this.timer = null;
            window.clearTimeout(this.timer);


            if (!this.usablePixels) {
                this.startPaddingRight = parseInt(window.App.views.edit.scaleView.holder.style.paddingRight);
                if (this.startPaddingRight === this.levelWidth) {
                    this.usablePixels = this.levelWidth;
                } else {
                    this.usablePixels = this.levelWidth - this.startPaddingRight;
                }
                log('usablePixels', this.usablePixels);
            }

            newLevel = this.usablePixels / e.gesture.scale;

            if (newLevel > this.levelWidth) {
                newLevel = this.levelWidth;
            }
            if (newLevel < 0) {
                newLevel = 0;
            }
            right = newLevel - 22;
            newLevel += 'px';
            log('newLevel', newLevel);


            this.holder.css('padding-right', newLevel);
            this.right.css('right', right);
            this.timeout = window.setTimeout(function () {
                klass.usablePixels = null;
            }, 1000);
            this.pinchThrottle = 0;
        },


        toggleVideo: function (e) {
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
            this.title.animate({'margin-left': '40px'});
            var klass = this;
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
                $('#library').slideDown();
                $('#effects').slideDown();
            });
        }

    });
});
