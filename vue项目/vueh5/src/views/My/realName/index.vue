<template>
  <div class="comfirm">
    <div class="input_item flex aic">
      <span class="item_name">姓 名：</span>
      <input
        value
        type="text"
        class="item_input"
        placeholder="输入姓名"
        v-model="submitData.Name"
        oninput="if(value.length>20)value=value.slice(0,20)"
      />
    </div>
    <!-- <div class="input_item flex aic">
      <span class="item_name">证件类型：</span>
      <input value type="text" class="item_input" placeholder="二代身份证" v-model="submitData.coName" />
    </div>-->
    <!-- <div class="flex aic jc-sb selectItem" @click="showPicker=!showPicker">
      <span class="item_name">证件类型：</span>
      <div class="fg1 flex jc-sb right">
        <span class="fontContent">{{submitData.CardType}}</span>
        <van-icon name="arrow" />
      </div>
    </div>-->

    <!-- <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        title="标题"
        show-toolbar
        @change="changeSelect"
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>-->
    <div class="input_item flex aic">
      <span class="item_name">身份证号：</span>
      <p class="item_p">
        <input
          value
          type="text"
          class="item_input"
          placeholder="输入身份证号"
          v-model="submitData.idCard"
          @focus="PhoneFocus('1')"
          @blur="PhoneBlur('1')"
          oninput="if(value.length>18)value=value.slice(0,18)"
        />
        <img
          src="@/assets/images/login__delete@2x.png"
          @click="
            delete1input('1');
            return false;
          "
          v-show="delete2"
          class="delete1"
          alt
        />
      </p>
    </div>

    <div class="input_item flex aic">
      <span class="item_name">银行卡号：</span>
      <p class="item_p">
        <input
          value
          type="number"
          class="item_input"
          placeholder="输入银行卡号"
          v-model="submitData.CardNumber"
          @focus="PhoneFocus('2')"
          @blur="PhoneBlur('2')"
          oninput="if(value.length>20)value=value.slice(0,20)"
        />
        <img
          src="@/assets/images/login__delete@2x.png"
          @click="
            delete1input('2');
            return false;
          "
          v-show="delete1"
          class="delete1"
          alt
        />
      </p>
    </div>

    <div class="input_itemTow" v-show="msgTow">
      <span class="s1">徐徐徐徐：</span>
      <span class="s2">{{ msgTow }}</span>
    </div>

    <div class="input_item flex aic">
      <span class="item_name">手 机 号：</span>
      <input
        value
        type="text"
        class="item_input"
        placeholder="输入绑定银行卡的手机号"
        oninput="if(value.length>11)value=value.slice(0,11)"
        @input="phoneNumberChange"
        v-model="submitData.Mobile"
      />
    </div>
    <div class="input_item flex aic">
      <span class="item_name">验 证 码：</span>
      <div class="right flex jc-sb w100pc">
        <input
          class="getCode"
          type="text"
          placeholder="输入6位短信验证码"
          v-model="submitData.CodeVerify"
          oninput="if(value.length>6)value=value.slice(0,6)"
        />
        <!-- <div @click="getCode" :class="disabled?'disabled':'getCodeBtn'">{{msg}}</div> -->
        <div
          @click="getCode"
          v-bind:class="{
            SecurityCode: result,
            zcclass: !result,
            noClick: disabled,
          }"
        >
          {{ msg }}
        </div>
      </div>
    </div>
    <div :class="allCheaked ? '' : 'none'" class="renzheng" @click="ToComfirm">
      认证
    </div>
  </div>
</template>

<script>
import { Cell } from "vant";
import { Picker } from "vant";
import { Icon } from "vant";
// Popup 动作面板
import { Popup } from "vant";
import { TrueValIDCodeVerifyAPI, TrueValIDAPI } from "@/api/Iocome";
import qs from "qs";
import { Toast } from "vant";

