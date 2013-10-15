/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

Number.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second parm
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
}

define(['app/views/player', 
        'app/filters',
        'app/utils', 
        'app/views/ui/library', 
        'app/views/ui/effects', 
        'app/views/ui/edit', 
        'app/controllers/timeline', 
        'app/views/ui/timeline', 
        'app/views/composition'], function () {

    'use strict';

    return Backbone.View.extend({

        filter: null,

        initialize: function () {
            
            var self = this,
                Timeline = require('app/controllers/timeline'),
                Player = require('app/views/player'),
                Filter = require('app/filters'),
                Utils = require('app/utils'),
                Composition = require('app/views/composition');

            this.views = {};
            this.player = new Player();
            this.timeline = new Timeline();
            this.composition = new Composition();
            this.utils = Utils;
            
            this.R = 1;
            this.G = 1;
            this.B = 1.3;

        },

        render: function () {
            var Library = require('app/views/ui/library'),
                Effects = require('app/views/ui/effects'),
                Edit = require('app/views/ui/edit'),
                Timeline = require('app/views/ui/timeline');

            this.views.library = new Library({
                position: 'left'
            });
            
            this.views.timeline = new Timeline();
            
            this.views.edit = new Edit({
                position: 'left',
                collection: this.views.timeline.collection
            });

            this.views.effects = new Effects({
                position: 'right',
                collection: this.views.timeline.collection
            });
            
            
            this.composition.el.appendChild(this.player.render().el);
            $('#player').height($('#player').width() / 1.7778);

        }

    });
});
