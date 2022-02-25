<template>
  <div style="width: 100%; height: 100%">
    <div
      :class="
        goods.length == 0 && overdueGoods.length == 0
          ? 'shoppingCartkong'
          : 'shoppingCart'
      "
    >
      <div class="kong" v-if="goods.length == 0 && overdueGoods.length == 0">
        <div class="kong_box pb-16vw">
          <img src="@/assets/images/kong/kong_icon4@2x.png" alt />
          <p class="p1">这日子还过不过了</p>
          <p class="p2">购物车里啥都没有，不吃不喝不睡觉了么</p>
          <button class="b1" @click="jumpProductList()">去逛逛</button>
        </div>
      </div>
      <!-- 头部 -->
      <div
        class="pageHeader flex jc-sb"
        v-if="goods.length != 0 || overdueGoods.length != 0"
      >
        <span>购物车</span>
        <span @click="State = !State">{{ State ? "编辑" : "完成" }}</span>
      </div>
      <!-- 商品列表 -->
      <div class="cartList">
        <div v-if="goods.length != 0">
          <ul
            class="storeList"
            v-for="(arryItem, arryIndex) in goods"
            :key="arryIndex"
          >
            <div class="goodCard" v-if="arryItem.sclist.length !== 0">
              <!-- 头部 -->
              <div class="cardHead flex aic">
                <van-checkbox
                  @click="storeAllcheck(arryIndex)"
                  class="mr-16"
                  checked-color="#F42636"
                  v-model="arryItem.allChecked"
                ></van-checkbox>
                <span
                  class="mr-16"
                  @click="jumpStore(arryItem.id, arryItem.shopType)"
                  >{{ arryItem.shopName }}
                </span>
                <van-icon name="arrow" />
              </div>
              <li
                v-for="(goodItem, itemIndex) in arryItem.sclist"
                :key="itemIndex"
                class="rel"
              >
                <!-- 中间 -->
                <div class="cardContent flex aic">
                  <div class="cardContent_left">
                    <van-checkbox
                      @click="
                        (goodItem.actType != 'TYPE_DISCOUNT' ||
                          (goodItem.actType == 'TYPE_DISCOUNT' &&
                            goodItem.actCanBuyNum > 0)) &&
                          goodCheck(itemIndex, arryIndex)
                      "
                      class="mr-16"
                      checked-color="#F42636"
                      v-model="goodItem.checked"
                      :disabled="
                        goodItem.actType == 'TYPE_DISCOUNT' &&
                        goodItem.actCanBuyNum == 0
                      "
                    ></van-checkbox>
                    <img
                      :src="goodItem.imageUrl + '?x-oss-process=style/n4'"
                      class="itemImg"
                      @click="jumpGoodsDetails(goodItem.goodsId)"
                    />
                  </div>
                  <div class="information">
                    <div
                      class="title"
                      @click="jumpGoodsDetails(goodItem.goodsId)"
                    >
                      {{ goodItem.goodsName }}
                    </div>

                    <div class="p1 flex aic">
                      <p>
                        <span v-if="goodItem.prtyColor != null"
                          >颜色：{{ goodItem.prtyColor.colorName }}</span
                        >
                        <span
                          v-for="(skuitem, skuIndex) in goodItem.prtylist"
                          :key="skuIndex"
                          >{{ skuitem.propName }}:{{ skuitem.optName }}</span
                        >
                      </p>
                      <!-- <van-icon class="ml-30" name="arrow-down" /> -->
                    </div>
                    <div
                      class="unitPriceTow flex jc-sb"
                      v-if="
                        goodItem.actType == 'TYPE_DISCOUNT' &&
                        goodItem.actCanBuyNum == 0
                      "
                    >
                      已经超出限购数量，不可再购买
                    </div>
                  </div>
                </div>
                <!-- 价格 -->
                <div class="unitPrice flex jc-sb">
                  <span></span>
                  <span class="price_text">￥{{ goodItem.price }}</span>
                  <van-stepper
                    @minus="minusGoods(itemIndex, arryIndex)"
                    @plus="plusGoods(itemIndex, arryIndex)"
                    @blur="inputBlur(itemIndex, arryIndex)"
                    v-model="goodItem.qty"
                    :max="goodItem.actCanBuyNum"
                    v-if="goodItem.actType == 'TYPE_DISCOUNT'"
                  />
                  <van-stepper
                    @minus="minusGoods(itemIndex, arryIndex)"
                    @plus="plusGoods(itemIndex, arryIndex)"
                    @blur="inputBlur(itemIndex, arryIndex)"
                    v-model="goodItem.qty"
                    v-else
                  />
                  <van-count-down
                    :time="goodItem.endTime"
                    @finish="finish()"
                    style="display: none"
                    v-if="goodItem.actType == 'TYPE_DISCOUNT'"
                  >
                  </van-count-down>
                  <!-- {{goodItem.endTime}} -->
                </div>
              </li>
            </div>
          </ul>
        </div>

        <div v-if="overdueGoods.length != 0" class="ml-30 mt-40 mb-15">
          <span class="invalidNumber"
            >失效商品 {{ getAllGoodListlength(overdueGoods) }} 件</span
          >
          <span class="ClearAllInvail" @click="DelCartdisabled"
            >清空失效商品</span
          >
        </div>
        <div v-if="overdueGoods.length != 0">
          <ul
            class="storeList"
            v-for="(arryItem, arryIndex) in overdueGoods"
            :key="arryIndex"
          >
            <div class="goodCard" v-if="arryItem.sclist.length !== 0">
              <!-- 头部 -->
              <div class="cardHead flex aic">
                <img
                  class="storeImg"
                  src="@/assets/images/home/mine_Order_icon6@2x.png"
                  alt
                />

                <span
                  class="mr-16"
                  @click="jumpStore(arryItem.id, arryItem.shopType)"
                  >{{ arryItem.shopName }}
                </span>
                <van-icon name="arrow" />
              </div>
              <li
                v-for="(goodItem, itemIndex) in arryItem.sclist"
                :key="itemIndex"
                class="rel"
              >
                <!-- 中间 -->
                <div class="cardContent flex aic">
                  <div class="cardContent_left">
                    <p class="mr-16 iseffectClass">失效</p>
                    <img
                      :class="goodItem.iSeffective ? '' : 'op5'"
                      :src="goodItem.imageUrl + '?x-oss-process=style/n4'"
                      class="itemImg"
                      @click="jumpGoodsDetails(goodItem.goodsId)"
                    />
                  </div>
                  <div class="information">
                    <div
                      :class="goodItem.iSeffective ? '' : 'op5'"
                      class="title"
                      @click="jumpGoodsDetails(goodItem.goodsId)"
                    >
                      {{ goodItem.goodsName }}
                    </div>
                    <p class="mt-12 op5 sx">{{ goodItem.iSeffectiveStr }}</p>
                    <div class="p1 flex aic">
                      <p>
                        <span v-if="goodItem.prtyColor != null"
                          >颜色：{{ goodItem.prtyColor.colorName }}</span
                        >
                        <span
                          v-for="(skuitem, skuIndex) in goodItem.prtylist"
                          :key="skuIndex"
                          >{{ skuitem.propName }}:{{ skuitem.optName }}</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
                <!-- 价格 -->
                <div class="unitPrice flex jc-sb">
                  <span></span>
                  <span class="price_text">￥{{ goodItem.price }}</span>
                  <div style="opacity: 0">
                    <van-stepper />
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
        <recommend v-if="!this.$route.query.ShopId" class="pb-16vw"></recommend>
      </div>
      <!-- 失效的商品 -->

      <!-- 底部结算 -->
      <div class="submitBAR flex aic jc-sb" v-if="goods.length != 0">
        <van-checkbox
          checked-color="#F42636"
          @click="cartAllcheck()"
          v-model="shoppingCartAllChecked"
          >全选</van-checkbox
        >
        <div v-if="State" class="flex aic">
          <div class="buyprice flex jc-fe fg1">
            <p class="p1">合计：</p>
            <p class="p2">
              <span class="f20">¥</span>
              {{ totalPrice.toFixed(2) }}
            </p>
          </div>
          <button class="btn" @click="jumpCartOrderConfirmation()">
            去结算
          </button>
        </div>
        <div v-else class="flex aic deleteState">
          <span @click="DelCartdisabled">清空所有失效商品</span>
          <button class="delete_btn" @click="DelCart">删除</button>
        </div>
      </div>
      <!-- 弹窗 -->
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { SubmitBar, Checkbox, Icon, Stepper, Sku } from "vant";
import { GetUserCartCountAPI } from "@/api/MyApi";
import recommend from "@/components/recommend";
import {
  GetShopCartListAPI,
  UpdateQtyAsyncAPI,
  DeleteCartByIDsAsyncAPI,
} from "@/api/CartApi";

