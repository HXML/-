<template>
  <div :class="wlshow ? 'OrderDetailstow OrderDetails' : 'OrderDetails'">
    <div class="OrderDetails_title">
      <div class="OrderDetails_title_box">
        <div class="OrderDetails_title_left">
          <p class="p1">{{ itemtitletext }}</p>
          <p class="p2" v-if="orderstatus == 1">
            支付倒计时：
            <van-count-down :time="time" />
          </p>
          <p class="p3" v-if="orderstatus != 1 && orderstatus != 80">
            {{ OrderDetails[0] && OrderDetails[0].payTime }}
          </p>
        </div>
        <div class="OrderDetails_title_right">
          <img :src="itemtitleimg" alt />
        </div>
      </div>
    </div>

    <div class="OrderDetails_content">
      <!-- 自营 -->

      <div
        class="OrderDetails_proprietary"
        v-if="OrderDetailsTow.orderType == 2"
      >
        <div class="top">
          <p>{{ OrderDetailsTow.consignee }}</p>
          <span></span>
          <p>{{ OrderDetailsTow.consigneeMobile }}</p>
        </div>

        <div class="bottom">
          <el-amap vid="amap" :plugin="plugin" :center="center" :zoom="zoom">
            <el-amap-marker vid="marker" :position="center" :label="label">
            </el-amap-marker>
          </el-amap>
          <div class="dw">
            <div class="item">
              <div class="left">
                <div class="leftdiv1">
                  <div class="d1">
                    <img
                      :src="
                        pickup.imgList &&
                        pickup.imgList[0] + '?x-oss-process=style/n4'
                      "
                      alt=""
                    />
                  </div>
                  <div class="d2">
                    <img
                      :src="i + '?x-oss-process=style/n4'"
                      alt=""
                      v-for="(i, indexi) in pickup.imgList"
                      :key="indexi"
                    />
                  </div>
                </div>
                <div class="leftdiv2">
                  <div class="d1">{{ pickup.ppName }}</div>
                  <div class="d2">
                    <p class="p1">
                      <img
                        src="@/assets/images/1.6_img/ziying_mendian_icon2.png"
                        alt=""
                      />
                      <span>{{ pickup.linkTel }}</span>
                    </p>
                    <p class="p2">
                      <img
                        src="@/assets/images/1.6_img/ziying_mendian_icon3.png"
                        alt=""
                      />
                      <span>{{ pickup.ppAddress }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <!-- <div class="right">
                <span>1.3km</span>
              </div> -->
            </div>
            <div class="dw_foot">
              <p>
                <span
                  >商品如有任何质量问题，请直接与门店联系，门店将为您处理</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 拼团 -->
      <div
        class="OrderDetails_group"
        v-if="OrderDetailsThree && orderstatus != 1"
      >
        <div class="top">
          <!-- 条件1：拼团人数是否满员 2：拼团倒计时是否结束  3：是否取消拼团 -->
          <div
            class="d1"
            v-if="
              OrderDetailsThree.limitPeopleNum != OrderDetailsThree.peopleNum &&
              !istimeEnd &&
              orderstatus != 80
            "
          >
            <span class="s1"
              >还差<i
                >{{
                  OrderDetailsThree.limitPeopleNum -
                  OrderDetailsThree.peopleNum
                }}人</i
              >成团</span
            >
            <span class="s2"
              >剩余<van-count-down :time="grouptime" @finish="finish"
            /></span>
          </div>

          <div
            class="d1"
            v-if="
              OrderDetailsThree.limitPeopleNum == OrderDetailsThree.peopleNum &&
              !istimeEnd &&
              orderstatus != 80
            "
          >
            <span class="s1">拼团成功</span>
          </div>

          <div class="d1" v-if="istimeEnd && orderstatus != 80">
            <span class="s1">拼团失败</span>
          </div>

          <div class="d1" v-if="orderstatus == 80">
            <span class="s1">拼团失败</span>
          </div>

          <div
            class="d2"
            v-if="
              OrderDetailsThree.limitPeopleNum != OrderDetailsThree.peopleNum &&
              !istimeEnd &&
              orderstatus != 80
            "
          >
            <span @click="jumpGroupDetails()">邀请好友</span>
          </div>
        </div>
        <div class="bottom">
          <div class="d2">
            <div
              :class="item.imgUrl ? 'item' : 'item2 item'"
              v-for="(item, index) in OrderDetailsTowuserlist"
              :key="index"
            >
              <img
                :src="item.imgUrl + '?x-oss-process=style/n3'"
                v-if="item.imgUrl"
                alt
              />
              <img src="@/assets/images/1.5_img/wu@2x.png" v-else alt />
              <span v-if="item.isMain == 1">团长</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 地址 -->
      <div
        class="OrderDetails_content_add"
        v-if="OrderDetailsTow.orderType != 2"
      >
        <img src="@/assets/images/home/b2c_shop_icon@2x.png" alt />
        <div>
          <p class="p1">
            <span>{{ OrderDetails[0] && OrderDetails[0].consignee }}</span>
            <span>{{
              OrderDetails[0] && OrderDetails[0].consigneeMobile
            }}</span>
          </p>
          <p class="p2">
            {{ OrderDetails[0] && OrderDetails[0].consigneeAddress }}
          </p>
        </div>
      </div>

      <!--  订单 -->
      <div class="order-store-item">
        <div class="storename">
          <p>
            <img src="@/assets/images/mine_Order_icon6@2x.png" alt />
            <span>{{ OrderDetails[0] && OrderDetails[0].shopName }}</span>
          </p>
        </div>
        <div class="good">
          <ul>
            <li
              v-for="(item, index) in OrderDetails[0] &&
              OrderDetails[0].itemList"
              :key="index"
            >
              <div class="good_left" @click="jumpGoodsDetails(item.goodsId)">
                <img :src="item.imageUrl + '?x-oss-process=style/n4'" alt />
              </div>
              <div class="good_right">
                <div class="d1" @click="jumpGoodsDetails(item.goodsId)">
                  <p>{{ item.goodsName }}</p>
                  <p>
                    <span
                      v-for="(itemB, indexThree) in item.orderOtherData"
                      :key="indexThree"
                      >{{ itemB.Key }}：{{ itemB.Value }} ;</span
                    >
                  </p>
                </div>
                <div class="d2">
                  <p class="p1">
                    <span>￥{{ item.price }}</span>
                    <span>x{{ item.qty }}</span>
                  </p>
                  <p
                    class="p2"
                    v-if="
                      orderstatus == 2 ||
                      orderstatus == 3 ||
                      orderstatus == 21 ||
                      orderstatus == 22 ||
                      orderstatus == 81 ||
                      orderstatus == 82 ||
                      orderstatus == 23
                    "
                  >
                    <!-- <span
                      class="tkz"
                      v-show="
                        item.returnStatus == 1 ||
                        item.returnStatus == 2 ||
                        item.returnStatus == 3
                      "
                      @click="jumpRefundOf(item.refundType, item.refundNo)"
                      >退款中</span
                    > -->
                    <span
                      class="tkz"
                      v-show="
                        refundz(
                          item.returnStatus,
                          isPickOrder,
                          OrderDetailsTow.shopPickupPointId
                        )
                      "
                      @click="jumpRefundOf(item.refundType, item.refundNo)"
                      >退款中</span
                    >

                    <!-- {{
                      refundz(
                        item.returnStatus,
                        isPickOrder,
                        OrderDetailsTow.shopPickupPointId
                      )
                    }} -->
                    <!-- {{item.returnStatus}}{{isPickOrder}}{{OrderDetailsTow.shopPickupPointId}} -->

                    <span
                      class="tkz"
                      v-show="item.returnStatus == 5"
                      @click="jumpRefundOf(item.refundType, item.refundNo)"
                      >退款完成</span
                    >

                    <!-- <span
                      class="s1"
                      @click="jumpApplyRefund(item.id)"
                      v-show="(item.isReturnType == 1&&isPickOrder==0&&OrderDetailsTow.shopPickupPointId==0)||(item.isReturnType == 1&&isPickOrder==1&&OrderDetailsTow.shopPickupPointId>0)"
                      >退款</span
                    > -->
                    <span
                      class="s1"
                      @click="jumpApplyRefund(item.id)"
                      v-show="
                        refund(
                          item.isReturnType,
                          isPickOrder,
                          OrderDetailsTow.shopPickupPointId
                        )
                      "
                      >退款</span
                    >
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="OrderDetails_content_information">
          <div class="d1">
            <span>商品总价</span>
            <span>￥{{ OrderDetailsTow.orderPrice | toFixedTow }}</span>
          </div>
          <div class="d1">
            <span>运费（快递费）</span>
            <span>￥{{ OrderDetailsTow.shippingCost | toFixedTow }}</span>
          </div>
          <div class="d1 preferential">
            <span>店铺优惠</span>
            <span>-￥{{ OrderDetailsTow.shopFavouredPrice | toFixedTow }}</span>
          </div>
          <div class="d1 preferential1">
            <span>商城优惠</span>
            <span>-￥{{ OrderDetailsTow.favouredPrice | toFixedTow }}</span>
          </div>
          <div class="d3" v-if="OrderDetailsTow.actPrice != 0">
            <span>活动优惠</span>
            <span>-￥{{ OrderDetailsTow.actPrice | toFixedTow }}</span>
          </div>
          <div class="d2">
            <span>实付款</span>
            <span>￥{{ OrderDetailsTow.totalPrice | toFixedTow }}</span>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order_information">
        <div class="order_information_top">
          <span>订单信息</span>
        </div>
        <div class="order_information_bottom">
          <p
            v-show="
              orderstatus == 1 ||
              orderstatus == 2 ||
              orderstatus == 3 ||
              orderstatus == 5 ||
              orderstatus == 21 ||
              orderstatus == 22 ||
              orderstatus == 23 ||
              orderstatus == 82 ||
              orderstatus == 81 ||
              orderstatus == 80
            "
          >
            当前状态：{{ OrderDetails[0] && OrderDetails[0].oStatusStr }}
            <span v-show="orderstatus == 1">24小时内未支付将自动取消订单</span>
          </p>
          <p
            v-show="
              orderstatus == 1 ||
              orderstatus == 2 ||
              orderstatus == 3 ||
              orderstatus == 5 ||
              orderstatus == 21 ||
              orderstatus == 22 ||
              orderstatus == 23 ||
              orderstatus == 82 ||
              orderstatus == 81 ||
              orderstatus == 80
            "
          >
            订单编号：{{ OrderDetails[0] && OrderDetails[0].orderNo }}
          </p>
          <p
            v-show="
              orderstatus == 2 ||
              orderstatus == 3 ||
              orderstatus == 5 ||
              orderstatus == 21 ||
              orderstatus == 22 ||
              orderstatus == 23 ||
              orderstatus == 82 ||
              orderstatus == 81
            "
          >
            支付单号：{{ OrderDetails[0] && OrderDetails[0].payNo }}
          </p>
          <p
            v-show="
              orderstatus == 1 ||
              orderstatus == 2 ||
              orderstatus == 3 ||
              orderstatus == 5 ||
              orderstatus == 21 ||
              orderstatus == 22 ||
              orderstatus == 23 ||
              orderstatus == 82 ||
              orderstatus == 81 ||
              orderstatus == 80
            "
          >
            创建时间：{{ OrderDetails[0] && OrderDetails[0].creatorDate }}
          </p>
          <p
            v-show="
              orderstatus == 2 ||
              orderstatus == 3 ||
              orderstatus == 5 ||
              orderstatus == 21 ||
              orderstatus == 22 ||
              orderstatus == 23 ||
              orderstatus == 82 ||
              orderstatus == 81
            "
          >
            付款时间：{{ OrderDetails[0] && OrderDetails[0].payTime }}
          </p>
          <p
            v-show="
              orderstatus == 3 ||
              orderstatus == 5 ||
              orderstatus == 22 ||
              orderstatus == 23 ||
              orderstatus == 82 ||
              orderstatus == 81
            "
          >
            发货时间：{{ OrderDetails[0] && OrderDetails[0].shipmentTime }}
          </p>
          <p v-show="orderstatus == 80">
            取消时间：{{ OrderDetails[0] && OrderDetails[0].cancelTime }}
          </p>
        </div>
      </div>
    </div>

    <recommend></recommend>

    <div
      @click="jumpurl()"
      class="Wxwithout"
      style="width: 100%; overflow: hidden; display: none"
    ></div>

    <div
      class="OrderDetails_foot"
      v-show="
        orderstatus == 1 || orderstatus == 2 || orderstatus == 3 || isReview
      "
    >
      <!-- <button class="b1" v-show="orderstatus==2" @click="FullRefund()">全部退款</button> -->

      <button
        class="b1"
        v-show="orderstatus == 1 && OrderDetailsTow.isMyOrder == 1"
        @click="CancelOrder()"
      >
        取消订单
      </button>
      <button
        class="b3"
        v-show="orderstatus == 1 && OrderDetailsTow.isMyOrder == 1"
        @click="
          Alipayshow
            ? tctype(OrderDetails[0].totalPrice, OrderDetails[0].orderNo)
            : debounceBtn(OrderDetails[0].orderNo)
        "
      >
        立即支付
      </button>
      <button
        class="b2"
        v-show="orderstatus == 2 && OrderDetailsTow.isMyOrder == 1"
        @click="RemindDelivery()"
      >
        提醒发货
      </button>
      <button
        class="b2"
        v-show="orderstatus == 3&& OrderDetailsTow.isMyOrder == 1"
        @click="Confirmgoods(OrderDetails[0].ID)"
      >
        确认收货
      </button>
       <button
        class="b2"
        v-show="orderstatus == 3&& OrderDetailsTow.isMyOrder == 0"
        @click="Confirmgoods(OrderDetails[0].ID)"
      >
        确认提货
      </button>
      <button
        class="b3"
        v-show="orderstatus == 3 && OrderDetailsTow.isMyOrder == 1"
        @click="ShowExpress()"
      >
        查看物流
      </button>
      <button
        class="b2"
        v-show="orderstatus == 5 && isReview && OrderDetailsTow.isMyOrder == 1"
        @click="jumpToEvaluate()"
      >
        去评价
      </button>
    </div>

    <van-popup v-model="zfshow" round position="bottom">
      <div class="type_shadow">
        <div class="type_shadow_top">
          <span>选择支付方式</span>
          <img src="@/assets/images/home/gbdelete.png" @click="gbtype()" alt />
        </div>
        <div class="type_shadow_bottom">
          <div class="type_shadow_content">
            <div class="d1">
              <p class="p1">
                <span class="s1">{{ PaytotalPrice }}</span>
                <span class="s2">元</span>
              </p>
              <p class="p2">您需支付</p>
            </div>
            <div class="d2">
              <p class="p1" @click="debounceBtn()" v-show="WeChatshow">
                <img src="@/assets/images/zk1.1/zhifu_icon1@2x.png" alt />
                <span>微信支付</span>
              </p>

              <p class="p2" v-show="Alipayshow" @click="debounceBtnTow">
                <img src="@/assets/images/zk1.1/zhifu_icon2@2x.png" alt />
                <span>支付宝支付</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <div v-html="alhtml" ref="alipayWap"></div>

    <div class="wlbox" v-show="wlshow" id="boxyy" @click="boxyy">
      <div class="wldiv">
        <div class="top">
          <div class="d1">
            <img
              :src="
                OrderDetails[0] &&
                OrderDetails[0].itemList[0].imageUrl + '?x-oss-process=style/n4'
              "
              alt
            />
          </div>
          <div class="d2">
            <div class="p1">
              <p class="s1">
                {{ OrderDetails[0] && OrderDetails[0].itemList[0].goodsName }}
              </p>
              <p class="s2">
                共{{ OrderDetails[0] && OrderDetails[0].itemList[0].qty }}件
              </p>
            </div>
            <div class="p2">
              <span class="s1">{{ logisticsData.expName }}</span>
              <span class="s2">{{ logisticsData.number }}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom_box">
            <van-steps
              direction="vertical"
              :active="1"
              inactive-icon="circle"
              active-icon="circle"
            >
              <div class="li">
                <p class="p1">
                  <span class="s1"></span>
                  <span class="s2"></span>
                </p>
                <van-step>
                  <h3>
                    <p class="h3_p1">
                      {{ OrderDetails[0] && OrderDetails[0].consignee }}
                      {{ OrderDetails[0] && OrderDetails[0].consigneeMobile }}
                    </p>
                    <p class="h3_p2">
                      {{ OrderDetails[0] && OrderDetails[0].consigneeAddress }}
                    </p>
                  </h3>
                </van-step>
              </div>
              <div
                class="li"
                v-for="(item, index) in logisticsData.list"
                :key="index"
              >
                <p class="p1">
                  <span class="s1">{{ item.itemtime }}</span>
                  <span class="s2">{{ item.itemtimeday }}</span>
                </p>
                <van-step>
                  <h3>{{ item.status }}</h3>
                </van-step>
              </div>
            </van-steps>
          </div>
        </div>
      </div>
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>
<script>
import Vue from "vue";
import { CountDown } from "vant";
import { Toast } from "vant";
import { GetBusOrderDetailListAsyncAPI } from "@/api/MyApi";
import loading from "@/components/loading";
import recommend from "@/components/recommend";

import {
  PayShopCancelOrderAsynccAPI,
  RemindOrderAsyncAPI,
  ReturnShopOrderAsyncAPI,
} from "@/api/MyApi";

import { FinishShopOrderAsyncAPI, GetWuliuMsgAPI } from "@/api/order";

import { getWxPayDataAPI } from "@/api/pay";

import { Dialog } from "vant";
// 全局注册
Vue.use(Dialog);
import qs from "qs";

import { etWx_PayData, callpayTow, AlipayData } from "@/common/js/payment.js";

import { debounce, throttle } from "@/common/js/debounceAndThrottle.js";

// Popup 动作面板
import { Popup } from "vant";

import { Step, Steps } from "vant";

export default {
  name: "OrderDetails",
  data() {
    const self = this;
    return {
      isPickOrder: "", //是否是门店订单
      alhtml: "",
      Alipayshow: true, //支付宝按钮隐藏显示
      WeChatshow: true, //微信支付按钮隐藏显示
      PayorderNo: "",
      PaytotalPrice: 0,
      zfshow: false,
      time: "",
      itemtitletext: "",
      Expurl: "",
      itemtitleimg: "", //顶部的标识图片
      orderstatus: 0,
      OrderDetails: [],
      OrderDetailsTow: {},
      pickup: {},
      OrderDetailsThree: {},
      OrderDetailsTowuserlist: [],
      isReview: "",
      wxlink: "",
      wlshow: false,
      active: 1,
      logisticsData: {},
      grouptime: "",
      loadingshow: true,
      istimeEnd: false, //是否时间过期  true过期  false没有过期
      center: [0, 0], //中心点坐标
      lng: 0, //经度
      lat: 0,
      zoom: 16, //放大倍数
      loaded: false,
      label: {
        //中心的描述文字
        content: "",
        offset: [0, 0],
      },
      //其他组件
      plugin: [
        {
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 1000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: false, //显示定位按钮，默认：true
          buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          // zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: "all",
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log(result, "result");
                if (result && result.position) {
                  // self.lng = result.position.lng; //设置经度//这个现在找不到了 因为你把上面的拿出去了 this
                  // self.lat = result.position.lat; //设置维度
                  // self.center = [self.lng, self.lat]; //设置坐标
                  self.loaded = true; //load
                  // self.label = {
                  //   content: result.formattedAddress,
                  //   offset: [20, 15],
                  // };
                  self.$nextTick(); //页面渲染好
                }
              });
            },
          },
        },
      ],
    };
  },
  components: {
    [CountDown.name]: CountDown,
    recommend: recommend,
    [Popup.name]: Popup,
    [Step.name]: Step,
    [Steps.name]: Steps,
    loading: loading,
  },
  computed: {
    // 判断退款按钮是否显示  isPickOrder是否是门店订单(1是门店 0不是)  shopPickupPointId门店id
    refund() {
      return function (isReturnType, isPickOrder, shopPickupPointId) {
        return (
          (isReturnType == 1 && isPickOrder == 0 && shopPickupPointId == 0) ||
          (isReturnType == 1 && isPickOrder == 1 && shopPickupPointId > 0)
        );
      };
    },
    // 判断退款中是否显示
    refundz() {
      return function (returnStatus, isPickOrder, shopPickupPointId) {
        if (returnStatus == 1 || returnStatus == 2 || returnStatus == 3) {
          return (
            (isPickOrder == 0 && shopPickupPointId == 0) ||
            (isPickOrder == 1 && shopPickupPointId > 0)
          );
        }
      };
    },
  },
  methods: {
    // 倒计时结束定点
    finish() {
      this.GetBusOrderDetailListAsync();
    },
    // 选择支付方式
    tctype(totalPrice, orderNo) {
      console.log(totalPrice, orderNo, "totalPrice,orderNo");
      this.PaytotalPrice = totalPrice;
      this.PayorderNo = orderNo;
      this.zfshow = true;
    },
    gbtype() {
      this.zfshow = false;
    },
    // 微信外部支付
    jumpurl() {
      window.location.href = this.wxlink;
      callpayTow(1);
    },
    //标识 图片 按钮
    logo() {
      // console.log(this.OrderDetails[0].orderStatus)
      if (this.orderstatus == 1) {
        this.itemtitletext = "您还未支付，请尽快支付";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon1@2x.png");
      } else if (this.orderstatus == 2 || this.orderstatus == 21) {
        this.itemtitletext = "订单支付成功，等待商家发货";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon2@2x.png");
        if (
          this.OrderDetailsThree &&
          this.OrderDetailsThree.limitPeopleNum !=
            this.OrderDetailsThree.peopleNum &&
          !this.istimeEnd
        ) {
          this.itemtitletext = "待成团，快去邀请好友参团";
        }
      } else if (
        this.orderstatus == 3 ||
        this.orderstatus == 22 ||
        this.orderstatus == 23
      ) {
        this.itemtitletext = "商家已发货，请留意物流信息";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon3@2x.png");
      } else if (this.orderstatus == 5) {
        this.itemtitletext = "已完成，客官欢迎常来呀";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon4@2x.png");
      } else if (this.orderstatus == 82) {
        this.itemtitletext = "部分商品退款";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon4@2x.png");
      } else if (this.orderstatus == 81) {
        this.itemtitletext = "全部商品退款，客官欢迎常来呀";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon4@2x.png");
      } else if (this.orderstatus == 80) {
        this.itemtitletext = "订单已关闭";
        this.itemtitleimg = require("@/assets/images/dingdan/dingdan_icon5@2x.png");
      }
    },
    // 跳转去订单详情
    jumpGoodsDetails(id) {
      console.log(id);
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    //跳转到退款
    jumpApplyRefund(id) {
      console.log(id, "ididididididididididididididididid");
      console.log(this.OrderDetails[0].isShipment, "是否发货");

      if (this.OrderDetails[0].isShipment == 0) {
        this.$router.replace({
          path: "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund",
          query: { ID: id },
        });
      } else {
        this.$router.replace({
          path: "/My/Myorder/OrderDetails/ApplyRefund",
          query: { ID: id },
        });
      }
    },
    // 取消订单
    CancelOrder() {
      Dialog.confirm({
        message: "是否取消订单?",
      })
        .then(() => {
          let data = {
            OrderIDs: this.OrderDetails[0].id,
          };
          PayShopCancelOrderAsynccAPI(data, "post").then((res) => {
            console.log(res, "取消订单");
            if (res.code == 1) {
              Toast("取消订单成功！");
              this.$router.replace({
                path: "/My/Myorder",
                query: { orderstatus: 1 },
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 查看物流
    ShowExpress() {
      let data = {
        no: this.OrderDetails[0].transNo,
        // no: 75374767693697,
      };
      GetWuliuMsgAPI(data, "get").then((res) => {
        console.log(res);
        this.logisticsData = res.result;
        this.wlshow = true;
      });
      // window.location.href =
      //   "https://m.kuaidi100.com/app/query/?coname=indexall&nu=" +
      //   this.OrderDetails[0].transNo;
    },
    boxyy(event) {
      if (event.target.id == "boxyy") {
        this.wlshow = false;
      }
    },
    // 全部退款
    FullRefund() {
      Dialog.confirm({
        title: "是否全部退款?",
      })
        .then(() => {
          let data = qs.stringify({
            OrderNO: this.OrderDetails[0].orderNo,
            OitemIDS: [],
            ID: 0,
            VoucherImgId: [], //退款图片id
            ReturnReason: "", //退款原因
            ReturnRmk: "", //退款说明
            Rmk: "",
            ReturnAccount: "",
            ReturnPrice: 0,
            TransCo: "",
            TransNo: "",
            ReturnType: 1, //1全订单，2货品
            RefundType: this.RefundType, //退款类型（1退款退货，2发货仅退款，3未发货退款）
          });
          // console.log(data, "退款类型（1退款退货，2发货仅退款，3未发货退款）");
          ReturnShopOrderAsyncAPI(data, "post").then((res) => {
            console.log(res, "提交全部退款申请");
            if (res.code == 1) {
              location.reload();
            }
          });
        })
        .catch(() => {});
    },
    // 提醒发货
    RemindDelivery() {
      let data = qs.stringify({
        ID: this.OrderDetails[0].id,
      });
      RemindOrderAsyncAPI(data, "post", 1).then((res) => {
        console.log(res, "提醒发货");
        Toast("已提醒商家发货");
      });
    },
    //确认收货
    Confirmgoods() {
      Dialog.confirm({
        title: "是否确认收货?",
      })
        .then(() => {
          console.log(this.OrderDetails);
          let data = qs.stringify({
            OrderIDs: this.OrderDetails[0].id,
          });
          console.log(data);
          FinishShopOrderAsyncAPI(data, "post")
            .then((res) => {
              console.log(res, "确认收货");
              Toast("收货成功");
              // window.location.reload()
            })
            .then((res) => {
              this.GetOrderDetails();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 跳转去 去评价
    jumpToEvaluate() {
      this.$router.push({
        path: "/My/Myorder/OrderDetails/ToEvaluate",
        query: {
          IDs: this.OrderDetails[0].id,
          OrderNo: this.OrderDetails[0].orderNo,
        },
      });
    },
    //跳转去退款退货详情页面
    jumpReturnAndRefund(returnNo) {
      this.$router.push({
        path:
          "/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund/ReturnAndRefund",
        query: { orderNo: returnNo },
      });
    },
    //跳转去仅退款详情页面
    jumpRefundOf(refundType, refundNo) {
      console.log(refundType, refundNo, "refundType,refundNo");

      if (refundType == 1) {
        this.$router.push({
          path:
            "/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund/ReturnAndRefund",
          query: { orderNo: refundNo },
        });
      } else {
        this.$router.push({
          path: "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/RefundOf",
          query: { orderNo: refundNo },
        });
      }
    },
    //获取订单详情
    GetOrderDetails() {
      let data = {
        IDs: this.$route.query.IDs,
        isPickOrder: this.$route.query.ismd,
      };
      GetBusOrderDetailListAsyncAPI(data, "get").then((res) => {
        console.log(res, "获取订单详情");
        this.OrderDetails = res.data.olist.rows.map((item) => {
          return {
            id: item.id,
            actPrice: item.actPrice,
            orderNo: item.orderNo,
            shopName: item.shopName,
            orderStatus: item.orderStatus,
            consignee: item.consignee,
            consigneeMobile: item.consigneeMobile,
            consigneeAddress: item.consigneeAddress,
            shippingCost: item.shippingCost,
            orderPrice: item.orderPrice,
            favouredPrice: item.favouredPrice,
            shopFavouredPrice: item.shopFavouredPrice,
            totalPrice: item.totalPrice,
            cancelTime: item.cancelTime,
            payTime: item.payTime,
            payType: item.payType,
            payNo: item.payNo,
            orderOtherData: item.orderOtherData,
            creatorDate: item.creatorDate,
            shipmentTime: item.shipmentTime,
            receiptTime: item.receiptTime,
            transNo: item.transNo,
            isReview: item.isReview,
            isShipment: item.isShipment,
            isMyOrder: item.isMyOrder,
            itemList: item.itemList.map((i) => {
              return {
                id: i.id,
                goodsId: i.goodsId,
                goodsName: i.goodsName,
                qty: i.qty,
                price: i.price,
                totalPrice: i.totalPrice,
                favouredPrice: i.favouredPrice,
                orderOtherData: i.orderOtherData
                  ? JSON.parse(i.orderOtherData)
                  : "",
                creatorDate: i.creatorDate,
                returnStatus: i.returnStatus,
                isReturn: i.isReturn,
                imageUrl: i.imageUrl,
                refundType: i.refundType,
                refundNo: i.refundNo,
                isReturnType: i.isReturnType,
              };
            }),
            oStatusStr: item.oStatusStr,
          };
        });

        this.OrderDetailsTow = res.data.olist.rows[0];
        console.log(this.OrderDetailsTow, "this.OrderDetailsTow");

        if (this.OrderDetailsTow.pickup) {
          this.pickup = this.OrderDetailsTow.pickup;

          this.lng = this.pickup.lon; //设置经度//这个现在找不到了 因为你把上面的拿出去了 this
          this.lat = this.pickup.lat; //设置维度
          this.center = [this.pickup.lon, this.pickup.lat]; //设置坐标

          this.label = {
            content: this.pickup.ppName,
            offset: [20, 15],
          };
        }

        this.OrderDetailsThree = this.OrderDetailsTow.itemGroupList; //
        console.log(this.OrderDetailsThree, "this.OrderDetailsThree");

        if (this.OrderDetailsThree) {
          this.OrderDetailsTowuserlist = this.OrderDetailsTow.itemGroupList.userList;
          var objTow = new Date();
          var eTimeTow = new Date(
            this.OrderDetailsThree.timeOverTime.replace(
              new RegExp("-", "gm"),
              "/"
            )
          );
          this.grouptime = eTimeTow - objTow;

          if (
            this.grouptime <= 0 &&
            this.OrderDetailsThree.limitPeopleNum !=
              this.OrderDetailsThree.peopleNum
          ) {
            this.istimeEnd = true;
          }
        }

        console.log(this.OrderDetails[0].orderStatus, "orderStatus");

        this.orderstatus = this.OrderDetails[0].orderStatus;

        var obj = new Date();
        var eTime = new Date(this.OrderDetails[0].creatorDate);
        this.time = 24 * 60 * 60 * 1000 - (obj - eTime);

        console.log(this.time);

        if (this.time == 0) {
          this.$router.push({
            path: "/My/Myorder",
            query: { orderstatus: 1 },
          });
        }

        this.orderstatus = this.OrderDetails[0].orderStatus;
        // this.isReview=res.data.olist.rows[0].isReview
        // console.log(this.isReview,"this.isReview")

        if (
          res.data.olist.rows[0].isReview == 0 &&
          this.OrderDetails[0].orderStatus == 5
        ) {
          this.isReview = true;
        } else {
          this.isReview = false;
        }

        this.logo();

        this.loadingshow = false;
      });
    },
    debounceBtn: throttle(function (orderNo) {
      console.log(this.Alipayshow, "this.Alipayshow");
      if (this.Alipayshow) {
        this.ImmediatelyPay(this.PayorderNo);
      } else {
        console.log(orderNo, "微信环境的订单号");
        this.ImmediatelyPay(orderNo);
      }
    }, 1000),
    debounceBtnTow: throttle(function () {
      this.AlipayBtn(this.PayorderNo);
    }, 1000),
    //立即支付
    ImmediatelyPay(orderNo) {
      console.log(orderNo);
      let link = `${window.location.href.split("#")[0]}`;
      console.log(link, "linklinklinklinklink");
      if (window.localStorage.getItem("isWeiXin") == "true") {
        etWx_PayData(orderNo, 1);
      } else {
        etWx_PayData(orderNo, 2).then((val) => {
          console.log(val, "val val val 当前支付的url");
          this.wxlink = val;
          this.jumpurl();
        });
      }
    },
    // 创建订单 支付宝支付
    AlipayBtn(orderNo) {
      AlipayData(orderNo, 1).then((val) => {
        console.log(val, "支付宝弹出页面");
        this.alhtml = val;
        this.$nextTick(() => {
          this.$refs.alipayWap.children[0].submit();
        });
      });
    },
    // 邀请好友 跳转去拼团详情
    jumpGroupDetails() {
      this.$router.push({
        path: "/GoodsDetails/GroupDetails",
        query: { groupId: this.OrderDetailsThree.actGroupId },
      });
    },
  },
  mounted() {
    document.title = "订单详情";
    this.isPickOrder = this.$route.query.ismd;

        this.GetOrderDetails();
    if (window.localStorage.getItem("isWeiXin") == "true") {
      console.log("是微信环境");
      this.Alipayshow = false;
    } else {
      this.Alipayshow = true;
      console.log("不是微信环境");
    }

    if (window.localStorage.getItem("isAlipay") == "true") {
      console.log("是支付宝环境");
      this.WeChatshow = false;
    } else {
      console.log("是支付宝环境");
      this.WeChatshow = true;
    }

    // this.GetOrderDetails();
  },
};
</script>

<style lang="less" scoped>
.OrderDetails {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  padding-bottom: 116px;
  box-sizing: border-box;
  .OrderDetails_title {
    width: 100%;
    height: 240px;
    background: @button-mainbackground;
    .OrderDetails_title_box {
      height: 184px;
      display: flex;
      align-items: center;
      color: @text-white;
      padding: 0 40px;
      .OrderDetails_title_left {
        flex: 1;
        .p1 {
          font-size: 32px;
        }
        .p2 {
          display: flex;
          font-size: 24px;
          padding-top: 12px;
          align-items: baseline;
          /deep/ .van-count-down {
            color: @text-white;
            font-size: 24px;
          }
        }
        .p3 {
          font-size: 24px;
          padding-top: 12px;
          color: @text-white;
        }
      }
      .OrderDetails_title_right {
        img {
          width: 200px;
          height: 200px;
        }
      }
    }
  }
  .OrderDetails_content {
    margin: -56px 20px 0;
    .OrderDetails_proprietary {
      width: 100%;
      margin-bottom: 16px;
      .top {
        width: 100%;
        height: 110px;
        background: #ffffff;
        box-shadow: 0px 4px 8px 0px rgba(0, 11, 38, 0.06);
        border-radius: 10px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        p {
          width: 50%;
          text-align: center;
        }
        span {
          width: 1px;
          height: 28px;
          background: rgba(177, 182, 196, 0.4);
        }
      }
      .bottom {
        width: 100%;
        height: 654px;
        border-radius: 16px;
        background: #fff;
        position: relative;
        /deep/ .amap-logo {
          display: none !important;
          //去掉高德地图logo
        }
        /deep/ .amap-copyright {
          opacity: 0;
        }
        .dw {
          width: 96%;
          left: 2%;
          position: absolute;
          bottom: 16px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0px 4px 8px 0px rgba(0, 11, 38, 0.06);
          padding: 26px 0;
          .item {
            padding: 0 16px;
            display: flex;

            .left {
              flex: 1;
              display: flex;
              .leftdiv1 {
                display: flex;
                flex-direction: column;
                .d1 {
                  width: 148px;
                  height: 148px;
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                  }
                }
                .d2 {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: 6px;
                  img {
                    width: 44px;
                    height: 44px;
                    border-radius: 4px;
                  }
                }
              }
              .leftdiv2 {
                padding-left: 18px;
                .d1 {
                  font-size: 32px;
                  color: @text-colorA;
                  margin-top: 12px;
                }
                .d2 {
                  display: flex;
                  flex-direction: column;
                  margin-top: 20px;
                  p {
                    display: flex;
                    img {
                      width: 24px;
                      height: 24px;
                      padding-top: 4px;
                    }
                    span {
                      padding-left: 6px;
                      font-size: 26px;
                      color: @text-colorC;
                      line-height: 36px;
                    }
                  }
                  .p2 {
                    padding-top: 8px;
                  }
                }
              }
            }
            .right {
              margin-top: 12px;
              color: @main-color;
              font-size: 28px;
            }
          }
          .dw_foot {
            padding: 0 16px;
            margin-top: 16px;

            p {
              height: 48px;
              background: rgba(255, 138, 73, 0.2);
              border-radius: 8px;
              display: flex;
              align-items: center;
              span {
                font-size: 22px;
                color: #ff8a49;
                padding-left: 8px;
              }
            }
          }
        }
      }
    }
    .OrderDetails_group {
      height: 214px;
      background: #fff8f4;
      border-radius: 16px;
      box-shadow: 0px 0px 16px 0px rgba(0, 10, 38, 0.06);
      margin-bottom: 18px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        .d1 {
          display: flex;

          .s1 {
            font-size: 28px;
            color: #000a26;
            i {
              font-style: normal;
              color: rgba(244, 38, 54, 1);
            }
          }
          .s2 {
            color: #7d828f;
            font-size: 28px;
            padding-left: 26px;
            display: flex;
            align-items: center;
            .van-count-down {
              color: #7d828f;
              font-size: 28px;
            }
          }
        }
        .d2 {
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 130px;
            height: 46px;
            border: 1px solid #e73a3a;
            border-radius: 23px;
            color: rgba(244, 38, 54, 1);
            font-size: 28px;
          }
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        .d2 {
          display: flex;
          justify-content: space-between;
          .item {
            border: 1px dashed @main-color;
            border-radius: 50%;
            width: 88px;
            height: 88px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 88px;
              height: 88px;
              border-radius: 50%;
            }
          }
          .item:nth-child(1) {
            position: relative;
            span {
              position: absolute;
              padding: 2px;
              background: @main-color;
              border-radius: 4px;
              opacity: 0.8;
              font-size: 18px;
              color: #f5f6f7;
              top: 0;
              right: -9px;
            }
          }
          .item:nth-child(2) {
            margin: 0 44px;
          }
          .item2 {
            border: 1px dashed rgba(177, 182, 195, 0.6);
          }
        }
      }
    }
    .OrderDetails_content_add {
      padding: 0 48px 0 24px;
      background: @text-white;
      height: 166px;
      box-shadow: @auxiliary-shadow;
      border-radius: 16px;
      display: flex;
      align-items: center;
      img {
        width: 68px;
        height: 68px;
      }
      div {
        flex: 1;
        padding-left: 30px;
        .p1 {
          display: flex;
          align-items: baseline;
          span:nth-child(1) {
            font-size: 32px;
            color: @text-colorA;
          }
          span:nth-child(2) {
            font-size: 24px;
            color: @text-colorC;
            padding-left: 12px;
          }
        }
        .p2 {
          font-size: 24px;
          padding-top: 24px;
          color: @text-colorA;
          line-height: 32px;
        }
      }
    }
    .order-store-item {
      margin-top: 16px;
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
        }
      }
      .good {
        padding: 0 24px;
        ul {
          width: 100%;
          padding-bottom: 24px;
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
                height: 100%;
                justify-content: space-between;
                align-items: flex-start;
                // align-items: end;
                p:nth-child(1) {
                  font-size: 24px;
                  color: @text-colorA;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  margin-top: 24px;
                  line-height: 28px;
                  word-break: break-all;
                }
                p:nth-child(2) {
                  font-size: 20px;
                  color: @text-colorC;
                  background: @base-color;
                  padding: 8px 12px;
                  border-radius: 16px;
                  // margin-top: 12px;
                  margin-bottom: 12px;
                  line-height: 26px;
                }
              }
              .d2 {
                flex: 1.6;
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: space-between;
                .p1 {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  span:nth-child(1) {
                    font-size: 28px;
                    color: @text-colorA;
                    margin-top: 24px;
                  }
                  span:nth-child(2) {
                    font-size: 28px;
                    padding-top: 12px;
                    color: @text-colorC;
                  }
                }
                .p2 {
                  display: flex;
                  justify-content: flex-end;
                  margin-bottom: 12px;
                  .s1 {
                    // padding: 6px 16px;
                    border: 1px solid @text-colorC;
                    // border-radius: 15px;
                    color: @text-colorC;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 70px;
                    height: 30px;
                    border-radius: 20px;
                  }
                  .tkz {
                    border: none;
                    color: @main-color;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }
              }
            }
          }
        }
      }
      .OrderDetails_content_information {
        margin: 0 24px;
        .d1 {
          font-size: 24px;
          color: @text-colorC;
          padding-bottom: 20px;
          display: flex;
          align-items: center;
          span:nth-child(1) {
            flex: 1;
          }
        }
        .preferential {
          border-bottom: 1px solid @base-color;
        }
        .preferential1 {
          padding: 20px 0 0 0;
        }
        .d2 {
          font-size: 24px;
          color: @text-colorA;
          padding: 20px 0 28px;
          display: flex;
          align-items: center;
          span:nth-child(1) {
            flex: 1;
          }
        }
        .d3 {
          font-size: 24px;
          color: @text-colorA;
          padding: 20px 0 0;
          display: flex;
          align-items: center;
          span:nth-child(1) {
            flex: 1;
          }
        }
      }
    }
    .order_information {
      box-shadow: @other-shadow;
      border-radius: 16px;
      background: @text-white;
      margin-top: 16px;
      min-height: 200px;
      padding: 0 20px 20px;
      .order_information_top {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        span {
          font-size: 28px;
          color: @text-colorA;
        }
      }
      .order_information_bottom {
        font-size: 24px;
        p {
          font-size: 24px;
          color: @text-colorB;
          padding-bottom: 20px;
          span {
            padding-left: 8px;
            color: @main-color;
          }
        }
      }
    }
  }
  .OrderDetails_foot {
    width: 100%;
    height: 100px;
    background: @text-white;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      border-radius: 28px;
      padding: 12px 20px;
      background: none;
      margin-right: 24px;
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
  /deep/ .van-overlay {
    background: @backgroundBopcityW;
  }
  /deep/ .van-popup {
    height: 85%;
    border-radius: 40px 40px 0px 0px;
  }
  .type_shadow {
    width: 100%;
    height: 100%;
    .type_shadow_top {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      span {
        font-size: 32px;
        color: @text-colorA;
        flex: 1;
        padding-left: 40px;
      }
      img {
        width: 24px;
        height: 24px;
        padding-right: 40px;
      }
    }
    .type_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      padding-bottom: 100px;
      .type_shadow_content {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        .d1 {
          margin: 80px auto;
          text-align: center;
          .p1 {
            display: flex;
            align-items: baseline;
            .s1 {
              font-size: 88px;
              font-weight: 700;
              color: @text-colorB;
            }
            .s2 {
              font-size: 32px;
              color: @text-colorB;
            }
          }
          .p2 {
            font-size: 32px;
            color: @text-colorB;
            padding-top: 40px;
          }
        }
        .d2 {
          .p1 {
            display: flex;
            align-items: center;
            width: 90%;
            height: 136px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(182, 195, 177, 0.5);
            border-radius: 16px;
            box-shadow: 0px 4px 3px 0px #ebeef6;
            margin: auto;
            justify-content: center;
            margin: 24px auto 0;
            img {
              width: 69px;
            }
            span {
              font-size: 32px;
              font-weight: 700;
              color: @text-colorB;
              padding-left: 36px;
            }
          }
          .p2 {
            display: flex;
            align-items: center;
            width: 90%;
            height: 136px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(182, 195, 177, 0.5);
            border-radius: 16px;
            box-shadow: 0px 4px 3px 0px #ebeef6;
            margin: auto;
            justify-content: center;
            margin-top: 24px;
            img {
              width: 69px;
            }
            span {
              font-size: 32px;
              font-weight: 700;
              color: @text-colorB;
              padding-left: 36px;
            }
          }
        }
      }
    }
  }
  /deep/ .van-popup--center {
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
  }
  .van-steps__items {
    padding-left: 4vw;
  }

  .wlbox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .wldiv {
      width: 660px;
      height: 984px;
      background: #ffffff;
      border-radius: 16px;
      position: relative;
      .top {
        height: 140px;
        width: 604px;
        background: #ffeee5;
        border-radius: 16px 16px 0px 0px;
        display: flex;
        align-items: center;
        padding: 0 28px;
        color: #7d7977;
        font-size: 26px;
        position: absolute;
        top: 0;
        z-index: 99;
        .d1 {
          img {
            width: 100px;
            height: 100px;
            background: #ffcc65;
            border-radius: 8px;
          }
        }
        .d2 {
          padding-left: 18px;
          flex: 1;
          .p1 {
            display: flex;
            align-items: center;
            .s1 {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 340px;
            }
            .s2 {
              color: #f39868;
              padding-left: 12px;
            }
          }
          .p2 {
            margin-top: 15px;
            .s2 {
              padding-left: 16px;
            }
          }
        }
      }
      .bottom {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        .bottom_box {
          width: 100%;
          height: 914px;
          overflow-y: auto;
          box-sizing: border-box;
          padding: 140px 20px 0;
          /deep/ .van-steps--vertical {
            padding: 0;
            .van-step--vertical {
              line-height: 36px !important;
              padding: 6px 20px 30px;
              min-height: 60px;
              font-size: 24px;
              .van-step__line {
                width: 1px !important;
                border-left: 1px dashed #ccc;
                background: #fff;
              }
            }
            .li {
              .van-icon-circle::before {
                background: #fff;
                color: #ccc;
              }
              display: flex;
              .p1 {
                font-size: 22px;
                color: #b1b6c3;
                display: flex;
                flex-direction: column;
                padding: 10px 8vw 0 0;
                min-width: 9vw;
                align-items: center;
                .s2 {
                  padding-top: 12px;
                }
              }
              .van-step__title {
                color: rgba(74, 80, 96, 0.8);
                h3 {
                  font-weight: normal;
                }
                .h3_p2 {
                  padding-top: 6px;
                }
              }
              .van-step__title--active h3 {
                color: #000a26;
                font-weight: bold !important;
              }
            }
            .li:nth-child(1) {
              .van-step__circle-container {
                background: red;
                width: 40px;
                height: 40px;
                background: url("../../../../assets/images/dizhi@2x.png");
                background-size: 100% 100%;
                .van-icon {
                  display: none;
                }
              }
              .van-step__title {
                color: rgba(177, 182, 195, 1);
              }
            }
            .li:last-child {
              .van-step__line {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
.OrderDetailstow {
  height: 100% !important;
  overflow: hidden;
}
</style>