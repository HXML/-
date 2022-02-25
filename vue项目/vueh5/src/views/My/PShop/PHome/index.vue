<template>
  <div class="PHome">
    <div class="title">
      <img
        :src="PHomedata.logoImg + '?x-oss-process=style/n4'"
        alt=""
        class="bg_img"
      />
      <div class="box">
        <div class="box_div">
          <div class="left">
            <div class="left1" @click="jumprouter(5)">
              <img
                :src="PHomedata.logoImg + '?x-oss-process=style/n4'"
                alt=""
              />
              <div>店铺信息</div>
            </div>
            <div class="left2">
              <div class="d1">
                <span class="s1">{{ PHomedata.ppName }}</span>
                <span class="s2">兆客自营</span>
              </div>
              <div class="d2">
                <img src="@/assets/images/1.6_img/mendian_icon1.png" alt="" />
                <p>{{ PHomedata.ppAddress }}</p>
              </div>
            </div>
          </div>

          <div class="right" @click="Linksshare()" v-show="shareshadow">
            <img src="@/assets/images/1.6_img/mendian_icon2.png" alt="" />
            <span>分享店铺</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="order">
        <div class="top">
          <ul>
            <li>
              <span>{{ PHomedata.orderSum }}</span>
              <span>订单/笔</span>
            </li>
            <li>
              <span>{{ PHomedata.orderRanking }}</span>
              <span>排行/top</span>
            </li>
            <!-- <li>
              <span>{{ PHomedata.pushMoney | toFixedTow }}</span>
              <span>收益/¥</span>
            </li> -->
            <li>
              <span>{{ PHomedata.salesAmount | toFixedTow }}</span>
              <span>销售额/¥</span>
            </li>
          </ul>
        </div>
        <div class="bottom">
          <div class="d1" @click="jumpPWithdraw()">
            <span>总收益/¥</span>
            <span>{{ PHomedata.historicalIncome | toFixedTow }}</span>
          </div>
          <div class="d1" @click="jumpPWithdraw()">
            <span>账户余额/¥</span>
            <span>{{ PHomedata.balance | toFixedTow }}</span>
          </div>
        </div>
      </div>

      <div class="order_gl">
        <div class="top" @click="jumpMyorder(0)">
          <span class="s1">订单管理</span>
          <span class="s2">查看全部订单></span>
        </div>
        <div class="bottom">
          <div class="item" @click="jumpMyorder(1)">
            <img
              src="@/assets/images/1.6_img/mendian_dingdan_icon1.png"
              alt=""
            />
            <span>今日订单</span>
          </div>
          <div class="item" @click="jumpMyorder(2)">
            <img
              src="@/assets/images/1.6_img/mendian_dingdan_icon2.png"
              alt=""
            />
            <span>本月订单</span>
          </div>
          <div class="item" @click="jumpMyorder(3)">
            <img
              src="@/assets/images/1.6_img/mendian_dingdan_icon3.png"
              alt=""
            />
            <span>待提货</span>
          </div>
          <div class="item" @click="jumpMyorder(5)">
            <img
              src="@/assets/images/1.6_img/mendian_dingdan_icon4.png"
              alt=""
            />
            <span>退款/售后</span>
          </div>
        </div>
      </div>

      <div class="order_gl">
        <div class="top">
          <span class="s1">常用功能</span>
        </div>
        <div class="bottom">
          <div
            class="item"
            v-for="(item, index) in fundata"
            :key="index"
            @click="jumprouter(index)"
          >
            <img :src="item.funimg" alt="" />
            <span>{{ item.funtext }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="shareshadow" v-show="shareshadow" @click="sharesclick()">
      <img src="@/assets/images/share.png" alt />
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
import { GetStorePersonalCenterAPI } from "@/api/Proprietary";
import { Toast } from "vant";
import loading from "@/components/loading";

import wx from "weixin-js-sdk";
import { GetWeixinShareInfoAPI } from "@/api/other";

export default {
  name: "PHome",
  data() {
    return {
      shareshadow: false,
      pShopId: 0,
      PHomedata: {},
      loadingshow: true,
      fundata: [
        {
          funimg: require("@/assets/images/1.6_img/mendian_changyong_icon1.png"),
          funtext: "商品分享",
        },
        {
          funimg: require("@/assets/images/1.6_img/mendian_changyong_icon2.png"),
          funtext: "代客下单",
        },
        {
          funimg: require("@/assets/images/1.6_img/mendian_changyong_icon3.png"),
          funtext: "售后处理",
        },
        {
          funimg: require("@/assets/images/1.6_img/mendian_changyong_icon4.png"),
          funtext: "提现账户",
        },
        {
          funimg: require("@/assets/images/1.6_img/mendian_changyong_icon5.png"),
          funtext: "门店分享",
        },
        {
          funimg: require("@/assets/images/1.6_img/mendian_changyong_icon6.png"),
          funtext: "门店信息",
        },
      ],
    };
  },
  components: {
    loading: loading,
  },
  methods: {
    // 跳转到我的售后
    jumpAfterSales() {
      this.$router.push({ path: "/My/AfterSales" });
    },
    // 跳转到我的订单
    jumpMyorder(status) {
      this.$router.push({
        path: "/My/Myorder",
        query: { orderstatus: status, pickupId: this.$route.query.id },
      });
    },
    // 获取门店首页信息
    GetStorePersonalCenter() {
      let data = {
        id: this.$route.query.id,
      };
      GetStorePersonalCenterAPI(data, "get").then((res) => {
        this.PHomedata = res.data;
        this.loadingshow = false;
        document.title = this.PHomedata.ppName;

        window.localStorage.setItem("ShopId", this.PHomedata.shopId);

        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.sharesdk();
        } else {
          console.log("没有在微信环境");
        }
      });
    },
    jumpPWithdraw() {
      // this.$router.push({
      //   path: "/My/PShop/PWithdraw",
      //   query: {
      //     id: this.pShopId,
      //   },
      // });
      this.$router.push({
        path: "/My/Income",
        query: {
          id: this.pShopId,
        },
      });
    },
    //去门店订单
    jumpPorder() {
      this.$router.push({
        path: "/My/PShop/Porder",
      });
    },
    jumprouter(index) {
      switch (index) {
        case 0:
          this.$router.push({
            path: "/GoodsDetails/ProprietaryClass",
            query: {
              ShopId: this.PHomedata.shopId,
            },
          }); //商品分享
          break;
        case 1:
          this.$router.push({
            path: "/GoodsDetails/ProprietaryClass",
            query: {
              ShopId: this.PHomedata.shopId,
            },
          }); //待客下单
          break;
        case 2:
          this.$router.push({
            path: "/My/PShop/Porder",
            query: {
              id: this.$route.query.id,
            },
          });
          break;
        case 3:
          this.$router.push({
            name: "PSet",
            query: {
              id: this.$route.query.id,
            },
          }); //提现设置
          break;
        case 4:
          this.$router.push({
            name: "PShare",
            query: {
              id: this.$route.query.id,
            },
          }); //分享
          break;
          break;
        case 5:
          this.$router.push({
            // path: "/My/PShop/PMessage",
            path: "/GoodsDetails/ProprietaryEnter",
            query: {
              id: this.$route.query.id,
              type: "edit",
            },
          }); //门店信息
          break;
        default:
          break;
      }
    },
    // 微信分享
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
    this.pShopId = this.$route.query.id;

    window.localStorage.setItem("pickupId", this.$route.query.id);

    this.GetStorePersonalCenter();
  },
};
</script>

