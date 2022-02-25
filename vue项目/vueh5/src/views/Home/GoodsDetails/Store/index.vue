<template>
  <div class="store">
    <backToHome v-if="storetitledata.isCanBackPlatfom==1" />
    <div class="store_titlebox">
      <div class="topimg">
        <img :src="shopTmplateData.bkImgUrl+'?x-oss-process=style/n4'" alt />
      </div>
      <div class="title">
        <div class="top">
          <div class="d1">
            <img :src="storetitledata.logoImg+'?x-oss-process=style/n4'" alt />
            <div>
              <span>{{storetitledata.shopName}}</span>
              <span>{{storetitledata.shopTypeStr}}</span>
            </div>
          </div>
          <div @click="collection(storetitledata.id)" :class="collectionshow?'d2':'collection d2'">
            <img src="@/assets/images/home_shopping_tab_icon2@2x.png" v-show="collectionshow" alt />
            <span>{{collectiontext}}</span>
          </div>
        </div>
        <div class="bottom">
          <div class="title_left">
            <div v-for="(item,index) in storetopd" :key="index">
              <span :class="{spanactive: activeName == index}" @click="selected(index)">{{item}}</span>
            </div>
          </div>
          <div class="title_right">
            <p @click="jumpStoreSearch()">
              <img src="@/assets/images/dp/ss@2x.png" alt />
              <span>搜商品</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="content" v-show="contentshow">
      <div class="coupons" v-if="storeCoupons!=''">
        <div class="coupons_box">
          <div class="left">
            <p>¥{{storeCoupons.faceValue}}</p>
            <p>
              <span>
                <i v-show="storeCoupons.couponsType==2">无门槛优惠券</i>
                <i v-show="storeCoupons.couponsType==1">满{{storeCoupons.quotaLimit}}可用</i>
              </span>
            </p>
          </div>
          <div class="right">
            <span @click="CollectCoupons(storeCoupons.id)">{{storeCoupons.receive}}</span>
          </div>
        </div>
      </div>

      <div class="HomeTemplate">
        <TemplateOne ref="myTemplateTow" v-if="shopTmplateData.homeTmplate==1"></TemplateOne>
        <TemplateTow ref="myTemplateTow" v-if="shopTmplateData.homeTmplate==2"></TemplateTow>
      </div>
    </div>

    <div class="content2" v-show="!contentshow">
      <van-sticky>
        <div class="top">
          <div class="d1">
            <ul>
              <li
                @click="comprehensive(index)"
                :class="{divactive: divactive == index}"
                v-for="(item,index) in titleList"
                :key="index"
              >
                <span>{{item}}</span>
                <img src="@/assets/images/home/ss_icon3@2x.png" alt v-show="index==1||index==2" />
              </li>
            </ul>
          </div>
          <div class="d2">
            <img :src="Switchimg" alt @click="SwitchCss()" />
          </div>
        </div>
      </van-sticky>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div :class="listactive?'bottom1':'bottom2'">
          <div
            v-for="(item,index) in listData"
            :key="index"
            :class="listactive?'bottom_item1':'bottom_item2'"
            @click="jumpGoodsDetails(item.id)"
          >
            <div class="left">
              <img :src="item.mainImg+'?x-oss-process=style/n4'" alt />
            </div>
            <div class="right">
              <p class="name">{{item.goodsName}}</p>
              <p class="price">
                <span>¥{{item.price}}</span>
                <span>{{item.buyNum}}人付款</span>
              </p>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <tabbar ref="tab" :shopID="storetitledata.id"></tabbar>
  </div>
</template>


<script>
import tabbar from "@/components/tabbar";
import TemplateOne from "@/components/store/TemplateOne";
import TemplateTow from "@/components/store/TemplateTow";

import { Sticky } from "vant";

import {
  GetShopInfoAPI,
  GetBusShopConfigAPI,
  FactShopInUserAddAPI
} from "@/api/store";
import {
  CollectionAddAPI,
  DeleteByShopIdAPI,
  getbusgoodslistAPI,
} from "@/api/MyApi";

import { GetShopCouponsModelAPI, CollectCouponsAPI } from "@/api/coupons";
import backToHome from "@/components/backToHome";
//Toast提示
import { Toast } from "vant";
// 下拉处理
import { List } from "vant";
import qs from "qs";

