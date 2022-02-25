<template>
  <div style="width:100%;height:100%;">
    <div class="pay"></div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>


<script>
import qs from "qs";

import loading from "@/components/loading";

import { GetAlPayisTrueAPI } from "@/api/pay";

import router from '@/router/index.js'

export default {
  name: "pay",
  data() {
    return {
      loadingshow: true,
    };
  },
  components: {
    loading: loading,
  },
  methods: {},
  mounted() {
    console.log("判断支付成功");
    console.log(window.localStorage.getItem("alorderNo"), "alorderNo");

    for (var i = 0; i < 5; i++) {
      (function (j) {
        let data = {
          OrderNO: window.localStorage.getItem("alorderNo"),
        };
        GetAlPayisTrueAPI(data, "get").then((res) => {
          console.log(res, "支付是否成功");
          console.log(j, "jjjj");
          if (res.data == true) {
            // return;
             console.log("支付成功");
             router.replace({ path: "/My/Myorder", query: { orderstatus: 2 } });
          }
          if (j == 4 && res.data == false) {
            console.log("支付失败");
            router.replace({path: "/My/Myorder",query: { orderstatus: 1 }});
          }
        });
      })(i);
    }
   

   

    // if(res.data){
    //     router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})
    // }else{
    //     router.replace({path: "/My/Myorder",query: { orderstatus: 1 }})
    // }
  },
};
</script>

<style lang="less" scoped>
.pay {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
}
</style>