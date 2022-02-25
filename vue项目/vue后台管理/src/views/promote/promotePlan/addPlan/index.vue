<template>
  <errorPage v-if="CODE === 101" />
  <div class="addPlan" v-else>
    推广方案
    <el-divider></el-divider>

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="计划名称：" prop="adPlanName">
        <el-input
          class="w-280"
          show-word-limit
          maxlength="30"
          placeholder="请输入计划名称"
          v-model="ruleForm.adPlanName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="投放类型："
        :rules="{
          required: true,
        }"
      >
        展位
        <!-- <el-radio-group v-model="ruleForm.publishType">
          <el-radio :label="1">展位</el-radio>
          <el-radio :label="2">关键字</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item
        label="推广位置："
        :rules="{
          required: true,
        }"
      >
        <el-radio
          v-model="ruleForm.adPlaceNo"
          v-for="(item, index) in placeList"
          :key="index"
          :label="item.no"
          @change="changeRadio($event, index)"
          >{{ item.adPlaceName }}</el-radio
        >
      </el-form-item>
      <el-form-item
        label="推广时长："
        :rules="{
          required: true,
        }"
      >
        <el-radio-group v-model="ruleForm.timeStr">
          <el-radio :label="1">一个月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推广价格：">
        {{ "¥" + this.ruleForm.adPrice }}
      </el-form-item>
      <el-form-item label="开始时间：" prop="region">
        <div class="flex">
          <el-date-picker
            class="w-280"
            v-model="ruleForm.PlanPublishBeginTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
          <div class="tips ml-30">
            推广开始时间，平台审核通过后按此时间开始推广并计时，计时开始后，期间不停止计时
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="推广商品："
        :rules="{
          required: true,
        }"
      >
        <div>推荐尺寸{{ imgClass.width }} * {{ imgClass.height }}</div>
        <div v-if="!mainGood" @click="selectDialog = true" class="wfc">
          <div
            class="upLoadImg fcc"
            :style="{
              width: imgClass.width + 'px',
              height: imgClass.height + 'px',
            }"
          >
            <div class="flex2 aic">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <span>选择商品</span>
            </div>
          </div>
        </div>

        <img
          :style="{
            width: imgClass.width + 'px',
            height: imgClass.height + 'px',
          }"
          @click="selectDialog = true"
          v-else
          class="pictrue"
          :src="mainGood.mainImg + '?x-oss-process=style/89900'"
        />
      </el-form-item>
      <el-form-item label="修改创意：">
        <div>推荐尺寸{{ imgClass.width }} * {{ imgClass.height }}</div>
        <div class="tips">新建流程中，默认使用主图，您可以进行更换设置</div>
        <img
          :style="{
            width: imgClass.width + 'px',
            height: imgClass.height + 'px',
          }"
          class="pictrue"
          v-if="newMainImg"
          :src="newMainImg + '?x-oss-process=style/89900'"
          @click="showImgModel = true"
        />
        <div v-if="!newMainImg" @click="showImgModel = true" class="wfc">
          <div
            :style="{
              width: imgClass.width + 'px',
              height: imgClass.height + 'px',
            }"
            class="upLoadImg fcc"
          >
            <div class="flex2 aic">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <span>上传封面</span>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>

    <div class="fcc" v-if="!isEditType">
      <el-button type="primary" class="w-160" @click="submitForm('ruleForm')"
        >完成设置，去支付</el-button
      >
    </div>
    <div class="fcc" v-else>
      <el-button class="w-160 mr-30" @click="$router.go(-1)">返回</el-button>
      <el-button class="w-160" type="primary" @click="saveEdit"
        >保存修改</el-button
      >
    </div>
    <!-- 支付的弹窗 -->
    <el-dialog
      title="推广支付"
      :visible.sync="payVisiable"
      v-if="payVisiable"
      width="30%"
    >
      <div>
        支付方式：
        <el-select v-model="ruleForm.payType" placeholder="选择支付方式">
          <el-option label="微信支付" :value="1"> </el-option>
          <el-option label="支付宝支付" :value="2"> </el-option>
        </el-select>
      </div>
      <div class="mt-30">支付金额： {{ this.ruleForm.adPrice }}</div>
      <div class="fcc" v-if="wechatSrc">
        <div class="flex2 aic">
          <img class="w-160" :src="wechatSrc" />
          <span>微信扫码支付</span>
        </div>
      </div>
      <div class="flex jc-sa mt-60">
        <el-button class="w-160" @click="cancelPay">取消</el-button>
        <el-button class="w-160" type="primary" @click="pay">去支付</el-button>
      </div>
    </el-dialog>
    <!-- 支付的弹窗 -->
    <!-- 选择商品 -->
    <el-dialog
      title="选择商品"
      :visible.sync="selectDialog"
      class="selectDialog"
    >
      <checkSkuGoods @selectedGood="selectedGood" @dialogShow="dialogShow" />
    </el-dialog>
    <!-- 选择商品 -->
    <!-- 图片空间 -->
    <el-dialog title="我的图片空间" :visible.sync="showImgModel">
      <pictureSpace
        v-if="showImgModel"
        :pictureNumber="pictureNumber"
        v-on:getImgList="getImgList"
      />
    </el-dialog>
    <!-- 图片空间 -->

    <!-- 支付宝 -->
    <div v-html="pageHtml" ref="alipayWap"></div>
    <!-- 支付宝 -->
  </div>