<style lang="less" scoped>
.PHome {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: #f5f6f7;
  .title {
    width: 100%;
    height: 280px;
    border-radius: 0px 0px 40px 40px;
    position: relative;
    .bg_img {
      width: 100%;
      height: 100%;
      border-radius: 0px 0px 40px 40px;
    }
    .box {
      width: 100%;
      height: 280px;
      background: rgba(0, 11, 38, 0.6);
      border-radius: 0px 0px 40px 40px;
      position: absolute;
      top: 0;
      color: @text-white;
      .box_div {
        padding: 0 40px;
        display: flex;
        margin-top: 48px;

        align-items: flex-start;
        .left {
          display: flex;
          flex: 1;
          .left1 {
            position: relative;
            display: flex;
            width: 136px;
            height: 136px;
            border-radius: 12px;
            img {
              width: 136px;
              height: 136px;
              object-fit: cover;
              border-radius: 12px;
            }
            div {
              position: absolute;
              bottom: 0;
              font-size: 22px;
              text-align: center;
              width: 100%;
              background: rgba(0, 0, 0, 0.4);
              padding: 12px 0;
              border-radius: 0 0 12px 12px;
            }
          }
          .left2 {
            flex: 1;
            padding: 0 12px 0 24px;
            display: flex;
            flex-direction: column;
            .d1 {
              //   display: flex;
              //   align-items: center;
              margin-top: 12px;
              .s1 {
                font-size: 32px;
              }
              .s2 {
                font-size: 22px;
                background: linear-gradient(318deg, #ffc58c 5%, #ef6417 98%);
                border-radius: 18px;
                padding: 4px 6px;
                margin-left: 12px;
              }
            }
            .d2 {
              display: flex;
              align-items: flex-start;
              margin-top: 18px;
              img {
                width: 20px;
                height: 20px;
                margin-top: 4px;
              }
              p {
                flex: 1;
                font-size: 22px;
                padding-left: 4px;
                line-height: 32px;
              }
            }
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-left: 1px solid rgba(255, 255, 255, 0.4);
          padding: 0 0 0 40px;
          margin-top: 12px;
          img {
            width: 40px;
            height: 40px;
          }
          span {
            font-size: 22px;
            padding-top: 12px;
          }
        }
      }
    }
  }
  .content {
    padding: 0 20px;
    margin-top: -40px;
    position: relative;
    .order {
      padding: 20px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0px 4px 16px 0px rgba(0, 11, 38, 0.06);
      .top {
        width: 100%;
        ul {
          width: 100%;
          display: flex;
          align-items: center;
          padding-top: 24px;
          li {
            display: flex;
            flex-direction: column;
            flex: 1;
            align-items: center;
            justify-content: center;
            span:nth-child(1) {
              font-size: 34px;
              color: #000b26;
            }
            span:nth-child(2) {
              font-size: 22px;
              color: #4a5060;
              padding-top: 10px;
            }
          }
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30px;
        .d1 {
          background: url("../../../../assets/images/1.6_img/mendian_bg_img.png")
            no-repeat;
          width: 306px;
          height: 142px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          padding: 24px 0 0 20px;
          span:nth-child(1) {
            color: #4a5060;
            font-size: 24px;
          }
          span:nth-child(2) {
            font-size: 40px;
            color: #d15109;
            padding-top: 18px;
          }
        }
      }
    }
    .order_gl {
      padding: 20px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0px 4px 16px 0px rgba(0, 11, 38, 0.06);
      margin-top: 20px;
      .top {
        display: flex;
        align-items: center;
        height: 60px;
        .s1 {
          flex: 1;
          font-size: 32px;
          font-weight: bold;
        }
        .s2 {
          color: #b1b6c4;
          font-size: 24px;
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        padding: 0 0 16px;
        width: 100%;
        flex-wrap: wrap;
        .item {
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 28px;
          img {
            width: 42px;
            height: 46px;
          }
          span {
            color: #4a5060;
            font-size: 24px;
            padding-top: 16px;
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