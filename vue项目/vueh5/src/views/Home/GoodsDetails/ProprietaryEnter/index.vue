<template>
  <div class="ProprietaryEnter">
    <div class="noticeBar flex jc-sb" v-if="isTrueValID == 0">
      <span class="ml-40">根据相关法规规定，提现需实名认证</span>
      <span class="toComfirm mr-40" @click="toComfirm">去认证></span>
    </div>

    <div class="ProprietaryEnter_box">
      <form style="padding-top: 1vw">
        <div class="input_item flex aic">
          <span class="item_name">门店名称：</span>
          <input
            :disabled="isEditType"
            value
            type="text"
            class="item_input"
            placeholder="店铺全称"
            v-model="submitData.PpName"
          />
        </div>
        <div class="input_item flex aic" v-if="!isEditType">
          <span class="item_name">门店地址：</span>
          <div class="divbox" @click="jumpProprietaryLocation()">
            <input
              :disabled="true"
              value
              type="text"
              class="item_input"
              placeholder="选择门店地址"
              v-model="coAddress"
            />
            <img
              src="@/assets/images/1.6_img/ziying_home_icon1@2x.png"
              alt=""
            />
          </div>
        </div>
        <div class="input_item flex aic">
          <span class="item_name">详细地址：</span>
          <input
            :disabled="isEditType"
            value
            type="text"
            class="item_input"
            placeholder="楼层、门牌号、商铺名称"
            v-model="DetailedAddress"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">联系姓名：</span>
          <input
            :disabled="isEditType"
            value
            type="text"
            class="item_input"
            placeholder="如何称呼您"
            v-model="submitData.LinkMan"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">联系电话：</span>
          <input
            value
            :disabled="isEditType"
            type="number"
            class="item_input"
            placeholder="如何联系您"
            v-model="submitData.LinkTel"
            @input="phoneNumberChange"
            oninput="if(value.length>11)value=value.slice(0,11)"
          />
        </div>
        <div v-if="!isEditType" class="input_item flex aic">
          <span class="item_name">验 证 码：</span>
          <div class="right flex jc-sb w100pc">
            <input
              :disabled="isEditType"
              class="getCode"
              type="text"
              placeholder="输入6位短信验证码"
              v-model="submitData.Code"
              oninput="if(value.length>6)value=value.slice(0,6)"
            />
            <div
              @click="getCode"
              v-bind:class="{
                SecurityCode: result,
                zcclass: !result,
                noClick: disabled,
              }"
            >
              {{ msg }}
            </div>
          </div>
        </div>
        <div class="input_item flex aic">
          <span class="item_name">社会信用码：</span>
          <input
            :disabled="isEditType"
            value
            type="text"
            class="item_input"
            placeholder="输入社会统一信用代码即可"
            v-model="submitData.CreditCode"
          />
        </div>

        <div class="input_item2 flex aic">
          <span class="item_name">店铺门头： </span>
          <div class="divbox2">
            <div class="divbox2_d1">
              <van-uploader
                v-model="fileList"
                multiple
                :max-count="1"
                :after-read="afterRead"
                @delete="deleteRead(0)"
              />
              <div class="sc_input">
                <img
                  src="@/assets/images/1.6_img/ziying_shenqing_icon1.png"
                  alt=""
                />
                <p>*请上传店铺正面照，需要露出店铺招牌</p>
                <button>上传</button>
              </div>
            </div>
            <div class="divbox2_d2">
              <div class="v1">
                <van-uploader
                  v-model="fileList2"
                  multiple
                  :max-count="1"
                  :after-read="afterReadTow"
                  @delete="deleteRead(1)"
                />
                <div class="sc_input">
                  <img src="@/assets/images/ph.png" alt="" />
                  <span>更多店铺照片</span>
                </div>
              </div>
              <div class="v2">
                <van-uploader
                  v-model="fileList3"
                  multiple
                  :max-count="1"
                  :after-read="afterReadThree"
                  @delete="deleteRead(2)"
                />
                <div class="sc_input">
                  <img src="@/assets/images/ph.png" alt="" />
                  <span>更多店铺照片</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="submit_btn"
          :class="isActive ? 'submit_btn_active' : 'disabled_btn'"
          @click="submit(isEditType)"
        >
          {{ isEditType ? "编辑申请" : "提交申请" }}
        </div>
      </form>
      <p class="forThanks flex2 aic">
        <span>尊敬的商家，您好！感谢您选择我们。</span>
        <span>您提交申请后，3日内将会有我们的业务人员联系您。</span>
        <span>
          如有疑问请拨打：
          <span class="phoneNumber">
            <a href="javascript:;">400-7777-316</a>
          </span>
        </span>
      </p>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>
