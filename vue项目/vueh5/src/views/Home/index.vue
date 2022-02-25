<template>
  <div style="width: 100%; height: 100%">
    <div class="Home">
      <!-- 头部搜索 -->
      <div :class="searchshow ? 'Home_searchhide' : 'Home_search'">
        <input
          type="text"
          :placeholder="SearchPlaceholder"
          @click="jumpSearch()"
        />
        <img src="@/assets/images/home/b2c_home_ss@2x.png" alt />
      </div>

      <!-- 轮播图 -->
      <div class="Home_banner">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item
            v-for="(item, index) in BannerList"
            :key="index"
            @click="bannerhref(item.linkUrl)"
          >
            <van-image
              lazy-load
              :src="item.imgStr + '?x-oss-process=style/b2'"
              alt
            />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- nav -->
      <div class="Home_nav">
        <ul>
          <li
            v-for="(item, index) in navdata"
            :key="index"
            @click="jumprouter(index)"
          >
            <!-- <van-image lazy-load :src="item.navimg" alt /> -->
            <img :src="item.navimg" alt />
            <span>{{ item.navtext }}</span>
          </li>
        </ul>
      </div>

      <!-- 兆客精选 -->
      <div class="Home_content1">
        <div class="content1_title">
          <p>
            <span>兆客精选</span>
            <span>千选万选 只为你选</span>
          </p>
        </div>
        <div class="content1_main">
          <div class="advert">
            <van-image
              @click="bannerhref(JXdata.linkUrl)"
              :src="JXdata.imgStr + '?x-oss-process=style/n5'"
            />

            <!-- <van-image
                  lazy-load
                  :src="JXdata.imgStr+'?x-oss-process=style/n5'"
                  class="van-image"
                  @click="bannerhref(JXdata.linkUrl)"
                >
                  <template v-slot:loading>
                    <img :src="JXdata.imgStr+'?x-oss-process=style/n5-s'" class="IMGGGGTow" />
                  </template>
                  <template v-slot:error>
                    <van-icon name="weapp-nav" />
                  </template>
            </van-image>-->
          </div>
          <div
            class="good"
            v-for="(item, index) in goodData"
            :key="index"
            @click="jumpGoodsDetails(item.id)"
          >
            <div>
              <van-image
                lazy-load
                :src="item.mainImg + '?x-oss-process=style/n4'"
                alt
              />
            </div>
            <span>￥{{ item.price }}</span>
          </div>
        </div>
      </div>

      <!-- 猜你喜欢 谁喜欢都不如“你喜欢” -->
      <div class="Home_content2" v-if="shopdata.length != 0">
        <van-sticky>
          <div class="content2_title">
            <p>
              <span>猜你喜欢</span>
              <span>谁喜欢都不如“你喜欢”</span>
            </p>
          </div>
        </van-sticky>

        <div class="content2_main">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
          >
            <ul>
              <li
                v-for="(item, index) in shopdata"
                :key="index"
                @click="jumpGoodsDetails(item.id)"
              >
                <div class="goodimg">
                  <!-- <van-image lazy-load src="item.mainImg+'?x-oss-process=style/b1'" alt /> -->
                  <van-image
                    lazy-load
                    :src="item.mainImg + '?x-oss-process=style/b1'"
                    class="van-image"
                  >
                    <template v-slot:loading>
                      <img
                        :src="item.mainImg + '?x-oss-process=style/b1-s'"
                        class="IMGGGG"
                      />
                    </template>
                    <template v-slot:error>
                      <van-icon name="photograph" />
                    </template>
                  </van-image>
                </div>
                <div class="goodtext">
                  <p class="p1">{{ item.goodsName }}</p>
                  <p class="p2">
                    <span>
                      <i>￥</i>
                      {{ item.price }}
                    </span>
                    <span>已售{{ item.buyNum }}件</span>
                  </p>
                </div>
              </li>
            </ul>
          </van-list>
        </div>
      </div>
    </div>

    <div class="skeleton" v-show="loadingskeleton">
      <van-skeleton :row="1" class="banner" />

      <van-skeleton :row="5" class="main5" />

      <van-skeleton :row="2" class="main4" />

      <van-skeleton :row="3" class="main6" />

      <van-skeleton :row="1" class="main3" row-width="100" />
      <van-skeleton :row="10" class="main7" />
    </div>
  </div>
