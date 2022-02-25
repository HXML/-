<template>
  <div class="income">
    <!-- 头部 -->

    <div class="header flex jc-sa">
      <div class="flex2 item money">
        <div class="flex ai-fe">
          <span class="f24">¥</span>
          <span>{{ information.total }}</span>
        </div>
        <span class="f24 mt-24 moneytextTow">{{ textdata.text1 }}</span>
        <span class="f20 op-6 mt-12 moneytext">{{ textdata.text2 }}</span>
      </div>
      <div class="flex2 item money">
        <div class="flex ai-fe">
          <span class="f24">¥</span>
          <span>{{ information.balance }}</span>
        </div>
        <div class="flex f24 mt-24 moneytextTow">
          <span>余额</span>
          <span class="btn" @click="jumpwithdraw()">提现</span>
        </div>
        <span class="f20 op-6 mt-12 moneytext">我可提现的余额</span>
      </div>
    </div>

    <!-- 头部 -->
    <Sticky>
      <div class="flex jc-sb sticky">
        <div class="flex">
          <div
            @click="
              isIndex = !isIndex;
              CheckType(1);
            "
            class="incomeText incomeTextTow"
            :class="isIndex ? 'actived' : 'normal'"
          >
            <span class="incomewb">收入</span>
            <span class="xhx" v-if="isIndex"></span>
          </div>
          <div
            @click="
              isIndex = !isIndex;
              CheckType(2);
            "
            class="incomeTextTow"
            :class="isIndex ? 'normal' : 'actived'"
          >
            <span class="incomewb">支出</span>
            <span class="xhx" v-if="!isIndex"></span>
          </div>
        </div>
        <div class="flex rel aic">
          <div class="flex2 ai-fe" @click="showAllMonth = !showAllMonth">
            <span class="month">{{ Time }}</span>
            <!-- <span class="month_money mt-10">{{month}}收入：￥89633.30</span> -->
          </div>
          <Icon name="arrow-down" @click="showAllMonth = !showAllMonth" />
          <ul v-show="showAllMonth" class="abs all_month rel">
            <li
              v-for="(item, index) in YearMonth"
              :key="index"
              @click="clickTabChange(index, item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </Sticky>

    <div class="content_month">
      <div class="oneMonthContent">
        <!-- 内容 {{ index }} -->

        <!-- 收入 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
          :immediate-check="false"
          v-show="isIndex"
        >
          <div
            class="flex jc-sb itemA_income"
            v-for="(item, index) in Payment"
            :key="'itemA_income' + index"
          >
            <div class="left flex2">
              <div class="left_div">
                <img
                  src="@/assets/images/zk1.1/1.1_img_icon3@2x.png"
                  alt=""
                  v-if="item.incomeType == 1"
                />
                <img
                  src="@/assets/images/zk1.1/1.1_img_icon2@2x.png"
                  alt=""
                  v-if="item.incomeType == 3"
                />
                <p>
                  <span class="span_title">{{item.typeStr}}</span
                  >
                  <!-- <span class="span_title" v-if="item.incomeType == 1"
                    >好友消费</span
                  >
                  <span class="span_title" v-if="item.incomeType == 3"
                    >转盘红包</span
                  > -->
                  <span class="span_time mt-16">{{ item.creatorDate }}</span>
                </p>
              </div>
            </div>
            <div class="left flex2 ai-fe">
              <span class="span_incomeMoney">+{{ item.incomeAmount }}</span>
              <span class="span_time mt-16"
                >余额：{{ item.beforeBalance }}</span
              >
            </div>
          </div>
        </van-list>

        <!-- 支出 -->
        <van-list
          v-model="loadingTow"
          :finished="finishedTow"
          finished-text=""
          @load="onLoadTow"
          :immediate-check="false"
          v-show="!isIndex"
        >
          <div
            class="flex jc-sb itemB_income"
            v-for="(item, index) in PaymentTow"
            :key="'itemB_income' + index"
          >
            <div class="left flex2">
              <div class="left_div">
                <img src="@/assets/images/zk1.1/1.1_img_icon5@2x.png" alt="" />
                <p>
                  <span class="span_title">余额提现</span>
                  <span class="span_time mt-16">{{ item.creatorDate }}</span>
                </p>
              </div>
            </div>
            <div class="left flex2 ai-fe">
              <span class>-{{ item.incomeAmount }}</span>
              <span class="span_time mt-16"
                >余额：{{ item.beforeBalance }}</span
              >
            </div>
          </div>
        </van-list>

        <div class="kong" v-if="Payment.length == 0 && isIndex">
          <div class="kong_box">
            <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
            <p class="p2">还没有收入记录呀</p>
          </div>
        </div>

        <div class="kong" v-if="PaymentTow.length == 0 && !isIndex">
          <div class="kong_box">
            <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
            <p class="p2">还没有支出记录呀</p>
          </div>
        </div>
      </div>
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { Sticky } from "vant";
import { Icon } from "vant";
import loading from "@/components/loading";

