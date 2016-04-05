# 用Gruntjs构建Seajs项目

准备工作

构建工具使用Grunt，不熟悉的先移步Grunt新手上路。

两个Grunt插件：

`grunt-cmd-transport`：将Seajs模块转换为Modules/Transport规范。

`grunt-contrib-concat`：合并模块。在合并模块前一定要先转换为Modules/Transport规范的模块。

`grunt-contrib-uglify`: 压缩JS

初始代码

项目目录下有build,dist,src目录，build存放构建的中间文件，dist存放最终发布的文件，src就是源码目录。

util.js

        define(function(require,exports,module){
            exports.add = function(a,b){
                return a+b
            }
        })

index.js

        define(function(require,exports,module){
            var util = require('./util/util')
            var result = util.add(1+1)
        })
要做到的目标就是合并+压缩。但是因为SesJS的一些规则，是不能直接合并的，需要先转换为符合`Modules/Transport`规范的模块。

将SesJS模块转换为Modules/Transport规范的模块。

安装`grunt-cmd-transport` ： 
        npm install grunt-cmd-transport --save-dev

Gruntfile.js中的配置

        module.exports = function(grunt){
            // 项目配置
            grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'),
                //transport的配置grunt-cmd-concat
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
                }
            });
            grunt.loadNpmTasks('grunt-cmd-transport');
            // 默认任务
            grunt.registerTask('default', ['transport']);
        }
配置好后，运行如下命令：

        grunt transport:main
执行成功后，在build文件夹下就看到了转换后的util.js和index.js,转换后的结果如下：

util.js

        define("util/util", [], function(require, exports, module) {
            exports.add = function(a, b) {
                return a + b;
            };
        });

index.js

        define("index", [ "./util/util" ], function(require, exports, module) {
            var util = require("./util/util");
            var c = util.add(1, 1);
            console.log(c);
        });
index.js和util.js中模块的id和seajs的config中的base组合后就是这个文件的URL，也就是seajs中默认的模块ID。

合并util.js和index.js

安装`grunt-contrib-concat`。

        npm install grunt-contrib-concat --save-dev

Gruntfile.js中的配置（在第二步基础上继续添加）

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
                 //concat配置
                 concat : {
                    main : {
                        files : {
                            'dist/src/index.js':['build/index.js','build/util/util.js']
                        }
                    }
                 }
            });
            grunt.loadNpmTasks('grunt-cmd-transport');
            grunt.loadNpmTasks('grunt-contrib-concat');
            // 默认任务
            grunt.registerTask('default', ['transport','concat']);
        }
配置好后，运行如下命令：

grunt concat:main
执行成功后，结果如下：

index.js

        define("index", [ "./util/util" ], function(require, exports, module) {
            var util = require("./util/util");
            var c = util.add(1, 2);
            console.log(c);
        });
        define("util/util", [], function(require, exports, module) {
            exports.add = function(a, b) {
                return a + b;
            };
        });
压缩

安`~grunt-contrib-uglify`。

        npm install grunt-contrib-uglify --save-dev

Gruntfile.js配置（接着上面继续配置）

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
运行如下命令：

        grunt uglify:main
运行成功后结果如下：

        define("index",["./util/util"],function(a){var b=a("./util/util"),c=b.add(1,2);console.log(c)}),define("util/util",[],function(a,b){b.add=function(a,b){return a+b}});

嗯，好了，完成了！就是这样的简单。
