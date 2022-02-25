<template>
  <div class="RefundOf">
    <!-- <van-skeleton title :row="3" style="height:100vh;padding-top:10vh;" :loading="loading" /> -->
    <div class="RefundOf_title">
      <!-- 退款中 -->
      <div class="RefundOf_title_box" v-show="returnStatus==1">
        <div class="RefundOf_title_left">
          <p class="p1">申请退款中，等待商家处理</p>
          <p class="p2">
            还剩：
            <van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" />
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon9@2x.png" alt />
        </div>
      </div>

      <!-- 退款完成 -->
      <div class="RefundOf_title_box" v-show="returnStatus==5">
        <div class="RefundOf_title_left">
          <p class="p1">退款成功</p>
          <p class="p2">
            <span>{{information.shopAgreeTime}}</span>
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon7@2x.png" alt />
        </div>
      </div>

      <!-- 商家拒绝退款 -->
      <div class="RefundOf_title_box" v-show="returnStatus==7">
        <div class="RefundOf_title_left">
          <p class="p1">商家拒绝退款</p>
          <p class="p2">
            还剩：
            <van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" />
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon6@2x.png" alt />
        </div>
      </div>

      <!-- 用户撤销退款 -->
      <div class="RefundOf_title_box" v-show="returnStatus==6">
        <div class="RefundOf_title_left">
          <p class="p1">取消退款</p>
          <p class="p2">
            <span>{{information.shopAgreeTime}}</span>
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon8@2x.png" alt />
        </div>
      </div>
    </div>
    <div class="RefundOf_content">
      <!-- 退款完成 退款路径 -->
      <div class="RefundPath" v-show="returnStatus==5">
        <div class="RefundPath_top">
          <span>退款总金额</span>
          <span>￥{{information.returnPrice}}</span>
        </div>
        <div class="RefundPath_bottom">
          <span>退款路径</span>
          <span>微信钱包</span>
        </div>
      </div>

      <!-- 撤销退款申请  退款关闭-->
      <div class="RefundClose" v-show="returnStatus==6">
        <span>
          因您撤销退款申请，退款已关闭，如问题仍未解决，
          您可以重新发起申请
        </span>
      </div>

      <!-- 商家拒绝原因 -->
      <div class="RefuseReason" v-show="returnStatus==7">
        <div class="RefuseReason_top">
          <p>
            <span class="s1">商家拒绝原因：</span>
            <span class="s2">{{information.shopRejective}}</span>
          </p>
          <p>
            <span class="s1">商家拒绝说明：</span>
            <span class="s2">{{information.shopRejectiveRmk}}</span>
          </p>
          <div class="RefuseReason_img">
            <span class="s1">商家拒绝原因：</span>
            <div>
              <img
                :src="item+'?x-oss-process=style/b1'"
                alt
                v-for="(item,index) in errimg"
                :key="index"
              />
            </div>
          </div>
        </div>
        <div class="RefuseReason_center">
          <p>*您可以修改申请后再次发起，商家会重新处理</p>
          <p class="p2">*如果您逾期未处理，本次申请将自动关闭</p>
        </div>
        <div class="RefuseReason_bottom">
          <button class="b1" @click="ModifyApplication()">修改申请</button>
          <button class="b2" @click="CancelApplication()">撤销申请</button>
        </div>
      </div>

      <!-- 协商历史 -->
      <div
        class="negotiation"
        @click="jumpNegotiationHistory()"
        v-show="returnStatus==5||returnStatus==7||returnStatus==6"
      >
        <p>
          <span class="s2">协商历史</span>
        </p>
        <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
      </div>

      <!--退款中 退款须知 -->
      <div class="RefundNotice" v-show="returnStatus==1">
        <div class="RefundNotice_top">
          <span>退款须知</span>
        </div>
        <div class="RefundNotice_center">
          <p>* 退款成功后金额将退回原支付路径。</p>
          <p>* 商家同意后，请按照给出的退货地址退货，并请记录退货运单号。</p>
          <p>* 如商家拒绝，您可以修改以后再次发起，商家会重新处理。</p>
          <p>* 商家同意或者超时未处理，系统将自动给您退款。</p>
        </div>
        <div class="RefundNotice_bottom">
          <button class="b1" @click="ModifyApplication()">修改申请</button>
          <button class="b2" @click="CancelApplication()">撤销申请</button>
        </div>
      </div>

      <!-- 退款信息 -->
      <div
        class="RefundInformation"
        v-show="returnStatus==1||returnStatus==5||returnStatus==7||returnStatus==6"
      >
        <div class="RefundInformation_top">
          <span>退款信息</span>
        </div>
        <div class="RefundInformation_center">
          <img :src="information.goodsImg+'?x-oss-process=style/b1'" alt class="shopimg" />
          <div class="shoptext">
            <p>{{information.goodsName}}</p>
            <p>
              <span
                v-for="(itemB,indexThree) in information.orderOtherData"
                :key="indexThree"
              >{{itemB.Key}}: {{itemB.Value}} ;</span>
            </p>
          </div>
        </div>
        <div class="RefundInformation_bottom">
          <p>退款原因：{{information.returnReason}}</p>
          <p>退款金额：￥{{information.returnPrice}}</p>
          <p>申请时间：{{information.creatorDate}}</p>
          <p v-show="returnStatus==5">完成时间：{{information.shopAgreeTime}}</p>
          <p v-show="returnStatus==7">拒绝时间：{{information.shopAgreeTime}}</p>
          <p v-show="returnStatus==6">取消时间：{{information.shopAgreeTime}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Checkbox, CheckboxGroup } from "vant";