<script>
import { GetStoreInformationAPI } from "@/api/Proprietary";
//Toast提示
import { Toast } from "vant";
import { TrueValIDCodeVerifyAPI, TrueValIDAPI } from "@/api/Iocome";
import qs from "qs";
import { Icon } from "vant";

import { compress } from "@/common/js/compression.js";
import { Uploader } from "vant";

import { PutImageAPI } from "@/api/MyApi";
import { MyBaseDataAPI } from "@/api/MyApi";
import {
  ApplySettleAPI,
  CodeVerifyAPI,
  SetPickupImgAPI,
} from "@/api/Proprietary";
import loading from "@/components/loading";

export default {
  name: "ProprietaryEnter",
  data() {
    return {
      loadingshow: true, //loading是否消失
      isTrueValID: 0, //是否认证
      pickupType: "", //状态 是否为编辑状态
      pickupId: "", //门店id
      coAddress: "", //地址
      DetailedAddress: "", //详细地址
      submitData: {
        ShopId: window.localStorage.getItem("ShopId"), //当前店铺id
        PpName: "", //门店名称
        PpAddress: "", //地址
        LinkMan: "", //联系人
        LinkTel: "", //门店联系方式
        Code: "", //验证码
        FlagGuid: "", //验证码唯一标识
        CreditCode: "", //输入社会统一信用代码即可
        Lon: "", //经度
        Lat: "", //纬度
        MainProducts: "", //主营产品
        LogoImgid: "", //门店LOGO
        Imgs: "", //门店图片
      },
      result: false, //手机号是否存在
      disabled: false, //无法点击
      msg: "获取验证码",
      fileimgid: [],
      fileimgidOne: "", //第一个id
      fileimgidTow: "", //第二个id
      fileimgidThree: "", //第三个id
      fileList: [],
      fileList2: [],
      fileList3: [],
    };
  },
  components: {
    [Uploader.name]: Uploader,
    loading: loading,
  },
  computed: {
    // 是否可以修改的状态
    isEditType: function () {
      return this.pickupType == "edit";
    },
    // 提交按钮的高亮   判断是否编辑状态
    isActive: function () {
      if (this.pickupType != "edit") {
        return (
          this.submitData.PpName &&
          this.coAddress &&
          this.DetailedAddress &&
          this.submitData.LinkMan &&
          this.submitData.LinkTel &&
          this.submitData.Code &&
          this.submitData.CreditCode &&
          this.fileimgidOne != ''&&
          this.fileimgidTow != ''&&
          this.fileimgidThree != ''
        );
      } else {
        return (
          this.submitData.PpName &&
          this.DetailedAddress &&
          this.submitData.LinkMan &&
          this.submitData.LinkTel &&
          this.submitData.CreditCode &&
          this.fileimgidOne != ''&&
          this.fileimgidTow != ''&&
          this.fileimgidThree != ''
        );
      }
    },
  },
  methods: {
    getEditInfor() {
      let data = {
        id: this.$route.query.id,
      };
      GetStoreInformationAPI(data, "get").then((res) => {
        console.log(res, "ress");
        this.submitData.PpName = res.data.ppName;
        this.submitData.LinkMan = res.data.linkMan;
        this.submitData.LinkTel = res.data.linkTel;
        this.submitData.CreditCode = res.data.creditCode;
        this.DetailedAddress = res.data.ppAddress;
        this.submitData.Imgs = res.data.imgs;

       

        this.fileimgidOne = res.data.imgs.split(",")[0];
        this.fileimgidTow = res.data.imgs.split(",")[1];
        this.fileimgidThree = res.data.imgs.split(",")[2];

       console.log(res.data.imgs.split(","),"res.data.imgs.split(",")")

        this.fileList = [
          {
            url: res.data.imgList[0] + "?x-oss-process=style/n5",
            isImage: true,
          },
        ];
        this.fileList2 = [
          {
            url: res.data.imgList[1] + "?x-oss-process=style/n5",
            isImage: true,
          },
        ];
        this.fileList3 = [
          {
            url: res.data.imgList[2] + "?x-oss-process=style/n5",
            isImage: true,
          },
        ];
      });
    },
    // 判断手机号是否存在
    phoneNumberChange(e) {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      //判断手机号是否存在
      let reg = /^1\d{10}$/;
      // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      let result1 = reg.test(this.submitData.LinkTel);
      console.log(result1, "result1 result1 result1");
      this.result = result1;
    },
    getCode() {
      // 最好存一下this 这样的话就不会出现this指向问题 这里如果用function(){} 就必须用self=this 来存一下
      let num = 60;
      let self = this;
      //判断手机号是否存在
      let reg = /^1\d{10}$/;
      let result = reg.test(self.submitData.LinkTel);
      self.result = false;
      //先判断输入的东西是不是手机号 在做判断
      if (result) {
        if (self.submitData.LinkTel === "") {
        } else {
          this.getMsgCode();
          let timer = setInterval(() => {
            // console.log(self.result);
            self.result = false;
            --num;
            self.disabled = true;
            if (num === 0) {
              clearInterval(timer);
              self.result = true;
              self.$nextTick(() => {
                self.msg = "重新获取";
              });

              self.disabled = false;
            }

            self.msg = `(${num})s后重试`;
            // console.log(num);
          }, 1000);
          self.msg = `(${num})s后重试`;
        }
      } else {
        alert("请输入正确的手机号");
      }
    },
    // 获取短信验证码
    getMsgCode() {
      // console.log(this.myinput1value);
      let data = {
        Mobile: this.submitData.LinkTel,
      };
      CodeVerifyAPI(data).then((res) => {
        this.submitData.FlagGuid = res.data;
        // if (res.Code) {
        //   Toast(res.msg);
        // }
      });
    },
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      let fileTow = file.file;
      const _that = this;
      // const isLt10M = file.size / 1024 / 1024 < 10; // if (!isLt10M) { //   this.$message.error("上传图片大小不能超过 10M!"); //   return false; // } else { // }
      const image = new Image();
      image.src = URL.createObjectURL(fileTow); //解码URL
      image.onload = function () {
        if (this.width < 2048 && this.height < 2048) {
          //判断图片的长宽都小于2048就不进行压缩
          let formData = new FormData();
          formData.append("file", fileTow);
          PutImageAPI(formData, "post", 2).then((res) => {
            console.log(res, "上传图片  不满足条件不进行压缩");
            if (res.code !== 1) {
              file.status = "failed";
              file.message = "上传失败";
              return;
            }

            // _that.fileimgid.push(res.data[0].id);
            _that.fileimgidOne = res.data[0].id;
            console.log( _that.fileimgidOne," _that.fileimgidOne")

            file.status = "done";
          });
        } else {
          compress(fileTow, function (val) {
            // console.log(val);
            let formData = new FormData();
            formData.append("file", val);
            PutImageAPI(formData, "post", 2).then((res) => {
              //   console.log(res, "上传图片 进行压缩");
              if (res.code !== 1) {
                file.status = "failed";
                file.message = "上传失败";
                return;
              }
               _that.fileimgidOne = res.data[0].id;
               console.log( _that.fileimgidOne," _that.fileimgidOne")
              file.status = "done";
            });
          });
        }
      };
    },
    afterReadTow(file) {
      file.status = "uploading";
      file.message = "上传中...";
      let fileTow = file.file;
      const _that = this;
      // const isLt10M = file.size / 1024 / 1024 < 10; // if (!isLt10M) { //   this.$message.error("上传图片大小不能超过 10M!"); //   return false; // } else { // }
      const image = new Image();
      image.src = URL.createObjectURL(fileTow); //解码URL
      image.onload = function () {
        if (this.width < 2048 && this.height < 2048) {
          //判断图片的长宽都小于2048就不进行压缩
          let formData = new FormData();
          formData.append("file", fileTow);
          PutImageAPI(formData, "post", 2).then((res) => {
            console.log(res, "上传图片  不满足条件不进行压缩");
            if (res.code !== 1) {
              file.status = "failed";
              file.message = "上传失败";
              return;
            }

            // _that.fileimgid.push(res.data[0].id);
            _that.fileimgidTow = res.data[0].id;

            file.status = "done";
          });
        } else {
          compress(fileTow, function (val) {
            // console.log(val);
            let formData = new FormData();
            formData.append("file", val);
            PutImageAPI(formData, "post", 2).then((res) => {
              //   console.log(res, "上传图片 进行压缩");
              if (res.code !== 1) {
                file.status = "failed";
                file.message = "上传失败";
                return;
              }
              _that.fileimgidTow = res.data[0].id;
              file.status = "done";
            });
          });
        }
      };
    },
    afterReadThree(file) {
      file.status = "uploading";
      file.message = "上传中...";
      let fileTow = file.file;
      const _that = this;
      // const isLt10M = file.size / 1024 / 1024 < 10; // if (!isLt10M) { //   this.$message.error("上传图片大小不能超过 10M!"); //   return false; // } else { // }
      const image = new Image();
      image.src = URL.createObjectURL(fileTow); //解码URL
      image.onload = function () {
        if (this.width < 2048 && this.height < 2048) {
          //判断图片的长宽都小于2048就不进行压缩
          let formData = new FormData();
          formData.append("file", fileTow);
          PutImageAPI(formData, "post", 2).then((res) => {
            console.log(res, "上传图片  不满足条件不进行压缩");
            if (res.code !== 1) {
              file.status = "failed";
              file.message = "上传失败";
              return;
            }

            // _that.fileimgid.push(res.data[0].id);
            _that.fileimgidThree = res.data[0].id;

            file.status = "done";
          });
        } else {
          compress(fileTow, function (val) {
            // console.log(val);
            let formData = new FormData();
            formData.append("file", val);
            PutImageAPI(formData, "post", 2).then((res) => {
              //   console.log(res, "上传图片 进行压缩");
              if (res.code !== 1) {
                file.status = "failed";
                file.message = "上传失败";
                return;
              }
              _that.fileimgidThree = res.data[0].id;
              file.status = "done";
            });
          });
        }
      };
    },
    deleteRead(index) {
      if (index == 0) {
        this.fileimgidOne = "";
      } else if (index == 1) {
        this.fileimgidTow = "";
      } else {
        this.fileimgidThree = "";
      }

      console.log( this.fileimgidOne,"sc", this.fileimgidTow,"sc", this.fileimgidThree,"sc")
    },
    // 提交申请
    submit(isEditType) {
      if (!isEditType) {
        this.submitData.PpAddress = this.coAddress + this.DetailedAddress;

        this.submitData.LogoImgid = this.fileimgidOne;

        let Imgsarr = [];

        Imgsarr.push(this.fileimgidTow, this.fileimgidThree);

        this.submitData.Imgs = Imgsarr.join(",");
        let data = qs.stringify(this.submitData);
        console.log(data, "data");
        ApplySettleAPI(data, "post").then((res) => {
          if (res.code == 0) {
            Toast(res.msg);
            return false;
          }
          this.$router.replace({ path: "/My/ApplyEnter/Successed" });
        });
      } else {
        let arrpick=[]
        arrpick.push( this.fileimgidOne,this.fileimgidTow, this.fileimgidThree);

        let data = {
          pickupId: this.pickupId,
          imgIds: arrpick.join(","),
        };
        SetPickupImgAPI(data, "put").then((res) => {
          if (res.code == 0) {
            return false;
          }
          Toast("编辑成功");
          this.$router.go(-1);
        });
      }
    },
    //跳转去门店申请入住
    jumpProprietaryLocation() {
      this.$router.push({
        path: "/GoodsDetails/ProprietaryLocation",
      });
    },
    // 个人中心信息
    MyBaseData() {
      MyBaseDataAPI("get").then((res) => {
        this.isTrueValID = res.isTrueValID;
        this.loadingshow = false;
      });
    },
    //认证
    toComfirm() {
      this.$router.push({
        name: "Attestation",
      });
    },
  },
  mounted() {
    if (this.$route.query.type && this.$route.query.type == "edit") {
      this.pickupType = this.$route.query.type; //状态 是否为编辑状态
      document.title = "门店信息";
      this.pickupId = this.$route.query.id; //门店id
      this.getEditInfor();
    } else {
      document.title = "申请入驻";
    }

    this.MyBaseData();

    if (window.localStorage.getItem("location")) {
      let obj = JSON.parse(window.localStorage.getItem("location"));
      console.log(obj, "objobjobj");
      this.coAddress = obj.pname + obj.cityname + obj.adname;
      this.DetailedAddress = obj.address;
      if (obj.location.lng) {
        this.submitData.Lon = obj.location.lng;
        this.submitData.Lat = obj.location.lat;
      } else {
        this.submitData.Lon = obj.location.split(",")[0];
        this.submitData.Lat = obj.location.split(",")[1];
      }
      console.log(this.submitData, "this.submitData");
    }

    if (sessionStorage.getItem("PEnterData")) {
      var objAfter = JSON.parse(sessionStorage.getItem("PEnterData"));
      console.log(objAfter, "objAfter");
      this.submitData = objAfter;
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, "tooooooooooooooo");

    if (to.name == "ProprietaryLocation") {
      console.log(this.submitData, "submitData");
      var PEnterData = JSON.stringify(this.submitData);
      sessionStorage.setItem("PEnterData", PEnterData);
    } else {
      sessionStorage.removeItem("PEnterData");
    }
    next();
  },
};
</script>

