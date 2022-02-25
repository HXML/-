import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  GetShopIDAPI
}
  from './api/store.js'
import {
  _getToken,
  _removeToken
} from '@/common/js/storage'
import './common/style/less/common.less'
import Vconsole from 'vconsole'
import {
  Lazyload
} from 'vant'

Vue.use(Lazyload)
Vue.config.productionTip = false
console.log(process.env.VUE_APP_URL, "process.env")


if (process.env.VUE_APP_URL === 'https://t-api.zk-mall.net/') { // 如果是测试环境, 则生成控制台
  let vConsole = new Vconsole()
  Vue.use(vConsole)
  // console.log(process.env, "jkjjj")
}

console.log = function() {}//关闭页面上面所有的console 置空
router.beforeEach((to, from, next) => {
  if (to.name == "GD") {
    console.log(to.query.s, "totooto")
    GetShopIDAPI({
      IDStr: to.query.s
    }, "get").then((res) => {
      next({
        path: '/GoodsDetails/Store?ShopId=' + res.data
      })
    })
  } else {
    next() // 确保一定要调用 next()
  }
})


// router.afterEach((to, from, next) => {
//   if (to.name == "GoodsDetails") {
//     window.scrollTo(0, 0)
//   }
// })



router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let Token = window.localStorage.getItem("Token")
    //这里判断用户是否登录，验证本地存储是否有token
    if (Token == undefined) {
      next({
        path: '/My/Login/LoginRegistered',
      })
      //刷新掉cookie
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})


let isWeiXin = () => {
  return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
};


router.beforeEach((to, from, next) => {
  var reloaded = window.localStorage.getItem('reloaded') || '';
  if (reloaded == '' && (to.name == 'LoginRegistered' || to.name == 'bigWheel' || to.name == 'LoginEnter') && isWeiXin()) {
    if (process.env.VUE_APP_URL === 'https://t-api.zk-mall.net/') { // 如果是测试环境, 则生成控制台
      var reurl = encodeURI('https://t-shop.zk-mall.net/#' + to.path);
    } else {
      var reurl = encodeURI('https://shop.zk-mall.net/#' + to.path);
    }
    var url =
      "https://t-api.zk-mall.net/api/v1/PhoneUserOauth/GetUserOauthModel/123?redirect_uri=" +
      encodeURIComponent(reurl);
    window.location.href = url
    window.localStorage.setItem('reloaded', 'yes');
  } else {
    next()
  }
})

Vue.filter('toFixedTow', function (value) {
  return Number(value).toFixed(2);
})

import AMap from 'vue-amap';
Vue.use(AMap);
// 初始化vue-amap
AMap.initAMapApiLoader({
  key:"fb92d375b535e29c4173ed6cbdd79894",
  // 插件集合 （插件按需引入）
  plugin: [
    "AMap.Geolocation" 
    //定位控件，用来获取和展示用户主机所在的经纬度位置
  ],
  uiVersion: '1.0',
  v: '1.4.4'
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')