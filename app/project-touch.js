/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require, console  */

define(['backbone', 
        'app/views/player', 
        'app/filters', 
        'app/views/ui/library',
        'app/views/ui/effects', 
        'app/controllers/timeline',
        'app/views/ui/timeline',
		'app/views/composition'], function (Backbone) {

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

            //setInterval(this.getRGB, 600);
        },

        render: function () {

            var Library = require('app/views/ui/library'),
                Effects = require('app/views/ui/effects'),
                Timeline = require('app/views/ui/timeline');

            this.views.library = new Library({title:'My Content', position:'left'});
            this.el.appendChild(this.views.library.render()
                .el);
                
            this.views.effects = new Effects({title:'My Effects', position:'right'});
            this.el.appendChild(this.views.effects.render()
                .el);
                
            this.views.timeline = new Timeline({el:document.querySelector('footer')});
            
            this.composition.el.appendChild(this.player.render()
                .el);
        }

//        handler: function (e) {
//
//            var className = e.currentTarget.getAttribute('class');
//
//            switch (className) {
//            case "play":
//                this.timelineController.play();
//                e.currentTarget.setAttribute('class', 'pause');
//                break;
//            case "pause":
//
//                e.currentTarget.setAttribute('class', 'play');
//                break;
//            case "stop":
//                if (document.querySelector('.pause')) {
//                    this.timelineController.stop();
//                    document.querySelector('.pause')
//                        .setAttribute('class', 'play');
//                }
//                break;
//
//            case "grayscale":
//            case "threshold":
//            case "pixelize":
//            case "red":
//            case "green":
//            case "contrast":
//            case "hipster":
//                if (this.filter === Filters[className]) {
//                    console.log('disabling filter', className);
//                    this.filter = null;
//                } else {
//                    console.log('enabling filter', className);
//                    this.filter = Filters[className];
//                }
//                break;
//
//            }
//        }
    });
});
