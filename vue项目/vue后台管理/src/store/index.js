import Vue from 'vue'
import Vuex from 'vuex'
import currentUser from "./modules/currentUser";
import ids from "./modules/ids";
import VuexPersistence from 'vuex-persistedstate'
Vue.use(Vuex)

const store = new Vuex.Store({ //vuex持久化
  modules: {
    currentUser,
    ids
  },
  plugins: [VuexPersistence()]
})
export default store