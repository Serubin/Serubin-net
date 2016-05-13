module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            main: {
                options: {
                    outputStyle: 'compressed',
                },
                files: {
                    'assets/css/style.css': 'assets/scss/style.scss'
                }
            }
        },
        copy: {
            jquery: {
                src: 'bower_components/jquery/dist/jquery.min.js', 
                dest: 'assets/js/lib/1_jquery.min.js'
            },
            skel_js: {
                src: 'bower_components/skel/dist/skel.min.js', 
                dest: 'assets/js/lib/skel.min.js'
            },
            skel_scss: {
                src: 'bower_components/skel/dist/_skel.scss', 
                dest: 'assets/scss/lib/_skel.scss'
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            lib: {
                src: 'assets/js/lib/*.min.js',
                dest: 'assets/js/lib.min.js'
            }
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['build']
            },
            sass: {
                files: ['assets/scss/*.scss', 'assets/scss/skel/*.scss', 'assets/js/main.js'],
                tasks: ['build']
            }
        },
        clean: {
            options: { 
                force: true 
            },
            sass: {
                src: [ 'assets/css/style.css' ]
            },
            js: {
                src: [ 'assets/js/*.min.js' ]
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ['JQuery']
                }
            },
            main: {
                files: {
                    'assets/js/lib/jquery.scrollspy.min.js': ['assets/js/lib/jquery.scrollspy.js'],
                    'assets/js/main.min.js': ['assets/js/main.js', 'assets/js/util.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['clean','copy','uglify','concat','sass']);
    grunt.registerTask('default', ['build','watch']);
}

