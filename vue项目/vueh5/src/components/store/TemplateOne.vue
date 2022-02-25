<template>
  <div class="TemplateOne">
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          v-for="(item,index) in BannerList"
          :key="index"
          @click="bannerhref(item.linkUrl)"
        >
          <img :src="item.imgStr+'?x-oss-process=style/b5'" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-list
      v-model="loadingTow"
      :finished="finishedTow"
      finished-text="没有更多了"
      @load="onLoadTow"
      :immediate-check="false"
    >
      <div class="OneContent">
        <div
          class="OneContent_item"
          v-for="(item,index) in TemplateTowList"
          :key="index"
          @click="jumpGoodsDetails(item.id)"
        >
          <div class="top">
            <img :src="item.mainImg+'?x-oss-process=style/b5'" alt />
          </div>
          <div class="bottom">
            <div class="d1">{{item.goodsName}}</div>
            <div class="d2">
              <span class="s1">
                <i>¥</i>
                {{item.price}}
              </span>
              <span class="s2">{{item.buyNum}}人付款</span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import Vue from "vue";
import { Swipe, SwipeItem } from "vant";

import { ZkShopAdAPI } from "@/api/MyApi";

import { GetbusgoodsByShoplistAPI } from "@/api/store";
// 下拉处理
import { List } from "vant";

export default {
  name: "tabbar",
  data() {
    return {
      TemplateTowList: [],
      BannerList: [],
      shoplist: {
        pIdx: 0,
        pSize: 7,
        IsRecommend: 1, //是否推荐
        IsNew: 0, //是否新品
        shopId: "", //店铺id
        shopcategoryId: "", //店铺类别id
        keyword: "", //关键字搜索
        orderbyID: 0, //排序 0为ID排序 销量倒序 1.2 价格排序3和4
      },
      loadingTow: false,
      finishedTow: false,
      totalTow: 0, //商品列表商品的总数量
    };
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [List.name]: List,
  },
  methods: {
    bannerhref(linkUrl) {
      if (linkUrl) {
        window.open(linkUrl, "_self");
      }
      //  "_blank"  新打开一个窗口
      //  "_self"    覆盖当前的窗口
    },
    //点击商品去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    // 获取首页轮播图
    ZkShopBannerData() {
      // console.log(window.localStorage.getItem("ShopId"))
      let data = {
        ShopID: this.$route.query.ShopId,
      };
      ZkShopAdAPI(data, "get").then((res) => {
        console.log(res, "获取首页轮播图");
        this.BannerList = res.data;
      });
    },
    //获取首页商品列表
    GetbusgoodsByShoplist() {
      this.shoplist.pIdx++;
      GetbusgoodsByShoplistAPI(this.shoplist, "get")
        .then((res) => {
          console.log(res, "获取首页商品列表");
          this.totalTow = res.data.total;
          this.TemplateTowList.push(...res.data.rows);
          console.log(this.TemplateTowList);
          this.$forceUpdate(); //强制刷新，解决页面不会重新渲染的问题
        })
        .then((res) => {
          // 加载状态结束
          this.loadingTow = false;
          if (this.TemplateTowList.length === this.totalTow) {
            this.finishedTow = true;
          }
        });
    },
    onLoadTow() {
      // 异步更新数据
      this.GetbusgoodsByShoplist();
    },
  },
  created() {
     this.shoplist.shopId = this.$route.query.ShopId;
    this.ZkShopBannerData();
    this.GetbusgoodsByShoplist();
  },
};
</script>


<style lang="less" scoped>
.TemplateOne {
  width: 100%;
  .banner {
    width: 100%;
    // height: 688px;
    /deep/ .my-swipe {
      width: 100%;
      height: 100%;
      .van-swipe-item {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      //下面的分页器
      .van-swipe__indicators {
        bottom: 20px;
        .van-swipe__indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .van-swipe__indicator:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
  }
  /deep/ .van-list__finished-text {
    font-size: 26px;
    line-height: 100px;
    text-align: center;
  }
  .OneContent {
    margin: 24px 0 0;
    .OneContent_item {
      width: 700px;
      // height: 860px;
      margin: auto;
      background: @text-white;
      border-radius: 16px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
      margin-bottom: 24px;
      .top {
        width: 700px;
        height: 700px;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .bottom {
        margin: 0 40px;
        padding: 24px 0;
        .d1 {
          font-size: 28px;
          font-weight: 500;
          color: @text-colorA;
          line-height: 38px;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .d2 {
          display: flex;
          align-items: baseline;
          margin-top: 24px;
          .s1 {
            flex: 1;
            font-size: 32px;
            color: @main-color;
            i {
              font-style: normal;
              font-size: 24px;
            }
          }
          .s2 {
            font-size: 20px;
            color: @text-colorC;
          }
        }
      }
    }
  }
}
</style>