</template>

<script>
// 轮播图
import { Swipe, SwipeItem, Lazyload } from "vant";

import { Image as VanImage } from "vant";

import { Loading, Icon } from "vant";
//吸顶
import { Sticky } from "vant";

// 下拉处理
import { List } from "vant";
import { Skeleton } from "vant";

import {
  ZkShopAdAPI,
  ZkGoodGoodsAPI,
  GetbusgoodsmodelAPI,
  getbusgoodslistAPI,
  ZkShopAdJXAPI,
} from "@/api/MyApi";

export default {
  name: "Home",
  data() {
    return {
      loadingskeleton: true,
      SearchPlaceholder: "搜索商品名称",
      shopdata: [],
      navdata: [
        {
          navimg: require("@/assets/images/home/b2c_tab_icon1@2x.png"),
          navtext: "全部商品",
        },
        {
          navimg: require("@/assets/images/home/b2c_tab_icon2@2x.png"),
          navtext: "推荐专区",
        },
        {
          navimg: require("@/assets/images/home/b2c_tab_icon3@2x.png"),
          navtext: "领券",
        },
        {
          navimg: require("@/assets/images/home/b2c_tab_icon4@2x.png"),
          navtext: "分享赚钱",
        },
        {
          navimg: require("@/assets/images/home/b2c_tab_icon5@2x.png"),
          navtext: "真伪验证",
        },
      ],
      JXdata: {
        linkUrl: "",
        imgStr: "",
      },
      goodData: {}, //兆客精选的商品
      sunmit: {},
      loading: false,
      finished: false,
      PIdx: 1, //商品页面的初始化的index
      total: 0, //商品的总数量
      BannerList: [],
      i: 0,
      searchshow: false,
    };
  },
  components: {
    [VanImage.name]: VanImage,
    [Loading.name]: Loading,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Sticky.name]: Sticky,
    [List.name]: List,
    [Icon.name]: Icon,
    [Skeleton.name]: Skeleton,
  },
  props: {
    time: {
      type: Number,
      default: 2,
    },
    value: {
      type: Number,
      default: 720000,
    },
  },
  methods: {
    bannerhref(linkUrl) {
      let isGoodDetail = linkUrl.indexOf("GoodsDetails"); //url是否存在某个字段
      let GoodId = linkUrl.replace(
        new RegExp(
          "^(?:.*[&\\?]" +
            encodeURI("ID").replace(/[\.\+\*]/g, "\\$&") +
            "(?:\\=([^&]*))?)?.*$",
          "i"
        ),
        "$1"
      );
      // console.log(GoodId, isGoodDetail !== -1, "isGoodDetail");
      if (GoodId && isGoodDetail !== -1) {
        this.$router.push({
          path: "/GoodsDetails",
          query: { ID: GoodId },
        });
      } else {
        window.open(linkUrl, "_self");
        //  "_blank"  新打开一个窗口
        //  "_self"    覆盖当前的窗口
      }
    },
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    jumpSearch() {
      this.$router.push({ path: "/Search" });
    },
    jumprouter(index) {
      switch (index) {
        case 0:
          this.$router.push({ name: "ProductList" });
          break;
        case 1:
          this.$router.push({ name: "Calssify" });
          break;
        case 2:
          this.$router.push({ name: "ReceiveCoupon" });
          break;
        case 3:
          this.$router.push({ name: "InviteFriends" });
          break;
        case 4:
          window.location.href =
            "https://ck.fw-12365.com/userQuery/model_1/index.html";
          break;
        default:
          break;
      }
    },
    // 获取首页轮播图
    ZkShopBannerData() {
      let data = {
        ShopID: 0,
      };
      ZkShopAdAPI(data, "get").then((res) => {
        this.BannerList = res.data;
      });
    },
    // 获取首页产品图
    ZkShopAdJXData() {
      let data = {
        ShopID: 0,
      };
      ZkShopAdJXAPI(data, "get").then((res) => {
        this.JXdata = res.data;
      });
    },
    // 获取首页4个商品
    ZkGoodGoodsAPIData() {
      let data = {
        PIdx: 1,
        PSize: 4,
      };
      ZkGoodGoodsAPI(data, "get").then((res) => {
        this.goodData = res.data.rows;

        this.loadingskeleton = false;
      });
    },
    //获取商品列表
    getbusgoodslistData() {
      let data = {
        pIdx: this.PIdx++,
        pSize: 10,
        orderbyID: 0,
      };
      getbusgoodslistAPI(data, "get")
        .then((res) => {
          this.total = res.data.total;
          this.shopdata.push(...res.data.rows);
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.shopdata.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.getbusgoodslistData();
    },
    GetUserId() {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI("userId").replace(/[\.\+\*]/g, "\\$&") +
              "(?:\\=([^&]*))?)?.*$",
            "i"
          ),
          "$1"
        )
      );
    },
    handleScroll() {
      // 页面滚动距顶部距离
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var scroll = scrollTop - this.i;
      this.i = scrollTop;
      if (scroll < 0) {
        // console.log("up");
        this.searchshow = false;
      } else {
        // console.log("down");
        this.searchshow = true;
      }
    },
  },
  mounted() {
    document.title = "兆客易购";

    this.ZkShopBannerData();
    this.ZkGoodGoodsAPIData();
    this.ZkShopAdJXData();
    this.getbusgoodslistData();

    let inviterUserId = this.GetUserId();
    window.localStorage.setItem("inviterUserId", inviterUserId);

    window.addEventListener("scroll", this.handleScroll, true);
    // 监听（绑定）滚轮 滚动事件
  },
  activated() {
    document.title = "兆客易购";
  },
  deactivated() {
    document.title = "兆客易购";
  },
};
</script>

