<template>
  <div class="ChangeLoginPassword">
    <div class="title"></div>
    <div class="logo"></div>
    <div class="content">
      <!--原密码：  -->
      <div class="content_box">
        <div class="content_box_left">
          <span>原密码：</span>
        </div>
        <div :class="d1show3?'d1':'d1 d1active'">
          <p>
            <input
              :type="typestate3"
              placeholder="输入原密码"
              class="myinput myInput1actice"
              @focus="PhoneFocus('3')"
              @blur="PhoneBlur('3')"
              v-model="myinput3value"
            />
          </p>
          <img
            src="@/assets/images/login__delete@2x.png"
            @click="delete3input()"
            v-show="delete3"
            class="delete1 alt"
          />
          <img :src="eyeshidden3" alt class="showpassword" @click="Spassword3()" />
        </div>
      </div>

      <!-- 新密码： -->
      <div class="content_box">
        <div class="content_box_left">
          <span>新密码：</span>
        </div>
        <div :class="d1show?'d1':'d1 d1active'">
          <p>
            <input
              :type="typestate1"
              placeholder="输入新密码"
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
      </div>

      <div class="content_box">
        <div class="content_box_left content_box_left2">
          <span>新密码：</span>
        </div>
        <div :class="d1show1?'d2':'d2 d2active'">
          <p>
            <input
              placeholder="再次输入新密码"
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
      </div>
      
      <p :class="passsame?'p1':'p1 p1active'">{{msg}}</p>
      <div class="d4">
        <button :class="myinput1value!=''&&myinput2value!=''?'b1 b1active':'b1'">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "ChangeLoginPassword",
  data() {
    return {
      eyeshidden: require("@/assets/images/login__icon4@2x.png"),
      eyes: 1, //判断显示密码的状态
      typestate: "password",
      typestate1: "password",
      typestate3: "password", //原来密码的type
      eyeshidden1: require("@/assets/images/login__icon4@2x.png"),
      eyeshidden3: require("@/assets/images/login__icon4@2x.png"),
      eyes1: 1, //判断显示密码的状态

      d1show3: true, //输入原密码2的光标变量
      d1show: true, //输入新密码1的光标变量
      d1show1: true, //输入新密码2的光标变量

      myinput1value: "", //新密码输入框的value值
      myinput2value: "",
      myinput3value: "", //原密码
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      delete3: false,
      b1active: false, //登入按钮的手机号是否存在
      result: false, //手机号是否存在
      passsame: true, //判断两次密码提示文字的active
      msg: "*密码需由8-16位字母与数字的组合",
      result: false,
      result1: false
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
        this.d1show3 = false;
        if (this.myinput3value != "") {
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
              console.log("两次密码相同都是字母  和  文字的组成！");
              this.passsame = true;
              this.msg = "*密码需由8-16位字母与数字的组合";
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
        this.d1show3 = true;
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
    // 删除原密码input的数据
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
    // 点击眼睛图片显示隐藏密码  原密码
    Spassword3() {
      if (this.eyes1 == 1) {
        // console.log("第一次点击");
        this.typestate3 = "text";
        this.eyeshidden3 = require("@/assets/images/login__icon3@2x.png");
        this.eyes1 = 2;
      } else {
        // console.log("第二次点击");
        this.typestate3 = "password";
        this.eyeshidden3 = require("@/assets/images/login__icon4@2x.png");
        this.eyes1 = 1;
      }
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
.ChangeLoginPassword {
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
    // margin-top: 87px;
    margin-top: 44px;
    padding: 0 40px;
    .p1active {
      color: @main-color !important;
    }
    .p1 {
      font-size: 24px;
      padding-top: 20px;
      color: @text-colorC;
    }
    .content_box {
      display: flex;
      align-items: center;
      margin-top: 40px;
      .content_box_left {
        display: flex;
        align-items: center;
        font-size: 28px;
        span {
          padding-bottom: 8px;
        }
      }
      .d1active {
        border-bottom: 1px solid @main-color !important;
      }
      .d1 {
        flex: 1;
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
        flex: 1;
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