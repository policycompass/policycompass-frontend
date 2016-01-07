
module.exports = function(grunt) {

    var js_src = ['app/config.js', 'app/app.js', 'app/modules/**/*.js', 'app/modules/*.js'];
    var css_src = ['app/css/**/*.css', 'app/css/*.css'];
    var js_dest = 'app/dest/js/';
    var css_dest = 'app/dest/css/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: js_src,
            options: {
                node: true,
                browser: true,
                jquery: true,
                loopfunc: true,
                globals: {
                    console: true,
                    module: true,
                    angular: true,
                    streetlife: true
                }
            }
        },
        concat: {
            options: {
                stripBanners: true
            },
            js: {
                src: js_src,
                dest: js_dest + '<%= pkg.name %>.js'
            },
            css: {
                src: css_src,
                dest: css_dest + '<%= pkg.name %>.css'
            }
        },
        bower_concat: {
            all: {
                dest: js_dest + 'dependencies.js',
                cssDest: css_dest + 'dependencies.css',
                exclude: ['Leaflet.Pancontrol']
            }
        },
        uglify: {
            options: {
                banner: '',
                mangle: false
            },
            all: {
                files: {
                    '<%= concat.js.dest %>': ['<%= concat.js.dest %>'],
                    '<%= bower_concat.all.dest %>': ['<%= bower_concat.all.dest %>']
                }
            }
        },
        cssmin: {
            all: {
                files: {
                    '<%= concat.css.dest %>': ['<%= concat.css.dest %>'],
                    '<%= bower_concat.all.cssDest %>': ['<%= bower_concat.all.cssDest %>']
                }
            }
        },
        injector: {
            options: {
                destFile: 'app/index.html',
                ignorePath: 'app/',
                relative: false,
                addRootSlash: false
            },
            prod: {
                src: ['<%= bower_concat.all.dest %>', '<%= bower_concat.all.cssDest %>', '<%= concat.js.dest %>', '<%= concat.css.dest %>']
            },
            dev: {
                src: ['bower.json', '<%= concat.js.src %>', '<%= concat.css.src %>']

            }

        },
        clean: {
            all: ['<%= concat.js.dest %>', '<%= concat.css.dest %>', '<%= bower_concat.all.dest %>', '<%= bower_concat.all.cssDest %>']
        },
        copy: {
            fonts: {
                expand: true,
                cwd: 'app/fonts/',
                src: ['*.woff', '*.ttf'],
                dest: 'app/dest/fonts'
            },
            images: {
                expand: true,
                src: ['**'],
                cwd: 'app/img/',
                dest: 'app/dest/img'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        removelogging: {
            dist: {
                src:  js_dest + '<%= pkg.name %>.js',
                dest:  js_dest + '<%= pkg.name %>.js'
            }
        },
        bower: {
            install: {
                options: {
                    copy: false
                }
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            }
        },
        compass: {
            dev: {
                options: {
                    watch: true
                }
            },
            prod: {
                options: {
                    watch: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('test', ['jshint','watch']);
    grunt.registerTask('dev', ['bower:install', 'injector:dev', 'compass:prod']);
    grunt.registerTask('watch', ['compass:dev']);
    grunt.registerTask('prod', ['bower:install','clean', 'concat', 'bower_concat','removelogging', 'cssmin', 'injector:prod', 'copy']);
    grunt.registerTask('default', ['dev']);
};
