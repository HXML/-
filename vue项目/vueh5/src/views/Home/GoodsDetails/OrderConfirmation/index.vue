<template>
  <div class="OrderConfirmation">
    <div class="OrderConfirmation_box">
      <div class="title_proprietary" v-show="orderData.shopType == 3">
        <div>
          <input type="text" placeholder="提货人姓名" v-model="Pdata.linkMan" />
        </div>
        <span></span>
        <div>
          <input type="text" placeholder="提货人电话" v-model="Pdata.linkTel" />
        </div>
      </div>

      <!-- 选择地址 -->
      <div
        class="title"
        @click="jumpUsedAddress()"
        v-show="orderData.shopType != 3"
      >
        <div class="left">
          <div class="d1">
            <img src="@/assets/images/home/b2c_shop_icon@2x.png" alt />
          </div>
          <div class="d2" v-if="Isadd">
            <p>
              {{ defaultAdd.consignee }}
              <span>{{ defaultAdd.consigneeMobile }}</span>
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
        <div class="order-store-item">
          <div class="storename">
            <p>
              <img src="@/assets/images/mine_Order_icon6@2x.png" alt />
              <span>{{ orderData.shopName }}</span>
            </p>
          </div>
          <div class="good">
            <ul>
              <li>
                <div class="good_left">
                  <img
                    :src="orderData.mainImg + '?x-oss-process=style/b1'"
                    alt
                  />
                </div>
                <div class="good_right">
                  <div class="d1">
                    <p>{{ orderData.goodsName }}</p>
                    <p>
                      <span
                        v-for="(item, index) in orderData.dataJsontow"
                        :key="index"
                        >{{ item.Key }}: {{ item.Value }} ;</span
                      >
                    </p>
                  </div>
                  <div class="d2">
                    <span>￥{{ orderData.price }}</span>
                    <span>x{{ orderData.goodnum }}</span>
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
                <span class="s2">快递 ￥{{ freight }}</span>
              </div>
            </div>
            <!-- 店铺优惠 -->
            <div class="DiscountStores" @click="tctype()">
              <div class="left">
                <span>店铺优惠</span>
              </div>
              <div class="right">
                <span class="s1">{{ orderData.discountStores }}</span>
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
                  v-model="orderData.radio"
                  direction="horizontal"
                  @change="checkshow($event)"
                >
                  <van-radio name="1" checked-color="#F42636">个人</van-radio>
                  <van-radio name="2" checked-color="#F42636">企业</van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="invoice1" v-show="orderData.invoice1">
              <input
                type="text"
                placeholder="输入发票抬头"
                v-model="InvoiceTitle"
              />
              <input type="text" placeholder="输入企业税号" v-model="CoTaxNo" />
            </div>
            <!-- 买家留言 -->
            <div class="message">
              <div class="left">
                <span>买家留言</span>
              </div>
              <div class="right">
                <input
                  type="text"
                  placeholder="选填，请先与商家协商一致 "
                  v-model="UserRmk"
                />
              </div>
            </div>
            <!-- 计算商品 -->
            <div class="calculate">
              <!-- {{countAllNum(item.goodData)}} -->
              共{{ orderData.goodnum }}件，小计
              <span>
                <!--{{countAllPrice(item.goodData)}}-->
                <!-- ￥{{totlestore}} -->
                ￥{{
                  countAllPrice(
                    orderData.actPrice == 0
                      ? orderData.price
                      : orderData.actPrice,
                    orderData.goodnum,
                    freight,
                    shopfaceValue
                  ).toFixed(2)
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商城优惠 -->
      <div class="MallPreferential" @click="tcplatformtype()">
        <div class="left">
          <span class="s1">优惠</span>
          <span class="s2">商城优惠</span>
          <span class="s3">{{ this.platformtext }}</span>
        </div>
        <div class="right">
          <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="foot">
      <div class="left">
        <span>
          <!-- {{countnum()}}-->
          共{{ orderData.goodnum }}件，小计
          <i>
            <!-- {{count()}}-->
            ￥{{
              countAllPriceTow(
                orderData.actPrice == 0 ? orderData.price : orderData.actPrice,
                orderData.goodnum,
                freight,
                shopfaceValue,
                scfaceValue
              ).toFixed(2)
            }}
          </i>
        </span>
      </div>
<!-- 
      <div class="right" v-show="orderData.shopType != 3">
        <button class="b1" v-show="Alipayshow" @click="debounceBtnTow">
          支付宝支付
        </button>

        <button
          :class="Alipayshow ? 'b2' : 'b3'"
          @click="debounceBtn"
          v-show="WeChatshow"
        >
          {{ WeChattext }}
        </button>
      </div> -->
      <div class="right">
        <button class="b1" v-show="Alipayshow" @click="debounceBtnTow(orderData.shopType)">
          支付宝支付
        </button>

        <button
          :class="Alipayshow ? 'b2' : 'b3'"
          @click="debounceBtn(orderData.shopType)"
          v-show="WeChatshow"
        >
          {{ WeChattext }}
        </button>
      </div>
    </div>

    <div @click="jumpurl()" class="Wxwithout"></div>

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
                v-for="(item, index) in coupons.couponslist"
                :key="index"
                @click="item.couponsFlag && xztype(index, item.typetext)"
              >
                <div class="left">
                  <p class="p1">{{ item.typename }}</p>
                  <p class="p2">
                    满{{ item.quotaLimit }}减{{ item.faceValue }}
                  </p>
                </div>
                <div class="right">
                  <van-checkbox
                    v-model="item.typechecked"
                    checked-color="#F42636"
                    :disabled="item.disabledoln"
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
                v-for="(item, index) in couponsplatform.couponslistplatform"
                :key="index"
                @click="item.couponsFlagTow && xzplatformtype(index)"
              >
                <div class="left">
                  <p class="p1">{{ item.typename }}</p>
                  <p class="p2">
                    满{{ item.quotaLimit }}减{{ item.faceValue }}
                  </p>
                </div>
                <div class="right">
                  <van-checkbox
                    v-model="item.typechecked"
                    checked-color="#F42636"
                    :disabled="item.disabledoln"
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

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Toast } from "vant";

import { RadioGroup, Radio } from "vant";
import loading from "@/components/loading";

import {
  GetShopBuyListAPI,
  GetDefaultUserAddressAPI,
  CreateShopOrderBYSkuAsyncAPI,
  GetGoodsBuyTmpAPI,
} from "@/api/index";

import {
  CollectCouponsAPI,
  GetUserShopCouponsListAPI,
  GetUserShopCouponsListBuyAPI,
} from "@/api/coupons";

import { getlistAPI } from "@/api/MyApi";

import { getWxPayDataAPI, GetPayInfoByOrderNoAPI } from "@/api/pay";

// 下拉处理
import { List } from "vant";

// Popup 动作面板
import { Popup } from "vant";

import qs from "qs";

import { etWx_PayData, callpayTow, AlipayData } from "@/common/js/payment.js";

import { debounce, throttle } from "@/common/js/debounceAndThrottle.js";

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
    loadingshow: true,
    popIndex: 0,
    result: [],
    orderData: {},
    orderDataskulist: {},
    freight: 0, //运费
    shopfaceValue: 0, //店铺优惠券
    scfaceValue: 0, //商城优惠券
    DiscountStorestext: "", //选中的优惠券
    type: false, //判断店铺优惠券弹出框的显示隐藏
    platformtype: false, //判断商城优惠券弹出框的显示隐藏
    //优惠券id
    idlistone: 0,
    idlisttwo: 0,
    idlistoneshop: 0,
    coupons: {
      couponslist: [],
    },
    couponsplatform: {
      couponslistplatform: [],
    },
    useradd: {},
    defaultAdd: {
      // consignee: "", //姓名
      // consigneeMobile: "", //电话
      // consigneeAddress: "", //详细地址
      // province: "",
      // city: "",
      // userArea: ""
    },
    UserRmk: "", //订单备注
    InvoiceTitle: "", //发票抬头
    CoTaxNo: "", //企业税号
    wx_PayData: "",
    Alipayshow: true, //支付宝按钮隐藏显示
    WeChatshow: true, //微信支付按钮隐藏显示
    WeChattext: "微信支付",
    totlestore: 0, //总价格减去店铺优惠券
    index: -1,
    index2: -1,
    platformtext: "",
    loading: false,
    finished: false,
    total: 0,
    selectedObj: {
      // 获取店铺优惠券
      shopID: 0,
      GoodsId: 0,
      pIdx: 0,
      pSize: 16,
    },
    loadingTow: false,
    finishedTow: false,
    totalTow: 0,
    selectedObjTow: {
      // 获取商城优惠券
      shopID: 0,
      GoodsId: 0,
      pIdx: 0,
      pSize: 10,
    },
    is_click: true,
    Isadd: true,
    wxlink: "",
  }),
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Popup.name]: Popup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [List.name]: List,
    loading: loading,
  },
  methods: {
    // 微信外部支付
    jumpurl() {
      if (process.env.VUE_APP_URL === "https://t-api.zk-mall.net/") {
        // 如果是测试环境, 则生成控制台
        // var aaa=this.wxlink+'&redirect_url=https://t-shop.zk-mall.net/#/My/Myorder/paysuccess'
        // console.log(aaa,"aaaaaaaaaaaa")
        let reurl = "https://t-shop.zk-mall.net/#/My/Myorder/paysuccess";
        window.location.href =
          this.wxlink + "&redirect_url=" + encodeURIComponent(reurl);
      } else {
        let reurl = "https://shop.zk-mall.net/#/My/Myorder/paysuccess";
        window.location.href =
          this.wxlink + "&redirect_url=" + encodeURIComponent(reurl);
      }

      // callpayTow();
    },
    jumpUsedAddress() {
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
          let oln = "/GoodsDetails/OrderConfirmation";
          let objquery = {
            id: this.$route.query.id,
            num: this.$route.query.num,
          };
          window.localStorage.setItem("fromqueryadd", JSON.stringify(objquery));
          window.localStorage.setItem("frompathadd", oln);
          this.$router.push({ path: "/My/UsedAddress" });
        }
      });
    },
    // 选择店铺优惠
    tctype() {
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
      this.platformtype = false;
    },
    // 选择优惠类型 index是优惠券数量的index istext是优惠券内容 storeName是代表哪个列表的优惠券
    xztype(index) {
      //index 优惠券弹框的列表，istext优惠券弹框的内容，storeName 整个商铺的列表index
      // console.log(index);
      // console.log(this.coupons.couponslist[index].typechecked);

      this.index = index;
      if (this.coupons.couponslist[index].typechecked == true) {
        // this.coupons.activeName = -1;
      } else {
        this.coupons.couponslist.forEach((item, index) => {
          this.coupons.couponslist[index].typechecked = false;
          // this.coupons.activeName = -1;
        });

        // this.coupons.activeName = index;
        this.coupons.couponslist[index].typechecked = true;

        // console.log(this.coupons.couponslist[index],"this.coupons.couponslist[index]")
      }
    },
    // 选择优惠类型 index是优惠券数量的index istext是优惠券内容 storeName是代表哪个列表的优惠券
    xzplatformtype(index) {
      console.log(index);
      console.log(this.couponsplatform.couponslistplatform[index].typechecked);
      //index 优惠券弹框的列表，istext优惠券弹框的内容，storeName 整个商铺的列表index
      if (this.couponsplatform.couponslistplatform[index].typechecked == true) {
        // this.couponsplatform.activeName = -1;
      } else {
        this.couponsplatform.couponslistplatform.forEach((item, index) => {
          this.couponsplatform.couponslistplatform[index].typechecked = false;
          // this.couponsplatform.activeName = -1;
        });
        this.index2 = index;
        // this.couponsplatform.activeName = index;

        this.couponsplatform.couponslistplatform[index].typechecked = true;
      }
    },
    // 点击优惠券里面的确认
    confirmCoupon() {
      console.log(this.coupons.couponslist, "this.coupons.couponslist");

      let item = this.coupons.couponslist.filter((item) => {
        return item.typechecked === true;
      });
      console.log(item[0]);

      if (item[0]) {
        this.idlistoneshop = item[0].shopCouponsId;
        this.idlistone = item[0].id;

        this.orderData.discountStores =
          "满" + item[0].quotaLimit + "减" + item[0].faceValue;
        this.shopfaceValue = item[0].faceValue;
      } else {
        this.orderData.discountStores = "";
        this.shopfaceValue = 0;
        this.idlistone = 0;
      }
      this.type = false;
      // this.totlestore = this.totlestore - item[0].faceValue;
      // console.log(this.totlestore);
    },
    // 点击优惠券里面的确认
    confirmCoupon1() {
      let item = this.couponsplatform.couponslistplatform.filter((item) => {
        return item.typechecked === true;
      });

      console.log(item[0], "item[0]1111");
      if (item[0]) {
        this.platformtext =
          "满" + item[0].quotaLimit + "减" + item[0].faceValue;
        this.scfaceValue = item[0].faceValue;
        this.idlisttwo = item[0].id;
      } else {
        this.platformtext = "";
        this.scfaceValue = 0;
        this.idlisttwo = 0;
      }
      this.platformtype = false;

      // this.totlestore = this.totlestore - item[0].faceValue;
      // console.log(this.totlestore);
    },
    // 点击个人 企业的事件
    checkshow(event) {
      console.log(event, "eventeventevent");
      if (event == 2) {
        this.orderData.invoice1 = true;
      } else {
        this.orderData.invoice1 = false;
      }
    },
    //获取当前订单信息
    Getinformation() {
      // let data = qs.stringify({
      //   skuID: this.$route.query.id
      // });
      let data = {
        skuID: this.$route.query.id,
        Isoriginal: window.localStorage.getItem("isalone"), //拼团是否是原价格
        Num: this.$route.query.num,
      };
      GetShopBuyListAPI(data, "get").then((res) => {
        // console.log(res);
        var obj = res.data.dataJson;
        console.log(obj, "obj");

        this.orderData = {
          ...res.data,
          discountStores: "",
          radio: "0",
          invoice1: false,
          goodnum: this.$route.query.num,
          dataJsontow: JSON.parse(obj),
        };

        this.orderDataskulist = res.data.skuList[0];

        console.log(this.orderData, "this.orderData");

        if (this.orderData.pickuoId) {
          this.Pdata.pickupId = this.orderData.pickuoId;
        }

        this.totlestore = this.orderData.goodnum * this.orderData.price;

        this.selectedObj.GoodsId = res.data.goodsId;
        this.selectedObjTow.GoodsId = res.data.goodsId;

        this.GetCoupons();
        this.GetCouponsplatform();

        console.log(
          this.orderData,
          "this.orderData this.orderDatathis.orderData "
        );
        this.loadingshow = false;
      });
    },
    // 获取当前订单的运费
    GetGoodsBuyTmpData() {
      console.log(
        this.defaultAdd.provinceNo,
        "defaultAdddefaultAdddefaultAdddefaultAdd"
      );
      let data = qs.stringify({
        skuID: this.$route.query.id,
        proicNo: this.defaultAdd.provinceNo,
        num: this.$route.query.num,
      });
      GetGoodsBuyTmpAPI(data, "post").then((res) => {
        // console.log(res)
        console.log(res.data.tmpPrice);
        this.freight = res.data.tmpPrice;
        //  this.totlestore=this.totlestore-this.freight
      });
    },
    //获取默认地址
    GetDefaultAdd() {
      GetDefaultUserAddressAPI("get").then((res) => {
        console.log(res, "获取默认地址");
        if (res.data) {
          if (this.useradd == null) {
            this.defaultAdd = res.data;
            console.log(this.defaultAdd);
          } else {
            this.defaultAdd = this.useradd;
          }
          this.GetGoodsBuyTmpData();
        } else {
          this.Isadd = false;
        }
      });
    },
    // 获取店铺优惠券
    GetCoupons() {
      this.selectedObj.shopID = this.orderData.shopID;
      this.selectedObj.pIdx++;
      GetUserShopCouponsListBuyAPI(this.selectedObj, "get").then((res) => {
        console.log(res, "店铺的优惠券");
        this.coupons.couponslist = [];

        this.coupons.couponslist.push(
          ...res.data.map((item) => {
            return Object.assign({}, item, {
              typename: "店铺优惠：",
              typechecked: null,
              couponsFlag: true, //优惠券是否点击
              disabledoln: false,
            });
          })
        );

        // if (this.index == -1) {
        // } else {
        //   this.coupons.couponslist[this.index].typechecked = true;
        // }

        console.log(this.totlestore, "totlestore获取店铺优惠券");

        this.coupons.couponslist.forEach((item, index) => {
          if (item.quotaLimit > this.totlestore) {
            console.log(item, "item");
            item.couponsFlag = false;
            item.disabledoln = true;
          }
        });
      });
    },
    // 获取商城优惠券
    GetCouponsplatform() {
      this.selectedObjTow.pIdx++;
      GetUserShopCouponsListBuyAPI(this.selectedObjTow, "get").then((res) => {
        console.log(res, "商城的优惠券");
        this.couponsplatform.couponslistplatform = [];
        this.couponsplatform.couponslistplatform.push(
          ...res.data.map((item) => {
            return Object.assign({}, item, {
              typename: "商城优惠：",
              typechecked: null,
              couponsFlagTow: true, //优惠券是否点击
              disabledoln: false,
            });
          })
        );

        console.log(this.totlestore, "totlestore");

        this.couponsplatform.couponslistplatform.forEach((item, index) => {
          if (item.quotaLimit > this.totlestore) {
            // console.log(item, "item");
            item.couponsFlagTow = false;
            item.disabledoln = true;
          }
        });
      });
    },
    //计算使用店铺优惠券的总价价格
    countAllPrice(Shopprice, Shopnum, tmpPrice, shopfaceValue) {
      //商品价格(活动价格)，商品数量,运费，店铺优惠券,
      // console.log(this.orderDataskulist.isFreeShipping,"orderDataskulistorderDataskulistorderDataskulist")

      if (this.orderDataskulist.isFreeShipping) {
        tmpPrice = 0;
      }

      let storeAll = 0;
      storeAll = Shopprice * Shopnum;

      var allone = storeAll - shopfaceValue;

      if (allone <= 0) {
        if (tmpPrice == 0) {
          allone = 0.01;
        } else {
          allone = tmpPrice;
        }
      } else {
        allone = allone + tmpPrice;
      }

      return allone;
    },
    //计算使用商城优惠券的总价价格
    countAllPriceTow(Shopprice, Shopnum, tmpPrice, shopfaceValue, scfaceValue) {
      if (this.orderDataskulist.isFreeShipping) {
        tmpPrice = 0;
      }
      //商品价格，商品数量,运费，优惠券
      let storeAll = 0;
      storeAll = Shopprice * Shopnum;

      var allTow = storeAll - shopfaceValue - scfaceValue;

      if (allTow <= 0) {
        if (tmpPrice == 0) {
          allTow = 0.01;
        } else {
          allTow = tmpPrice;
        }
      } else {
        allTow = allTow + tmpPrice;
      }
      return allTow;
      // return storeAll - shopfaceValue - scfaceValue;
    },
    debounceBtn: throttle(function (Type) {
      if (Type == 3) {
        if (this.Pdata.linkMan != "" && this.Pdata.linkTel != "") {
          this.CreateOrder();
        } else {
          Toast("请先填写提货人姓名，电话");
        }
      } else {
        this.CreateOrder();
      }
    }, 500),
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
    }, 500),
    //创建订单   微信支付
    CreateOrder() {
      console.log(
        window.localStorage.getItem("isalone"),
        "window.localStorage.getItem('isalone')"
      );
      let data = {
        groupID: window.localStorage.getItem("isgroupmain"), //拼团的团号
        Isoriginal: window.localStorage.getItem("isalone"), //拼团是否是原价格
        skuID: this.orderData.skuList[0].id, //sku参数信息
        num: this.orderData.goodnum, //下单数量
        AddID: this.defaultAdd.id, //地址序号
        CouponsId: this.idlistone,
        CouponsShopId: this.idlistoneshop,
        ShopCouponsId: this.idlisttwo,
        distributiontype: 1, //支付状态
        UserRmk: this.UserRmk, //订单备注
        InvoiceTitle: this.InvoiceTitle, //发票抬头
        CoTaxNo: this.CoTaxNo, //企业税号
        pickupId: this.Pdata.pickupId,
        linkMan: this.Pdata.linkMan,
        linkTel: this.Pdata.linkTel,
      };
      CreateShopOrderBYSkuAsyncAPI(data, "get").then((res) => {
        console.log(res.data, "创建订单");

        if (window.localStorage.getItem("isWeiXin") == "true") {
          etWx_PayData(res.data);
        } else {
          etWx_PayData(res.data).then((val) => {
            console.log(val, "val val val 当前支付的url");
            this.wxlink = val;
            this.jumpurl();
          });
        }
        // this.GetPayInfoByOrderNoDAta(res.data[0].orderNo);
      });
    },
    // 创建订单 支付宝支付
    AlipayBtn() {
      // if (this.is_click) {
      let data = {
        groupID: window.localStorage.getItem("isgroupmain"), //拼团的团号
        Isoriginal: window.localStorage.getItem("isalone"), //拼团是否是原价格
        skuID: this.orderData.skuList[0].id, //sku参数信息
        num: this.orderData.goodnum, //下单数量
        AddID: this.defaultAdd.id, //地址序号
        CouponsId: this.idlistone,
        CouponsShopId: this.idlistoneshop,
        ShopCouponsId: this.idlisttwo,
        distributiontype: 1, //支付状态
        UserRmk: this.UserRmk, //订单备注
        InvoiceTitle: this.InvoiceTitle, //发票抬头
        CoTaxNo: this.CoTaxNo, //企业税号
        pickupId: this.Pdata.pickupId,
        linkMan: this.Pdata.linkMan,
        linkTel: this.Pdata.linkTel,
      };

      CreateShopOrderBYSkuAsyncAPI(data, "get").then((res) => {
        console.log(res.data, "创建订单");
        AlipayData(res.data, 1).then((val) => {
          console.log(val, "支付宝弹出页面");
          this.alhtml = val;
          this.$nextTick(() => {
            this.$refs.alipayWap.children[0].submit();
          });
        });
      });
    },
  },
  created() {
    this.GetDefaultAdd();
  },
  mounted() {
    // this.count();
    this.Getinformation();

    console.log(window.localStorage.getItem("isWeiXin"));

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

    // this.GetCoupons();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      // console.log(from.query);
      vm.useradd = JSON.parse(window.localStorage.getItem("applyParams"));
      // console.log(vm.useradd, "本地存储的地址");
    });
  },
  computed: {},
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
  .Wxwithout {
    width: 100%;
    overflow: hidden;
    display: none;
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
            // padding: 130px 0;
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