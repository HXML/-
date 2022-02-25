<template>
  <div class="LoginEnter">
    <div class="title"></div>
    <div class="logo">
      <img src="@/assets/images/logo.png" alt class="logoin" />
    </div>
    <div class="content">
      <div :class="d1show ? 'd1' : 'd1 d1active'">
        <p>
          <img src="@/assets/images/login__icon1@2x.png" alt />
          <input
            type="text"
            placeholder="使用会员名或者手机号登录"
            class="myInput1 myInput1actice"
            @focus="PhoneFocus('1')"
            @blur="PhoneBlur('1')"
            v-model="myinput1value"
            @input="phoneNumberChange"
          />
        </p>
        <img
          src="@/assets/images/login__delete@2x.png"
          alt
          class="delete1"
          @click="delete1input()"
          v-show="delete1"
        />
      </div>
      <p class="p1" style="display: none">*该账户不存在，请检查后重试</p>
      <div :class="d1show1 ? 'd2' : 'd2 d2active'">
        <p>
          <img src="@/assets/images/login__icon2@2x.png" alt />
          <input
            :type="typestate"
            placeholder="密码为8-16位字母数字组合"
            @focus="PhoneFocus('2')"
            @blur="PhoneBlur('2')"
            v-model="myinput2value"
          />
        </p>
        <img
          src="@/assets/images/login__delete@2x.png"
          alt
          class="delete2"
          @click="delete2input()"
          v-show="delete2"
        />
        <img :src="eyeshidden" alt class="showpassword" @click="Spassword()" />
      </div>
      <p class="p1" style="display: none">*密码错误，请检查后重试</p>
      <div class="d3">
        <span @click="jumpLoginRegisteredTow()">新用户注册</span>
        <span @click="jumpLoginValidation()">忘记密码?</span>
      </div>
      <div class="d4">
        <button
          :class="
            myinput1value != '' && myinput2value != '' ? 'b1 b1active' : 'b1'
          "
          @click="submitInfor()"
        >
          登录
        </button>
        <button class="b2" @click="jumpLoginRegistered()">手机验证登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import qs from "qs";
import { loginAPI, getSidAPI, cartNouserAddAPI } from "@/api/MyApi";
import { getAddressAPI } from "@/api/commonApi";
import { Toast } from "vant";
import { GetUserCartCountAPI } from "@/api/MyApi";
import { IsWeixinOrAlipay } from "@/common/js/environment.js";
// import '@/common/js/GetOpenID.js'
import $ from "jquery";

