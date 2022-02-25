<template>
  <div class="GroupDetails">
    <!-- 轮播图 -->
    <div class="shop_banner">
      <van-swipe @change="onChange" :loop="true" :autoplay="3000">
        <van-swipe-item v-for="(item, index) in shopbanner" :key="index">
          <img
            :src="item + '?x-oss-process=style/b5'"
            @click="preViewImg(shopbanner, index)"
          />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            {{ current + 1 }}/{{ shopbanner.length }}
          </div>
        </template>
      </van-swipe>
    </div>

    <!-- 商品名称 -->
    <div class="shop_title">
      <div class="shop_title_d1">
        <!-- 拼团 -->
        <div class="pt_d3">
          <span class="s1">拼团价￥</span>
          <p>
            <span class="s2">{{ goodDetailsAll.actPrice }}</span>
            <span class="s3">单买价¥{{ goodDetailsAll.originalPrice }}</span>
          </p>
        </div>
      </div>
      <div class="shop_title_d2">
        <p>{{ goodDetailsData.goodsName }}</p>
      </div>

      <!-- 邀请拼团 -->
      <div class="invitation_pt">
        <div class="box">
          
          <!-- 时间是否结束 -->
          <div class="d5" v-if="Grouptime && !Groupnum">
            <span class="s1"> 偶哦，拼团失败～拼团人数不够 </span>
            <div class="d5_djs">
              剩余<van-count-down :time="time" class="s2" />
            </div>
          </div>

          <!-- 人数是否满 -->
          <div class="d1" v-if="Groupnum">
            <span class="s1">{{ GroupTexe }}</span>
          </div>

          <div class="d1" v-if="!Groupnum && !Grouptime">
            <span class="s1">
              还差
              <i>{{ GroupData.limitPeopleNum - GroupData.peopleNum }}人</i>成团
            </span>
            <van-count-down :time="time" class="s2" />
          </div>


          <div class="d2">
            <div
              :class="item.imgUrl?'item':'item2 item'"
              v-for="(item, index) in userImgslist"
              :key="index"
            >
              <img :src="item.imgUrl + '?x-oss-process=style/n3'" v-if="item.imgUrl" alt />
              <img src="@/assets/images/1.5_img/wu@2x.png" v-else alt />
              <span v-if="item.isMain == 1">团长</span>
            </div>
          </div>


          <div class="d3" v-if="isUseGroup && !Groupnum && !Grouptime">
            <button class="b1" @click="Linksshare()">邀请好友参团</button>
          </div>

          <!-- 时间是否结束 -->
          <div class="d3" v-if="Grouptime && !Groupnum">
            <button class="b1" @click="WantOpen()">{{ GroupTexeThree }}</button>
          </div>

          <!-- 人数是否满 -->
          <div class="d3" v-if="Groupnum">
            <button class="b1" @click="WantOpen">{{ GroupTexeTow }}</button>
          </div>

          <div class="d3" v-if="!isUseGroup && !Groupnum && !Grouptime">
            <button class="b1" @click="tccategory">我要参团</button>
            <button class="b2" @click="WantOpen">我要开团</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="shop_details_title">
      <i></i>
      <span>图文详情</span>
      <i></i>
    </div>
    <div class="shop_details_content" v-html="goodDetailsData.details"></div>

    <div class="shop_details_foot">
      <!-- <div class="d1" v-if="isUseGroup">
        <button @click="Linksshare()">邀请好友参团</button>
      </div> -->
      <!-- <div class="d2" v-if="!isUseGroup">
        <button class="b1" @click="WantOpen">我要开团</button>
        <button class="b2" @click="tccategory">我要参团</button>
      </div> -->
    </div>

    <van-sku
      v-model="skushow"
      :sku="sku"
      :goods="goods"
      :hide-stock="sku.hide_stock"
      @add-cart="onAddCartClicked"
      :close-on-click-overlay="true"
      :initial-sku="initialSku"
      ref="getSku"
    >
      <template #sku-header-price="props">
        <div class="van-sku__goods-price">
          <span class="van-sku__price-symbol">￥</span>
          <span class="van-sku__price-num">{{ props.price }}</span>
        </div>
      </template>
      <template slot="sku-actions">
        <div class="van-sku-actions">
          <!-- <div class="foot_div1" v-if="actionsdiv1">加入购物车</div> -->
          <div class="foot_div2" @click="define">立即购买</div>
        </div>
      </template>
    </van-sku>

    <div class="shareshadow" v-show="shareshadow" @click="sharesclick()">
      <img src="@/assets/images/share.png" alt />
    </div>

    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>

