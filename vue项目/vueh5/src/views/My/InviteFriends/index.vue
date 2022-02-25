<template>
  <div style="width:100%;height:100%;">
    <div class="InviteFriends">
      <div class="InviteFriends_box">
        <div class="content">
          <div class="d1">
            <span>赚钱攻略</span>
          </div>
          <div class="d2">
            <span>在商城内，通过您的邀请、商品分享码、通过您链接分享进入商城的好友，该好友每次在商城内每购买一件商品，您都可得到相应的返利，邀请越多好友参与。返利越多 ，返利均可提现到微信零钱！）</span>
          </div>
          <div class="d3">
            <img src="@/assets/images/personal/hb_img.png" alt />
          </div>
          <div class="d4">
            <button class="b1" @click="Linksshare()" v-if="wxfx">链接分享</button>
            <button class="b2" @click="toImage()">图片分享</button>
          </div>
        </div>
      </div>

      <div class="InviteFriends_yy">
        <div class="content" ref="imageTofile">
          <div class="box">
            <img :src="erwm" alt />
            <span>微信扫一扫，进入兆客易购</span>
          </div>
        </div>
      </div>

      <div class="shareshadow" v-show="shareshadow" @click="sharesclick()">
        <img src="@/assets/images/share.png" alt />
      </div>

      <div class="canvasshadow" v-show="isShow">
        <img src="@/assets/images/personal/gb.png" alt class="gb" @click="gbshareshadow()" />
        <img :src="htmlUrl" class="canvas-img" id="testImg" />
        <button>长按图片保存到相册</button>
      </div>

      <loading ref="load" v-if="loadingshow"></loading>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import html2canvas from "html2canvas";
// import {
// } from "@/api/MyApi";
import wx from "weixin-js-sdk";
import qs from "qs";
import loading from "@/components/loading";

import { GetWeixinShareInfoAPI, GetQrCodeAPI } from "@/api/other";

