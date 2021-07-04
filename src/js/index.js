import Calculator from '../modules/Calculator'; // 导入Calculator模块，类似java引入其他类

// 入口文件，也是一个模块
;((doc) => {
    const oCalculator = doc.getElementsByClassName('J_calculator')[0];

    // 一个模块必须有一个init函数，用来初始化
    const init = () => {
        new Calculator(oCalculator).init(); // 实例化Calculator类,并执行类的init()方法
    }

    // 执行init
    init();
})(document)