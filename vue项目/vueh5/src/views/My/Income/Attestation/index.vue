<template>
  <div class="Attestation">
    <div class="Attestation_box">
      <div class="d1">
        <span>兆客易购用户服务协议及隐私政策</span>
      </div>
      <div class="d2">
        <p>尊敬的兆客易购用户，为了更好的保障您的合法权益，让您正常使用兆客易购商城购物服务器，本平台依照国家法律法规，对支付账户进行实名制管理、履行反洗钱执照并采取风险防控措施。您需要兆客易购提交身份信息、联系方式、交易信息。</p>
        <p>本平台将依据国家法律法规收集、储存、使用您的个人信息，确保信息安全。</p>
        <p>
          请您务必审慎阅读并充分理解
          <span @click="jumpPrivacy()">《兆客易购用户注册协议》</span>和
          <span  @click="jumpPrivacy()">《兆客易购隐私政策》</span>，若您同意接受前述协议，请点击“同意”帮你并继续注册操作，否则，请点击“不同意”，中止认证操作。
        </p>
      </div>

      <div class="foot">
        <div class="foot1">
          <van-checkbox v-model="checked" checked-color="#F42636">同意并遵守 用户协议《兆客易购用户注册协议》和《兆客易购隐私政策》</van-checkbox>
        </div>
        <div class="foot2">
          <button class="b1" @click="noagree()">不同意</button>
          <button class="b2" @click="agree()">同意</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { Checkbox, CheckboxGroup } from "vant";
//Toast提示
import { Toast } from "vant";

export default {
  name: "Attestation",
  data() {
    return {
      checked: false,
    };
  },
  components: {
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Toast.name]: Toast,
  },
  methods: {
      // 跳转去隐私政策
      jumpPrivacy(){
         this.$router.replace({ path: "/My/Login/Privacy" });
      },
      //不同意
      noagree(){
        //  this.$router.replace({ path: "/My/Income/Withdraw" });
          this.$router.go(-1);
      },
      //同意
      agree(){
          if(this.checked){
               this.$router.replace({ path: "/My/realName" });
          }else{
            Toast({
              duration: 1000, // 持续展示 toast
              position: "bottom",
              className: "AttestationTost",
              forbidClick: false, //显示弹窗之后是否能够点击背景 可以
              message: "你还没有钩选按钮",
            });
          }
      }
  },
  mounted() {
     document.title = '认证条款';
  },
};
</script>


<style lang="less" scoped>
.Attestation {
  width: 100%;
  height: 100%;
  background: #fff;
  .Attestation_box {
    width: 88%;
    margin: auto;
    height: 100%;
    position: relative;
    .d1 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      span {
        font-size: 36px;
        font-weight: bold;
      }
    }
    .d2 {
      p {
        font-size: 30px;
        color: #000;
        margin-bottom: 30px;
        line-height: 44px;
        text-indent: 64px;
        span {
          color: @main-color;
        }
      }
    }
    .foot {
      width: 100%;
      position: absolute;
      bottom: 52px;
      .foot1 {
        width: 100%;
        /deep/ .van-checkbox {
          font-size: 3.2vw !important;
          .van-checkbox__icon {
            font-size: 3.4vw;
          }
          .van-checkbox__label {
            line-height: 5vw;
            color: @text-colorC;
          }
        }
      }
      .foot2 {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30px;
        button {
          outline: none;
          border: none;
          color: #fff;
          font-size: 32px;
        }
        .b1 {
          width: 216px;
          height: 88px;
          background: @button-auxiliarybackground;
          border-radius: 44px;
        }
        .b1:active{
            background: @button-auxiliarybackground-on;
        }
        .b2 {
          width: 420px;
          height: 88px;
          background: @button-mainbackground;
          border-radius: 44px;
        }
        .b2:active{
            background: @button-mainbackground-on;
        }
      }
    }
  }
}
</style>