## 配置完webpack.config.js后，要在package.json中的"scripts"中配置运行命令
#### npm run dev
```"dev": "webpack-dev-server --config webpack.config.js --reason --color --progress"```
* webpack-dev-server表示采用webpack-dev-server环境运行项目
* --config 后表示采用webapck.config.js文件中的配置
* --reason 表示输出打包的信息
* --color 表示打包的时候输出彩色文字
* --progress 表示输出打包的进度

#### npm run build
```"build": "webpack --config webpack.config.js"```
* webpack 表示正式打包
* --config 表示采用webpack.config.js文件的配置
