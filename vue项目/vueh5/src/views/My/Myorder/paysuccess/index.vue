<template>
  <div style="width:100%;height:100%;">
    <div class="paysuccess">
      <div class="title">
        <div class="top">
          <img src="@/assets/images/zk1.1/1.1_img_icon4@2x.png" alt />
          <span class="s1">支付成功</span>
          <span class="s2">实付：￥{{totalAmount}}</span>
        </div>
        <div class="bottom">
          <button class="b1" @click="jumphome()">回到首页</button>
          <button class="b2" @click="jumpMyorder()">查看订单</button>
        </div>
      </div>
      <div class="content">
        <div class="top" v-if="storeCoupons!=''">
          <div class="d1">
            <span class="s1">
              {{storeCoupons.faceValue}}
              <i>元</i>
            </span>
            <span class="s2">
              <i v-show="storeCoupons.couponsType==2">无门槛优惠券</i>
              <i v-show="storeCoupons.couponsType==1">满{{storeCoupons.quotaLimit}}可用</i>
            </span>
            <span class="s3">有效期至{{storeCoupons.useEndDate}}</span>
          </div>
          <div class="d2">
            <span @click="CollectCoupons(storeCoupons.id)">{{storeCoupons.receive}}</span>
          </div>
        </div>
        <recommend></recommend>
      </div>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>


<script>
import recommend from "@/components/recommend";
import { GetShopCouponsModelAPI, CollectCouponsAPI } from "@/api/coupons";
import { OrderIsPay } from "@/api/pay";
import loading from "@/components/loading";
import qs from "qs";
export default {
  data() {
    return {
      storeCoupons: {
        //优惠券
      },
      shopId: 0,
      totalAmount: 0,
      orderNo: "",
      loadingshow: true,
    };
  },
  components: {
    recommend: recommend,
    loading: loading,
  },
  methods: {
    jumphome() {
      this.$router.replace({
        path: "/",
      });
    },
    jumpMyorder() {
      //  this.$router.replace({path: "/My/Myorder/OrderDetails",query: { IDs: this.orderid }})
      this.$router.replace({ path: "/My/Myorder", query: { orderstatus: 2 } });
    },
    // 获取店铺的一个优惠券
    GetShopCouponsOne() {
      var objAfter = JSON.parse(window.localStorage.getItem("payinformation"));

      this.shopId = objAfter.shopId;
      this.totalAmount = objAfter.totalAmount;
      this.orderNo = objAfter.orderNo;

      let data = qs.stringify({
        ShopID: this.shopId,
      });

      //   let data = qs.stringify({
      //     ShopID: 113,
      //   });

      GetShopCouponsModelAPI(data, "post").then((res) => {
        console.log(res, "获取店铺的一个优惠券");
        if (res.data) {
          this.storeCoupons = {
            receive: "立即领取",
            ...res.data,
          };
          if (this.storeCoupons.isGet == 1) {
            this.storeCoupons.receive = "已领取";
          } else {
            this.storeCoupons.receive = "立即领取";
          }
        } else {
          this.storeCoupons = "";
        }
        this.loadingshow = false;
        console.log(this.storeCoupons, "this.storeCoupons");
      });
    },
    //领取优惠券
    CollectCoupons(id) {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        let data = qs.stringify({
          CouponsId: id,
        });
        CollectCouponsAPI(data, "post")
          .then((res) => {
            console.log(res, "领取优惠券");
          })
          .then((res) => {
            this.storeCoupons.receive = "已领取";
          });
      } else {
        this.$router.push({
          path: "/My/Login/LoginRegistered",
        });
      }
    },
    OrderIsPaydata() {
      var objAfter = JSON.parse(window.localStorage.getItem("payinformation"));
      this.orderNo = objAfter.orderNo;
      let data = {
        orderNo: this.orderNo,
      };
      OrderIsPay(data, "get").then((res) => {
        // console.log(res,"是否支付成功");
        if (res.data) {
          console.log("支付成功");
          // this.loadingshow = false;
          this.GetShopCouponsOne();
        } else {
          console.log("支付失败");
          this.$router.replace({
            path: "/My/Myorder",
            query: { orderstatus: 1 },
          });
        }
      });
    },
  },
  mounted() {
    document.title = "支付状态";
    

    if (window.localStorage.getItem("isWeiXin") == "true") {
      this.GetShopCouponsOne();
    } else {
      console.log("不在微信环境");
      let self=this
      setTimeout(() => {
         self.OrderIsPaydata();
       }, 1000);
    }
  },
};
</script>

<style lang="less" scoped>
.paysuccess {
  width: 100%;
  min-height: 100%;
  background: @base-color;
  height: auto;
  .title {
    height: 348px;
    background: linear-gradient(#f83600 0%, #ff8949 100%);
    color: @text-white;
    .top {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 0;
      img {
        width: 66px;
      }
      .s1 {
        padding: 12px 0;
      }
      .s2 {
        opacity: 0.7;
      }
    }
    .bottom {
      width: 60%;
      margin: auto;
      display: flex;
      justify-content: space-between;
      opacity: 0.9;
      button {
        border: 1px solid @text-white;
        outline: none;
        width: 180px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 30px;
      }
    }
  }
  .content {
    width: 100%;
    margin-top: -28px;
    .top {
      width: 90%;
      margin: auto;
      height: 138px;
      background: @text-white;
      border-radius: 16px;
      box-shadow: 0px 0px 16px 0px rgba(4, 11, 37, 0.06);
      display: flex;
      align-items: center;
      .d1 {
        display: flex;
        flex-direction: column;
        padding-left: 28px;
        flex: 1;
        .s1 {
          background-image: linear-gradient(#f83600 0%, #ff8949 100%);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 32px;
          i {
            font-style: normal;
            font-size: 24px;
          }
        }
        .s2 {
          color: rgba(125, 130, 143, 1);
          font-size: 28px;
          padding: 4px 0;
          i {
            font-style: normal;
          }
        }
        .s3 {
          color: rgba(125, 130, 143, 1);
          font-size: 28px;
        }
      }
      .d2 {
        padding-right: 28px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 44px;
          background: linear-gradient(#f83600 0%, #ff8949 100%);
          border-radius: 22px;
          color: @text-white;
          font-size: 28px;
        }
      }
    }
  }
}
</style>