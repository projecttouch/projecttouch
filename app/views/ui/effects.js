/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 'app/filters'], function (Panel, Filter) {

    return Panel.extend({

        id: 'effects',
        el: '#effects',

        events: {
            "click ul a": "toggleEffect"
//            'change input': 'handleFileSelect'

        },
        toggleEffect: function(e){
            e.preventDefault();
            var currentLiClassname = e.currentTarget.offsetParent.className;
            this.$el.find('ul li').removeClass('on').addClass('off');
            if(currentLiClassname.indexOf('on') !== -1){
                //turn it off
                window.App.filter = null;
            }else{
                //add new filter
                var filterName = e.currentTarget.getAttribute('href');
                e.currentTarget.offsetParent.className = 'on';
                window.App.filter = Filter[filterName];
            }
        },
        initialize: function () {
            Panel.prototype.initialize.call(this);
            for (var f in Filter) {
                this.$el.find('ul').append('<li class="off"><span></span><img data-effect="' + f + '" ><a href="' + f + '">' + f + '</a></li>');
            }
//            var Collection = require('app/collections/library')
//            this.collection = new Collection();
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        },

        updateThumbs: function(thumb){
            var lis = this.$el.find('ul li');
            var img;
            for(var x = 0, _len = lis.length; x < _len; x++){
                img = '<img src="' + thumb + '"/>';
                lis[x].append(img);
            }
        }

    });

});
