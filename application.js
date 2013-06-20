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
        "jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min", "libs/jquery-2.0.2.min"]
    },
    shim: {
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require(['app/project-touch'], function (PT) {

    'use strict';

    window.App = new PT({el: document.querySelector('body')});
    window.App.render();

});
