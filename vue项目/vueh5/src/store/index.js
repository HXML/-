import Vue from 'vue'
import Vuex from 'vuex'
import currentUser from "./modules/currentUser";
import cart from "./modules/cart";


Vue.use(Vuex)

export default new Vuex.Store({
  //应用属性的状态
  modules: {
    currentUser,
    cart
  }
})

