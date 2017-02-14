'use strict';


var sharedBowerImageFolders = ['shared', 'moduleA', 'moduleB'];
var getImageSrcList = function() {
    return sharedBowerImageFolders.map(function(folder) {
        return {
            cwd: 'bower_components/' + folder + '/dist/images/',
            dest: 'dist/images',
            src: '**',
            expand: true     
        }    
    });
}

console.log(getImageSrcList());

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*',
        '!grunt-cdnify']});


    var serveStatic = require('serve-static');

    grunt.initConfig({
        pkg: pkg,
        copy: {
                html: {
                    cwd: 'src',
                    src: 'index.html',
                    dest: 'dist',
                    expand: true
                },
                images: {
                    files: getImageSrcList()
                }
                // images: {
                //     cwd: 'bower_components',
                //     src: ['**/images/**'],//getImageSrcList(),//['**/images/*.png', '**/images/*.jpg'],
                //     dest: 'dist/images',
                //     //flatten: true,
                //     expand: true
                // }
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
        },

        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html']
        },

        clean: {
            src: ['.tmp', 'dist/**/*']
            
        }
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'uglify',
        'usemin',
        'connect'
    ]);

};

