/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

requirejs.config({
    waitSeconds: 1,
    paths: {
        "backbone": ["//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min", "libs/backbone/backbone-min"],
        "underscore": ["//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min", "libs/underscore/underscore-min"],
        "jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min", "libs/jquery/jquery.min"],
        "hammer": ["//cdnjs.cloudflare.com/ajax/libs/hammer.js/1.0.5/hammer.min", "libs/hammerjs/dist/hammer.min"],
        "stats": ["libs/stats.js/build/stats.min"]
    },
    shim: {
        "underscore": {
            exports: "_"
        },

        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "stats": {
            exports: "Stats"
        },
        "jquery-ui": {
            exports: "$",
            deps: ['jquery']
        }
    }
});

//Enforce loading global libraries first
require(['backbone', 'underscore', 'hammer', 'stats'], function (PT) {

    require(['app/project-touch'], function (PT) {

        'use strict';

        window.log = Function.prototype.bind.call(console.log, console);

        window.App = new PT({
            el: document.querySelector('.video')
        });
        window.App.render();

    });

});
