<template>
  <div class="ProprietaryCart">
    <Cart />
    <tabbarTow ref="tab"></tabbarTow>
  </div>
</template>
<script>
import tabbarTow from "@/components/tabbarTow";
import Cart from "@/views/shoppingCart";
//Toast提示
import { Toast } from "vant";
export default {
  name: "ProprietaryCart",
  data() {
    return {};
  },
  components: {
    tabbarTow: tabbarTow,
    Cart: Cart,
  },
  methods: {
  },
  mounted() {
    this.$refs.tab.active = 2; //父组件通过$refs获取子组件的值
     document.title = '购物车';
  },
};
</script>