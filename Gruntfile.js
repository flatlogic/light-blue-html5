module.exports = function(grunt) {
    "use strict";
    var ENV = grunt.option('env') || 'development'; // pass --env=production to compile minified css

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            target: grunt.option('target') || 'html-transparent', // pass --target=html-transparent. possible targets: html-transparent, html-white
            srcFolder: '<%= config.target %>/src',
            distFolder: '<%= config.target %>/dist'
        },


        //compiles handlebars template to html
        'compile-handlebars': {
            dynamicTemplateData: {
                preHTML: '<!-- <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> -->\n',
                template: '<%= config.srcFolder %>/*.hbs',
                partials: '<%= config.srcFolder %>/partials/*.hbs',
                templateData: {
                },
                output: '<%= config.distFolder %>/*.html'
            }
        },

        compass: {
            dist: {
                options: {
                    config: '<%= config.target %>/config.rb',
                    sassDir: '<%= config.srcFolder %>/sass',
                    cssDir: '<%= config.distFolder %>/css',
                    environment: ENV
                }
            },
            dev: {
                options: {
                    config: '<%= config.target %>/config.rb',
                    sassDir: '<%= config.srcFolder %>/sass',
                    cssDir: '<%= config.distFolder %>/css'
                }
            }
        },

        //rename minified scss files
        rename: {
            css: {
                src: '<%= config.distFolder %>/css/application.css',
                dest: '<%= config.distFolder %>/css/application.min.css'
            }
        },

        clean: {
            images: ['<%= config.distFolder %>/img'],
            scripts: ['<%= config.distFolder %>/js'],
            server: ['<%= config.distFolder %>/server'],
            libs: ['<%= config.distFolder %>/lib'],
            all: ['<%= config.distFolder %>']
        },

        //copy images & other static assets
        copy: {
            images: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'img/**',
                dest: '<%= config.distFolder %>/'
            },
            scripts: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'js/**',
                dest: '<%= config.distFolder %>/'
            },
            json: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'js/*.json',
                dest: '<%= config.distFolder %>/'
            },
            server: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'server/**',
                dest: '<%= config.distFolder %>/'
            },
            libs: {
                expand: true,
                cwd: 'bower_components',
                src: '**/*.js',
                dest: '<%= config.distFolder %>/lib/',

                //copy js files from bower_packages only if they are not sources
                filter: function(filepath){
                    return filepath.indexOf('src') == -1;
                }
            },
            fontGoogle: {
                expand: true,
                cwd: '<%= config.srcFolder %>/sass/',
                src: 'fonts/**',
                dest: '<%= config.distFolder %>/css/'
            },
            fontBootstrap: {
                expand: true,
                cwd: 'bower_components/bootstrap-sass-official/assets',
                src: 'fonts/**',
                dest: '<%= config.distFolder %>/css/'
            },
            fontAwesome: {
                expand: true,
                cwd: 'bower_components/font-awesome/fonts',
                src: '**/*.*',
                dest: '<%= config.distFolder %>/css/fonts/font-awesome'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.srcFolder %>',
                    src: 'js/**/*.js',
                    dest: '<%= config.distFolder %>/'
                }]
            }
        },

        watch: {
            templates: {
                files: ['<%= config.srcFolder %>/*.hbs', '<%= config.srcFolder %>/partials/*.hbs'],
                tasks: ['compile-handlebars']
            },
            sass: {
                files: ['<%= config.srcFolder %>/sass/**.scss', '<%= config.srcFolder %>/sass/**.sass'],
                tasks: ['dist-compass']
            },
            scripts: {
                files: ['<%= config.srcFolder %>/js/**.js', '<%= config.srcFolder %>/js/**.json'],
                tasks: ['dist-scripts']
            },
            images: {
                files: ['<%= config.srcFolder %>/img/**'],
                tasks: ['clean:images', 'copy:images']
            },
            server: {
                files: ['<%= config.srcFolder %>/server/**'],
                tasks: ['clean:server', 'copy:server']
            },
            libs: {
                files: ['bower_components/**'],
                tasks: ['dist-libs']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //minify scripts for production environment or just copy for development
    grunt.registerTask('dist-scripts', ['clean:scripts', 'copy:json', ENV == 'production' ? 'uglify' : 'copy:scripts']);

    //assembles minified version first, renames it to application.min.css, assembles normal version
    grunt.registerTask('dist-compass', ['compass:dist', 'rename:css', 'compass:dev', 'copy:fontAwesome', 'copy:fontGoogle', 'copy:fontBootstrap']);
    grunt.registerTask('dist-compass1', ['copy:fontBootstrap']);

    //assemble html files
    grunt.registerTask('dist-templates', ['compile-handlebars']);

    //copy images & server blocks
    grunt.registerTask('dist-misc', ['clean:images', 'copy:images', 'clean:server', 'copy:server']);

    //copy libs
    grunt.registerTask('dist-libs', ['clean:libs', 'copy:libs']);

    grunt.registerTask('dist-watch', ['watch']);

    // Default task(s)
    grunt.registerTask('default', ['clean:all', 'dist-templates', 'dist-compass', 'dist-scripts', 'dist-libs', 'dist-misc']);

};