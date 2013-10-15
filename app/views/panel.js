/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define([], function() {

    return Backbone.View.extend({

        tagName: 'section',
        className: 'ui-panel',

        initialize: function() {
            if (this.el) {
                this.ul = this.el.querySelector('ul');
            }
        },

        render: function() {

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
