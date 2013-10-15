/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define(['app/models/layer', 'app/filters'], function (Model, Filter) {

    'use strict';

    return Backbone.Collection.extend({

        model: Model,
        totalFrames: 5000,

        getActive: function () {

            var targetModel = [],
                position = 99999;

            _.each(this.where({type:'video'}), function (model) {

                if (model.get('status') === 'playing' || model.get('status') === 'seeking') {

                    targetModel.push(model);

                } 
                
            }, this);

            return targetModel;

        },

        getFilter: function (frame) {
            var effects, len, x, trim, offset, endEffect, startEffect;
            effects = this.where({type: 'effect'});
            len = effects.length;
            if (len === 0) {
                return null;
            }
            for (x = 0; x < len; x = x += 1) {
                
                trim = effects[x].get('trim');
                offset = effects[x].get('offset');
                endEffect = effects[x].get('frames') + offset - trim.end;
                startEffect = trim.start + offset;
                if (frame >= startEffect && frame <= endEffect) {
                    return Filter[effects[x].get('name')];
                }
                if (x === (len - 1)) {
                    return null;
                }
                
            }
            return null;
        }

    });

});
