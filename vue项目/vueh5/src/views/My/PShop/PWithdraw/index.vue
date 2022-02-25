<template>
  <div class="PWithdraw">
    <div class="PWithdraw_box">
      <div class="title">
        <div class="d1">
          <span class="s1">提现方式：</span>
          <div class="d1_box" @click="selectType()">
            <div>
              <img :src="imgxz" alt="" />
              <span>{{ textxz }}</span>
            </div>
            <img
              src="@/assets/images/1.6_img/xia.png"
              alt=""
              class="img_xx"
              v-show="!selectshow"
            />
            <img
              src="@/assets/images/1.6_img/shang.png"
              alt=""
              class="img_xx"
              v-show="selectshow"
            />
          </div>
        </div>
        <div class="d2" v-show="selectshow">
          <span class="s1" style="visibility: hidden">提现方式：</span>
          <div class="d2_box">
            <ul>
              <li
                v-for="(item, index) in cashList"
                :key="index"
                @click="selectList(item, index)"
              >
                <img :src="item.img" alt="" />
                <p>
                  {{ item.text1 }}<span>{{ item.text2 }}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        <!-- 支付宝 -->
        <div class="d3" v-show="d3_show1">
          <div class="d3_div">
            <span class="s1">收款账户：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.accountName"
                type="text"
                placeholder="收款支付宝账户名称"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">账户号：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.cashAccount"
                type="text"
                placeholder="收款支付宝账户号"
              />
            </div>
          </div>
        </div>
        <!-- 微信 -->
        <div class="d3" v-show="d3_show2">
          <div class="d3_div">
            <span class="s1">微信号：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.accountName"
                type="text"
                placeholder="收款微信号"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">手机号：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.cashAccount"
                type="text"
                placeholder="收款微信手机号"
              />
            </div>
          </div>
          <!-- <div class="d3_div">
            <span class="s1">微信昵称：</span>
            <div class="d3_box">
              <input type="text" placeholder="收款微信昵称" />
            </div>
          </div> -->
        </div>
        <!-- 银联卡 -->
        <div class="d3" v-show="d3_show3">
          <div class="d3_div">
            <span class="s1">账户名：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.accountName"
                type="text"
                placeholder="账户名称（卡持有者的真实姓名）"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">账户号：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.cashAccount"
                type="text"
                placeholder="银联卡账户号"
              />
            </div>
          </div>
          <div class="d3_div">
            <span class="s1">开户行：</span>
            <div class="d3_box">
              <input
                v-model="submitdata.openingBank"
                type="text"
                placeholder="银联卡开户行"
              />
            </div>
          </div>
        </div>

        <div class="d10">
          <span class="s1">提现金额：</span>
          <div class="d10_box">
            <input
              v-model="submitdata.amount"
              :max="personData.balance"
              type="number"
              :placeholder="'最高可提现¥' + personData.balance"
            />
            <span @click="submitdata.amount = personData.balance"
              >全部提现</span
            >
          </div>
        </div>
      </div>

      <div class="foot">
        <button @click="submitBtn" :class="isActive ? 'active_Btn' : ''">
          提交申请
        </button>
        <div class="foot_div">
          <div class="d1">
            <p>提现金额会通过转款至您提供的提现账户</p>
            <p>每月10-20日按序打款，注意查收</p>
          </div>
          <div class="d2">如有疑问请拨打 400-7777-316</div>
        </div>
      </div>

      <loading ref="load" v-if="loadingshow"></loading>
    </div>
  </div>
</template>