export default {
  name: "store",
  data() {
    return {
      storetopd: ["推荐", "全部", "新品"],
      activeName: 0,
      contentshow: true,
      Switchimg: require("@/assets/images/home/ss_icon1@2x.png"), //切换按钮的默认图片
      listactive: true, //控制下面列表的样式变量
      titleList: ["默认", "销量", "价格"],
      divactive: 0, //titleList的高亮变量
      collectionshow: true,
      collectiontext: "收藏",
      storetitledata: {}, //店铺头部的数据
      listData: [], //商品列表
      selectedObj: {
        IsRecommend: 0,
        pIdx: 0,
        pSize: 7,
        IsNew: 0, //是否新品
        shopId: "", //店铺id
        shopcategoryId: "", //店铺类别id
        categoryId: "", //商品类别id
        keyword: "", //关键字搜索
        orderbyID: 0, //排序 0为ID排序 销量倒序 1.2 价格排序3和4
        cityNo: "", //城市num
        proviceNo: "", //省num
      },
      loading: false,
      finished: false,
      total: 0, //商品列表商品的总数量
      sales: true, //判断销量的第一次点击和第二次点击
      price: true, //判断价格的第一次点击和第二次点击
      shopTmplateData: {},
      storeCoupons: {
        //优惠券
      },
    };
  },
  components: {
    tabbar: tabbar,
    TemplateOne: TemplateOne,
    TemplateTow: TemplateTow,
    [Sticky.name]: Sticky,
    [List.name]: List,
    backToHome: backToHome,
  },
  methods: {
    selected: function (index) {
      this.activeName = index;
      if (index == 0) {
        this.contentshow = true;
        this.$refs.myTemplateTow.GetbusgoodsByShoplist();

        this.selectedObj.IsRecommend = 1;
        this.selectedObj.pIdx = 0;
        this.listData = [];
        this.loading = true;
        this.finished = false;
      } else if (index == 1) {
        this.contentshow = false;
        this.selectedObj.IsNew = 0;
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();

        this.$refs.myTemplateTow.shoplist.pIdx = 0;
        this.$refs.myTemplateTow.TemplateTowList = [];
        this.$refs.myTemplateTow.loadingTow = true;
        this.$refs.myTemplateTow.finishedTow = false;
      } else if (index == 2) {
        this.contentshow = false;
        this.selectedObj.IsNew = 1;
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];

        this.getbusgoodslistData();

        this.$refs.myTemplateTow.shoplist.pIdx = 0;
        this.$refs.myTemplateTow.TemplateTowList = [];
        this.$refs.myTemplateTow.loadingTow = true;
        this.$refs.myTemplateTow.finishedTow = false;
      }
    },
    //点击上面的切换样式
    SwitchCss() {
      if (this.Switchimg == require("@/assets/images/home/ss_icon1@2x.png")) {
        this.Switchimg = require("@/assets/images/home/ss_icon2@2x.png");
        this.listactive = false;
      } else {
        this.Switchimg = require("@/assets/images/home/ss_icon1@2x.png");
        this.listactive = true;
      }
    },
    // 点击 默认 销量 价格
    comprehensive(index) {
      // console.log(index)
      this.divactive = index;
      if (index === 0) {
        this.selectedObj.orderbyID = index;
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();
      } else if (index === 1) {
        if (this.sales) {
          this.selectedObj.orderbyID = 1;
          this.sales = false;
        } else {
          this.selectedObj.orderbyID = 2;
          this.sales = true;
        }
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();
      } else if (index === 2) {
        if (this.price) {
          this.selectedObj.orderbyID = 3;
          this.price = false;
        } else {
          this.selectedObj.orderbyID = 4;
          this.price = true;
        }
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();
      }
    },
    //点击收藏
    collection(shopId) {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        if (this.collectionshow) {
          this.collectiontext = "已收藏";
          this.collectionshow = false;
          this.CollectionAddData(shopId, 2);
          // Toast("亲，您已经收藏该店铺");
        } else {
          this.collectiontext = "收藏";
          this.collectionshow = true;
          this.CancelCollection(shopId);
          // Toast("亲，您已经取消关注该店铺");
        }
      } else {
        this.$router.push({
          path: "/My/Login/LoginRegistered",
        });
      }
    },
    //点击商品去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    //跳转到店铺搜索
    jumpStoreSearch() {
      this.$router.push({ path: "/GoodsDetails/StoreSearch" });
    },
    //根据店铺的id去拿到店铺的数据
    GetShopInfoData() {
      var ShopId = this.$route.query.ShopId;
      let data = {
        ShopId: ShopId,
      };
      GetShopInfoAPI(data, "get").then((res) => {
        // console.log(res, "获取店铺的数据");
        this.storetitledata = res.data;

        this.$refs.tab.tabbars[0].active =
          res.data.logoImg + "?x-oss-process=style/n4";

        // 店铺是否收藏
        if (this.storetitledata.isFav == true) {
          this.collectiontext = "已收藏";
          this.collectionshow = false;
        } else {
          this.collectiontext = "收藏";
          this.collectionshow = true;
        }
      });
    },
    // 收藏店铺
    CollectionAddData(id, FavType) {
      let data = {
        Id: id,
        FavType: FavType,
      };
      CollectionAddAPI(data, "post").then((res) => {
        console.log(res, "添加收藏记录");
      });
    },
    // 删除收藏的店铺
    CancelCollection(id) {
      DeleteByShopIdAPI(id, "delete").then((res) => {});
    },
    //获取商品列表
    getbusgoodslistData() {
      this.selectedObj.pIdx++;
      getbusgoodslistAPI(this.selectedObj, "get")
        .then((res) => {
          console.log(res);
          this.total = res.data.total;
          this.listData.push(...res.data.rows);
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          // console.log(this.listData.length, this.total);
          if (this.listData.length === this.total) {
            this.finished = true;
          }
        });
    },
    //获取店铺背景图片 模板判断
    GetBusShopConfigData() {
      let data = {
        ShopID: this.$route.query.ShopId,
      };
      GetBusShopConfigAPI(data, "get").then((res) => {
        console.log(res, "模板判断");

        this.shopTmplateData = res.data;

        if (this.shopTmplateData.homeTmplate === "TMPLATE_01") {
          this.shopTmplateData.homeTmplate = 1;
        } else if (this.shopTmplateData.homeTmplate === "TMPLATE_02") {
          this.shopTmplateData.homeTmplate = 2;
        }
        console.log(this.shopTmplateData, "this.shopTmplateData.mb");
      });
    },
    onLoad() {
      // 异步更新数据
      this.getbusgoodslistData();
    },
    // 获取店铺的一个优惠券
    GetShopCouponsOne() {
      // let data = {
      //   ShopID: localStorage.getItem("ShopId")
      // };

      // var datafro = new FormData();
      // datafro.append("ShopID", this.$route.query.ShopId);

      let data = qs.stringify({
        ShopID: this.$route.query.ShopId,
      });

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
    // 添加访客记录
    SrecordData() {
      let data={
          shopId:this.$route.query.ShopId
      }
      FactShopInUserAddAPI(data,"post").then((res) => {
        console.log("访客记录");
      });
    }
  },

  created() {
    this.GetShopInfoData();
    this.GetBusShopConfigData();
  },
  mounted() {

    if (window.localStorage.getItem("Token")) {
        this.SrecordData();
    }

    window.scrollTo(0, 0);
    this.$refs.tab.active = 0; //父组件通过$refs获取子组件的值
    this.selectedObj.shopId = this.$route.query.ShopId;
    if (this.$route.query.ShopId) {
      window.localStorage.setItem("ShopId", this.$route.query.ShopId);
    }
    this.GetShopCouponsOne();
    
  },
};
</script>

