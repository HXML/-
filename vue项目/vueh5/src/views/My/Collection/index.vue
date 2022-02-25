<template>
 <div style="width:100%;height:100%;">

  <div class="Collection">
    <!-- 头部列表 -->
    <div class="title">
      <ul>
        <li v-for="(item,index) in titledata" :key="index">
          <span
            class="name"
            :class="{active: activeName == index}"
            @click="selected(index)"
          >{{item}}</span>
          <span class="xhx" @click="selected(index)" :class="{active1: activeName == index}"></span>
        </li>
      </ul>
    </div>
    <!-- 内容 -->
    <!-- 商品内容 -->

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      v-show="contentshow"
      v-if="contentdata.length!=0"
    >
      <div class="content">
        <div class="c_box" v-for="(item,index) in contentdata" :key="index">
          <van-swipe-cell>
            <div class="c_item" @click="baguette(item.busId)">
              <div class="c_left">
                <img :src="item.imageUrl" alt />
              </div>
              <div class="c_right">
                <p>{{item.goodsName}}</p>
                <span class="s1">{{item.fvaNum}}人收藏</span>
                <span class="s2">
                  <i>￥</i>
                  {{item.price}}
                </span>
              </div>
            </div>
            <template #right>
              <div @click="baguette(item.busId)">
                <img src="@/assets/images/mini_Collect_icon1@2x.png" alt />
                <span>进店</span>
              </div>
              <div @click="CancelCollection(item.id,index,item.favType)">
                <img src="@/assets/images/mini_Collect_icon2@2x.png" alt />
                <span>删除</span>
              </div>
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </van-list>

    <div class="kong" v-if="contentdata.length==0&&contentshow">
        <div class="kong_box">
          <img src="@/assets/images/kong/kong_icon3@2x.png" alt />
          <p class="p2">没有收藏的商品</p>
        </div>
    </div>




    <!-- 店铺内容 -->
    <van-list
      v-model="loadingTow"
      :finished="finishedTow"
      finished-text="没有更多了"
      @load="onLoadTow"
      :immediate-check="false"
      v-show="!contentshow"
      v-if="contentdata1.length!=0"
    >
      <div class="content1">
        <div class="c1_box" v-for="(item,index) in contentdata1" :key="index">
          <van-swipe-cell>
            <div class="c_item" @click="IntoStore(item.busId,item.shopType)">
              <div class="c_left">
                <img :src="item.imageUrl+'?x-oss-process=style/b1'" alt />
              </div>
              <div class="c_right">
                <span class="s1">{{item.shopName}}</span>
                <span class="s2">{{item.shopTypeName}}</span>
              </div>
            </div>
            <template #right>
              <div @click="CancelCollection(item.id,index,item.favType)">
                <img src="@/assets/images/mini_Collect_icon3@2x.png" alt />
                <span>取消收藏</span>
              </div>
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </van-list>


    <div class="kong" v-if="contentdata1.length==0&&!contentshow">
        <div class="kong_box">
          <img src="@/assets/images/kong/kong_icon3@2x.png" alt />
          <p class="p2">没有收藏的店铺</p>
        </div>
    </div>





  </div>
   <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import Vue from "vue";
import loading from "@/components/loading";

import {
  CollectionShopAPI,
  CollectionGoodsAPI,
  DeleteCollectionAPI,
} from "@/api/MyApi";

import { SwipeCell } from "vant";
Vue.use(SwipeCell);

import { Cell, CellGroup } from "vant";
Vue.use(Cell);
Vue.use(CellGroup);

// 下拉处理
import { List } from "vant";

export default {
  name: "Collection",
  data() {
    return {
      titledata: ["商品", "店铺"],
      activeName: 0, //切换商品店铺
      contentshow: true, //商品店铺显示隐藏
      contentdata: [], //商品的列表循环体
      contentdata1: [], //店铺的列表循环体

      loading: false,
      finished: false,
      total: 0, //商品的总数量
      selecteObjOne: {
        pIdx: 0, //商品页面的初始化的index
        psize: 5,
      },

      loadingTow: false,
      finishedTow: false,
      totalTow: 0, //店铺的总数量
      selecteObjTow: {
        pIdx: 0, //商品页面的初始化的index
        psize: 15,
      },

      loadingshow: true
    };
  },
  components: {
    [List.name]: List,
    loading: loading
  },
  methods: {
    selected: function (index) {
      this.loadingshow = true;
      // console.log(index);
      // debugger;
      this.activeName = index;

      this.selecteObjTow.pIdx = 0;
      this.loadingTow = false;
      this.finishedTow = false;
      this.contentdata1 = [];

      this.selecteObjOne.pIdx = 0;
      this.loading = false;
      this.finished = false;
      this.contentdata = [];

      if (index == 0) {
        this.CollectionGoods();

        this.contentshow = true;
      } else if (index == 1) {
        this.contentshow = false;
        this.CollectionShop();
      }
    },
    // 收藏的商品
    CollectionGoods() {
      this.selecteObjOne.pIdx++;
      CollectionGoodsAPI(this.selecteObjOne, "get")
        .then((res) => {

          console.log(res, "收藏的商品");
          res.rows.forEach((i) => {
            i.imageUrl = i.imageUrl
              ? i.imageUrl + "?x-oss-process=style/n4"
              : "";
          });

          this.total = res.total;
          this.contentdata.push(...res.rows);
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.contentdata.length === this.total) {
            this.finished = true;
          }
        });
    },
    //收藏的店铺
    CollectionShop() {
      this.selecteObjTow.pIdx++;
      CollectionShopAPI(this.selecteObjTow, "get")
        .then((res) => {
          console.log(res);
          this.totalTow = res.total;
          this.contentdata1.push(...res.rows);
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loadingTow = false;
          if (this.contentdata1.length === this.totalTow) {
            this.finishedTow = true;
          }
        });
    },
    // 点击取消收藏 删除收藏的店铺
    CancelCollection(id, indexin, favTypenum) {
      DeleteCollectionAPI(id, "delete")
        .then((res) => {})
        .then((res) => {
          if (favTypenum == 1) {
            this.contentdata.splice(indexin, 1);
          } else {
            this.contentdata1.splice(indexin, 1);
          }
        });
    },
    //进入商品详情
    baguette(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    //进去店铺
    IntoStore(shopid,shopType) {

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

      // this.$router.push({path: "/GoodsDetails/Store",query:{ShopId:shopid}});
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.CollectionGoods();
    },
    onLoadTow() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.CollectionShop();
    },
  },
  mounted() {
    document.title = '我的收藏';
    this.selected(0);
  },
};
</script>

