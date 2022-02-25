<template>
  <div class="LoginValidation">
    <div class="title"></div>
    <div class="logo"></div>
    <div class="content">
      <div :class="d1show?'d1':'d1 d1active'">
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
      <div :class="d1show1?'d2':'d2 d2active'">
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
          v-bind:class="{SecurityCode:result,'':!result,noClick:disabled}"
        >{{msg}}</button>
      </div>
      <div class="d4">
        <button
          @click="jumpLoginResetpassword()"
          :class="myinput1value!=''&&myinput2value!=''?'b1 b1active':'b1'"
        >确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { GetCodeVerifyAPI, GetCodeCheckAPI } from "@/api/login";

export default {
  name: "LoginValidation",
  data() {
    return {
      titledata: "身份验证", //控制title的动态变量

      d1show: true, //输入手机号的光标变量
      d1show1: true, //输入验证码的光标变量
      myinput1value: "", //手机号输入框的类名
      myinput2value: "",
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      b1active: false, //登入按钮的手机号是否存在
      result: false, //手机号是否存在
      msg: "获取验证码",
      disabled: false, //获取验证码的按钮是否去禁用
      FlagGuid: ""
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
            console.log(self.result);
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
        Phone: this.myinput1value
      };
      GetCodeVerifyAPI(data, "get").then(res => {
        console.log(res, "res");
        this.FlagGuid = res.data;
      });
    },
    // 验证验证码
    jumpLoginResetpassword() {
      let data = {
        FlagGuid: this.FlagGuid,
        Code: this.myinput2value //验证码
      };
      GetCodeCheckAPI(data, "get").then(res => {
        console.log(res, "res");
        if (res.code == 1) {
          this.$router.replace({
            path: "/My/Login/LoginResetpassword",
            query: { Phone: this.myinput1value }
          });
        } else {
          alert("验证码或者手机号错误！");
        }
      });
    }
  },
  mounted() {
     document.title = this.titledata;
  },
  watch: {
    myinput1value: function() {
      if (this.myinput1value != "") {
        this.delete1 = true;
      } else {
        this.delete1 = false;
      }
    },
    myinput2value: function() {
      if (this.myinput2value != "") {
        this.delete2 = true;
      } else {
        this.delete2 = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.LoginValidation {
  width: 100%;
  height: 100%;
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
    }
  }
}
</style>