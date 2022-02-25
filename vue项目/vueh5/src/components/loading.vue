<template>
  <div class="loading">
    <div class="loading_box">
      <div class="example">
        <div class="sk-circle-fade">
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
          <div class="sk-circle-fade-dot"></div>
        </div>
      </div>
      <div class="example_bottom">加载中...</div>
      <!-- <van-loading size="24px" vertical type="spinner">加载中...</van-loading> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Loading } from "vant";

export default {
  name: "loading",
  data() {
    return {};
  },
  components: {
    [Loading.name]: Loading,
  },
  methods: {},
  created() {},
};
</script>


<style lang="less" scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background: #fff;
  z-index: 999;
  .loading_box {
    width: 100%;
    height: 100%;
    background: @text-white;
    position: fixed;
    top: 0;
    z-index: 999;
    display: flex;
    // justify-content: center;
    flex-direction: column;
    align-items: center;
    .example{
       margin-top: 440px;
       .sk-circle-fade-dot:before{
             background: #969799;
       }
    }
    .example_bottom{
      margin-top: 60px;
      color: #969799;
    }
    .sk-circle-fade{
    --sk-size: 10.333vw;
    }
    .van-loading {
      padding-top: 400px;
      .van-loading__spinner {
        width: 100px !important;
        height: 100px !important;
        color: #969799;
        i {
          color: #969799 !important;
        }
      }
      .van-loading__text {
        font-size: 28px;
        margin-top: 30px;
      }
    }
  }
}
</style>
