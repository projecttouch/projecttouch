/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define(['app/views/ui/panel', 
        'app/views/ui/media', 
        'app/collections/library', 
        'app/models/media'], function (Panel) {

    return Panel.extend({

        id: 'library',

        events: {
            'change input': 'handleFileSelect',
            'click .file-selector': 'openFileSelect'
        },

        initialize: function () {
            Panel.prototype.initialize.call(this);
            var Collection = require('app/collections/library')
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
                Media = require('app/models/media');

            if (evt.type === 'change') {
                files = evt.target.files;
            } else {
                files = evt.dataTransfer.files;
                evt.preventDefault();
                evt.stopPropagation();
            }

            _.each(files, function (file) {

                if (file.type !== "video/mp4") {
                    console.warn('file must be mp4');
                } else {
                    this.collection.add(new Media({
                        file: file
                    }));
                }
            }, this);

        },

        add: function (model) {
            var Media = require('app/views/ui/media'),
                item = new Media({
                    model: model
                });
                
            this.ul.appendChild(item.render()
                .el);
            this.delegateEvents();
        }

    });

});
