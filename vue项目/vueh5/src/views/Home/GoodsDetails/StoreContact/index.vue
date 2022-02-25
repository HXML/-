<template>
  <div class="storecontant">
    <My />
    <tabbar ref="tab"></tabbar>
  </div>
</template>
<script>
import tabbar from "@/components/tabbar";
import { GetShopInfoAPI } from "@/api/store";
import My from "@/views/My";
//Toast提示
import { Toast } from "vant";
export default {
  name: "storecontant",
  data() {
    return {};
  },
  components: {
    tabbar: tabbar,
    My: My,
  },
  mounted() {
    this.$refs.tab.active = 4; //父组件通过$refs获取子组件的值
    this.getShopLogo();
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
};
</script>