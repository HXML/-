<template>
  <div class="prizePage">
    <div class="wheel-wrapper">
      <img
        class="wheel-pointer"
        @click="onClickRotate()"
        src="@/assets/images/zk1.1/start.png"
      />
      <div
        class="wheel-bg"
        :class="{ freeze: freeze }"
        :style="`transform: rotate(${wheelDeg}deg)`"
      >
        <div class="prize-list">
          <div
            class="prize-item-wrapper"
            v-for="(item, index) in prizeList"
            :key="index"
          >
            <div
              class="prize-item"
              :style="`transform: rotate(${
                (360 / prizeList.length) * index
              }deg)`"
            >
              <div>
                <img :src="item.icon" class="prize-icon2 mt-60" />
              </div>
              <div class="prize-name">{{ item.Name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="reNumber">
      今日剩余
      <span class="num">{{ prizedNumber }}</span> 次
    </div>

    <van-popup v-model="showContent">
      <div class="bgImg">
        <div class="flex2 aic">
          <span class="mt-60 cou_title">{{ popData.name }}</span>
          <div class="cou_val">
            <span class="cou_num">{{ popData.priceNumber }}</span
            >元
          </div>
          <span class="cou_btn mt-16" @click="ToOtherPage(0)">立即领取</span>
        </div>
      </div>
    </van-popup>
    <div class="shareContent">
      <van-popup v-model="showShare">
        <div class="shareImg"></div>
      </van-popup>
    </div>
    <span class="fixBtn" @click="ToOtherPage(0)">我的</span>
    <span class="fixBtn" @click="ToOtherPage(1)" style="top: 19vw">分享</span>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import { GetWeixinShareInfoAPI } from "@/api/other";
import { baseImgUrl } from "@/common/js/commonUrl.js";
import Vue from "vue";
import { Dialog } from "vant";
import { IsWeixinOrAlipay } from "@/common/js/environment.js";
// 全局注册
Vue.use(Dialog);
import {
  PlayStartAPI,
  ShareNtableGameAPI,
  ResidueJoinNumberAPI,
} from "@/api/index";
import { IsUserLoginAPI } from "@/api/commonApi";
//Toast提示
import { Toast, Popup } from "vant";
export default {
  name: "bigWheel",
  data() {
    return {
      isUserLogin: false, //判断是否登录
      showShare: false,
      showContent: false,
      popData: {
        name: "",
        priceNumber: "",
      },
      prizedNumber: 3,
      freeze: false,
      rolling: false, //大转盘是否转动
      wheelDeg: 0,
      prizeNumber: 8,
      index: 0, //判断是优惠券还是红包
      prizeList: [
        {
          pType: 1,
          id: 1,
          icon: require("@/assets/images/zk1.1/prize1.png"),
          Name: "神券",
        },
        {
          pType: 2,
          id: 4,
          icon: require("@/assets/images/zk1.1/prize2.png"),
          Name: "红包",
        },
        {
          pType: 1,
          FaceValue: 10,
          id: 2,
          icon: require("@/assets/images/zk1.1/prize1.png"),
          Name: "神券",
        },
        {
          pType: 2,
          id: 5,
          icon: require("@/assets/images/zk1.1/prize2.png"),
          Name: "红包",
        },
        {
          pType: 1,
          id: 3,
          icon: require("@/assets/images/zk1.1/prize1.png"),
          Name: "神券",
        },
        {
          pType: 2,
          id: 6,
          icon: require("@/assets/images/zk1.1/prize2.png"),
          Name: "红包",
        },
      ],

      couponsList: [], //本地优惠券列表
      envelopeList: [], //本地红包列表
    };
  },
  components: {
    [Popup.name]: Popup,
  },
  mounted() {
    IsUserLoginAPI()
      .then((res) => {
        console.log(res.data, "ress");
        this.isUserLogin = res.data;
      })
      .then(() => {
        IsWeixinOrAlipay();
        this.getNumber();
        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.sharesdk();
        }
        if (window.localStorage.getItem("CouponTimes")) {
          console.log("现在是有缓存次数的");
        } else {
          window.localStorage.setItem("CouponTimes", 3);
          this.prizedNumber=3
        }
      });
  },
  methods: {
    ToOtherPage(e) {
      if (e == 0) {
        console.log(this.index, "是优惠券还是红包");

        if (this.index == 1) {
          this.$router.push({
            name: "prizeList",
            query: { index: this.index },
          });
        } else {
          this.$router.push({
            name: "prizeList",
            query: { index: this.index },
          });
        }
      } else if (e == 1) {
        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.showShare = true;
        } else {
          Toast("根据您的浏览器环境去进行分享");
          let that = this;
          // alert("请分享");
          Dialog.alert({
            title: "标题",
            message: "请先分享",
          }).then(() => {
            // on close
            // 判断分享
            var hidden, state, visibilityChange;
            if (typeof document.hidden !== "undefined") {
              hidden = "hidden";
              visibilityChange = "visibilitychange";
              state = "visibilityState";
            } else if (typeof document.mozHidden !== "undefined") {
              hidden = "mozHidden";
              visibilityChange = "mozvisibilitychange";
              state = "mozVisibilityState";
            } else if (typeof document.msHidden !== "undefined") {
              hidden = "msHidden";
              visibilityChange = "msvisibilitychange";
              state = "msVisibilityState";
            } else if (typeof document.webkitHidden !== "undefined") {
              hidden = "webkitHidden";
              visibilityChange = "webkitvisibilitychange";
              state = "webkitVisibilityState";
            }
            document.addEventListener(
              visibilityChange,
              function () {
                if (document.hidden) {
                  // 监听分享成功
                  ShareNtableGameAPI().then((res) => {
                    console.log(res, "sss");
                    if (res.code == 1) {
                      that.getNumber();
                    }
                  });
                }
              },
              false
            );
          });
        }
      }
    },
    sharesdk() {
      let that = this;
      if (this.isUserLogin) {
        var Name = window.localStorage.getItem("nickName");
      } else {
        var Name = "好友";
      }
      let link = window.location.href;
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
            console.log(baseImgUrl, "baseImgUrlbaseImgUrl");
            //需在用户可能点击分享按钮前就先调用
            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）最新接口
            wx.onMenuShareAppMessage({
              title: "兆客易购", // 分享标题
              desc: Name + "邀请您进入兆客易购抽奖",
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                baseImgUrl + "/bigWheelShareImg.png?x-oss-process=style/b5", // 分享图标
              trigger: function () {
                console.log("点击分享");
              },
              success: function () {
                console.log("分享成功");
                // ShareNtableGameAPI().then((res) => {
                //   console.log(res, "sss");
                //   if (res.code == 1) {
                //     that.getNumber();
                //   }
                // });
                if (this.isUserLogin) {
                  ShareNtableGameAPI().then((res) => {
                    console.log(res, "sss");
                    if (res.code == 1) {
                      that.getNumber();
                    }
                  });
                  return false
                }
              },
              cancel: function () {
                console.log("分享取消");
              },
              fail: function () {
                console.log("分享失败");
              },
            });

            wx.onMenuShareTimeline({
              title: "兆客易购", // 分享标题
              desc: Name + "邀请您进入兆客易购抽奖",
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                baseImgUrl + "/bigWheelShareImg.png?x-oss-process=style/b5", // 分享图标
              trigger: function () {
                console.log("点击分享");
              },
              success: function () {
                console.log("分享成功");
                // ShareNtableGameAPI().then((res) => {
                //   console.log(res, "sss");
                //   if (res.code == 1) {
                //     that.getNumber();
                //   }
                // });
                 if (this.isUserLogin) {
                  ShareNtableGameAPI().then((res) => {
                    console.log(res, "sss");
                    if (res.code == 1) {
                      that.getNumber();
                    }
                  });
                  return false;
                }
              },
              cancel: function () {
                console.log("分享取消");
              },
              fail: function () {
                console.log("分享失败");
              },
            });
          });
        }
      );
    },
    getNumber() {
      if (!this.isUserLogin) {
        this.prizedNumber = window.localStorage.getItem("CouponTimes");
        return false;
      }
      ResidueJoinNumberAPI().then((res) => {
        console.log(res);
        this.prizedNumber = res.data;
      });
    },
    onClickRotate() {
      if (!this.isUserLogin) {
        //缓存情况下
        if (this.rolling) return;
        this.rolling = true;
        PlayStartAPI().then((res) => {
          if (window.localStorage.getItem("CouponTimes") == 0) {
            console.log("今天已经没有了抽奖次数");
            Toast({
              duration: 1000, // 持续展示 toast
              position: "bottom",
              className: "GoodDetailTost",
              forbidClick: false, //显示弹窗之后是否能够点击背景 可以
              message: "今日机会已用完！",
            });
            return;
          } else {
            this.prizedNumber = window.localStorage.getItem("CouponTimes") - 1;
            window.localStorage.setItem("CouponTimes", this.prizedNumber);
            const { wheelDeg, prizeList } = this;
            let prizedNum = 0;
            res.data.prizs.awardType == 2 ? (prizedNum = 2) : (prizedNum = 1);
            const random = prizedNum;
            this.wheelDeg =
              wheelDeg -
              (wheelDeg % 360) +
              6 * 360 +
              (360 - (360 / prizeList.length) * random);
            setTimeout(() => {
              this.rolling = false;

              console.log(res.data, "aaaa");
              if (res.data.prizs.awardType == 2) {
                //1是红包 2 是优惠券
                // alert("Result：神券" + res.data.prizs.awardName);
                this.popData.name = res.data.prizs.awardName;
                this.popData.priceNumber = res.data.prizs.awardPrice;
                this.showContent = true;

                if (window.localStorage.getItem("couponsList")) {
                  let obj = res.data.prizs;
                  let couponsListNew = JSON.parse(
                    window.localStorage.getItem("couponsList")
                  );

                  couponsListNew.push(obj);
                  window.localStorage.setItem(
                    "couponsList",
                    JSON.stringify(couponsListNew)
                  );
                } else {
                  let obj = res.data.prizs;
                  console.log(obj, "obj");
                  this.couponsList.push(obj);
                  window.localStorage.setItem(
                    "couponsList",
                    JSON.stringify(this.couponsList)
                  );
                }
                this.index = 1;
              } else if (res.data.prizs.awardType == 1) {
                // alert("Result：红包" + res.data.prizs.awardName);
                this.index = 2;
                this.popData.name = res.data.prizs.awardName;
                this.popData.priceNumber = res.data.prizs.awardPrice;
                this.showContent = true;

                if (window.localStorage.getItem("couponsList")) {
                  let obj = res.data.prizs;
                  let couponsListNew = JSON.parse(
                    window.localStorage.getItem("couponsList")
                  );

                  couponsListNew.push(obj);
                  window.localStorage.setItem(
                    "couponsList",
                    JSON.stringify(couponsListNew)
                  );
                } else {
                  let obj = res.data.prizs;
                  console.log(obj, "obj");
                  this.couponsList.push(obj);
                  window.localStorage.setItem(
                    "couponsList",
                    JSON.stringify(this.couponsList)
                  );
                }
              }
            }, 4500);
          }
        });
        return false;
      }

      ResidueJoinNumberAPI().then((res) => {
        // console.log(res);
        if (this.rolling) return;
        this.rolling = true;
        if (res.data < 0) {
          return;
        } else {
          PlayStartAPI().then((res) => {
            if (res.code == 0) {
              Toast({
                duration: 1000, // 持续展示 toast
                position: "bottom",
                className: "GoodDetailTost",
                forbidClick: false, //显示弹窗之后是否能够点击背景 可以
                message: "今日机会已用完！",
              });
              return;
            } else {
              this.prizedNumber = res.data.residueNumber;
              this.rolling = true;
              const { wheelDeg, prizeList } = this;
              let prizedNum = 0;
              res.data.prizs.awardType == 2 ? (prizedNum = 2) : (prizedNum = 1);
              const random = prizedNum;
              this.wheelDeg =
                wheelDeg -
                (wheelDeg % 360) +
                6 * 360 +
                (360 - (360 / prizeList.length) * random);
              setTimeout(() => {
                this.rolling = false;
                console.log(res.data, "aaaa");
                if (res.data.prizs.awardType == 2) {
                  // alert("Result：神券" + prizeList[random].Name);
                  this.popData.name = res.data.prizs.awardName;
                  this.popData.priceNumber = res.data.prizs.awardPrice;
                  this.showContent = true;
                  this.index = 1;
                } else if (res.data.prizs.awardType == 1) {
                  // alert("Result：红包" + prizeList[random].Name);
                  this.index = 2;
                  this.popData.name = res.data.prizs.awardName;
                  this.popData.priceNumber = res.data.prizs.awardPrice;
                  this.showContent = true;
                }
              }, 4500);
            }
          });
        }
      });
      // }
    },
  },
  watch: {
    prizeNumber() {
      this.freeze = true;
      this.wheelDeg = 0;
      setTimeout(() => {
        this.freeze = false;
      }, 0);
    },
  },
};
</script>

<style lang="less">
.fixBtn {
  background-size: 100%;
  background-image: url("../../../assets/images/zk1.1/btnBG.png");
  position: fixed;
  right: 20px;
  top: 5vw;
  width: 86px;
  height: 86px;
  line-height: 86px;
  text-align: center;
  // background: #ffddb3;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  color: #dd3610;
}

.cou_title {
  font-size: 60px;
  font-weight: 500;
  text-align: center;
  color: #e0351e;
}
.cou_btn {
  width: 194px;
  height: 52px;
  background: #dd3610;
  border-radius: 26px;
  line-height: 52px;
  font-size: 34px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  letter-spacing: 1px;
}
.cou_val {
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  color: #dd3610;
  .cou_num {
    font-size: 167px;
    font-weight: 500;
    text-align: center;
    color: #dd3610;
    letter-spacing: -4px;
  }
}
.prizePage .van-popup {
  background-color: unset !important;
}
.shareContent {
  .van-popup--center {
    top: 15%;
    left: 65%;
  }
}

.mt-60 {
  margin-top: 60px;
}
.prizePage {
  height: 1787px;
  background-size: 100%;
  background-image: url("../../../assets/images/zk1.1/zpBg.png");
  .prize-icon {
    width: 132px;
    // height: 80px;
  }
  .prize-icon2 {
    width: 85px;
  }

  .wheel-wrapper {
    width: 90vw;
    height: 90vw;
    position: absolute;
    top: 90vw;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .wheel-pointer {
    width: 128px;
    height: 167px;
    /* border-radius: 1000px; */
    /* background: yellow; */
    position: absolute;
    left: 50%;
    top: 48%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 200px;
    z-index: 10;
  }

  .wheel-bg {
    width: 100%;
    height: 100%;
    border-radius: 1000px;
    overflow: hidden;
    transition: transform 4s ease-in-out;
    /* background-image: url('@/assets/images/zk1.1/dzuo.png'); */
    background-image: url("../../../assets/images/zk1.1/dzuo.png") 100%;
  }

  .freeze {
    transition: none;
    background: red;
  }

  .prize-list {
    background-size: 100%;
    background-image: url("../../../assets/images/zk1.1/dzuo.png");
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
  }

  .prize-item-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 45vw;
    height: 45vw;
  }

  .prize-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    transform-origin: bottom;
  }
  .prize-name {
    padding: 16px 0;
    color: @auxiliary-color;
    font-size: 22px;
  }
}
.shareImg {
  height: 300px;
  width: 334px;
  background-size: 100%;
  background-image: url("../../../assets/images/zk1.1/fx.png");
}
.bgImg {
  height: 620px;
  width: 620px;
  background-size: 100%;
  background-image: url("../../../assets/images/zk1.1/bgIMG.png");
}
.reNumber {
  color: #ffddb3;
  position: absolute;
  top: 145vw;
  left: 50%;
  transform: translate(-50%, -50%);
  .num {
    background-color: #ffddb3;
    padding: 8px 8px;
    border-radius: 8px;
    color: #fa7b37;
    font-weight: bold;
  }
}
</style>
