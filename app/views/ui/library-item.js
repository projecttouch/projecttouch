/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(["app/views/player", "app/filters"], function (Player, Filter) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'li',
        className: 'library-item',
        template: _.template('\
	            <h3><%= filename %></h3>\
	            <button class="add">Add</button>\
	      '),

        events: {
            'click .add': 'add',
            'click .play': 'play',
            'click .edit': 'edit'
        },

        initialize: function () {
            _.bindAll(this, 'addThumb');
            log('new library item:',this.options.model.get('file').name);            
            this.options.model.on('change:thumb', this.addThumb, this);
        },

        render: function () {
            
            var templateResult = this.template({
                    filename: this.options.model.get('file').name.substr(0,this.options.model.get('file').name.indexOf('.'))
                });
                
            this.$el.addClass(this.options.model.get('file').type.substr(0,this.options.model.get('file').type.indexOf('/')));
            this.$el.attr('data-id', this.options.model.cid);
            this.$el.html(templateResult);

            return this;
        },

        add: function () {
            this.options.model.collection.trigger('layer', this.options.model);
        },

        play: function () {
            log('play');
            var video = document.createElement('video');
            video.src = this.options.model.get('blob');

            this.$el.find('img')
                .after(video);

            video.play();
        },
        edit: function () {
            log('edit');
            $('#library').slideUp(500, function(){
                $('#edit').slideDown(500);
            });
        },

        addThumb: function () {
            this.el.style.backgroundImage = 'url(' + this.options.model.get('thumb') + ')';
        }

    });

});
