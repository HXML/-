<template>
  <div class="PSet">
    <div class="PSet_box">
      <div class="you_title"></div>
      <!-- 支付宝 无 -->
      <section v-if="isAliExist">
        <div class="title_none" v-if="aliAccount.isExist == -1">
          <div class="left">
            <img
              src="@/assets/images/1.6_img/mendian_tixian_icon1.png"
              alt=""
            />
            <div>
              支付宝
              <span>/支付宝转账</span>
            </div>
          </div>
          <div class="right" @click="jumpPChange(0, 1)">
            <span>添加</span>
          </div>
        </div>
      </section>

      <!-- 微信 无-->
      <section v-if="isWechatExist">
        <div class="title_none" v-if="weixinAccount.isExist == -1">
          <div class="left">
            <img
              src="@/assets/images/1.6_img/mendian_tixian_icon2.png"
              alt=""
            />
            <div>
              微信
              <span>/添加好友转账</span>
            </div>
          </div>
          <div class="right" @click="jumpPChange(0, 2)">
            <span>添加</span>
          </div>
        </div>
      </section>
      <!-- 银联卡 无-->

      <section v-if="isBankExist">
        <div class="title_none" v-if="bankAccount.isExist == -1">
          <div class="left">
            <img
              src="@/assets/images/1.6_img/mendian_tixian_icon3.png"
              alt=""
            />
            <div>
              银联卡
              <span>/银联转账</span>
            </div>
          </div>
          <div class="right" @click="jumpPChange(0, 3)">
            <span>添加</span>
          </div>
        </div>
      </section>

      <!-- 支付宝 有信息-->
      <section v-if="isAliExist">
        <div v-if="aliAccount.isExist !== -1" class="title_block">
          <div class="title_block_box">
            <div class="left">
              <img
                src="@/assets/images/1.6_img/mendian_tixian_icon1.png"
                alt=""
              />
            </div>
            <div class="right">
              <div class="d1">
                <p>
                  支付宝
                  <span>/支付宝转账</span>
                </p>
                <span class="s1" @click="jumpPChange(aliAccount.obj.id)"
                  >修改</span
                >
              </div>
              <div class="d2">
                <p>账户名称：{{ aliAccount.obj.accountName }}</p>
                <p>收款账户：{{ aliAccount.obj.cashAccount }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="isWechatExist">
        <!-- 微信 有信息-->
        <div v-if="weixinAccount.isExist !== -1" class="title_block">
          <div class="title_block_box">
            <div class="left">
              <img
                src="@/assets/images/1.6_img/mendian_tixian_icon2.png"
                alt=""
              />
            </div>
            <div class="right">
              <div class="d1">
                <p>
                  微信
                  <span>/添加好友转账</span>
                </p>
                <span class="s1" @click="jumpPChange(weixinAccount.obj.id)"
                  >修改</span
                >
              </div>
              <div class="d2">
                <p>微信号：{{ weixinAccount.obj.accountName }}</p>
                <p>手机号：{{ weixinAccount.obj.cashAccount }}</p>
                <!-- <p>微信昵称：{{ weixinAccount.obj.accountName }}</p> -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="isBankExist">
        <!-- 银联卡 有信息-->
        <div v-if="bankAccount.isExist !== -1" class="title_block">
          <div class="title_block_box">
            <div class="left">
              <img
                src="@/assets/images/1.6_img/mendian_tixian_icon3.png"
                alt=""
              />
            </div>
            <div class="right">
              <div class="d1">
                <p>
                  银联卡
                  <span>/银联转账</span>
                </p>
                <span class="s1" @click="jumpPChange(bankAccount.obj.id)"
                  >修改</span
                >
              </div>
              <div class="d2">
                <p>账户名：{{ bankAccount.obj.cashAccount }}</p>
                <p>账户号：{{ bankAccount.obj.accountName }}</p>
                <p>开户行：{{ bankAccount.obj.openingBank }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <loading ref="load" v-if="loadingshow"></loading>
    </div>
  </div>
</template>

<script>
import { GetCashTypeListAPI, GetCashOutAPI } from "@/api/Proprietary";

import loading from "@/components/loading";

export default {
  name: "PSet",
  data() {
    return {
      isAliExist: true, //商户后台否存在支付宝
      isWechatExist: true, //商户后台否存在微信
      isBankExist: true, //商户后台否存在银行卡
      pageList: [],
      aliAccount: {
        isExist: null, //是否存在支付宝提现方式
        obj: {},
      },
      weixinAccount: {
        isExist: null, //是否存在微信提现方式
        obj: {},
      },
      bankAccount: {
        isExist: null, //是否存在银行卡提现方式
        obj: {},
      },
      loadingshow: true,
    };
  },
  components: {
    loading: loading,
  },
  methods: {
    //跳转去修改页面
    jumpPChange(id, type) {
      this.$router.replace({ path: "/My/PShop/PChange", query: { id, type } });
    },
    //获取提现方式列表
    GetCashTypeList() {
      GetCashTypeListAPI("get").then((res) => {
        console.log(
          res.data.findIndex((item) => item.getCashType == 1),
          "resss"
        );
        //支付宝
        this.aliAccount.isExist = res.data.findIndex(
          (item) => item.getCashType == 1
        );

        this.aliAccount.obj =
          res.data[res.data.findIndex((item) => item.getCashType == 1)];

        //微信
        this.weixinAccount.isExist = res.data.findIndex(
          (item) => item.getCashType == 2
        );
        this.weixinAccount.obj =
          res.data[res.data.findIndex((item) => item.getCashType == 2)];

        //银联卡
        this.bankAccount.isExist = res.data.findIndex(
          (item) => item.getCashType == 3
        );
        this.bankAccount.obj =
          res.data[res.data.findIndex((item) => item.getCashType == 3)];

        this.loadingshow = false;
      });
    },
    getCashType() {
      let data = {
        shopPickupPointId: this.$route.query.id,
      };
      GetCashOutAPI(data, "get").then((res) => {
        console.log(res, "res");
        let CashTypes = res.data.getCashType.split(",");
        // console.log(CashTypes.findIndex((item) => item == "2"));
        this.isAliExist =
          CashTypes.findIndex((item) => item == "1") != -1 ? true : false;
        this.isWechatExist =
          CashTypes.findIndex((item) => item == "2") != -1 ? true : false;
        this.isBankExist =
          CashTypes.findIndex((item) => item == "3") != -1 ? true : false;
          console.log(this.isAliExist,"isAliExist")
          console.log(this.isWechatExist,"isWechatExist")
          console.log(this.isBankExist,"isBankExist")
        // isAliExist: true, //商户后台否存在支付宝
        // isWechatExist: true, //商户后台否存在微信
        // isBankExist: true, //商户后台否存在银行卡
        // console.log(getCashType, "getCashType");
      });
    },
  },
  mounted() {
    this.GetCashTypeList();
    this.getCashType();
    document.title = "提现设置";
  },
};
</script>

<style lang="less">
.PSet {
  width: 100%;
  height: 100%;
  background: #fff;
  .PSet_box {
    padding: 0 40px;
    height: 100%;
    .you_title {
      height: 20px;
    }
    .title_none {
      width: 100%;
      display: flex;
      align-items: center;
      height: 110px;
      background: #ffffff;
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        img {
          width: 46px;
        }
        div {
          display: flex;
          align-items: center;
          font-size: 26px;
          color: #4a5060;
          display: flex;
          padding-left: 32px;
          span {
            color: rgba(177, 182, 196, 1);
            font-size: 22px;
          }
        }
      }
      .right {
        width: 88px;
        height: 48px;
        background: #ff8a49;
        border-radius: 24px;
        color: #fff;
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .title_block {
      width: 100%;
      min-height: 228px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0px 4px 16px 0px rgba(0, 11, 38, 0.06);
      margin-bottom: 20px;
      .title_block_box {
        padding: 30px 20px;
        display: flex;
        align-items: flex-start;
        .left {
          img {
            width: 46px;
          }
        }
        .right {
          padding-left: 32px;
          flex: 1;
          display: flex;
          flex-direction: column;
          .d1 {
            width: 100%;
            display: flex;
            align-items: center;
            p {
              flex: 1;
              color: #4a5060;
              display: flex;
              align-items: baseline;
              padding-top: 8px;
              span {
                color: rgba(177, 182, 196, 1);
                font-size: 22px;
              }
            }
            .s1 {
              font-size: 26px;
              color: rgba(255, 138, 73, 1);
            }
          }
          .d2 {
            display: flex;
            flex-direction: column;
            padding-top: 24px;
            p {
              line-height: 40px;
              font-size: 26px;
              color: #4a5060;
            }
          }
        }
      }
    }
  }
}
</style>