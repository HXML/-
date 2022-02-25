<template>
  <div class="ApplyRefund">
    <div class="ApplyRefund_title">
      <div class="ApplyRefund_title_item">
        <img :src="ShopDetails.imageUrl+'?x-oss-process=style/b1'" alt class="showimg" />
        <div class="showtext">
          <p>{{ShopDetails.goodsName}}</p>
          <p>
            <span
              v-for="(item,indexThree) in ShopDetails.ShopDetailskey"
              :key="indexThree"
            >{{item.Key}}: {{item.Value}} ;</span>
          </p>
        </div>
      </div>
    </div>

    <div class="ApplyRefund_content">
      <!-- 仅退款 -->
      <div class="d1" @click="jumpOnlyRefund(ShopDetails.id)">
        <img src="@/assets/images/dingdan/tk@2x.png" alt />
        <div>
          <p>仅退款</p>
          <p>未收到(包含未签收)，或商家协商同意前期下</p>
        </div>
      </div>

      <!-- 退货退款 -->
      <div class="d1" @click="jumpReturnRefund(ShopDetails.id)">
        <img src="@/assets/images/dingdan/th@2x.png" alt />
        <div>
          <p>退货退款</p>
          <p>已收到货，需要退还已收到的货物</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetReturnShopOrderListAsyncAPI } from "@/api/MyApi";

export default {
  name: "ApplyRefund",
  data() {
    return {
      titledata: "申请退款", //控制title的动态变量
      ShopDetails: {
        ShopDetailskey: []
      },
      orderstatus: 0
    };
  },
  components: {},
  methods: {
    //跳转到仅退款
    jumpOnlyRefund(id) {
      this.$router.replace({
        path: "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund",
        query: { ID: id, orderstatus: this.orderstatus }
      });
    },
    //跳转到退货退款
    jumpReturnRefund(id) {
      this.$router.replace({
        path: "/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund",
        query: { ID: id }
      });
    },
    //获取商品信息
    GetShopDetails() {
      let data = {
        OitemIDS: this.$route.query.ID
      };
      GetReturnShopOrderListAsyncAPI(data, "get").then(res => {
        this.ShopDetails = res.data;
    
        this.ShopDetails.ShopDetailskey = res.data.orderOtherData
          ? JSON.parse(res.data.orderOtherData)
          : "";

            console.log(this.ShopDetails,"ShopDetailsShopDetailsShopDetails")
      });
    }
  },
  mounted() {
    document.title = this.titledata;
    this.GetShopDetails();
    this.orderstatus = this.$route.query.orderstatus;
  }
};
</script>

<style lang="less" scoped>
.ApplyRefund {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .ApplyRefund_title {
    padding: 0 40px;
    background: @text-white;
    .ApplyRefund_title_item {
      height: 120px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .showimg {
        width: 100px;
        height: 100px;
        border-radius: 8px;
      }
      .showtext {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 16px;
        p:nth-child(1) {
          font-size: 28px;
          font-weight: 400;
          color: @text-colorB;
          line-height: 32px;

          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        p:nth-child(2) {
          font-size: 20px;
          font-weight: 400;
          line-height: 26px;
          color: @text-colorD;
          padding-top: 12px;

width: 500px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
          // word-break: break-all;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 1;
          // -webkit-box-orient: vertical;
        }
      }
    }
  }
  .ApplyRefund_content {
    margin: 36px 20px 0;
    .d1 {
      padding: 0 36px;
      height: 140px;
      background: @text-white;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      box-shadow: @other-shadow;
      border-radius: 16px;
      img {
        width: 60px;
        height: 60px;
      }
      div {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 28px;
        p:nth-child(1) {
          font-size: 32px;
          font-weight: bold;
          color: @text-colorB;
        }
        p:nth-child(2) {
          font-size: 20px;
          font-weight: 400;
          line-height: 26px;
          color: @text-colorD;
          padding-top: 16px;
        }
      }
    }
  }
}
</style>