Vue.use(Toast);
export default {
  name: "LoginEnter",
  data() {
    return {
      titledata: "兆客账户登录", //控制title的动态变量
      eyeshidden: require("@/assets/images/login__icon4@2x.png"),
      d1show: true, //输入手机号的光标变量
      d1show1: true, //输入验证码的光标变量
      myinput1value: "", //手机号输入框的内容  账号
      myinput2value: "", //密码
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      b1active: false, //登入按钮的手机号是否存在
      eyes: 1, //判断显示密码的状态
      typestate: "password",
      submitData: [],
      openid: "",
    };
  },
  components: {},

  methods: {
    //跳转路由去手机验证登录
    jumpLoginRegistered() {
      this.$router.replace({ path: "/My/Login/LoginRegistered" });
    },
    //跳转路由去新用户注册
    jumpLoginRegisteredTow() {
      this.$router.replace({ path: "/My/Login/LoginRegisteredTow" });
    },
    // 跳转路由去忘记密码身份验证
    jumpLoginValidation() {
      this.$router.replace({ path: "/My/Login/LoginValidation" });
    },
    // 触发两个input焦点
    PhoneFocus(parameter) {
      if (parameter == 1) {
        this.d1show = false;
        if (this.myinput1value != "") {
          this.delete1 = true;
        }
      } else {
        this.d1show1 = false;
        if (this.myinput2value != "") {
          this.delete2 = true;
        }
      }
    },
    // 失去两个input焦点
    PhoneBlur(parameter) {
      if (parameter == 1) {
        this.d1show = true;
        clearInterval(ytime);
        let ytime = setInterval(() => {
          this.delete1 = false;
          clearInterval(ytime);
        }, 300);
      } else {
        this.d1show1 = true;
        clearInterval(ytime2);
        let ytime2 = setInterval(() => {
          this.delete2 = false;
          clearInterval(ytime2);
        }, 300);
      }
    },
    // 删除手机号input的数据
    delete1input() {
      this.myinput1value = "";
    },
    // 删除验证码input的数据
    delete2input() {
      this.myinput2value = "";
    },
    // 判断手机号是否存在
    phoneNumberChange(e) {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      //判断手机号是否存在
      let reg = /^1\d{10}$/;
      let result1 = reg.test(this.myinput1value);
      // console.log(result1);
      this.result = result1;
      this.b1active = result1;
    },
    // 点击眼睛图片显示隐藏密码
    Spassword() {
      if (this.eyes == 1) {
        // console.log("第一次点击");
        this.typestate = "text";
        this.eyeshidden = require("@/assets/images/login__icon3@2x.png");
        this.eyes = 2;
      } else {
        // console.log("第二次点击");
        this.typestate = "password";
        this.eyeshidden = require("@/assets/images/login__icon4@2x.png");
        this.eyes = 1;
      }
    },
    //获取sid
    getSid() {
      getSidAPI("get").then((res) => {
        console.log(res, "获取sid");
        window.localStorage.setItem("Sid", res.data);

        this.$store.dispatch("changeSid", res.data);
      });
    },
    // 登入账号密码   点击登入按钮
    submitInfor() {
      console.log(this.$store.getters.Sid, "sid");
      
      var data = qs.stringify({
        tcUser: this.myinput1value, //yonghuming
        tcPass: this.myinput2value, //password
        sid: this.$store.getters.Sid, //sid
        OpenID: localStorage.getItem("openid"),
        PUserId: localStorage.getItem("inviterUserId"),
      });
      loginAPI(data, "post", true).then((res) => {
        console.log(res, "登入账号密码");

        if (res.data.onlineUser) {
          window.localStorage.setItem("userId", res.data.onlineUser.userId);
          window.localStorage.setItem("nickName", res.data.onlineUser.nickName);
          window.localStorage.setItem("userImg", res.data.userImg);
          
          window.localStorage.setItem("userId", res.data.onlineUser.userId);
          window.localStorage.setItem("Token", res.data.token);
          window.localStorage.setItem("Flag", true);
          // window.localStorage.setItem(
          //   "EndTime",
          //   new Date(
          //     Date.parse(new Date(res.data.onlineUser.creatorDate)) + 60000
          //   )
          // );
           window.localStorage.setItem(
            "EndTime",
            new Date(Date.parse(new Date(new Date())) + 86400000)

        );

          var plist = qs.stringify({
            dataCart: window.localStorage.getItem("CartList"),
          });
          cartNouserAddAPI(plist, "post", true)
            .then((res) => {
              console.log(res);
              window.localStorage.setItem("CartList", []);
            })
            .then(() => {
              this.GetUserCartCountData(); //获取购物车数据

              if (
                window.localStorage.getItem("couponsList")
              ) {
                this.LoginBigWheelSynsData(); //获取优惠券红包的数据
              }
            });
          this.getAddress(); //登录时 获取最新的地址信息

          Toast(res.data.msg);
          // this.$router.replace({ name: "Home" });
        } else {
          Toast(res.data.msg);
        }
      });
    },
    // 获取购物车的数量
    GetUserCartCountData() {
      let Token = window.localStorage.getItem("Token");
      console.log(window.localStorage.getItem("CartList"), "1111");
      if (window.localStorage.getItem("CartList")) {
        var CartList = JSON.parse(window.localStorage.getItem("CartList"));
      } else {
        var CartList = [];
      }
      if (Token) {
        GetUserCartCountAPI("get").then((res) => {
          this.$store.dispatch("setCartNumber", res.data.slist);
        });
      } else {
        if (CartList.length == 0) {
          this.$store.dispatch("setCartNumber", 0);
        } else {
          this.$store.dispatch("setCartNumber", CartList.length);
        }
      }
    },
    // 获取红包 优惠券 把本地的变成数据里面的
    LoginBigWheelSynsData() {
      let data = qs.stringify({
        awardData: window.localStorage.getItem("couponsList"),
        playNum: 3 - window.localStorage.getItem("CouponTimes"),
         openId: "",
      });
      console.log(data, "data");
      LoginBigWheelSynsAPI(data, "post").then((res) => {
        window.localStorage.removeItem("couponsList");
      });
    },

    // 每次登入，重新去请求新的地址
    getAddress() {
      getAddressAPI().then((res) => {
        console.log(res, "dz");
        this.addressList = {
          province_list: Object.assign(
            {},
            ...res.data.provinceList.map((item) => {
              return { [item.areaId]: item.areaName };
            })
          ),
          city_list: Object.assign(
            {},
            ...res.data.cityList.map((item) => {
              return {
                [item.areaId]: item.areaName,
              };
            })
          ),
          county_list: Object.assign(
            {},
            ...res.data.countyList.map((item) => {
              return {
                [item.areaId]: item.areaName,
              };
            })
          ),
        };
        console.log(this.addressList);
        window.localStorage.setItem(
          "areaList",
          JSON.stringify(this.addressList)
        );
        this.$router.go(-1);
      });
    },
    GetUserId() {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI("openid").replace(/[\.\+\*]/g, "\\$&") +
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
    this.getSid();
  IsWeixinOrAlipay();
    // if (
    //   this.GetUserId() == "" &&
    //   window.localStorage.getItem("openid") == null
    // ) {
    //   var reurl = encodeURI(window.location.href);
    //   var url =
    //     "https://t-api.zk-mall.net/api/v1/PhoneUserOauth/GetUserOauthModel?redirect_uri=" +
    //     encodeURIComponent(reurl);
    //   window.location.href = url;
    // } else {
    //   let openid = this.GetUserId();
    //   window.localStorage.setItem("openid", openid);
    //   console.log(this.GetUserId(), "openid11111111");
    // }

    //  let openid = 'o5MQp1C51NaGdveRuyr8Y6oXG0XY' ;
    //  window.localStorage.setItem("openid", openid);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      // console.log(from.query);
      let oln = "/My/Login/LoginResetpassword";
      console.log(from, "from");
    });
  },
  watch: {
    myinput1value: function () {
      if (this.myinput1value != "") {
        this.delete1 = true;
      } else {
        this.delete1 = false;
      }
    },
    myinput2value: function () {
      if (this.myinput2value != "") {
        this.delete2 = true;
      } else {
        this.delete2 = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.LoginEnter {
  width: 100%;
  height: 100%;
  //   overflow: hidden
  .logo {
    width: 100%;
    display: flex;
    justify-content: center;
    .logoin {
      width: 138px;
      height: 138px;
      margin-top: 87px;
    }
  }
  .content {
    margin-top: 87px;
    padding: 0 40px;
    .p1 {
      font-size: 24px;
      padding-top: 20px;
      color: @main-color;
    }
    .d1active {
      border-bottom: 1px solid @main-color !important;
    }
    .d1 {
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
          caret-color: @main-color;
          border: none;
          font-size: 28px;
          padding-left: 16px;
          flex: 1;
        }
        img {
          width: 34px;
          height: 34px;
        }
      }
      .delete1 {
        width: 24px;
        height: 24px;
        // margin-right: 20px;
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
      padding: 0 10px 12px 17px;
      margin-top: 40px;
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
          padding-left: 16px;
          flex: 1;
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
    .d4 {
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
        // background: @button-mainbackground;
        background: @text-colorD;
        opacity: 0.5;
        height: 88px;
        border-radius: 44px;
        border: none;
        pointer-events: none;
        // box-shadow: 0px 3px 8px 0px rgba(234, 60, 60, 0.32);
      }
      .b2 {
        color: @main-color;
        background: @text-white;
        border: 1px solid @main-color;
        margin-top: 28px;
        height: 88px;
        border-radius: 44px;
      }
    }
  }
}
</style>