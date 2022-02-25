<template>
  <div class="OnlyRefund">
    <div class="ApplyRefund_title">
      <div class="ApplyRefund_title_item">
        <img :src="ShopDetails.imageUrl+'?x-oss-process=style/b1'" alt class="showimg" />
        <div class="showtext">
          <p>{{ShopDetails.goodsName}}</p>
          <p>
            <span
              v-for="(item,indexThree) in ShopDetails.ShopDetailskey"
              :key="indexThree"
            >{{item.Key}}: {{item.Value}} ;</span>
          </p>
        </div>
      </div>
    </div>

    <div class="ApplyRefund_content">
      <!-- 退款 -->
      <div class="why" @click="tctype()">
        <p>
          <span class="s1">*</span>
          <span class="s2">退款原因：</span>
          <span class="s3">{{submitdata.ReturnReason}}</span>
        </p>
        <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
      </div>

      <!-- 退款金额  -->
      <div class="amount">
        <p class="p1">
          <span class="s1">*</span>
          <span class="s2">退款金额：</span>
          <!-- <input type="number" :class="orderS?'s3':'s3active'" v-model="submitdata.ReturnPrice" /> -->
          <input type="number" class="s3" v-model="submitdata.ReturnPrice" />
          <!-- <span class="s3">￥{{ShopDetails.totalPrice}}.00</span> -->
        </p>

        <p class="p2" v-if="ShopDetails.isShipment==0">*可修改，退款金额包含邮费，最多退款￥{{ShopDetails.totalPrice}}</p>
        <p class="p2" v-else>*可修改，退款金额不包含邮费，最多退款￥{{ShopDetails.totalPrice}}</p>
      </div>

      <!-- 退款说明 -->
      <div class="instructions">
        <span>退款说明：</span>
        <input type="text" placeholder="您想说些什么" v-model="submitdata.ReturnRmk" />
      </div>

      <!-- 上次凭证 -->
      <div class="credentials">
        <div class="top">
          <span>上次凭证</span>
          <span>*最多上传三张</span>
        </div>
        <div class="bottom">
          <van-uploader
            v-model="fileList"
            multiple
            :max-count="3"
            :after-read="afterRead"
            @delete="deleteRead"
          />
        </div>
      </div>
    </div>

    <div class="ApplyRefund_foot">
      <button
        @click="submit()"
        :class="submitdata.ReturnPrice&&submitdata.ReturnReason?'buttonactive':''"
      >提交</button>
    </div>

    <!-- 退款原因 -->
    <van-popup v-model="type" round position="bottom">
      <div class="type_shadow">
        <div class="type_shadow_top">
          <span>选择退款理由</span>
          <img src="@/assets/images/home/gbdelete.png" @click="gbtype()" alt />
        </div>
        <div class="type_shadow_bottom">
          <div class="type_shadow_content">
            <ul>
              <li
                v-for="(item,index) in typedata"
                :key="index"
                @click="xztype(index,item.dictName)"
              >
                <div class="left">
                  <p class="p1" :class="{typeactive: item.activeName == index}">{{item.dictName}}</p>
                </div>
                <div class="right">
                  <van-checkbox v-model="item.typechecked" checked-color="#F42636"></van-checkbox>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="type_shadow_foot">
          <div class="foot3">
            <button class="b2" @click="confirmCoupon()">关闭</button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Checkbox, CheckboxGroup, Toast } from "vant";
import { Uploader } from "vant";

// Popup 动作面板
import { Popup } from "vant";
import { compress } from "@/common/js/compression.js";
import {
  GetReturnShopOrderListAsyncAPI,
  GetReturnReasonListAsyncAPI,
  ReturnShopOrderAsyncAPI,
  PutImageAPI,
  GetReturnShopOrderModelAsyncAPI
} from "@/api/MyApi";

import qs from "qs";

