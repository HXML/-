<template>
  <div style="width:100%;height:100%;">

    <div class="Withdraw">

      <div class="noticeBar flex jc-sb" v-if="isTrueValID==0">
        <span class="ml-40">根据相关法规规定，提现需实名认证</span>
        <span class="toComfirm mr-40" @click="toComfirm">去认证></span>
      </div>

      <div class="bindWechat">当前绑定微信：{{weChatName}}</div>
      <div class="box">
        <div class="content">
          <div class="content_box">
            <div class="content_box_left">
              <span>提现金额：</span>
            </div>
            <div :class="d1show3?'d1':'d1 d1active'">
              <p>
                <input
                  :type="typestate3"
                  :placeholder="placeholder"
                  class="myinput myInput1actice"
                  @focus="PhoneFocus()"
                  @blur="PhoneBlur()"
                  v-model="myinput3value"
                />
              </p>
              <!-- <img :src="eyeshidden3" alt class="showpassword" @click="Spassword3()" /> -->
            </div>
          </div>
        </div>
        <div class="Withdraw_money">
          您的当前可提现金额为￥{{totleMoney.toFixed(2)}}
          <span @click="withdrawal()">全部提现</span>
        </div>
        <div class="foot">
          <button :class="myinput3value!=''?'b1 b1active':'b1'" @click="submit()">提交</button>
          <p>
            提现金额会通过微信公众号发放到账户绑定的微信
            零钱中，按序发放，一般1-3个工作日，请注意查收！
            如有疑问请拨打
            <span>400-7777-316</span>
          </p>
        </div>
      </div>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { MyBaseDataAPI } from "@/api/MyApi";
