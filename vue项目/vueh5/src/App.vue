<template>
  <div id="app">
    
    <div class="kong" v-if="network">
      <div class="kong_box">
        <img src="@/assets/images/kong/kong_icon2@2x.png" alt />
        <p class="p1">包租婆，怎么断网了</p>
        <p class="p2">检查网络是否正常后，重试一下就好呢</p>
        <button class="b1" @click="retry()">重试</button>
      </div>
    </div>

    <keep-alive :include="['Home']" v-if="!network">
      <router-view />
    </keep-alive>

    <!-- <keep-alive v-if="!network">
      <router-view v-if='$route.meta.keepAlive' />
    </keep-alive>

    <router-view  v-if='!$route.meta.keepAlive&&!network' /> -->


    <div class="tabs" v-show="$route.meta.navShow?true:false" v-if="!network">
      <Tabbar
        route
        v-model="active"
        active-color="#F42636"
        inactive-color="#4A5060"
        style="box-shadow:@auxiliary-shadow;"
      >
        <TabbarItem replace icon="home-o" to="/">
          <span>首页</span>
          <template #icon="props">
            <img :src="props.active ? icon.active : icon.inactive" />
          </template>
        </TabbarItem>
        <TabbarItem replace icon="search" to="/Calssify">
          <span>分类</span>
          <template #icon="props">
            <img :src="props.active ? icon1.active : icon1.inactive" />
          </template>
        </TabbarItem>
        <TabbarItem replace icon="search" to="/Message">
          <span>消息</span>
          <template #icon="props">
            <img :src="props.active ? icon4.active : icon4.inactive" />
          </template>
        </TabbarItem>
        <TabbarItem
          v-if="cartNumInfor!==0"
          replace
          icon="friends-o"
          to="/shoppingCart"
          :badge="cartNumInfor"
        >
          <span>购物车</span>
          <template #icon="props">
            <img :src="props.active ? icon2.active : icon2.inactive" />
          </template>
        </TabbarItem>
        <TabbarItem v-else replace icon="friends-o" to="/shoppingCart">
          <span>购物车</span>
          <template #icon="props">
            <img :src="props.active ? icon2.active : icon2.inactive" />
          </template>
        </TabbarItem>
        <TabbarItem replace icon="setting-o" to="/My">
          <span>个人</span>
          <template #icon="props">
            <img :src="props.active ? icon3.active : icon3.inactive" />
          </template>
        </TabbarItem>
      </Tabbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
import { GetUserCartCountAPI } from "@/api/MyApi";

