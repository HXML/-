<template>
  <div class="Bargain">
    <div class="Bargain_box">
      <div class="Bargain_box_top"></div>

      <div class="title" v-if="isMianpd">
        <img src="@/assets/images/1.5_img/1.5_kanjia_wenzi.png" alt />
      </div>

      <div class="Bargain_good">
        <div class="Bargain_good_box">
          <div class="top">
            <img :src="Bargaindata.goodsImg + '?x-oss-process=style/n4'" alt />
            <div class="top_right">
              <p class="p1">{{ Bargaindata.goodsName }}</p>
              <p class="p2">
                <span class="s1"
                  >原价￥{{ barListData.skuPrice | toFixedTow }}</span
                >
                <span class="s2"
                  >最低价￥{{ barListData.skuMinPrice | toFixedTow }}</span
                >
              </p>
            </div>
          </div>
          <div class="bottom">
            <div class="d1" v-if="!isMianpd && !orderId">
              已帮助好友砍价，你已获得低价买资格
            </div>

            <div class="d1" v-if="BargainTineEnd && isMianpd && !orderId">
              砍价时间结束，已减{{
                barListData.bargainirgAmount | toFixedTow
              }}元，去付款吧
            </div>

            <div
              class="d1"
              v-if="!BargainTineEnd && BargainMoney && isMianpd && !orderId"
            >
              恭喜你，已砍到最低价，已减{{
                barListData.bargainirgAmount | toFixedTow
              }}元
            </div>

            <div
              class="d1"
              v-if="!BargainMoney && !BargainTineEnd && isMianpd && !orderId"
            >
              已砍
              <span>{{ barListData.bargainirgAmount | toFixedTow }}</span
              >元，仅差 <span>{{ barListData.surplusPrice | toFixedTow }}</span
              >元砍到最低价
            </div>

            <div class="d1" v-if="orderId && isMianpd">创建订单成功</div>

            <van-progress
              :percentage="percentage"
              pivot-color="#7232dd"
              :show-pivot="false"
            />
          </div>

          <div class="foot">
            <div class="d1">
              <!-- <span>56</span>
              <i>:</i>
              <span>12</span>
              <i>:</i>
              <span>12</span> -->
              <van-count-down :time="time" @finish="finish(1)">
                <template #default="timeData">
                  <span class="block">{{
                    addPreZero(timeData.days * 24 + timeData.hours)
                  }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ addPreZero(timeData.minutes) }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ addPreZero(timeData.seconds) }}</span>
                </template>
              </van-count-down>
            </div>
            <div class="d2">{{ timetext }}</div>
          </div>
        </div>
      </div>

      <div class="Bargain_buttonTow" v-if="!isMianpd && !orderId">
        <button class="b2" @click="friendPay()">我也要低价买</button>
      </div>

      <div
        class="Bargain_buttonTow"
        v-if="BargainTineEnd && isMianpd && !orderId"
      >
        <button class="b1">砍价时间已结束</button>
        <button
          class="b2"
          @click="Gopayment()"
          v-if="timepayshow"
          @finish="finish(2)"
        >
          去付款<van-count-down :time="timepay" />
        </button>
         <button
          class="b2 b3"
          v-if="!timepayshow"
        >
          付款时间已结束
        </button>
      </div>

      <div
        class="Bargain_buttonTow"
        v-if="!BargainTineEnd && BargainMoney && isMianpd && !orderId"
      >
        <button class="b2" @click="Gopayment()">已到最低价，去付款</button>
      </div>

      <div
        class="Bargain_button"
        v-if="!BargainMoney && !BargainTineEnd && isMianpd && !orderId"
      >
        <button class="b1" @click="Linksshare()">邀请好友砍一刀</button>
        <button class="b2" @click="Gopayment()">不砍了，去付款</button>
      </div>

      <div class="Bargain_buttonTow" v-if="orderId && isMianpd">
        <button class="b2" @click="jumpOrderDetails()">查看订单详情</button>
      </div>

      <div class="LowPrice" v-if="!isMianpd">
        <div class="LowPrice_box">
          <div class="top">
            <span>如何低价买好物</span>
          </div>
          <div class="bottom">
            <div class="item">
              <img src="@/assets/images/1.5_img/1.5_kanjia_icon1@2x.png" alt />
              <span>1选择心仪商品</span>
            </div>
            <div class="item">
              <img src="@/assets/images/1.5_img/1.5_kanjia_icon2@2x.png" alt />
              <span>2邀请好友砍价</span>
            </div>
            <div class="item">
              <img src="@/assets/images/1.5_img/1.5_kanjia_icon3@2x.png" alt />
              <span>3砍到最低价购买</span>
            </div>
          </div>
        </div>
      </div>

      <div class="record">
        <div class="record_box">
          <div class="top">
            <span>砍价记录</span>
          </div>
          <div class="bottom">
            <div class="item" v-for="(item, index) in barUserlist" :key="index">
              <div class="left">
                <img :src="item.userImg + '?x-oss-process=style/n4'" alt />
                <p>
                  <span class="s1">{{ item.userName }}</span>
                  <span class="s2">{{ item.name }}</span>
                </p>
              </div>
              <div class="right">
                <img src="@/assets/images/1.5_img/1.5_kanjia_icon1.png" alt />
                <span>砍掉{{ item.userBargainirgPrice | toFixedTow }}元</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="foot_height"></div>

      <van-popup
        v-model="show"
        class="wlbox"
        :close-on-click-overlay="overlayshow"
      >
        <div class="help_box">
          <img :src="tkimg + '?x-oss-process=style/n4'" alt />
          <span>{{ tktextOne }}</span>
          <button class="b1" @click="BargainData()">{{ tktextTwo }}</button>
        </div>
      </van-popup>

      <div class="shareshadow" v-show="shareshadow" @click="sharesclick()">
        <img src="@/assets/images/share.png" alt />
      </div>
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { Progress } from "vant";
import { Popup } from "vant";

