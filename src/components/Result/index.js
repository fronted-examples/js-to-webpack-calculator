// 出口文件，为组件的类
import tpl from './index.tpl' // 导入模板

export default class ResultComponent {
    constructor () {
        this.name = 'ResultComponent'; // 组件的名称
    }

    // 需要把当前组件包到一个div中去，这样它就会在一个div节点里，之后可以在主模块里去使用appendChild()把当前组件插到主模块里
    // 首先创建一个div元素
    tpl () {
        const oDiv = document.createElement('div');
        oDiv.innerHTML = tpl(); // tpl实际上是导入进来的一个函数，这步操作就是将当前Result的tpl模板包入到一个div中
        return oDiv; // 因为在父组件中需要拿到当前组件的div,所以这里必须返回出去
    }
}

// tpl()实际为：
// 所以必须使用tpl()执行之后，字符串才会以html的格式存放在div中
// function tpl () {
//     return '';
// }