<template>
  <div class="LoginRegisteredTow">
    <div class="title"></div>
    <div class="logo">
      <span>您正在使用手机号注册</span>
      <span>感谢您选择兆客</span>
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
            @click="delete1input()"
            v-show="delete1"
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
      <div class="d4">
        <button
          :class="
            myinput1value != '' && myinput2value != '' ? 'b1 b1active' : 'b1'
          "
          @click="GetPhoneRegData()"
        >
          同意并注册
        </button>
      </div>
      <div class="d5">
        注册即代表您已同意
        <span>兆客隐私政策</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import qs from "qs";
import { GetCodeVerifyAPI, GetPhoneRegAPI } from "@/api/login";
import { getSidAPI } from "@/api/MyApi";
import { getAddressAPI } from "@/api/commonApi";
import { Toast } from "vant";

import { loginAPI, GetUserCartCountAPI, cartNouserAddAPI } from "@/api/MyApi";

import { LoginBigWheelSynsAPI } from "@/api/coupons";

export default {
  name: "LoginRegisteredTow",
  data() {
    return {
      titledata: "兆客注册", //控制title的动态变量
      d1show: true, //输入手机号的光标变量
      d1show1: true, //输入验证码的光标变量
      myinput1value: "", //手机号输入框的value值
      myinput2value: "",
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      b1active: false, //登入按钮的手机号是否存在
      result: false, //手机号是否存在
      msg: "获取验证码",
      disabled: false, //获取验证码的按钮是否去禁用的变量
      FlagGuid: "",
    };
  },
  components: {},
  methods: {
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
      console.log(result1);
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

            self.msg = `(${num})后重试`;
            // console.log(num);
          }, 1000);
          self.msg = `(${num})后重试`;
        }
      } else {
        alert("请输入正确的手机号");
      }
    },
    // 获取短信验证码
    getMsgCode() {
      // console.log(this.myinput1value);
      let data = {
        Phone: this.myinput1value,
      };
      GetCodeVerifyAPI(data, "get").then((res) => {
        console.log(res, "res");
        this.FlagGuid = res.data;
      });
    },
    //获取sid
    getSid() {
      getSidAPI("get").then((res) => {
        console.log(res);
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
        playNum: 3 - window.localStorage.getItem("CouponTimes"),
        openId: "",
      });
      console.log(data, "data");
      LoginBigWheelSynsAPI(data, "post").then((res) => {
        window.localStorage.removeItem("couponsList");
      });
    },
    // 注册登入
    GetPhoneRegData() {

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
      };
      // console.log(data,"注册登入  注册");
      GetPhoneRegAPI(data, "get").then((res) => {
        console.log(res, "注册登入 注册");
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
        }
        // this.$router.push({ name: "Home" });
        // if (res.code == 1) {
        //   this.$router.push({ name: "Home" });
        // } else if (res.code == 0) {
        //   this.$router.push({ name: "LoginRegistered" });
        //   console.log('账号已经注册')
        // }
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
  mounted() {
    document.title = this.titledata;
    this.getSid();
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
.LoginRegisteredTow {
  width: 100%;
  height: 100%;
  //   overflow: hidden
  .logo {
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    color: @text-colorA;
    span:nth-child(1) {
      font-size: 42px;
      margin-top: 101px;
    }
    span:nth-child(2) {
      font-size: 32px;
      padding-top: 20px;
    }
  }
  .content {
    margin-top: 101px;
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
      margin-top: 40px;
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
          margin-top: 4px;
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
      padding-top: 20px;
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
        border: none;
        // border: 1px solid @text-colorD;
        height: 88px;
        border-radius: 44px;
        pointer-events: none;
      }
    }
    .d5 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: @text-colorD;
      padding-top: 48px;
      span {
        color: @main-color;
        padding-left: 6px;
      }
    }
  }
}
</style>