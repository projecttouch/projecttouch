/**
 * Microsoft Video Editor
 *
 * @namespace collections
 * @name media
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, define  */

define(['backbone', 'underscore', 'app/models/layer'], function (Backbone, _, Model) {

    'use strict';

    return Backbone.Collection.extend({

        model: Model,
        totalFrames: 5000,

        getActive: function () {

            var targetModel = [],
                position = 99999;

            _.each(this.models, function (model) {

                if (model.get('status') === 'playing') {

                    targetModel.push(model);

                } else if (model.get('status') === 'seeking') {

                    if (model.get('position') < position) {
                        targetModel.push(model);
                       position = model.get('position');
                    }

                }
            }, this);

            return targetModel;

        }

    });

});