export default {
  name: "OnlyRefund",
  data() {
    return {
      fileList: [],
      fileListTow: [],
      ShopDetails: {
        ShopDetailskey: []
      },
      type: false, //判断优惠券弹出框的显示隐藏
      typedata: [],
      submitdata: {
        ReturnReason: "",
        ReturnRmk: "",
        ReturnPrice: ""
      },
      titledata: "申请退款", //控制title的动态变量
      orderstatus: 0,
      RefundType: 0,
      orderS:true
    };
  },
  components: {
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  methods: {
    // 点击退款原因
    tctype() {
      this.type = true;
    },
    // 选择退款原因
    xztype(index, storeName) {
      //index 优惠券弹框的列表，istext优惠券弹框的内容，storeName 整个商铺的列表index
      this.typedata.forEach((item, index) => {
        this.typedata[index].typechecked = false;
        this.typedata[index].activeName = null;
      });
      this.typedata[index].activeName = index;
      this.typedata[index].typechecked = true;
      this.submitdata.ReturnReason = storeName;
      this.type = false;
    },
    // 确认退款原因
    confirmCoupon() {
      this.type = false;
    },
    //关闭退款弹框
    gbtype() {
      this.type = false;
    },
    // 提交退款申请
    submit() {
      //提交退款申请
      console.log(
        this.fileListTow,
        "this.fileListTowthis.fileListTowthis.fileListTow"
      );
      let data = qs.stringify({
        OitemIDS: this.$route.query.ID,
        ID: this.$route.query.ReturnId,
        VoucherImgId: this.fileListTow.join(","), //退款图片id
        ReturnReason: this.submitdata.ReturnReason, //退款原因
        ReturnRmk: this.submitdata.ReturnRmk, //退款说明
        Rmk: "",
        ReturnAccount: "",
        ReturnPrice: this.submitdata.ReturnPrice,
        TransCo: "",
        TransNo: "",
        ReturnType: 1, //1全订单，2货品
        RefundType: this.RefundType //退款类型（1退款退货，2发货仅退款，3未发货退款）
      });
      
      console.log(data, "退款类型（1退款退货，2发货仅退款，3未发货退款）");
      //  return false;
      ReturnShopOrderAsyncAPI(data, "post").then(res => {
        console.log(res, "提交退款申请");
        this.$router.replace({
          path: "/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/RefundOf",
          query: { orderNo: res.data[0].returnNo }
        });
      });
    },
    //获取商品信息
    GetShopDetails() {
      let data = {
        OitemIDS: this.$route.query.ID
      };
      GetReturnShopOrderListAsyncAPI(data, "get").then(res => {
        console.log(res);
        this.ShopDetails = res.data;
        this.ShopDetails.ShopDetailskey = res.data.orderOtherData
          ? JSON.parse(res.data.orderOtherData)
          : "";


        this.submitdata.ReturnPrice = res.data.totalPrice;

        this.GetRefundReason(res.data.isShipment)
      });
    },
    GetShopDetailsReturn() {
      let data = {
        ID: this.$route.query.ReturnId
      };
      GetReturnShopOrderModelAsyncAPI(data, "get").then(res => {
        console.log(res, "获取退款的数据");
        this.ShopDetails.imageUrl = res.data.goodsImg;
        this.ShopDetails.goodsName = res.data.goodsName;
        this.ShopDetails.ShopDetailskey = res.data.orderOtherData
          ? JSON.parse(res.data.orderOtherData)
          : "";

        this.ShopDetails.totalPrice = res.data.totalPrice;

        this.submitdata.ReturnReason = res.data.returnReason;
        this.submitdata.ReturnPrice = res.data.returnPrice;
        this.submitdata.ReturnRmk = res.data.returnRmk;
        // let { returnReason, returnPrice, returnRmk } = res.data;
        // this.submitdata = { ReturnReason, ReturnPrice, ReturnRmk }
          if(res.data.refundType==3){
              this.GetRefundReason(0)
          }else{
             this.GetRefundReason(1)
          }

          

        console.log(this.ShopDetails, "this.ShopDetails");
        console.log(this.submitdata, "this.submitdata");
      });
    },
    // 获取退款原因
    GetRefundReason(isShipment) {
      let data={
        isShipment:isShipment
      }
      GetReturnReasonListAsyncAPI(data, "get").then(res => {
        // console.log(res);
        this.typedata = res.data.map(item => {
          return Object.assign({}, item, { typechecked: null });
        });
      });
    },

    afterRead(file, e) {
      console.log(file);
      console.log(e);

      let fileTow = file.file;
      // console.log(file);
      const _that = this; // const isLt10M = file.size / 1024 / 1024 < 10; // if (!isLt10M) { //   this.$message.error("上传图片大小不能超过 10M!"); //   return false; // } else { // }
      const image = new Image();
      image.src = URL.createObjectURL(fileTow); //解码URL
      image.onload = function() {
        const that = this;
        // console.log(that.width, "that.width");
        // console.log(that.height, "that.height");
        if (that.width < 2048 && that.height < 2048) {
          //判断图片的长宽都小于2048就不进行压缩
          let formData = new FormData();
          formData.append("file", fileTow);
          PutImageAPI(formData, "post", 2).then(res => {
            console.log(res, "上传图片  不满足条件不进行压缩");
            _that.fileListTow.push(res.data[0].id);
            console.log(_that.fileListTow);
          });
        } else {
          compress(fileTow, function(val) {
            // console.log(val);
            let formData = new FormData();
            formData.append("file", val);
            PutImageAPI(formData, "post", 2).then(res => {
              console.log(res, "上传图片 进行压缩");
              _that.fileListTow.push(res.data[0].id);
            });
          });
        }
      };
    },
    deleteRead(file, e) {
      console.log(file, e);
      this.fileListTow.splice(e.index, 1);
      console.log(this.fileListTow);
    }
  },
  mounted() {
    document.title = this.titledata;

    if (this.$route.query.ReturnId) {
      this.GetShopDetailsReturn();
    } else {
      this.GetShopDetails();
    }

    // this.GetRefundReason();
    this.orderstatus = this.$route.query.orderstatus;
    if (this.orderstatus === 3) {
      this.RefundType = 2;
    } else {
      this.RefundType = 3;
    }
  },
  watch: {
    "submitdata.ReturnPrice": function(val) {
      if (val > this.ShopDetails.totalPrice) {
        this.submitdata.ReturnPrice = this.ShopDetails.totalPrice;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.OnlyRefund {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .ApplyRefund_title {
    padding: 0 40px;
    background: @text-white;
    .ApplyRefund_title_item {
      height: 120px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .showimg {
        width: 100px;
        height: 100px;
        border-radius: 8px;
      }
      .showtext {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 16px;
        p:nth-child(1) {
          font-size: 28px;
          font-weight: 400;
          color: @text-colorB;
          line-height: 32px;

          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        p:nth-child(2) {
          font-size: 20px;
          font-weight: 400;
          line-height: 26px;
          color: @text-colorD;
          padding-top: 12px;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .ApplyRefund_content {
    margin: 36px 20px 0;
    .why {
      padding: 0 20px;
      height: 88px;
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      display: flex;
      align-items: center;
      p {
        flex: 1;
        .s1 {
          color: @main-color;
        }
        .s2 {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
        .s3 {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
      }
      img {
        width: 13px;
        height: 24px;
      }
    }
    .amount {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 16px;
      .p1 {
        height: 88px;
        display: flex;
        align-items: center;
        background: @text-white;
        box-shadow: @other-shadow;
        border-radius: 16px;
        padding: 0 20px;
        .s1 {
          color: @main-color;
        }
        .s2 {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
        .s3 {
          font-size: 28px;
          color: @main-color;
          outline: none;
          border: none;
          pointer-events: auto;
        }
        .s3active{
          font-size: 28px;
          color: @main-color;
          outline: none;
          border: none;
          pointer-events: none;
        }
      }
      .p2 {
        font-size: 20px;
        color: @text-colorC;
        padding: 0 20px;
        padding-top: 16px;
      }
    }
    .instructions {
      padding: 0 20px;
      height: 88px;
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      display: flex;
      align-items: center;
      margin-top: 28px;
      span {
        font-size: 28px;
        color: @text-colorA;
        font-weight: 500;
      }
      input {
        font-size: 28px;
        outline: none;
        border: none;
        flex: 1;
      }
    }
    .credentials {
      padding: 30px 20px;
      background: @text-white;
      box-shadow: @other-shadow;
      border-radius: 16px;
      margin-top: 16px;
      .top {
        display: flex;
        align-items: baseline;
        span:nth-child(1) {
          font-size: 28px;
          color: @text-colorA;
          font-weight: 500;
        }
        span:nth-child(2) {
          font-size: 20px;
          color: @text-colorC;
          padding-left: 4px;
        }
      }
      .bottom {
        padding-top: 36px;
        /deep/ .van-uploader__upload {
          width: 140px;
          height: 140px;
          border: 1px dashed @text-colorD;
          border-radius: 20px;
          background: @text-white;
          .van-uploader__upload-icon {
            font-size: 40px;
          }
        }
        /deep/ .van-uploader__preview {
          width: 140px;
          height: 140px;
          border: 1px dashed @text-colorD;
          border-radius: 20px;
          margin: 0 20px 0 0;
          .van-uploader__preview-image {
            width: 140px;
            height: 140px;
            border-radius: 20px;
          }
          .van-uploader__preview-delete {
            font-size: 28px;
          }
        }
      }
    }
  }
  .ApplyRefund_foot {
    width: 100%;
    height: 80px;
    position: fixed;
    bottom: 30px;
    display: flex;
    justify-content: center;
    button {
      width: 96%;
      height: 80px;
      background: @text-colorD;
      opacity: 0.5;
      border-radius: 40px;
      font-size: 32px;
      font-weight: 500;
      color: @text-white;
      outline: none;
      border: none;
      pointer-events: none;
    }

    .buttonactive {
      opacity: 1;
      background: @button-mainbackground;
      pointer-events: unset;
    }
  }
  /deep/ .van-popup {
    height: 85%;
    border-radius: 40px 40px 0px 0px;
  }
  .type_shadow {
    width: 100%;
    height: 100%;
    .type_shadow_top {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      span {
        font-size: 32px;
        color: @text-colorA;
        flex: 1;
        padding-left: 40px;
      }
      img {
        width: 24px;
        height: 24px;
        padding-right: 40px;
      }
    }
    .type_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      padding-bottom: 100px;
      .type_shadow_content {
        margin: 0 20px;
        display: flex;
        ul {
          width: 100%;
          li {
            width: 100%;
            display: flex;
            align-items: center;
            // border-bottom: 1px solid @base-color;
            padding: 30px 0;
            .left {
              flex: 3;
              display: flex;
              // color: @main-color;
              .p1 {
                font-size: 28px;
                font-weight: 500;
                columns: @text-colorA;
              }
              .p2 {
                font-size: 24px;
                line-height: 30px;
                color: @text-colorC;
              }
            }
            .right {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              padding-right: 12px;
            }
          }
          .typeactive {
            color: @main-color !important;
          }
        }
      }
    }
    .type_shadow_foot {
      height: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 0;
      background: @text-white;
      z-index: 999;
      .foot3 {
        margin: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 32px;
        font-weight: 500;
        color: @text-white;
        .b2 {
          width: 100%;
          height: 80px;
          border-radius: 40px;
          outline: none;
          border: none;
          background: @button-mainbackground;
        }
        .b2:active {
          background: @button-mainbackground-on;
        }
      }
    }
  }
}
</style>