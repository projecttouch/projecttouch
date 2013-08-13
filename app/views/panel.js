/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    return Backbone.View.extend({

        tagName: 'section',
        className: 'ui-panel',
        
        initialize: function () {
          if (this.el) {
              this.ul = this.el.querySelector('ul');
          }  
        },

        render: function () {
            
            switch (this.options.position) {
            case "left":
            case "right":
                this.el.classList.add(this.options.position);
                break;
            default:
                this.el.classList.add("left");
            }

            var title = document.createElement('h2');
            title.innerHTML = this.options.title;
            this.el.appendChild(title);
            
            this.ul = document.createElement('ul');
            this.el.appendChild(this.ul);
            
            return this;

        }

    });

});
