import utils from '@/common/js/ycpd_Utils' // 公共方法
import commonApi from '@/api/commonApi'

function Transform(str) {
  try {
    return str.split(",");
  } catch (e) {
    console.log(e)
  }
}

function GetpId() {
  return decodeURI(window.location.href.replace(new RegExp("^(?:.*[&\\?]" + encodeURI("pId").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}


/*let moment = require('moment')*/
export default {
  install(Vue, options) {
    Vue.prototype.$commonApi = commonApi
    Vue.prototype.$utils = utils
    Vue.prototype.$Transform = Transform
    Vue.prototype.$GetpId = GetpId

    /*Vue.prototype.$moment = moment*/
  }
}
// 微信：环境
export function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }
    return false;
}


// 支付宝：环境
export function isAlipay() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/Alipay/i) == "alipay"){
        return true;
    }
    return false;
}