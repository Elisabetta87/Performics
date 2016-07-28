module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            main: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {                         // Dictionary of files
                    'Performics/style/performics.css': 'Performics/style/performics.scss'      // 'destination': 'source'
                }
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            style: {
                files: [{
                    expand: true,
                    cwd: 'Performics/style',
                    src: ['*.css', '!*.min.css'],
                    dest: 'Performics/style',
                    ext: '.min.css'
                }]
            }
        },


        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 5 versions', 'ie 9']
                    })
                ]
            },
            style: {
                src: 'Performics/style/performics.css'
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-postcss');



    grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);

    grunt.registerTask('style', ['sass', 'postcss', 'cssmin']);


};