import { BargainAPI, GetBargainListDetaiAPI } from "@/api/activity";

import { CountDown } from "vant";

import qs from "qs";

import wx from "weixin-js-sdk";
import { GetWeixinShareInfoAPI } from "@/api/other";

import loading from "@/components/loading";

import { Toast } from "vant";

export default {
  name: "Bargain",
  components: {
    [Progress.name]: Progress,
    [Popup.name]: Popup,
    [CountDown.name]: CountDown,
    loading: loading,
  },
  data() {
    return {
      show: false,
      loadingshow: true, //loading显示
      tktextOne: "恭喜你获得一次为自己砍价的机会", //弹框信息
      tktextTwo: "赶紧砍一刀",
      tkimg: "",
      Bargaindata: {}, //砍价详情
      barListData: {}, //商品详情
      time: 30 * 60 * 60 * 1000, //剩余砍价时间

      timepay: 30 * 60 * 60 * 1000, //剩余付款时间

      BargainTineEnd: false, //砍价时间是否结束

      timetext: "后过期",

      barUserlist: [],
      textList: ["路见不平，拔刀相助", "你一刀我一刀，低价商品抱回家"],

      BargainMoney: false, //已砍价价格是否砍完
      orderId: false, //是否生成订单

      percentage: 10, //进度条的进度

      isMianpd: false, //是否发起砍价用户

      shareshadow: false, //分享

      overlayshow: false, //是否遮罩层点击关闭

      timepayshow: true, //付款倒计时的按钮
    };
  },
  methods: {
     // 跳转去订单详情
    jumpOrderDetails() {
      this.$router.push({
        path: "/My/Myorder/OrderDetails",
        query: { IDs: this.barListData.orderId },
      });
    },
    // 给个位数时间加0
    addPreZero(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },
    // 显示弹框
    showPopup() {
      this.show = true;
    },
    // 参与砍价   分为自己砍和朋友砍价
    BargainData() {
      let data = qs.stringify({
        actId: this.barListData.actId,
        barginId: this.barListData.actBargainirgId,
      });
      BargainAPI(data, "post").then((res) => {
        this.show = false;
        location.reload();
      });
    },
    // 砍价详情
    GetBargainListDeta() {
      if (this.GetUserId()) {
        var a = this.GetUserId();
      }
      let dataTow = {
        barginId: a,
      };
      GetBargainListDetaiAPI(dataTow, "get").then((res) => {
        this.Bargaindata = res.data;
        this.barListData = res.data.barList;
        this.barUserlist = res.data.barUser.map((item) => {
          return Object.assign({}, item, {
            name: this.textList[
              Math.floor(Math.random() * this.textList.length)
            ],
          });
        });
        // console.log(this.barUserlist, "this.barUserlist");
        this.tkimg = this.Bargaindata.mianUserImg;

        // 是否发起砍价用户
        if (this.Bargaindata.isMian == 1) {
          this.isMianpd = true;
          console.log(this.barUserlist,"this.barUserlist")

          if(this.barUserlist.length!=0){
            this.barUserlist[0].name = "继续去邀请好友来帮砍吧";
          }
          
          console.log(this.overlayshow, "是否点击关闭遮罩层");
        } else {
          this.isMianpd = false;
          this.tktextOne = "快来帮我砍价，可获得商品低价买";
          this.tktextTwo = "帮Ta砍价";
        }

        // 该订单是否生成订单
        if (this.barListData.orderId > 0) {
          this.show = false;
          this.orderId = true;
        } else {
          // 是否砍价过
          if (this.Bargaindata.isUseChop == 1) {
            this.show = false;
          } else {
            this.show = true;
          }
        }

        //活动倒计时
        var obj = new Date();
        var eTime = new Date(
          this.Bargaindata.endTime.replace(new RegExp("-", "gm"), "/")
        );
        this.time = eTime - obj;
        if (this.time <= 0) {
          this.BargainTineEnd = true;
          this.timetext = "时间到";

          // 付款倒计时
          var objTow = new Date();
          var eTimeTow = new Date(
            this.Bargaindata.lastPayTime.replace(new RegExp("-", "gm"), "/")
          );
          this.timepay = eTimeTow - objTow;

          if (this.timepay <= 0) {
            this.timepayshow = false;
          }
        }

        // 砍价的砍价砍完了
        if (this.barListData.surplusPrice == 0) {
          this.BargainMoney = true;
          this.show = false;
        }

        // 进度条的进度比
        this.percentage =
          (this.barListData.bargainirgAmount /
            (this.barListData.bargainirgAmount +
              this.barListData.surplusPrice)) *
          100;
        console.log(this.percentage, "进度条的进度");

        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.sharesdk();
        } else {
          console.log("没有在微信环境");
        }

        this.loadingshow = false;
      });
    },
    sharesdk() {
      let Name = window.localStorage.getItem("nickName");
      let barginId = this.barListData.actBargainirgId;

      let link =
        `${window.location.href.split("#")[0]}` +
        "#/GoodsDetails/Bargain?barginId=" +
        barginId;

      console.log(link, "link");

      GetWeixinShareInfoAPI({ url: `${window.location.href}` }, "get").then(
        (res) => {
          console.log(res, "ressssssssssssssssss");
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"], // 必填，需要使用的JS接口列表
          });
          //通过error接口处理失败验证
          wx.error(function (res) {
            console.log(res, "通过error接口0000处理失败验证");
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          wx.ready(function () {
            // console.log(1111111)
            //需在用户可能点击分享按钮前就先调用

            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）最新接口
            wx.onMenuShareAppMessage({
              title: "兆客易购", // 分享标题
              desc: Name + "邀请您进入兆客易购帮忙砍价",
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                "http://img.zk-mall.net/prod/logo.png?x-oss-process=style/b3", // 分享图标
              success: function () {
                // 设置成功
                console.log(res, "自定义“分享给朋友");
              },
            });

            wx.onMenuShareTimeline({
              title: "兆客易购", // 分享标题
              desc: Name + "邀请您进入兆客易购",
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                "http://img.zk-mall.net/prod/logo.png?x-oss-process=style/b3", // 分享图标
              success: function () {
                // 设置成功
                console.log(res, "自定义“分享给朋友圈");
              },
            });
          });
        }
      );
    },
    // 链接分享
    Linksshare() {
      if (window.localStorage.getItem("isWeiXin") == "true") {
        this.shareshadow = true;
      } else {
        Toast("根据你浏览器的分享分享链接邀请好友砍价");
      }
    },
    sharesclick() {
      this.shareshadow = false;
    },
    GetUserId() {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI("barginId").replace(/[\.\+\*]/g, "\\$&") +
              "(?:\\=([^&]*))?)?.*$",
            "i"
          ),
          "$1"
        )
      );
    },
    // 我也要低价买
    friendPay() {
      this.$router.replace({
        path: "/GoodsDetails",
        query: { ID: this.Bargaindata.goodsId },
      });
    },
    // 倒计时结束时触发
    finish(index) {
      if (index == 1) {
        this.BargainTineEnd = true;
        this.timetext = "时间到";
        // 付款倒计时
        var objTow = new Date();
        var eTimeTow = new Date(
          this.Bargaindata.lastPayTime.replace(new RegExp("-", "gm"), "/")
        );
        this.timepay = eTimeTow - objTow;
      } else {
        this.timepayshow = false;
      }
    },
    //去付款
    Gopayment() {
      let id = this.barListData.skuId;
      this.$router.push({
        path: "/GoodsDetails/OrderConfirmation",
        query: { id: id, num: 1 },
      });
    },
  },
  mounted() {
    this.GetBargainListDeta();
  },
};
</script>

