<template>
  <div class="ToEvaluate">
    <div class="ToEvaluate_item" v-for="(item,index) in EvaluateList" :key="index">
      <div class="ApplyRefund_title_item">
        <img :src="item.imageUrl+'?x-oss-process=style/n4'" alt class="showimg" />
        <div class="showtext">
          <p>{{item.goodsName}}</p>
          <p>
            <span
              v-for="(itemB,indexThree) in item.orderOtherData"
              :key="indexThree"
            >{{itemB.Key}}: {{itemB.Value}} ;</span>
          </p>
        </div>
      </div>

      <!-- 产品评价 -->
      <div class="ToEvaluate_center">
        <div class="d1">
          <span>产品评价</span>
        </div>
        <div class="d2">
          <div class="left">
            <van-rate v-model="item.value" @change="onChange($event,index)" />
          </div>
          <span class="right">{{item.valuetext}}</span>
        </div>
      </div>

      <!-- 评价内容 -->
      <div class="ToEvaluate_centerTow">
        <textarea
          name
          id
          cols="30"
          rows="6"
          placeholder="描述一下商品吧，小伙伴们很需要你的意见"
          v-model="item.Review"
          maxlength="200"
        ></textarea>
      </div>

      <div class="ToEvaluate_bottom" @click="suindex(index)">
        <van-uploader
          v-model="item.fileList"
          multiple
          :max-count="3"
          :after-read="afterRead"
          @delete="deleteRead"
        />
      </div>
    </div>

    <div class="ToEvaluate_foot">
      <button :class="comp?'':''" @click="submit">发布评价</button>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import { Rate, Toast } from "vant";

import { Uploader } from "vant";
import {
  GetReturnShopOrderListAsyncAPI,
  PutImageAPI,
  GetBusOrderReviewListAsyncAPI,
  SaveBusOrderReview1ListAsync
} from "@/api/MyApi";

import qs from "qs";

import { compress } from "@/common/js/compression.js";

const Base64 = require('js-base64').Base64;

export default {
  name: "",
  data() {
    return {
      EvaluateList: [],
      submitData: {
        plist: [],
        orderNo: ""
      },
      indexBig: -1,
      comp:false
    };
  },
  components: {
    [Rate.name]: Rate,
    [Uploader.name]: Uploader
  },
  methods: {
    suindex(index) {
      console.log(index);
      this.indexBig = index;
    },
    onChange(value, index) {
      switch (value) {
        case 1:
          this.EvaluateList[index].valuetext = "真是太差劲了";
          break;
        case 2:
          this.EvaluateList[index].valuetext = "很一般";
          break;
        case 3:
          this.EvaluateList[index].valuetext = "还行吧";
          break;
        case 4:
          this.EvaluateList[index].valuetext = "很赞";
          break;
        default:
          this.EvaluateList[index].valuetext = "真是太赞了";
          break;
      }
    },
    afterRead(file, e) {
      console.log(file);
      console.log(e);
      // console.log(file,"$event");
      // console.log(index,"上传图片时候的index")

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

            console.log(_that.EvaluateList);

            _that.EvaluateList[_that.indexBig].fileimglist.push(res.data[0].id);

            _that.imageUrl = `${res.data[0].imgPath}?x-oss-process=style/n5`;
          });
        } else {
          compress(fileTow, function(val) {
            // console.log(val);
            let formData = new FormData();
            formData.append("file", val);
            PutImageAPI(formData, "post", 2).then(res => {
              console.log(res, "上传图片 进行压缩");

              _that.EvaluateList[_that.indexBig].fileimglist.push(
                res.data[0].id
              );
              _that.imageUrl = `${res.data[0].imgPath}?x-oss-process=style/n5`;
            });
          });
        }
      };
    },
    deleteRead(file, e) {
      console.log(this.indexBig);
      console.log(file, e);
      this.EvaluateList[this.indexBig].fileimglist.splice(e.index, 1);
    },
    //评价列表获取
    GetShopDetails() {
      let data = {
        O_ID: this.$route.query.IDs
      };
      GetBusOrderReviewListAsyncAPI(data, "get").then(res => {
        this.EvaluateList = res.data.map(item => {
          return {
            id: item.id,
            orderId: item.orderId,
            shopId: item.shopId,
            userId: item.userId,
            skuId: item.skuId,
            goodsId: item.goodsId,
            categroyId: item.categroyId,
            goodsName: item.goodsName,
            qty: item.qty,
            price: item.price,
            itemTotalPrice: item.itemTotalPrice,
            totalPrice: item.totalPrice,
            imgId: item.imgId,
            favouredPrice: item.favouredPrice,
            orderOtherData: item.orderOtherData
              ? JSON.parse(item.orderOtherData)
              : "",
            returnAddressId: item.returnAddressId,
            returnStatus: item.returnStatus,
            isReturn: item.isReturn,
            creatorDate: item.creatorDate,
            pkValue: item.pkValue,
            imageUrl: item.imageUrl,
            statusStr: item.statusStr,
            skuOpt: item.skuOpt,
            refundID: item.refundID,
            value: 5,
            valuetext: "真的是太赞了",
            fileList: [],
            fileimglist: [],
            Review: ""
          };
        });
        console.log(this.EvaluateList, "GetBusOrderReviewListAsyncAPI");
      });
    },
    publish() {},
    //提交
    submit() {
      console.log(this.EvaluateList);


      let listData = this.EvaluateList.map(item => {
        return {
          ID: item.id,
          Start: item.value,
          ReviewBody:this.replaceData(item.Review),
          ReviewImg: item.fileimglist.join(",")
        };
      });
      
      var plist = qs.stringify({ plist: listData });
      console.log(this.submitData);

      SaveBusOrderReview1ListAsync(plist,"post",true,this.$route.query.OrderNo)
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            // 跳转去 去评价
            this.$router.replace({
              path: "/My/Myorder",
              query: { orderstatus: 5 }
            });
            Toast("评价提交成功");
          }
        })
        .catch(err => {});
    },
    replaceData(str){
       var reg=/[']/g
       let strTow=str.replace(reg,"''");
       return strTow;
    },
    //提交的内容是否有单引号
    replaceLikeVal(comp) {
      if (comp.indexOf("'") == -1&&comp.indexOf(";")== -1) {
        console.log("没有分号和单引号");
        this.comp=true
      } else {
        console.log("有");
        this.comp=false
      }
    }
  },
  mounted() {
    this.GetShopDetails();
  }
};
</script>

