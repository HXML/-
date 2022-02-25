<template>
  <div class="Porder">
    <div class="title">
      <div class="top">
        <input
          type="text"
          placeholder="请输入收货人信息搜索订单"
          v-model="selectxx"
        />
        <span @click="sskeyword()">搜索</span>
      </div>
      <div class="bottom">
        <ul>
          <li
            v-for="(item, index) in TopList"
            :key="index"
            @click="clickLeftList(index)"
            :class="{ active: activeName == index }"
          >
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="content_box">
          <div class="item" v-for="(item, index) in orderList" :key="index">
            <div class="storename">
              <p>
                <span class="s1">下单时间：{{ item.creatorDate }}</span>
                <span class="s2">{{ item.oStatusStr }}</span>
              </p>
              <p>
                <span class="s1"
                  >收货人： {{ item.consignee }}
                  {{ item.consigneeMobile }}</span
                >
              </p>
            </div>
            <div class="good" @click="jumpOrderDetails(item.id)">
              <ul>
                <li v-for="(itemA, indexTow) in item.itemList" :key="indexTow">
                  <div class="good_left">
                    <img
                      :src="itemA.imageUrl + '?x-oss-process=style/n4'"
                      alt
                    />
                  </div>
                  <div class="good_right">
                    <div class="d1">
                      <p>
                        {{ itemA.goodsName }}
                      </p>
                      <p>{{ getSkuString(itemA.orderOtherData) }}</p>
                    </div>
                    <div class="d2">
                      <span>￥{{ itemA.price }}</span>
                      <span>x{{ itemA.qty }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="goodprice">
              <span>
                共1件，实付
                <i>￥{{ item.totalPrice }}</i>
              </span>
            </div>
            <div class="orderstate">
              <!-- <button
                class="b1"
                v-show="item.orderStatus == 1"
                @click="CancelOrder(item.id, index)"
              >
                取消订单
              </button> -->
              <button
                class="b2"
                v-show="text(item, 2)"
                @click="RemindDelivery(item.id)"
              >
                提醒发货
              </button>
              <!-- <button
                class="b3"
                v-show="item.orderStatus == 1"
                @click="tctype(item.totalPrice, item.orderNo)"
              >
                立即支付
              </button> -->
              <button
                class="b2"
                v-show="text(item, 4)"
                @click="Confirmgoods(item.id, index)"
              >
                确认收货
              </button>
              <!-- <button class="b3" v-show="item.orderStatus == 3">
                查看物流
              </button> -->
              <button
                class="b2"
                v-show="text(item, 6)"
                @click="jumpToEvaluate(item.id, item.orderNo)"
              >
                去评价
              </button>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
// 下拉处理
import { List } from "vant";
import { GetBusOrderpageListAsyncAPI } from "@/api/MyApi";
import qs from "qs";

import { _setToken, _getToken } from "@/common/js/storage";

import { Toast } from "vant";

import {
  RemindOrderAsyncAPI,
} from "@/api/MyApi";
import { FinishShopOrderAsyncAPI } from "@/api/order";

export default {
  name: "Porder",
  data() {
    return {
      selectxx: "", //搜索的关键字
      activeName: 0, //左边列表定义的高亮值
      TopList: ["近三个月订单", "全部订单"],
      selectedObj: {
        orderstatus: 6,
        keyword: "",
        pickupId: this.$route.query.id,
        pIdx: 0,
        pSize: 4,
        isrefund: 1,
      },
      loading: false,
      finished: false,
      total: 0, //商品列表商品的总数量
      orderList: [],
    };
  },
  components: {
    [List.name]: List,
  },
  computed: {
    text() {
      //ismdorder 是否是门店订单
      return function (item, type) {
        if (type == 2) {
          //提醒发货
          return item.orderStatus == 2 && item.isMyOrder == 1;
        }
        if (type == 4) {
          //确认收货
          return item.orderStatus == 3 && item.isMyOrder == 1;
        }
        if (type == 6) {
          //去评价
          return (
            item.isReview == 0 && item.orderStatus == 5 && item.isMyOrder == 1
          );
        }
      };
    },
  },
  methods: {
    // 搜索
    sskeyword() {
      this.selectedObj.pIdx = 0;
      this.selectedObj.keyword = this.selectxx;
      this.orderList = [];
      this.OrderList();
    },
    // 跳转去订单详情
    jumpOrderDetails(id) {
        this.$router.push({
          path: "/My/Myorder/OrderDetails",
          query: { IDs: id, ismd: 1 },
      });
    },
    // 提醒发货
    RemindDelivery(id) {

      if (_getToken("remind" + id)) {
        Toast("已提醒商家发货");
      } else {
        _setToken("remind" + id, id);
        let data = qs.stringify({
          ID: id,
        });
        RemindOrderAsyncAPI(data, "post", 1).then((res) => {
          console.log(res, "提醒发货");
          Toast("已提醒商家发货");
        });
      }
    },
    //确认收货
    Confirmgoods(id, index) {
      Dialog.confirm({
        title: "是否确认收货?",
      })
        .then(() => {
          let data = qs.stringify({
            OrderIDs: id,
          });
          console.log(data);
          FinishShopOrderAsyncAPI(data, "post")
            .then((res) => {
              console.log(res, "确认收货");
              Toast("收货成功");
            })
            .then((res) => {
              this.orderList.splice(index, 1);
            });
        })
        .catch(() => {});
    },
    // 跳转去 去评价
    jumpToEvaluate(id, orderNo) {
      this.$router.replace({
        path: "/My/Myorder/OrderDetails/ToEvaluate",
        query: { IDs: id, OrderNo: orderNo },
      });
    },
    clickLeftList(index) {
      this.activeName = index;

      this.loading = true;
      this.finished = false;
      if (index == 0) {
        this.selectedObj.orderstatus = 6;
      } else {
        this.selectedObj.orderstatus = 0;
      }
      this.selectedObj.pIdx = 0;

      this.orderList = [];
      window.scrollTo(0, 1000);
      this.OrderList();
    },
    OrderList() {
      this.selectedObj.pIdx++;
      GetBusOrderpageListAsyncAPI(this.selectedObj, "get")
        .then((res) => {
          this.total = res.data.olist.total;
          this.orderList.push(...res.data.olist.rows);
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          console.log(this.orderList.length, this.total);
          if (this.orderList.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      this.OrderList();
    },
    getSkuString(e) {
      if (e) {
        // console.log(e);
        let skuObjList = JSON.parse(e);
        let string = "";
        skuObjList.forEach((item) => {
          string += item.Key + "：" + item.Value;
        });
        return string;
      }
    },
  },
  mounted() {
   document.title = '售后处理';
    this.OrderList();
  },
};
</script>
<style lang="less">
.Porder {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #f5f6f7;
  .title {
    width: 100%;
    position: fixed;
    background: #f5f6f7;
    z-index: 99;
    top: 0;
    .top {
      padding: 0 24px;
      display: flex;
      align-items: center;
       background: #f5f6f7;
      input {
        background: #fff;
        border-radius: 8px;
        height: 60px;
        border: 1px solid #ccc;
        font-size: 28px;
        margin: 16px 0 0;
        text-indent: 16px;
        flex: 1;
      }
      span {
        font-size: 28px;
        padding-left: 24px;
        margin: 16px 0 0;
      }
    }
    .bottom {
       background: #f5f6f7;
      padding: 0 24px;
      ul {
        width: 100%;
        display: flex;
        align-items: center;
        height: 100px;
        li {
          flex: 1;
          font-size: 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
              pointer-events:unset;
        }
        .active {
          color: @main-color;
              pointer-events: none;
        }
      }
    }
  }
  .content {
    width: 100%;
    height: 100%;
    padding-top: 176px;
    overflow-y: auto;
    .content_box {
      padding: 0 24px;
      .item {
        padding: 28px;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0px 4px 8px 0px rgba(0, 11, 38, 0.06);
        margin-bottom: 20px;
        .storename {
          display: flex;
          flex-direction: column;
          padding-bottom: 18px;
          p {
            display: flex;
            align-items: center;
            padding-bottom: 24px;
            .s1 {
              flex: 1;
              color: #4a5060;
              font-size: 24px;
            }
            .s2 {
              font-size: 28px;
              color: #f42737;
            }
          }
        }
        .good {
          ul {
            width: 100%;
            li {
              margin-bottom: 24px;
              width: 100%;
              display: flex;
              //   align-items: center;
              .good_left {
                width: 169px;
                height: 169px;
                border-radius: 16px;
                overflow: hidden;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
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
                  // align-items: end;
                  p:nth-child(1) {
                    font-size: 24px;
                    color: @text-colorA;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-top: 12px;
                    line-height: 28px;
                  }
                  p:nth-child(2) {
                    font-size: 20px;
                    color: @text-colorC;
                    background: @base-color;
                    padding: 8px 12px;
                    border-radius: 16px;
                    margin-top: 12px;
                    line-height: 26px;
                    width: fit-content;
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
          padding: 20px 0 20px;
          display: flex;
          justify-content: flex-end;
          i {
            font-style: normal;
            color: @main-color;
          }
        }
        .orderstate {
          display: flex;
          justify-content: flex-end;
          padding: 0px 0 4px;
          button {
            border-radius: 28px;
            padding: 12px 20px;
            background: none;
            margin-right: 24px;
            font-size: 24px;
          }
          button:last-child {
            margin-right: 0;
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
    }
  }
}
</style>