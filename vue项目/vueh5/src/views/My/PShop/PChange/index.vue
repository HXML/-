<template>
  <div class="PChange">
    <div class="PWithdraw_box">
      <div class="title">
        <div class="d1">
          <span class="s1">提现方式：</span>
          <div class="d1_box" v-if="pageData.getCashType == 1">
            <div>
              <img
                src="@/assets/images/1.6_img/mendian_tixian_icon1.png"
                alt=""
              />
              <span>支付宝</span>
            </div>
          </div>
          <div class="d1_box" v-if="pageData.getCashType == 2">
            <div>
              <img
                src="@/assets/images/1.6_img/mendian_tixian_icon2.png"
                alt=""
              />
              <span>微信</span>
            </div>
          </div>
          <div class="d1_box" v-if="pageData.getCashType == 3">
            <div>
              <img
                src="@/assets/images/1.6_img/mendian_tixian_icon3.png"
                alt=""
              />
              <span>银行卡</span>
            </div>
          </div>
        </div>

        <!-- 支付宝 -->
        <div class="d3" v-if="pageData.getCashType == 1">
          <div class="d3_div">
            <span class="s1">收款账户：</span>
            <div class="d3_box">
              <input
                type="text"
                v-model="pageData.cashAccount"
                placeholder="收款支付宝账户名称"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">账户号：</span>
            <div class="d3_box">
              <input
                type="text"
                v-model="pageData.accountName"
                placeholder="收款支付宝账户号"
              />
            </div>
          </div>
        </div>
        <!-- 微信 -->
        <div class="d3" v-if="pageData.getCashType == 2">
          <div class="d3_div">
            <span class="s1">微信号：</span>
            <div class="d3_box">
              <input
                v-model="pageData.accountName"
                type="text"
                placeholder="收款微信号（用于添加好友微信转账）"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">手机号：</span>
            <div class="d3_box">
              <input
                type="text"
                v-model="pageData.cashAccount"
                placeholder="收款微信手机号"
              />
            </div>
          </div>
          <!-- <div class="d3_div">
            <span class="s1">微信昵称：</span>
            <div class="d3_box">
              <input
                type="text"
                v-model="pageData.accountName"
                placeholder="收款微信昵称"
              />
            </div>
          </div> -->
        </div>
        <!-- 银联卡 -->
        <div class="d3" v-if="pageData.getCashType == 3">
          <div class="d3_div">
            <span class="s1">账户名：</span>
            <div class="d3_box">
              <input
                type="text"
                v-model="pageData.accountName"
                placeholder="账户名称（卡持有者的真实姓名）"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">账户号：</span>
            <div class="d3_box">
              <input
                v-model="pageData.cashAccount"
                type="text"
                placeholder="银联卡账户号"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">开户行：</span>
            <div class="d3_box">
              <input
                type="text"
                v-model="pageData.openingBank"
                placeholder="银联卡开户行"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="foot">
        <button @click="submitBtn" :class="isActive ? 'active_Btn' : ''">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { CashTypeOperatingAPI, GetCashTypeDetailsAPI } from "@/api/Proprietary";
