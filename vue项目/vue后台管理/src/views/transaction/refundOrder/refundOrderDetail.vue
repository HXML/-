<template>
  <errorPage v-if="CODE===101" />
  <div class="detail" v-else>
    <Step :message="goodInfor.refundType==1?StepInfor:StepInfor2" />
    <section class="form flex jc-sb">
      <!-- 退货的状态 -->
      <section class="formContent pl-24 pt-12" v-if="goodInfor.refundType==1">
        <!-- 商家处理退货 -->
        <div v-if="goodInfor.returnStatus==1">
          <div class="flex2 f12 lh30 mb-16">
            <div class="flex">
              <span>退货地址：</span>
              <div class="flex2">
                <div>
                  <span>收货人：{{goodInfor.linkMan}}</span>
                </div>
                <span>手机号：{{goodInfor.linkTel}}</span>
                <span v-if="!showInput">收货地址：{{goodInfor.returnAddress}}</span>
                <span v-else>
                  收货地址：
                  <el-input
                    @blur="showInput=false"
                    placeholder="请输入"
                    v-model="goodInfor.returnAddress"
                    style="width:288px; margin-right:20px"
                  ></el-input>
                </span>
                <div
                  style="width: fit-content;"
                  @click="showInput=true"
                  class="mainColor pointer"
                >修改退货地址</div>
              </div>
            </div>
            <div class="flex">
              <span>退货说明：</span>
              <el-input
                style="width:400px"
                :autosize="{minRows: 5}"
                type="textarea"
                placeholder="拒绝说明/最多可输入200字"
                maxlength="200"
                show-word-limit
                v-model="jujueInfor"
              ></el-input>
            </div>
          </div>
          <div class="header_title flex aic">
            <span>处理退货退款申请：</span>
            <!-- 这里传的是时间戳 -->
            <downTime :endTime="endTime" :startTime="Date.now()" endMsg="已退款" />
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>* 如未发货，请点击同意退款给买家。</li>
            <li>* 如商品实际已发货，点击发货填写物流单号即拒绝退款。</li>
            <li>* 如您逾期未做出处理，默认视为同意买家退货申请，系统将自动退款给买家。</li>
          </ul>
          <div class="flex">
            <div @click="confirmRefuApply($route.query.id)" class="btn_confirm mr-16 pointer">同意退货申请</div>
            <span @click="refuseApply($route.query.id)" class="btn_reject mr-16 pointer">拒绝退款申请</span>
            <!-- <span class="btn_reject">取消并返回</span> -->
          </div>
        </div>
        <!-- 买家寄回商品 有两种状态 状态值为2就是等待买家寄回商品 状态为3时等待商家退款 -->
        <div v-if="goodInfor.returnStatus==2">
          <div class="header_title flex aic">
            <span>处理退货退款申请：</span>
            <!-- 这里传的是时间戳 -->
            <downTime :endTime="endTime" :startTime="Date.now()" endMsg="已退款" />
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>* 收到买家退货时，请验货后同意退款</li>
            <li>* 如您逾期未做出处理，默认视为已收到货，系统将自动退款给买家。</li>
          </ul>
          <div class="flex">
            <div
              @click="getGoodConfirmRefu($route.query.id)"
              class="btn_confirm mr-16 pointer"
            >已收到货，同意退款</div>
          </div>
        </div>
        <!-- 买家寄回商品 有两种状态 状态值为2就是等待买家寄回商品 状态为3时等待商家退款 -->
        <div v-if="goodInfor.returnStatus==3">
          <div class="header_title flex aic">
            <span>处理退货退款申请：</span>
            <!-- 这里传的是时间戳 -->
            <downTime :endTime="endTime" :startTime="new Date().getTime()" endMsg="已退款" />
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>* 收到买家退货时，请验货后同意退款</li>
            <li>* 如您逾期未做出处理，默认视为已收到货，系统将自动退款给买家。</li>
          </ul>
          <div class="flex">
            <div
              @click="getGoodConfirmRefu($route.query.id)"
              class="btn_confirm mr-16 pointer"
            >已收到货，同意退款</div>
            <span @click="reFuTuiHuoApply($route.query.id)" class="btn_reject pointer">拒绝退款申请</span>
          </div>
        </div>
        <!-- 退款成功 -->
        <div v-if="goodInfor.returnStatus==5">
          <div class="header_title flex aic">
            <span>退款成功</span>
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>退款成功时间： {{goodInfor.shopAgreeTime}}</li>
            <li>退款金额：￥{{goodInfor.returnPrice}}</li>
          </ul>
        </div>
        <!-- 已拒绝 -->
        <div v-if="goodInfor.returnStatus==7">
          <div class="header_title flex aic">
            <span>已拒绝</span>
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>已拒绝</li>
            <li>已拒绝</li>
          </ul>
        </div>

        <div class="border1"></div>

        <!-- 协商历史 -->
        <section class="history">
          <div class="history_title">协商历史</div>
          <div v-for=" (item,index) in historyList" :key="index" class="history_item flex mt-16">
            <el-image
              v-if="getBlooenString(item.headImgUrl)"
              style="height:43px;width:43px;border-radius:50%;"
              :src="item.headImgUrl+'?x-oss-process=style/s5'"
            />
            <el-image
              v-else
              style="height:43px;width:43px;border-radius:50%;"
              :src="item.headImgUrl"
            />

            <div class="content mr-24 ml-24">
              <div class="name_time flex jc-sb fontAColor">
                <span>{{item.processUser}}</span>
                <span>{{item.creatorDate}}</span>
              </div>
              <div class="content_text fontDColor">{{item.logBody}}</div>
              <div class="flex mt-16">
                <!-- <img
                  v-for="(imgSrc,index) in item.rejectImg"
                  :key="index"
                  class="mr-16"
                  style="height:70px;width:70px;"
                  :src="imgSrc+'?x-oss-process=style/s5'"
                  alt
                />-->
                <el-image
                  v-for="(imgSrc,index) in item.rejectImg"
                  :key="index"
                  class="mr-16"
                  style="height:70px;width:70px;"
                  :src="imgSrc+'?x-oss-process=style/s5'"
                  :preview-src-list="changeImgStyle(item.rejectImg,'?x-oss-process=style/b5',index)"
                ></el-image>
              </div>
            </div>
          </div>
          <div class="fcc" v-if="historyList.length==0">暂无数据</div>
        </section>
      </section>
      <!-- 退款的状态 -->
      <section class="formContent pl-24 pt-12" v-else>
        <!-- 退款未发货 -->
        <div v-if="goodInfor.returnStatus==1">
          <div class="header_title flex aic">
            <span>处理退款申请：</span>
            <downTime :endTime="endTime" :startTime="new Date().getTime()" endMsg="已退款" />
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>* 如未发货，请点击同意退款给买家。</li>
            <li>* 如商品实际已发货，点击发货填写物流单号即拒绝退款。</li>
            <li>* 如您逾期未做出处理，默认视为同意买家退货申请，系统将自动退款给买家。</li>
          </ul>
          <div class="flex">
            <span
              @click="confirmRefuMoneyApply($route.query.id)"
              class="btn_confirm mr-16 pointer"
            >同意退款</span>
            <span
              v-if="goodInfor.orderStatus==21"
              @click="toDeliverGoods(goodInfor.orderId)"
              class="btn_reject"
            >发货</span>
            <span
              v-if="goodInfor.orderStatus==22"
              @click="retfuseTuikuan()"
              class="btn_reject pointer"
            >拒绝退款申请</span>
          </div>
        </div>
        <!-- 退款已发货 -->
        <!-- <div v-if="goodInfor.returnStatus==2">
          <div class="header_title flex aic">
            <span>处理退款申请：</span>
            <downTime :endTime="endTime" :startTime="new Date().getTime()" endMsg="同意退款" />
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>* 如未发货，请点击同意退款给买家。</li>
            <li>* 如商品实际已发货，点击发货填写物流单号即拒绝退款。</li>
            <li>* 如您逾期未做出处理，默认视为同意买家退货申请，系统将自动退款给买家。</li>
          </ul>
          <div class="flex">
            <span @click="confirmRefuMoneyApply($route.query.id)" class="btn_confirm mr-16">同意退款</span>
            <span @click="refuseTuikuanApply($route.query.id)" class="btn_reject">拒绝退款申请</span>
          </div>
        </div>-->
        <!-- 退款成功 -->
        <div v-if="goodInfor.returnStatus==5||goodInfor.returnStatus==2">
          <div class="header_title flex aic">
            <span>退款成功</span>
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>退款成功时间： {{goodInfor.shopAgreeTime}}</li>
            <div class="flex">
              <span>退款金额：¥{{goodInfor.returnPrice}}</span>
              <!-- <el-input
                class="ml-16"
                oninput="if(value<0)value=0"
                type="number"
                style="width:400px"
                v-model="goodInfor.returnPrice"
              />-->
            </div>
          </ul>
        </div>
        <!-- 已拒绝 -->
        <div v-if="goodInfor.returnStatus==7">
          <div class="header_title flex aic">
            <span>拒绝退款</span>
          </div>
          <ul class="flex2 Desc mb-24 mt-16">
            <li>拒绝时间：{{goodInfor.shopAgreeTime}}</li>
            <li>
              拒绝原因：
              <span class="main-color">{{goodInfor.returnReason}}</span>
            </li>
          </ul>
        </div>
        <div class="border1"></div>
        <!-- 协商历史 -->
        <section class="history">
          <div class="history_title">协商历史</div>
          <div v-for=" (item,index) in historyList" :key="index" class="history_item flex mt-16">
            <el-image
              v-if="getBlooenString(item.headImgUrl)"
              style="height:43px;width:43px;border-radius:50%;"
              :src="item.headImgUrl+'?x-oss-process=style/s5'"
            />
            <el-image
              v-else
              style="height:43px;width:43px;border-radius:50%;"
              :src="item.headImgUrl"
            />
            <!-- <el-image
              style="height:43px;width:43px;border-radius:50%;"
              :src="item.headImgStr+'?x-oss-process=style/s5'"
              alt
            />-->
            <div class="content mr-24 ml-24">
              <div class="name_time flex jc-sb fontAColor">
                <span>{{item.processUser}}</span>
                <span>{{item.creatorDate}}</span>
              </div>
              <div class="content_text fontDColor">{{item.logBody}}</div>
              <div class="flex mt-16">
                <!-- <img
                  v-for="(imgSrc,index) in item.rejectImg"
                  :key="index"
                  class="mr-16"
                  style="height:70px;width:70px;"
                  :src="imgSrc+'?x-oss-process=style/s5'"
                  alt
                />-->
                <el-image
                  v-for="(imgSrc,index) in item.rejectImg"
                  :key="index"
                  style="width: 100px; height: 100px"
                  :src="imgSrc+'?x-oss-process=style/s5'"
                  :preview-src-list="changeImgStyle(item.rejectImg,'?x-oss-process=style/b5')"
                ></el-image>
              </div>
            </div>
          </div>
          <div class="fcc" v-if="historyList.length==0">暂无数据</div>
        </section>
      </section>
      <section class="formRight">
        <div class="right_title">退款申请</div>
        <div class="goodInfor flex mt-16">
          <img class="goodInfor_img" :src="goodInfor.goodsImg+'?x-oss-process=style/s5'" />
          <div class="ml-8">
            <div class="goodInfor_title">{{goodInfor.goodsName}}</div>
            <div class="goodInfor_type mt-8">{{getSkuString(goodInfor.orderOtherData)}}</div>
          </div>
        </div>
        <div class="border_bottom mt-16 mb-16"></div>
        <div class="buy_infor flex2">
          <div class="list_item flex">
            <div class="span">
              买家
              <i></i>
            </div>：
            <p>{{goodInfor.nickName}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              订单编号
              <i></i>
            </div>：
            <p>{{goodInfor.orderNo}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              单 价
              <i></i>
            </div>：
            <p>¥{{goodInfor.price}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              数 量
              <i></i>
            </div>：
            <p>{{goodInfor.qty}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              快 递 费
              <i></i>
            </div>：
            <p v-if="goodInfor.shippingCostStr!=0">¥{{goodInfor.shippingCostStr}}</p>
            <p v-else>免邮</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              订单总价
              <i></i>
            </div>：
            <p>{{goodInfor.orderTotalPrice}}</p>
          </div>
        </div>
        <div class="border_bottom mt-16 mb-16"></div>
        <div class="buy_infor">
          <div class="list_item flex">
            <div class="span">
              退款编号
              <i></i>
            </div>：
            <p>{{goodInfor.returnNo}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              退款金额
              <i></i>
            </div>：
            <!-- <p class="fontBColor">￥{{goodInfor.returnPrice}}</p> -->
            <p class="fontBColor">
              ￥
              <el-input
                oninput="if(value<0)value=0"
                type="number"
                style="width:100px"
                v-model="goodInfor.returnPrice"
              />
            </p>
          </div>
          <div class="list_item flex">
            <div class="span">
              退款数量
              <i></i>
            </div>：
            <p>{{goodInfor.reqNum}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              原因
              <i></i>
            </div>：
            <p>{{goodInfor.returnReason}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              要求
              <i></i>
            </div>：
            <p class="fontBColor">{{refundTypeList[goodInfor.refundType-1]}}</p>
          </div>
          <div class="list_item flex">
            <div class="span">
              退款说明
              <i></i>
            </div>：
            <p class="over_2">{{goodInfor.returnRmk}}</p>
          </div>
        </div>
      </section>
    </section>

    <!-- 拒绝的弹窗 -->
    <el-dialog class="DiaLog" :visible.sync="showDailog">
      <template slot="title">
        <div class="flex ai-fe">
          <span class="f16">拒绝退款</span>
          <span class="f12 fontCColor ml-8">/如果您拒绝，买家可以再次申请或联系平台协商解决</span>
        </div>
      </template>
      <el-form ref="form" :model="dialogForm" label-width="80px">
        <el-form-item label="拒绝原因：" label-width="120px">
          <el-select v-model="dialogForm.reFuReson" placeholder="选择">
            <el-option label="货物在物流中" value="货物在物流中"></el-option>
            <el-option label="买家已签收" value="买家已签收"></el-option>
            <el-option label="商品退回之后才能退款" value="商品退回之后才能退款"></el-option>
            <el-option label="已发货，请承担发货运费" value="已发货，请承担发货运费"></el-option>
            <el-option label="超过售后时间" value="超过售后时间"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拒绝说明：" label-width="120px">
          <el-input
            :autosize="{minRows: 5}"
            type="textarea"
            placeholder="拒绝说明/最多可输入200字"
            maxlength="200"
            show-word-limit
            v-model="dialogForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传凭证：" label-width="120px">
          <span class="fontEColor">最多可上传3张</span>
          <div class="flex">
            <div class="rel" v-for="(i,index) in 3" :key="index">
              <uploadOssone
                v-on:func="func($event,index)"
                :value="dialogForm.imgUrls[index]"
                class="mr-16"
              />
              <i
                v-if="dialogForm.imgUrls[index]"
                class="el-icon-delete absIcon"
                @click="deleImg(index)"
              ></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="DailogFooter flex jc-sb">
        <span></span>
        <div class="flex">
          <span class="btn_cancle pointer" @click="showDailog=false">取消</span>
          <span @click="refuseOrder()" class="btn_confirm pointer">确认拒绝</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引用的API
import uploadOssone from "@/components/uploadOssone";
import Step from "@/components/Step/index";
import downTime from "@/components/CountDownTime/index";
import {
  GoodsReturnDetailsAPI,
  RefundOperationAPI,
} from "@/api/returnOrderAPI";
import qs from "qs";
export default {
  components: {
    Step,
    uploadOssone,
    downTime,
  },
  data() {
    return {
      CODE: 0,
      jujueInfor: "", //拒绝的说明
      imgList: [],
      showInput: false,
      address: "广东省深圳市龙华区泽华大厦820",
      dialogForm: {
        imgUrls: [],
        ids: [],
        reFuReson: "",
        desc: "",
        imgList: "",
      },
      showDailog: false,
      endTime: "", //倒计时开始时间 订单开始时间+3天
      returnReason: ["拍错/多拍/效果不好/不喜欢", "产品质量有问题"],
      StepInfor: {
        index: 0,
        stepList: [
          "买家申请退货",
          "商家处理退货申请",
          "买家寄回商品",
          "退款完成",
        ],
      },
      StepInfor2: {
        index: 0,
        stepList: ["买家申请退款", "商家处理退款申请", "退款关闭"],
      },

      refundTypeList: ["退款退货", "发货仅退款", "未发货退款"],
      goodInfor: {},
      historyList: [],
    };
  },
  methods: {
    //判断头像的域名
    getBlooenString(string) {
      if (string) {
        // console.log(string.substring(0, 23), "string.split(0, 8);");
        if (string.substring(0, 23) == "http://img.zk-mall.net/") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    changeImgStyle(arr, style, index) {
      // console.log(arr.slice(index), style, index, "arr.slice(index)");
      let arr1 = arr.slice(index).map((item) => {
        return item + style;
      });
      let arr2 = arr.slice(0, index).map((item) => {
        return item + style;
      });
      return [...arr1, ...arr2];
      //改变图片的 显示大小
      // return arr.map(item => {
      //   return item + style;
      // });
    },
    deleImg(index) {
      this.dialogForm.ids.splice(index, 1);
      this.dialogForm.imgUrls.splice(index, 1);
      console.log(this.dialogForm);
    },
    func(e, index) {
      console.log(e, index, "eeeeeeeeeeeeeeeeeeee");
      this.dialogForm.ids.push(e.imgId);
      this.dialogForm.imgUrls.push(e.imgUrl);
      console.log(this.dialogForm);
    },
    getSkuString(e) {
      if (e) {
        console.log(e);
        let skuObjList = JSON.parse(e);
        let string = "";
        skuObjList.forEach((item) => {
          string += item.Key + ":" + item.Value;
        });
        return string;
      }
    },
    confirmRefuApply(id) {
      //退货退款 同意退货申请按钮
      var data = qs.stringify({
        linkMan: this.goodInfor.linkMan,
        linkTel: this.goodInfor.linkTel,
        returnAddress: this.goodInfor.returnAddress,
        ids: id,
        ShopReturnRmk: this.jujueInfor,
        returnStatus: 2,
      });
      RefundOperationAPI(data, "post", 1).then((res) => {
        console.log(res, "RefundOperationAPI");
        if (res.code === 1) {
          this.getDetailInfor();
        }
      });
      console.log(id);
    },
    getGoodConfirmRefu(id) {
      //退货退款 已收到货 同意退款
      let prices = [
        {
          ReturnId: id,
          Price: this.goodInfor.returnPrice,
        },
      ];
      var data = qs.stringify({
        ids: id,
        returnNoPricesStr: JSON.stringify(prices),
        returnStatus: 5,
      });
      RefundOperationAPI(data, "post", 1).then((res) => {
        console.log(res, "RefundOperationAPI");
        if (res.code === 1) {
          this.getDetailInfor();
        } else if (res.code == 0) {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    refuseOrder() {
      if (this.dialogForm.reFuReson == "" || this.dialogForm.desc == "") {
        this.$notify({
          title: "提示",
          message: "请填写完整信息!",
          type: "warning",
        });

        return false;
      }

      //拒绝退款的弹窗上面的拒绝退款按钮
      var data = qs.stringify({
        ReturnStatus: 7, //拒绝7
        ids: this.goodInfor.id,
        ShopRejective: this.dialogForm.reFuReson,
        ShopRejectiveRmk: this.dialogForm.desc,
        ShopRejectiveImgids: this.dialogForm.ids.join(","),
      });
      RefundOperationAPI(data, "post", 1).then((res) => {
        console.log(res, "RefundOperationAPI");
        if (res.code === 1) {
          this.getDetailInfor();
          this.showDailog = false;
        }
      });
    },
    reFuTuiHuoApply(id) {
      //退货退款  拒绝退货申请
      this.showDailog = true;
    },

    confirmRefuMoneyApply(id) {
      //退款 同意退款按钮
      let prices = [
        {
          ReturnId: id,
          Price: this.goodInfor.returnPrice,
        },
      ];
      var data = qs.stringify({
        ids: id,
        returnNoPricesStr: JSON.stringify(prices),
        returnStatus: 5,
      });
      RefundOperationAPI(data, "post", 1).then((res) => {
        console.log(res, "RefundOperationAPI");
        if (res.code === 1) {
          this.getDetailInfor();
        } else if (res.code == 0) {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "warning",
          });
        }
      });
      // var data = qs.stringify({
      //   ids: id,
      //   returnStatus: 5
      // });
      // RefundOperationAPI(data, "post", 1).then(res => {
      //   console.log(res, "RefundOperationAPI");
      //   if (res.code === 1) {
      //     this.getDetailInfor();
      //   }
      // });
    },
    toDeliverGoods(id) {
      //退款 发货按钮
      console.log("5555");
      this.$router.push({
        name: "OrderDetil",
        query: {
          ids: id,
        },
      });
    },
    retfuseTuikuan() {
      //退款 拒绝退款申请按钮
      this.showDailog = true;
    },
    refuseApply(id) {
      //拒绝申请退款
      this.showDailog = true;
      console.log(id);
    },
    toTimerNumber(time) {
      console.log(time, Date.parse(time), "timetime");
      let newTime = time.replace(/-/g, "/"); //兼容IE
      return Date.parse(new Date(newTime)) + 24 * 60 * 60 * 1000 * 3;
    },
    getDetailInfor() {
      let data = {
        id: this.$route.query.id,
      };
      GoodsReturnDetailsAPI(data, "get").then((res) => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.endTime = this.toTimerNumber(res.data.model.creatorDate);
        this.historyList = res.data.busGoodsReturnLoglist.map((item) => {
          return {
            id: item.id,
            headImgUrl: item.headImgUrl,
            goodsReturnId: item.goodsReturnId,
            orderId: item.orderId,
            preStatus: item.preStatus,
            currentStatus: item.currentStatus,
            headImg: item.headImg,
            processUserId: item.processUserId,
            processUser: item.processUser,
            logBody: item.logBody,
            reason: item.reason,
            rmk: item.rmk,
            rejectImgid: item.rejectImgid,
            creatorDate: item.creatorDate,
            pkValue: item.pkValue,
            headImgStr: item.headImgStr,
            rejectImg: item.rejectImg ? item.rejectImg.split(",") : "",
          };
        }); //历史记录列表
        this.goodInfor = res.data.model; //信息
        if (res.data.model.refundType == 1) {
          //退货的step
          switch (res.data.model.returnStatus) {
            case 1:
              this.StepInfor.index = 1;
              break;
            case 2:
              this.StepInfor.index = 2;
              break;
            case 3:
              this.StepInfor.index = 2;
              break;
            case 5:
              this.StepInfor.index = 3;
              break;
            case 7:
              this.StepInfor.index = 3;
              break;
          }
          // this.StepInfor.index = res.data.model.returnStatus;
        } else if (
          res.data.model.refundType == 2 ||
          res.data.model.refundType == 3
        ) {
          ////退款的step
          switch (res.data.model.returnStatus) {
            case 1:
              this.StepInfor2.index = 1;
              break;
            case 2:
              this.StepInfor2.index = 2;
              break;
            case 5:
              this.StepInfor2.index = 2;
            case 7:
              this.StepInfor2.index = 2;
              break;
          }
          // this.StepInfor2.index = res.data.model.returnStatus;
        }

        // res.data.model.returnStatus; //  1待处理  2已同意 3.已发货  5.已完成(退款成功) 7.已拒绝  6.与取消
      });
    },
  },

  mounted() {
    console.log(this.$route.query.id);
    this.getDetailInfor();
  },
};
</script>

<style lang="scss" scoped>
.absIcon {
  position: absolute;
  right: 10px;
  top: -5px;
}
/deep/ .el-input__inner {
  height: 24px;
}
.DiaLog {
  /deep/.el-input__inner {
    height: 32px;
    width: 368px;
  }
  /deep/.el-textarea__inner {
    width: 368px;
  }
  /deep/.el-input__count {
    right: 440px;
    bottom: -10px;
    background: unset;
  }
}
.DailogFooter {
  .btn_cancle {
    width: 88px;
    height: 32px;
    line-height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(125, 130, 143, 1);
    text-align: center;
    font-weight: 400;
    color: rgba(125, 130, 143, 1);
  }
  .btn_confirm {
    margin-left: 16px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    line-height: 32px;
    min-width: 88px;
    padding: 2px 4px;
    height: 32px;
    background: rgba(224, 32, 32, 1);
    border-radius: 2px;
  }
}
.detail {
  box-sizing: border-box;
  padding: 24px 12px 20px 24px;
  background-color: #ffff;
  .header_title {
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
  .form {
    margin-top: 40px;
    min-height: 688px;
    border-radius: 2px;

    border: 1px solid rgba(232, 232, 232, 1);
    .formRight {
      padding: 15px;
      width: 275px;
      min-height: 688px;
      border-left: 1px solid rgba(232, 232, 232, 1);
      .border_bottom {
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        width: 100%;
      }
      .list_item {
        display: flex;
        .span {
          color: #7d828f;
          text-align: justify;
          width: 60px;
        }
        i {
          display: inline-block;
          /*padding-left: 100%;*/
          width: 100%;
        }
        p {
          width: 160px;
          word-wrap: break-word;
        }
      }
      .right_title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(33, 33, 33, 1);
      }
      .goodInfor_img {
        width: 68px;
        height: 68px;
        border-radius: 2px;
      }
      .goodInfor_title {
        width: 165px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 10px;
        font-family: MicrosoftYaHei;
        color: rgba(33, 33, 33, 1);
      }
      .goodInfor_type {
        font-size: 10px;
        font-family: MicrosoftYaHei;
        color: rgba(177, 182, 195, 1);
      }
    }
    .formContent {
      width: 100%;
      .Desc {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(125, 130, 143, 1);
        line-height: 30px;
      }
      .border1 {
        border-bottom: 1px solid #e8e8e8;
        width: 90%;
        margin-top: 30px;
      }
      .btn_confirm {
        min-width: 120px;
        padding: 6px;
        height: 30px;
        text-align: center;
        background: rgba(13, 105, 197, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
      }
      .btn_reject {
        min-width: 120px;
        height: 30px;
        border-radius: 4px;
        line-height: 30px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(13, 105, 197, 1);
        border: 1px solid rgba(232, 232, 232, 1);
      }
      .history_title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(33, 33, 33, 1);
        margin-top: 24px;
      }
      .content {
        width: 100%;
      }
      .content_text {
        width: 522px;
      }
      .history_item {
        line-height: 19px;
      }
    }
  }
}
</style>