<style lang="less" scoped>
.isCanBackPlatfom {
  position: fixed;
  bottom: 200px;
  right: 40px;
  z-index: 999;
}
.store {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: @base-color;
  .store_titlebox {
    position: relative;
    .topimg {
      width: 100%;
      height: 300px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .title {
      width: 100%;
      height: 300px;
      // height: 22%;
      // background: rgba(8, 22, 59, 0.9);
      z-index: 10;
      position: absolute;
      top: 0;
      background-image: linear-gradient(
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.8),
        rgba(255, 255, 255, 0.1)
      );

      // position: fixed;
      // top: 0;
      // background-image: linear-gradient(rgba(8, 22, 59, 1), rgba(8, 22, 59, 0.4));
      // box-shadow: 0px 45px 20px rgba(8, 22, 59, 0.7);
      .top {
        padding: 32px 20px;
        display: flex;
        color: @text-white;
        .d1 {
          flex: 1;
          display: flex;
          img {
            width: 110px;
            height: 110px;
            background: rgba(255, 255, 255, 1);
            border-radius: 16px;
          }
          div {
            padding-left: 34px;
            span:nth-child(1) {
              font-size: 32px;
              font-weight: bold;
              line-height: 42px;
            }
            span:nth-child(2) {
              font-size: 20px;
              font-weight: bold;
              line-height: 42px;
              color: @auxiliary-color;
              border: 1px solid @auxiliary-color;
              margin-left: 8px;
              padding: 0 4px;
            }
          }
        }
        .d2 {
          width: 130px;
          height: 42px;
          background: linear-gradient(
            0deg,
            rgba(225, 41, 41, 1) 0%,
            rgba(242, 53, 53, 1) 100%
          );
          border-radius: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 28px;
          }
          span {
            font-size: 28px;
            font-weight: 400;
            padding-left: 8px;
          }
        }
        // 已经收藏
        .collection {
          background: #4c5671;
        }
      }
      .bottom {
        padding: 10px 0px 20px;
        display: flex;
        color: @text-white;
        .title_left {
          width: 70%;
          display: flex !important;
          align-items: center;
          div {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            span {
              font-size: 28px;
              opacity: 0.8;
              padding-bottom: 8px;
            }
            .spanactive {
              pointer-events: none;
              font-weight: bold;
              opacity: 1;
              border-bottom: 4px solid @text-white;
              padding-bottom: 8px;
            }
          }
        }
        .title_right {
          width: 30%;
          p {
            width: 168px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 1);
            border-radius: 30px;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 26px;
              height: 26px;
            }
            span {
              font-size: 24px;
              color: @text-white;
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
  // 首页
  .content {
    width: 100%;
    height: 100%;
    z-index: 99;
    // position: fixed;
    // top: 300px;
    margin-top: -36px;
    padding-bottom: 110px;
    position: relative;
    .coupons {
      padding: 0 20px;
      margin-bottom: 16px;
      .coupons_box {
        width: 100%;
        height: 127px;
        background: url("../../../../assets/images/home/quan.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        color: @text-white;
        .left {
          flex: 2.6;
          display: flex;
          flex-direction: column;
          padding-left: 24px;
          p:nth-child(1) {
            padding-top: 20px;
            font-size: 44px;
          }
          p:nth-child(2) {
            padding-top: 14px;
            font-size: 24px;
            opacity: 0.9;
            i {
              font-style: normal;
            }
          }
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .HomeTemplate {
      width: 100%;
      // padding-bottom: 120px;
    }
  }
  .content2 {
    width: 100%;
    z-index: 99;
    border-radius: 16px 16px 0 0;
    // background-image: linear-gradient(@text-white, @base-color);
    background: @text-white;
    position: relative;
    margin-top: -36px;
    .top {
      width: 100%;
      height: 100px;
      display: flex;
      position: absolute;
      background: @text-white;
      border-radius: 16px 16px 0 0;
      .d1 {
        width: 75%;
        height: 100%;
        ul {
          width: 100%;
          display: flex;
          height: 100%;
          li {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: @text-colorB;
            span {
              font-size: 28px;
            }
            img {
              width: 28px;
            }
          }
          .divactive {
            color: @main-color;
          }
        }
      }
      .d2 {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 44px;
          height: 44px;
        }
      }
    }
    /deep/ .van-list__finished-text {
      padding-bottom: 110px;
      font-size: 26px;
      line-height: 100px;
      text-align: center;
    }
    .bottom1 {
      padding: 100px 20px 0;
      overflow-y: auto;
      box-sizing: border-box;
      // padding-bottom: 264px;
      // padding-bottom: 110px;
      .bottom_item1 {
        // width: 346px;
        // height: 504px;
        // background: @text-white;
        // box-shadow: @other-shadow;
        // border-radius: 16px;
        width: 100%;
        height: 240px;
        background: @text-white;
        margin-bottom: 24px;
        display: flex;
        .left {
          width: 240px;
          height: 240px;
          border-radius: 16px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 16px;
          }
        }
        .right {
          padding-left: 28px;
          flex: 1;
          padding-top: 20px;
          .name {
            font-size: 28px;
            line-height: 38px;
            font-weight: bold;
            color: #000a26;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .price {
            display: flex;
            align-items: baseline;
            padding-top: 40px;
            span:nth-child(1) {
              font-size: 32px;
              color: @main-color;
            }
            span:nth-child(2) {
              font-size: 20px;
              color: @text-colorC;
              padding-left: 16px;
            }
          }
        }
      }
    }
    .bottom2 {
      padding: 100px 20px 0;
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      // padding-bottom: 264px;
      // padding-bottom: 374px;
      .bottom_item2 {
        width: 346px;
        height: 504px;
        background: @text-white;
        box-shadow: @other-shadow;
        border-radius: 16px;
        margin-bottom: 16px;
        .left {
          width: 100%;
          height: 346px;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          padding: 20px;
          // display: flex;
          // flex-direction: column;

          display: flex;
          flex-direction: column;
          height: 120px;
          justify-content: space-between;
          .name {
            font-size: 24px;
            line-height: 38px;
            font-weight: bold;
            color: #000a26;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .price {
            // padding-top: 24px;
            display: flex;
            align-items: baseline;
            span:nth-child(1) {
              font-size: 32px;
              color: @main-color;
            }
            span:nth-child(2) {
              font-size: 20px;
              color: @text-colorC;
              padding-left: 16px;
            }
          }
        }
      }
    }
  }
}
</style>