module.exports = function(grunt){
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        transport: {
            options: {
                debug : false
            },
            main : {
                files : [{
                    expand : true,
                    cwd : 'src/',
                    src : '**/*.js',
                    dest : 'build/'
                }]
            }
        },
        concat : {
            main : {
                files : {
                    'dist/src/index.js':['build/index.js','build/util/util.js']
                }
            }
        },
        uglify : {
            main : {
                expand : true,
                cwd : 'dist/src',
                src : '**/*.js',
                dest : 'dist/min'
            }
        }
    });
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['transport','concat','uglify']);
}