import qs from "qs";

import loading from "@/components/loading";
import { Toast } from "vant";
import { GetListALLNouserAPI } from "@/api/nologin";
import { GetDefaultUserAddressAPI } from "@/api/index";
import { CountDown } from "vant";

export default {
  components: {
    [SubmitBar.name]: SubmitBar,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [Stepper.name]: Stepper,
    loading: loading,
    recommend: recommend,
    [CountDown.name]: CountDown,
  },
  data() {
    return {
      shoppingCartAllChecked: false, //购物车全选
      totalPrice: 0, //购物车总价
      State: true, //编辑完成按钮
      goods: [], //在售的商品
      overdueGoods: [], //过期的商品
      loadingshow: true,
      titledata: "购物车", //控制title的动态变量
    };
  },
  methods: {
    finish() {
      this.CartList();
    },
    getAllGoodListlength(list) {
      let number = 0;
      list.forEach((element) => {
        element.sclist.forEach((cart) => {
          number++;
        });
      });
      return number;
      console.log(number);
    },
    //跳转去店铺
    jumpStore(shopid, shopType) {
      // window.localStorage.setItem("ShopId", shopid);
      if (shopType == 3) {
        this.$router.push({
          path: "/GoodsDetails/ProprietaryStore",
          query: { ShopId: shopid },
        });
      } else {
        this.$router.push({
          path: "/GoodsDetails/Store",
          query: { ShopId: shopid },
        });
      }
    },
    //跳转去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({
        path: "/GoodsDetails",
        query: { ID: id },
      });
    },
    //去逛逛
    jumpProductList() {
      this.$router.push({ path: "/ProductList" });
    },
    //去结算
    jumpCartOrderConfirmation() {
      if (!window.localStorage.getItem("Token")) {
        Toast("尚未登录！");
        return false;
      }

      var paramsids = new Array();
      var goodTypes = new Array();
      var shopS = new Array();
      
      var thatthis = this;
      thatthis.goods.forEach((element) => {
        element.sclist.forEach((cart) => {
          console.log(cart);
          if (cart.checked) {
            paramsids.push(cart.id);
            goodTypes.push(cart.shopType); //所有选中的商品的店铺类型
            shopS.push(cart.shopId); //所有选中的店铺Id
          }
        });
      });
      if (paramsids.length <= 0) {
        Toast("请先勾选商品！");
        return;
      }
      console.log(shopS, goodTypes, "shopS");

      // [...new Set(goodTypes)].length  自营店与其他普通店铺无法同时提交
      // [...new Set(shopS)].length  不同自营店无法同时提交
      
      let isStoreExit = goodTypes.findIndex((item) => item == 3) !== -1; //自营店是否存在

      let isAllSame = [...new Set(goodTypes)].length > 1; //店铺是否单一

      let isAllSameTow=[...new Set(shopS)].length > 1;//自营是否单一

      if (isStoreExit) {
        if (isAllSame) {
          Toast("自营店商品不能与其他店铺的商品同时结算");
          return;
        }
        if (isAllSameTow) {
          Toast("不同自营店不能一起提交");
          return;
        }
      }
      this.$router.push({
        path: "/GoodsDetails/CartOrderConfirmation",
        query: { ids: paramsids.join(",") },
      });
    },
    //失去焦点时
    inputBlur(itemIndex, arryIndex) {
      this.count();
      var data = {
        ID: this.goods[arryIndex].sclist[itemIndex].id,
        Qty: this.goods[arryIndex].sclist[itemIndex].qty,
      };
      UpdateQtyAsyncAPI(data, "get").then((res) => {});
    },
    //商品减少
    minusGoods(itemIndex, arryIndex) {
      if (!window.localStorage.getItem("Token")) {
        let CartList = JSON.parse(window.localStorage.getItem("CartList"));
        let index = CartList.findIndex(
          (item) =>
            item.GoodsId == this.goods[arryIndex].sclist[itemIndex].goodsId &&
            item.SkuId == this.goods[arryIndex].sclist[itemIndex].skuId
        );
        if (index !== -1) {
          CartList[index].Qty -= 1;
        }
        window.localStorage.setItem("CartList", JSON.stringify(CartList));
        return false;
      }

      this.goods[arryIndex].sclist[itemIndex].qty--;
      this.count();

      var data = {
        ID: this.goods[arryIndex].sclist[itemIndex].id,
        Qty: this.goods[arryIndex].sclist[itemIndex].qty,
      };
      UpdateQtyAsyncAPI(data, "get").then((res) => {});
    },
    //商品增加
    plusGoods(itemIndex, arryIndex) {
      if (!window.localStorage.getItem("Token")) {
        let CartList = JSON.parse(window.localStorage.getItem("CartList"));
        let index = CartList.findIndex(
          (item) =>
            item.GoodsId == this.goods[arryIndex].sclist[itemIndex].goodsId &&
            item.SkuId == this.goods[arryIndex].sclist[itemIndex].skuId
        );
        if (index !== -1) {
          CartList[index].Qty += 1;
        }
        console.log(CartList, index, "CartListCartList");
        window.localStorage.setItem("CartList", JSON.stringify(CartList));
        return false;
      }

      this.goods[arryIndex].sclist[itemIndex].qty++;
      this.count();
      var data = {
        ID: this.goods[arryIndex].sclist[itemIndex].id,
        Qty: this.goods[arryIndex].sclist[itemIndex].qty,
      };
      UpdateQtyAsyncAPI(data, "get").then((res) => {});
    },
    //购物车全选事件
    cartAllcheck() {
      let list = this.goods;
      if (this.shoppingCartAllChecked === true) {
        list.forEach((element) => {
          element.allChecked = false;
          element.sclist.forEach((item) => {
            item.checked = false;
          });
        });
        this.selectedData = []; //置空购物车
      } else {
        list.forEach((element) => {
          element.allChecked = true;
          element.sclist.forEach((item) => {
            if (item.actType == "TYPE_DISCOUNT" && item.actCanBuyNum == 0) {
              item.checked = false;
            } else {
              item.checked = true;
            }
          });
        });

        this.selectedData = this.goods; //购物车全部
      }
      this.count();
    },
    //商铺全选事件
    storeAllcheck(index) {
      // console.log(this.goods, "this.goods[index].allChecked");
      if (!this.goods[index].allChecked) {
        this.goods[index].allChecked = true; //改变checked
        this.goods[index].sclist.forEach((item, i) => {
          if (item.actType == "TYPE_DISCOUNT" && item.actCanBuyNum == 0) {
            this.goods[index].sclist[i].checked = false;
            console.log(11);
          } else {
            this.goods[index].sclist[i].checked = true;
            console.log(22);
          }
          // this.goods[index].sclist[i].checked = true;
        });
      } else {
        this.goods[index].allChecked = false; //改变checked
        this.goods[index].sclist.forEach((item, i) => {
          this.goods[index].sclist[i].checked = false;
        });
      } //出现数据没有及时更新的原因是因为没有指定的代码强制改变它的值

      // 以下为 店铺全选 控制 购物车全选
      var num = 0; //这是一个标识 累积有几个店铺全选的
      this.goods.forEach((item, index) => {
        if (this.goods[index].allChecked === true) {
          num++;
        }
      });
      // console.log("为true的个数:" + num);
      if (num === this.goods.length) {
        num = 0;
        this.shoppingCartAllChecked = true;
      } else {
        this.shoppingCartAllChecked = false;
      }
      //算钱
      this.count();
    },
    //商品单击事件
    goodCheck(itemIndex, arryIndex) {
      // console.log(itemIndex, "商品数组下标", arryIndex, "商铺数组下标"); //两个下标

      var num = 0;
      if (this.goods[arryIndex].sclist[itemIndex].checked === false) {
        this.goods[arryIndex].sclist[itemIndex].checked = true;
      } else {
        this.goods[arryIndex].sclist[itemIndex].checked = false;
      }

      for (var i = 0; i < this.goods[arryIndex].sclist.length; i++) {
        if (this.goods[arryIndex].sclist[i].checked === true) {
          num++;
        }
      }

      if (num === this.goods[arryIndex].sclist.length) {
        this.goods[arryIndex].allChecked = true;
      } else {
        this.goods[arryIndex].allChecked = false;
      }

      var num2 = 0; //过度的一个 count

      for (var i = 0; i < this.goods.length; i++) {
        if (this.goods[i].allChecked === true) {
          num2++;
        }
      }

      if (num2 === this.goods.length) {
        this.shoppingCartAllChecked = true;
      } else {
        this.shoppingCartAllChecked = false;
      }

      this.count();
    },
    // 计算价格
    count() {
      let totalPrice = 0; //临时总价

      let countNumber = 0; //过度的一个 count
      this.goods.forEach((store) => {
        if (store.allChecked) {
          countNumber++;
        }
        store.sclist.forEach((item) => {
          if (item.checked) {
            totalPrice += item.price * item.qty;
          }
        });
      });
      if (countNumber === this.goods.length) {
        this.shoppingCartAllChecked = true;
      } else {
        this.shoppingCartAllChecked = false;
      }
      this.totalPrice = totalPrice;
      // console.log(this.selectedData);
    },
    CartList() {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        let data = this.$route.query.ShopId
          ? { shopId: this.$route.query.ShopId }
          : "";
        GetShopCartListAPI(data, "get").then((res) => {
          // 有效商品
          this.goods = res.data.slist.map((item) => {
            return {
              id: item.id,
              shopType: item.shopType,
              shopName: item.shopName,
              coupons: item.coupons,
              allChecked: false,
              sclist: item.sclist.map((itemA) => {
                return Object.assign({}, itemA, {
                  endTime: 0,
                });
              }),
            };
          });

          // 失效商品
          this.overdueGoods = res.data.slistNo;
          this.loadingshow = false;

          // console.log(this.goods,"有效商品有效商品有效商品有效商品有效商品有效商品");
          this.goods.forEach((item) => {
            item.sclist.forEach((itemA) => {
              if (itemA.actType == "TYPE_DISCOUNT") {
                console.log(itemA);
                var obj = new Date();
                var eTime = new Date(
                  itemA.actEndTime.replace(new RegExp("-", "gm"), "/")
                );
                itemA.endTime = eTime - obj;
                console.log(itemA.endTime, "itemA.endTime");
                console.log(itemA.actCanBuyNum, "itemA.actCanBuyNum");
              }
            });
          });
          console.log(
            this.goods,
            "有效商品有效商品有效商品有效商品有效商品有效商品222222222222"
          );
        });
      } else {
        console.log(window.localStorage.getItem("CartList"));
        if (window.localStorage.getItem("CartList")) {
          var plist = qs.stringify({
            dataCart: window.localStorage.getItem("CartList"),
          });
          GetListALLNouserAPI(plist, "post", true)
            .then((res) => {
              this.goods = res.data.slist;
              this.overdueGoods = res.data.slistNo;
              this.loadingshow = false;
            })
            .catch((err) => {});
        } else {
          this.loadingshow = false;
        }
      }
    },
    DelCart() {
      if (!window.localStorage.getItem("Token")) {
        let CartList = JSON.parse(window.localStorage.getItem("CartList"));
        console.log(this.goods, "this.goods");
        this.goods.forEach((item) => {
          let arr = item.sclist.map((item) => {
            return item.checked;
          });
          for (let index = 0; index < arr.length; index++) {
            if (item.sclist.findIndex((v) => v.checked) != -1) {
              item.sclist.splice(
                item.sclist.findIndex((v) => v.checked),
                1
              );
            }
          }
        });

        let restArray = [];
        this.goods.forEach((store) => {
          store.sclist.forEach((item) => {
            console.log(item, "item");
            if (!item.checked) {
              restArray.push({
                GoodsId: item.goodsId,
                SkuId: item.skuId,
                Qty: item.qty,
              });
            }
          });
        });
        console.log(this.goods, "restArray");
        let overIds = [];
        this.overdueGoods.forEach((store) => {
          store.sclist.forEach((val) => {
            overIds.push({
              GoodsId: val.goodsId,
              SkuId: val.skuId,
              Qty: val.qty,
            });
          });
        });

        window.localStorage.setItem(
          "CartList",
          JSON.stringify([...restArray, ...overIds])
        );
        this.$store.dispatch(
          "setCartNumber",
          [...restArray, ...overIds].length
        );
        this.CartList();
        this.GetUserCartCountData();
        return false;
      }
      //删除购物车商品
      var idsAr = new Array();
      this.goods.forEach((store) => {
        store.sclist.forEach((item) => {
          if (item.checked) {
            idsAr.push(item.id);
          }
        });
      });

      console.log(idsAr, "idsAr");

      var data = qs.stringify({
        IDs: idsAr.join(","),
      });
      DeleteCartByIDsAsyncAPI(data, "post", 1).then((res) => {
        this.CartList();
        this.GetUserCartCountData();
      });
    },
    // // 获取购物车的数量
    // GetUserCartCountData() {
    //   GetUserCartCountAPI("get").then((res) => {
    //     console.log(res, "数量");
    //     this.$store.dispatch("setCartNumber", res.data.slist);
    //   });
    // },
    // 获取购物车的数量
    GetUserCartCountData() {
      let Token = window.localStorage.getItem("Token");
      console.log(window.localStorage.getItem("CartList"), "1111");
      if (window.localStorage.getItem("CartList")) {
        var CartList = JSON.parse(window.localStorage.getItem("CartList"));
      } else {
        var CartList = [];
      }
      if (Token) {
        GetUserCartCountAPI("get").then((res) => {
          this.$store.dispatch("setCartNumber", res.data.slist);
        });
      } else {
        if (CartList.length == 0) {
          this.$store.dispatch("setCartNumber", 0);
        } else {
          this.$store.dispatch("setCartNumber", CartList.length);
        }
      }
    },
    deleteInvaGood() {
      //未登录状态
      if (!window.localStorage.getItem("Token")) {
        console.log("shanchu");
        this.goods.forEach((item) => {
          let arr = item.sclist.map((item) => {
            return item.checked;
          });
          for (let index = 0; index < arr.length; index++) {
            if (item.sclist.findIndex((v) => v.checked) != -1) {
              item.sclist.splice(
                item.sclist.findIndex((v) => v.checked),
                1
              );
            }
          }
        });
      }
    },
    DelCartdisabled() {
      //自定义删除方法
      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      //自定义删除方法

      if (!window.localStorage.getItem("Token")) {
        let storArr = [];
        let storageList = JSON.parse(window.localStorage.getItem("CartList"));
        this.overdueGoods.forEach((store) => {
          store.sclist.forEach((good) => {
            storageList.forEach((val) => {
              if (val.GoodsId == good.goodsId) {
                storageList.remove(val);
                // console.log(storageList, "storageList");
                window.localStorage.setItem(
                  "CartList",
                  JSON.stringify(storageList)
                );
              }
            });
          });
        });
        this.CartList();
        console.log(storArr, "storArr");
        this.GetUserCartCountData();
        return false;
      }
      console.log(12222);
      //清空失效商品
      var idsAr = new Array();
      this.overdueGoods.forEach((store) => {
        store.sclist.forEach((item) => {
          if (!item.iSeffective) {
            idsAr.push(item.id);
          }
        });
      });
      if (idsAr.length <= 0) {
        return;
      }
      var data = qs.stringify({
        IDs: idsAr.join(","),
      });
      DeleteCartByIDsAsyncAPI(data, "post", 1).then((res) => {
        this.CartList();
        this.GetUserCartCountData();
      });
    },
    //获取默认地址
    GetDefaultAdd() {
      if (!window.localStorage.getItem("Token")) {
        return false;
      }
      GetDefaultUserAddressAPI("get").then((res) => {
        console.log(res, "获取默认地址");
        let applyGood = {
          consignee: res.data.consignee,
          consigneeMobile: res.data.consigneeMobile,
          province: res.data.province,
          city: res.data.city,
          userArea: res.data.userArea,
          consigneeAddress: res.data.consigneeAddress,
          id: res.data.id,
          provinceNo: res.data.provinceNo,
        };
        window.localStorage.setItem("applyParams", JSON.stringify(applyGood));
      });
    },
  },
  mounted() {
    document.title = this.titledata;
    this.CartList();
    this.GetDefaultAdd();
  },
};
</script>

