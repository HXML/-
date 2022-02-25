<template>
  <div style="width:100%;height:100%;">
    <div class="Coupons">
      <div class="CouponsList_bttop">
        <span
          class="name"
          :class="{active: activeName == index}"
          @click="selected(index)"
          v-for="(item,index) in titledata"
          :key="index"
        >{{item}}</span>
      </div>

      <div class="left_div" v-if="show1">
        <div class="kong" v-if="CouponsList.length==0&&show1">
          <div class="kong_box">
            <img src="@/assets/images/kong/kong_icon6@2x.png" alt />
            <p class="p1">没有可用的优惠券</p>
            <p class="p2">已领优惠券都在这里排好队等您宠幸</p>
          </div>
        </div>
        <div class="Coupons_box" v-if="CouponsList.length!=0&&show1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
          >
            <div
              v-bind:class="[item.Datanum==1 ? 'Coupons_item':'Coupons_item2']"
              v-for="(item,index) in CouponsList"
              :key="index"
            >
              <div class="left">
                <div class="d1">
                  <!-- <img src="@/assets/images//dp/dp_tab_logo@2x.png" alt v-if="!item.shopImg"/> -->
                  <img src="@/assets/images/logo.png" v-if="!item.shopImg" alt />
                  <img :src="item.shopImg+'?x-oss-process=style/n3'" v-else alt />

                  <span>{{item.shopName}}</span>
                </div>
                <div class="d2">
                  <span>¥</span>
                  <span>{{item.faceValue}}</span>
                </div>
                <div class="d3">
                  <span>
                    <i v-show="item.couponsType==2">无门槛优惠券</i>
                    <i v-show="item.couponsType==1">满{{item.quotaLimit}}可用</i>
                    <br />
                    <i>有效期至{{item.useEndDate}}</i>
                  </span>
                </div>
              </div>
              <div class="right">
                <span class="s1">{{item.Datanow}}</span>
                <span
                  v-show="item.Datanum==1"
                  class="s2"
                  @click="jumpProductList(item.shopId,item.shopCouponsId)"
                >去使用</span>

                <span
                  v-show="item.Datanum==2"
                  class="s3"
                >{{convertToChinaNum(item.DatanowNum)}}天后自动删除</span>
              </div>
            </div>
          </van-list>
        </div>
      </div>

      <div class="right_div" v-if="!show1">
        <div class="kong" v-if="envelopelist.length==0&&!show1">
          <div class="kong_box">
            <img src="@/assets/images/zk1.1/prize1.png" alt />
            <p class="p1">没有可用的红包</p>
            <p class="p2">已领红包都在这里排好队等您宠幸</p>
          </div>
        </div>
        <div class="envelope_box" v-if="envelopelist.length!=0&&!show1">
          <van-list
            v-model="loadingTow"
            :finished="finishedTow"
            finished-text="没有更多了"
            @load="onLoadTow"
            :immediate-check="false"
          >
            <div
              v-for="(item,index) in envelopelist"
              :key="index"
              class="envelope_item"
              v-bind:class="[item.isExchange==0 ?'envelope_item':'envelope_item2']"
            >
              <div class="left">
                <div class="d1">
                  <img
                    src="@/assets/images/zk1.1/1.1_img_zhuanpan_icon1@2x.png"
                    alt
                    v-if="item.isExchange==0"
                  />
                  <img
                    src="@/assets/images/zk1.1/1.1_img_zhuanpan_icon2@2x.png"
                    alt
                    v-if="item.isExchange==1"
                  />
                </div>
                <div class="d2">
                  <p class="p1">
                    <span class="s1">{{item.faceValue}}</span>
                    <span class="s2">元</span>
                  </p>
                  <p class="p2">中奖时间：{{item.creatorDate}}</p>
                </div>
              </div>
              <div class="right">
                <span
                  class="s1"
                  v-if="item.isExchange==0"
                  @click="PostUseRedPacket(item.id,item.faceValue)"
                >去提现</span>
                <span class="s2" v-if="item.isExchange==1">已领取</span>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>


