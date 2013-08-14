/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require, console  */

define(['backbone', 'app/views/player', 'app/filters', 'app/views/ui/library', 'app/views/ui/effects', 'app/controllers/timeline', 'app/views/ui/timeline', 'app/views/composition'], function (Backbone) {

    'use strict';

    return Backbone.View.extend({

        filter: null,

        initialize: function () {

            var self = this,
                Timeline = require('app/controllers/timeline'),
                Player = require('app/views/player'),
                Filter = require('app/filters'),
                Composition = require('app/views/composition');

            this.views = {};
            this.player = new Player();
            this.timeline = new Timeline();
            this.composition = new Composition();
            
            this.filter = Filter.hipster
            
            this.R = 1;
            this.G = 1;
            this.B = 1.5;

        },

        render: function () {

            var Library = require('app/views/ui/library'),
                Effects = require('app/views/ui/effects'),
                Timeline = require('app/views/ui/timeline');

            this.views.library = new Library({
                position: 'left'
            });
            this.views.effects = new Effects({
                position: 'right'
            });
            this.views.timeline = new Timeline();

            this.composition.el.appendChild(this.player.render()
                .el);
        }

    });
});
