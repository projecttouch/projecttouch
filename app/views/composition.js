/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define([], function () {

    'use strict';

    return Backbone.View.extend({

        id: 'composition',
        el: '#composition',

        initialize: function () {
            _.bindAll(this, 'togglePanels', 'hidePanels', 'showPanels');

            this.title = this.$('h2');
            this.hammertime = Hammer(this.el);
            this.hammertime.on('doubletap', this.togglePanels);
            
            $(window).resize(function(){
               $('#player').height($('#player').width() / 1.7778);
            });
            
            $('#player').height($('#player').width() / 1.7778);

        },

        togglePanels: function () {
            if (this.$el.css('left') === '310px') {
                this.hidePanels();
            } else {
                this.showPanels();
            }
        },

        hidePanels: function () {
            this.title.animate({
                'margin-left': '40px'
            });
            var klass = this;
            $('#edit').slideUp();
            $('#library').slideUp();
            $('footer').animate({
                bottom: '-400px'
            });
            $('#effects').slideUp({
                complete: function () {
                    klass.$el.animate({
                        'left': '15%',
                        'width': '70%',
                        'height': '100%'
                    }, function () {
                        $('#player').animate({
                            'height': $('#player').width() / 1.7778
                        });   
                    });              
                    $('footer').css('display', 'none');
                }
            });
        },

        showPanels: function () {
            this.title.animate({
                'margin-left': '20px'
            });

            var newWidth = (window.innerWidth - 620) + 'px';
            
            

            this.$el.animate({
                'left': '310px',
                'right': '310px',
                'width': newWidth,
                'height': '80%'
            }, function () {
                $('footer').animate({
                    bottom: '0px'
                }).css('display', 'block');
                if (window.App.views.edit.active) {
                    $('#edit').slideDown();
                } else {
                    $('#library').slideDown();
                }
                $('#effects').slideDown();
                $('#player').animate({
                    'height': $('#player').width() / 1.7778
                });
            });
        }

    });
});