// 下拉处理
import { List } from "vant";

import { MyAccountRunsAPI, MyBaseDataAPI } from "@/api/MyApi";
import { GetStorePersonalCenterAPI } from "@/api/Proprietary";
export default {
  components: {
    Icon,
    Sticky,
    [List.name]: List,
    loading: loading,
  },
  data() {
    return {
      textdata: {
        text1: "总收入",
        text2: "在商城的收入总和",
      },
      loadingshow: true,
      YearMonth: [], //年月
      active: 3,
      isIndex: true, //输入
      showAllMonth: false,
      information: {
        total: "",
        balance: "",
      },
      Payment: [],
      PaymentTow: [],
      pageData: {
        isPickupId: 0,
        IsIncome: 1, //1 收入 2支出
        pIdx: 0,
        psize: 10,
        S_DateTime: this.dateTime,
      },
      pageDataTow: {
        isPickupId: 0,
        IsIncome: 2, //1 收入 2支出
        pIdx: 0,
        psize: 10,
        S_DateTime: this.dateTime,
      },
      loading: false,
      finished: false,
      total: 0,
      loadingTow: false,
      finishedTow: false,
      totalTow: 0,
      Time: "",
      month: "",
      type: 1, //选择的是
    };
  },
  methods: {
    tabMonthChange(e) {
      // console.log(e);
    },
    clickTabChange(index, _this) {
      this.loadingshow = true;

      console.log(_this);
      console.log(this.type, "type");
      if (this.type == 1) {
        this.pageData.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.Payment = [];
        this.month = _this.substr(5);
        this.showAllMonth = false;
        this.Time = _this;
        this.pageData.S_DateTime = _this;
        this.pageDataTow.S_DateTime = _this;
        this.MyAccountRunsData();
      } else if (this.type == 2) {
        this.pageDataTow.pIdx = 0;
        this.loadingTow = true;
        this.finishedTow = false;
        this.PaymentTow = [];
        this.month = _this.substr(5);
        this.showAllMonth = false;
        this.Time = _this;
        this.pageData.S_DateTime = _this;
        this.pageDataTow.S_DateTime = _this;
        this.MyAccountRunsDataTow();
      }
    },
    CheckType(type) {
      this.loadingshow = true;
      this.type = type;
      console.log(this.type);

      if (type == 1) {
        this.pageDataTow.pIdx = 0;
        this.loadingTow = false;
        this.finishedTow = false;
        this.PaymentTow = [];
        this.MyAccountRunsData();
      } else if (type == 2) {
        this.pageData.pIdx = 0;
        this.loading = false;
        this.finished = false;
        this.Payment = [];
        this.MyAccountRunsDataTow();
      }
      // this.pageData.IsIncome = type;
      // this.MyAccountRunsData();
    },
    // 个人中心信息
    MyBaseData() {
      MyBaseDataAPI("get").then((res) => {
        // console.log(res,"个人中心信息");
        this.information.total = res.total;
        this.information.balance = res.balance;
      });
    },
    // 获取门店首页信息
    GetStorePersonalCenter() {
      let data = {
        id: this.$route.query.id,
      };
      GetStorePersonalCenterAPI(data, "get").then((res) => {
        this.information.total = res.data.historicalIncome;
        this.information.balance = res.data.balance;
      });
    },
    // 收入接口
    MyAccountRunsData() {
      this.pageData.pIdx++;
      MyAccountRunsAPI(this.pageData, "get")
        .then((res) => {
          console.log(res, "收入接口");
          this.total = res.total;
          this.Payment.push(...res.rows);
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          console.log(this.Payment.length, this.total);
          if (this.Payment.length === this.total) {
            this.finished = true;
          }
        });
    },
    // 支出接口
    MyAccountRunsDataTow() {
      this.pageDataTow.pIdx++;
      MyAccountRunsAPI(this.pageDataTow, "get")
        .then((res) => {
          console.log(res, "支出接口");
          this.totalTow = res.total;
          this.PaymentTow.push(...res.rows);
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loadingTow = false;
          console.log(this.PaymentTow.length, this.totalTow);
          if (this.PaymentTow.length === this.totalTow) {
            this.finishedTow = true;
          }
        });
    },
    jumpwithdraw() {
      if (this.$route.query.id) {
        this.$router.push({
          path: "/My/PShop/PWithdraw",
          query: {
            id: this.$route.query.id,
          },
        });
      } else {
        this.$router.push({
          path: "/My/Income/Withdraw",
        });
      }
    },
    DateYearMonth() {
      //当前年份
      var NowYear = new Date().getFullYear();
      //当前月份
      var NowMonth = new Date().getMonth();
      //获取从2018年到现在的所有年份
      for (var i = NowYear; i >= 2018; i--) {
        //默认每年12个月
        var monCount = 12;
        //如果当前是循环的年份是今年，则只要取到当前月份
        if (i == NowYear) {
          monCount = NowMonth + 1;
        }
        //将年月保存在数组中
        for (var j = monCount; j > 0; j--) {
          if (j < 10) {
            j = "0" + j;
          }
          this.YearMonth.push(i + "年" + j + "月");
        }
      }
      console.log(this.YearMonth, "this.YearMonth");
    },
    onLoad() {
      // 异步更新数据
      this.MyAccountRunsData();
    },
    onLoadTow() {
      // 异步更新数据
      this.MyAccountRunsDataTow();
    },
  },
  mounted() {
    var newYear = new Date().getFullYear();
    var newMonth = new Date().getMonth() + 1;
    this.Time = newYear + "年" + newMonth + "月";
    this.month = newMonth + "月";
    this.pageData.S_DateTime = newYear + "年" + newMonth + "月";
    this.pageDataTow.S_DateTime = newYear + "年" + newMonth + "月";

    this.DateYearMonth();
    this.MyAccountRunsData();

    if (this.$route.query.id) {
      document.title = "门店收入";
      this.textdata.text1 = "门店总收入";
      this.textdata.text2 = "在门店的收入总和";
      this.GetStorePersonalCenter();
      this.pageData.isPickupId = this.$route.query.id;
      this.pageDataTow.isPickupId = this.$route.query.id;
    } else {
      document.title = "收入";
      this.MyBaseData();
    }
  },
};
</script>

