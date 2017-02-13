'use strict';


module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*',
        '!grunt-cdnify']});


    var serveStatic = require('serve-static');

    grunt.initConfig({
        pkg: pkg,
        copy: {
                files: {
                    cwd: 'src',
                    src: 'index.html',
                    dest: 'dist',
                    expand: true
                }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*js'],
                dest: 'dist/app.js'
            }
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    protocol: 'http',
                    hostname: '*',
                    base: 'dist/',
                    keepalive: true,
                    open: false
                    ,
                    middleware: function(connect) {
                        return [
                            connect().use('/bower_components',
                                serveStatic('./bower_components')),
                            serveStatic('dist')    
                        ];
                    }
                }
            }
        },
        ngtemplates: {
            [pkg.name]: {
                cwd: 'src',
                src: '*/*.html',
                dest: 'src/templates.js',
                options: {
                    htmlmin:  { 
                        collapseWhitespace: true, 
                        collapseBooleanAttributes: true 
                    }
                }
            }
        }
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', [
        'copy',
        'ngtemplates',
        'concat',
        'connect'
    ]);

};

