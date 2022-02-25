<template>
  <div class="ProprietaryStore">
    <div class="title">
      <div class="title_box">
        <div class="d1">
          <span class="s1">晚上十一点前下单，隔日送达</span>
          <div @click="jumpStoreSearch()">
            <img
              src="@/assets/images/1.6_img/ziying_home_icon2@2x.png"
              alt=""
            />
            <span>搜索商品</span>
          </div>
        </div>
        <div class="d2">
          <div class="left" @click="jumpProprietarySelect()">
            <div class="left1">
              <img
                v-if="model.logoImg"
                :src="model.logoImg + '?x-oss-process=style/b2'"
                alt=""
              />
              <img v-else src="@/assets/images/logo.png" alt="" />
            </div>
            <div class="left2">
              <div class="left2_top">
                <span>{{ model.ppName }}></span>
              </div>
              <div class="left2_bottom">
                <img
                  src="@/assets/images/1.6_img/ziying_home_icon1@2x.png"
                  alt=""
                />
                <span>{{ model.ppAddress }}</span>
              </div>
            </div>
          </div>
          <div class="right" @click="Linksshare()">
            <img src="@/assets/images/1.5_img/dapei_icon1@2x.png" alt="" />
            <span>分享店铺</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="banner">
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
      <div class="main1" @click="jumpProprietaryEnter()">
        <img src="@/assets/images/1.6_img/ziying_home_mendian.png" alt="" />
      </div>
      <div class="main2">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div
            class="main2_item"
            v-for="(item, index) in shopdata"
            :key="index"
            @click="jumpGoodsDetails(item.id)"
          >
            <div class="top">
              <img :src="item.mainImg + '?x-oss-process=style/b1'" alt="" />
            </div>
            <div class="bottom">
              <div class="d1">
                {{ item.goodsName }}
              </div>
              <div class="d2">
                <p class="p1"><span>¥</span>{{ item.price | toFixedTow }}</p>
                <p class="p2">已售{{ item.buyNum }}件</p>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <div class="shareshadow" v-show="shareshadow" @click="sharesclick()">
      <img src="@/assets/images/share.png" alt />
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
    <tabbarTow ref="tab" :shopID="shopId"></tabbarTow>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "vant";
import tabbarTow from "@/components/tabbarTow";
import { Toast } from "vant";

import wx from "weixin-js-sdk";
import { GetWeixinShareInfoAPI } from "@/api/other";

import { List } from "vant";
import { Image as VanImage } from "vant";
import loading from "@/components/loading";

import { GoodListAPI, DetailsAPI } from "@/api/Proprietary";

export default {
  name: "ProprietaryStore",
  data() {
    return {
      shopId: 0,
      shareshadow: false,
      loading: false,
      finished: false,
      PIdx: 1, //商品页面的初始化的index
      total: 0, //商品的总数量
      shopdata: [], //商品列表
      BannerList: [], //轮播图
      model: {}, //店铺信息
      loadingshow: true,
    };
  },
  components: {
    [VanImage.name]: VanImage,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    tabbarTow: tabbarTow,
    [List.name]: List,
    loading: loading,
  },
  methods: {
    //跳转去门店申请入住
    jumpProprietaryEnter() {
      this.$router.push({
        path: "/GoodsDetails/ProprietaryEnter",
      });
    },
    //跳转去选择门店
    jumpProprietarySelect() {
      this.$router.replace({
        path: "/GoodsDetails/ProprietarySelect",
      });
    },
    //获取商品列表
    GoodListData() {
      if (this.$route.query.ShopId) {
        var ShopId = this.$route.query.ShopId;
      } else {
        var ShopId = window.localStorage.getItem("ShopId");
      }
      let data = {
        pageIndex: this.PIdx++,
        pageSize: 6,
        // shopCategoryId: 0,
        shopId: ShopId,
      };
      GoodListAPI(data, "get")
        .then((res) => {
          this.total = res.data.result.total;
          this.shopdata.push(...res.data.result.rows);
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.shopdata.length === this.total) {
            this.finished = true;
          }
        });
    },
    //跳转去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    // 获取首页轮播图
    ZkShopBannerData() {
      if (this.$route.query.ShopId) {
        var ShopId = this.$route.query.ShopId;
      } else {
        var ShopId = window.localStorage.getItem("ShopId");
      }

      let data = {
        shopId: ShopId,
      };
      DetailsAPI(data, "get").then((res) => {
        if (res.code == 0) {
          this.$router.replace({
            path:
              "/GoodsDetails/ProprietarySelect?ShopId=" +
              this.$route.query.ShopId,
          });
          return false;
        }
        this.BannerList = res.data.listBanner;
        this.model = res.data.model;
        this.loadingshow = false;

        window.localStorage.setItem(
          "shopCategoryId",
          res.data.model.shopCategoryId
        );
      });
    },
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
    //跳转到店铺搜索
    jumpStoreSearch() {
      this.$router.push({ path: "/GoodsDetails/StoreSearch" });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GoodListData();
    },
    // 微信分享
    sharesdk() {
      let Name = window.localStorage.getItem("nickName");
      // let barginId = this.barListData.actBargainirgId;
      let link =
        `${window.location.href.split("#")[0]}` +
        "#/GoodsDetails/ProprietaryStore?ShopId=" +
        this.shopId;

      console.log(link, "link");
      GetWeixinShareInfoAPI({ url: `${window.location.href}` }, "get").then(
        (res) => {
          console.log(res, "ressssssssssssssssss");
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"], // 必填，需要使用的JS接口列表
          });
          //通过error接口处理失败验证
          wx.error(function (res) {
            console.log(res, "通过error接口0000处理失败验证");
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          wx.ready(function () {
            // console.log(1111111)
            //需在用户可能点击分享按钮前就先调用

            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）最新接口
            wx.onMenuShareAppMessage({
              title: "兆客易购", // 分享标题
              desc: Name + "邀请您进入兆客易购",
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                "http://img.zk-mall.net/prod/logo.png?x-oss-process=style/b3", // 分享图标
              success: function () {
                // 设置成功
                console.log(res, "自定义“分享给朋友");
              },
            });

            wx.onMenuShareTimeline({
              title: "兆客易购", // 分享标题
              desc: Name + "邀请您进入兆客易购",
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                "http://img.zk-mall.net/prod/logo.png?x-oss-process=style/b3", // 分享图标
              success: function () {
                // 设置成功
                console.log(res, "自定义“分享给朋友圈");
              },
            });
          });
        }
      );
    },
    // 链接分享
    Linksshare() {
      if (window.localStorage.getItem("isWeiXin") == "true") {
        this.shareshadow = true;
      } else {
        Toast("根据你浏览器的分享分享店铺");
      }
    },
    sharesclick() {
      this.shareshadow = false;
    },
  },
  mounted() {
    this.$refs.tab.active = 0; //父组件通过$refs获取子组件的值
    document.title = "兆客自营";

    if (this.$route.query.ShopId) {
      window.localStorage.setItem("ShopId", this.$route.query.ShopId);
      this.shopId = this.$route.query.ShopId;
    }

    if (window.localStorage.getItem("isWeiXin") == "true") {
      this.sharesdk();
    } else {
      console.log("没有在微信环境");
    }

    this.GoodListData();
    this.ZkShopBannerData();

    window.localStorage.removeItem("location");
  },
};
</script>