<style lang="less" scoped>
.income {
  .content_month {
    /deep/.van-sticky {
      display: none;
    }
  }
  .header {
    margin: 16px 8px;
    background: url("../../../assets/images/mine_income_bg@2x.png") no-repeat;
    background-size: cover;
    width: 732px;
    height: 243px;
    margin: auto;
  }
  .item {
    margin-top: 44px;
    height: 243px;
  }
  .money {
    font-size: 42px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    .moneytext {
      font-weight: normal;
    }
    .moneytextTow {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
  .btn {
    margin-left: 18px;
    text-align: center;
    padding: 4px 16px;
    background: rgba(255, 85, 51, 1);
    border-radius: 13px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
  .oneMonthContent {
    height: 40px;
    .itemA_income {
      padding: 30px 0;
      margin: 0 30px;
      align-items: center;
      border-bottom: 1px solid #f6f7f8;
    }
    .itemB_income {
      padding: 30px 0;
      margin: 0 30px;
      align-items: center;
      border-bottom: 1px solid #f6f7f8;
    }
    .left {
      .left_div {
        display: flex;
        align-items: center;
        img {
          width: 48px;
          height: 48px;
        }
        p {
          display: flex;
          flex-direction: column;
          padding-left: 24px;
        }
      }
      .span_title {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 10, 38, 1);
      }
      .span_time {
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(177, 182, 195, 1);
      }
      .span_incomeMoney {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 163, 65, 1);
      }
    }
  }
  .actived {
    // height: 40px;
    // border-bottom: 1px solid #f42636;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: @main-color;
    pointer-events: none;
  }
  .normal {
    // height: 40px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: @text-colorB;
  }
  .incomeText {
    margin-right: 70px;
  }
  .incomeTextTow {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .incomewb {
      margin-bottom: 8px;
    }
    .xhx {
      width: 30px;
      height: 2px;
      background: #f42636;
    }
  }
  .sticky {
    padding: 40px 40px 30px;
    background-color: #ffffff;
  }

  .month_money {
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 400;
    color: @text-colorD;
  }
  .month {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: @text-colorB;
  }

  .three {
    display: block;
    width: 0;
    height: 0;
    border-width: 0 16px 16px;
    border-style: solid;
    border-color: transparent transparent #fc0; /*透明 透明  黄*/
    position: absolute;
    top: -10px;
    right: 0px;
  }
  .all_month {
    z-index: 99;
    padding: 40px 20px;
    right: 0;
    top: 60px;
    max-height: 312px;
    min-width: 140px;
    overflow-y: scroll;
    background: @text-colorB;
    border-radius: 16px;
    li {
      text-align: center;
      margin-bottom: 28px;
      font-size: 24px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
    li:last-child {
      margin-bottom: 0;
      font-size: 24px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>