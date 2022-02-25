<template>
  <van-tabbar v-model="active" active-color="@main-color">
    <van-tabbar-item
      replace
      v-for="(item,index) in tabbars"
      :key="index"
      :to="(item.name+'?ShopId='+shopid)"
    >
      <span>{{item.title}}</span>
      <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal" />
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar).use(TabbarItem);

export default {
  name: "tabbar",
  data() {
    return {
      shopid: 0,
      active: 0, //默认展示页
      tabbars: [
        {
          name: "/GoodsDetails/Store", //跳转的路由
          title: "首页", //底部栏文字
          normal: "",
          active: "",
        },
        {
          name: "/GoodsDetails/StoreAll",
          title: "全部商品",
          normal: require("@/assets/images/dp/dp_tab_all@2x.png"),
          active: require("@/assets/images/dp/dp_tab_all_hove@2x.png"),
        },
        {
          name: "/GoodsDetails/StoreClass",
          title: "商品分类",
          normal: require("@/assets/images/dp/dp_tab_fenlei@2x.png"),
          active: require("@/assets/images/dp/dp_tab_fenlei_hove@2x.png"),
        },
        {
          name: "/GoodsDetails/StoreCart",
          title: "购物车",
          normal: require("@/assets/images/tab/tab_shopping@2x.png"),
          active: require("@/assets/images/tab/tab_shopping_hove@2x.png"),
        },
        {
          name: "/GoodsDetails/StoreContact",
          title: "个人中心",
          normal: require("@/assets/images/tab/tab_mine@2x.png"),
          active: require("@/assets/images/tab/tab_mine_hove@2x.png"),
        },
      ],
    };
  },
  props:[
     "shopID"
  ],
  methods: {
   queryData(a) {
     this.shopid = a;
   }
  },
  mounted() {
    if (window.localStorage.getItem("ShopId")) {
      this.shopid = window.localStorage.getItem("ShopId");
    }
  },
  watch: {
    shopID: function (a, b) {
      //a是value的新值，b是旧值
      if (a.length == 0) {
      } else {
        this.queryData(a);
      }
    },
  },
};
</script>


<style lang="less" scoped>
.van-tabbar {
  height: 16vw;
  background: #fff;
  border-top: 1px solid #efecec;
  z-index: 100;
}
.van-tabbar-item {
  font-size: 28px;
}
.van-tabbar-item__icon img {
  display: block;
  width: 44px;
      height: 44px;
}
.van-tabbar-item--active {
  color: @main-color;
}
</style>
