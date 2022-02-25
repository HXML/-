<template>
  <div class="storecontant">
    <Cart />
    <tabbar ref="tab"></tabbar>
  </div>
</template>
<script>
import tabbar from "@/components/tabbar";
import Cart from "@/views/shoppingCart";
import { GetShopInfoAPI } from "@/api/store";
//Toast提示
import { Toast } from "vant";
export default {
  name: "storecontant",
  data() {
    return {};
  },
  components: {
    tabbar: tabbar,
    Cart: Cart,
  },
  methods: {
    getShopLogo() {
      var ShopId = localStorage.getItem("ShopId");
      let data = {
        ShopId: ShopId,
      };
      GetShopInfoAPI(data, "get").then((res) => {
        console.log(res, "获取店铺的数据");
        this.storetitledata = res.data;
        this.$refs.tab.tabbars[0].normal =
          res.data.logoImg + "?x-oss-process=style/n4";
      });
    },
  },
  mounted() {
    this.$refs.tab.active = 3; //父组件通过$refs获取子组件的值
    this.getShopLogo();
  },
};
</script>