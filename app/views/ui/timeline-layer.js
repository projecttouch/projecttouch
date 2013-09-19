/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore', 'app/views/ui/timeline-layer-slide'], function (Backbone, _, Slide) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'li',
        
        events: {
            "click button":"clone"
        },
        
        template: _.template("\
            <div class='layer'>\
            </div>\
        "),

        initialize: function () {

            _.bindAll(this, 'resize', 'endTrim', 'mouseDown', 'moveMedia', 'resize', 'clone');

            this.moving = false;
            this.startMove = 0;
            
            log('new layer:', this.options.model.get('media').get('file').name);

            if (this.options.model.get('frames') === 0) {
                log('check frames later')
                this.options.model.on("change:frames", this.resize, this); 
            }
        },
        
        clone: function () {
            
            log(this.options.model.collection.add(this.options.model.toJSON()))  
        
        },
        
        render: function () {
            
            this.media = new Slide({
                color: "#00ffff",
                model: this.options.model
            });
            
            this.$el.html(this.template());
            this.el.querySelector('.layer').appendChild(this.media.render().el)
            
            this.media.el.addEventListener('mousedown', this.mouseDown, false);
            window.addEventListener('mouseup', this.endTrim, false);
            window.addEventListener('resize', this.resize, false);
            
            return this;

        },

        mouseDown: function (e) {

            if (e.target.getAttribute('class') === 'left' || e.target.getAttribute('class') === 'right') {
                return;
            }

            this.startMove = e.clientX - parseInt(this.media.el.style.left);
            this.moving = true;

            window.addEventListener('mousemove', this.moveMedia, true);

        },

        moveMedia: function (e) {

            if (this.moving) {
                this.media.el.style.left = (e.clientX - this.startMove) + 'px';
            }

        },

        endTrim: function () {

            this.media.endTrim();

            if (this.moving) {
                
                var frame = (parseInt(this.media.el.style.left) / this.$('.layer').width()) * this.options.model.collection.totalFrames;
                this.options.model.set('offset', Math.round(frame));
                this.options.model.syncFrame();
                
                log(this.options.model);
                
                window.removeEventListener('mousemove', this.moveMedia, true);
                this.moving = false;
            }

        },

        resize: function () {

            var percentage = this.options.model.get('frames') / this.options.model.collection.totalFrames;

            this.media.el.style.width = parseInt(percentage * this.$('.layer').width()) + 'px';
            this.media.resize();

            log(this.media.el.style.width)

            if (this.options.model.get('offset') < 0) {
                this.media.el.style.left = '-' + ((Math.abs(this.options.model.get('offset')) / this.options.model.collection.totalFrames) * this.$('.layer').width()) + 'px';
            } else {
                this.media.el.style.left = ((this.options.model.get('offset') / this.options.model.collection.totalFrames) * this.$('.layer').width()) + 'px';
            }

        }

    });

});
