<template>
  <div class="LoginResetpassword">
    <div class="title"></div>
    <div class="logo"></div>
    <div class="content">
      <div :class="d1show?'d1':'d1 d1active'">
        <p>
          <img src="@/assets/images/login__icon2@2x.png" alt />
          <input
            :type="typestate1"
            placeholder="密码为8-16位字母数字组合"
            class="myinput myInput1actice"
            @focus="PhoneFocus('1')"
            @blur="PhoneBlur('1')"
            v-model="myinput1value"
            @input="phoneNumberChange"
          />
        </p>
        <img
          src="@/assets/images/login__delete@2x.png"
          @click="delete1input()"
          v-show="delete1"
          class="delete1 alt"
        />
        <img :src="eyeshidden1" alt class="showpassword" @click="Spassword1()" />
      </div>
      <div :class="d1show1?'d2':'d2 d2active'">
        <p>
          <img src="@/assets/images/login__icon2@2x.png" alt />
          <input
            placeholder="密码为8-16位字母数字组合"
            :type="typestate"
            @focus="PhoneFocus('2')"
            @blur="PhoneBlur('2')"
            v-model="myinput2value"
            @input="phoneNumberChange1"
          />
        </p>
        <img
          src="@/assets/images/login__delete@2x.png"
          @click="delete2input()"
          v-show="delete2"
          class="delete2"
          alt
        />
        <img :src="eyeshidden" alt class="showpassword" @click="Spassword()" />
      </div>
      <p :class="passsame?'p1':'p1 p1active'">{{msg}}</p>
      <div :class="d1show2?'d8':'d8 d8active'">
        <p>
          <input
            type="number"
            placeholder="请输入验证码"
            @focus="PhoneFocus('3')"
            @blur="PhoneBlur('3')"
            v-model="myinput3value"
            oninput="if(value.length>6)value=value.slice(0,6)"
          />
          <img
            src="@/assets/images/login__delete@2x.png"
            @click="delete3input()"
            v-show="delete3"
            alt
          />
        </p>
        <!--<button @click="getCode()" :class="result?'SecurityCode':''">{{msg}}</button>-->
        <!-- <button
          @click="getCode()"
          v-bind:class="{SecurityCode:result,'':!result,noClick:disabled}"
        >{{msg1}}</button>
        
          :class="myinput1value!=''&& myinput2value!=''?'SecurityCode':''"
        -->
        <button
          @click="getCode()"
          v-bind:class="{SecurityCode:myinput1value!=''&& myinput2value!=''&&buttonshow,noClick:disabled}"
        >{{msg1}}</button>
      </div>

      <div class="d4">
        <button
          :class="myinput1value!=''&& myinput2value!=''&&myinput3value!=''?'b1 b1active':'b1'"
          @click="confirm()"
        >确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import {
  GetCodeVerifyAPI,
  GetPhoneTokenAPI,
  GetPhoneRegAPI,
  chpassAPI,
  ChangePwdCodeVerifyAPI
} from "@/api/login";
import qs from "qs";
import { Toast } from "vant";
export default {
  name: "LoginResetpassword",
  data() {
    return {
      eyeshidden: require("@/assets/images/login__icon4@2x.png"),
      eyes: 1, //判断显示密码的状态
      typestate: "password",
      eyeshidden1: require("@/assets/images/login__icon4@2x.png"),
      eyes1: 1, //判断显示密码的状态
      typestate1: "password",
      d1show: true, //输入新密码1的光标变量
      d1show1: true, //输入新密码2的光标变量
      d1show2: true,
      myinput1value: "", //新密码输入框的value值
      myinput2value: "",
      myinput3value: "",
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      delete3: false,
      b1active: false, //登入按钮的手机号是否存在
      result: false, //手机号是否存在
      passsame: true, //判断两次密码提示文字的active
      msg: "*密码需由8-16位字母与数字的组合",
      result: false,
      result1: false,
      msg1: "获取验证码",
      disabled: false, //获取验证码的按钮是否去禁用
      myinput1value6: "18279400224",
      FlagGuid: "",
      buttonshow:true
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
      } else if (parameter == 2) {
        this.d1show1 = false;
        if (this.myinput2value != "") {
          this.delete2 = true;
        }
      } else {
        this.d1show2 = false;
        if (this.myinput2value != "") {
          this.delete3 = true;
        }
      }
    },
    // 失去两个input焦点
    PhoneBlur(parameter) {
      if (parameter == 1) {
        this.d1show = true;
        if (this.myinput1value != this.myinput2value) {
          if (this.myinput1value == "" || this.myinput2value == "") {
            this.passsame = true;
            this.msg = "*密码需由8-16位字母与数字的组合";
            console.log("两次密码其中任何一个为空！");
          } else {
            this.passsame = false;
            this.msg = "*两次密码不一致，请检查后重试";
            console.log("两次密码不相同！");
          }
        } else {
          this.passsame = false;
          if (this.myinput1value == "" && this.myinput2value == "") {
            this.passsame = true;
            this.msg = "*密码需由8-16位字母与数字的组合";
            console.log("两次密码都为空！");
          } else {
            this.msg = "*密码需由8-16位字母与数字的组合";
            if (this.result && this.result1) {
              console.log("两次密码相同 都是字母  和  文字的组成！");
              this.passsame = true;
              this.msg = "*密码需由8-16位字母与数字的组合";
              // bbbbbbbbbbbbbbbbb
            } else {
              this.passsame = false;
              console.log(
                "两次密码相同且都是纯字母  或者  纯文字的组成 或者 小于8位大于16位！"
              );
            }
          }
        }
        clearInterval(ytime);
        let ytime = setInterval(() => {
          this.delete1 = false;
          clearInterval(ytime);
        }, 300);
      } else if (parameter == 2) {
        this.d1show1 = true;
        if (this.myinput1value != this.myinput2value) {
          if (this.myinput1value == "" || this.myinput2value == "") {
            this.passsame = true;
            this.msg = "*密码需由8-16位字母与数字的组合";
            console.log("两次密码其中任何一个为空！");
          } else {
            this.passsame = false;
            this.msg = "*两次密码不一致，请检查后重试";
            console.log("两次密码不相同！");
          }
        } else {
          this.passsame = false;
          if (this.myinput1value == "" && this.myinput2value == "") {
            this.passsame = true;
            this.msg = "*密码需由8-16位字母与数字的组合";
            console.log("两次密码都为空！");
          } else {
            this.msg = "*密码需由8-16位字母与数字的组合";
            if (this.result && this.result1) {
              console.log("两次密码相同,都是字母  和  文字的组成！");
              this.passsame = true;
              this.msg = "*密码需由8-16位字母与数字的组合";
            } else {
              this.passsame = false;
              console.log(
                "两次密码相同,且都是字母  或者  文字的组成 或者 小于8位大于16位！"
              );
            }
          }
        }
        clearInterval(ytime2);
        let ytime2 = setInterval(() => {
          this.delete2 = false;
          clearInterval(ytime2);
        }, 300);
      } else {
        this.d1show2 = true;
        clearInterval(ytime3);
        let ytime3 = setInterval(() => {
          this.delete3 = false;
          clearInterval(ytime3);
        }, 300);
      }
    },
    // 删除新密码1input的数据
    delete1input() {
      this.myinput1value = "";
    },
    // 删除新密码2input的数据
    delete2input() {
      this.myinput2value = "";
    },
    // 删除验证码input的数据
    delete3input() {
      this.myinput3value = "";
    },
    // 判断第一次密码是否是数字字母的结合，不能不全是数字，不能不全是字母
    phoneNumberChange(e) {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      //判断手机号是否存在
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
      // console.log(this.myinput1value)
      let result1 = reg.test(this.myinput1value);
      console.log(result1);
      this.result = result1;
    },
    // 判断第二次密码是否是数字字母的结合，不能不全是数字，不能不全是字母
    phoneNumberChange1(e) {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
      // console.log(this.myinput2value)
      let result1 = reg.test(this.myinput2value);
      console.log(result1);
      this.result1 = result1;
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
    // 点击眼睛图片显示隐藏密码
    Spassword1() {
      if (this.eyes1 == 1) {
        // console.log("第一次点击");
        this.typestate1 = "text";
        this.eyeshidden1 = require("@/assets/images/login__icon3@2x.png");
        this.eyes1 = 2;
      } else {
        // console.log("第二次点击");
        this.typestate1 = "password";
        this.eyeshidden1 = require("@/assets/images/login__icon4@2x.png");
        this.eyes1 = 1;
      }
    },
    // 点击获取验证码 调用接口
    getCode() {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      let num = 60;
      let self = this;
      let X = event.target; //获取到当前点击的节点
      //判断手机号是否存在
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      let result = reg.test(self.myinput1value6);
      self.result = false;
      //先判断输入的东西是不是手机号 在做判断
      // if (result) {
      //   if (self.myinput1value6 === "") {
      //   } else {
      this.getMsgCode();
      let timer = setInterval(() => {
        // console.log(self.result);
        self.result = false;
        self.buttonshow=false;
        --num;
        self.disabled = true;
        if (num === 0) {
          clearInterval(timer);
          self.result = true;
          self.buttonshow=true;
          self.$nextTick(() => {
            self.msg1 = "重新获取";
          });
          self.disabled = false;
        }

        self.msg1 = `(${num})s后重试`;
        // console.log(num);
      }, 1000);
      self.msg1 = `(${num})s后重试`;
      //   }
      // } else {
      //   alert("请输入正确的手机号");
      // }
    },
    // 获取短信验证码
    getMsgCode() {
      ChangePwdCodeVerifyAPI("get").then(res => {
        console.log(res, "获取短信验证码");
        this.FlagGuid = res.data;
      });
    },
    //确认修改密码
    confirm() {
      let data = qs.stringify({
        flagGuid: this.FlagGuid,
        verify: this.myinput3value,
        Password: this.myinput1value,
        confirmPassword: this.myinput2value
      });
      chpassAPI(data, "put").then(res => {
        console.log(res, "修改密码");
        if (res.code == 1) {
          Toast("修改密码成功");
          this.$router.push({ name: "LoginEnter" });
        } else {
          Toast("修改密码失败，请检查验证码是否正确！");
        }
      });
    }
  },
  mounted() {},
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
    },
    myinput3value: function() {
      if (this.myinput3value != "") {
        this.delete3 = true;
      } else {
        this.delete3 = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.LoginResetpassword {
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
    .p1active {
      color: @main-color !important;
    }
    .p1 {
      font-size: 24px;
      padding-top: 20px;
      color: @text-colorC;
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
          border: none;
          font-size: 28px;
          padding-left: 16px;
          flex: 1;
          caret-color: @main-color;
        }
        img {
          width: 34px;
          height: 34px;
        }
      }
      .delete1 {
        width: 24px;
        height: 24px;
        margin-right: 20px;
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
          margin-top: 4px;
          caret-color: @main-color;
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
    .d8active {
      border-bottom: 1px solid @main-color !important;
    }
    .d8 {
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
      }
      .b1 {
        color: @text-white;
        height: 88px;
        border-radius: 44px;
        border: none;
        background: @text-colorD;
        opacity: 0.5;
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