<style lang="less" scoped>
.ProprietaryStore {
  width: 100%;
  min-height: 100%;
  background: @base-color;
  height: auto;
  .title {
    width: 100%;
    background: url("../../../../assets/images/1.6_img/ziying_home_bg@2x.png");
    height: 340px;
    background-size: 100% 100%;
    .title_box {
      padding: 0 20px;
    }
    .d1 {
      padding: 20px 10px;
      display: flex;
      align-items: center;
      color: @text-white;
      font-size: 28px;
      .s1 {
        flex: 1;
      }
      div {
        display: flex;
        align-items: center;
        img {
          width: 28px;
          height: 28px;
        }
        span {
          font-size: 26px;
          padding-left: 6px;
        }
      }
    }
    .d2 {
      height: 104px;
      padding: 20px 0;
      background: #ffffff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        padding-left: 24px;
        .left1 {
          img {
            width: 96px;
            height: 96px;
          }
        }
        .left2 {
          display: flex;
          flex-direction: column;
          padding-left: 18px;
          .left2_top {
            font-size: 32px;
            color: @text-colorB;
            margin-bottom: 16px;
          }
          .left2_bottom {
            font-size: 22px;
            color: @text-colorD;
            display: flex;
            align-items: center;
            img {
              width: 20px;
            }
            span {
              padding-left: 8px;
            }
          }
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 24px;
        border-left: 1px solid #f5f6f7;
        img {
          width: 36px;
          height: 36px;
        }
        span {
          font-size: 22px;
          padding-top: 10px;
          color: @text-colorB;
        }
      }
    }
  }
  .content {
    padding: 0 20px 110px;
    .banner {
      width: 100%;
      height: 260px;
      margin-top: -100px;
      /deep/ .my-swipe {
        width: 100%;
        .van-swipe-item {
          width: 100%;
          color: #fff;
          font-size: 20px;
          height: 260px;
          text-align: center;
          background-color: none;
          border-radius: 16px;
          overflow: hidden;
          img {
            width: 100%;
            height: 260px;
          }
        }
        .van-swipe__indicators {
          .van-swipe__indicator {
            width: 20px;
            height: 4px;
            background: #ffffff;
            border-radius: 2px;
          }
        }
      }
    }
    .main1 {
      width: 100%;
      margin: 22px 0;
      img {
        width: 100%;
      }
    }
    .main2 {
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
      .main2_item {
        width: 100%;
        background: @text-white;
        border-radius: 16px;
        margin-bottom: 24px;
        .top {
          width: 100%;
          height: 400px;
          img {
            width: 100%;
            border-radius: 16px 16px 0 0;
            height: 100%;
            // object-fit: cover;
          }
        }
        .bottom {
          padding: 24px;
          .d1 {
            font-size: 30px;
            color: @text-colorA;
            line-height: 44px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .d2 {
            display: flex;
            align-items: center;
            padding-top: 24px;
            .p1 {
              font-size: 30px;
              color: rgba(244, 39, 55, 1);
              flex: 1;
              span {
                font-size: 20px;
              }
            }
            .p2 {
              font-size: 24px;
              color: @text-colorD;
            }
          }
        }
      }
    }
  }
  .shareshadow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    left: 0;
    z-index: 999;
    img {
      width: 60%;
      position: absolute;
      top: 10%;
      right: 10%;
    }
  }
}
</style>