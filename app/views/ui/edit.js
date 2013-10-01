/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 
        'app/views/ui/edit-level', 
        'app/models/level'], function (Panel, LevelView, Level) {

    'use strict';

    return Panel.extend({

        id: 'edit',
        el: '#edit',

        initialize: function () {
            Panel.prototype.initialize.call(this);
            _.bindAll(this, 'addLevel');
            var levels = [new Level({
                id: 'scale',
                title: 'Scale'
            }), new Level({
                id: 'rotation',
                title: 'Rotation'
            }), new Level({
                id: 'vignette',
                title: 'Vignette'
            }), new Level({
                id: 'volume',
                title: 'Audio level'
            })];
            
            
            this.options.collection.on("open", this.open, this);
            
            
            _.each(levels, this.addLevel);
        },

        events: {
            "click #btnCloseEdit": "closeEdit"
        },
        
        
        /* this will be triggered when a layer is selected
         * ---------------------------------------------------------------------- */
        
        open: function (model) {
            log(model);
            log(this.options.collection);
            this.layer = model;
            $('#library').slideUp(500, function () {
                $('#edit').slideDown(500);
            });
        },

        closeEdit: function () {
            $('#edit').slideUp(500, function () {
                $('#library').slideDown(500);
            });
        },

        addLevel: function (model) {
            var klass = this;
            var title = document.createElement('h3');
            title.appendChild(document.createTextNode(model.get('title')));
            var levelView = new LevelView({
                model: model
            });
            this.$el.append(title);
            this.$el.append(levelView.render().el);
            model.on('change', function () {
//                log(this.get('id'), this.get('level'));
                klass.layer.set(this.get('id'), this.get('level'));
//                log(klass.layer);
            });
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
