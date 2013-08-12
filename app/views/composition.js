/**
 * Project Touch
 *
 * @date: 8/07/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function(Backbone, _) {

	'use strict';

	return Backbone.View.extend({

        id: 'composition',
		el: '#composition',

		events: {
			'click .play': 'onPlayClick',
			'click .stop': 'onStopClick'
		},

		initialize: function() {
			_.bindAll(this, 'onPlayClick', 'onStopClick');
		},

		render: function() {
			return this;
		},

		onPlayClick: function(e) {
			window.App.timeline.play();
		},

		onStopClick: function(e) {
			window.App.timeline.stop();
		}
	});
});