import { ApplyBalanceAPI, LeastMoneyAPI } from "@/api/Iocome";
import { Toast } from "vant";
import { Dialog } from "vant";
import loading from "@/components/loading";
export default {
  data() {
    return {
      weChatName: "", //绑定的微信昵称
      isTrueValID: 0, //是否认证
      d1show3: true, //输入原密码2的光标变量
      typestate3: "text", //原来密码的type
      myinput3value: "", //原密码
      eyeshidden3: require("@/assets/images/login__icon4@2x.png"),
      eyes1: 1, //判断显示密码的状态
      placeholder: "",
      totleMoney: 0,
      LeastMoney: 10,
      loadingshow: true,
    };
  },
  components: {
    loading: loading,
  },
  methods: {
    //认证
    toComfirm() {
      this.$router.push({
        name: "Attestation",
      });
    },
    // 触发两个input焦点
    PhoneFocus(parameter) {
      this.d1show3 = false;
    },
    // 失去两个input焦点
    PhoneBlur() {
      this.d1show3 = true;
    },
    // 删除原密码input的数据
    delete3input() {
      this.myinput3value = "";
    },
    // 显示密码
    Spassword3() {
      if (this.eyes1 == 1) {
        // console.log("第一次点击");
        this.typestate3 = "text";
        this.eyeshidden3 = require("@/assets/images/login__icon3@2x.png");
        this.eyes1 = 2;
      } else {
        // console.log("第二次点击");
        this.typestate3 = "password";
        this.eyeshidden3 = require("@/assets/images/login__icon4@2x.png");
        this.eyes1 = 1;
      }
    },
    //点击全部提现
    withdrawal() {
      this.myinput3value = this.totleMoney;
    },
    submit() {
      let data = Number(this.myinput3value);
      if (data < this.LeastMoney) {
        Toast("提现金额不得小于" + this.LeastMoney + "元");
        return;
      }
      if (this.totleMoney <= 0) {
        Toast("余额不足");
      }
      var formd = new FormData();
      formd.append("Money", data);
      ApplyBalanceAPI(formd, "Post").then((res) => {
        console.log(res);
        if (res.code == 1) {
          this.$router.push({
            path: "/My/Income/Withdraw/Successedtow",
            query: { money: data },
          });
        }
        if (res.code == 0) {
          // Toast(res.msg);
          if (res.errorData == 1) {
          } else {
            Dialog.confirm({
              title: "根据相关法规规定，提现需实名认证?",
              confirmButtonText: "去认证",
            })
              .then(() => {
                this.$router.push({
                  path: "/My/Income/Attestation",
                });
              })
              .catch(() => {});
          }
        }
      });
    },
    // 个人中心信息
    MyBaseData() {
      MyBaseDataAPI("get").then((res) => {
        // console.log(res,"个人中心信息");
        this.isTrueValID = res.isTrueValID;
        this.weChatName = res.oauthNickName;
        this.totleMoney = res.balance;
        this.placeholder = "可提现金额" + this.totleMoney.toFixed(2);

        this.loadingshow = false;
      });
    },
    LeastMoneyI() {
      LeastMoneyAPI("get").then((res) => {
        console.log(res);
        this.LeastMoney = res.data;
      });
    },
  },
  mounted() {
    document.title = "提现";
    this.MyBaseData();
    this.LeastMoneyI();
  },
  watch: {
    myinput3value: function () {
      if (this.myinput3value != "") {
        this.delete3 = true;
      } else {
        this.delete3 = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Withdraw {
  width: 100%;
  height: 100%;
  .noticeBar {
    font-size: 28px;
    width: 750px;
    height: 80px;
    background: #fedec6;
    border: 1px solid #e4e4e4;
    line-height: 80px;
    color: #726154;
    .toComfirm {
      line-height: 80px;
      font-size: 28px;
      color: rgba(244, 38, 54, 1);
    }
  }
  .bindWechat {
    padding-top: 49px;
    margin-left: 40px;
    font-size: 28px;
    font-weight: 400;
    color: #b1b6c3;
  }
  .box {
    margin: 0 40px;
    // padding-top: 20px;
    .content {
      // margin-top: 87px;
      margin-top: 44px;
      //   padding: 0 40px;
      .p1active {
        color: @main-color !important;
      }
      .p1 {
        font-size: 24px;
        padding-top: 20px;
        color: @text-colorC;
      }
      .content_box {
        display: flex;
        align-items: center;
        margin-top: 40px;
        .content_box_left {
          display: flex;
          align-items: center;
          font-size: 28px;
          span {
            padding-bottom: 8px;
          }
        }
        .d1active {
          border-bottom: 1px solid @main-color !important;
        }
        .d1 {
          flex: 1;
          padding: 0 17px 12px 17px;
          border-bottom: 1px solid @border-colorA;
          display: flex;
          align-items: center;
          p {
            flex: 1;
            display: flex;
            align-items: center;
            height: 40px;
            input {
              border: none;
              font-size: 28px;
              flex: 1;
              caret-color: @main-color;
            }
            input::-webkit-input-placeholder {
              color: @text-colorD;
            }
            img {
              width: 34px;
              height: 34px;
            }
          }
          .delete1 {
            width: 24px;
            height: 24px;
            margin-right: 20px;
          }
          .showpassword {
            width: 38px;
            height: 38px;
          }
        }
        .d2active {
          border-bottom: 1px solid @main-color !important;
        }
        .d2 {
          flex: 1;
          padding: 0 17px 12px 17px;
          border-bottom: 1px solid @border-colorA;
          display: flex;
          align-items: center;
          p {
            flex: 1;
            display: flex;
            align-items: center;
            height: 40px;
            input {
              border: none;
              font-size: 28px;
              flex: 1;
              margin-top: 4px;
              caret-color: @main-color;
            }
            img {
              width: 34px;
              height: 34px;
            }
          }
          .delete2 {
            width: 24px;
            height: 24px;
            margin-right: 20px;
          }
          .showpassword {
            width: 38px;
            height: 38px;
          }
        }
        .d3 {
          color: @text-colorC;
          font-size: 24px;
          padding-top: 20px;
          display: flex;
          align-items: center;
          span:nth-child(1) {
            padding-left: 24px;
            flex: 1;
          }
          span:nth-child(2) {
            padding-right: 24px;
          }
        }
      }
    }
    .Withdraw_money {
      font-size: 24px;
      font-weight: 400;
      color: @text-colorD;
      line-height: 30px;
      padding-top: 24px;
      span {
        color: @main-color;
      }
    }
    .foot {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 80px;
      .b1active {
        background: @button-mainbackground !important;
        opacity: 1 !important;
        box-shadow: @main-shadow;
        pointer-events: auto !important;
      }
      .b1 {
        color: @text-white;
        background: @text-colorD;
        opacity: 0.5;
        height: 88px;
        border-radius: 44px;
        border: none;
        pointer-events: none;
      }
      p {
        font-size: 24px;
        font-weight: 400;
        color: @text-colorB;
        line-height: 38px;
        width: 80%;
        margin: 40px auto 0;
        text-align: center;
        span {
          color: @main-color;
        }
      }
    }
  }
}
</style>