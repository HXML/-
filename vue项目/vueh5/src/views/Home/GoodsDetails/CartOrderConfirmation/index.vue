<template>
  <div class="OrderConfirmation">
    <div class="OrderConfirmation_box">
      <!-- 选择地址 -->
      <div
        class="title_proprietary"
        v-if="orderData[0] && orderData[0].shopType == '3'"
      >
        <div>
          <input type="text" placeholder="提货人姓名" v-model="Pdata.linkMan" />
        </div>
        <span></span>
        <div>
          <input type="text" placeholder="提货人电话" v-model="Pdata.linkTel" />
        </div>
      </div>

      <div v-else class="title" @click="jumpUsedAddress()">
        <div class="left">
          <div class="d1">
            <img src="@/assets/images/home/b2c_shop_icon@2x.png" alt />
          </div>
          <div class="d2" v-if="Isadd">
            <p>
              {{ defaultAdd.consignee }}
              <span>{{ defaultAdd.consigneeMobile }} </span>
            </p>
            <p>
              {{ defaultAdd.province }}{{ defaultAdd.city
              }}{{ defaultAdd.userArea }}{{ defaultAdd.consigneeAddress }}
            </p>
          </div>
          <div class="d2" v-else>当前没有地址，请您添加地址</div>
        </div>
        <div class="right">
          <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
        </div>
      </div>
      
      <!-- 订单详情 -->
      <div class="order_content">
        <div
          class="order-store-item"
          v-for="(item, index) in orderData"
          :key="index"
        >
          <div class="storename">
            <p>
              <img src="@/assets/images/mine_Order_icon6@2x.png" alt />
              <span>{{ item.shopName }} </span>
              <span class="tips" v-if="orderData[0].isSamePickup != 1">
                (不同门店的商品无法提交)
              </span>
            </p>
          </div>
          <div class="good">
            <ul>
              <li v-for="(itemA, indexTow) in item.sclist" :key="indexTow">
                <div class="good_left">
                  <img :src="itemA.imageUrl + '?x-oss-process=style/b1'" alt />
                </div>
                <div class="good_right">
                  <div class="d1">
                    <p>{{ itemA.goodsName }}</p>
                    <p>
                      <span v-if="itemA.prtyColor != null"
                        >颜色：{{ itemA.prtyColor.colorName }}</span
                      >
                      <span
                        v-for="(itemd, indexd) in itemA.prtylist"
                        :key="indexd"
                        >{{ itemd.propName }}:{{ itemd.optName }}；</span
                      >
                    </p>
                  </div>
                  <div class="d2">
                    <span>￥{{ itemA.price.toFixed(2) }}</span>
                    <span>x{{ itemA.qty }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="other">
            <!-- 配送方式 -->
            <div class="distribution">
              <div class="left">
                <span>配送方式</span>
              </div>
              <div class="right">
                <span class="s1">普通快递</span>
                <span class="s2">快递 ￥{{ item.tmpPrice.toFixed(2) }}</span>
              </div>
            </div>
            <!-- 店铺优惠 -->
            <div class="DiscountStores" @click="tctype(index)">
              <div class="left">
                <span>店铺优惠</span>
              </div>
              <div class="right">
                <span class="s1">{{ item.discountStores }}</span>
                <img
                  src="@/assets/images/home/home_shopping_xiala@2x.png"
                  alt
                />
              </div>
            </div>
            <!-- 开具发票 -->
            <div class="invoice">
              <div class="left">
                <span>开具发票</span>
              </div>
              <div class="right">
                <van-radio-group
                  v-model="item.radio"
                  direction="horizontal"
                  @change="checkshow($event, index)"
                >
                  <van-radio name="1" checked-color="#F42636">个人</van-radio>
                  <van-radio name="2" checked-color="#F42636">企业</van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="invoice1" v-show="item.invoice1">
              <input
                type="text"
                v-model="item.invoiceTitle"
                placeholder="输入发票抬头"
              />
              <input
                type="text"
                v-model="item.coTaxNo"
                placeholder="输入企业税号"
              />
            </div>
            <!-- 买家留言 -->
            <div class="message">
              <div class="left">
                <span>买家留言</span>
              </div>
              <div class="right">
                <input type="text" placeholder="选填，请先与商家协商一致 " />
              </div>
            </div>
            <!-- 计算商品 -->
            <div class="calculate">
              共{{ countAllNum(item.sclist) }}件，小计
              <span
                >￥{{
                  countAllPrice(item.sclist, item.coupons, item.tmpPrice)
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 商城优惠 -->
      <div class="MallPreferential" @click="tcplatformtype()">
        <div class="left">
          <span class="s1">优惠</span>
          <span class="s2">商城优惠</span>
          <span class="s3">{{ Shoptext }}</span>
        </div>
        <div class="right">
          <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
        </div>
      </div>

      <div
        @click="jumpurl()"
        class="Wxwithout"
        style="width: 100%; overflow: hidden; display: none"
      ></div>
    </div>
    <!-- 底部 -->
    <div class="foot">
      <div class="left">
        <span>
          共{{ countnum() }}件，小计
          <i>￥{{ count() }}</i>
        </span>
      </div>
      <div class="right">
        <!-- <button class="b1">支付宝支付</button> -->
        <!-- {{}} -->
        <button
          class="b1"
          v-show="Alipayshow"
          @click="debounceBtnTow(orderData[0].shopType)"
        >
          支付宝支付
        </button>
        <button
          :class="Alipayshow ? 'b2' : 'b3'"
          @click="debounceBtn(orderData[0].shopType)"
          v-show="WeChatshow"
        >
          {{ WeChattext }}
        </button>
      </div>
    </div>

    <!-- 店铺优惠 -->
    <van-popup v-model="type" round position="bottom">
      <div class="type_shadow">
        <div class="type_shadow_top">
          <span>店铺优惠</span>
          <img src="@/assets/images/home/gbdelete.png" @click="gbtype()" alt />
        </div>
        <div class="type_shadow_bottom">
          <div class="type_shadow_content">
            <ul>
              <li
                v-for="(item, index) in typedata"
                :key="index"
                :style="!item.isValid ? 'pointer-events: none;' : ''"
                @click="xztype(index, item.typetext, item.storeName)"
              >
                <div class="left">
                  <p
                    class="p1"
                    :class="{ typeactive: item.activeName == index }"
                  >
                    店铺优惠：
                  </p>
                  <p
                    class="p2"
                    :class="{ typeactive: item.activeName == index }"
                  >
                    {{ item.typetext }}
                  </p>
                </div>
                <div class="right">
                  <van-checkbox
                    :disabled="!item.isValid"
                    v-model="item.typechecked"
                    checked-color="#F42636"
                  ></van-checkbox>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="type_shadow_foot">
          <div class="foot3">
            <button class="b2" @click="confirmCoupon()">确认</button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 商城优惠 -->
    <van-popup v-model="platformtype" round position="bottom">
      <div class="type_shadow">
        <div class="type_shadow_top">
          <span>商城优惠</span>
          <img
            src="@/assets/images/home/gbdelete.png"
            @click="gbplatformtype()"
            alt
          />
        </div>
        <div class="type_shadow_bottom">
          <div class="type_shadow_content">
            <ul>
              <li
                :style="!item.isValid ? 'pointer-events: none;' : ''"
                v-for="(item, index) in couponsplatform.couponslistplatform"
                :key="index"
                @click="xzplatformtype(index)"
              >
                <div class="left">
                  <p
                    class="p1"
                    :class="{ typeactive: item.activeName == index }"
                  >
                    店铺优惠：
                  </p>
                  <p
                    class="p2"
                    :class="{ typeactive: item.activeName == index }"
                  >
                    {{ item.typetext }}
                  </p>
                </div>

                <div class="right">
                  <van-checkbox
                    v-model="item.typechecked"
                    checked-color="#F42636"
                    :disabled="!item.isValid"
                  ></van-checkbox>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="type_shadow_foot">
          <div class="foot3">
            <button class="b2" @click="confirmCoupon1()">确认</button>
          </div>
        </div>
      </div>
    </van-popup>

    <div v-html="alhtml" ref="alipayWap"></div>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup } from "vant";

import { RadioGroup, Radio } from "vant";
import { getWxPayDataAPI } from "@/api/pay";
import {
  GetShopBuyListAPI,
  GetShopCartConfirmListAPI,
  GetDefaultUserAddressAPI,
  CreateShopOrderBYSkuAsyncAPI,
  GetShopCartTmpAPI,
  CreateShopOrderAsyncSsmAPI,
  PayShopOrderAsyncAPI,
} from "@/api/index";
import { Toast } from "vant";
import qs from "qs";

import { getlistAPI } from "@/api/MyApi";

import { debounce, throttle } from "@/common/js/debounceAndThrottle.js";
import { GetUserCartCountAPI } from "@/api/MyApi";
// Popup 动作面板
import { Popup } from "vant";

import { etWx_PayData, callpayTow, AlipayData } from "@/common/js/payment.js";

export default {
  name: "OrderConfirmation",
  data: () => ({
    Pdata: {
      //提货需要的参数
      pickupId: "",
      linkMan: "",
      linkTel: "",
    },
    alhtml: "",
    popIndex: 0,
    Alipayshow: true, //支付宝按钮隐藏显示
    WeChatshow: true,
    WeChattext: "微信支付",
    result: [],
    wx_PayData: "",
    orderData: [],
    Coudata: [],
    ShopCouponsId: 0,
    DiscountStorestext: "", //选中的优惠券
    type: false, //判断优惠券弹出框的显示隐藏
    typedata: [],
    orederIds: [],
    platformtype: false,
    Shoptext: "",
    couponsplatform: {
      activeName: -1,
      couponslistplatform: [
        {
          typename: "商品优惠 : ",
          maxNum: 100,
          faceValue: 10,
        },
        {
          typename: "商品优惠 : ",
          maxNum: 100,
          faceValue: 10,
        },
        {
          typename: "商品优惠 : ",
          maxNum: 100,
          faceValue: 10,
        },
        {
          typename: "商品优惠 : ",
          maxNum: 100,
          faceValue: 10,
        },
      ],
    },
    submitData: {
      id: 0,
      orderNo: "string",
      shopName: "string",
      shopId: 0,
      userId: 0,
      nickName: "string",
      orderStatus: 0,
      consignee: "string",
      consigneeMobile: "string",
      consigneeAddress: "string",
      distributionType: 0,
      shippingCost: 0,
      orderPrice: 0,
      favouredPrice: 0,
      totalPrice: 0,
      cancelType: 0,
      cancelTime: "2020-04-28T07:34:25.216Z",
      payTime: "2020-04-28T07:34:25.216Z",
      couponsId: 0,
      payType: 0,
      payNo: "string",
      userRmk: "string",
      shopRmk: "string",
      pUserCommission: 0,
      commission: 0,
      pUserId: 0,
      orderOtherData: "string",
      transCo: "string",
      transNo: "string",
      isReview: 0,
      creatorDate: "2020-04-28T07:34:25.216Z",
      shipmentTime: "2020-04-28T07:34:25.216Z",
      receiptTime: "2020-04-28T07:34:25.216Z",
      itemList: [
        {
          id: 0,
          orderId: 0,
          shopId: 0,
          userId: 0,
          skuId: 0,
          goodsId: 0,
          categroyId: 0,
          goodsName: "string",
          qty: 0,
          price: 0,
          itemTotalPrice: 0,
          totalPrice: 0,
          imgId: 0,
          couponsId: 0,
          favouredPrice: 0,
          isReturn: 0,
          creatorDate: "2020-04-28T07:34:25.216Z",
          imageUrl: "string",
        },
      ],
      oStatusStr: "string",
      oPayType: "string",
    },
    defaultAdd: {
      // consignee: "", //姓名
      // consigneeMobile: "", //电话
      // consigneeAddress: "", //详细地址
      // province: "",
      // city: "",
      // userArea: ""
    },
    Isadd: true,
    wxlink: "",
    // activeName: -1 //选择店铺优惠切换
  }),
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Popup.name]: Popup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
  },
  methods: {
    // 微信外部支付
    // 获取购物车的数量
    GetUserCartCountData() {
      GetUserCartCountAPI("get").then((res) => {
        this.$store.dispatch("setCartNumber", res.data.slist);
      });
    },
    jumpurl() {
      if (process.env.VUE_APP_URL === "https://t-api.zk-mall.net/") {
        // 如果是测试环境, 则生成控制台
        // var aaa=this.wxlink+'&redirect_url=https://t-shop.zk-mall.net/#/My/Myorder/paysuccess'
        // console.log(aaa,"aaaaaaaaaaaa")
        let reurl = encodeURI(
          "https://t-shop.zk-mall.net/#/My/Myorder/paysuccess"
        );
        window.location.href =
          this.wxlink + "&redirect_url=" + encodeURIComponent(reurl);
      } else {
        let reurl = "https://shop.zk-mall.net/#/My/Myorder/paysuccess";
        window.location.href =
          this.wxlink + "&redirect_url=" + encodeURIComponent(reurl);
      }
    },
    jumpUsedAddress() {
      // let oln = "/GoodsDetails/CartOrderConfirmation";
      // let objquery = {
      //   ids: this.$route.query.ids
      // };
      // window.localStorage.setItem("fromqueryadd", JSON.stringify(objquery));
      // window.localStorage.setItem("frompathadd", oln);
      // this.$router.push({ path: "/My/UsedAddress" });
      this.getAddressList();
    },
    getAddressList() {
      //获取用户所有地址
      let data = {
        pInd: 1,
        pSize: 8,
        keyWord: "",
      };
      getlistAPI(data, "get").then((res) => {
        console.log(res.data.rows.length, "获取用户所有地址");

        if (res.data.rows.length == 0) {
          this.$router.push({
            path: "/My/UsedAddress/AddAddress",
          });
        } else {
          let oln = "/GoodsDetails/CartOrderConfirmation";
          let objquery = {
            ids: this.$route.query.ids,
          };
          window.localStorage.setItem("fromqueryadd", JSON.stringify(objquery));
          window.localStorage.setItem("frompathadd", oln);
          this.$router.push({ path: "/My/UsedAddress" });
        }
      });
    },
    // 选择店铺优惠
    tctype(index) {
      this.popIndex = index;
      // console.log(this.orderData[index], "this.orderData[index]");
      this.typedata = this.orderData[index].coupons.couponsList.map((item) => {
        return Object.assign({}, item, { storeName: index });
      });
      this.count();
      this.type = true;
    },
    gbtype() {
      this.type = false;
    },
    // 选择商城优惠
    tcplatformtype() {
      this.platformtype = true;
    },
    gbplatformtype() {
      this.ShopCouponsId = 0;
      this.Shoptext = "";
      this.count();
      this.platformtype = false;
    },
    // 选择优惠类型 index是优惠券数量的index istext是优惠券内容 storeName是代表哪个列表的优惠券
    xztype(index, istext, storeName) {
      //index 优惠券弹框的列表，istext优惠券弹框的内容，storeName 整个商铺的列表index

      this.typedata.forEach((item, index) => {
        this.typedata[index].typechecked = false;

        this.typedata[index].activeName = -1;
      });

      this.typedata[index].activeName = index;

      this.typedata[index].typechecked = true;

      this.orderData[this.popIndex].coupons.couponsList = this.typedata;
      // console.log(this.typedata, "this.typedata[index]");
    },
    xzplatformtype(index) {
      //index 优惠券弹框的列表，istext优惠券弹框的内容，storeName 整个商铺的列表index couponsplatform couponslistplatform

      this.couponsplatform.couponslistplatform.forEach((item, index) => {
        this.couponsplatform.couponslistplatform[index].typechecked = false;
        this.couponsplatform.activeName = -1;
      });
      this.index2 = index;
      this.couponsplatform.activeName = index;
      this.couponsplatform.couponslistplatform[index].typechecked = true;
    },
    // 点击优惠券里面的确认
    confirmCoupon1() {
      this.ShopCouponsId = 0;
      this.Shoptext = "";
      this.count();
      this.platformtype = false;
    },
    // 点击优惠券里面的确认
    confirmCoupon() {
      this.count();
      let item = this.typedata.filter((item) => {
        if (!item.isValid) {
          return;
        }
        return item.typechecked === true;
      });
      if (item.length > 0) {
        this.orderData[this.popIndex].discountStores = item[0].typetext;
        this.type = false;
      } else {
        this.orderData[this.popIndex].discountStores = "";
        this.type = false;
      }
      // console.log(this.typedata[this.popIndex], "888888888");
    },
    // 点击个人 企业的事件
    checkshow(event, index) {
      console.log(event);
      if (event == 1) {
        this.orderData[index].invoice1 = false;
      } else {
        this.orderData[index].invoice1 = true;
      }
    },
    //计算个别店铺的总价价格
    countAllPrice(sclist, coupons, tmpPrice) {
      // console.log(sclist,"sclistsclistsclistsclistsclistsclistsclistsclistsclistsclist")

      if (sclist[0].isFreeShipping) {
        tmpPrice = 0;
      }

      var couprice = 0;
      coupons.couponsList.forEach((cou) => {
        if (cou.typechecked) {
          couprice = cou.faceValue;
        }
      });

      let storeAll = 0;

      // sclist.forEach((item) => {

      //   storeAll += item.price * item.qty;
      // });
      for (var i = 0; i < sclist.length; i++) {
        if (sclist[i].actPrice) {
          storeAll += sclist[i].actPrice * sclist[i].qty;
        } else {
          storeAll += sclist[i].price * sclist[i].qty;
        }
      }

      return (storeAll - couprice + tmpPrice).toFixed(2);
    },
    //计算个别店铺的总价价格的数量
    countAllNum(sclist) {
      let storeAllTow = 0;
      sclist.forEach((item) => {
        return (storeAllTow += item.qty);
      });
      return storeAllTow;
    },
    //计算所有店铺的总价价格
    count() {
      let totalPrice = 0; //临时总价

      this.orderData.forEach((store) => {
        // store.sclist.forEach((item) => {
        //   totalPrice += item.price * item.qty;
        // });
        // console.log(store.sclist,"store.scliststore.scliststore.scliststore.sclist")
        if (store.sclist[0].isFreeShipping) {
          store.tmpPrice = 0;
        }
        for (var i = 0; i < store.sclist.length; i++) {
          if (store.sclist[i].actPrice) {
            totalPrice += store.sclist[i].actPrice * store.sclist[i].qty;
          } else {
            totalPrice += store.sclist[i].price * store.sclist[i].qty;
          }
        }

        store.coupons.couponsList.forEach((cou) => {
          if (cou.typechecked) {
            totalPrice -= cou.faceValue;
          }
        });
        totalPrice += store.tmpPrice;
      });

      this.couponsplatform.couponslistplatform.forEach((c) => {
        if (c.typechecked) {
          this.Shoptext = c.typetext;
          totalPrice -= c.faceValue;
          this.ShopCouponsId = c.id;
        }
      });

      if (totalPrice <= 0.01) {
        totalPrice = 0.01;
      }
      return totalPrice.toFixed(2);
    },
    //获取默认地址
    GetDefaultAdd() {
      GetDefaultUserAddressAPI("get").then((res) => {
        console.log(res, "获取默认地址");
        if (res.data) {
          if (this.useradd == null) {
            this.defaultAdd = res.data;

            this.tmpAddress(this.defaultAdd.provinceNo);
          } else {
            this.defaultAdd = this.useradd;
            this.tmpAddress(this.defaultAdd.provinceNo);
          }

          // this.GetGoodsBuyTmpData();
        } else {
          this.Isadd = false;
        }
      });
    },
    //计算所有店铺的数量
    countnum() {
      let totalnum = 0; //临时总价
      this.orderData.forEach((store) => {
        store.sclist.forEach((item) => {
          totalnum += item.qty;
        });
      });
      return totalnum;
    },
    firstCartOrder() {
      var ids = this.$route.query.ids;

      var data = qs.stringify({ 
        CIDS: ids,
      });

      GetShopCartConfirmListAPI(data, "post", 1).then((res) => {
        this.orderData = res.data.slist;
        this.couponsplatform.couponslistplatform = res.data.retcouList;

        if (this.orderData[0].pickup) {
          this.Pdata.pickupId = this.orderData[0].pickup.id;
        }

        // this.GetDefaultAdd();
      });
    },
    tmpAddress(provinceNo) {
      var ids = this.$route.query.ids;

      var data = qs.stringify({
        CIDS: ids,
        proicNo: provinceNo,
      });

      GetShopCartTmpAPI(data, "post", 1).then((res) => {
        // let arr = res.data.rows.filter(function(item) {
        //   return item.isDefault !== 1;
        // });
        this.orderData.forEach((element) => {
          var shopuid = element.id;
          let arr = res.data.filter(function (item) {
            return item.shopId == shopuid;
          });
          element.tmpPrice = arr[0].tmpPrice;
        });
      });
    },
    // debounceBtn: debounce(function () {
    //   this.btnSubmit();
    // }, 1000),
    // debounceBtnTow: debounce(function () {
    //   this.AlipayBtn();
    // }, 1000),
    debounceBtn: throttle(function (Type) {
      if (Type == 3) {
        if (this.Pdata.linkMan != "" && this.Pdata.linkTel != "") {
          this.btnSubmit();
        } else {
          Toast("请先填写提货人姓名，电话");
        }
      } else {
        this.btnSubmit();
      }
    }, 1000),
    debounceBtnTow: throttle(function (Type) {
      if (Type == 3) {
        if (this.Pdata.linkMan != "" && this.Pdata.linkTel != "") {
          this.AlipayBtn();
        } else {
          Toast("请先填写提货人姓名，电话");
        }
      } else {
        this.AlipayBtn();
      }
    }, 1000),
    btnSubmit() {
      var ids = this.$route.query.ids;
      var data = qs.stringify({
        IDs: ids,
        Data: this.orderData,
        AddID: this.defaultAdd.id,
        ShopCouponsId: this.ShopCouponsId,
        pickupId: this.Pdata.pickupId,
        linkMan: this.Pdata.linkMan,
        linkTel: this.Pdata.linkTel,
      });

      CreateShopOrderAsyncSsmAPI(data, "post", 1).then((res) => {
        if (res.code == 1) {
          this.GetUserCartCountData();
          let link = `${window.location.href.split("#")[0]}`;
          console.log(link, "linklinklinklinklink");
          // etWx_PayData(res.data,1);

          if (window.localStorage.getItem("isWeiXin") == "true") {
            etWx_PayData(res.data);
          } else {
            etWx_PayData(res.data).then((val) => {
              console.log(val, "val val val 当前支付的url");
              this.wxlink = val;
              this.jumpurl();
            });
          }

          // this.PayShopOrder(res.data, 1, 1);
          //支付
        } else {
          this.$message({
            message: res.msg,
            type: "success",
          });
        }
      });
    },
    // 创建订单 支付宝支付
    AlipayBtn() {
      var ids = this.$route.query.ids;
      var data = qs.stringify({
        IDs: ids,
        Data: this.orderData,
        AddID: this.defaultAdd.id,
        ShopCouponsId: this.ShopCouponsId,
        pickupId: this.Pdata.pickupId,
        linkMan: this.Pdata.linkMan,
        linkTel: this.Pdata.linkTel,
      });

      CreateShopOrderAsyncSsmAPI(data, "post", 1).then((res) => {
        if (res.code == 1) {
          this.GetUserCartCountData();

          AlipayData(res.data, 1).then((val) => {
            console.log(val, "支付宝弹出页面");
            this.alhtml = val;
            this.$nextTick(() => {
              this.$refs.alipayWap.children[0].submit();
            });
          });
        }
      });
    },
    PayShopOrder(res, type, otype) {
      //付款成功接口应该数后端调用的
      var arr = new Array();

      res.forEach((element) => {
        arr.push(element.id);
      });
      var Btndata = qs.stringify({
        OrderIDs: arr,
        PayType: type,
        OPayType: otype,
      });

      PayShopOrderAsyncAPI(Btndata, "post", 1).then((res) => {});
    },
  },

  mounted() {
    this.firstCartOrder();

    if (window.localStorage.getItem("isWeiXin") == "true") {
      console.log("是微信环境");
      this.Alipayshow = false;
      this.WeChattext = "立即支付";
    } else {
      this.Alipayshow = true;
      console.log("不是微信环境");
      this.WeChattext = "微信支付";
    }

    if (window.localStorage.getItem("isAlipay") == "true") {
      console.log("是支付宝环境");
      this.WeChatshow = false;
    } else {
      console.log("是支付宝环境");
      this.WeChatshow = true;
    }
  },
  created() {
    this.GetDefaultAdd();
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      // console.log(from.query);
      vm.useradd = JSON.parse(window.localStorage.getItem("applyParams"));
      // console.log(vm.useradd, "本地存储的地址");
    });
  },
};
</script>

