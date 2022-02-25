<template>
  <div class="prizeList">
    <van-list
      v-if="dataList.length !== 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <ul>
        <li
          class="listItem flex jc-sb aic"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <img
            v-if="item.awardType == 1"
            class="itemImg"
            src="@/assets/images/zk1.1/prize1.png"
          />
          <img
            v-else-if="item.shopImgUrl"
            class="itemImg"
            :src="item.shopImgUrl + '?x-oss-process=style/n4'"
          />
          <img v-else class="itemImg" src="@/assets/images/logo.png" alt="" />
          <div class="flex2">
            <ul class="flex ai-fe">
              <li class="itemType">{{ item.awardName }}</li>
              <li class="itemValue">{{ item.awardPrice | toFixedTow }}</li>
              <li class="itemValueName">元</li>
            </ul>
            <div class="pricedTime">中奖时间：{{ item.joinTime }}</div>
          </div>
          <div class="border"></div>
          <div class="btnStyle" @click="toGet(item.id, item.awardType)">
            {{ item.isGet == 0 ? "领取" : "已领取" }}
          </div>
        </li>
      </ul>
    </van-list>
    <div class="kong fcc" v-else>
      <span style="color: rgba(74, 80, 96, 1)">暂无中奖记录，</span>
      <span
        class="choujiang"
        style="color: rgba(255, 137, 73, 1)"
        @click="toChoujiang"
        >去抽奖>></span
      >
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { IsUserLoginAPI } from "@/api/commonApi";
import { GetBigWhellListAPI, TakeBigWhellPrizaAPI } from "@/api/index";
import { Toast } from "vant";
// 下拉处理
import { List } from "vant";
Vue.use(List);
export default {
  name: "prizeList",
  data() {
    return {
      isUserLogin: false, //判断是否登录
      total: 0,
      loading: false,
      finished: false,
      dataList: [],
      pagination: {
        pindx: 0,
        psize: 8,
      },
    };
  },
  components: {
    [List.name]: List,
  },
  methods: {
    toChoujiang() {
      this.$router.push({
        name: "bigWheel",
      });
    },
    toGet(id, type) {
      TakeBigWhellPrizaAPI({ id }, "post").then((res) => {
        // console.log(res, "vv");
        if (res.code == 1) {
          Toast({
            duration: 1000, // 持续展示 toast
            position: "center",
            forbidClick: false, //显示弹窗之后是否能够点击背景 可以
            message: "领取成功!",
          });
          this.dataList = [];
          this.total = 0;
          this.loading = false;
          this.finished = false;
          this.pagination.pindx = 0;
          this.getCouponsList();
        }
        this.$router.push({
          name: "Coupons",
          query: { index: type == 1 ? 2 : 1 },
        });
      });
    },
    onLoad() {
      this.getCouponsList();
    },
    getCouponsList() {
      // console.log("aa");
      if (!this.isUserLogin) {
        //未登录状态
        console.log(
          JSON.parse(window.localStorage.getItem("couponsList")),
          "44"
        );
        this.dataList = JSON.parse(window.localStorage.getItem("couponsList"))
          ? JSON.parse(window.localStorage.getItem("couponsList"))
          : [];
      } else {
        this.pagination.pindx++;
        GetBigWhellListAPI(this.pagination, "get")
          .then((res) => {
            this.total = res.data.total;
            this.dataList.push(...res.data.rows);
          })
          .then((res) => {
            // 加载状态结束
            this.loading = false;
            if (this.dataList.length === this.total) {
              this.finished = true;
            }
          });
        // return this.dataList;
      }
    },
  },
  mounted() {
    IsUserLoginAPI()
      .then((res) => {
        this.isUserLogin = res.data;
      })
      .then(() => {
        this.getCouponsList();
      });
  },
};
</script>

<style lang="less" scoped>
.prizeList {
  box-sizing: border-box;
  padding: 26px;
  background-size: 100%;
  height: 100%;
  overflow-y: auto;
  background-image: url("../../../assets/images/prizedBg.jpg");

  .listItem {
    box-sizing: border-box;
    padding: 32px 40px 32px 30px;
    margin-bottom: 24px;
    width: 100%;
    height: 192px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0px 0px 16px 0px rgba(4, 11, 37, 0.06);
  }
  .itemImg {
    width: 112px;
    height: 112px;
  }
  .itemType {
    font-size: 30px;
    font-weight: bold;
    text-align: left;
    color: #000a26;
  }
  .itemValue {
    font-size: 52px;
    font-weight: bold;
    text-align: left;
    color: rgba(244, 38, 54, 1);
  }
  .itemValueName {
    font-size: 24px;
    font-weight: bold;
    text-align: left;
    color: rgba(244, 38, 54, 1);
  }
  .pricedTime {
    margin-top: 22px;
    opacity: 0.5;
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    color: #040b25;
  }
  .border {
    width: 2px;
    height: 128px;
    opacity: 0.2;
    background: #f42636;
    border-radius: 1px;
  }
  .btnStyle {
    font-size: 28px;
    text-decoration: underline;
    text-align: center;
    color: #f42636;
    line-height: 40px;
  }
}
.kong {
  height: 94vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 0px 16px 0px rgba(4, 11, 37, 0.06);
}
.choujiang {
  font-size: 32px;
  font-weight: bold;
  text-align: left;
  line-height: 29px;
  letter-spacing: 0px;
}
</style>