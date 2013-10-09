/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/ui/timeline-layer', 'app/views/ui/effects'], function (Layer) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'footer',
        el: 'body > footer',
        currentZoom: 100,
        layers: [],
        scrollstartScrubber: 0,
        events: {
            "click .zoom": "zoom",
            'click button': 'clickHandler'
        },

        clickHandler: function (e) {

            switch (e.currentTarget.getAttribute('class')) {
            case 'play':
                window.App.timeline.play();
                break;
            case 'pause':
            case 'stop':
                window.App.timeline.stop();
                break;
            case 'options':
                $(e.currentTarget.parentElement).toggleClass('active');
                break;
            case 'delete':
                var parent = e.currentTarget.parentElement.parentElement;
                this.collection.get(parent.getAttribute('data-cid')).destroy();
                $(parent).remove();
                break;
            case 'duplicate':
                var cid = e.currentTarget.parentElement.parentElement.getAttribute('data-cid');
                this.collection.add(this.collection.get(cid).toJSON());
                break;
            }

        },

        initialize: function () {

            this.time = this.el.querySelector('#time .line');

            this.collection = window.App.timeline.collection;
            this.collection.on('add', this.add, this);
            this.collection.on('remove', this.remove, this);
            this.collection.on('frame-sync seek kill', this.progress, this);

            _.bindAll(this, 'pinch', 'dragstart', 'drag', 'dragstartScrubber', 'dragScrubber');
            //            this.options.model.on('change:thumb', this.addThumb, this);

            var spans = this.el.querySelectorAll('.time span'),
                devidedFrames = this.collection.totalFrames / 10;

            _.each(spans, function (span, id) {
                if (id !== 0) span.innerHTML = '<div>' + (devidedFrames * id / 25).toMMSS() + '</div>';
            });
            
            this.hammerscrubber = Hammer(document.getElementById('scrubber'));
            this.hammerscrubber.on('dragstart', this.dragstartScrubber);
            this.hammerscrubber.on('drag', this.dragScrubber);

            this.hammertime = Hammer(this.el);
            this.hammertime.on('pinchin', this.pinch);
            this.hammertime.on('pinchout', this.pinch);
            this.hammertime.on('dragstart', this.dragstart);
            this.hammertime.on('drag', this.drag);

        },
        
        
        /* Adds the layer to the view
         * ---------------------------------------------------------------------- */

        add: function (model) {
        
            var title = "",
                layer = new Layer({
                    model: model
                }),
                template = _.template("\
                    <%= title %>\
                    <button class='options'></button>\
                    <div>\
                        <button class='duplicate'></button>\
                        <button class='delete'></button>\
                    </div>\
                ");
                
            if (model.get('type') === 'video') {
                title = model.get('media').get('file').name;
                title = title.substring(0, title.length - 4)
            } else {
                title = model.get('name');
            }

            this.el.querySelector('.layers').appendChild(layer.render().el);

            var bb = document.createElement('li');
            bb.setAttribute('data-cid', model.cid);
            bb.innerHTML = template({
                title: title
            });

            this.el.querySelector('.labels').appendChild(bb);
            this.layers.push(layer);
            if (model.get('frames') !== 0) {
                layer.resize();
            }
        },
        
        
        /* Removes the layer from the view 
         * ---------------------------------------------------------------------- */
        
        remove: function (model) {
            this.$('*[data-cid="' + model.cid + '"]').remove();
        },
        
        
        /* Pinch zoom effect on the timeline to zoom in and out
         * ---------------------------------------------------------------------- */

        pinch: function (event) {
            var layers = this.el.querySelector('.layers'),
                scale = event.gesture.scale;

            this.currentZoom = (scale < 1 ? 1 : scale) * 100;
            layers.style.width = this.currentZoom + "%";

            _.each(this.layers, function (layer) {
                layer.resize();
            });
        },

        dragstart: function (event) {
            if (event.touches.length > 1) {
                this.scrollstart = this.el.querySelector('.layer-holder').scrollLeft;
            }
        },

        drag: function (event) {
            if (!window.App.dragging) this.el.querySelector('.layer-holder').scrollLeft = this.scrollstart + -(event.gesture.deltaX);
        },
        
        
        /* Scrubber drag functions
         * ---------------------------------------------------------------------- */
            
        dragstartScrubber: function (event) {
            
            log(document.getElementById('scrubber').style.left)
            
            this.startFrameScrub = window.App.timeline._frame;
            
            // if (event.touches.length > 1) {
// //                this.scrollstartScrubber = this.el.querySelector('.layer-holder').scrollLeft;
//             }
        },

        dragScrubber: function (event) {

            var frameScrub = parseInt((Math.abs(event.gesture.deltaX) / $('#layers').width()) * window.App.timeline.collection.totalFrames);
            
           
            
            switch (event.gesture.direction) {
            case "left":
                frameScrub = this.startFrameScrub - frameScrub;
                break;
            case "right":
                frameScrub = this.startFrameScrub + frameScrub;
                break;
            default:
                return;
            }
            
            window.App.timeline.seek(frameScrub);
            
        },


        /* The zoom function of the timeline
         * ---------------------------------------------------------------------- */

        zoom: function (event) {

            var layers = this.el.querySelector('.layers'),
                current = layers.style.width;

            switch (event.currentTarget.getAttribute('class').replace('zoom ', '')) {
            case "in":
                this.currentZoom += 25;
                break;
            case "out":
                this.currentZoom = this.currentZoom <= 100 ? 100 : this.currentZoom - 10;
                break;
            }

            layers.style.width = this.currentZoom + "%";

            _.each(this.layers, function (layer) {
                layer.resize();
            });

        },

        progress: function (frame) {
            var current = frame / 25,
                total = this.collection.totalFrames / 25;

            this.el.querySelector('#scrubber').innerHTML = current.toMMSS();
            this.el.querySelector('#scrubber').style.left = ((current / total) * 100) + "%";

        }

    });

});
