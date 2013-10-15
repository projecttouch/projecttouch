/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define([], function () {

    'use strict';

    return Backbone.View.extend({

        tageName: 'div',
        className: 'media',
        resource: null,
        video: null,

        initialize: function () {
            
            _.bindAll(this,
                'mouseDownLeft',
                'mouseDownRight',
                'trim',
                'endTrim',
                'resize');

            this._trim = {
                start: 0,
                end: 0
            };

            this.moving = false;

        },

        render: function () {
            
            _.bindAll(this, 'select')

            this.el.style.left = '0px';

            this.left = document.createElement('div');
            this.left.setAttribute('class', 'left');

            this.middle = document.createElement('div');
            this.middle.setAttribute('class', 'middle');
            this.middle.style.backgroundColor = this.options.color;

            this.right = document.createElement('div');
            this.right.setAttribute('class', 'right');

            this.el.appendChild(this.left);
            this.el.appendChild(this.middle);
            this.el.appendChild(this.right);
            
            this.hammertime = Hammer(this.el);
            this.hammertime.on("doubletap", this.select);
            
            this.hammertimeL = Hammer(this.left); 
            this.hammertimeL.on("dragstart", this.mouseDownLeft);
            this.hammertimeL.on("drag", this.trim);
            
            this.hammertimeR = Hammer(this.right); 
            this.hammertimeR.on("dragstart", this.mouseDownRight);
            this.hammertimeR.on("drag", this.trim);

            this.options.model.collection.on('open', this.changeState, this);
        
            return this;

        },
        
        select: function (e) {
            if(this.options.model.get('type') === 'video') {
                this.options.model.trigger('open', this.options.model); 
            } 
                      
        },
        
        
        /* Changes the selected state of the layer
         * ---------------------------------------------------------------------- */
        
        changeState: function (model) {
            if (this.options.model === model) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        },
        
        
        /* Trim left start
         * ---------------------------------------------------------------------- */
        
        mouseDownLeft: function () {
            
            window.App.dragging = true;
            this.dragStartPos = parseInt(this.el.style.paddingLeft);
            this.moving = 'left';
            this.options.model.trigger('trim:start', this.options.model);
        },


        /* Trim right start
         * ---------------------------------------------------------------------- */
        
        mouseDownRight: function () {
            
            window.App.dragging = true;
            this.dragStartPos = parseInt(this.el.style.paddingRight);
            this.moving = 'right';
            this.options.model.trigger('trim:start', this.options.model);
        },
        
        
        /* Trimming
         * ---------------------------------------------------------------------- */
        
        trim: function (e) {

            var left,
                offset,
                margin;

            if (this.moving === 'left') {

                left = e.gesture.deltaX + this.el.parentNode.parentNode.parentNode.scrollLeft;

                offset = parseInt(this.el.style.left) + 0;
                margin = this.dragStartPos + left;

                if (margin < 0) {
                    margin = 0;
                }

                this.el.style.paddingLeft = margin + 'px';
                this.left.style.left = margin + 'px';

                this._trim.start = parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames'));

            }

            if (this.moving === 'right') {

                left = e.gesture.deltaX + this.el.parentNode.parentNode.parentNode.scrollLeft;
                offset = parseInt(this.el.style.left) + 0;
                margin = -this.dragStartPos + left;

                if (margin > 0) {
                    margin = 0;
                }

                margin = Math.abs(margin);

                this.el.style.paddingRight = margin + 'px';
                this.right.style.right = margin + 'px';

                this._trim.end = parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames'));
                
                margin = parseInt(this.el.style.width) - margin;
            }
            
            if (this.options.model.get('type') === 'video') {
                this.options.model.trigger('trim:preview', parseInt((margin / parseInt(this.el.style.width)) * this.options.model.get('frames')));
            }
        },
        
        
        /* End of trimming
         * ---------------------------------------------------------------------- */
        
        endTrim: function () {

            if (this.moving) {
                window.App.dragging = false;
                window.removeEventListener('mousemove', this.trim, true);
                
                this.moving = false;
                this.options.model.set('trim', {start:this._trim.start, end:this._trim.end});
            }

        },

        resize: function () {
            
            var trim = this.options.model.get('trim'),
                frames = this.options.model.get('frames');

            this.el.style.paddingLeft = ((trim.start / frames) * parseInt(this.el.style.width)) + 'px';
            this.left.style.left = ((trim.start / frames) * parseInt(this.el.style.width)) + 'px';

            this.el.style.paddingRight = ((trim.end / frames) * parseInt(this.el.style.width)) + 'px';
            this.right.style.right = ((trim.end / frames) * parseInt(this.el.style.width)) + 'px';

        }

    });

});