<script>
// 轮播图
import { Swipe, SwipeItem } from "vant";

import { CountDown } from "vant";
import { Sku } from "vant";

// Popup 动作面板
import { Popup } from "vant";

import { GetActGroupDetaiAPI } from "@/api/activity";
import loading from "@/components/loading";
import qs from "qs";

import wx from "weixin-js-sdk";
import { GetWeixinShareInfoAPI } from "@/api/other";

import { ImagePreview } from "vant";

import { Toast } from "vant";
export default {
  name: "GroupDetails",
  data() {
    return {
      shareshadow: false, //分享
      loadingshow: true, //loading显示
      shopbanner: [], //轮播图图片
      current: 0, //轮播图的指数计

      goodDetailsAll: {},
      goodDetailsData: {}, //拼团详情data

      GroupData: {},
      userImgslist: [],

      time: 30 * 60 * 60 * 1000,

      classData: {
        //sku 弹框里面的所有值
        shopimg: "", //商品图片
        shopprice: 4910, //商品
        inventory: 10, //库存数量
        attribute: [
          //选择中的规格 属性
          {
            attributename: "Mate20极光色",
          },
          {
            attributename: "6G+128GB",
          },
        ],
        goodsPlist: [
          //所有的属性 和每个属性的值
        ],
        buynum: 2, //购买的数量
      },
      sKUList: [],
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [],
        price: "0", // 默认价格（单位元）
        stock_num: 0, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        hide_stock: false, // 是否隐藏剩余库存
      },
      initialSku: {}, //默认选择规格
      goods: {
        // 商品标题
        title: "测试商品",
        // 默认商品 sku 缩略图
        picture:
          "https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg",
      },
      skushow: false,
      specificationsList: [], //商品规格
      Groupnum: false, //判断拼团人数是否满
      isUseGroup: false, //判断当前用户是否参与的这个拼团
      Grouptime: false, //判断拼团时间是否结束
      GroupTexe: "拼团成功",
      GroupTexeTow: "再次开团",
      GroupTexeThree: "重新开团",
    };
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [CountDown.name]: CountDown,
    [Sku.name]: Sku,
    loading: loading,
  },
  methods: {
    preViewImg(imglist,index){
      var arr=[]
      imglist.forEach(item => {
        item=item+'?x-oss-process=style/89900'
        arr.push(item)
      })

      ImagePreview({
        images:arr,
        startPosition: index,
      });
    },
    onChange(index) {
      this.current = index;
    },
    //我要开团
    WantOpen() {
      this.$router.push({
        path: "/GoodsDetails",
        query: { ID: this.goodDetailsAll.goods.id },
      });
    },
    // 点击显示sku 商品分类弹框
    tccategory() {
      this.sku.list = this.goodDetailsData.skuList.map((item) => {
          return Object.assign(
            {},
            {
              id: item.id,
              shopId: item.shopId,
              categoryId: item.categoryId,
              skuNo: item.skuNo,
              barCode: item.barCode,
              goodsId: item.goodsId,
              imgId: item.imgId,
              skuName: item.skuName,
              price: item.actPrice * 100, //价格
              vipPrice: item.vipPrice,
              stock_num: item.actNum, //库存
              clickNum: item.clickNum,
              buyNum: item.buyNum,
              colorId: item.colorId,
              creatorDate: item.creatorDate,
              shopCode: item.shopCode,
              imageUrl: item.imageUrl,
              buyCnt: item.buyCnt,
            },
            ...(item.dataJson ? JSON.parse(item.dataJson) : "")
          );
        });
      this.skushow = true;
      window.localStorage.setItem("isgroupmain", this.GetUserId());
    },
    onAddCartClicked() {},
    // 立即购买
    define() {
      console.log("立即购买立即购买立即购买");
      let event = this.$refs.getSku.getSkuData();
      console.log(event, "eventevent");
      if (event.selectedSkuComb) {
        let id = event.selectedSkuComb.id;
        let num = event.selectedNum;
        this.$router.push({
          path: "/GoodsDetails/OrderConfirmation",
          query: { id: id, num: num },
        });
      } else {
        Toast("请选择规格");
      }
    },
    // 拼团详情接口
    GetActGroupDetai() {
      if (this.GetUserId()) {
        var a = this.GetUserId();
      }

      let data = {
        groupId: a,
      };
      GetActGroupDetaiAPI(data, "get").then((res) => {
        // 拼团详情
        this.goodDetailsData = res.data.goods;
        this.shopbanner = res.data.goods.mainImg.split(",");
        this.goodDetailsData.details = this.goodDetailsData.details;

        //所有
        this.goodDetailsAll = res.data;
        // 拼团活动
        this.GroupData = res.data.actGroup;
        // 拼团人数头像列表
        this.userImgslist = res.data.userImgs;

        // 拼团人数满员
        // this.GroupData.peopleNum = 2;

        if (this.GroupData.limitPeopleNum == this.GroupData.peopleNum) {
          this.Groupnum = true;
          // 当前用户是否参与的这个拼团
          if (res.data.isUseGroup == 1) {
            this.isUseGroup = true;
          } else {
            this.isUseGroup = false;
            this.GroupTexe = "该拼团已满";
            this.GroupTexeTow = "我要开团";
          }
        } else {
          if (res.data.isUseGroup == 1) {
            this.isUseGroup = true;
          } else {
            this.isUseGroup = false;
          }
        }

        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.sharesdk();
        } else {
          console.log("没有在微信环境");
        }

        var obj = new Date();
        var eTime = new Date(
          // '2020-09-30 00:00:00'
          this.GroupData.timeOverTime.replace(new RegExp("-", "gm"), "/")
        );
        this.time = eTime - obj;
        if (this.time <= 0) {
          //判断拼团时间是否结束
          this.Grouptime = true;
          if (res.data.isUseGroup == 1) {
            this.isUseGroup = true;
            this.GroupTexeThree = "重新开团";
          } else {
            this.isUseGroup = false;
            this.GroupTexe = "该拼团已满";
            this.GroupTexeTow = "我要开团";
            this.GroupTexeThree = "我要开团";
          }
        } else {
          this.Grouptime = false;
        }

        // 默认价格和原价格
        this.sku.price = res.data.goods.price;
        this.sku.stock_num = res.data.goods.stockQty;
        this.goods.picture = res.data.goods.baseImg + "?x-oss-process=style/b1";

        // sku
        this.sku.tree = res.data.goods.goodsPlist.map((item) => {
          return {
            id: item.id,
            categoryId: item.categoryId,
            k: item.propName, //规格名称
            sortIndex: item.sortIndex,
            groupName: item.groupName,
            creatorDate: item.creatorDate,
            k_s: item.tableName, //规格标识
            v: item.optlist
              ? item.optlist.map((i) => {
                  return {
                    id: i.id,
                    shopId: i.shopId,
                    propertyId: i.propertyId,
                    name: i.optName,
                    sortIndex: i.sortIndex,
                    creatorDate: i.creatorDate,
                    skuId: i.skuId,
                  };
                })
              : "",
          };
        });

        let arr = [];
        arr = res.data.goods.colorlist.map((item) => {
          return Object.assign({}, item, {
            name: item.colorName,
            imgUrl: item.imgStr ? item.imgStr + "?x-oss-process=style/b1" : "",
            previewImgUrl: item.previewImgUrl
              ? item.previewImgUrl + "?x-oss-process=style/b1"
              : "",
          });
        });

        let oln = res.data.goods.colorlist[0].tableName;

        this.sku.tree.unshift({
          k: "颜色分类",
          id: 0,
          activeName: 0,
          v: arr,
          k_s: oln,
        });

        this.sku.tree.forEach((item) => {
          // console.log(item.k);
          this.specificationsList.push(item.k);
        });
        console.log(this.specificationsList, "this.specificationsList");

        // sKUList
        this.sku.list = res.data.goods.skuList.map((item) => {
          return Object.assign(
            {},
            {
              id: item.id,
              shopId: item.shopId,
              categoryId: item.categoryId,
              skuNo: item.skuNo,
              barCode: item.barCode,
              goodsId: item.goodsId,
              imgId: item.imgId,
              skuName: item.skuName,
              price: item.price * 100, //价格
              vipPrice: item.vipPrice,
              stock_num: item.stockQty, //库存
              clickNum: item.clickNum,
              buyNum: item.buyNum,
              colorId: item.colorId,
              creatorDate: item.creatorDate,
              shopCode: item.shopCode,
              imageUrl: item.imageUrl,
              buyCnt: item.buyCnt,
            },
            ...(item.dataJson ? JSON.parse(item.dataJson) : "")
          );
        });

        console.log(this.sku.list, "list");

        // 默认选择的规格
        this.initialSku = this.sku.list[0];
        console.log(this.initialSku, "默认选择的规格");

        this.loadingshow = false;
      });
    },
    GetUserId() {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI("groupId").replace(/[\.\+\*]/g, "\\$&") +
              "(?:\\=([^&]*))?)?.*$",
            "i"
          ),
          "$1"
        )
      );
    },
    sharesdk() {
      let Name = window.localStorage.getItem("nickName");
      let groupId = this.GetUserId();

      let link =
        `${window.location.href.split("#")[0]}` +
        "#/GoodsDetails/GroupDetails?groupId=" +
        groupId;

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
              desc: Name + "邀请您进入兆客易购进行拼团",
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
        Toast("根据你浏览器的分享分享链接邀请好友拼团");
      }
    },
    sharesclick() {
      this.shareshadow = false;
    },
  },
  mounted() {
    this.GetActGroupDetai();
  },
};
</script>

