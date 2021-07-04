// webpack配置文件
// 一般所有的plugin结尾的插件都需要导入，所有的loader结尾的插件都不需要导入
const HtmlWepackPlugin = require('html-webpack-plugin');
const path = require('path'); //解决绝对路径
module.exports = {
    mode: 'development', // development || production, 打包模式
    entry: {    // 入口文件，可以有多个
        index: path.resolve(__dirname, './src/js/index.js'), // 第一个入口文件为当前项目下的src目录下的js目录下的index.js文件
        // list: path.resolve(__dirname, './src/js/list.js') // 第二个入口文件为当前项目下的src目录下的js目录下的list .js文件
        // jquery: path.resolve(__dirname, './src/js/jquery.min.js')
    },
    output: { // 输出文件，即打包后的文件和其地址
        path: path.resolve(__dirname + '/dist'), // 打包到哪个文件夹下, 打包到当前项目下的dist文件夹下的js/[name].js文件中
        filename: 'js/[name].js', // 打包到哪个文件，没有会创建对应的文件,这个name一般默认和入口文件的文件名保持一致
    }, 
    module: { // webpack的配置内容
        rules: [{    // 打包规则配置，安装在package.json的devDependencies中的插件，经过这里的配置后，才能生效使用
            test: /\.js$/,   // test用来匹配一个文件的后缀名, 这里是处理js文件
            loader: 'babel-loader',   // 使用哪个插件
            exclude: path.resolve(__dirname, 'node_modules'),    // 排除某些文件或文件夹, 排除当前项目下的node_modules目录
        }, {
            test: /\.css$/,  // 处理css文件
            use: [  // 当使用多个loader时，使用use, 接数组, 里面的编译顺序是竖着写由下到上、横着写从右到左, 先经过css-loader, 再经过style-loader
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.tpl$/, // 处理模板文件
            loader: 'ejs-loader',
            options: { // 新版的ejs-loader需要在这里提供options和variable, 否则会报‘To support the 'esModule' option, the 'variable' option must be passed to avoid 'with' statements’， 参考https://developer.aliyun.com/mirror/npm/package/ejs-loader
                variable: 'data',
                interpolate : '\\{\\{(.+?)\\}\\}',
                evaluate : '\\[\\[(.+?)\\]\\]'
            }
        }]
    },
    plugins: [   // 装的是实例化对象，实例化导入的插件
        new HtmlWepackPlugin({
            filename: 'index.html', // 打包后的文件名
            template: path.resolve(__dirname, './src/index.html'), // 打包谁，打包当前目录下的src目录下的index.html文件
            chunks: [   // 入口文件，即打包哪些入口文件
                // 'jquery',
                'index'
            ],
            excludeChunks: [ // 排除哪些文件不进行打包
                'node_modules'
            ]
        })
    ],
    devServer: { // devServer为固定名称不能乱写
        open: true, //在第一次启动后自动打开浏览器
        host: 'localhost', //主机地址
        port: 8080, // 主机端口号
    }
}