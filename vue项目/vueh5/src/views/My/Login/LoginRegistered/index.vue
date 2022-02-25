<template>
  <div class="LoginRegistered">
    <div class="title"></div>
    <div class="logo">
      <img src="@/assets/images/logo.png" alt class="logoin" />
    </div>
    <div class="content">
      <div :class="d1show ? 'd1' : 'd1 d1active'">
        <span>+86</span>
        <p>
          <input
            type="number"
            placeholder="请输入11位手机号"
            class="myinput myInput1actice"
            @focus="PhoneFocus('1')"
            @blur="PhoneBlur('1')"
            v-model="myinput1value"
            @input="phoneNumberChange"
            oninput="if(value.length>11)value=value.slice(0,11)"
          />
          <img
            src="@/assets/images/login__delete@2x.png"
            @click="
              delete1input();
              return false;
            "
            v-show="delete1"
            class="delete1"
            alt
          />
        </p>
      </div>
      <div :class="d1show1 ? 'd2' : 'd2 d2active'">
        <p>
          <input
            type="number"
            placeholder="请输入验证码"
            @focus="PhoneFocus('2')"
            @blur="PhoneBlur('2')"
            v-model="myinput2value"
            oninput="if(value.length>6)value=value.slice(0,6)"
          />
          <img
            src="@/assets/images/login__delete@2x.png"
            @click="delete2input()"
            v-show="delete2"
            alt
          />
        </p>
        <!--<button @click="getCode()" :class="result?'SecurityCode':''">{{msg}}</button>-->
        <button
          @click="getCode()"
          v-bind:class="{
            SecurityCode: result,
            '': !result,
            noClick: disabled,
          }"
        >
          {{ msg }}
        </button>
      </div>
      <div class="d3">
        <span @click="jumpLoginRegisteredTow()">新用户注册</span>
      </div>
      <div class="d4">
        <button
          :class="
            myinput1value != '' && myinput2value != '' ? 'b1 b1active' : 'b1'
          "
          @click="handleLogin"
        >
          登录
        </button>
        <button class="b2" @click="jumpLoginEnter()">账户密码登录</button>
      </div>
    </div>
    <div class="foot" v-show="hideshow">
      <p>
        <i>未注册的手机号验证后将自动创建兆客账号,</i>
        <i>
          登录即代表您已同意
          <span @click="jumpPrivacy()">兆客隐私政策</span>
        </i>
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { GetUserCartCountAPI } from "@/api/MyApi";
import { getAddressAPI } from "@/api/commonApi";
import { loginAPI, getSidAPI, cartNouserAddAPI } from "@/api/MyApi";

import { LoginBigWheelSynsAPI } from "@/api/coupons";

