<template>
  <div class="storeall">
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
          <div class="title_right">
            <p @click="jumpStoreSearch()">
              <img src="@/assets/images/dp/ss@2x.png" alt />
              <span>搜本店商品</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="content2">
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
              <!-- <li>
              <span>销量</span>
              <img src="@/assets/images/home/ss_icon3@2x.png" alt />
            </li>
            <li>
              <span>价格</span>
              <img src="@/assets/images/home/ss_icon3@2x.png" alt />
              </li>-->
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

    <tabbar ref="tab"></tabbar>
  </div>
</template>


<script>
import tabbar from "@/components/tabbar";
import { Sticky } from "vant";

import { GetShopInfoAPI, GetBusShopConfigAPI } from "@/api/store";
import {
  CollectionAddAPI,
  DeleteByShopIdAPI,
  getbusgoodslistAPI
} from "@/api/MyApi";

// 下拉处理
import { List } from "vant";

//Toast提示
import { Toast } from "vant";

export default {
  name: "storeall",
  data() {
    return {
      Switchimg: require("@/assets/images/home/ss_icon1@2x.png"), //切换按钮的默认图片
      listactive: true, //控制下面列表的样式变量
      titleList: ["默认", "销量", "价格"],
      divactive: 0, //titleList的高亮变量
      collectionshow: true,
      collectiontext: "收藏",
      storetitledata: {}, //店铺头部的数据
      listData: [], //商品列表
      selectedObj: {
        pIdx: 0,
        pSize: 7,
        shopId: "", //店铺id
        shopcategoryId: "", //店铺类别id
        keyword: "", //关键字搜索
        orderbyID: 0, //排序 0为ID排序 销量倒序 1.2 价格排序3和4
        cityNo: "", //城市num
        proviceNo: "" //省num
      },
      loading: false,
      finished: false,
      total: 0, //商品列表商品的总数量
      sales: true, //判断销量的第一次点击和第二次点击
      price: true, //判断价格的第一次点击和第二次点击
      shopTmplateData: {}
    };
  },
  components: {
    tabbar: tabbar,
    [Sticky.name]: Sticky,
    [List.name]: List
  },
  methods: {
    //点击商品去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
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
          path: "/My/Login/LoginRegistered"
        });
      }
    },
    //跳转到店铺搜索
    jumpStoreSearch() {
      this.$router.push({ path: "/GoodsDetails/StoreSearch" });
    },
    //根据店铺的id去拿到店铺的数据
    GetShopInfoData() {
      var ShopId = localStorage.getItem("ShopId");
      let data = {
        ShopId: ShopId
      };
      GetShopInfoAPI(data, "get").then(res => {
        // console.log(res, "获取店铺的数据");
        this.storetitledata = res.data;

        this.$refs.tab.tabbars[0].normal = res.data.logoImg + "?x-oss-process=style/n4";

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
        FavType: FavType
      };
      CollectionAddAPI(data, "post").then(res => {
        console.log(res, "添加收藏记录");
      });
    },
    // 删除收藏的店铺
    CancelCollection(id) {
      DeleteByShopIdAPI(id, "delete").then(res => {});
    },
    //获取商品列表
    getbusgoodslistData() {
      this.selectedObj.pIdx++;
      getbusgoodslistAPI(this.selectedObj, "get")
        .then(res => {
          console.log(res);
          this.total = res.data.total;
          this.listData.push(...res.data.rows);
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          // console.log(this.listData.length, this.total);
          if (this.listData.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      this.getbusgoodslistData();
    },
    //获取店铺背景图片 模板判断
    GetBusShopConfigData() {
      let data = {
        ShopID: localStorage.getItem("ShopId")
      };
      GetBusShopConfigAPI(data, "get").then(res => {
        console.log(res, "模板判断");
        this.shopTmplateData = res.data;
      });
    }
  },
  mounted() {
    this.$refs.tab.active = 1; //父组件通过$refs获取子组件的值
    this.GetShopInfoData();

    this.selectedObj.shopId = localStorage.getItem("ShopId");
    this.getbusgoodslistData();
    this.GetBusShopConfigData();
  }
};
</script>

<style lang="less" scoped>
.storeall {
  width: 100%;
  height: 100%;
  background: @base-color;
  .store_titlebox {
    position: relative;
    .topimg {
      width: 100%;
      height: 300px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      width: 100%;
      height: 300px;
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
        padding: 0 40px 0;
        display: flex;
        color: @text-white;
        .title_right {
          width: 100%;
          p {
            width: 100%;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.5);
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
              color: @text-white;
              margin-left: 10px;
              font-size: 24px;
            }
          }
        }
      }
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
      height: 100%;
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