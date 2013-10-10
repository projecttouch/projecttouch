/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 'app/filters', 'app/models/layer'], function (Panel, Filter, Layer) {

    return Panel.extend({

        id: 'effects',
        el: '#effects',

        events: {
            "click ul a": "addEffect"
        },
        
        initialize: function () {
            Panel.prototype.initialize.call(this);
            
            _.each(Filter, function (f, id) {
                this.$el.find('ul').append('<li class="off" data-effect="' + id + '"><span></span><a href="' + id+ '">' +id + '</a></li>');
            }, this);
            
            this.options.collection.on('add', this.reloadEffects, this);            
        },
        
        
        reloadEffects: function (model) {
            
            var video = document.createElement('video'),
                self = this;
                
            video.addEventListener('loadedmetadata', function(){
                window.App.utils.captureAsCanvas(video, { width: 280, height: 155, time: parseInt(video.duration/2) }, function (canvas) {
                    
                    var ctx = canvas.getContext('2d'),
                        src,
                        pixels,
                        newPixels,
                        newCanvas,
                        ctx2;
                        
                    $('#effects li').each(function(index, li){
                        newCanvas = document.createElement('canvas');
                        ctx2 = newCanvas.getContext('2d');
                        pixels = ctx.getImageData(0, 0, 280, 155);
                        newPixels = App.player.filterImage(Filter[li.getAttribute('data-effect')], pixels);
                        ctx2.putImageData(newPixels, 0, 0);
                        src = newCanvas.toDataURL();
                        li.style.backgroundImage = 'url(' + src + ')';
                    });
                })
            }, false);
            
            video.src = model.get('media').get('blob');
             
        },
        
        
        /* Adds the effect to the timeline
         * ---------------------------------------------------------------------- */
        
        addEffect: function (e) {
            e.preventDefault();
            var filterName = e.currentTarget.getAttribute('href');
            var effect = window.App.timeline.collection.findWhere({name: filterName});
            if (effect) {
                e.currentTarget.offsetParent.className = 'off';
                var m = window.App.timeline.collection.findWhere({name: filterName});
                m.destroy();
            } else {
                e.currentTarget.offsetParent.className = 'on';
                var layer = new Layer({type: "effect", name: filterName, frames: 5000});
                window.App.timeline.collection.add(layer);
            }
        },
        
        
        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