<script>
import { GetCashOutAPI, AddAPI, GetWithdrawByTypeAPI } from "@/api/Proprietary";
import { Field } from "vant";
import loading from "@/components/loading";
export default {
  name: "PWithdraw",
  components: {
    [Field.name]: Field,
  },
  data() {
    return {
      personData: "", //个人信息
      imgxz: "",
      textxz: "请选择提现方式",
      selectshow: false,
      d3_show1: false,
      d3_show2: false,
      d3_show3: false,
      wayList: [
        {
          id: 1,
          img: require("@/assets/images/1.6_img/mendian_tixian_icon1.png"),
          text1: "支付宝",
          text2: "/支付宝转账",
        },
        {
          id: 2,
          img: require("@/assets/images/1.6_img/mendian_tixian_icon2.png"),
          text1: "微信",
          text2: "/添加好友转账",
        },
        {
          id: 3,
          img: require("@/assets/images/1.6_img/mendian_tixian_icon3.png"),
          text1: "银联卡",
          text2: "/银联转账",
        },
      ],
      cashList: [],
      submitdata: {
        getCashType: "", //提现方式（1支付宝，2微信，3银行卡）
        shopPickupPointId: this.$route.query.id, //门店ID
        amount: "", //	申请提现金额
        openingBank: "", //银行卡类型需要填写这个参数，其他忽略
        cashAccount: "", //支付宝账号名、银行卡账户号、微信手机号
        accountName: "", //支付宝账户户名、微信号、银行账户名
      },
      loadingshow: true,
    };
  },
  components: {
    loading: loading,
  },
  computed: {
    isActive: function () {
      // `this` 指向 vm 实例
      // console.log(this.submitdata.getCashType, "this.submitdata.getCashType");
      if (
        this.submitdata.getCashType == 1 ||
        this.submitdata.getCashType == 2
      ) {
        if (
          this.submitdata.cashAccount !== "" &&
          this.submitdata.accountName !== "" &&
          this.submitdata.amount !== ""
        ) {
          return true;
        } else {
          return false;
        }
      }

      if (this.submitdata.getCashType == 3) {
        if (
          this.submitdata.cashAccount !== "" &&
          this.submitdata.accountName !== "" &&
          this.submitdata.openingBank !== "" &&
          this.submitdata.amount !== ""
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  watch: {
    "submitdata.amount": function (val) {
      if (val > this.personData.balance) {
        this.submitdata.amount = this.personData.balance;
      }
    },
  },

  methods: {
    //选择提现类型
    submitBtn() {
      // console.log(this.submitdata, " this.submitdata");
      AddAPI(this.submitdata, "POST").then((res) => {
        console.log(res, "rrr");
        if (res.code == 1) {
          this.$router.replace({
            path: "/My/Income/Withdraw/Successedtow",
            query: { money: this.submitdata.amount },
          });
        }
      });
    },
    selectType() {
      this.selectshow = !this.selectshow;
    },
    //选择
    selectList(item, index) {

      console.log(item,index,"asasas")
      this.submitdata = {
        getCashType: item.id, //提现方式（1支付宝，2微信，3银行卡）
        shopPickupPointId: this.$route.query.id, //门店ID
        amount: this.submitdata.amount, //	申请提现金额
        openingBank: "", //银行卡类型需要填写这个参数，其他忽略
        cashAccount: "", //支付宝账号名、银行卡账户号、微信手机号
        accountName: "", //支付宝账户户名、微信号、银行账户名
      };
      this.imgxz = item.img;
      this.textxz = item.text1;
      this.selectshow = false;


      if (item.id == 1) {
        this.d3_show1 = true;
        this.d3_show2 = false;
        this.d3_show3 = false;
      } else if (item.id == 2) {
        this.d3_show1 = false;
        this.d3_show2 = true;
        this.d3_show3 = false;
      } else {
        this.d3_show1 = false;
        this.d3_show2 = false;
        this.d3_show3 = true;
      }
      console.log(item, "item");
      let data = {
        type: item.id,
      };
      GetWithdrawByTypeAPI(data, "get").then((res) => {//选择回显
        console.log(res, "ress");
        if(res.data){
           this.submitdata = res.data;
           
           this.submitdata.shopPickupPointId= this.$route.query.id
        }
      });
    },
  },
  mounted() {
    document.title = "提现";
    let data = {
      shopPickupPointId: this.$route.query.id,
    };
    GetCashOutAPI(data, "get").then((res) => {
      console.log(res, "resss");
      this.personData = res.data;
      let getCashType = res.data.getCashType.split(",").sort();
      let cashList = [];

      console.log(getCashType, "getCashType");
      getCashType.forEach((element) => {
        this.wayList.forEach((item) => {
          if (element == item.id) {
            cashList.push(item);
          }
        });
      });
      console.log(cashList, "cashList"); //最后的可选列表
      this.cashList = cashList;

      this.loadingshow = false;
    });
  },
};
</script>

<style lang="less">
.PWithdraw {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: #fff;
  .PWithdraw_box {
    padding: 0 40px;
    height: 100%;
    .title {
      width: 100%;
      .d1 {
        display: flex;
        align-items: center;
        .s1 {
          font-size: 28px;
          color: #000b26;
        }
        .d1_box {
          display: flex;
          align-items: center;
          flex: 1;
          border-bottom: 1px solid rgba(177, 182, 196, 0.2);
          margin-left: 16px;
          div {
            display: flex;
            align-items: center;
            padding: 28px 0;
            flex: 1;
            img {
              width: 46px;
            }
            span {
              font-size: 28px;
              color: #000b26;
              padding-left: 16px;
            }
          }
          .img_xx {
            width: 28px;
          }
        }
      }
      .d2 {
        display: flex;
        align-items: center;
        .d2_box {
          flex: 1;
          ul {
            width: 100%;
            li {
              width: 100%;
              display: flex;
              align-items: center;
              padding: 30px 0 0;
              img {
                width: 46px;
              }
              p {
                padding-left: 20px;
                font-size: 26px;
                color: #4a5060;
                span {
                  color: rgba(177, 182, 196, 1);
                  font-size: 22px;
                }
              }
            }
          }
        }
      }
      .d3 {
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        .d3_div {
          display: flex;
          align-items: center;
          margin-top: 12px;
          .s1 {
            font-size: 28px;
            color: #000b26;
            flex: 1;
          }
          .d3_box {
            display: flex;
            align-items: center;
            flex: 3.4;
            border-bottom: 1px solid rgba(177, 182, 196, 0.2);
            margin-left: 16px;
            padding: 28px 0;
            input {
              width: 100%;
              outline: none;
              border: none;
            }
          }
        }
      }
      .d10 {
        display: flex;
        align-items: center;
        margin-top: 12px;
        .s1 {
          font-size: 28px;
          color: #000b26;
          flex: 1;
        }
        .d10_box {
          display: flex;
          align-items: center;
          flex: 3.4;
          border-bottom: 1px solid rgba(177, 182, 196, 0.2);
          margin-left: 16px;
          padding: 28px 0;
          input {
            width: 100%;
            outline: none;
            border: none;
            flex: 1;
          }
          span {
            color: rgba(244, 39, 55, 1);
          }
        }
      }
    }
    .foot {
      display: flex;
      flex-direction: column;
      margin-top: 86px;
      button {
        pointer-events: none;
        width: 100%;
        height: 88px;
        background: rgba(177, 182, 196, 0.5);
        border-radius: 44px;
        color: #fff;
        font-size: 32px;
      }
      .active_Btn {
        pointer-events: unset;
        background: linear-gradient(#e73a3a 0%, #f64242 100%);
      }

      .foot_div {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 50px;
        .d1 {
          font-size: 26px;
          color: #7e8290;
          font-weight: bold;
          text-align: center;
          p {
            line-height: 40px;
          }
        }
        .d2 {
          font-size: 22px;
          color: #7e8290;
          text-align: center;
          line-height: 40px;
        }
      }
    }
  }
}
</style>