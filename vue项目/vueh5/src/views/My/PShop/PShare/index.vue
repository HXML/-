<template>
  <div class="PShare">
    <div class="PShare_box">
      <div class="title">
        <div class="top">
          <div class="title_item" v-for="(item, index) in mdlist" :key="index" @click="jumpGoodsDetails(item.id)"> 
            <img
              :src="item.mainImg+'?x-oss-process=style/n4'"
              alt=""
            />
            <span>¥{{item.price|toFixedTow}}</span>
          </div>
        </div>
        <div class="bottom">
          <span>扫码进店查看更多优惠商品</span>
          <!-- <img src="@/assets/images/1.6_img/icons.png" alt="" /> -->
        </div>
      </div>
      <div class="content">
        <div class="top">
          <img :src="erwm" alt="" />
        </div>
        <div class="bottom">
          <img
            :src="mddata.logoImg + '?x-oss-process=style/n4'"
            alt=""
            class="left_img"
          />
          <div class="b_div">
            <p class="p1">{{mddata.ppName}}</p>
            <p class="p2">
              <img
                src="@/assets/images/1.6_img/ziying_home_icon1@2x.png"
                alt=""
              />
              <span>{{mddata.ppAddress}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import qs from "qs";
import loading from "@/components/loading";

import { GetWeixinShareInfoAPI, GetQrCodeAPI } from "@/api/other";

import { SharePickupAPI } from "@/api/Proprietary";

export default {
  data() {
    return {
      loadingshow: true,
      erwm: "",
      mddata: {},
      mdlist:[]
    };
  },
  components: {
    loading: loading,
  },
  methods: {
    //获取邀请二维码
    GetQrCodeData() {
      let ShopId = 115;

      if (process.env.VUE_APP_URL === "https://t-api.zk-mall.net/") {
        // 如果是测试环境, 则生成控制台
        this.link = `https://t-shop.zk-mall.net/#/GoodsDetails/ProprietaryStore?ShopId=${ShopId}`;
      } else {
        this.link = `https://shop.zk-mall.net/#/GoodsDetails/ProprietaryStore?ShopId=${ShopId}`;
      }

      let data = {
        QRUrl: this.link,
      };
      console.log(data, "dataQRUrl");

      GetQrCodeAPI(data, "get").then((res) => {
        console.log(res, "获取邀请二维码");
        this.erwm = res.data;

        this.loadingshow = false;
      });
    },
    SharePickupdata() {
      let data = {
        pickId: this.$route.query.id,
      };
      SharePickupAPI(data, "get").then((res) => {
        if ((res.code = 1)) {
          this.mddata = res.data.pickup;
          this.mdlist = res.data.goods;
        }
      });
    },
    //去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    sharesdk() {
      let Name = window.localStorage.getItem("nickName");

      let link =
        `${window.location.href.split("#")[0]}` +
        "#/GoodsDetails/ProprietaryStore/?ShopId=" +
        this.PHomedata.shopId;

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
  },
  mounted() {
    document.title = '门店分享';

    this.GetQrCodeData();
    this.SharePickupdata();

    if (window.localStorage.getItem("isWeiXin") == "true") {
      this.sharesdk();
    } else {
      console.log("没有在微信环境");
    }
  },
};
</script>


<style lang="less" scoped>
.PShare {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: url("../../../../assets/images/1.6_img/fenxiang_bg.jpg");
  background-size: 100% 100%;
  .PShare_box {
    padding: 0 34px 100px;
    .title {
      display: flex;
      flex-direction: column;
      padding-top: 199px;
      .top {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .title_item {
          background: #fff;
          border-radius: 16px;
          width: 198px;
          height: 244px;
          margin-right: 40px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 90%;
          }
          span {
            color: #fc6745;
            font-size: 24px;
            padding: 8px 0 0;
          }
        }
        .title_item:nth-child(3n) {
          margin-right: 0;
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        span {
          color: #fff;
          opacity: 0.5;
          font-size: 28px;
        }
        img {
          width: 20px;
          padding-left: 8px;
        }
      }
    }
    .content {
      //   height: 686px;
      background: #fff;
      border-radius: 16px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      //   justify-content: center;
      //   align-items: center;
      .top {
        width: 100%;
        display: flex;
        justify-content: center;
        img {
          width: 80%;
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        margin-top: 20px;
        .left_img {
          width: 140px;
          height: 140px;
        }
        .b_div {
          padding-left: 24px;
          .p1 {
            color: #08315b;
            font-size: 32px;
          }
          .p2 {
            display: flex;
            align-items: center;
            img {
              width: 20px;
            }
            font-size: 26px;
            color: #ccc;
            padding-top: 12px;
            span {
              padding-left: 8px;
            }
          }
        }
      }
    }
  }
}
</style>