<style lang="less" scoped>
.pb-16vw {
  padding-bottom: 180px;
}
.storeImg {
  margin-right: 18px;
  width: 32px;
  height: 32px;
}
.cardHead {
  font-size: 28px;
}
.invalidNumber {
  font-size: 28px;
  color: rgba(0, 10, 38, 1);
}
.ClearAllInvail {
  margin-left: 45px;
  font-size: 28px;
  color: rgba(244, 38, 54, 1);
}
.iseffectClass {
  font-size: 20px;
  color: rgba(74, 80, 96, 1);
  padding: 4px 6px;
  background: rgba(245, 246, 247, 1);
  border-radius: 16px;
}
.op5 {
  opacity: 0.5;
}
.shoppingCart {
  min-height: 100vh;
  width: 100%;
  background-color: @base-color;

  .pageHeader {
    box-sizing: border-box;
    position: fixed;
    z-index: 999;
    top: 0;
    width: 100%;
    background-color: #fff;
    // padding: 28px 44px;
    padding: 0 44px;
    height: 99px;
    font-size: 28px;
    font-family: PingFang SC;
    // font-weight: 400;
    color: @text-colorA;
    display: flex;
    align-items: center;
  }
  .cartList {
    // margin-top: 99px;
    padding-top: 99px;
    padding-bottom: 240px;
    .storeList {
      padding-top: 10px;
    }
    .goodCard {
      box-sizing: border-box;
      width: 710px;
      margin: auto;
      padding: 33px 32px 40px 23px;
      background-color: #fff;
      border-radius: 16px;
      box-shadow: 0px 1px 11px 0px rgba(44, 49, 140, 0.1);
      .cardContent {
        .cardContent_left {
          display: flex;
          align-items: center;
        }
        margin-top: 34px;
        .itemImg {
          width: 170px;
          height: 170px;
          border-radius: 16px;
        }
        .information {
          flex: 1;
          margin-left: 24px;
          width: 50%;
          .title {
            line-height: 32px;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            font-size: 28px;
            // font-family: PingFang SC;
            // font-weight: 400;
            color: rgba(0, 10, 38, 1);
          }
          .sx {
            font-size: 24px;
          }
          .p1 {
            background-color: #f5f6f7;
            padding: 7px 11px;
            margin-top: 16px;
            font-size: 20px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(125, 130, 143, 1);
            width: fit-content;
          }
        }
      }
      .unitPrice {
        padding: 30px 0 0 0;
        .price_text {
          font-size: 28px;
          font-weight: 500;
          color: @main-color;
          line-height: 40px;
          padding-left: 9vw;
        }
        /deep/ .van-stepper__minus,
        /deep/ .van-stepper__plus {
          border: 1px solid rgba(177, 182, 195, 1);
          background-color: rgba(255, 255, 255, 1) !important;
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }
        /deep/.van-stepper__input {
          width: 69px;
          background-color: #fff;
          font-size: 32px;
          font-weight: 400;
          color: @text-colorA;
          height: auto;
        }
      }
      .unitPriceTow {
        padding: 30px 0 0 0;
        font-size: 24px;
        color: #f42636;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
  //没有商品的购物车样式
  .nohaveshop {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 380px;
    .van-icon {
      font-size: 340px;
      color: #666;
    }
    p {
      font-size: 14px;
      color: #999;
    }
    .p1 {
      margin-top: 20px;
    }
  }
  .submitBAR {
    box-sizing: border-box;
    width: 100%;
    padding: 12px 20px 12px 43px;
    background-color: #ffff;
    height: 88px;
    position: fixed;
    bottom: 120px;
    .btn {
      border: 0;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      width: 178px;
      height: 66px;
      background: @button-mainbackground;
      border-radius: 33px;
    }
    .btn:active {
      background: @button-mainbackground-on;
    }
    .deleteState {
      span {
        margin-right: 26px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        color: @text-colorB;
      }
      .delete_btn {
        background-color: #ffff;
        width: 140px;
        height: 52px;
        border: 2px solid rgba(255, 137, 73, 1);
        border-radius: 26px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 137, 73, 1);
      }
    }
  }
  .buyprice {
    margin-right: 24px;
    .p1 {
      color: @text-colorB;
      font: 20px;
    }
    .p2 {
      color: @main-color;
      font: 32px;
    }
  }
  .van-submit-bar__button--danger {
    background: @button-mainbackground;
  }
  .van-submit-bar__button--danger :active {
    background: @button-mainbackground-on;
  }
}
.shoppingCartkong {
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
      .b1 {
        width: 188px;
        height: 70px;
        background: @button-auxiliarybackground;
        border-radius: 35px;
        color: @text-white;
        border: none;
        font-size: 32px;
        margin-top: 76px;
      }
    }
  }
}
</style>