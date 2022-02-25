// 定义
// 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时；典型的案例就是输入搜索：输入结束后n秒才进行搜索请求，n秒内又输入的内容，就重新计时。
// 实现原理
// 函数防抖的基本思想是设置一个定时器，在指定时间间隔内运行代码时清楚上一次的定时器，并设置另一个定时器，知道函数请求停止并超过时间间隔才会执行。
// 使用场景
// 文本框输入搜索（连续输入时避免多次请求接口）

// 代码实现
export function debounce(fn, delay) {
    // 记录上一次的延时器
    var timer = null;
    var delay = delay || 200;
    
    return function () {
        var args = arguments;
        var that = this;
        // 清除上一次延时器
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(that, args)
        }, delay);
    }
}

/**
 * 1:规定在一个单位时间内，只能触发一次函数，如果这个单位时间内触发多次函数，只有一次生效； 典型的案例就是鼠标不断点击触发，规定在n秒内多次点击只有一次生效。
 * 2:原理:是用时间戳来判断是否已到回调该执行时间，记录上次执行的时间戳，然后每次触发 scroll 事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是
 * 否已经 到达 规定时间段，如果是，则执行，并更新上次执行的时间戳，
 * 3:场景:函数节流  resize、scroll、mousemove等事件触发监听
 */

export function throttle(fn, delay) {
    var lastTime;
    var timer;
    var delay = delay || 200;
    return function () {
        var args = arguments;
        // 记录当前函数触发的时间
        var nowTime = Date.now();
        if (lastTime && nowTime - lastTime < delay) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                // 记录上一次函数触发的时间
                lastTime = nowTime;
                // 修正this指向问题
                fn.apply(this, args);
            }, delay);
        } else {
            lastTime = nowTime;
            fn.apply(this, args);
        }
    }
}
//实现
// debounceBtn: debounce(function () {
//     this.btnSubmit();
//   }, 300),