<script>
import qs from "qs";
import {
  GetUserCouponsListAPI,
  GetUserRedPacketAPI,
  UseRedPacketAPI,
} from "@/api/coupons";
// 下拉处理
import { List } from "vant";
import loading from "@/components/loading";
export default {
  name: "Coupons",
  data() {
    return {
      titledata: "券包", //控制title的动态变量
      CouponsList: [],
      loading: false,
      finished: false,
      Couponsdata: {
        userId: window.localStorage.getItem("userId"),
        pIdx: 0,
        pSize: 10, //商品页面的初始化的index
      },
      total: 0, //商品的总数量
      loadingshow: true,
      activeName: 0, //切换商品店铺
      titledata: ["优惠券", "红包"],
      show1: true,
      envelopelist: [],
      envelopedata: {
        pIndx: 0,
        pSize: 14, //商品页面的初始化的index
      },
      loadingTow: false,
      finishedTow: false,
      totalTow: 0,
    };
  },
  components: {
    [List.name]: List,
    loading: loading,
  },
  methods: {
    selected(index) {

      if (!window.localStorage.getItem("Token")) {
        this.activeName = index;
        this.GetUserCouponsList();
        if (index === 0) {
          this.show1 = true;

        } else {
          this.show1 = false;
          this.GetUserRedPacketlist();
        }
        return false;
      }

      this.loadingshow = true;
      this.activeName = index;
      console.log(index, "index");

      this.envelopedata.pIndx = 0;
      this.loadingTow = true;
      this.finishedTow = false;
      this.envelopelist = [];
      if (index === 0) {
 this.show1 = true;
         this.GetUserCouponsList()

      } else if (index === 1) {
        this.Couponsdata.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.CouponsList = [];
        this.GetUserRedPacketlist();

        console.log(this.envelopelist);
        this.show1 = false;
      }
    },
    // 获取优惠券列表
    GetUserCouponsList() {
      if (!window.localStorage.getItem("Token")) {
        this.loadingshow = false;

        if (window.localStorage.getItem("couponsList")) {
          this.CouponsList = JSON.parse(
            window.localStorage.getItem("couponsList")
          ).map((item) => {
            return Object.assign({}, item, {
              Datanum: 1,
              Datanow: this.funData(item.useEndDate),
              DatanowNum: 7,
            });
          });

          console.log(this.CouponsList, "this.CouponsList");

          this.CouponsList.forEach((item) => {
            if (
              this.funData(
                item.useEndDate.replace(new RegExp("-", "gm"), "/")
              ) >= 0
            ) {
              item.Datanum = 1;
              if (
                this.funData(
                  item.useEndDate.replace(new RegExp("-", "gm"), "/")
                ) == 0
              ) {
                item.Datanow = "今天过期";
              } else {
                item.Datanow = "";
              }
            } else {
              console.log(
                this.funData(
                  item.useEndDate.replace(new RegExp("-", "gm"), "/")
                ),
                "过期的天数"
              );
              item.Datanum = 2;
              item.DatanowNum =
                item.DatanowNum +
                this.funData(
                  item.useEndDate.replace(new RegExp("-", "gm"), "/")
                );
              item.Datanow = "已过期";
            }
          });
        } else {
          this.CouponsList = [];
        }

        return false;
      }

      this.Couponsdata.pIdx++;
      GetUserCouponsListAPI(this.Couponsdata, "get")
        .then((res) => {
          console.log(res, "获取个人的所有优惠券");
          // this.CouponsList = res.rows;

          this.total = res.total;
          this.CouponsList.push(
            ...res.rows.map((item) => {
              return Object.assign({}, item, {
                Datanum: 1,
                Datanow: this.funData(item.useEndDate),
                DatanowNum: 7,
              });
            })
          );

          console.log(this.funData("2021-08-20 00:00:00"), "时间差");

          this.CouponsList.forEach((item) => {
            if (
              this.funData(
                item.useEndDate.replace(new RegExp("-", "gm"), "/")
              ) >= 0
            ) {
              item.Datanum = 1;
              if (
                this.funData(
                  item.useEndDate.replace(new RegExp("-", "gm"), "/")
                ) == 0
              ) {
                // console.log(this.funData(item.useEndDate) ,"this.funData(item.useEndDate) ")
                item.Datanow = "今天过期";
              } else {
                // console.log(item.Datanow, "item.Datanow");
                item.Datanow = "";
              }
            } else {
              console.log(
                this.funData(
                  item.useEndDate.replace(new RegExp("-", "gm"), "/")
                ),
                "过期的天数"
              );
              item.Datanum = 2;
              item.DatanowNum =
                item.DatanowNum +
                this.funData(
                  item.useEndDate.replace(new RegExp("-", "gm"), "/")
                );
              item.Datanow = "已过期";
            }
          });
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.CouponsList.length === this.total) {
            this.finished = true;
          }
        });
    },
    //获取用户的红包
    GetUserRedPacketlist() {
      if (!window.localStorage.getItem("Token")) {
        this.loadingshow = false;

        if (window.localStorage.getItem("envelopeList")) {
          this.envelopelist = JSON.parse(
            window.localStorage.getItem("envelopeList")
          );
        } else {
          this.envelopelist = [];
        }

        return false;
      }
      this.envelopedata.pIndx++;
      GetUserRedPacketAPI(this.envelopedata, "get")
        .then((res) => {
          console.log(res);
          this.totalTow = res.data.total;
          this.envelopelist.push(...res.data.rows);
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loadingTow = false;
          console.log(this.envelopelist.length, "+++++", this.totalTow);
          if (this.envelopelist.length === this.totalTow) {
            this.finishedTow = true;
          }
        });
    },
    //红包提现
    PostUseRedPacket(id, faceValue) {
      let data = qs.stringify({
        id: id,
      });
      UseRedPacketAPI(data, "post").then((res) => {
        console.log(res, "红包提现");
        window.localStorage.setItem("faceValue", faceValue);
        this.$router.push({ path: "/My" });
      });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetUserCouponsList();
    },
    onLoadTow() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetUserRedPacketlist();
    },
    // 两个时间差
    funData(newData) {
      let startTime = new Date(); // 开始时间
      let endTime = new Date(newData); // 结束时间
      return Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24); // 天数
    },
    //将数字（整数）转为汉字
    convertToChinaNum(num) {
      var arr1 = new Array(
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      );
      var arr2 = new Array(
        "",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿"
      ); //可继续追加更高位转换值
      if (!num || isNaN(num)) {
        return "零";
      }
      var english = num.toString().split("");
      var result = "";
      for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i; //倒序排列设值
        result = arr2[i] + result;
        var arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
      }
      //将【零千、零百】换成【零】 【十零】换成【十】
      result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十");
      //合并中间多个零为一个零
      result = result.replace(/零+/g, "零");
      //将【零亿】换成【亿】【零万】换成【万】
      result = result.replace(/零亿/g, "亿").replace(/零万/g, "万");
      //将【亿万】换成【亿】
      result = result.replace(/亿万/g, "亿");
      //移除末尾的零
      result = result.replace(/零+$/, "");
      //将【零一十】换成【零十】
      //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
      //将【一十】换成【十】
      result = result.replace(/^一十/g, "十");
      return result;
    },
    //去使用，去产品列表
    jumpProductList(shopid, shopCouponsId) {
      console.log(shopid, "店铺id");
      window.localStorage.setItem("ShopId", shopid);

      if (shopid == 0) {
        this.$router.push({ path: "/ProductList" });
      } else {
        this.$router.push({
          path: "/GoodsDetails/StoreProdList",
          query: { couId: shopCouponsId },
        });
      }
    },
    GetUserId(name) {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI(name).replace(/[\.\+\*]/g, "\\$&") +
              "(?:\\=([^&]*))?)?.*$",
            "i"
          ),
          "$1"
        )
      );
    },
  },
  mounted() {
    if (this.GetUserId("index") == 2) {
      this.selected(1);
    } else {
      this.GetUserCouponsList();
    }

    document.title = this.titledata;
  },
};
</script>

