// 计算模块
export default (target) => {
    // target 是谁用它，它就是谁
    target.prototype.plus = function (a, b) { // target.prototype原型，谁是target，谁就拥有加减乘除四个方法
        return a + b;
    }

    target.prototype.minus = function (a, b) {
        return a - b;
    }

    target.prototype.mul = function (a, b) {
        return a * b;
    }

    target.prototype.div = function (a, b) {
        return a / b;
    }
}