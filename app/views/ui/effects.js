/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

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
                this.$el.find('ul').append('<li class="off" data-effect="' + id + '"><span></span><a href="' + id + '">' + id + '</a></li>');
            }, this);

            this.options.collection.on('add open', this.reloadEffects, this);
        },


        /* Reloads the effect preview for the current video model
         * ---------------------------------------------------------------------- */

        reloadEffects: function (model) {

            if (model.get('type') === "video") {

                var self = this,
                    video = document.createElement('video');

                video.addEventListener('loadedmetadata', function () {
                    window.App.utils.captureAsCanvas(video, {
                        width: 280,
                        height: 155,
                        time: parseInt(video.duration / 2)
                    }, function (canvas) {

                        var ctx = canvas.getContext('2d'),
                            src,
                            pixels,
                            newPixels,
                            newCanvas,
                            ctx2;

                        $('#effects li').each(function (index, li) {
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

            }

        },


        /* Adds the effect to the timeline
         * ---------------------------------------------------------------------- */

        addEffect: function (e) {
            e.preventDefault();
            e.currentTarget.offsetParent.className = 'on';

            window.App.timeline.collection.add(new Layer({
                type: "effect",
                name: e.currentTarget.getAttribute('href'),
                frames: 5000
            }));

        },


        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
