/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

requirejs.config({
    waitSeconds: 1,
    paths: {
        "backbone": ["//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min", "libs/backbone-1.0.0.min"],
        "underscore": ["//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min", "libs/underscore-1.4.4.min"],
        "jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min", "libs/jquery-2.0.2.min"],
        "hammer": ["//cdnjs.cloudflare.com/ajax/libs/hammer.js/1.0.5/hammer.min", "libs/hammer-1.0.5.min"],
        "stats": ["libs/stats.min"]
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
        }
    }
});

require(['app/project-touch', 'hammer', 'stats'], function (PT) {

    'use strict';

    var console = window.console
    if (!console) return

    function intercept(method) {
        var original = console[method]
        window[method] = function () {
            if (original.apply) {
                original.apply(console, arguments)
            } else {
                var message = Array.prototype.slice.apply(arguments)
                    .join(' ')
                original(message)
            }
        }
    }
    var methods = ['log', 'warn', 'error']
    for (var i = 0; i < methods.length; i++) {
       intercept(methods[i]); 
    }

    window.App = new PT({
        el: document.querySelector('.video')
    });
    window.App.render();

});
