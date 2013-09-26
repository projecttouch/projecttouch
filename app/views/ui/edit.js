/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/panel', 'app/views/ui/edit-level', 'app/models/level'], function (Panel, LevelView, Level) {

    return Panel.extend({

        id: 'edit',
        el: '#edit',
        initialize: function () {
            Panel.prototype.initialize.call(this);
            _.bindAll(this, 'addLevel');
            var levels = [new Level({title:'Scale'}), new Level({title: 'Rotation'}), new Level({title: 'Vignette'}), new Level({title: 'Audio level'})];
            _.each(levels, this.addLevel);
        },

        addLevel: function(model){
            var levelView = new LevelView({model: model});
            this.$el.append(levelView.render().el);
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