export default {
  name: "realName",
  components: {
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
  },
  data() {
    return {
      holder: "二代身份证", //
      msg: "获取验证码",
      // allCheaked: false, //所有都选择了
      disabled: false, //无法点击
      //showPicker: false, //展示弹窗
      submitData: {
        //提交表单
        // Name: "石远亲",
        // CardNumber: "6217003170028123281", //银行卡
        // idCard: "433124199808220517", //身份证号码
        // Mobile: "15107414981", //手机号
        Name: "",
        CardNumber: "", //银行卡
        idCard: "", //身份证号码
        Mobile: "", //手机号
        CodeVerify: "", //验证码
        FlagGuid: "", //验证码标识
      },
      columns: ["二代身份证", "银行卡"],
      msgTow: "",
      delete1: false, //手机号输入框后面的关闭img
      delete2: false,
      result: false, //手机号是否存在
    };
  },
  computed: {
    allCheaked: function () {
      if (
        this.submitData.Name &&
        this.submitData.idCard &&
        this.submitData.CardNumber &&
        this.submitData.Mobile &&
        this.submitData.CodeVerify &&
        this.submitData.FlagGuid
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    // 删除手机号input的数据
    delete1input(parameter) {
      if (parameter == 1) {
        if (this.submitData.idCard) {
          this.submitData.idCard = "";
        }
      } else {
        if (this.submitData.CardNumber) {
          this.submitData.CardNumber = "";
        }
      }
    },
    // 触发两个input焦点
    PhoneFocus(parameter) {
      if (parameter == 1) {
        if (this.submitData.idCard != "") {
          this.delete2 = true;
        }
      } else {
        if (this.submitData.CardNumber != "") {
          this.delete1 = true;
        }
      }
    },
    // 失去两个input焦点
    PhoneBlur(parameter) {
      if (parameter == 1) {
        clearInterval(ytime);
        let ytime = setInterval(() => {
          this.delete2 = false;
          clearInterval(ytime);
        }, 300);
      } else {
        clearInterval(ytime);
        let ytime = setInterval(() => {
          this.delete1 = false;
          clearInterval(ytime);
        }, 300);
      }
    },
    ToComfirm() {
      // let data = JSON.stringify(this.submitData);
      var data = new FormData();

      data.append("name", this.submitData.Name);
      data.append("idCard", this.submitData.idCard);
      data.append("cardNumber", this.submitData.CardNumber);
      data.append("mobile", this.submitData.Mobile);
      data.append("CodeVerify", this.submitData.CodeVerify);
      data.append("FlagGuid", this.submitData.FlagGuid);
      TrueValIDAPI(data).then((res) => {
        console.log(this.submitData, "this.submitData");
        console.log(res, "res");
        if (res.errorData == 5) {
          this.msgTow = "*证件号格式错误，请检查后重试";
        }
        if (res.code == 1) {
          // this.$router.replace({
          //   path: "/My/Income/Withdraw",
          // });
          this.$router.go(-1);
          Toast.success("认证成功");
        }
      });
    },
    onConfirm(e) {
      // console.log(e,"aa")
      this.holder = e;
      // this.showPicker = false;
    },
    onCancel() {
      // this.showPicker = false;
    },
    // 判断手机号是否存在
    phoneNumberChange(e) {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      //判断手机号是否存在
      let reg = /^1\d{10}$/;
      // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      let result1 = reg.test(this.submitData.Mobile);
      console.log(result1, "result1 result1 result1");
      this.result = result1;
    },
    // 点击获取验证码 调用接口
    getCode() {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      let num = 60;
      let self = this;
      //判断手机号是否存在
      let reg = /^1\d{10}$/;
      let result = reg.test(self.submitData.Mobile);
      self.result = false;
      //先判断输入的东西是不是手机号 在做判断
      if (result) {
        if (self.submitData.Mobile === "") {
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
        alert("请输入正确的手机号");
      }
    },
    // 获取短信验证码
    getMsgCode() {
      // console.log(this.myinput1value);
      let data = {
        Mobile: this.submitData.Mobile,
      };
      TrueValIDCodeVerifyAPI(data).then((res) => {
        this.submitData.FlagGuid = res.data;
        if (res.Code) {
          Toast(res.msg);
        }
      });
    },
  },
  watch: {
    "submitData.idCard": function () {
      if (this.submitData.idCard != "") {
        this.delete2 = true;
      } else {
        this.delete2 = false;
      }
    },
    "submitData.CardNumber": function () {
      if (this.submitData.CardNumber != "") {
        this.delete1 = true;
      } else {
        this.delete1 = false;
      }
    },
  },
  mounted() {
    document.title = "实名认证";
  },
};
</script>

<style lang="less" scoped>
.fontContent {
  font-size: 28px;
  font-weight: 400;
  color: #000a26;
}
.input_item {
  margin-top: 20px;
}
.input_item:nth-child(1) {
  margin-top: 0;
  padding-top: 20px;
}
.none {
  background: #b1b6c3 !important;
  color: #ffffff !important;
  pointer-events: none;
}
.renzheng {
  margin-top: 110px;
  width: 670px;
  line-height: 88px;
  text-align: center;
  height: 88px;
  background: linear-gradient(#e73a3a 0%, #f64242 100%);
  border-radius: 44px;
  font-size: 32px;
  font-weight: 500;
  color: #ffffff;
}
// .disabled {
//   color: @main-color;
//   pointer-events: none;
//   height: 80px;
//   line-height: 80px;
//   text-align: center;
//   font-size: 28px;
// }
.SecurityCode {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: @main-color !important;
}
.SecurityCode::before {
  content: "|";
  margin-right: 14px;
  color: #b1b6c3;
}
.noClick {
  pointer-events: none;
}
.zcclass {
  height: 80px;
  line-height: 80px;
  text-align: right;
  font-size: 28px;
  color: #b1b6c3;
  width: 50%;
}

.zcclass::before {
  content: "|";
  margin-right: 14px;
  color: #b1b6c3;
}

.comfirm {
  margin: 0 40px;

  .item_name {
    min-width: 150px;
    font-size: 28px;
  }
  .item_input {
    height: 80px;
    border: 0;
    width: 100%;
    border-bottom: 1px solid @border-colorA;
    font-size: 28px;
    color: @text-colorA;
  }
  .selectItem {
    line-height: 80px;
    margin-top: 20px;
    height: 80px;
  }
  // .disabled::before {
  //   content: "|";
  //   margin-right: 14px;
  //   color: #b1b6c3;
  // }
  .getCodeBtn {
    height: 80px;
    // color: #f42636;
    color: #7d828f;
    line-height: 80px;
    text-align: center;
    font-size: 28px;
  }
  .getCodeBtn::before {
    content: "|";
    margin-right: 14px;
    color: #b1b6c3;
  }
  .getCode {
    border: 0;
    font-size: 28px;
    color: @text-colorA;
    width: 50%;
  }
  .right {
    height: 80px;
    border-bottom: 1px solid #e4e4e4;
  }
  .van-icon-arrow {
    line-height: 80px;
  }
  /deep/ .van-picker__confirm {
    color: #f42636;
  }
  /deep/ .van-picker__cancel {
    color: #f42636;
  }
}

.input_itemTow {
  height: 100px;
  display: flex;
  align-items: center;
}
.input_itemTow .s1 {
  visibility: hidden;
}
.input_itemTow .s2 {
  color: rgba(244, 38, 54, 1);
  font-size: 28px;
  line-height: 32px;
}

.item_p {
  flex: 1;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
}
.item_p input {
  border-bottom: none !important;
}
.item_p img {
  width: 24px;
  height: 24px;
}
</style>