<style lang="less" scoped>
.GroupDetails {
  width: 100%;
  min-height: 100%;
  height: auto;
  
  .shop_banner {
    width: 100%;
    height: 750px;
    .van-swipe {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
      /deep/ .custom-indicator {
        padding: 2px 5px;
        position: absolute;
        width: 60px;
        height: 28px;
        background: @text-colorA;
        opacity: @opacityfive;
        border-radius: 18px;
        color: @text-white;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 32px;
        right: 24px;
        font-size: 20px;
      }
    }
  }
  .shop_title {
    width: 100%;
    background: @text-white;
    border-radius: 0 0 16px 16px;
    .shop_title_d1 {
      padding: 24px 20px 0;
      // height: 100px;
      display: flex;
      align-items: center;
      position: relative;
      .pt_d3 {
        display: flex;
        align-items: baseline;
        .s1 {
          color: @main-color;
          font-size: 24px;
        }
        p {
          display: flex;
          align-items: center;
          .s2 {
            color: @main-color;
            font-size: 48px;
          }
          .s3 {
            color: @auxiliary-color;
            background: rgba(255, 137, 73, 0.2);
            font-size: 24px;
            margin-left: 18px;
            padding: 4px 8px;
            border-radius: 4px;
          }
        }
      }
      .d1 {
        flex: 1;
        .newprice {
          i {
            font-size: 36px;
            font-weight: normal;
            font-style: normal;
          }
          font-size: 48px;
          color: @main-color;
          font-weight: bold;
        }
        .oldprice {
          font-size: 24px;
          color: @text-colorC;
          padding-left: 12px;
          text-decoration: line-through;
        }
      }
      .d2 {
        display: flex;
        // flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f6f7f9;
        position: absolute;
        right: 0;
        padding: 4px 10px;
        border-radius: 24px 0 0 24px;
        img {
          width: 40px;
          height: 41px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-top: 2px;
        }
      }
    }
    .shop_title_d2 {
      padding: 24px 20px 30px;
      display: flex;
      // align-items: center;
      p {
        font-size: 32px;
        font-weight: bold;
        color: @text-colorA;
        line-height: 42px;
        padding: 0 20px 0 0px;
        flex: 1;
        // text-indent: 32px
      }
      .d2 {
        border-left: 1px solid rgba(177, 182, 195, 0.5);
        padding: 0 0 0 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        min-width: 10vw;
        justify-content: center;
        img {
          width: 40px;
          height: 41px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-top: 6px;
        }
      }
    }
    .shop_title_d3 {
      padding: 32px 20px 20px;
      ul {
        display: flex;
        font-size: 24px;
        color: @text-colorD;
        li {
          flex: 1;
          display: flex;
          align-items: center;
        }
        li:nth-child(1) {
          justify-content: flex-start;
        }
        li:nth-child(2) {
          justify-content: center;
        }
        li:nth-child(3) {
          justify-content: flex-end;
        }
      }
    }
  }
  // 邀请拼团
  .invitation_pt {
    padding: 0 20px 40px;
    .box {
      width: 98%;
      // height: 464px;
      background: rgba(255, 137, 73, 0.12);
      border: 2px solid rgba(255, 137, 73, 0.12);
      border-radius: 16px;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      .d1 {
        margin-top: 40px;
        font-size: 28px;
        display: flex;
        align-items: center;
        .s1 {
          color: @text-colorA;
          font-weight: bold;
          i {
            font-style: normal;
            color: @main-color;
          }
        }
        .s2 {
          color: @text-colorC;
          margin-left: 26px;
          font-size: 28px;
        }
      }
      .d5 {
        margin-top: 40px;
        font-size: 28px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .s1 {
          color: @text-colorA;
          font-weight: bold;
        }
        .d5_djs {
          display: flex;
          align-items: center;
          padding-top: 8px;
          color: @text-colorC;
          font-size: 28px;
          .s2 {
            color: @text-colorC;
            margin-left: 4px;
            font-size: 28px;
          }
        }
      }
      .d2 {
        display: flex;
        justify-content: space-between;
        margin: 50px 0 70px;
        .item {
          border: 1px dashed @main-color;
          border-radius: 50%;
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 88px;
            height: 88px;
            border-radius: 50%;
          }
        }
        .item:nth-child(1) {
          position: relative;
          span {
            position: absolute;
            padding: 2px;
            background: @main-color;
            border-radius: 4px;
            opacity: 0.8;
            font-size: 18px;
            color: #f5f6f7;
            top: 0;
            right: -9px;
          }
        }
        .item:nth-child(2) {
          margin: 0 44px;
        }
        .item2{
            border: 1px dashed rgba(177,182,195,0.6);
          }
      }
      .d3 {
        margin: 0 0 40px;
        display: flex;
        flex-direction: column;
        .b1 {
          width: 546px;
          height: 80px;
          background: linear-gradient(#e73a3a 0%, #f64242 100%);
          border-radius: 40px;
          box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
          color: @text-white;
          font-size: 32px;
          outline: none;
          border: none;
        }
        .b2 {
          width: 546px;
          background: none;
          border-radius: 40px;
          color: @main-color;
          font-size: 32px;
          outline: none;
          border: none;
          margin-top: 40px;
        }
      }
    }
  }
  // 详情
  .shop_details_title {
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @text-white;
    i {
      background: @text-colorD;
      width: 48px;
      height: 1px;
    }
    span {
      color: @text-colorD;
      font-size: 20px;
      margin: 0 8px;
    }
  }
  .shop_details_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    img {
      width: 100%;
    }
  }
  .shop_details_foot {
    width: 100%;
    .d1 {
      width: 90%;
      display: flex;
      justify-content: center;
      padding: 30px 0;
      margin: auto;
      button {
        width: 648px;
        height: 80px;
        background: linear-gradient(#e73a3a 0%, #f64242 100%);
        border-radius: 40px;
        box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
        outline: none;
        border: none;
        color: #fff;
        font-size: 32px;
      }
    }
    .d2 {
      width: 90%;
      display: flex;
      justify-content: center;
      padding: 30px 0;
      margin: auto;
      justify-content: space-between;
      .b1 {
        width: 250px;
        height: 80px;
        background: linear-gradient(#ff8949 0%, #ff8949 100%);
        border-radius: 38px;
        box-shadow: 0px 4px 10px 0px rgba(255, 137, 73, 0.24);
        outline: none;
        border: none;
        color: #fff;
        font-size: 32px;
      }
      .b2 {
        width: 380px;
        height: 80px;
        background: linear-gradient(#e73a3a 0%, #f64242 100%);
        border-radius: 40px;
        box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
        outline: none;
        border: none;
        color: #fff;
        font-size: 32px;
      }
    }
  }


  /deep/ .van-overlay {
    background: @backgroundBopcityW;
  }
  /deep/ .van-popup {
    height: 85%;
    border-radius: 40px 40px 0px 0px;
  }

  // sku 头部deep/
  /deep/.van-sku-header {
    margin-left: 20px;
    .van-sku-header__img-wrap {
      width: 160px;
      height: 160px;
      border-radius: 16px;
      overflow: hidden;
      margin: 24px 0;
      img {
        width: 160px;
        height: 160px;
      }
    }
    .van-sku-header__goods-info {
      height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 24px 48px 0 16px;
      .van-sku__goods-price {
        color: @main-color;
        display: flex;
        align-items: baseline;
        margin-bottom: 28px;
        .van-sku__price-symbol {
          font-size: 24px;
        }
        .van-sku__price-num {
          font-size: 40px;
        }
      }
      .van-sku-header-item {
        font-size: 22px !important;
        color: @text-colorB !important;
        line-height: normal !important;
        margin-top: 0 !important;
        .van-sku__stock {
          color: @text-colorB !important;
          margin-right: 0 !important;
          font-size: 22px !important;
        }
      }
    }
  }
  /deep/ .van-sku-body {
    .van-sku-group-container {
      margin-left: 20px;
      padding: 32px 0;
      .van-sku-row {
        margin: 0 20px 20px 0;
        .van-sku-row__title {
          padding-bottom: 26px;
          font-size: 24px;
          color: @text-colorC;
        }
        .van-sku-row__item--active {
          border: 1px solid rgba(238, 10, 36, 0.3) !important;
          background: rgba(236, 10, 36, 0.1) !important;
        }
        .van-sku-row__item {
          margin: 0 34px 23px 0;
          background: #f5f7f7;
          border: 1px solid #f5f7f7;
          border-radius: 10px;
          .van-sku-row__item-img {
            width: 42px;
            height: 42px;
            margin: 12px;
          }
          .van-sku-row__item-name {
            font-size: 28px;
            line-height: initial;
            //  color:@text-colorA;
            padding: 10px 15px;
          }
        }
      }
    }
    .van-sku-stepper-stock {
      margin-left: 20px;
      padding: 12px 0;
      .van-sku-stepper-container {
        margin-right: 20px;
        display: flex;
        align-items: center;
        .van-sku__stepper-title {
          font-size: 24px;
          color: @text-colorC;
          flex: 1;
          line-height: inherit;
        }
        .van-sku__stepper {
          float: initial;
          // 左边按钮的大小
          .van-stepper__minus {
            width: 48px;
            height: 48px;
            border-radius: 16px;
          }
          // 右边按钮的大小
          .van-stepper__plus {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            font-size: 32px;
          }
          // 左边文字的大小
          .van-stepper__minus::before {
            width: 20px;
          }
          // 右边文字的大小
          .van-stepper__plus::before {
            width: 20px;
          }
          .van-stepper__plus::after {
            height: 20px;
          }
          // 中间文字的大小
          .van-stepper__input {
            background: none;
            font-size: 32px;
            width: 60px;
            height: auto;
          }
        }
      }
    }
  }
  /deep/ .van-sku-actions {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .foot_div1 {
      width: 750px;
      height: 80px;
      background: @button-auxiliarybackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;
    }
    .foot_div1:active {
      background: @button-auxiliarybackground-on;
    }
    .foot_div2 {
      width: 750px;
      height: 80px;
      background: @button-mainbackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;
    }
    .foot_div2:active {
      background: @button-mainbackground-on;
    }
    .van-button--warning {
      width: 347px;
      height: 80px;
      background: @button-auxiliarybackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
    }
    .van-button--warning:active {
      background: @button-auxiliarybackground-on;
    }
    .van-button--danger {
      width: 347px;
      height: 80px;
      background: @button-mainbackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
    }
    .van-button--danger:active {
      background: @button-mainbackground-on;
    }
  }
  /deep/ .van-popup__close-icon {
    font-size: 32px !important;
  }

  // 邀请好友
  .shareshadow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    left: 0;
    img {
      width: 60%;
      position: absolute;
      top: 10%;
      right: 10%;
    }
  }

}
</style>