<style lang="less" scoped>
.Collection {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .title {
    width: 100%;
    height: 82px;
    position: fixed;
    top: 0;
    z-index: 100;
    background: #f5f6f7;
    ul {
      padding: 0 0 0 38px;
      display: flex;
      align-items: center;
      height: 100%;
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 60px;
        .name {
          font-size: 28px;
          color: @text-colorB;
        }
        .xhx {
          width: 36px;
          height: 2px;
          background: @base-color;
          // background: @button-mainbackground;
          margin-top: 8px;
        }
        .active {
          color: @main-color;
          pointer-events: none;
        }
        .active1 {
          background: @button-mainbackground;
        }
      }
      li:nth-child(1) {
        padding-left: 0px;
      }
    }
  }
  /deep/ .van-list__finished-text {
    font-size: 26px;
    line-height: 100px;
    text-align: center;
  }
  /deep/ .van-list__loading {
    font-size: 26px;
    line-height: 100px;
    text-align: center;
  }
  .content {
    width: 100%;
    background: @text-white;
    padding-top: 82px;
    .c_box {
      width: 100%;
      margin-top: 16px;
    }
    .c_box:nth-child(1) {
      margin-top: 0;
    }
    .c_item {
      width: 100%;
      background: @text-white;
      height: 240px;
      display: flex;
      .c_left {
        width: 240px;
        height: 240px;
        border-radius: 16px;
        margin-left: 20px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .c_right {
        flex: 1;
        padding: 0 47px 0 26px;
        display: flex;
        flex-direction: column;
        p {
          font-size: 28px;
          color: @text-colorA;
          margin-top: 16px;
          line-height: 36px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .s1 {
          font-size: 20px;
          color: @text-colorD;
          padding: 15px 0;
        }
        .s2 {
          font-size: 30px;
          color: @main-color;
          i {
            font-style: normal;
            font-size: 20px;
          }
        }
      }
    }
    /deep/ .van-swipe-cell__right {
      display: flex;
      div {
        width: 134px;
        height: 240px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          width: 32px;
          height: 32px;
          opacity: @opacityeight;
        }
        span {
          color: @text-white;
          font-size: 24px;
          padding-top: 12px;
        }
      }
      div:nth-child(1) {
        background: @button-auxiliarybackground;
      }
      div:nth-child(2) {
        background: @button-mainbackground;
      }
    }
  }
  .content1 {
    width: 100%;
    background: @text-white;
    padding-top: 82px;
    .c1_box {
      width: 100%;
      .c_item {
        width: 100%;
        background: @text-white;
        height: 145px;
        display: flex;
        align-items: center;
        // border-bottom: 1px solid #fff;
        .c_left {
          width: 104px;
          height: 104px;
          border-radius: 50%;
          margin-left: 20px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .c_right {
          flex: 1;
          padding: 0 47px 0 26px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          height: 100%;
          justify-content: center;
          border-bottom: 1px solid @base-color;
          .s1 {
            font-size: 28px;
            color: @text-colorA;
            padding-bottom: 10px;
          }
          .s2 {
            background: @button-mainbackground;
            color: @text-white;
            font-size: 20px;
            padding: 4px 8px;
            border-radius: 4px;
          }
        }
      }
      /deep/ .van-swipe-cell__right {
        display: flex;
        div {
          width: 16.534vw;
          height: 145px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid @base-color;
          img {
            width: 32px;
            height: 32px;
            opacity: @opacityeight;
          }
          span {
            color: @text-white;
            font-size: 24px;
            padding-top: 12px;
          }
        }
        div:nth-child(1) {
          background: @button-mainbackground;
        }
      }
    }
  }
}
</style>