export default {
  name: "PChange",
  data() {
    return {
      pageData: {},
    }; 
  },
  components: {},
  computed: {
    isActive: function () {
      // `this` 指向 vm 实例
      // console.log(this.pageData.getCashType, "this.pageData.getCashType");
      if (this.pageData.getCashType == 1 || this.pageData.getCashType == 2) {
        if (
          this.pageData.cashAccount !== "" &&
          this.pageData.accountName !== ""
        ) {
          return true;
        } else {
          return false;
        }
      }

      if (this.pageData.getCashType == 3) {
        if (
          this.pageData.cashAccount !== "" &&
          this.pageData.accountName !== "" &&
          this.pageData.openingBank !== ""
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    getDetail(id) {
      GetCashTypeDetailsAPI({ id }, "get").then((res) => {
        this.pageData = res.data;
      });
    },
    submitBtn() {
      // console.log(this.submitdata, " this.submitdata");

      let data = {};
      CashTypeOperatingAPI(qs.stringify(this.pageData), "POST").then((res) => {
        // console.log(res, "rrr");
        // return;
        if (res.code == 1) {
          this.$router.go(-1);
        }
      });
    },
  },
  mounted() {
    console.log(this.$route.query.type);
    if (this.$route.query.id != 0) {
      this.getDetail(this.$route.query.id);
    } else {
      this.pageData = {
        id: 0,
        getCashType: this.$route.query.type,
        openingBank: "",
        cashAccount: "",
        accountName: "",
      };
    }
  },
};
</script>

<style lang="less">
.PChange {
  width: 100%;
  height: 100%;
  background: #fff;

  .PWithdraw_box {
    padding: 0 40px;
    height: 100%;
    .title {
      width: 100%;
      .d1 {
        display: flex;
        align-items: center;
        .s1 {
          font-size: 28px;
          color: #000b26;
        }
        .d1_box {
          display: flex;
          align-items: center;
          flex: 1;
          border-bottom: 1px solid rgba(177, 182, 196, 0.2);
          margin-left: 16px;
          div {
            display: flex;
            align-items: center;
            padding: 28px 0;
            flex: 1;
            img {
              width: 46px;
            }
            span {
              font-size: 28px;
              color: #000b26;
              padding-left: 16px;
            }
          }
          .img_xx {
            width: 28px;
          }
        }
      }
      .d2 {
        display: flex;
        align-items: center;
        .d2_box {
          flex: 1;
          ul {
            width: 100%;
            li {
              width: 100%;
              display: flex;
              align-items: center;
              padding: 30px 0 0;
              img {
                width: 46px;
              }
              p {
                padding-left: 20px;
                font-size: 26px;
                color: #4a5060;
                span {
                  color: rgba(177, 182, 196, 1);
                  font-size: 22px;
                }
              }
            }
          }
        }
      }
      .d3 {
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        .d3_div {
          display: flex;
          align-items: center;
          margin-top: 12px;
          .s1 {
            font-size: 28px;
            color: #000b26;
            flex: 1;
          }
          .d3_box {
            display: flex;
            align-items: center;
            flex: 3.4;
            border-bottom: 1px solid rgba(177, 182, 196, 0.2);
            margin-left: 16px;
            padding: 28px 0;
            input {
              width: 100%;
              outline: none;
              border: none;
            }
          }
        }
      }
      .d10 {
        display: flex;
        align-items: center;
        margin-top: 12px;
        .s1 {
          font-size: 28px;
          color: #000b26;
          flex: 1;
        }
        .d10_box {
          display: flex;
          align-items: center;
          flex: 3.4;
          border-bottom: 1px solid rgba(177, 182, 196, 0.2);
          margin-left: 16px;
          padding: 28px 0;
          input {
            width: 100%;
            outline: none;
            border: none;
            flex: 1;
          }
          span {
            color: rgba(244, 39, 55, 1);
          }
        }
      }
    }
    .foot {
      display: flex;
      flex-direction: column;
      margin-top: 86px;
      .active_Btn {
        pointer-events: unset;
        background: linear-gradient(#e73a3a 0%, #f64242 100%);
      }
      button {
        width: 100%;
        height: 88px;
        background: rgba(177, 182, 196, 0.5);
        border-radius: 44px;
        color: #fff;
        font-size: 32px;
      }
      .foot_div {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 50px;
        .d1 {
          font-size: 26px;
          color: #7e8290;
          font-weight: bold;
          text-align: center;
          p {
            line-height: 40px;
          }
        }
        .d2 {
          font-size: 22px;
          color: #7e8290;
          text-align: center;
          line-height: 40px;
        }
      }
    }
  }
}
</style>