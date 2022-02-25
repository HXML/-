<template>
  <div>
    <button @click="debucefunc">点击防抖</button>
  </div>
</template>

<script>
import { debounce, throttle } from "@/common/js/debounceAndThrottle.js";
var _this = this;
export default {
  methods: {
    pay() {
      setTimeout(() => {
        // alert(555);
        console.log("555");
        
      }, 2000);
    },
    debucefunc: throttle(function () {
      // console.log(this, _this, "aaa");
      var _this = this;
      _this.pay();
    }, 2000),
  },
};
</script>

<style>
</style>