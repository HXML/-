<template>
  <div class="storeclass">
    <div class="store_titlebox">
      <div class="topimg">
        <img :src="shopTmplateData.bkImgUrl+'?x-oss-process=style/n4'" alt />
      </div>
      <div class="title">
        <div class="top">
          <div class="d1">
            <img :src="storetitledata.logoImg+'?x-oss-process=style/n4'" alt />
            <!-- <img :src="storetitledata.logoImg+'?x-oss-process=style/n4'" alt /> -->
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

    <div class="content">
      <div class="left">
        <ul>
          <li
            v-for="(item,index) in LeftList"
            :key="index"
            @click="clickLeftList(index)"
            :class="{active: activeName == index}"
          >
            <span>{{item.categoryName}}</span>
          </li>
        </ul>
      </div>
      <div class="right">
        <ul>
          <li
            v-for="(item,index) in RightList"
            :key="index"
            @click="jumpStoreProdList(item.id)"
          >{{item.categoryName}}</li>
        </ul>
      </div>
    </div>

    <tabbar ref="tab"></tabbar>
  </div>
</template>


<script>
import tabbar from "@/components/tabbar";

import {
  GetShopInfoAPI,
  GetBusGoodsShopCategorylistAPI,
  GetBusShopConfigAPI
} from "@/api/store";
import { CollectionAddAPI, DeleteByShopIdAPI } from "@/api/MyApi";

//Toast提示
import { Toast } from "vant";

export default {
  name: "storeclass",
  data() {
    return {
      activeName: 0, //左边列表定义的高亮值
      collectionshow: true,
      collectiontext: "收藏",
      storetitledata: {}, //店铺头部的数据
      LeftList: [],
      RightList: [],
      shopTmplateData: {}
    };
  },
  components: {
    tabbar: tabbar
  },
  methods: {
    // 左边列表的高亮
    clickLeftList(index) {
      this.activeName = index;
      for (const key in this.LeftList) {
        if (key == index) {
          this.GetBusGoodsShopCategoryListTow(this.LeftList[key].id);
        }
      }
    },
    //跳转去店铺列表
    jumpStoreProdList(ID) {
      this.$router.push({
        path: "/GoodsDetails/StoreProdList",
        query: { ID: ID }
      });
    },
    //获取一级分类
    GetBusGoodsShopCategoryListOne() {
      let data = {
        CategoryLevel: 1,
        PId: 0,
        ShopID: localStorage.getItem("ShopId")
      };
      GetBusGoodsShopCategorylistAPI(data, "get").then(res => {
        console.log(res, "获取一级分类");

        this.LeftPId = res.data[0].id;
        this.GetBusGoodsShopCategoryListTow(this.LeftPId);

        let arr = res.data.map(item => {
          return {
            id: item.id,
            categoryName:
              item.categoryName.length > 4
                ? item.categoryName.substring(0, 4) + "..."
                : item.categoryName
          };
        });
        this.LeftList = arr;

        //  for(var i=0;i<res.data.length;i++){
        //       if(res.data[i].categoryName.length>4){
        //         res.data[i].categoryName=res.data[i].categoryName.substr(0,4)+'...'
        //       }
        //  }
      });
    },
    GetBusGoodsShopCategoryListTow(id) {
      let data = {
        CategoryLevel: 2,
        PId: id,
        ShopID: localStorage.getItem("ShopId")
      };
      GetBusGoodsShopCategorylistAPI(data, "get").then(res => {
        console.log(res, "获取二级分类");
        this.RightList = res.data;
      });
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

        this.$refs.tab.tabbars[0].normal =
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
    this.$refs.tab.active = 2; //父组件通过$refs获取子组件的值
    this.GetShopInfoData();
    this.GetBusGoodsShopCategoryListOne();
    this.GetBusShopConfigData();
  }
};
</script>

<style lang="less" scoped>
.storeclass {
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
      background-image: linear-gradient(
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.9),
        rgba(8, 22, 59, 0.8),
        rgba(255, 255, 255, 0.1)
      );
      z-index: 10;
      position: fixed;
      top: 0;
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
  .content {
    width: 100%;
    height: 100%;
    z-index: 99;
    border-radius: 16px 16px 0 0;
    background: @base-color;
    position: fixed;
    top: 300px;
    margin-top: -36px;
    display: flex;
    .left {
      width: 20%;
      height: 100%;
      background: #fff;
      border-radius: 16px 0 0 0;
      ul {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        padding-bottom: 374px;
        border-radius: 16px 0 0 0;
        li {
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: @text-colorB;
        }
        .active {
          color: @main-color;
          background: @base-color;
        }
      }
    }
    .right {
      width: 80%;
      height: 100%;

      overflow-y: auto;
      box-sizing: border-box;

      padding-right: 24px;
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 374px;
        li {
          background: @text-white;
          border-radius: 8px;
          padding: 12px 16px;
          margin-top: 32px;
          margin-left: 24px;
        }
      }
    }
  }
}
</style>