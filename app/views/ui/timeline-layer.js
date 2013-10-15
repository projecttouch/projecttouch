/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define(['app/views/ui/timeline-layer-slide'], function (Slide) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'li',

        events: {
            "click button": "clone"
        },

        template: _.template("\
            <div class='layer'>\
            </div>\
        "),
        

        initialize: function () {

            _.bindAll(this, 'resize', 'trimEnd', 'trimStart', 'trim', 'resize', 'clone');

            this.moving = false;
            this.startMove = 0;

            this.options.model.on('destroy', this.remove, this);

            if (this.options.model.get('frames') === 0) {
                log('check frames later');
                this.options.model.on("change:frames", this.resize, this);
            }
        },
        

        render: function () {

            this.media = new Slide({
                color: "#00ffff",
                model: this.options.model
            });

            this.$el.html(this.template());
            this.el.querySelector('.layer').appendChild(this.media.render().el);
                        
            if (this.model.get('type') !== 'video') {
                this.$('.layer').addClass(this.model.get('type').replace('/','-'));
            }

            this.hammertime = Hammer(this.media.el);
            
            this.hammertime.on("dragstart", this.trimStart);
            this.hammertime.on("drag", this.trim);
            this.hammertime.on("dragend", this.trimEnd);

            window.addEventListener('resize', this.resize, false);

            return this;

        },
        
        
        /* Clones the selected layer
         * ---------------------------------------------------------------------- */
        
        clone: function () {
            this.options.model.collection.add(this.options.model.toJSON());

        },
        
        
        /* Start of the drag/trim
         * ---------------------------------------------------------------------- */
        
        trimStart: function (e) {

            if (e.target.getAttribute('class') === 'left' || e.target.getAttribute('class') === 'right') {
                return;
            }

            window.App.dragging = true;

            this.startMove = e.gesture.deltaX - parseInt(this.media.el.style.left);
            this.moving = true;

        },
        
        
        /* Dragging the media
         * ---------------------------------------------------------------------- */
        
        trim: function (e) {

            if (this.moving) {
                this.media.el.style.left = (e.gesture.deltaX - this.startMove) + 'px';
            }

        },
        

        /* The End of the media trim move
         * ---------------------------------------------------------------------- */

        trimEnd: function () {

            this.media.endTrim();

            if (this.moving) {
                window.App.dragging = false;

                var frame = (parseInt(this.media.el.style.left) / this.$('.layer').width()) * this.options.model.collection.totalFrames;
                this.options.model.set('offset', Math.round(frame));
                if (this.model.get('type') === 'video') {
                    this.options.model.syncFrame();
                }

                window.removeEventListener('mousemove', this.moveMedia, true);
                this.moving = false;
            }

        },
        

        resize: function () {

            var percentage = this.options.model.get('frames') / this.options.model.collection.totalFrames;

            this.media.el.style.width = parseInt(percentage * this.$('.layer').width()) + 'px';
            this.media.resize();

            if (this.options.model.get('offset') < 0) {
                this.media.el.style.left = '-' + ((Math.abs(this.options.model.get('offset')) / this.options.model.collection.totalFrames) * this.$('.layer').width()) + 'px';
            } else {
                this.media.el.style.left = ((this.options.model.get('offset') / this.options.model.collection.totalFrames) * this.$('.layer').width()) + 'px';
            }

        },
        

        remove: function () {
            Backbone.View.prototype.remove.call(this);
        }

    });

});