import { baseImgUrl } from "@/common/js/commonUrl.js";

Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
  name: "home",
  data() {
    return {
      network: false,
      addressList: {},
      active: null,
      icon: {
        active:
          baseImgUrl+"/tab_home_hove.png?x-oss-process=style/n4",
        inactive:
          baseImgUrl+"/tab_home.png?x-oss-process=style/n4",
      },
      icon1: {
        active:
          baseImgUrl+"/tab_fenlei_hove.png?x-oss-process=style/n4",
        inactive:
          baseImgUrl+"/tab_fenlei.png?x-oss-process=style/n4",
      },
      icon4: {
        active:
          baseImgUrl+"/tab_news_hove@2x.png?x-oss-process=style/n4",
        inactive:
          "http://img.zk-mall.net/BaseImg/tab_news@2x.png?x-oss-process=style/n4",
      },
      icon2: {
        active:
          baseImgUrl+"/tab_gouwuc_hove.png?x-oss-process=style/n4",
        inactive:
          baseImgUrl+"/tab_gouwuc.png?x-oss-process=style/n4",
      },
      icon3: {
        active:
          baseImgUrl+"/tab_mine_hove.png?x-oss-process=style/n4",
        inactive:
          baseImgUrl+"/tab_mine.png?x-oss-process=style/n4",
      },
      cartNum: 0,
    };
  },
  computed: {
    cartNumInfor: function () {
      return this.$store.getters.cartNumber;
      console.log(
        this.$store.getters.cartNumber,
        "this.$store.getters.cartNumber"
      );
      // this.cartNum = localStorage.getItem("cartnum");
    },
  },
  components: {
    Tabbar,
    TabbarItem,
  },
  methods: {
    retry() {
      location.reload();
    },
    // 获取购物车的数量
    GetUserCartCountData() {
      let Token = window.localStorage.getItem("Token");
      // console.log(window.localStorage.getItem("CartList"), "1111");
      if (window.localStorage.getItem("CartList")) {
        var CartList = JSON.parse(window.localStorage.getItem("CartList"));
      } else {
        var CartList = [];
      }
      
      if (Token) {
        GetUserCartCountAPI("get").then((res) => {
          this.$store.dispatch("setCartNumber", res.data.slist);
        });
      } else {
        if (CartList.length == 0) {
          this.$store.dispatch("setCartNumber", 0);
        } else {
          this.$store.dispatch("setCartNumber", CartList.length);
        }
      }
    },
  },
  mounted() {
    this.GetUserCartCountData();
    // this.cartNum = window.localStorage.getItem("cartnum");
    window.addEventListener("offline", () => {
      // alert("已断网");
      this.network = true;
    });
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
.kong {
  width: 100%;
  height: 100%;
  .kong_box {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding-top: 200px;
    img {
      width: 265px;
      height: 250px;
    }
    .p1 {
      font-size: 32px;
      font-weight: 500;
      text-align: center;
      color: @text-colorB;
      margin-top: 70px;
    }
    .p2 {
      font-size: 28px;
      text-align: center;
      color: @text-colorC;
      margin-top: 22px;
    }
    .b1 {
      width: 188px;
      height: 70px;
      background: @button-auxiliarybackground;
      border-radius: 35px;
      color: @text-white;
      border: none;
      font-size: 32px;
      margin-top: 76px;
    }
  }
}
.van-tabbar {
  height: 120px;
  .van-tabbar-item__icon {
    position: relative;
    margin-bottom: 8px;
    font-size: 18px;
    img {
      width: 44px;
      height: 44px;
    }
  }
  .van-tabbar-item__text {
    font-size: 20px;
  }
}

.van-image-preview{
   /deep/ .van-image-preview__index{
      font-size: 32px;
    padding-top:20px;
  }
}


.van-dialog__confirm .van-button__text {
  color: red;
}

.vue-directive-image-previewer {
  z-index: 9999;
}
.vue-directive-image-previewer-body {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vue-directive-image-previewer-body /deep/ img {
  position: inherit !important;
  width: 100% !important;
  height: auto !important;
}

// .van-dialog {
//   width: 560px !important;
//   background: rgba(255, 255, 255, 1);
//   border-radius: 16px !important;
//   /deep/ .van-dialog__content {
//     width: 100%;
//     height: 140px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     .van-dialog__message {
//       font-size: 32px;
//       color: @text-colorA;
//       padding: 0;
//       line-height: inherit;
//       max-height: initial;
//     }
//   }
//   .van-dialog__footer {
//     height: 80px;
//     .van-button {
//       border: none;
//     }
//     .van-dialog__cancel {
//       height: 80px;
//       border-top: 1px solid @base-color;
//       border-right: 1px solid @base-color;
//       span {
//         font-size: 32px;
//         color: @text-colorB;
//       }
//     }
//     .van-dialog__confirm {
//       height: 80px;
//       border-top: 1px solid @base-color;
//       span {
//         font-size: 32px;
//         color: @main-color;
//       }
//     }
//     /deep/ [class*="van-hairline"]::after {
//       display: none;
//     }
//     /deep/ .van-button::before {
//       display: none;
//     }
//   }
//   /deep/ .van-hairline--top::after {
//     border-top-width: 0px !important;
//   }
// }
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
