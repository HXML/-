import Vue from 'vue'
import App from './App.vue'
import router from './router'
import errorPage from "@/views/404/index.vue";
import store from './store'

import '@/styles/index.scss' // 全局 css
import ElementUI from 'element-ui'; //elementUI
import 'element-ui/lib/theme-chalk/index.css'; //elementUI
import './permission' // 权限控制
import './utils/updateAddress' // 更新地址
import './utils/directive' // 所有指令
Vue.component("errorPage", errorPage); //全局自定义组件
Vue.use(ElementUI);
//自定义删除方法
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
// console.log(process.env.VUE_APP_URL,process.env, "process.env")
Vue.filter('toNumber', function (value) {
  return Number(value).toFixed(2)
})
//自定义删除方法
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')