<style lang="less" scoped>
.ToEvaluate {
  width: 100%;
  background: @text-white;
  min-height: 100%;
  height: auto;
  padding-bottom: 120px;
  box-sizing: border-box;
  .ToEvaluate_item {
    padding: 0 40px;
    background: @text-white;
    border-bottom: 16px solid @base-color;
    .ApplyRefund_title_item {
      height: 110px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 12px 0;
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
        width: 400px;
        p:nth-child(1) {
          font-size: 28px;
          font-weight: 400;
          color: @text-colorB;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          height: 40px;
          line-height: 40px;
        }
        p:nth-child(2) {
          font-size: 20px;
          font-weight: 400;
          line-height: 26px;
          color: @text-colorD;
          // padding-top: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          height: 36px;
        }
      }
    }
    .ToEvaluate_center {
      width: 100%;
      border-bottom: 1px solid @base-color;
      .d1 {
        padding: 16px 0;
        display: flex;
        align-items: center;
        font-size: 28px;
        color: @text-colorB;
      }
      .d2 {
        display: flex;
        padding: 8px 0 28px;
        .left {
          flex: 1;
          /deep/ .van-rate__item:not(:last-child) {
            padding-right: 12px;
          }
          /deep/ .van-rate__icon--full {
            color: #ff8949;
          }
          /deep/ .van-rate__icon {
            font-size: 32px;
          }
        }
        .right {
          font-size: 24px;
          color: @text-colorA;
        }
      }
    }
    .ToEvaluate_centerTow {
      width: 100%;
      padding: 20px 0;
      textarea {
        width: 100%;
        font-size: 28px;
        font-weight: 400;
        color: @text-colorA;
        line-height: 38px;
        border: none;
        outline: none;
        resize: none;
      }
    }
    .ToEvaluate_bottom {
      padding-bottom: 30px;
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
        margin: 0 40px 0 0;
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
  .ToEvaluate_foot {
    width: 100%;
    position: fixed;
    bottom: 40px;
    height: 80px;
    display: flex;
    justify-content: center;
    button {
      width: 94%;
      height: 80px;
      background: linear-gradient(
        0deg,
        rgba(231, 58, 58, 1),
        rgba(246, 66, 66, 1)
      );
      border-radius: 40px;
      outline: none;
      border: none;
      color: @text-white;
    }
  }
}
</style>