<style lang="less">
.ProprietaryEnter {
  .noticeBar {
    font-size: 28px;
    width: 750px;
    height: 80px;
    background: #fedec6;
    outline: 1px solid #e4e4e4;
    line-height: 80px;
    color: #726154;
    .toComfirm {
      line-height: 80px;
      font-size: 28px;
      color: rgba(244, 38, 54, 1);
    }
  }
  input:disabled {
    background-color: #fff;
  }
  width: 100%;
  min-height: 100%;
  height: auto;
  background: @text-white;
  .ProprietaryEnter_box {
    width: 92%;
    background: #fff;
    min-height: 100%;
    height: auto;
    margin: auto;
    .divbox {
      flex: 1;
      border-bottom: 1px solid @border-colorA;
      display: flex;
      align-items: center;
      .item_input {
        border-bottom: none;
      }
      img {
        width: 24px;
        padding: 0 0 0 20px;
      }
    }
    .input_item {
      margin-top: 20px;
    }
    .input_item2 {
      padding-bottom: 30px;
      margin-top: 40px;

      align-items: flex-start;
      .divbox2 {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .divbox2_d1 {
          width: 100%;
          position: relative;
          .van-uploader {
            width: 100%;
            height: 352px;
            z-index: 12;
            .van-uploader__wrapper {
              height: 100%;
            }
          }
          .sc_input {
            width: 100%;
            height: 352px;
            position: absolute;
            top: 0;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
              width: 188px;
              height: 154px;
            }
            p {
              font-size: 24px;
              color: #7e8290;
              padding: 24px 0 20px;
            }
            button {
              width: 132px;
              height: 60px;
              background: @auxiliary-color;
              border-radius: 34px;
              outline: none;
              border: none;
              color: @text-white;
            }
          }
          /deep/ .van-uploader__upload {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            border: 1px dashed @text-colorD;
            border-radius: 20px;
            background: none;
            margin: 0;
            .van-uploader__upload-icon {
              font-size: 40px;
              display: none;
            }
          }
          /deep/ .van-uploader__preview {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            border: 1px dashed @text-colorD;
            border-radius: 20px;
            margin: 0;
            .van-uploader__preview-image {
              width: 100%;
              height: 100%;
              border-radius: 20px;
            }
            .van-uploader__preview-delete {
              font-size: 28px;
            }
            .van-uploader__mask {
              .van-uploader__loading {
                width: 50px;
                height: 50px;
                .van-loading__spinner {
                  width: 50px;
                }
              }
              .van-uploader__mask-message {
                font-size: 28px;
                line-height: normal;
                margin-top: 10px;
              }
            }
          }
        }
        .divbox2_d2 {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          margin-top: 16px;
          .v1 {
            width: 240px;
            position: relative;
            .van-uploader {
              width: 100%;
              z-index: 12;
              width: 240px;
              height: 240px;
            }
            .sc_input {
              width: 240px;
              height: 240px;
              position: absolute;
              top: 0;
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              img {
                width: 80px;
              }
              span {
                font-size: 24px;
                color: #7e8290;
                padding-top: 12px;
              }
            }
          }
          .v2 {
            width: 240px;
            position: relative;
            .van-uploader {
              width: 100%;
              z-index: 12;
              width: 240px;
              height: 240px;
            }
            .sc_input {
              width: 240px;
              height: 240px;
              position: absolute;
              top: 0;
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              img {
                width: 80px;
              }
              span {
                font-size: 24px;
                color: #7e8290;
                padding-top: 12px;
              }
            }
          }
          .van-uploader__wrapper {
            width: 100%;
            height: 100%;
          }
          /deep/ .van-uploader__upload {
            width: 100%;
            height: 100%;
            border: 1px dashed @text-colorD;
            border-radius: 20px;
            background: none;
            margin: 0;
            .van-uploader__upload-icon {
              font-size: 40px;
              display: none;
            }
          }
          /deep/ .van-uploader__preview {
            width: 100%;
            height: 100%;
            border: 1px dashed @text-colorD;
            border-radius: 20px;
            margin: 0;
            .van-uploader__preview-image {
              width: 100%;
              height: 100%;
              border-radius: 20px;
            }
            .van-uploader__preview-delete {
              font-size: 28px;
            }
            .van-uploader__mask {
              .van-uploader__loading {
                width: 50px;
                height: 50px;
                .van-loading__spinner {
                  width: 50px;
                }
              }
              .van-uploader__mask-message {
                font-size: 28px;
                line-height: normal;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
    .item_input {
      height: 80px;
      border: 0;
      width: 100%;
      border-bottom: 1px solid @border-colorA;
      font-size: 28px;
      color: @text-colorA;
    }
    .input_item input::-webkit-input-placeholder {
      color: @text-colorC;
    }

    .item_name {
      min-width: 175px;
      font-size: 28px;
    }
    .right {
      height: 80px;
      border-bottom: 1px solid #e4e4e4;
    }
    .getCodeBtn {
      height: 80px;
      // color: #f42636;
      color: #7d828f;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
    }
    .getCodeBtn::before {
      content: "|";
      margin-right: 14px;
      color: #b1b6c3;
    }
    .getCode {
      border: 0;
      font-size: 28px;
      color: @text-colorA;
      width: 50%;
    }
    .SecurityCode {
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      color: @main-color !important;
    }
    .SecurityCode::before {
      content: "|";
      margin-right: 14px;
      color: #b1b6c3;
    }
    .zcclass {
      height: 80px;
      line-height: 80px;
      text-align: right;
      font-size: 28px;
      color: #b1b6c3;
      width: 50%;
    }

    .zcclass::before {
      content: "|";
      margin-right: 14px;
      color: #b1b6c3;
    }
    .noClick {
      pointer-events: none;
    }
    .forThanks {
      margin: 0 auto 28px;
      font-size: 24px;
      font-weight: 400;
      color: @text-colorB;
      line-height: 38px;
    }
    .phoneNumber {
      color: @main-color;
      a {
        color: @main-color;
      }
    }
    .submit_btn {
      margin: 94px auto 32px;
      text-align: center;
      width: 670px;
      height: 88px;
      border-radius: 44px;
      line-height: 88px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
    .disabled_btn {
      opacity: 0.5;
      background: @text-colorD;
      pointer-events: none;
    }
    .submit_btn_active {
      background: @button-mainbackground;
      pointer-events: unset;
    }
    .submit_btn_active:active {
      background: @button-mainbackground-on;
      pointer-events: unset;
    }
  }
}
</style>