</template>

<script>
import qs from "qs";
import {
  AddAdOrderAPI,
  CreatePayDataAPI,
  GetPlaceListAPI,
  getWxPayDataAPI,
  GetAdPlanDetailAPI,
  EditAdOrderAPI,
  getAlPayPageAPI,
  OrderIsPayAPI,
} from "@/api/advertisementAPI.js";
import checkSkuGoods from "@/components/checkSkuGoods";
import pictureSpace from "@/components/pictureSpace";
export default {
  components: {
    checkSkuGoods,
    pictureSpace,
  },
  computed: {
    newMainImg: function () {
      if (this.newImg) {
        console.log(this.newImg.fileUrl, "this.newImg.fileUrl");
        return this.newImg.fileUrl;
      } else {
        return this.mainGood.mainImg;
      }
    },
  },

  data() {
    return {
      pageHtml: "",
      wechatSrc: "",
      newImg: "", //新的封面
      showImgModel: false, //展示图片空间
      pictureNumber: 1, //图片上传个数
      mainGood: "", //选中的商品
      selectDialog: false, //选择商品
      isEditType: false, //是否为编辑状态
      CODE: 0, //权限代码
      payVisiable: false, //支付的弹窗
      imgClass: {
        width: 448,
        height: 216,
      },
      ruleForm: {
        adPlanName: "", //推广计划名称
        publishType: 1, //投放类型（1是展位，2是关键字）
        adPlaceNo: "PLANCE_HANDSWIPE_002", //推广位置
        timeStr: 1, //推广时长（整数，单位月）
        adPrice: "", //推广价格
        goodsId: "", //推广商品ID
        adImgId: "", //创意图ID
        goodsImgId: "", //商品主图ID
        payType: 1, //支付方式 （1是微信，2是支付宝）
        rmk: "", //备注
        publishTimes: "", //推广时长文字说明（便于详情）
      },
      rules: {
        adPlanName: [
          { required: true, message: "请输入计划名称", trigger: "blur" },
        ],
      },
      placeList: [], //推广位置 列表
      payInfor: null,
    };
  },
  methods: {
    cancelPay() {
      this.payVisiable = false;
      clearInterval(window.payTimer);
    },
    async pay() {
      if (this.ruleForm.payType == 1) {
        if (!this.payInfor) {
          this.payInfor = await AddAdOrderAPI(
            qs.stringify(this.ruleForm),
            "post"
          ); //获取支付信息orderNo
        }
        let sendData = {
          AdOrderNo: this.payInfor.data,
          PayType: 1,
        };
        // var orderInfor = "";
        let orderInfor = await CreatePayDataAPI(qs.stringify(sendData), "post"); //获取支付 单号
        let getUrlData = Object.assign(orderInfor.data, {
          totalAmount: orderInfor.data.totalAmount.toFixed(2),
        });

        let urlReslut = await getWxPayDataAPI(qs.stringify(getUrlData), "post"); //获取支付二维码或者链接
        this.wechatSrc = urlReslut.data; //微信支付的二维码
        //调起是否支付
        clearInterval(window.payTimer); //c触发前清除
        window.payTimer = setInterval(() => {
          let data = {
            orderNo: this.payInfor.data,
            // orderNo: "AD20111714480389552112",
          };
          OrderIsPayAPI(data, "get").then((res) => {
            console.log(res, "ress");
            if (res.data) {
              clearInterval(payTimer);
              this.payVisiable = false;
              this.$message({
                duration: 2000,
                message: "支付成功!",
                type: "success",
                onClose: () => {
                  this.$router.push({
                    name: "promotePlan",
                  });
                },
              });
            }
          });
        }, 2000);
      } else {
        let payInfor = await AddAdOrderAPI(qs.stringify(this.ruleForm), "post"); //获取支付单号orderNo
        let sendData = {
          AdOrderNo: payInfor.data,
          PayType: 2, //支付宝
        };
        let orderInfor = await CreatePayDataAPI(qs.stringify(sendData), "post"); //获取支付信息
        let getUrlData = Object.assign(orderInfor.data, {
          totalAmount: orderInfor.data.totalAmount.toFixed(2),
          returnUrl: "http://shopadmin.zk-mall.net/#/promote/promotePlan",
        });
        let urlReslut = await getAlPayPageAPI(qs.stringify(getUrlData), "post"); //获取支付二维码或者链接
        this.pageHtml = urlReslut.data; //支付宝
        this.$nextTick(() => {
          this.$refs.alipayWap.children[0].submit();
        });

        // let result0 = await AddAdOrderAPI(qs.stringify(this.ruleForm), "post");
        // let data = {
        //   AdOrderNo: result0.data,
        //   PayType: 2,
        // };
        // let result1 = await CreatePayDataAPI(qs.stringify(data), "post");
        // let data = Object.assign(result1.data, {
        //   totalAmount: result.data.totalAmount.toFixed(2),
        //   returnUrl: "http://shopadmin.zk-mall.net/#/promote/promotePlan",
        // });
        // let result2 = await getAlPayPageAPI(qs.stringify(result.data), "post");
      }

      try {
      } catch (error) {
        this.$message({
          duration: 1000,
          message: "请求错误!!",
          type: "error",
        });
      }
    },
    getImgList(imgData) {
      console.log(imgData, "imgData");
      this.newImg = imgData[0];
      this.showImgModel = false;
    },
    selectedGood(e) {
      //获取选择的商品
      this.mainGood = e;
    },
    dialogShow(e) {
      //选择完关掉
      this.selectDialog = e;
    },
    getPlaceList() {
      //获取广告位置
      GetPlaceListAPI().then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.placeList = res.data;
        this.ruleForm.adPrice = res.data[0].price;
      });
    },
    saveEdit() {
      this.ruleForm.goodsId = this.mainGood.id; //推广商品ID
      this.ruleForm.goodsImgId = this.mainGood.mainImgId; //商品主图ID
      this.ruleForm.adImgId = this.newImg
        ? this.newImg.fileId
        : this.mainGood.mainImgId; //商品主图ID
      let data = Object.assign(this.ruleForm, {
        rmk: "", //备注
        publishTimes: "", //推广时长文字说明（便于详情）
      });
      console.log(data, this.mainGood, "data");
      EditAdOrderAPI(qs.stringify(data), "PUT").then((res) => {
        console.log(res, "resss");
        if (res.code == 1) {
          this.$message({
            duration: 1000,
            message: "修改成功!!",
            type: "success",
            onClose: () => {
              this.$router.go(-1);
            },
          });
        }
      });
    },
    submitForm(formName) {
      //提交表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.mainGood == "") {
            console.log("无选中的商品");
            this.$message({
              duration: 1000,
              message: "请选择商品!!",
              type: "error",
            });
            return;
          }

          this.payVisiable = true;
          this.ruleForm.goodsId = this.mainGood.id; //推广商品ID
          this.ruleForm.goodsImgId = this.mainGood.mainImgId; //商品主图ID
          this.ruleForm.adImgId = this.newImg
            ? this.newImg.fileId
            : this.mainGood.mainImgId; //商品主图ID
          console.log(this.ruleForm, this.newImg, this.mainGood, "ruleForm");
        } else {
          this.$message({
            duration: 1000,
            message: "请输入计划名称!!",
            type: "error",
          });
        }
      });
    },
    changeRadio(e, index) {
      //修改价格
      console.log(this.placeList, e, index, "this.placeList");
      this.ruleForm.adPrice = this.placeList[index].price;
      this.imgClass = {
        width: this.placeList[index].width,
        height: this.placeList[index].height,
      };
    },
    getEditInfor(id) {
      let data = {
        id: id,
      };
      GetAdPlanDetailAPI(data, "get").then((res) => {
        console.log(res, "res");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.ruleForm = res.data;
        this.newImg = {
          fileId: res.data.adImgId,
          fileUrl: res.data.adImgUrl,
        };
        this.mainGood = {
          // goodsName: "",
          id: res.data.goodsId,
          mainImg: res.data.imgUrlStr,
          mainImgId: res.data.goodsImgId,
          // price: 130,
          // spuNo: "130",
        };
        // this.newImg = res.data.adImgUrl;
      });
    },
  },
  beforeDestroy() {
    clearInterval(window.payTimer);
  },
  Destroy() {
    clearInterval(window.payTimer);
  },
  mounted() {
    if (this.$route.query.type == "Edit") {
      this.isEditType = true;
      this.getEditInfor(this.$route.query.id);
      console.log(this.$route.query, "this.$route.query");
    }
    this.getPlaceList();
  },
};
</script>
<style lang="scss" scoped>
.addPlan {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px #e8e8e8;
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-range-separator {
    height: 32px;
    line-height: 32px;
    width: fit-content;
  }
  /deep/ .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  .tips {
    color: #b1b6c3;
    font-size: 12px;
  }
  .upLoadImg {
    height: 160px;
    width: 160px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pictrue {
    height: 160px;
    width: 160px;
    border-radius: 6px;
  }
}
</style>