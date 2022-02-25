<template>
  <div class="RefundOf">
    <div class="RefundOf_title">
      <!-- 正在退款中 -->
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

      <!-- 商家已同意  填写物流单号 -->
      <div class="RefundOf_title_box" v-show="returnStatus==2">
        <div class="RefundOf_title_left">
          <p class="p1">商家已同意，请尽快寄回退货商品</p>
          <p class="p2">
            还剩：
            <van-count-down :time="timeTow" format="DD 天 HH 时 mm 分 ss 秒" />
            <span>（超时未寄回，自动撤销申请）</span>
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon9@2x.png" alt />
        </div>
      </div>

      <!-- 等待商家签收并退款  用户退货商品发货  等待商家签收-->
      <div class="RefundOf_title_box" v-show="returnStatus==3">
        <div class="RefundOf_title_left">
          <p class="p1">等待商家签收并退款</p>
          <p class="p2">
            还剩：
            <van-count-down :time="timeThree" format="DD 天 HH 时 mm 分 ss 秒" />
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon9@2x.png" alt />
        </div>
      </div>

      <!-- 退款成功 -->
      <div class="RefundOf_title_box" v-show="returnStatus==5">
        <div class="RefundOf_title_left">
          <p class="p1">商家已签收，退款成功</p>
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
            <!-- 还剩：
            <van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" /> -->
          </p>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon6@2x.png" alt />
        </div>
      </div>

      <!-- 用户撤销退款 -->
      <div class="RefundOf_title_box" v-show="returnStatus==6">
        <div class="RefundOf_title_left">
          <p class="p1">退款关闭</p>
          <span>{{information.shopAgreeTime}}</span>
        </div>
        <div class="RefundOf_title_right">
          <img src="@/assets/images/dingdan/dingdan_icon8@2x.png" alt />
        </div>
      </div>
    </div>
    <div class="RefundOf_content">
      <!-- tracking number 等待填写物流单号 -->
      <div class="TrackingNumber" v-show="returnStatus==2">
        <div class="TrackingNumber_top">
          <span>商品寄回地址</span>
          <span>*需填写物流单号才算寄回</span>
        </div>
        <div class="TrackingNumber_center">
          <p>
            收 件 人：
            <span>{{information.linkMan}}</span>
          </p>
          <p>
            收件电话：
            <span>{{information.linkTel}}</span>
          </p>
          <p>
            退款地址：
            <span>{{information.returnAddress}}</span>
          </p>
          <p>
            退款说明：
            <span>{{information.shopReturnRmk}}</span>
          </p>
        </div>
        <div class="TrackingNumber_bottom">
          <button class="b1" @click="Fill()">填写物流单号</button>
        </div>
      </div>

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
              <img :src="item+'?x-oss-process=style/b1'" alt v-for="(item,index) in errimg" :key="index"/>
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
      <div class="RefundNotice" v-show="returnStatus==1||returnStatus==2||returnStatus==3">
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
        v-show="returnStatus==1||returnStatus==2||returnStatus==3||returnStatus==5||returnStatus==7||returnStatus==6"
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
          <p
            v-show="returnStatus==1||returnStatus==2||returnStatus==3||returnStatus==5||returnStatus==7||returnStatus==6"
          >退款原因：{{information.returnReason}}</p>
          <p
            v-show="returnStatus==1||returnStatus==2||returnStatus==3||returnStatus==5||returnStatus==7||returnStatus==6"
          >退款金额：￥{{information.returnPrice}}</p>
          <p
            v-show="returnStatus==1||returnStatus==2||returnStatus==3||returnStatus==5||returnStatus==7||returnStatus==6"
          >申请时间：{{information.creatorDate}}</p>
          <p
            v-show="returnStatus==2||returnStatus==3||returnStatus==5"
          >同意时间：{{information.shopAgreeTime}}</p>
          <p v-show="returnStatus==7||returnStatus==6">拒绝时间：{{information.shopAgreeTime}}</p>
          <p
            v-show="returnStatus==3||returnStatus==5"
          >物流填写：{{information.userInputToTime}}</p>
          <p v-show="returnStatus==3||returnStatus==5">物流公司：{{information.transCo}}</p>
          <p v-show="returnStatus==3||returnStatus==5">
            物流单号：{{information.transNo}}
            <span @click="ShowExpress()">查看物流</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 弹框 填写物流信息 -->
    <van-overlay :show="show" @click="gbshow()" />
    <div class="fillbox" v-show="show">
      <div class="fillbox_top">
        <span>填写物流单号</span>
      </div>
      <div class="fillbox_center">
        <div :class="d1show?'d1':'d1 d1active'">
          <input
            type="text"
            placeholder="选择物流公司"
            v-model="companyname"
            @focus="PhoneFocus('1')"
            @blur="PhoneBlur('1')"
          />
          <div @click="toggle">
            <img :src="jtimg" alt :class="jt?'imgactive':''" />
          </div>
        </div>
        <transition name="fade">
          <div class="d1_dw" v-show="isshow">
            <ul>
              <li v-for="(item,index) in companydata" :key="index" @click="xzcompany(item.coName)">
                <img :src="item.companyimg" alt />
                <span>{{item.coName}}</span>
              </li>
            </ul>
          </div>
        </transition>

        <div :class="d1show1?'d2':'d2 d2active'">
          <input
            type="text"
            placeholder="输入物流单号"
            @focus="PhoneFocus('2')"
            @blur="PhoneBlur('2')"
            v-model="OrderNo"
            maxlength="30"
          />
        </div>
      </div>
      <div class="fillbox_bottom">
        <button :class="companyname&&OrderNo?'buttonactive':''" @click="submit()">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Checkbox, CheckboxGroup } from "vant";
