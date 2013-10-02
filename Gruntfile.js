module.exports = function (grunt) {

    grunt.initConfig({
        clean:{
            tmp:["tmp/"],
            'tmp-js':["tmp/deploy/libs","tmp/deploy/app","tmp/deploy/application.js"],
            //Due to the current setup we have to manually remove files that should not be published
            'tmp-files-in-root':[
                "tmp/deploy/node_modules",
                "tmp/deploy/bower.json",
                "tmp/deploy/build.js",
                "tmp/deploy/config.rb",
                "tmp/deploy/Gruntfile.js",
                "tmp/deploy/package.json",
                "tmp/deploy/*.iml",
                "tmp/deploy/readme.md"
            ],
            sass: ["styles/**/*.sass"]
        },

        copy:{
            tmp:{
                expand:true, src:['**'], dest:'tmp/deploy/'
            },

            'persistent-files': {
                files: [
                    { src: 'libs/backbone/backbone-min.js', dest: 'tmp/deploy/libs/backbone/backbone-min.js' },
                    { src: 'libs/hammerjs/dist/hammer-min.js', dest: 'tmp/deploy/libs/hammerjs/dist/hammer-min.js' },
                    { src: 'libs/jquery/jquery.min.js', dest: 'tmp/deploy/libs/jquery/jquery.min.js' },
                    { src: 'libs/requirejs/require.js', dest: 'tmp/deploy/libs/requirejs/require.js' },
                    { src: 'libs/stats/build/stats.min.js', dest: 'tmp/deploy/libs/stats/build/stats.min.js' },
                    { src: 'libs/underscore/underscore-min.js', dest: 'tmp/deploy/libs/backbone/underscore-min.js' }
                ]
            }
        },

        requirejs:{
            compile:{
                options:{
                    baseUrl:'.',
                    mainConfigFile:"application.js",
                    name:'application',
                    out:'tmp/deploy/application.min.js',
                    findNestedDependencies: true,
                    useStrict: true,
                    waitSeconds: 3,
                    paths: {
                        backbone: "empty:",
                        underscore: "empty:",
                        jquery: "empty:",
                        hammer: "empty:"
                    }
                }
            }
        },

        replace:{
            min:{
                src:['tmp/**/*.html'],
                overwrite:true,
                replacements:[
                    {
                        from:'application',
                        to:'application.min'
                    }
                ]
            }
        },

        concurrent:{
            dev:['connect:dev', 'watch:dev']
        },

        connect:{
            dev:{
                options:{
                    keepalive:true,
                    open:true,
                    port:9000,
                    base:''
                }
            },
            deploy:{
                options:{
                    keepalive:true,
                    open:true,
                    port:9001,
                    base:'tmp/deploy/'
                }
            }
        },

        watch:{
            dev:{
                files:'**/*',
                options:{
                    livereload:true
                }
            }
        },

        htmlmin: {
            deploy: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'tmp/deploy/index.html': 'tmp/deploy/index.html'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('default', ['deploy']);

    grunt.registerTask('serve', ['concurrent:dev']);

    grunt.registerTask('deploy', ['clean:tmp', 'copy:tmp', 'clean:tmp-js', 'clean:tmp-files-in-root',
                                  'copy:persistent-files', 'requirejs', 'replace:min', 'htmlmin:deploy']);

    grunt.registerTask('deploy:local', ['deploy', 'connect:deploy']);
};