import { Uploader } from "vant";

import { CountDown } from "vant";

import { Dialog } from "vant";
// 全局注册
Vue.use(Dialog);

// Popup 动作面板
import { Popup } from "vant";

import { Skeleton } from "vant";

import qs from "qs";

//Toast提示
import { Toast } from "vant";

import {
  GetReturnShopOrderListAsyncAPI,
  GetReturnOrderModelAsyncAPI,
  GetReturnOrderModelByOrderNoAsyncAPI,
  CanceReturnOrder,
} from "@/api/MyApi";

export default {
  name: "RefundOf",
  data() {
    return {
      fileList: [],
      time: 0,
      returnStatus: 0,
      information: {
        // goodsName: "", //商品名称
        // returnReason: "", //退款原因
        // returnPrice: "", //退款金额
        // creatorDate: "", //申请时间
        // returnFinish: "" //拒绝时间l
      },
      merchantsRefuse: [
        //商家拒绝退款原因
      ],
      loading: true,
      errimg: [],
    };
  },
  components: {
    [Uploader.name]: Uploader,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CountDown.name]: CountDown,
    [Dialog.Component.name]: Dialog.Component,
    [Skeleton.name]: Skeleton,
  },
  methods: {
    log() {
      console.log(this.returnStatus);
    },
    jumpNegotiationHistory() {
      this.$router.push({
        path:
          "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/NegotiationHistory",
        query: { id: this.information.id },
      });
    },
    //修改申请
    ModifyApplication() {
      this.$router.push({
        path: "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund",
        query: { ReturnId: this.information.id },
      });
    },
    // 撤销申请
    CancelApplication() {
      Dialog.confirm({
        title: "撤销退款申请后，订单继续",
      })
        .then(() => {
          // on confirm
          // console.log('确认',this.information.id)
          let data = qs.stringify({
            ID: this.information.id,
          });
          CanceReturnOrder(data, "post").then((res) => {
            console.log(res, "退款订单取消");
            if (res.code == 1) {
              Toast("撤销退款申请成功");
              this.$router.push({ path: "/My/AfterSales" });
            }
          });
        })
        .catch(() => {
          // on cancel
          console.log("取消");
        });
    },
    // //获取商品信息
    // GetShopDetails() {
    //   let data = {
    //     OitemIDS: this.$route.query.ID
    //   };
    //   GetReturnShopOrderListAsyncAPI(data, "get").then(res => {
    //     console.log(res, "获取商品信息");
    //     this.information.goodsName = res.data.goodsName;
    //   });
    // },
    //退款订单详情获取
    GetReturnShopOrderListAsync() {
      console.log(this.$route.query.orderNo,"退款单号")
      let data = {
        orderNo: this.$route.query.orderNo,
      };

        // var plist = qs.stringify({ plist: data });


      GetReturnOrderModelByOrderNoAsyncAPI(data, "get").then((res) => {
        console.log(res, "退款订单详情获取");
        this.returnStatus = res.data.returnStatus;
        this.information = res.data;
        this.information.orderOtherData = JSON.parse(res.data.orderOtherData);

        if (this.information.shopRejectiveImgStr) {
          this.errimg = this.information.shopRejectiveImgStr.split(",");
        } else {
        }

        // console.log(this.information);
        var obj = new Date();
        var eTime = new Date(this.information.creatorDate.replace(new RegExp("-","gm"),"/"));
        this.time = 72 * 60 * 60 * 1000 - (obj - eTime);

        console.log(this.time, "this.timethis.timethis.time");
        // let { returnReason, returnPrice, creatorDate, returnFinish } = res.data;
        // this.information = {
        //   returnReason,
        //   returnPrice,
        //   creatorDate,
        //   returnFinish
        // };
        // setTimeout(() => {
        //   this.loading = false;
        // }, 300);
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    // ...
    Dialog.close();
    next();
  },
  mounted() {
    document.title = "退款详情";
    // this.GetReturnOrder();
    this.GetReturnShopOrderListAsync();
  },
};
</script>

<style lang="less" scoped>
.RefundOf {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  /deep/ .van-skeleton__row,
  .van-skeleton__title {
    background-color: #ccc;
  }
  .RefundOf_title {
    width: 100%;
    height: 240px;
    background: @button-auxiliarybackground;
    .RefundOf_title_box {
      height: 185px;
      display: flex;
      align-items: center;
      color: @text-white;
      padding: 0 40px;
      .RefundOf_title_left {
        flex: 1;
        .p1 {
          font-size: 32px;
        }
        .p2 {
          display: flex;
          font-size: 24px;
          padding-top: 12px;
          align-items: baseline;
          /deep/ .van-count-down {
            color: @text-white;
            font-size: 24px;
          }
        }
        .p3 {
          font-size: 24px;
          padding-top: 12px;
          color: @text-white;
        }
      }
      .RefundOf_title_right {
        img {
          width: 200px;
          height: 200px;
        }
      }
    }
  }
  .RefundOf_content {
    margin: -55px 20px 0;
    // 退款路径
    .RefundPath {
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 16px;
      .RefundPath_top {
        display: flex;
        align-items: center;
        span:nth-child(1) {
          font-size: 28px;
          color: @text-colorB;
          flex: 1;
          font-weight: 500;
        }
        span:nth-child(2) {
          font-size: 28px;
          color: @main-color;
          font-weight: bold;
        }
      }
      .RefundPath_bottom {
        display: flex;
        align-items: center;
        padding-top: 16px;
        span:nth-child(1) {
          font-size: 28px;
          color: @text-colorB;
          flex: 1;
          font-weight: 500;
        }
        span:nth-child(2) {
          font-size: 28px;
          color: @text-colorB;
        }
      }
    }
    // 退款关闭
    .RefundClose {
      padding: 20px 24px;
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      margin-bottom: 16px;
      span {
        font-size: 28px;
        line-height: 40px;
        color: @text-colorB;
      }
    }
    // 商家拒绝原因
    .RefuseReason {
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      margin-bottom: 16px;
      .RefuseReason_top {
        padding: 0 24px 30px;
        p {
          display: flex;
          align-items: flex-start;
          padding-top: 28px;
          font-size: 28px;
          color: @text-colorB;
          .s1 {
            line-height: 40px;
          }
          .s2 {
            flex: 1;
            line-height: 40px;
          }
        }
        .RefuseReason_img {
          display: flex;
          align-items: flex-start;
          padding-top: 28px;
          font-size: 28px;
          color: @text-colorB;
          .s1 {
            color: @text-white;
          }
          div {
            flex: 1;
            img {
              width: 88px;
              height: 88px;
              border-radius: 8px;
              margin-left: 12px;
            }
          }
        }
      }
      .RefuseReason_center {
        padding: 20px 24px;
        border-top: 1px solid @base-color;
        border-bottom: 1px solid @base-color;
        p {
          font-size: 24px;
          color: @text-colorC;
        }
        .p2 {
          padding-top: 12px;
        }
      }
      .RefuseReason_bottom {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        button {
          border-radius: 28px;
          padding: 12px 20px;
          background: none;
          margin-right: 24px;
          font-size: 24px;
        }
        .b1 {
          color: @text-colorB;
          border: 1px solid @text-colorB;
        }
        .b2 {
          color: @main-color;
          border: 1px solid @main-color;
        }
      }
    }
    // 协商历史
    .negotiation {
      padding: 0 20px;
      height: 88px;
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      p {
        flex: 1;
        .s1 {
          color: @main-color;
        }
        .s2 {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
        .s3 {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
      }
      img {
        width: 13px;
        height: 24px;
      }
    }
    // 退款须知
    .RefundNotice {
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      margin-bottom: 16px;
      .RefundNotice_top {
        height: 90px;
        padding: 0 24px;
        display: flex;
        align-items: center;
        span {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
      }
      .RefundNotice_center {
        display: flex;
        flex-direction: column;
        padding: 0 24px;
        p {
          padding-bottom: 24px;
          font-size: 20px;
          line-height: 36px;
          font-weight: 400;
          color: @text-colorB;
        }
      }
      .RefundNotice_bottom {
        padding-bottom: 28px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        button {
          border-radius: 28px;
          padding: 12px 20px;
          background: none;
          margin-right: 24px;
          font-size: 24px;
        }
        .b1 {
          color: @text-colorB;
          border: 1px solid @text-colorB;
        }
        .b2 {
          color: @main-color;
          border: 1px solid @main-color;
        }
      }
    }
    // 退款信息
    .RefundInformation {
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      padding: 0 24px 40px;
      .RefundInformation_top {
        height: 90px;
        width: 100%;
        display: flex;
        align-items: center;
        span {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
      }
      .RefundInformation_center {
        display: flex;
        align-items: center;
        .shopimg {
          width: 110px;
          height: 110px;
          border-radius: 8px;
        }
        .shoptext {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-left: 16px;
          p:nth-child(1) {
            font-size: 28px;
            font-weight: 400;
            color: @text-colorB;
            width: 520px;
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p:nth-child(2) {
            font-size: 20px;
            font-weight: 400;
            line-height: 26px;
            color: @text-colorD;
            // padding-top: 12px;
            width: 520px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .RefundInformation_bottom {
        display: flex;
        flex-direction: column;
        margin-top: 8px;
        p {
          font-size: 24px;
          color: @text-colorB;
          font-weight: 400;
          padding-top: 20px;
        }
      }
    }
  }
}
</style>