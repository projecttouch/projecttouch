/* Microsoft Video Editor
 * @author: T.M.P. Kleist / Code D'azur <thierry@codedazur.nl>
 * ============================================================================== */

/*global views, console, $, define  */

define(['app/views/panel',
    'app/views/ui/library-item',
    'app/collections/library',
    'app/models/library'], function (Panel) {

    return Panel.extend({

        id: 'library',
        el: '#library',

        events: {
            'change input': 'handleFileSelect',
            'click .file-selector': 'handleFileSelect'
        },


        initialize: function () {
            Panel.prototype.initialize.call(this);
            var Collection = require('app/collections/library');
            this.collection = new Collection();
            this.collection.on('add', this.add, this);

            _.bindAll(this, 'handleFileSelect', 'add');
        },


        render: function () {
            Panel.prototype.render.call(this);

            var li = document.createElement('li'),
                form = document.createElement('form'),
                input = document.createElement('input');

            li.classList.add('file-selector');
            input.setAttribute('type', 'file');
            input.setAttribute('name', 'file-upload');

            form.appendChild(input);
            li.appendChild(form);

            this.ul.appendChild(li);
            this.delegateEvents();

            return this;
        },


        handleFileSelect: function (evt) {

            var files,
                Model = require('app/models/library');

            if (evt.type === 'change') {
                files = evt.target.files;
            } else if (evt.dataTransfer) {
                files = evt.dataTransfer.files;
                evt.preventDefault();
                evt.stopPropagation();
            } else {
                console.warn('no files found in the event', evt);
            }

            _.each(files, function (file) {

                this.collection.add(new Model({
                    file: file
                }));

            }, this);

        },
        

        add: function (model) {
            var LibraryItem = require('app/views/ui/library-item'),
                item = new LibraryItem({
                    model: model
                });

            if (this.ul.getElementsByTagName("li").length > 1) {
                this.ul.insertBefore(item.render().el, this.ul.getElementsByTagName("li")[1]);        
            } else {
                this.ul.appendChild(item.render().el);
            }
            
            this.delegateEvents();
        }

    });

});
