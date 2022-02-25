<template>
  <div class="PMessage">
    <div class="title">
      <van-swipe :loop="false" :width="300">
        <van-swipe-item
          v-for="(item, index) in PMessagedata.imgList"
          :key="index"
          ><img :src="item + '?x-oss-process=style/b2'" alt=""
        /></van-swipe-item>
      </van-swipe>
    </div>
    <div class="content">
      <div class="content_box">
        <div class="top">
          <div class="d1">
            <p>{{ PMessagedata.ppName }}</p>
            <span>兆客自营</span>
          </div>
          <div class="d2" @click="Linksshare()" v-show="shareshadow">
            <img src="@/assets/images/1.5_img/dapei_icon1@2x.png" alt="" />
            <span>分享店铺</span>
          </div>
        </div>
        <div class="bottom">
          <div class="item">
            <img src="@/assets/images/1.6_img/mendian_xinxi_icon1.png" alt="" />
            <p>{{ PMessagedata.linkMan }}</p>
          </div>
          <div class="item">
            <img src="@/assets/images/1.6_img/mendian_xinxi_icon2.png" alt="" />
            <p>{{ PMessagedata.linkTel }}</p>
          </div>
          <div class="item">
            <img src="@/assets/images/1.6_img/mendian_xinxi_icon3.png" alt="" />
            <p>{{ PMessagedata.creditCode }}</p>
          </div>
          <div class="item">
            <img src="@/assets/images/1.6_img/mendian_xinxi_icon4.png" alt="" />
            <p>
              {{ PMessagedata.ppAddress }}
            </p>
          </div>
        </div>

        <div class="foot">
          <p>门店信息均无法修改，如需修改请联系兆客 商城客服：400-7777-316</p>
        </div>
      </div>
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { GetStoreInformationAPI } from "@/api/Proprietary";
import { Toast } from "vant";
import loading from "@/components/loading";

import { Swipe, SwipeItem } from "vant";
import wx from "weixin-js-sdk";
import { GetWeixinShareInfoAPI } from "@/api/other";
export default {
  name: "PMessage",
  data() {
    return {
      shareshadow: false,
      PMessagedata: {},
      loadingshow: true,
    };
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    loading: loading,
  },
  methods: {
    // 获取门店店铺信息
    GetStoreInformation() {
      let data = {
        id: this.$route.query.id,
      };
      GetStoreInformationAPI(data, "get").then((res) => {
        this.PMessagedata = res.data;

        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.sharesdk();
        } else {
          console.log("没有在微信环境");
        }
        this.loadingshow = false;
      });
    },
    // 微信分享
    sharesdk() {
      let Name = window.localStorage.getItem("nickName");

      let link =
        `${window.location.href.split("#")[0]}` +
        "#/GoodsDetails/ProprietaryStore/?ShopId=" +
        this.PMessagedata.shopId;

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
    this.GetStoreInformation();
  },
};
</script>

<style lang="less" scoped>
.PMessage {
  width: 100%;
  min-height: 100%;
  height: auto;
  overflow-y: auto;
  .title {
    width: 100%;
    /deep/ .van-swipe {
      width: 100%;
      height: 780px;
      .van-swipe-item {
        width: 440px !important;
        margin-left: 20px;
        height: 780px;
        img {
          width: 440px;
          height: 720px;
          border-radius: 16px;
        }
      }
      .van-swipe__indicators {
        width: 100%;
        display: flex;
        justify-content: center;
        .van-swipe__indicator {
          width: 16px;
          height: 16px;
          background: #b1b6c4;
          margin-left: 8px;
        }
        .van-swipe__indicator--active {
          background-color: rgba(255, 138, 73, 1);
        }
      }
    }
  }
  .content {
    width: 100%;
    .content_box {
      padding: 40px;
      .top {
        width: 100%;
        display: flex;
        align-items: center;
        .d1 {
          flex: 1;
          display: flex;
          align-items: center;
          p {
            font-size: 32px;
            font-weight: bold;
          }
          span {
            width: 104px;
            height: 36px;
            background: linear-gradient(318deg, #ffc58c 5%, #ef6417 98%);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 22px;
            margin-left: 12px;
          }
        }
        .d2 {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-left: 1px solid rgba(177, 182, 196, 0.6);
          padding: 0 0 0 40px;
          img {
            width: 40px;
          }
          span {
            color: #4a5060;
            font-size: 22px;
            padding-top: 12px;
          }
        }
      }
      .bottom {
        width: 100%;
        .item {
          width: 100%;
          display: flex;
          margin-top: 24px;
          align-items: flex-start;
          img {
            width: 34px;
            margin-top: 4px;
          }
          p {
            flex: 1;
            color: #4a5060;
            font-size: 28px;
            padding-left: 16px;
            line-height: 40px;
          }
        }
      }
      .foot {
        width: 80%;
        display: flex;
        margin: 40px auto 0;
        text-align: center;
        p {
          font-size: 26px;
          color: rgba(177, 182, 196, 1);
          font-weight: bold;
          line-height: 36px;
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