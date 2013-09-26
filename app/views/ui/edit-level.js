/**
 * projecttouch
 *
 * @namespace
 * @name edit-level
 * @author rupertrutland | Code d'Azur
 * @date: 26/09/2013 10:20
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({

        tagName: 'div',
        className: 'media',

        initialize: function () {
            _.bindAll(this, 'mouseDownRight', 'trim');
            this._trim = {
                start: 0,
                end: 0
            };
        },

        render: function () {

            this.el.style.left = '0px';

            var title = document.createElement('h1');
            title.appendChild(document.createTextNode(this.model.get('title')));


            this.middle = document.createElement('div');
            this.middle.setAttribute('class', 'middle');
            this.middle.style.backgroundColor = 'rgb(0, 255, 255)';

            this.right = document.createElement('div');
            this.right.setAttribute('class', 'right');

//            this.el.appendChild(title);
            this.el.appendChild(this.middle);
            this.el.appendChild(this.right);

            this.hammertimeR = Hammer(this.right);
            this.hammertimeR.on("dragstart", this.mouseDownRight);
            this.hammertimeR.on("drag", this.trim);

            return this;

        },

        mouseDownRight: function () {
            window.App.dragging = true;
            this.paddingRightStart = parseInt(this.el.style.paddingRight) || 0;
        },

        trim: function (e) {
            var paddingRight,
                deltaX;
            //How far been dragged
            deltaX = e.gesture.deltaX;
            paddingRight = -deltaX + this.paddingRightStart;
            paddingRight = paddingRight < 0 ? 0 : paddingRight + 'px';
            this.el.style.paddingRight = paddingRight;
            this.$('.right').css('right', paddingRight);
        }


    });

});