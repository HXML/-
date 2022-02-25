<template>
  <div class="My" style="width: 100%; height: 100%">
    <!-- 登入状态 -->
    <div class="my_box">
      <div class="title">
        <div class="top">
          <div class="top_left">
            <img
              src="@/assets/images/mine_avatar@2x.png"
              alt
              style="
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.5);
              "
              v-show="!subdata.userImg"
            />
            <img
              style="
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.5);
              "
              :src="subdata.userImg + '?x-oss-process=style/n4'"
              alt
              v-if="subdata.userImg"
            />
            <p>
              <span>{{ subdata.nickName }}</span>
              <span>会员名：{{ subdata.userName }}</span>
              <!-- <span>注册时间：2020-06-18 17:22:45</span> -->
              <span>注册时间：{{ subdatapeople.invitedTime }}</span>
            </p>
          </div>
          <div class="top_right">
            <img
              src="@/assets/images/mine_Setup.png"
              alt
              @click="jumpsetup()"
            />
          </div>
        </div>
        <div class="bottom">
          <ul>
            <li @click="jumpIncome()">
              <span class="s1">￥{{ subdata.total }}</span>
              <span class="s2">总收入</span>
            </li>
            <li @click="jumpIncome()">
              <span class="s1"
                >￥<countTo
                  :startVal="startValTow"
                  :endVal="endValTow"
                  :duration="4000"
                  :decimals="decimalsTow"
                ></countTo
              ></span>
              <!-- {{subdata.balance}} -->
              <span class="s2">余额</span>

              <div class="dw" v-show="dwshow">
                <span>+</span>
                <countTo
                  :startVal="startVal"
                  :endVal="endVal"
                  :duration="3000"
                  :decimals="decimals"
                ></countTo>
              </div>
            </li>
            <li @click="jumpFriends()">
              <span class="s1">{{ subdata.friends }}</span>
              <span class="s2">好友</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 我的订单 -->
      <div class="order">
        <div class="order_top" @click="jumpMyorder(0)">
          <span>我的订单</span>
          <span>查看全部></span>
        </div>
        <div class="order_bottom">
          <ul>
            <li @click="jumpMyorder(1)">
              <div>
                <img src="@/assets/images/mione_Order_icon1@2x.png" alt />
                <p v-show="subdata.pendingPay != 0">{{ subdata.pendingPay }}</p>
              </div>
              <span>待付款</span>
            </li>
            <li @click="jumpMyorder(2)">
              <div>
                <img src="@/assets/images/mione_Order_icon2@2x.png" alt />
                <p v-show="subdata.pendingShippend != 0">
                  {{ subdata.pendingShippend }}
                </p>
              </div>
              <span>待发货</span>
            </li>
            <li @click="jumpMyorder(3)">
              <div>
                <img src="@/assets/images/mione_Order_icon3@2x.png" alt />
                <p v-show="subdata.pendingReceived != 0">
                  {{ subdata.pendingReceived }}
                </p>
              </div>
              <span>待收货</span>
            </li>
            <li @click="jumpMyorder(5)">
              <div>
                <img src="@/assets/images/mione_Order_icon4@2x.png" alt />
                <p v-show="subdata.evaluate != 0">{{ subdata.evaluate }}</p>
              </div>
              <span>待评价</span>
            </li>
            <li @click="jumpAfterSales()">
              <div>
                <img src="@/assets/images/mione_Order_icon5@2x.png" alt />
              </div>
              <span>退款/售后</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 常用功能 -->
      <div class="fun">
        <div class="fun_top">
          <span>常用功能</span>
        </div>
        <div class="fun_bottom">
          <ul>
            <li
              v-for="(item, index) in fundata"
              :key="index"
              @click="jumprouter(index)"
            >
              <img :src="item.funimg" alt />
              <span>{{ item.funtext }}</span>
            </li>
          </ul>
        </div>
      </div>

      <recommend></recommend>
      <!-- <div class="my_foot">
          <i></i>
          <span>哎呀，踩到底线了</span>
          <i></i>
      </div> -->
    </div>

    <!-- <van-cell is-link @click="showPopup">展示弹出层</van-cell> -->
    <van-popup v-model="show">
      <div class="mdList">
        <div class="md_top">
          <span>选择门店</span>
        </div>
        <div
          class="md_item"
          v-for="(item, index) in subdata.shopPickupList"
          :key="index"
          @click="xzjumpPH(item, index)"
        >
          <div class="d1">
            <img :src="item.logoImg + '?x-oss-process=style/n4'" alt="" />
          </div>

          <div class="d2">
            <p class="p1">{{ item.shopName }}</p>
            <p class="p2">
              <img
                src="@/assets/images/1.6_img/ziying_home_icon1@2x.png"
                alt=""
              />
              <span>{{ item.ppAddress }}</span>
            </p>
          </div>
        </div>
      </div>
    </van-popup>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import Vue from "vue";