<style lang="less" scoped>
.Bargain {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: url("../../../../assets/images/1.5_img/i.5_kanjia_bg.jpg")
    no-repeat;
  background-size: 100% 100%;
  .Bargain_box {
    padding: 0 20px;
    .Bargain_box_top {
      height: 30px;
    }
    .title {
      width: 100%;
      text-align: center;
      img {
        width: 70%;
        margin: 0px 0 30px;
      }
    }
    .Bargain_good {
      width: 100%;
      //   height: 490px;
      background: #fef9f2;
      border-radius: 16px;
      box-shadow: 0px 4px 10px 0px rgba(248, 70, 1, 0.24);
      .Bargain_good_box {
        padding: 30px 40px 0;
        .top {
          display: flex;
          align-items: flex-start;
          img {
            width: 188px;
            height: 188px;
            border-radius: 16px;
          }
          .top_right {
            flex: 1;
            padding-left: 24px;
            .p1 {
              font-size: 26px;
              color: #3c291f;
              line-height: 38px;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              margin-top: 12px;
            }
            .p2 {
              display: flex;
              flex-direction: column;
              margin-top: 30px;
              .s1 {
                color: #8f877d;
                font-size: 24px;
              }
              .s2 {
                font-size: 28px;
                color: #f42636;
                font-weight: 700;
                padding-top: 8px;
              }
            }
          }
        }
        .bottom {
          margin: 70px 0 40px;
          .d1 {
            font-size: 26px;
            color: #3c291f;
            font-weight: 700;
            margin-bottom: 28px;
            span {
              color: rgba(244, 38, 54, 1);
              font-size: 36px;
            }
          }
          .van-progress {
            height: 22px;
            border-radius: 11px;
            background: #fce6c8;
            /deep/ .van-progress__portion {
              background: linear-gradient(
                to right,
                rgba(248, 54, 0, 1),
                rgba(255, 137, 73, 1)
              );
            }
          }
        }
        .foot {
          background: rgba(251, 181, 130, 0.8);
          border-radius: 20px 20px 0px 0px;
          display: flex;
          align-items: center;
          width: 360px;
          height: 60px;
          justify-content: center;
          margin: auto;
          .d1 {
            display: flex;
            align-items: center;

            .van-count-down {
              display: flex;
              align-items: center;
              .block {
                font-size: 30px;
                min-width: 42px;
                padding: 0 4px;
                height: 35px;
                background: #fdf6f1;
                border-radius: 4px;
                color: rgba(253, 116, 54, 1);
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .colon {
                font-style: normal;
                margin: 0 8px;
                color: #fff;
                font-size: 28px;
              }
            }
          }
          .d2 {
            font-weight: 700;
            color: #fd7436;
            padding-left: 24px;
          }
        }
      }
    }
    .Bargain_button {
      margin: 42px 0 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .b1 {
        width: 546px;
        height: 80px;
        background: #f83701;
        border-radius: 40px;
        box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
        font-size: 30px;
        font-weight: 700;
        color: #ffffff;
        border-bottom: 8px solid rgba(224, 16, 0, 1);
        animation: k2 2s linear 0s infinite;
      }
      .b2 {
        margin-top: 32px;
        width: 546px;
        height: 80px;
        background: rgba(255, 231, 27, 1);
        border-radius: 40px;
        box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
        color: #fb3627;
        font-size: 30px;
        font-weight: 700;
        border-bottom: 8px solid rgba(235, 208, 0, 1);
      }
    }
    .Bargain_buttonTow {
      margin: 42px 0 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .b1 {
        width: 546px;
        height: 80px;
        background: #f83701;
        border-radius: 40px;
        box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
        font-size: 30px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.5);
        border-bottom: 8px solid rgba(224, 16, 0, 1);
        // animation: k2 2s linear 0s infinite;
      }
      .b2 {
        margin-top: 32px;
        width: 546px;
        height: 80px;
        background: rgba(255, 231, 27, 1);
        border-radius: 40px;
        box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
        color: #fb3627;
        font-size: 30px;
        font-weight: 700;
        border-bottom: 8px solid rgba(235, 208, 0, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        .van-count-down {
          font-size: 30px;
          color: #fb3627;
          padding-left: 30px;
        }
      }
      .b3{
         background: rgba(255, 231, 27, 0.5);
      }
    }
    .LowPrice {
      width: 100%;
      background: #fef9f2;
      border-radius: 16px;
      box-shadow: 0px 4px 10px 0px rgba(248, 70, 1, 0.24);
      margin-bottom: 26px;
      .LowPrice_box {
        padding: 30px 40px 40px;
        .top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 16px;
          span {
            font-size: 38px;
            color: rgba(62, 52, 46, 1);
            font-weight: 700;
          }
        }
        .bottom {
          width: 100%;
          display: flex;
          margin-top: 50px;
          .item {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
              width: 72px;
            }
            span {
              font-size: 26px;
              color: #3c291f;
              padding-top: 40px;
            }
          }
        }
      }
    }
    .record {
      width: 100%;
      background: #fef9f2;
      border-radius: 16px;
      box-shadow: 0px 4px 10px 0px rgba(248, 70, 1, 0.24);
      .record_box {
        padding: 30px 40px 20px;
        .top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 16px;
          span {
            font-size: 38px;
            color: rgba(244, 38, 54, 1);
            font-weight: 700;
          }
        }
        .bottom {
          width: 100%;
          .item {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 16px 0;
            .left {
              flex: 1;
              display: flex;
              align-items: center;
              img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
              }
              p {
                display: flex;
                flex-direction: column;
                flex: 1;
                padding-left: 24px;
                .s1 {
                  font-size: 32px;
                  color: #3e342e;
                  font-weight: 700;
                }
                .s2 {
                  font-size: 24px;
                  color: rgba(62, 52, 46, 0.5);
                  padding-top: 12px;
                }
              }
            }
            .right {
              display: flex;
              align-items: center;
              img {
                width: 29px;
              }
              span {
                font-size: 28px;
                color: #3e342e;
                padding-left: 4px;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
    .foot_height {
      height: 100px;
    }
  }
  // .wlbox{
  //   width: 100%;
  //   height: 100%;
  //   background: rgba(0, 0, 0, 0.5);
  //   position: fixed;
  //   // top: 0;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  // }
  .wlbox {
    background: none;
  }

  .help_box {
    width: 552px;
    height: 688px;
    background: url(../../../../assets/images/1.5_img/1.5_kanjia_bangkan_bg@2x.png)
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 102px 0 47px;
      border: 4px solid #f7a97e;
    }
    span {
      color: #fff;
      font-size: 38px;
      display: flex;
      width: 80%;
      text-align: center;
      line-height: 48px;
    }
    .b1 {
      margin-top: 135px;
      width: 500px;
      height: 80px;
      background: rgba(255, 231, 27, 1);
      border-radius: 40px;
      box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
      color: #fb3627;
      font-size: 30px;
      font-weight: 700;
      border-bottom: 8px solid rgba(235, 208, 0, 1);
    }
  }

  .shareshadow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    left: 0;
    img {
      width: 60%;
      position: absolute;
      top: 10%;
      right: 10%;
    }
  }
  /deep/ .van-overlay {
    background-color: rgba(0, 0, 0, 1);
  }
}

/* 闪动 */
@keyframes k2 {
  0% {
    opacity: 1;
    transform: scale(1, 1);
  }
  50% {
    opacity: 1;
    transform: scale(0.9, 0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}
</style>