<style lang="less" scoped>
.OrderConfirmation {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: @base-color;
  padding-bottom: 116px;
  box-sizing: border-box;
  .OrderConfirmation_box {
    margin: 0 20px;
    height: auto;
    padding-top: 16px;
    // 自营
    .title_proprietary {
      width: 100%;
      height: 110px;
      background: #ffffff;
      box-shadow: 0px 4px 8px 0px rgba(0, 11, 38, 0.06);
      border-radius: 10px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      div {
        width: 50%;
        display: flex;
        justify-content: center;
      }
      input {
        width: 80%;
        text-align: center;
        outline: none;
        border: none;
      }
      span {
        width: 1px;
        height: 28px;
        background: rgba(177, 182, 196, 0.4);
      }
    }
    // 选择地址
    .title {
      width: 100%;
      background: #fff;
      // height: 184px;
      background: @text-white;
      box-shadow: @auxiliary-shadow;
      border-radius: 16px;
      display: flex;
      align-items: center;
      padding: 40px 0;
      .left {
        flex: 4;
        display: flex;
        align-items: center;
        .d1 {
          padding-left: 24px;
          img {
            width: 68px;
            height: 68px;
          }
        }
        .d2 {
          display: flex;
          flex-direction: column;
          padding-left: 30px;
          p:nth-child(1) {
            display: flex;
            font-size: 32px;
            color: @text-colorA;
            align-items: baseline;
            span {
              font-size: 24px;
              color: @text-colorC;
              padding-left: 16px;
            }
          }
          p:nth-child(2) {
            font-size: 24px;
            color: @text-colorA;
            padding-top: 20px;
            line-height: 36px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        padding-right: 24px;
        img {
          width: 13px;
          height: 24px;
        }
      }
    }
    // 订单详情
    .order_content {
      // margin: 0 20px;
      .order-store-item {
        margin-top: 16px;
        background: @text-white;
        width: 100%;
        box-shadow: @other-shadow;
        border-radius: 16px;
        padding-bottom: 12px;
        .storename {
          .tips {
            color: red;
          }
          padding-top: 24px;
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
            padding-bottom: 20px;
            li {
              margin-top: 24px;
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
        .other {
          padding-left: 120px;
          padding-right: 24px;
          // 配送方式
          .distribution {
            display: flex;
            align-items: center;
            font-size: 24px;
            color: @text-colorA;
            height: 68px;
            .right {
              flex: 1;
              padding-left: 28px;
              display: flex;
              align-items: center;
              .s1 {
                flex: 1;
                color: @text-colorC;
              }
            }
          }
          // 店铺优惠
          .DiscountStores {
            display: flex;
            align-items: center;
            font-size: 24px;
            color: @text-colorA;
            height: 68px;
            .right {
              flex: 1;
              padding-left: 28px;
              display: flex;
              align-items: center;
              .s1 {
                flex: 1;
                color: @text-colorC;
              }
              img {
                width: 13px;
                height: 24px;
              }
            }
          }
          // 开具发票
          .invoice {
            display: flex;
            align-items: center;
            font-size: 24px;
            color: @text-colorA;
            height: 68px;
            .left {
              flex: 1;
            }
            .right {
              display: flex;
              align-items: center;
              /deep/ .van-checkbox:first-child {
                margin-right: 20px;
              }
              /deep/ .van-radio--horizontal {
                margin-right: 28px;
              }
              /deep/ .van-radio--horizontal:last-child {
                margin-right: 0px;
              }
              /deep/ .van-radio__label {
                margin-left: 12px;
                font-size: 24px;
                line-height: normal;
              }
            }
          }
          .invoice1 {
            display: flex;
            flex-direction: column;
            input {
              height: 68px;
              outline: none;
              text-align: right;
              border: none;
              font-size: 24px;
            }
          }
          //   买家留言
          .message {
            display: flex;
            align-items: center;
            font-size: 24px;
            color: @text-colorA;
            height: 68px;
            .right {
              flex: 1;
              padding-left: 28px;
              display: flex;
              align-items: center;
              input {
                outline: none;
                border: none;
                font-size: 24px;
                width: 100%;
              }
            }
          }
          // 计算商品
          .calculate {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 24px;
            color: @text-colorA;
            height: 68px;
            span {
              color: @main-color;
            }
          }
        }
      }
    }
    // 商城优惠
    .MallPreferential {
      height: 88px;
      background: @text-white;
      box-shadow: @auxiliary-shadow;
      border-radius: 16px;
      display: flex;
      align-items: center;
      margin-top: 16px;
      .left {
        flex: 1;
        padding-left: 24px;
        display: flex;
        align-items: center;
        .s1 {
          font-size: 20px;
          color: @text-white;
          background: @main-color;
          width: 50px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .s2 {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 400;
          padding-left: 12px;
        }
        .s3 {
          font-size: 24px;
          color: @text-colorC;
          padding-left: 24px;
        }
      }
      .right {
        padding-right: 24px;
        img {
          width: 13px;
          height: 24px;
        }
      }
    }
  }
  // 底部
  .foot {
    width: 100%;
    height: 100px;
    position: fixed;
    bottom: 0;
    background: @text-white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      padding-left: 16px;
      span {
        font-size: 20px;
        color: @text-colorC;
        i {
          font-size: 24px;
          color: @main-color;
          font-style: normal;
        }
      }
    }
    .right {
      padding-right: 20px;
      display: flex;
      align-items: center;
      .b1 {
        width: 210px;
        height: 68px;
        background: @zfb;
        border-radius: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @text-white;
        font-size: 32px;
        font-weight: 500;
        outline: none;
        border: none;
      }
      .b2 {
        width: 200px;
        height: 68px;
        background: @wx;
        border-radius: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @text-white;
        font-size: 32px;
        font-weight: 500;
        outline: none;
        border: none;
        margin-left: 16px;
      }
      .b3 {
        width: 200px;
        height: 68px;
        background: @main-color;
        border-radius: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @text-white;
        font-size: 32px;
        font-weight: 500;
        outline: none;
        border: none;
        margin-left: 16px;
      }
    }
  }
  // 入驻类型
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
        ul {
          width: 100%;
          li {
            width: 100%;
            display: flex;
            align-items: center;
            // border-bottom: 1px solid @base-color;
            padding: 30px 0;
            .left {
              flex: 3;
              display: flex;
              // color: @main-color;
              .p1 {
                font-size: 28px;
                font-weight: 500;
                columns: @text-colorA;
              }
              .p2 {
                font-size: 24px;
                line-height: 30px;
                color: @text-colorC;
                padding-left: 4px;
              }
            }
            .right {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              padding-right: 12px;
            }
          }
          .typeactive {
            color: @main-color !important;
          }
        }
      }
    }
    .type_shadow_foot {
      height: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 0;
      background: @text-white;
      z-index: 999;
      .foot3 {
        margin: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 32px;
        font-weight: 500;
        color: @text-white;
        .b2 {
          width: 100%;
          height: 80px;
          border-radius: 40px;
          outline: none;
          border: none;
          background: @button-mainbackground;
        }
        .b2:active {
          background: @button-mainbackground-on;
        }
      }
    }
  }
}
</style>