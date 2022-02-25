export default {
    /*
     * 截取url参数
     * */
    loadPageVar(sVar) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    },
    /**
     * 传入时间戳，转换指定的时间格式
     * @param {Number} val      时间戳
     * @param {String} dateType 要得到的时间格式 例如 YYYY-MM-DD hh:mm:ss
     * @return dataStr 例如 YYYY-MM-DD hh:mm:ss
     */
    switchTime: (val = +new Date(), dateType = 'YYYY-MM-DD hh:mm:ss') => {
        // 将字符串转换成数字
        let timeStamp, dateStr, str
        timeStamp = +new Date(val)

        // 如果转换成数字出错
        if (!timeStamp) {
            return val
        }

        // 得到时间字符串
        dateStr = new Date(timeStamp)
        str = dateType.replace('YYYY', dateStr.getFullYear())
        str = str.replace('MM', (dateStr.getMonth() + 1 < 10 ? '0' : '') + (dateStr.getMonth() + 1))
        str = str.replace('DD', (dateStr.getDate() < 10 ? '0' : '') + dateStr.getDate())
        str = str.replace('hh', (dateStr.getHours() < 10 ? '0' : '') + dateStr.getHours())
        str = str.replace('mm', (dateStr.getMinutes() < 10 ? '0' : '') + dateStr.getMinutes())
        str = str.replace('ss', (dateStr.getSeconds() < 10 ? '0' : '') + dateStr.getSeconds())

        return str
    },
    // 各主流浏览器
    getBrowser() {
        var u = navigator.userAgent;

        var bws = [{
            name: 'sgssapp',
            it: /sogousearch/i.test(u)
        }, {
            name: 'wechat',
            it: /MicroMessenger/i.test(u)
        }, {
            name: 'weibo',
            it: !!u.match(/Weibo/i)
        }, {
            name: 'uc',
            it: !!u.match(/UCBrowser/i) || u.indexOf(' UBrowser') > -1
        }, {
            name: 'sogou',
            it: u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1
        }, {
            name: 'xiaomi',
            it: u.indexOf('MiuiBrowser') > -1
        }, {
            name: 'baidu',
            it: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1
        }, {
            name: '360',
            it: u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1
        }, {
            name: '2345',
            it: u.indexOf('2345Explorer') > -1
        }, {
            name: 'edge',
            it: u.indexOf('Edge') > -1
        }, {
            name: 'ie11',
            it: u.indexOf('Trident') > -1 && u.indexOf('rv:11.0') > -1
        }, {
            name: 'ie',
            it: u.indexOf('compatible') > -1 && u.indexOf('MSIE') > -1
        }, {
            name: 'firefox',
            it: u.indexOf('Firefox') > -1
        }, {
            name: 'safari',
            it: u.indexOf('Safari') > -1 && u.indexOf('Chrome') === -1
        }, {
            name: 'qqbrowser',
            it: u.indexOf('MQQBrowser') > -1 && u.indexOf(' QQ') === -1
        }, {
            name: 'qq',
            it: u.indexOf('QQ') > -1
        }, {
            name: 'chrome',
            it: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1
        }, {
            name: 'opera',
            it: u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1
        }];

        for (var i = 0; i < bws.length; i++) {
            if (bws[i].it) {
                return bws[i].name;
            }
        }

        return 'other';
    },

    // 系统区分
    getOS() {
        var u = navigator.userAgent;
        if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
            return 'windows';
        } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
            return 'macOS';
        } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
            return 'ios';
        } else if (!!u.match(/android/i)) {
            return 'android';
        } else {
            return 'other';
        }
    },
    // 重写setItem事件，当使用setItem的时候，触发，window.dispatchEvent派发事件
    dispatchEventStroage() {
        const signSetItem = localStorage.setItem
        localStorage.setItem = function (key, val) {
            let setEvent = new Event('setItemEvent')
            setEvent.key = key
            setEvent.newValue = val
            window.dispatchEvent(setEvent)
            signSetItem.apply(this, arguments)
        }
    }
}