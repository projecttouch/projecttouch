/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define(['app/models/library'], function (Model) {

    'use strict';

    return Backbone.Collection.extend({

        model: Model,

        initialize: function () {
            this.on('layer', function (model) {

                window.App.timeline.collection.add({
                    type: model.get('type'),
                    media: model
                });    
           
                
            });
        },

        add: function (model) {
            var exist = 0;
            _.each(this.models, function (m) {
                if (model.get('file').name === m.get('file').name && model.get('file').size === m.get('file').size && model.get('file').type === m.get('file').type) {
                    exist += 1;
                    //                    this.trigger('add', m);
                }
            }, this);

            if (exist === 0) {
                Backbone.Collection.prototype.add.apply(this, arguments);
            }
        }

    });

});