import { MyBaseDataAPI } from "@/api/MyApi";

import loading from "@/components/loading";

import recommend from "@/components/recommend";

// import $ from 'jquery'
import countTo from "vue-count-to";

import { Toast, Dialog, Popup } from "vant";
import { Cell } from "vant";

export default {
  name: "My",
  data() {
    return {
      show: false,
      subdata: {},
      subdatapeople: [], //个人信息
      islogin: true,
      fundata: [
        {
          funimg: require("@/assets/images/mine_Common_icon1@2x.png"),
          funtext: "我的收藏",
        },
        {
          funimg: require("@/assets/images/mine_Common_icon2@2x.png"),
          funtext: "我的收入",
        },
        {
          funimg: require("@/assets/images/1.5_img/mine_Common_icon9@2x.png"),
          funtext: "我的砍价",
        },
        {
          funimg: require("@/assets/images/mine_Common_icon5@2x.png"),
          funtext: "我的券包",
        },
        {
          funimg: require("@/assets/images/mine_Common_icon3@2x.png"),
          funtext: "邀请好友",
        },
        {
          funimg: require("@/assets/images/mine_Common_icon4@2x.png"),
          funtext: "我的好友",
        },

        {
          funimg: require("@/assets/images/mine_Common_icon6@2x.png"),
          funtext: "常用地址",
        },
        {
          funimg: require("@/assets/images/mine_Common_icon7@2x.png"),
          funtext: "商城入驻",
        },
        {
          funimg: require("@/assets/images/mine_Common_icon7@2x.png"),
          funtext: "自营门店",
        },
      ],
      loadingshow: true,
      titledata: "个人", //控制title的动态变
      startVal: 0,
      endVal: 0,
      decimals: 2,
      dwshow: false,
      startValTow: 0,
      endValTow: 0,
      decimalsTow: 2,
    };
  },
  components: {
    loading: loading,
    recommend: recommend,
    countTo,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
  },
  methods: {
    // 打开门店首页
    showPopup() {
      this.show = true;
    },
    // 选择门店
    xzjumpPH(item, index) {
      this.$router.push({
        path: "/My/PShop/PHome",
        query: {
          id: item.id,
        },
      }); //自营门店
    },
    tzdr() {
      this.$router.push({ path: "/My/Login/LoginRegistered" });
    },
    // 跳转到设置页面
    jumpsetup() {
      this.$router.push({ path: "/My/SetUp" });
    },
    // 跳转到我的订单
    jumpMyorder(status) {
      this.$router.push({
        path: "/My/Myorder",
        query: { orderstatus: status },
      });
    },
    // 跳转到我的售后
    jumpAfterSales() {
      this.$router.push({ path: "/My/AfterSales" });
    },
    //跳转到我的好友
    jumpFriends() {
      this.$router.push({ path: "/My/Friends" });
    },
    jumpIncome() {
      this.$router.push({ path: "/My/Income" });
    },
    jumprouter(index) {
      console.log(index);
      switch (index) {
        case 0:
          this.$router.push({ name: "Collection" }); //收藏
          break;
        case 1:
          this.$router.push({ name: "Income" }); //收入
          break;
        case 2:
          // 砍价
          this.$router.push({ name: "BargainList" }); //我的砍价
          break;
        case 3:
          this.$router.push({ name: "Coupons" }); //优惠券

          break;
        case 4:
          this.$router.push({
            name: "InviteFriends",
            query: { name: this.subdata.nickName }, //邀请好友
          });
          break;
        case 5:
          this.$router.push({ name: "Friends" }); //好友
          break;
        case 6:
          let oln = "/My";
          window.localStorage.setItem("frompathadd", oln);
          this.$router.push({ name: "UsedAddress" }); //我的地址
          break;
        case 7:
          this.$router.push({ name: "ApplyEnter" }); //申请入住
          break;
        case 8:
          if (this.subdata.shopPickupList.length == 1) {
            this.$router.push({
              path: "/My/PShop/PHome",
              query: {
                id: this.subdata.shopPickupList[0].id,
              },
            }); //自营门店
          } else if (this.subdata.shopPickupList.length >= 1) {
            this.showPopup();
          }

          break;
        default:
          break;
      }
    },
    // 个人中心信息
    MyBaseData() {
      MyBaseDataAPI("get").then((res) => {
        console.log(res, "个人中心信息");
        this.subdata = res;

        console.log(this.subdata.shopPickupList, "this.subdata.shopPickupList");

        // 判断门店的数量
        if (this.subdata.shopPickupList) {
          if (this.subdata.shopPickupList.length == 0) {
            this.fundata.pop();
          }
        } else {
          this.fundata.pop();
        }

        let self = this;
        if (window.localStorage.getItem("faceValue")) {
          self.dwshow = true;
          self.endVal = parseFloat(window.localStorage.getItem("faceValue"));

          self.startValTow = res.balance - self.endVal;
          self.endValTow = res.balance;

          clearInterval(timeor);
          let timeor = setInterval(function () {
            localStorage.removeItem("faceValue");
            self.dwshow = false;
          }, 3000);
        } else {
          let aaa = window.localStorage.getItem("faceValue");
          self.startValTow = res.balance - aaa;
          self.endValTow = res.balance - aaa;
        }

        if (res.user == null) {
          this.loadingshow = false;
          Dialog.alert({
            title: "提示",
            message: "您的身份已过期,请重新登录",
          }).then(() => {
            // on close
            localStorage.clear();
            this.$router.push({ path: "/My/Login/LoginRegistered" });
          });
        } else {
          this.subdatapeople = res.user;
          this.loadingshow = false;
        }
      });
    },
    GetUserId(event) {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI(event).replace(/[\.\+\*]/g, "\\$&") +
              "(?:\\=([^&]*))?)?.*$",
            "i"
          ),
          "$1"
        )
      );
    },
  },
  mounted() {
    document.title = this.titledata;
    this.MyBaseData();
    // console.log(this.subdatapeople!=null)
    if (this.subdatapeople != null) {
      this.islogin = false;
    } else {
      this.islogin = true;
    }
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.My {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;

  .my_box {
    padding-bottom: 120px;
  }
  .title {
    width: 100%;
    min-height: 380px;
    background-image: url("../../assets/images/zk1.1/h5-bg.jpg");
    background-size: 100% 100%;
    .top {
      padding-top: 32px;
      display: flex;
      width: 92%;
      margin: auto;
      .top_left {
        display: flex;
        align-items: center;
        flex: 1;
        img {
          width: 116px;
          height: 116px;
        }
        p {
          padding-left: 34px;
          color: @text-white;
          display: flex;
          flex-direction: column;
          span:nth-child(1) {
            font-size: 32px;
          }
          span:nth-child(2) {
            font-size: 24px;
            padding-top: 12px;
            opacity: @opacitysix;
          }
          span:nth-child(3) {
            font-size: 24px;
            padding-top: 8px;
            opacity: @opacitysix;
          }
        }
      }
      .top_right {
        img {
          width: 34px;
          height: 34px;
        }
      }
    }
    .bottom {
      margin: 54px 20px 0;
      color: @text-white;
      ul {
        width: 100%;
        display: flex;
        li {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          .s1 {
            font-size: 32px;
          }
          .s2 {
            font-size: 24px;
            padding-top: 20px;
          }
          .dw {
            position: absolute;
            right: -20px;
            top: -12px;
            display: flex;
            align-items: center;
            color: #fbdacb;
            font-size: 28px;
          }
        }
      }
    }
  }
  .order {
    margin: -68px 21px 0;
    height: 261px;
    background: @text-white;
    box-shadow: @auxiliary-shadow;
    border-radius: 16px;
    .order_top {
      // margin: 0 19px 0 33px;
      display: flex;
      align-items: center;
      height: 82px;
      border-bottom: 1px solid @base-color;
      span:nth-child(1) {
        font-size: 28px;
        color: @text-colorA;
        flex: 1;
        padding-left: 32px;
        // font-weight: bold;
      }
      span:nth-child(2) {
        font-size: 20px;
        color: @text-colorC;
        padding-right: 20px;
      }
    }
    .order_bottom {
      width: 100%;
      height: 179px;
      display: flex;
      align-items: center;
      ul {
        width: 100%;
        display: flex;
        li {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          div {
            position: relative;
            img {
              width: 58px;
              height: 58px;
            }
            p {
              position: absolute;
              font-size: 18px;
              color: @main-color;
              border: 1px solid @main-color;
              border-radius: 16px;
              right: -20px;
              top: -8px;
              display: flex;
              align-items: center;
              justify-content: center;
              min-width: 28px;
              padding: 1px 2px 0;
              height: 20px;
              background: @text-white;
            }
          }
          span {
            padding-top: 20px;
            font-size: 24px;
            color: @text-colorB;
          }
        }
      }
    }
  }
  .fun {
    margin: 16px 21px 0;
    // height: 434px;
    box-shadow: @auxiliary-shadow;
    border-radius: 16px;
    background: #fff;
    .fun_top {
      display: flex;
      align-items: center;
      height: 82px;
      border-bottom: 1px solid @base-color;
      span {
        font-size: 28px;
        color: @text-colorA;
        padding-left: 32px;
        // font-weight: bold;
      }
    }
    .fun_bottom {
      width: 100%;
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0 40px;
        li {
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 36px;
          img {
            width: 68px;
            height: 68px;
          }
          span {
            font-size: 24px;
            color: @text-colorB;
            padding-top: 30px;
          }
        }
      }
    }
  }
  .my_foot {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    i {
      font-style: normal;
      background: @text-colorD;
      height: 1px;
      width: 20px;
    }
    span {
      font-size: 20px;
      color: @text-colorD;
      margin: 0 10px;
    }
  }
  .van-popup {
    background: none;
    .md_top {
      color: #fff;
      font-size: 32px;
      display: flex;
      justify-content: center;
      padding-bottom: 12px;
    }
    .md_item {
      background: #fff;
      margin: 20px 0;
      // width: 300px;
      // height: 80px;
      width: 512px;
      height: 144px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      .d1 {
        width: 96px;
        height: 96px;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .d2 {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        .p1 {
          font-size: 28px;
          color: #4a5060;
        }
        .p2 {
          display: flex;
          align-items: flex-start;
          padding-top: 12px;
          img {
            width: 20px;
            padding-top: 4px;
          }
          span {
            font-size: 22px;
            color: #b1b6c4;
            padding-left: 8px;
            line-height: 32px;
          }
        }
      }
    }
  }
}
</style>