<style lang="less" scoped>
.IMGGGG {
  width: 88px;
  height: 88px;
}

.IMGGGGTow {
  width: 432px;
  height: 250px;
}

.van-icon-photograph {
  font-size: 60px;
}

.Home {
  /deep/ .van-image {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .van-image__loading-icon {
    font-size: 80px !important;
  }
  /deep/ .van-image__error-icon {
    font-size: 80px !important;
  }
  .van-icon-weapp-nav {
    font-size: 80px !important;
  }

  width: 100%;
  min-height: 100%;
  height: auto;
  background: @base-color;
  padding-bottom: 120px;
  box-sizing: border-box;
  padding-top: 100px;
  .Home_search {
    width: 94%;
    padding: 14px 3% 18px;
    height: 68px;
    position: fixed;
    top: 0;
    background: #fff;
    z-index: 99;
    margin: auto;
    background: @base-color;
    input {
      width: 100%;
      height: 100%;
      border-radius: 345px;
      border: 1px solid @border-colorB;
      background: @border-colorC;
      text-indent: 60px;
      font-size: 24px;
    }
    img {
      position: absolute;
      width: 26px;
      height: 26px;
      top: 40px;
      left: 40px;
    }
  }
  .Home_searchhide {
    display: none;
    width: 94%;
    padding: 14px 3% 18px;
    height: 68px;
    position: fixed;
    top: 0;
    background: #fff;
    z-index: 99;
    margin: auto;
    background: @base-color;
    input {
      width: 100%;
      height: 100%;
      border-radius: 345px;
      border: 1px solid @border-colorB;
      background: @border-colorC;
      text-indent: 60px;
      font-size: 24px;
    }
    img {
      position: absolute;
      width: 26px;
      height: 26px;
      top: 40px;
      left: 40px;
    }
  }
  .Home_banner {
    width: 100%;
    .my-swipe {
      .van-swipe-item {
        color: #fff;
        font-size: 20px;
        height: 260px;
        border-radius: 16px;
        text-align: center;
        /deep/ .van-image {
          img {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 94%;
            height: 100%;
            border-radius: 16px;
            object-fit: cover;
          }
        }
      }
      /deep/ .van-swipe__indicators {
        /deep/ .van-swipe__indicator {
          width: 19px;
          height: 4px;
          border-radius: 2px;
        }
        /deep/ .van-swipe__indicator--active {
          background: @text-white !important;
        }
      }
    }
  }
  .Home_nav {
    width: 94%;
    margin: auto;
    ul {
      width: 100%;
      display: flex;
      margin: 40px 0;
      li {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .van-image {
          width: 88px;
          height: 88px;
        }
        img {
          width: 88px;
          height: 88px;
        }
        span {
          font-size: 24px;
          padding-top: 20px;
          color: @text-colorC;
        }
      }
    }
  }
  .Home_content1 {
    width: 94%;
    margin: 0 auto 16px;
    background: @text-white;
    border-radius: 20px;
    .content1_title {
      // padding: 28px 0;
      height: 90px;
      display: flex;
      align-items: center;
      p {
        padding-left: 24px;
        span:nth-child(1) {
          font-size: 32px;
          color: @text-colorA;
          font-weight: bold;
        }
        span:nth-child(2) {
          font-size: 24px;
          color: @text-colorD;
          padding-left: 10px;
        }
      }
    }
    .content1_main {
      padding: 0 24px 24px;
      display: flex;
      flex-wrap: wrap;
      .advert {
        width: 432px;
        height: 250px;
        .van-image {
          width: 100%;
          height: 100%;
          .img {
            width: 100%;
            height: 100%;
            border-radius: 16px;
          }
        }
      }
      .good {
        width: 210px;
        height: 250px;
        margin-top: 24px;
        margin-left: 12px;
        div {
          width: 210px;
          height: 210px;
          border-radius: 16px;
          img {
            width: 210px;
            height: 210px;
            border-radius: 16px;
          }
        }
        span {
          height: 40px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          font-size: 28px;
          color: @main-color;
        }
      }
      .good:nth-child(2) {
        margin-top: 0;
      }
      .good:nth-child(3) {
        margin-left: 0;
      }
    }
  }
  .Home_content2 {
    width: 94%;
    margin: auto;
    .content2_title {
      // padding: 28px 0;
      height: 90px;
      display: flex;
      align-items: center;
      background: @base-color;
      p {
        padding-left: 24px;
        span:nth-child(1) {
          font-size: 32px;
          color: @text-colorB;
          font-weight: bold;
        }
        span:nth-child(2) {
          font-size: 24px;
          color: @text-colorD;
          padding-left: 10px;
        }
      }
    }
    .content2_main {
      width: 100%;
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
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 49%;
          background: @text-white;
          box-shadow: 0px 0px 16px 0px rgba(0, 10, 38, 0.06);
          border-radius: 16px;
          margin-bottom: 16px;
          .goodimg {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 347px;
            border-radius: 16px 16px 0px 0px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .goodtext {
            padding: 20px 12px;
            display: flex;
            flex-direction: column;
            height: 120px;
            justify-content: space-between;
            .p1 {
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              color: @text-colorA;
              font-size: 24px;
              line-height: 32px;
              font-weight: bold;
            }
            .p2 {
              display: flex;
              align-items: baseline;
              // padding-top: 20px;
              span:nth-child(1) {
                font-size: 32px;
                color: @main-color;
                i {
                  font-size: 28px;
                  font-style: normal;
                }
              }
              span:nth-child(2) {
                font-size: 20px;
                color: @text-colorD;
                padding-left: 8px;
              }
            }
          }
        }
      }
    }
  }
}
.skeleton {
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  z-index: 999;
  overflow-y: auto;
  .banner {
    .van-skeleton__row {
      width: 100% !important;
      height: 140px;
      margin: 30px 0;
    }
  }
  .main4 {
    .van-skeleton__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .van-skeleton__row {
        width: 250px !important;
        height: 100px;
        margin: 20px 0;
      }
      .van-skeleton__row:last-child {
        width: 120px !important;
        height: 100px;
        margin: 20px 0;
      }
    }
  }
  .main6 {
    .van-skeleton__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .van-skeleton__row {
        width: 120px !important;
        height: 100px;
        margin: 0 0 20px;
      }
    }
  }
  .main5 {
    .van-skeleton__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .van-skeleton__row {
        width: 50px !important;
        height: 50px;
        margin: 0 0 10px;
        border-radius: 50%;
      }
    }
  }
  .main7 {
    .van-skeleton__content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .van-skeleton__row {
        width: 48% !important;
        height: 240px;
        margin: 0 0 20px;
      }
    }
  }
  .main3 {
    .van-skeleton__row {
      width: 100% !important;
      height: 50px;
      margin: 0 0 20px !important;
    }
  }
}
</style>