<template>
  <div class="ProprietaryMy">
    <My />
    <tabbarTow ref="tab"></tabbarTow>
  </div>
</template>
<script>
import tabbarTow from "@/components/tabbarTow";
import My from "@/views/My";
//Toast提示
import { Toast } from "vant";
export default {
  name: "ProprietaryMy",
  data() {
    return {};
  },
  components: {
    tabbarTow: tabbarTow,
    My: My,
  },
  methods: {
  },
  mounted() {
    this.$refs.tab.active = 3; //父组件通过$refs获取子组件的值
     document.title = '个人中心';
  },
};
</script>