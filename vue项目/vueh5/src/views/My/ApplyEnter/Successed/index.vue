<template>
  <div class="success">
    <div class="flex2 aic">
      <img src="@/assets/images/mine_withdraw_icon@2x.png" class="success_img" />
      <span class="success_msg">提交成功</span>
      <p class="forThanks flex2 aic">
        <span>尊敬的商家，您好！感谢您选择我们。</span>
        <span>您提交申请后，3日内将会有我们的业务人员联系您。</span>
        <span>
          如有疑问请拨打：
          <span class="phoneNumber">400-7777-316</span>
        </span>
      </p>
      <!-- <span class="apply_again" @click="jumpApplyEnter()">再次申请</span> -->
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
        
    }
  },
  methods:{
    jumpApplyEnter(){
     this.$router.replace({ path: "/My/ApplyEnter" });
    }
  }

};
</script>
<style lang="less" scoped>
.success {
  height: 100vh;
  overflow: hidden;
  .success_img {
    margin-top: 180px;
    width: 112px;
    height: 112px;
    margin-bottom: 32px;
  }
  .success_msg {
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(0, 10, 38, 1);
    margin-bottom: 40px;
  }
  .forThanks {
    margin: auto;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: @text-colorB;
    line-height: 38px;
  }
  .phoneNumber {
    color: @main-color;
  }
  .apply_again {
    margin-top: 160px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 500;
    text-decoration: underline;
    color: rgba(74, 80, 96, 1);
  }
}
</style>