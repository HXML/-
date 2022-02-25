<template>
  <div class="flex2">
    <div class="indexContent flex jcc">
      <div class="container flex2 jc-sb">
        <div class="headContent boxShadow">
          <div class="flex jc-sb f14">
            <div>
              数据更新时间：{{ formatDate(new Date()) }}
              <span class="f12 mainColor pointer" @click="Refresh">刷新</span>
            </div>
            <span
              v-if="isDataEditState"
              class="f14 pointer editBtn"
              @click="changeDataState"
              >编辑</span
            >
            <span @click="changeDataState" v-else class="f14 finishBtn pointer"
              >完成</span
            >
          </div>
          <div class="mainInfor flex fw">
            <div
              v-for="(item, index) in isDataEditState
                ? checkDataList
                : dataList"
              :key="index"
              @click="toSeePage(item.name)"
              class="item fcc rel pointer"
              :class="index != 3 && index != 7 ? 'h100' : 'margin_40'"
            >
              <img
                :src="item.isChecked ? checkImg : circleImg"
                @click="changeDataCheckState(index)"
                v-show="!isDataEditState"
                class="abs img_position"
              />
              <div class="flex2 aic" :class="item.isChecked ? '' : 'op_8'">
                <span
                  class="f26 mainColor"
                  :class="item.name == '待退款售后' ? 'fontCColor' : ''"
                >
                  <countTo
                    separator=","
                    :startVal="0"
                    :endVal="item.number"
                    :decimals="item.name == '实收金额' ? 2 : 0"
                    prefix
                    :duration="3000"
                  ></countTo>
                </span>
                <span class="mt-12">{{ item.name }}</span>
                <span
                  v-if="item.name == '浏览量' && item.pageViewsRate !== 0"
                  :style="item.pageViewsRate > 0 ? 'color:red;' : 'color:green'"
                  class="abs pageViewsRate"
                >
                  <i
                    :class="
                      item.pageViewsRate > 0 ? 'el-icon-top' : 'el-icon-bottom'
                    "
                  ></i>
                  {{ Math.abs(item.pageViewsRate) }}%
                </span>
                <span
                  v-if="item.name == '实收金额' && item.actualAmountRate !== 0"
                  :style="
                    item.actualAmountRate > 0 ? ';color:red;' : 'color:green'
                  "
                  class="abs pageViewsRate"
                >
                  <i
                    :class="
                      item.actualAmountRate > 0
                        ? 'el-icon-top'
                        : 'el-icon-bottom'
                    "
                  ></i>
                  {{ Math.abs(item.actualAmountRate) }}%
                </span>
                <span
                  v-if="item.name == '访客数' && item.visitorsRate !== 0"
                  :style="item.visitorsRate > 0 ? ';color:red;' : 'color:green'"
                  class="abs pageViewsRate"
                >
                  <i
                    :class="
                      item.visitorsRate > 0 ? 'el-icon-top' : 'el-icon-bottom'
                    "
                  ></i>
                  {{ Math.abs(item.visitorsRate) }}%
                </span>
                <span
                  v-if="item.name == '成交单数' && item.numberDealsRate !== 0"
                  :style="
                    item.numberDealsRate > 0 ? ';color:red;' : 'color:green'
                  "
                  class="abs pageViewsRate"
                >
                  <i
                    :class="
                      item.numberDealsRate > 0
                        ? 'el-icon-top'
                        : 'el-icon-bottom'
                    "
                  ></i>
                  {{ Math.abs(item.numberDealsRate) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="headContent boxShadow mt-16">
          <div class="flex jc-sb f14">
            <div>常用工具</div>
            <span
              v-if="isEditState"
              @click="changeToolState"
              class="f14 editBtn pointer"
              >编辑</span
            >
            <span v-else @click="changeToolState" class="f14 finishBtn pointer"
              >完成</span
            >
          </div>

          <div class="mainInfor mt-16 flex fw">
            <div
              v-for="(item, index) in isEditState ? checkedList : editList"
              :key="index"
              class="item mb-32 fcc rel pointer"
              @click="toOrtherPage(item.RouterName)"
            >
              <img
                :src="item.isChecked ? checkImg : circleImg"
                @click="changeToolCheckState(index)"
                v-show="!isEditState"
                class="abs img_position"
              />
              <div class="flex2 aic" :class="item.isChecked ? '' : 'op_8'">
                <div class="rel item_img">
                  <img class="item_img" :src="item.img" alt />
                  <span
                    class="abs newMsgNumber"
                    v-if="item.name == '消息通知' && newMsgNumber !== 0"
                    >{{ newMsgNumber }}</span
                  >
                </div>
                <span class="mt-6">{{ item.name }}</span>
                <div class="mt-6 tac descFont">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightContent ml-16">
        <div class="store_Infor boxShadow">
          <div class="flex aic">
            <div class="store_name f18">{{ ShopInfo.shopName }}</div>
            <div class="store_type">{{ ShopInfo.shopType }}</div>
          </div>
          <p class="mt-6 fontDColor">店铺主营：{{ ShopInfo.cateName }}</p>
          <!-- <p
            class="mt-6 fontDColor pb-20"
            style="border-bottom: 1px solid #dcdada;"
          >店铺主营：{{ShopInfo.cateName}}</p>-->
          <!-- <div class="mt-20">
            <div class="flex">
              <span class="fontDColor f14">店铺概况：</span>
              <el-rate disabled v-model="value1"></el-rate>
            </div>
          </div>-->
          <!-- <div class="mt-12 f24">
            ¥3,000
            <span class="fontEColor f14 ml-8">/目标 ¥10,000</span>
          </div>
          <p class="mt-12 fontEColor f14">距离两星还差7,000</p>
          <el-progress
            class="mt-12"
            :color="customColor"
            :text-inside="true"
            :stroke-width="26"
            :percentage="70"
          ></el-progress>
          <p class="mt-12 fontEColor f12">数据近30天累计销售金额统计</p>-->
        </div>
        <div class="notice_infor boxShadow mt-16">
          <div class="notice_header flex jc-sb aic">
            <span class="f16">公告</span>
            <span class="fontEColor f14 pointer" @click="JumpNotice">更多</span>
          </div>
          <!-- <div class="notice_border mt-8"></div> -->

          <ul class="notice_list mt-24">
            <li
              v-for="(item, index) in NoticeData"
              :key="index"
              @click="GetNoticeInfo(index, item.id)"
              class="flex aic jc-sb pointer"
            >
              <span v-if="item.isNew !== 0" class="notice_type">新</span>
              <span class="fg1 ml-8" :class="item.readed ? 'op_5' : ''">{{
                item.title
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <el-dialog
        :title="NoticeInfo.title"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>{{ NoticeInfo.body }}</span>
        <span slot="footer" class="dialog-footer">
          <p style="margin-bottom: 10px; color: #606266">
            {{ NoticeInfo.creatorDate }}
          </p>
          <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <div class="shangxian mt-14">兆 客 易 购·商 城 已 正 式 上 线</div> -->
    <img class="mt-14" src="@/assets/1.2/qifen.png" alt />
    <MessageDialog
      v-if="show"
      :show.sync="show"
      :ListData="ListData"
      @alwayShow="alwayShow"
    />
  </div>
</template>

<script>
import countTo from "vue-count-to";
import { Message } from "element-ui";
import { Loading } from "element-ui";
import { StoreStatisticsAPI } from "@/api/index";
import { PagerOrderMsgAPI } from "@/api/commonAPI";
import { RenewalToken } from "@/utils/updateToken";
import { _removeToken } from "@/common/js/storage";
import { switchTime } from "@/common/js/ycpd_Utils";
import {
  GetNoticeAPI,
  NoticeInfoAPI,
  ShopIndexInfoAPI,
  IsEnabledMerchantAPI,
  PagerOrderMsgNumAPI,
} from "@/api/shopAPI";
import MessageDialog from "@/components/MessageDialog/index";

export default {
  components: { countTo, MessageDialog },

  data() {
    return {
      // newMsgNumber: 0, //未读数
      ListData: [], //弹窗的数据
      show: false, //弹窗的显示影藏
      startVal: 0,
      endVal: 7,
      value1: 2,
      isDataEditState: true,
      dialogVisible: false,
      NoticeData: [], //公告数据
      NoticeInfo: {}, //公告详情
      ShopInfo: {}, //店铺信息
      isEditState: true, //tool的
      checkImg: require("@/assets/index_Icon/check.png"),
      circleImg: require("@/assets/index_Icon/circle.png"),
      customColor:
        "linear-gradient(90deg,rgba(125,190,255,1) 0%,rgba(13,105,197,1) 100%);",
      dataList: [
        {
          number: 0,
          name: "待付款订单",
          isChecked: true,
        },
        {
          number: 0,
          name: "待发货订单",
          isChecked: true,
        },
        {
          number: 0,
          name: "待退款售后",
          isChecked: true,
        },
        {
          number: 0,
          name: "已售罄商品",
          isChecked: true,
        },
        {
          number: 0,
          name: "浏览量",
          isChecked: true,
        },
        {
          number: 0,
          name: "访问量",
          isChecked: true,
        },
        {
          number: 0,
          name: "成交单数",
          isChecked: true,
        },
        {
          number: 0,
          name: "实收金额",
          isChecked: true,
        },
      ],
      checkDataList: [
        {
          number: 0,
          name: "待付款订单",
          isChecked: true,
        },
        {
          number: 0,
          name: "待发货订单",
          isChecked: true,
        },
        {
          number: 0,
          name: "待退款售后",
          isChecked: true,
        },
        {
          number: 0,
          name: "已售罄商品",
          isChecked: true,
        },
        {
          number: 0,
          name: "浏览量",
          isChecked: true,
        },
        {
          number: 0,
          name: "访客数",
          isChecked: true,
        },
        {
          number: 0,
          name: "成交单数",
          isChecked: true,
        },
        {
          number: 0,
          name: "实收金额",
          isChecked: true,
        },
      ],

      checkedList: [
        {
          img: require("@/assets/index_Icon/icon_fbsp.svg"),
          name: "发布商品",
          desc: "需事先准备商品图片/描述/运费等内容",
          isChecked: true,
          RouterName: "release",
        },
        {
          img: require("@/assets/index_Icon/icon_zx.svg"),
          name: "店铺装修",
          desc: "据说，美美的店铺销量更好",
          isChecked: true,
          RouterName: "template",
        },
        {
          img: require("@/assets/index_Icon/icon_yhj.svg"),
          name: "消息通知",
          desc: "新的订单/未发货的订单提醒",
          isChecked: true,
          RouterName: "Message",
        },
        {
          img: require("@/assets/index_Icon/icon_yfmb.svg"),
          name: "运费模板",
          desc: "自定义运费，满足所有需求",
          isChecked: true,
          RouterName: "ExpressTemset",
        },
        {
          img: require("@/assets/index_Icon/icon_ymcdsp.svg"),
          name: "已售商品",
          desc: "当前已经卖出的商品",
          isChecked: true,
          RouterName: "saleOrder",
        },
        {
          img: require("@/assets/index_Icon/icon_dpjj.svg"),
          name: "店铺简介",
          desc: "介绍一下店铺，让买家更加了解你们",
          isChecked: true,
          RouterName: "shopData",
        },
        {
          img: require("@/assets/index_Icon/icon_zhsz.svg"),
          name: "人员管理",
          desc: "本店旗下的其他人员",
          isChecked: true,
          RouterName: "Role",
        },
        {
          img: require("@/assets/index_Icon/icon_czzz.svg"),
          name: "操作日志",
          desc: "每一步操作都有记录",
          isChecked: true,
          RouterName: "Log",
        },
      ],
      editList: [
        {
          img: require("@/assets/index_Icon/icon_fbsp.svg"),
          name: "发布商品",
          desc: "需事先准备商品图片/描述/运费等内容",
          isChecked: true,
          RouterName: "release",
        },
        {
          img: require("@/assets/index_Icon/icon_zx.svg"),
          name: "店铺装修",
          desc: "据说，美美的店铺销量更好",
          isChecked: true,
          RouterName: "template",
        },
        {
          img: require("@/assets/index_Icon/icon_yhj.svg"),
          name: "消息通知",
          desc: "新的订单/未发货的订单提醒",
          isChecked: true,
          RouterName: "Message",
        },
        {
          img: require("@/assets/index_Icon/icon_yfmb.svg"),
          name: "运费模板",
          desc: "自定义运费，满足所有需求",
          isChecked: true,
          RouterName: "ExpressTemset",
        },
        {
          img: require("@/assets/index_Icon/icon_ymcdsp.svg"),
          name: "已售商品",
          desc: "当前已经卖出的商品",
          isChecked: true,
          RouterName: "saleOrder",
        },
        {
          img: require("@/assets/index_Icon/icon_dpjj.svg"),

          name: "店铺简介",
          desc: "介绍一下店铺，让买家更加了解你们",
          isChecked: true,
          RouterName: "shopData",
        },
        {
          img: require("@/assets/index_Icon/icon_zhsz.svg"),
          name: "人员管理",
          desc: "本店旗下的其他人员",
          isChecked: true,
          RouterName: "Role",
        },
        {
          img: require("@/assets/index_Icon/icon_czzz.svg"),
          name: "操作日志",
          desc: "每一步操作都有记录",
          isChecked: true,
          RouterName: "Log",
        },
      ],
    };
  },
  methods: {
    toOtherPage(name) {
      if (!this.isDataEditState) {
        return;
      }
      if (name == "待付款订单") {
        this.$router.push({
          name: name,
        });
      }
      if (name == "待发货订单") {
      }
      if (name == "待退款售后") {
      }
    },
    // 1. 若小于10，前面加0
    isZero(m) {
      return m < 10 ? "0" + m : m;
    },
    // 将字符串转为Date格式，获取对应的年、月、日、时、分、秒。组合格式
    formatDate(shijianchuo) {
      //时间戳是整数，否则要parseInt转换
      var time = new Date(shijianchuo); // 需要使用Date格式进行日期转化，若是时间戳、字符串时间，需要通过new Date(..)转化

      var y = time.getFullYear();

      var m = time.getMonth() + 1;

      var d = time.getDate();

      var h = time.getHours();

      var mm = time.getMinutes();

      var s = time.getSeconds();

      return (
        y +
        "-" +
        this.isZero(m) +
        "-" +
        this.isZero(d) +
        " " +
        this.isZero(h) +
        ":" +
        "00" +
        ":" +
        "00"
      );
    },
    startTimer() {
      clearInterval(window.chatTimer);
      window.chatTimer = setInterval(() => {
        this.getListData();
      }, 5000);
    },
    alwayShow(e) {
      console.log(e, "子组件来的值: 是否一致关闭 弹窗");
      if (!e) {
        // window.localStorage.setItem("nextTimeDisplay", true);
        this.startTimer();
      } else {
        // window.localStorage.setItem("nextTimeDisplay", false);
        clearInterval(window.chatTimer);
      }
    },
    getListData() {
      // console.log(timer, "timer");
      console.log(this.$store.getters.ids, "timer");
      let oldIdString = this.$store.getters.ids;
      let _that = this;
      if (_that.show) {
        clearInterval(window.chatTimer);
      }

      PagerOrderMsgAPI().then((res) => {
        console.log(res.data, " res.data res.data");
        this.ListData = res.data;
        let arr = [];
        res.data.forEach((element) => {
          arr.push(...element.idArr);
        });
        this.$store.dispatch("changeIds", arr.sort().toString());
        if (oldIdString === arr.sort().toString()) {
          console.log("不弹窗不弹窗不弹窗不弹窗不弹窗");
        } else {
          console.log("弹窗弹窗弹窗弹窗弹窗弹窗弹窗");
          this.$store.dispatch("changeDialogState", true);
          _that.show = true;
        }
      });
    },
    toSeePage(name) {
      if (!this.isDataEditState) {
        return;
      }
      if (name == "待付款订单") {
        this.$router.push({
          name: "saleOrder",
          params: {
            id: "1",
          },
        });
      }
      if (name == "待发货订单") {
        this.$router.push({
          name: "saleOrder",
          params: {
            id: "2",
          },
        });
      }
      if (name == "待退款售后") {
        this.$router.push({
          name: "refundOrder",
        });
      }
      if (name == "已售罄商品") {
        this.$router.push({
          name: "offlineGoods",
        });
      }
      console.log(name, "toSeePage");
    },
    toOrtherPage(name) {
      console.log(name, "namename");
      if (!this.isEditState) {
        return false;
      }
      if (name == "Message") {
        this.show = true;
        this.getListData();
        clearInterval(window.chatTimer);
        return;
      }
      this.$router.push({
        name: name,
      });
    },
    Refresh() {
      let options = {
        text: "玩命加载中...",
      };
      let loadingInstance = Loading.service(options);
      setTimeout(() => {
        this.getListData();
        loadingInstance.close();
      }, 1000);
    },
    changeToolState() {
      this.isEditState = !this.isEditState;
      if (this.isEditState) {
        this.checkedList = this.editList.filter((item) => item.isChecked);
        console.log(this.checkedList, "sss");
      }
    },
    changeDataState() {
      this.isDataEditState = !this.isDataEditState;
      if (this.isDataEditState) {
        this.checkDataList = this.dataList.filter((item) => item.isChecked);
        console.log(this.checkDataList, "sss");
      }
    },
    changeToolCheckState(index) {
      console.log(index, "index");
      this.editList[index].isChecked = !this.editList[index].isChecked;
    },
    changeDataCheckState(index) {
      this.dataList[index].isChecked = !this.dataList[index].isChecked;
    },
    // 查询公告
    GetNotice() {
      GetNoticeAPI("get").then((res) => {
        console.log(res);
        this.NoticeData = res.data.rows.map((item) => {
          return {
            id: item.id,
            title: item.title,
            isNew: item.isNew,
            readed: false,
          };
        });
      });
    },
    //关闭弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    //获取公告详情
    GetNoticeInfo(index, NotId) {
      this.NoticeData[index].readed = true;
      var params = {
        id: NotId,
      };
      NoticeInfoAPI(params, "get").then((res) => {
        console.log(res);
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.NoticeInfo = res.data;
        this.dialogVisible = true;
      });
    },
    GetShopInfo() {
      ShopIndexInfoAPI("get").then((res) => {
        this.ShopInfo = res.data;
      });
    },
    //跳转公告列表
    JumpNotice() {
      this.$router.push({ path: "../../Notice" });
    },
    getMegData() {
      let data = {
        dateTime: switchTime(new Date()),
      };
      StoreStatisticsAPI(data, "get").then((res) => {
        //待优化
        console.log(res.data, "res");
        for (let index = 0; index < this.dataList.length; index++) {
          if (this.dataList[index].name == "浏览量") {
            this.dataList[index].number = res.data.shopStatistics.pageviewsNum;
            this.checkDataList[index].number =
              res.data.shopStatistics.pageviewsNum;
            this.dataList[index].pageViewsRate = res.data.rate.pageViewsRate;
            this.checkDataList[index].pageViewsRate =
              res.data.rate.pageViewsRate;
          }
          if (this.dataList[index].name == "访问量") {
            this.dataList[index].number = res.data.shopStatistics.visitorsNum;
            this.checkDataList[index].number =
              res.data.shopStatistics.visitorsNum;

            this.dataList[index].visitorsRate = res.data.rate.visitorsRate;
            this.checkDataList[index].visitorsRate = res.data.rate.visitorsRate;
          }
          if (this.dataList[index].name == "成交单数") {
            this.dataList[index].number =
              res.data.shopStatistics.numberDealsNum;
            this.checkDataList[index].number =
              res.data.shopStatistics.numberDealsNum;

            this.dataList[index].numberDealsRate =
              res.data.rate.numberDealsRate;
            this.checkDataList[index].numberDealsRate =
              res.data.rate.numberDealsRate;
          }
          if (this.dataList[index].name == "实收金额") {
            this.dataList[index].number = res.data.shopStatistics.actualAmount;
            this.checkDataList[index].number =
              res.data.shopStatistics.actualAmount;

            this.dataList[index].actualAmountRate =
              res.data.rate.actualAmountRate;
            this.checkDataList[index].actualAmountRate =
              res.data.rate.actualAmountRate;
          }

          if (this.dataList[index].name == "待付款订单") {
            this.dataList[index].number = res.data.orderSum.pendingPayNum;
            this.checkDataList[index].number = res.data.orderSum.pendingPayNum;
          }
          if (this.dataList[index].name == "待发货订单") {
            this.dataList[index].number = res.data.orderSum.deliveredNum;
            this.checkDataList[index].number = res.data.orderSum.deliveredNum;
          }
          if (this.dataList[index].name == "待退款售后") {
            this.dataList[index].number = res.data.orderSum.pendingRefundNum;
            this.checkDataList[index].number =
              res.data.orderSum.pendingRefundNum;
          }
          if (this.dataList[index].name == "已售罄商品") {
            this.dataList[index].number = res.data.orderSum.soldOutNum;
            this.checkDataList[index].number = res.data.orderSum.soldOutNum;
          }
        }
      });
    },
  },
  mounted() {
    this.getMegData();
    PagerOrderMsgNumAPI().then((res) => {
      //获取新的订单数量API
      console.log(res, "resres");
      this.$store.dispatch("changeReadNumber", res.data); //未读订单数
    });
    IsEnabledMerchantAPI().then((res) => {
      console.log(res);
      if (res.code == 0) {
        this.$alert(res.msg, "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            _removeToken();
            this.$router.push({
              path: "/login",
            });
          },
        });
      }
    });
    this.GetNotice();
    this.GetShopInfo();
  },
  computed: {
    newMsgNumber: function () {
      return this.$store.getters.restUnRead;
    },
  },
};
</script>

<style lang="scss" scoped>
.pageViewsRate {
  font-weight: 550;
  font-size: 16px;
  top: -10px;
  right: 16px;
}

.newMsgNumber {
  font-size: 12px;
  font-weight: Bold;
  width: 18px;
  line-height: 18px;
  text-align: center;
  height: 18px;
  background: #e02020;
  color: #fff;
  right: -11px;
  top: -11px;
  border-radius: 9px;
}
.shangxian {
  font-size: 35px;
  color: #ffefc5;
  width: 100%;
  height: 52px;
  line-height: 52px;
  text-align: center;
  background: linear-gradient(90deg, #dd5555 2%, #f97c5f 57%, #d85d5d);
  border-radius: 8px;
}
.h100 {
  border-right: 1px solid rgba(220, 218, 218, 0.6);
  // height: 80px;
  margin: 40px 0;
}
.margin_40 {
  margin: 40px 0;
}
.descFont {
  font-size: 12px;
  text-align: center;
  color: #7d828f;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
}
// .w_144 {
//   width: 144px;
//   height: 144px;
// }
.op_8 {
  opacity: 0.8;
}
.op_5 {
  opacity: 0.5;
}
.img_position {
  z-index: 99;
  height: 14px;
  width: 14px;
  right: 25px;
  top: 35px;
}
/deep/.el-progress-bar__inner {
  background-image: linear-gradient(
    90deg,
    rgba(255, 189, 32, 1) 0%,
    rgba(247, 109, 23, 1) 100%
  );
}
/deep/ .el-progress-bar__outer {
  height: 15px !important;
  background-color: #e8e8e8;
}
.editBtn {
  width: 88px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  font-family: MicrosoftYaHei;
  color: #b1b6c3;
  line-height: 32px;
  text-align: center;
}
.finishBtn {
  width: 88px;
  height: 32px;
  background: rgba(13, 105, 197, 1);
  border-radius: 4px;
  font-family: MicrosoftYaHei;
  color: rgba(255, 255, 255, 1);
  line-height: 32px;
  text-align: center;
}
.indexContent {
  .container {
    width: 840px;
    .headContent {
      background-color: #fff;
      box-sizing: border-box;
      padding: 18px 24px 0 24px;
      width: 100%;
      height: 364px;
    }
    .mainInfor {
      width: 100%;
      .item {
        // min-width: 10vw;
        height: 50%;
        width: 25%;
      }
      .item_img {
        height: 60px;
        width: 60px;
      }
    }
    .footerContent {
      width: 100%;
      height: 342px;
    }
  }
  .rightContent {
    .store_Infor {
      width: 344px;
      background-color: #fff;
      width: 100%;
      box-sizing: border-box;
      padding: 24px;
    }
    .store_type {
      margin-left: 9px;
      padding: 1px 4px;
      background: #e02020;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      color: #ffffff;
      line-height: 18px;

      // margin-left: 6px;
      // background: rgba(228, 109, 12, 0.1);
      // // padding: 2px 3px;
      // // border-radius: 9px;
      // border: 1px solid rgba(228, 109, 12, 1);
      // font-size: 12px;
      // font-family: MicrosoftYaHei;
      // color: rgba(228, 109, 12, 1);
    }
    .notice_infor {
      width: 344px;
      min-height: 452px;
      box-sizing: border-box;
      padding: 24px;
      background-color: #fff;
      .notice_border {
        border: 1px solid #f9f9f9;
      }
      .notice_list {
        li {
          margin-bottom: 16px;
        }
        .notice_type {
          width: 25px;
          line-height: 14px;
          text-align: center;
          height: 14px;
          background: rgba(228, 109, 12, 1);
          border-radius: 7px;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>