export default {
  name: "",
  data() {
    return {
      htmlUrl: "", //html2canvas绘制好的图片地址
      isShow: false, //在页面dom渲染完毕后让图片显示在用户界面
      titledata: "邀请好友", //控制title的动态变量
      shareshadow: false,
      erwm: "",
      loadingshow: true,
      link: "",
      wxfx: true,
    };
  },
  components: {
    loading: loading,
  },
  methods: {
    sharesdk() {

      if(this.$route.query.name){
        var  Name = this.$route.query.name;
      }else{
        var  Name = '好友';
      }

      let userId = window.localStorage.getItem("userId");

      console.log(Name);
      console.log(`${window.location.href}`);
      console.log(`${window.location.href.split("#")[0]}`);

      // this.link = `${window.location.href.split("#")[0]}` + '/****/index.html#/share?userId=' + userId + '&shareId=' + shareId
      let link = `${window.location.href.split("#")[0]}` + "?userId=" + userId;

      console.log(link, "link");

      // let linkindex=`${window.location.href.split("#")[0]}`
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
      this.shareshadow = true;
    },
    sharesclick() {
      this.shareshadow = false;
    },
    // 关闭二维码分享页面
    gbshareshadow() {
      this.isShow = false;
    },
    //获取邀请二维码
    GetQrCodeData() {
      let userId = window.localStorage.getItem("userId");

      if (process.env.VUE_APP_URL === "https://t-api.zk-mall.net/") {
        // 如果是测试环境, 则生成控制台
        this.link = "https://t-shop.zk-mall.net/#/" + "?userId=" + userId;
      } else {
        this.link = "https://shop.zk-mall.net/#/" + "?userId=" + userId;
      }

      let data = {
        QRUrl: this.link,
      };
      console.log(data, "dataQRUrl");
      GetQrCodeAPI(data, "get").then((res) => {
        console.log(res, "获取邀请二维码");
        this.erwm = res.data;
        this.loadingshow = false;
        //  dataURLToBlob(this.erwm);
        //  console.log(dataURLToBlob(this.erwm))
      });
    },
    aa() {
      (window.html2canvas || html2canvas)(this.$refs.imageTofile, {
        backgroundColor: null,
        useCORS: true, // 解决文件跨域问题
      }).then((canvas) => {
        let url = canvas.toDataURL("image/png");
        this.htmlUrl = url;
        if (this.htmlUrl) {
          this.isShow = true; //绘图完毕让图片显示
        }
      });
    },
    toImage() {

      (window.html2canvas || html2canvas)(this.$refs.imageTofile, {
        backgroundColor: null,
        useCORS: true, // 解决文件跨域问题
      }).then((canvas) => {
          // let url = canvas.toDataURL("image/png");
          // this.htmlUrl = url;
          this.htmlUrl=canvas.toDataURL()
          if (this.htmlUrl) {
            this.isShow = true; //绘图完毕让图片显示
          }
      });

      // 修改后代码 主要将 html2canvas 修改为 (window.html2canvas || html2canvas)
   
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
  },
  mounted() {
    console.log(
      window.localStorage.getItem("isWeiXin"),
      "window.localStorage.getItem('isWeiXin')"
    );

    if (window.localStorage.getItem("isWeiXin") == "true") {
      this.wxfx = true;
      this.sharesdk();
    } else {
      this.wxfx = false;
      console.log("没有在微信环境");
    }
    this.GetQrCodeData();

    // Promise.all([

    //     this.sharesdk(),
    //     this.GetQrCodeData()

    // ]).then(res => {
    //     /* 你的逻辑代码 */
    //     console.log("run");
    // })

    document.title = this.titledata;
  },
};
</script>

<style lang="less" scoped>
.InviteFriends {
  width: 100%;
  height: 100%;
  background: @text-white;
  background: url("../../../assets/images/personal/bg.png") no-repeat;
  background-size: 100% 100%;
  .InviteFriends_box {
    width: 90%;
    left: 5%;
    position: fixed;
    bottom: 46px;
    height: 710px;
    background: @text-white;
    border-radius: 44px;
    .content {
      padding: 0 40px;
      height: 100%;
      .d1 {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 44px 0;
        span {
          font-size: 38px;
          font-weight: bold;
          color: @text-colorB;
        }
      }
      .d2 {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 24px;
          font-weight: 400;
          color: @text-colorB;
          line-height: 40px;
        }
      }
      .d3 {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 70px 0 60px;
        img {
          width: 90%;
        }
      }
      .d4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        button {
          width: 278px;
          height: 80px;
          border-radius: 40px;
          outline: none;
          font-size: 32px;
          font-weight: 500;
        }
        .b1 {
          background: @button-mainbackground;
          box-shadow: @main-shadow;
          color: @text-white;
          border: 1px solid @main-color;
        }
        .b2 {
          background: @text-white;
          box-shadow: @main-shadow;
          color: @main-color;
          border: 1px solid @main-color;
        }
      }
    }
  }
  .InviteFriends_yy {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    // display: none;
    z-index: -1;
    .content {
      width: 84%;
      height: 820px;
      background: url("../../../assets/images/personal/hb_bg.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      position: relative;
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        // padding-top: 580px;
        position: absolute;
        bottom: 26px;
        img {
          width: 220px;
          height: 220px;
          background: #fff;
        }
        span {
          color: @text-white;
          font-size: 28px;
          padding-top: 20px;
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
    img {
      width: 60%;
      position: absolute;
      top: 10%;
      right: 10%;
    }
  }
  .gb {
    position: absolute;
    width: 80px;
    right: 5%;
    top: 4%;
    opacity: 0.8;
  }
  .canvasshadow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .canvas-img {
      width: 84%;
      z-index: 99;
    }
    button {
      background: @button-mainbackground;
      box-shadow: @main-shadow;
      color: @text-white;
      border: 1px solid @main-color;
      height: 100px;
      border-radius: 40px;
      font-size: 28px;
      margin-top: 30px;
      width: 60%;
    }
  }
}
</style>