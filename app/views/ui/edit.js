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
            var levels = [new Level({id: 'scale', title:'Scale'}), new Level({id: 'rotation', title: 'Rotation'}), new Level({id: 'vignette', title: 'Vignette'}), new Level({id: 'audioLevel', title: 'Audio level'})];
            _.each(levels, this.addLevel);
        },
        events: {
          "click #btnCloseEdit": "closeEdit"
        },

        closeEdit: function(){
            $('#edit').slideUp(500, function () {
                $('#library').slideDown(500);
            });
        },

        addLevel: function(model){
            var title = document.createElement('h3');
            title.appendChild(document.createTextNode(model.get('title')));
            var levelView = new LevelView({model: model});
            this.$el.append(title);
            this.$el.append(levelView.render().el);
            model.on('change', function(){
                console.log(this.get('id'), this.get('level'));
            });
        },

        render: function () {
            Panel.prototype.render.call(this);
            return this;
        }

    });

});
