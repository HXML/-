<template>
  <div style="width:100%;height:100%;">
  <div :class="CouponsList.length==0?'ReceiveCouponkong':'ReceiveCoupon'">
    <div class="kong" v-if="CouponsList.length==0">
      <div class="kong_box">
        <img src="@/assets/images/kong/kong_icon6@2x.png" alt />
        <p class="p1">没有可领取的优惠券</p>
        <p class="p2">商城内所有的优惠券都可以在这里领取到</p>
      </div>
    </div>

    <div class="Coupons_box" v-else>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="Coupons_item" v-for="(item,index) in CouponsList" :key="index">
          <div class="left">
            <div class="d1">
              <img src="@/assets/images/logo.png" alt />
              <span>兆客易购平台</span>
              <!-- <img :src="item.shopLogoImg+'?x-oss-process=style/n4'" alt /> -->
              <!-- <span>{{item.shopName}}</span> -->
            </div>
            <div class="d2">
              <span>¥</span>
              <span>{{item.faceValue}}</span>
            </div>
            <div class="d3">
              <span>
                <i v-show="item.couponsType==2">无门槛优惠券</i>
                <i v-show="item.couponsType==1">满{{item.quotaLimit}}可用</i>
              </span>
            </div>
          </div>
          <div class="right">
            <span @click="CollectCoupons(item.id,index)">{{item.receive}}</span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
   <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>


<script>
import { ShowCouponsListAPI, CollectCouponsAPI } from "@/api/coupons";
// 下拉处理
import { List } from "vant";
import qs from "qs";
import loading from "@/components/loading";
export default {
  name: "Coupons",
  data() {
    return {
      titledata: "领取优惠券", //控制title的动态变量
      CouponsList: [],
      loading: false,
      finished: false,
      PIdx: 1, //商品页面的初始化的index
      total: 0, //商品的总数量
      loadingshow: true
    };
  },
  components: {
    [List.name]: List,
    loading: loading
  },
  methods: {
    // 获取优惠券列表
    GetShopCouponslist() {
      let data = {
        shopID: 0,
        pIdx: this.PIdx++,
        pSize: 6
      };

      ShowCouponsListAPI(data, "get")
        .then(res => {
          console.log(res, "获取商城的所有优惠券");
          this.total = res.result.total;
          this.CouponsList.push(
            ...res.result.rows.map(item => {
              return Object.assign({}, item, { receive: "立即领取" });
            })
          );

          this.CouponsList.forEach(item => {
            if (item.isGet == 1) {
              item.receive = "已领取";
            } else {
              item.receive = "立即领取";
            }
          });

          console.log(this.CouponsList, "this.CouponsList");
          this.loadingshow = false;

        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          if (this.CouponsList.length === this.total) {
            this.finished = true;
          }
        });


    },
    //领取优惠券
    CollectCoupons(id, index) {
      let data = qs.stringify({
        CouponsId: id
      });
      CollectCouponsAPI(data, "post")
        .then(res => {
          console.log(res, "领取优惠券");
        })
        .then(res => {
          this.CouponsList[index].receive = "已领取";
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetShopCouponslist();
    }
  },
  mounted() {
    document.title = this.titledata;
    this.GetShopCouponslist();
  }
};
</script>

<style lang="less" scoped>
.ReceiveCoupon {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .Coupons_box {
    padding: 20px 20px 0;
    /deep/ .van-list__finished-text {
      font-size: 26px;
      line-height: 100px;
      text-align: center;
    }
    /deep/ .van-list__loading {
      font-size: 26px;
      line-height: 100px;
      text-align: center;
    }
    .Coupons_item {
      width: 100%;
      display: flex;
      height: 220px;
      background: url("../../../assets/images/zheng.png") no-repeat;
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
          padding-top: 40px;
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
        span:nth-child(1) {
          font-size: 28px;
          color: @text-colorB;
        }
        span:nth-child(2) {
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
      height: 220px;
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
          padding-top: 40px;
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
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        span:nth-child(1) {
          font-size: 24px;
          color: @text-colorD;
        }
        span:nth-child(2) {
          font-size: 24px;
          color: @text-colorD;
          padding-top: 8px;
        }
      }
    }
  }
}
.ReceiveCouponkong{
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
</style>