import { Uploader } from "vant";

import { Overlay } from "vant";

import { CountDown } from "vant";

import qs from "qs";

import { Dialog } from "vant";
// 全局注册
Vue.use(Dialog);

// Popup 动作面板
import { Popup } from "vant";
//Toast提示
import { Toast } from "vant";

import {
  GetReturnShopOrderListAsyncAPI,
  GetReturnOrderModelAsyncAPI,
  GetReturnOrderModelByOrderNoAsyncAPI,
  BusExpListAPI,
  UpdateReturnShopOrderTransAsyncAPI,
  CanceReturnOrder
} from "@/api/MyApi";

export default {
  name: "RefundOf",
  data() {
    return {
      fileList: [],
      time: 0,
      timeTow:0,
      timeThree:0,
      show: false,
      isshow: false,
      companydata: [],
      companyname: "", //选择公司名称
      OrderNo: "", //填写物流单号
      d1show: true, //input1的光标变量
      d1show1: true, //input2的光标变量
      jtimg: require("@/assets/images/mine_select@2x.png"),
      jt: false,
      djarrow: true,
      returnStatus: 0,
      information: {
        // goodsName: "", //商品名称
        // returnReason: "", //退款原因
        // returnPrice: "", //退款金额
        // creatorDate: "", //申请时间
        // returnFinish: "", //拒绝时间 || 同意时间
        // logisticsDate: "0000-0000-0000", //物流填写时间
        // logisticscompany: "顺丰", //物流公司
        // logisticsOrder: "111111111111", //物流单号
        // linkMan: "", //名称
        // linkTel: "", //电话
        // returnAddress: "", //地址
        // // transCo:'',//物流公司名称
        // // transNo:'',//物流公司编号
        // id: ""
      },
      BusExpList: [],
       errimg:[]
    };
  },
  components: {
    [Uploader.name]: Uploader,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CountDown.name]: CountDown,
    [Overlay.name]: Overlay
  },
  methods: {
    //   填写物流单号
    Fill() {
      this.show = true;
      document
        .getElementsByTagName("body")[0]
        .setAttribute("style", "overflow:hidden");
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "position:fixed;");
    },
   // 跳转去快递100查看物流
    ShowExpress() {
      window.location.href =
        "https://m.kuaidi100.com/app/query/?coname=indexall&nu=" +
        this.information.transNo;
    },
    xzcompany(companyname) {
      this.companyname = companyname;
      this.isshow = !this.isshow;
    },
    // 点击阴影背景关闭弹框
    gbshow() {
      this.show = false;
      document
        .getElementsByTagName("body")[0]
        .setAttribute("style", "overflow:auto");
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "position:initial;");
    },
    // 选择快递公司
    toggle: function() {
      //   if (this.djarrow) {
      //     this.PhoneFocus(1);
      //     this.djarrow=false
      //   } else {
      //     this.PhoneBlur(1);
      //     this.djarrow=true
      //   }
      this.jt = !this.jt;
      this.isshow = !this.isshow;
    },
    // 触发两个input焦点
    PhoneFocus(parameter) {
      if (parameter == 1) {
        this.d1show = false;
      } else {
        this.d1show1 = false;
      }
    },
    // 失去两个input焦点
    PhoneBlur(parameter) {
      if (parameter == 1) {
        this.d1show = true;
      } else {
        this.d1show1 = true;
      }
    },
    //
    jumpNegotiationHistory() {
      this.$router.push({
        path:
          "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/NegotiationHistory",
        query: { id: this.information.id }
      });
    },
    //点击提交
    submit() {
      this.show = false;
      document
        .getElementsByTagName("body")[0]
        .setAttribute("style", "overflow:auto");
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "position:initial;");

      this.POSTUpdateReturnShopOrderTransAsync();
      this.returnStatus = 3;
    },
    //获取物流公司列表
    GetBusExpList() {
      BusExpListAPI(this.BusExpList, "get").then(res => {
        this.companydata = res.data;
        console.log(res, "获取物流公司列表");
      });
    },
    //退款订单详情获取
    GetReturnShopOrderListAsync() {
      // console.log(this.$route.query.orderNo);
      let data = {
        OrderNo: this.$route.query.orderNo
      };
      GetReturnOrderModelByOrderNoAsyncAPI(data, "get").then(res => {
        console.log(res, "退款订单详情获取");
        this.returnStatus = res.data.returnStatus;
        this.information = res.data;

        this.information.orderOtherData = JSON.parse(res.data.orderOtherData);

        // this.errimg=this.information.shopRejectiveImgStr.split(',')
         if(this.information.shopRejectiveImgStr){
            this.errimg=this.information.shopRejectiveImgStr.split(',')
         }else{

         }

        var obj = new Date();

        var eTime = new Date(this.information.creatorDate.replace(new RegExp("-","gm"),"/"));
        this.time = 72 * 60 * 60 * 1000 - (obj - eTime);


        var eTimeTow = new Date(this.information.shopAgreeTime.replace(new RegExp("-","gm"),"/"));
        this.timeTow = 72 * 60 * 60 * 1000 - (obj - eTimeTow);

        var eTimeThree = new Date(this.information.userInputToTime.replace(new RegExp("-","gm"),"/"));
        this.timeThree = 240 * 60 * 60 * 1000 - (obj - eTimeThree);


      });
    },
    //退款订单快递单号填写
    POSTUpdateReturnShopOrderTransAsync() {
      var data = qs.stringify({
        ID: this.information.id,
        TransCo: this.companyname,
        TransNo: this.OrderNo
      });

      UpdateReturnShopOrderTransAsyncAPI(data, "post")
        .then(res => {
          console.log(res, "退款订单快递单号填写");
        })
        .then(res => {
          this.GetReturnShopOrderListAsync();
        })
        .then(res => {
          this.returnStatus = 3;
        });
    },
    //修改申请
    ModifyApplication() {
      this.$router.push({
        path: "/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund",
        query: { ReturnId: this.information.id }
      });
    },
    // 撤销申请
    CancelApplication() {
      Dialog.confirm({
        title: "撤销退款申请后，订单继续"
      })
        .then(() => {
          // on confirm
          // console.log('确认',this.information.id)
          let data = qs.stringify({
            ID: this.information.id
          });
          CanceReturnOrder(data, "post").then(res => {
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
    }
  },
  mounted() {
    document.title = "退款详情";
    // this.GetShopDetails();
    // this.GetReturnOrder();
    this.GetReturnShopOrderListAsync();
    this.GetBusExpList();
  }
};
</script>

<style lang="less" scoped>
.RefundOf {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .RefundOf_title {
    width: 100%;
    // height: 240px;
    height: 250px;
    background: @button-auxiliarybackground;
    .RefundOf_title_box {
      // height: 185px;
      height: 195px;
      display: flex;
      align-items: center;
      color: @text-white;
      padding: 0 40px;
      .RefundOf_title_left {
        flex: 1;
        .p1 {
          font-size: 32px;
          line-height: 40px;
        }
        .p2 {
          display: flex;
          font-size: 24px;
          padding-top: 12px;
          align-items: baseline;
          flex-wrap: wrap;
          line-height: 32px;
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
          .s2 {
            flex: 1;
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
    // 等待填写物流单号
    .TrackingNumber {
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      margin-bottom: 16px;
      .TrackingNumber_top {
        height: 90px;
        padding: 0 24px;
        display: flex;
        align-items: center;
        span:nth-child(1) {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
        span:nth-child(2) {
          font-size: 20px;
          color: @main-color;
          font-weight: 500;
          padding-left: 8px;
        }
      }
      .TrackingNumber_center {
        display: flex;
        flex-direction: column;
        padding: 0 24px;
        p {
          padding-bottom: 16px;
          font-size: 20px;
          line-height: 36px;
          font-weight: 400;
          color: @text-colorC;
          span {
            font-size: 24px;
            color: @text-colorA;
            font-weight: 400;
          }
        }
      }
      .TrackingNumber_bottom {
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
          color: @text-white;
          border: none;
          background: @button-mainbackground;
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
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
             height: 50px;
             line-height: 50px;
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
          span {
            font-size: 24px;
            padding-left: 12px;
            color: @main-color;
            text-decoration: underline;
          }
        }
      }
    }
  }
  //填写物流单号的弹框
  .fillbox {
    width: 90%;
    height: 540px;
    background: @text-white;
    border-radius: 16px;
    position: fixed;
    top: 20%;
    left: 5%;
    z-index: 99;
    .fillbox_top {
      height: 120px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 32px;
        font-weight: bold;
        color: @text-colorA;
      }
    }
    .fillbox_center {
      display: flex;
      flex-direction: column;
      padding: 0 20px;
      margin: auto;
      font-size: 28px;
      position: relative;
      .d1 {
        width: 640px;
        height: 88px;
        background: @base-color;
        border: 1px solid @base-color;
        border-radius: 44px;
        display: flex;
        align-items: center;
        z-index: 100;
        input {
          background: @base-color;
          border: none;
          height: 60px;
          flex: 4;
          border-radius: 44px;
          padding-left: 28px;
          caret-color: @main-color;
        }
        div {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          img {
            width: 24px;
            height: 13px;
            padding-right: 20px;
          }
          .imgactive {
            transform: rotateX(180deg);
          }
        }
      }
      .d1active {
        border: 1px solid @main-color !important;
      }
      .d1_dw {
        position: absolute;
        top: 18px;
        height: 600px;
        width: 640px;
        background: @text-white;
        border: 1px solid rgba(177, 182, 195, 0.2);
        box-shadow: 0px 5px 16px 0px rgba(0, 0, 0, 0.22);
        border-radius: 66px 66px 16px 16px;
        z-index: 99;
        padding-top: 70px;
        padding-bottom: 10px;

        overflow-y: auto;
        ul {
          width: 100%;
          //    height: 600px;
          display: flex;
          flex-wrap: wrap;
          li {
            width: 318px;
            height: 100px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid @base-color;
            img {
              width: 60px;
              height: 60px;
              border-radius: 8px;
              margin-left: 28px;
            }
            span {
              font-size: 28px;
              font-weight: 400;
              color: @text-colorA;
              padding-left: 20px;
            }
          }
          li:nth-child(odd) {
            width: 318px;
            border-right: 1px solid @base-color;
          }
        }
      }
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter,
      .fade-leave-active {
        opacity: 0;
      }
      .d2 {
        width: 640px;
        height: 88px;
        background: @base-color;
        border: 1px solid @base-color;
        border-radius: 44px;
        display: flex;
        align-items: center;
        margin-top: 24px;
        input {
          background: @base-color;
          border: none;
          height: 60px;
          width: 80%;
          border-radius: 44px;
          padding-left: 28px;
          caret-color: @main-color;
        }
      }
      .d2active {
        border: 1px solid @main-color !important;
      }
    }
    .fillbox_bottom {
      width: 100%;
      margin-top: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        width: 320px;
        height: 80px;
        background: @text-colorD;
        opacity: @opacityfive;
        border-radius: 40px;
        border: none;
        font-size: 32px;
        font-weight: 500;
        color: @text-white;
        pointer-events: none;
      }
      .buttonactive {
        opacity: 1;
        background: @button-mainbackground;
        pointer-events: unset;
      }
    }
  }
}
</style>