import {
  GetCodeVerifyAPI,
  GetPhoneTokenAPI,
  GetPhoneRegAPI,
} from "@/api/login";
import qs from "qs";
import { Toast } from "vant";
import { IsWeixinOrAlipay } from "@/common/js/environment.js";
export default {
  name: "LoginRegistered",
  data() {
    return {
      docmHeight: document.documentElement.clientHeight, //默认屏幕高度
      showHeight: document.documentElement.clientHeight, //实时屏幕高度
      hideshow: true, //显示或者隐藏footer
      d1show: true, //输入手机号的光标变量
      d1show1: true, //输入验证码的光标变量
      myinput1value: "", //手机号输入框的value值
      myinput2value: "",
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      b1active: false, //登入按钮的手机号是否存在
      result: false, //手机号是否存在
      msg: "获取验证码",
      disabled: false, //获取验证码的按钮是否去禁用
      titledata: "兆客登录注册", //控制title的动态变量
      FlagGuid: "", //GUID密码
    };
  },
  components: {},
  methods: {
    //跳转去兆客易购隐私政策
    jumpPrivacy() {
      this.$router.replace({ path: "/My/Login/Privacy",query:{type:1} });
    },
    // 跳转路由去账户密码登录
    jumpLoginEnter() {
      this.$router.replace({ path: "/My/Login/LoginEnter" });
    },
    // 跳转路由去新用户注册
    jumpLoginRegisteredTow() {
      this.$router.replace({ path: "/My/Login/LoginRegisteredTow" });
    },
    // 触发两个input焦点
    PhoneFocus(parameter) {
      this.hideshow = false;
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
    //获取sid
    getSid() {
      getSidAPI("get").then((res) => {
        // console.log(res);
        window.localStorage.setItem("Sid", res.data);
        this.$store.dispatch("changeSid", res.data);
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
        // redData: window.localStorage.getItem("envelopeList"),
        playNum: 3 - window.localStorage.getItem("CouponTimes"),
        openId: "",
      });
      console.log(data, "data");
      LoginBigWheelSynsAPI(data, "post").then((res) => {
        window.localStorage.removeItem("couponsList");
        // window.localStorage.removeItem("envelopeList");
      });
    },
    //点击登录
    handleLogin() {
      let reg = /^1\d{10}$/;
      let regTow = reg.test(this.myinput1value);
      if(!regTow){
         Toast('手机号错误')
         return false
      }
      var data = {
        Phone: this.myinput1value, //yonghuming
        Code: this.myinput2value, //password
        FlagGuid: this.FlagGuid,
        sid: this.$store.getters.Sid, //sid
        OpenID: localStorage.getItem("openid"),
        PUserId: localStorage.getItem("inviterUserId"),
      };
      console.log(data, "点击登录");
      GetPhoneRegAPI(data, "get", true).then((res) => {
        console.log(res.data, "点击登录");

        if (res.data.onlineUser) {
          window.localStorage.setItem("userId", res.data.onlineUser.userId);
          window.localStorage.setItem("nickName", res.data.onlineUser.nickName);
          window.localStorage.setItem("userImg", res.data.userImg);

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
          Toast(res.data.msg);

          var plist = qs.stringify({
            dataCart: window.localStorage.getItem("CartList"),
          });
          cartNouserAddAPI(plist, "post", true).then((res) => {
            console.log(res);
            window.localStorage.setItem("CartList", []);
          });

          this.GetUserCartCountData(); //获取购物车数据

          if (window.localStorage.getItem("couponsList")) {
            this.LoginBigWheelSynsData(); //获取优惠券红包的数据
          }

          this.getAddress(); //登录时 获取最新的地址信息
        } else {
          Toast(res.data.msg);
          // Toast("密码输入错误,请重新输入！！！");
        }
      });
    },
    // 失去两个input焦点
    PhoneBlur(parameter) {
      this.hideshow = true;
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
      if (this.myinput1value) {
        this.myinput1value = "";
      }
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
      // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      let result1 = reg.test(this.myinput1value);
      console.log(result1, "result1 result1 result1");
      this.result = result1;
      this.b1active = result1;
    },
    // 点击获取验证码 调用接口
    getCode() {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      let num = 60;
      let self = this;
      let X = event.target; //获取到当前点击的节点
      //判断手机号是否存在
      let reg = /^1\d{10}$/;
      let result = reg.test(self.myinput1value);
      self.result = false;
      //先判断输入的东西是不是手机号 在做判断
      if (result) {
        if (self.myinput1value === "") {
        } else {
          this.getMsgCode();
          let timer = setInterval(() => {
            // console.log(self.result);
            self.result = false;
            --num;
            self.disabled = true;
            if (num === 0) {
              clearInterval(timer);
              self.result = true;
              self.$nextTick(() => {
                self.msg = "重新获取";
              });

              self.disabled = false;
            }

            self.msg = `(${num})s后重试`;
            // console.log(num);
          }, 1000);
          self.msg = `(${num})s后重试`;
        }
      } else {
        Toast("请输入正确的手机号");
      }
    },
    // 获取短信验证码
    getMsgCode() {
      // console.log(this.myinput1value);
      let data = {
        Phone: this.myinput1value,
      };
      GetCodeVerifyAPI(data, "get").then((res) => {
        this.FlagGuid = res.data;
        if (res.Code) {
          Toast(res.msg);
        }
      });
    },
    // 获取最新的地址
    getAddress() {
      getAddressAPI().then((res) => {
        this.addressList = {
          province_list: Object.assign(
            {},
            ...res.data.provinceList.map((item) => {
              return {
                [item.areaId]: item.areaName,
              };
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

        console.log("拿到地址在跳转");
        window.localStorage.setItem(
          "areaList",
          JSON.stringify(this.addressList)
        );

        this.$router.go(-1);
      });
    },
  },
  beforeDestroy() {
    window.localStorage.removeItem("reloaded");
  },
  mounted() {
    document.title = this.titledata;
    this.getSid();
    console.log(window.location.href, " window.location.href");

    IsWeixinOrAlipay();
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
.LoginRegistered {
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
    .d1active {
      border-bottom: 1px solid @main-color !important;
    }
    .d1 {
      width: 100%;
      border-bottom: 1px solid @border-colorA;
      padding-bottom: 12px;
      display: flex;
      align-items: center;
      span {
        color: @text-colorA;
        font-weight: bold;
        font-size: 28px;
        padding: 0 16px;
        border-right: 1px solid @text-colorD;
        height: 40px;
        display: flex;
        align-items: center;
      }
      p {
        flex: 1;
        display: flex;
        align-items: center;
        height: 40px;
        input {
          border: none;
          font-size: 28px;
          padding-left: 24px;
          flex: 1;
        }
        .myInput1actice {
          caret-color: @main-color;
        }
        img {
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }
      }
    }
    .d2active {
      border-bottom: 1px solid @main-color !important;
    }
    .d2 {
      margin-top: 50px;
      border-bottom: 1px solid @border-colorA;
      padding-bottom: 12px;
      display: flex;
      align-items: center;
      .SecurityCode {
        color: @main-color !important;
      }
      .noClick {
        pointer-events: none;
      }
      button {
        color: @text-colorC;
        font-size: 28px;
        padding: 0 10px;
        height: 40px;
        display: flex;
        align-items: center;
        border: none;
        border-left: 1px solid @text-colorD;
        background: #fff;
        width: 200px;
        justify-content: center;
      }
      p {
        flex: 1;
        display: flex;
        align-items: center;
        height: 40px;
        input {
          border: none;
          font-size: 28px;
          padding-left: 24px;
          flex: 1;
          margin-top: 8px;
          caret-color: @main-color;
        }
        img {
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }
      }
    }
    .d3 {
      color: @text-colorC;
      font-size: 24px;
      padding-top: 30px;
      span {
        padding-left: 24px;
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
        background: @text-colorD;
        opacity: 0.5;
        // border: 1px solid @text-colorD;
        border: none;
        height: 88px;
        border-radius: 44px;
        pointer-events: none;
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
  .foot {
    position: fixed;
    bottom: 47px;
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 24px;
    line-height: 36px;
    p {
      // width: 70%;
      color: @text-colorD;
      display: flex;
      flex-direction: column;
      i {
        font-style: normal;
      }
      span {
        color: @main-color;
        padding-left: 6px;
      }
    }
  }
}
</style>