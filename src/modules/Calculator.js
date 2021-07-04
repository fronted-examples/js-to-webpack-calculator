// import Compute from '../lib/Compute'; // 导入计算模块
import compute from '../lib/compute' // 不作为类继承，这里使用小写

import { trimSpace, digitalize } from '../utils/tools'

import ResultComponent from '../components/Result/index' // 导入ResultComponents组件
import InputGroupComponent from '../components/InputGroup/index'
import BtnGroupComponent from '../components/BtnGroup/index'


// 计算器模块, 继承Compute,Calculator方法就可以直接访问Compute里的方法，类似于java的类继承
// 由于JavaScript是单继承的，所以这里继承Compute是不合理的
// 装饰器，在这声明之后，下面的this[method](fVal, sVal);中的this不用更改，照样可以访问到相应的方法
// 因为compute中的target就是Calculator,将@compute放在这里，那么target就就等于Calculator,这里实际上是映射关系，能继续直接使用compute中的加减乘除，实际上是利用了原型继承
// 这里报错了，是因为es6,es7,装饰器都需要单独配置.babelrc文件
@compute
export default class Calculator /**extends Compute */ { // 一个类时，使用export default定义很方便, 导入时，使用import Calculator from './Calculator',不用大括号
    // 类的构造函数, el是使用new Calculator(getElementsByClassName('J_calculator')[0])的形参，这样就把dom和类结合起来，该dom就是该类的对象，拥有该类的属性和方法，类似于Java类和对象的关系
    // 每一个类都有它的构造函数，即使不声明。类的构造函数用于实例化类为一个具体的对象，类似于Java
    constructor (el) {
        this.el = el; // 保存el,因为后面要将每个组件的的tpl(),假如有三个组件，就需要使用el进行三次appendChild(),就需要三次重绘重排，不行，操作dom了。

        this.name = 'Calculator'; // 每个类都有自己的名字，这是标准

        this.resultComponent = new ResultComponent(); // 这里其实就是为了拿到tpl()方法
        this.inputGroupComponent = new InputGroupComponent();
        this.btnGroupComponent = new BtnGroupComponent();
    }

    // 每一个模块都有的init函数
    init () {
        this.render();
        this.bindEvent(); // 执行bindEvent()，执行注册事件，才会去注册对应事件，之后才能使用注册事件
    }

    defineData () {
        // let _obj = {},
        //     method = 'plus',
        //     fVal = 0,
        //     sVal = 0;
        
        const _self = this;

        // 监听拦截的功能
        // 法一：使用defineProperties
        // 这边由于this.data = this.defineData(), 所以只要进行了this.data.method或this.data.fVal或者this.data.sVal值的设定，就会进行拦截，并执行_self.setResult(_self.data.method, _self.data.fVal, _self.data.sVal);
        // 通过defineProperties定义了拦截器拦截method，fVal, sVal, 并进行了结果计算，这样就不需要下面每次input事件或者click事件都执行一次计算结果的方法，提升了性能
        // 解决功能不集中的问题
        // Object.defineProperties(_obj, {
        //     method: {
        //         get () {
        //             return method;
        //         },
        //         set (newVal) { // 拦截了fVal
        //             method = newVal;
                    
        //             _self.setResult(_self.data.method, _self.data.fVal, _self.data.sVal);
        //         }
        //     },
        //     fVal: {
        //         get () {
        //             return fVal;
        //         },
        //         set (newVal) {
        //             fVal = newVal;

        //             _self.setResult(_self.data.method, _self.data.fVal, _self.data.sVal);
        //         }
        //     },
        //     sVal: {
        //         get () {
        //             return sVal;
        //         },
        //         set (newVal) {
        //             sVal = newVal;
        //             _self.setResult(_self.data.method, _self.data.fVal, _self.data.sVal);
        //         }
        //     }
        // })

        // return _obj;

        // 法二：使用es6的Proxy()
        let target = {
            method: 'plus',
            fVal: 0,
            sVal: 0
        };

        return new Proxy(target, {
            get (target, prop) {
                return target[prop];
            },
            set (target, prop, value) {
                target[prop] = value;
                _self.setResult(_self.data.method, _self.data.fVal, _self.data.sVal);
                return true;
            }
        });
    }

    // 渲染
    // this.resultComponent.tpl(); // 这里肯定能拿到Result这个节点， 然后放到构造函数中的el参数中
    render () {
        // 解决多次重绘重排，首先声明一个文档碎片
        const oFrag = document.createDocumentFragment();
        // 然后使用文档碎片oFrag
        oFrag.appendChild(this.resultComponent.tpl());
        oFrag.appendChild(this.inputGroupComponent.tpl());
        oFrag.appendChild(this.btnGroupComponent.tpl());

        // 最后使用this.el进行appendChild(oFrag). 就一次性把所有子组件都存放到主div中了
        this.el.appendChild(oFrag);
    }

    // 绑定事件处理
    bindEvent () {
        // 需要在render()之后才能找到对应节点并注册事件，所以在这里获取对应节点
        this.oResult = this.el.getElementsByClassName('result')[0]; // el是一个dom对象引用，因此这里可以直接调用getElementsByClassName()方法获取对应的子节点
        this.oBtnGroup = this.el.getElementsByClassName('btn-group')[0];
        this.oInputs = this.el.getElementsByClassName('num-input');
        this.oBtns = this.oBtnGroup.getElementsByClassName('btn');

        // 输入算数进行计算，就需要知道，当前的算数规则是哪一个，定义一个data，默认算数规则为plus
        this.data = this.defineData();

        this.selectedIndex = 0;

        this.oBtnGroup.addEventListener('click', this.oBtnClick.bind(this /**改变this的指向，使其指向实例 */), false); // addListener()
        this.oInputs[0].addEventListener('input', this.oInput.bind(this), false);
        this.oInputs[1].addEventListener('input', this.oInput.bind(this), false);
    }

    oBtnClick (ev) {
        const e = ev || window.event, 
              target = e.target || e.srcElement, // 找到事件源
              tagName = target.tagName.toLowerCase(); // 找到事件源的标签名,即dom标签名

        if (tagName == 'button') {
            const method = target.getAttribute('data-method');

            this.setData('method', method);

            this.setBtnSelected(target);
        }
    }

    oInput (ev) {
        const e = ev || window.event, 
              target = e.target || e.srcElement, // 找到事件源
              id = target.getAttribute('data-id'),
              val = digitalize(trimSpace(target.value));
        
        this.setData(id, val);
    }

    setData (field, newVal) {
        switch (field) {
            case 'method':
                this.data.method = newVal;
                break;
            case 'fVal':
                this.data.fVal = newVal;
                break;
            case 'sVal':
                this.data.sVal = newVal;
                break;
            default:
                break;
        }
    }

    setBtnSelected (target) {
        this.oBtns[this.selectedIndex].className = 'btn';
        this.selectedIndex = [].indexOf.call(this.oBtns, target);
        this.oBtns[this.selectedIndex].className += ' selected';
    }

    // 最好一个函数完成一个功能, 函数最好是可扩展性的，功能要解耦、内聚
    setResult (method, fVal, sVal) {
        this.oResult.innerText = this[method](fVal, sVal);
    }
}

// class Calculator { // 一个文件中有多个类时，class...export{...} 这种方式很友好

// }

// 导出模块, 如果是多个，可以通过逗号隔开，一起导出，这是解构的方式
// export { Calculator }

// 导入模块，如果是多个，可以通过逗号隔开，一起导入
// import { Calculator } from './Calculator'

