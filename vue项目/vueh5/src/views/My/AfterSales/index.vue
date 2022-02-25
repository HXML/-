<template>
  <div style="width:100%;height:100%;">
    <div :class="ReturnListData.length==0?'AfterSaleskong contentBox':'AfterSales contentBox'">
      <div class="kong" v-if="ReturnListData.length==0">
        <div class="kong_box">
          <img src="@/assets/images/kong/kong_icon7@2x.png" alt />
          <p class="p1">报告，这里售后订单数为0</p>
          <p class="p2">您购买的所有售后订单都在这里集合</p>
        </div>
      </div>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        v-else
      >
        <div class="order_content">
          <div class="order-store-item" v-for="(item,index) in ReturnListData" :key="index">
            <div class="storename">
              <p>
                <img src="@/assets/images/mine_Order_icon6@2x.png" alt />
                <span>{{item.shopName}}</span>
              </p>
              <span>{{item.refundTypeStr}}</span>
            </div>
            <div class="good">
              <ul>
                <li @click="jumpGoodsDetails(item.goodsId)">
                  <div class="good_left">
                    <img :src="item.goodsImg+'?x-oss-process=style/b1'" alt />
                  </div>
                  <div class="good_right">
                    <div class="d1">
                      <p>{{item.goodsName}}</p>
                      <p>
                        <span
                          v-for="(itemB,indexThree) in item.orderOtherData"
                          :key="indexThree"
                        >{{itemB.Key}}：{{itemB.Value}} ;</span>
                      </p>
                    </div>
                    <div class="d2">
                      <span>￥{{item.price}}</span>
                      <span>x{{item.qty}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="goodprice">
              <span>
                共{{item.qty}}件，实付
                <i>￥{{item.returnPrice}}</i>
              </span>
            </div>
            <div class="orderstate">
              <span>{{item.returnStatusStr}}</span>

              <button
                class="b1"
                v-if="item.refundType==1"
                @click="jumpReturnAndRefund(item.returnNo)"
              >查看详情</button>

              <button class="b1" v-else @click="jumpRefundOf(item.returnNo)">查看详情</button>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
// 下拉处理
import { List } from "vant";

import { GetReturnOrderListAsyncAPI } from "@/api/MyApi";

import loading from "@/components/loading";
export default {
  name: "AfterSales",
  data() {
    return {
      ReturnListData: [],
      loading: false, //待付款的list
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
    GetReturnList() {
      let data = {
        // returnStatus: "",
        // keyword: "",
        pIdx: this.PIdx++,
        pSize: 10
      };

      GetReturnOrderListAsyncAPI(data, "get")
        .then(res => {
          this.total = res.data.total;
          console.log(res, "获取退货列表");
          let arr = res.data.rows.map(item => {
            return {
              id: item.id,
              returnNo: item.returnNo,
              goodsId:item.goodsId,
              shopName: item.shopName,
              orderNo: item.orderNo,
              returnPrice: item.returnPrice,
              goodsName: item.goodsName,
              price: item.price,
              totalPrice: item.totalPrice,
              qty: item.qty,
              goodsImg: item.goodsImg,
              orderOtherData: item.orderOtherData
                ? JSON.parse(item.orderOtherData)
                : "",
              returnStatusStr: item.returnStatusStr,
              refundTypeStr: item.refundTypeStr,
              refundType:item.refundType
            };
          });
          this.ReturnListData.push(...arr);
          this.loadingshow = false;
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          if (this.ReturnListData.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetReturnList();
    },
    activated() {
      const scrollTop = this.$route.meta.scrollTop;
      const $content = document.querySelector(".contentBox");

      console.log(scrollTop, $content, "$content$content$content");
      if (scrollTop && $content) {
        $content.scrollTop = scrollTop;
      }
    },
    // 跳转去订单详情
    jumpGoodsDetails(id) {
      console.log(id);
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    //跳转去退款退货详情页面
    jumpReturnAndRefund(returnNo) {
      this.$router.push({
        path: "/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund/ReturnAndRefund",
        query: { orderNo: returnNo }
      });
    },
    //跳转去仅退款详情页面
    jumpRefundOf(returnNo) {
      this.$router.push({
        path: "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/RefundOf",
        query: { orderNo: returnNo }
      });
    }
  },
  mounted() {
    document.title = '退款/售后';
    this.GetReturnList();
    this.activated();
  },
   activated() {
      document.title = '退款/售后';
  },
  deactivated() {
    document.title = '退款/售后';
  },
};
</script>

<style lang="less" scoped>
.AfterSales {
  width: 100%;
  background: @base-color;
  height: 100%;
  overflow-y: auto;
  .order_content {
    margin: 0 20px;
    .order-store-item {
      margin-bottom: 24px;
      background: @text-white;
      width: 100%;
      box-shadow: @other-shadow;
      border-radius: 16px;
      .storename {
        padding: 24px 0;
        width: 100%;
        display: flex;
        align-items: center;
        p {
          flex: 1;
          display: flex;
          align-items: center;
          padding-left: 24px;
          img {
            width: 32px;
            height: 32px;
          }
          span {
            font-size: 24px;
            color: @text-colorA;
            padding-left: 14px;
            font-weight: 400;
          }
        }
        span {
          padding-right: 24px;
          font-size: 28px;
          font-weight: 500;
          color: @auxiliary-color;
        }
      }
      .good {
        padding: 0 24px;
        ul {
          width: 100%;
          li {
            margin-bottom: 24px;
            width: 100%;
            display: flex;
            .good_left {
              width: 169px;
              height: 169px;
              border-radius: 16px;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .good_right {
              padding-left: 24px;
              flex: 1;
              display: flex;
              align-items: flex-start;
              .d1 {
                flex: 3;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                p:nth-child(1) {
                  font-size: 24px;
                  color: @text-colorA;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  margin-top: 12px;
                  line-height: 32px;
                  word-break: break-all;
                }
                p:nth-child(2) {
                  font-size: 20px;
                  color: @text-colorC;
                  background: @base-color;
                  padding: 8px 12px;
                  border-radius: 16px;
                  margin-top: 12px;
                  line-height: 26px;
                }
              }
              .d2 {
                flex: 1.6;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                span:nth-child(1) {
                  font-size: 28px;
                  color: @text-colorA;
                  margin-top: 12px;
                }
                span:nth-child(2) {
                  font-size: 28px;
                  padding-top: 12px;
                  color: @text-colorC;
                }
              }
            }
          }
        }
      }
      .goodprice {
        font-size: 24px;
        color: @text-colorA;
        padding: 0 24px 20px;
        display: flex;
        justify-content: flex-end;
        i {
          font-style: normal;
          color: @main-color;
        }
      }
      .orderstate {
        display: flex;
        // justify-content: flex-end;
        padding: 4px 24px 24px;
        align-items: center;
        span {
          font-size: 24px;
          flex: 1;
          color: @main-color;
        }
        button {
          border-radius: 28px;
          padding: 12px 20px;
          background: none;
          //   margin-right: 24px;
          font-size: 24px;
        }
        .b1 {
          color: @text-colorB;
          border: 1px solid @text-colorB;
        }
        .b2 {
          color: @main-color;
          border: 1px solid @main-color;
        }
        .b3 {
          color: @text-white;
          background: @main-color;
          border: 1px solid @main-color;
        }
      }
    }
    .order-store-item:nth-child(1) {
      margin-top: 24px;
    }
  }
}
.AfterSaleskong {
  background: @text-white;
  width: 100%;
  height: 100%;
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