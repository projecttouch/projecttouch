/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

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
