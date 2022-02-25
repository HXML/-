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

export default {
  name: "tabbar",
  data() {
    return {
      shopid: 0,
      active: 0, //默认展示页
      tabbars: [
        {
          name: "/GoodsDetails/ProprietaryStore", //跳转的路由
          title: "兆客自营", //底部栏文字
          normal: require("@/assets/images/1.6_img/ziying_tab_home.png"),
          active: require("@/assets/images/1.6_img/ziying_tab_home_hove.png"),
        },
        {
          name: "/GoodsDetails/ProprietaryClass",
          title: "商品分类",
          normal: require("@/assets/images/1.6_img/ziying_tab_fenlei.png"),
          active: require("@/assets/images/1.6_img/ziying_tab_fenlei_hove.png"),
        },
        {
          name: "/GoodsDetails/ProprietaryCart",
          title: "购物车",
          normal: require("@/assets/images/1.6_img/ziying_tab_gouwuche.png"),
          active: require("@/assets/images/1.6_img/ziying_tab_gouwuche_hove.png"),
        },
        {
          name: "/GoodsDetails/ProprietaryMy",
          title: "我的",
          normal: require("@/assets/images/1.6_img/ziying_tab_mine.png"),
          active: require("@/assets/images/1.6_img/ziying_tab_mine_hove.png"),
        },
      ],
    };
  },
  props:[
     "shopID"
  ],
  components:{
    [Tabbar.name]:Tabbar,
    [TabbarItem.name]:TabbarItem
  },
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
  height: 120px;
  background: #fff;
  border-top: 1px solid #efecec;
  z-index: 100;
}
.van-tabbar-item {
  font-size: 28px;
}
.van-tabbar-item__icon img {
  display: block;
  width: 50px;
      height: 50px;
}
.van-tabbar-item--active {
  color: @main-color;
}
</style>