<style lang="less" scoped>
.Coupons {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .Couponskong {
    background: @text-white;
    .kong {
      width: 100%;
      .kong_box {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding-top: 200px;
        img {
          width: 265px;
          height: 250px;
        }
        .p1 {
          font-size: 32px;
          font-weight: 500;
          text-align: center;
          color: @text-colorB;
          margin-top: 70px;
        }
        .p2 {
          font-size: 28px;
          text-align: center;
          color: @text-colorC;
          margin-top: 22px;
        }
      }
    }
  }
  .CouponsList_bttop {
    width: 100%;
    height: 70px;
    background: @text-white;
    display: flex;
    position: fixed;
    top: 0;
    z-index: 99;
    span {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #aeb4c2;
      border-bottom: 1px solid @text-white;
    }
    .active {
      color: @text-colorA;
      pointer-events: none;
      border-bottom: 1px solid @main-color;
    }
  }
  .Coupons_box {
    padding: 90px 20px 20px;
    // margin-top: 70px;
    .Coupons_item {
      width: 100%;
      display: flex;
      height: 240px;
      background: url("../../../assets/images/zheng.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: 24px;
      box-shadow: 0px 0px 16px 0px rgba(0, 10, 38, 0.06);
      .left {
        flex: 2.6;
        padding: 20px 0 0 20px;
        .d1 {
          display: flex;
          align-items: center;
          img {
            width: 34px;
            height: 34px;
            border-radius: 50%;
          }
          span {
            font-size: 24px;
            color: @text-colorB;
            padding-left: 16px;
          }
        }
        .d2 {
          font-weight: bold;
          color: @auxiliary-color;
          padding-top: 32px;
          display: flex;
          align-items: baseline;
          span:nth-child(1) {
            font-size: 24px;
          }
          span:nth-child(2) {
            font-size: 52px;
          }
        }
        .d3 {
          padding-top: 16px;
          span {
            font-size: 22px;
            color: @text-colorA;
            line-height: 30px;
            opacity: 0.5;
            i {
              font-style: normal;
            }
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .s1 {
          font-size: 28px;
          color: @text-colorB;
          text-align: center;
        }
        .s2 {
          font-size: 28px;
          color: @auxiliary-color;
          padding-top: 8px;
          text-decoration: underline;
        }
      }
    }
    .Coupons_item2 {
      width: 100%;
      display: flex;
      height: 240px;
      background: url("../../../assets/images/hui.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: 24px;
      .left {
        flex: 2.6;
        padding: 20px 0 0 20px;
        .d1 {
          display: flex;
          align-items: center;
          img {
            width: 34px;
          }
          span {
            font-size: 24px;
            color: @text-colorD;
            padding-left: 16px;
          }
        }
        .d2 {
          font-weight: bold;
          color: @text-colorD;
          padding-top: 32px;
          display: flex;
          align-items: baseline;
          span:nth-child(1) {
            font-size: 24px;
          }
          span:nth-child(2) {
            font-size: 52px;
          }
        }
        .d3 {
          padding-top: 20px;
          span {
            font-size: 22px;
            color: @text-colorD;
            line-height: 30px;
            opacity: 0.5;
            i {
              font-style: normal;
            }
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .s1 {
          font-size: 24px;
          color: @text-colorD;
          text-align: center;
        }
        .s3 {
          font-size: 24px;
          color: @text-colorD;
          padding-top: 8px;
        }
      }
    }
  }
  .envelope_box {
    padding: 90px 20px 20px;
    .envelope_item {
      //  width: 100%;
      //  height: 240px;
      margin-bottom: 24px;
      height: 120px;
      padding: 30px 30px;
      background: @text-white;
      border-radius: 16px;
      box-shadow: 0px 0px 16px 0px rgba(4, 11, 37, 0.06);
      display: flex;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        .d1 {
          img {
            width: 100px;
          }
        }
        .d2 {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-left: 20px;
          .p1 {
            color: @main-color;
            .s1 {
              font-size: 52px;
            }
            .s2 {
              font-size: 24px;
            }
          }
          .p2 {
            font-size: 22px;
            color: @text-colorA;
            padding-top: 12px;
            opacity: 0.5;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border-left: 1px solid rgba(244, 38, 54, 0.3);
        span {
          color: @main-color;
          font-size: 28px;
          text-decoration: underline;
          padding-left: 30px;
        }
      }
    }
    .envelope_item:last-child {
      margin-bottom: 0;
    }
    .envelope_item2 {
      margin-bottom: 24px;
      height: 120px;
      padding: 30px 30px;
      background: @text-white;
      border-radius: 16px;
      box-shadow: 0px 0px 16px 0px rgba(4, 11, 37, 0.06);
      display: flex;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        .d1 {
          img {
            width: 100px;
          }
        }
        .d2 {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-left: 20px;
          .p1 {
            color: rgba(177, 182, 195, 1);
            .s1 {
              font-size: 52px;
            }
            .s2 {
              font-size: 24px;
            }
          }
          .p2 {
            font-size: 22px;
            color: rgba(177, 182, 195, 1);
            padding-top: 12px;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border-left: 1px solid rgba(177, 182, 195, 0.5);
        .s1 {
          color: rgba(177, 182, 195, 1);
          font-size: 28px;
          text-decoration: underline;
          padding-left: 30px;
        }
        .s2 {
          color: rgba(177, 182, 195, 1);
          font-size: 28px;
          padding-left: 30px;
          text-decoration: initial;
        }
      }
    }
  }
}
</style>