<template>
  <div class="MessageDialog">
    <el-dialog :visible.sync="visible" @close="changeBoxValue()" :show="show">
      <div slot="title" class="flex jc-sb mt--4">
        <span>{{ shopName }}</span>
        <div class="mr-48">
          <el-checkbox v-model="nextTimeDisplay">本次不再提醒</el-checkbox>
        </div>
      </div>
      <div class="dialog_content flex">
        <div class="dialog_left">
          <section
            v-for="(inforItem, inforIndex) in ListData"
            :key="inforIndex"
          >
            <div
              class="silderList pb-12"
              :class="inforItem.isShow ? '' : 'flex aic'"
              v-if="inforItem.value.rows.length !== 0"
            >
              <!-- {{inforItem.isShow}} -->
              <div
                class="pointer ml-20"
                @click="inforItem.isShow = !inforItem.isShow"
              >
                <!-- {{inforIndex}} -->
                <i
                  class="S_title"
                  :class="
                    inforItem.isShow
                      ? 'el-icon-arrow-right'
                      : 'el-icon-arrow-down'
                  "
                ></i>
                <span
                  class="S_title ml-6"
                  v-if="inforItem.key == 'SHOP_MESSAGE_001'"
                  >发货提醒</span
                >
                <span
                  class="S_title ml-6"
                  v-if="inforItem.key == 'SHOP_MESSAGE_002'"
                  >新订单</span
                >
                <span
                  class="S_title ml-6"
                  v-if="inforItem.key == 'SHOP_MESSAGE_003'"
                  >已付款成功消息</span
                >
                <span
                  class="S_title ml-6"
                  v-if="inforItem.key == 'SHOP_MESSAGE_004'"
                  >退款消息</span
                >
                <span
                  class="S_title ml-6"
                  v-if="inforItem.key == 'SHOP_MESSAGE_005'"
                  >售后消息</span
                >
              </div>
              <div class="flex2" v-if="inforItem.isShow ">
                <div
                  class="messageItem flex aic pb-8 pt-8 mt-12 pointer"
                  :class="
                    bigIndex == inforIndex && activeIndex == index
                      ? 'activeBg'
                      : ''
                  "
                  v-for="(item, index) in inforItem.value.rows"
                  :key="index"
                  @click="
                    getItemDetailById(
                      inforIndex,
                      item.id,
                      index,
                      item.jsonUserData
                    )
                  "
                >
                  <div class="ml-20 rel">
                    <img
                      :src="
                        item.jsonUserData.UserHeadImg +
                        '?x-oss-process=style/b4'
                      "
                      class="avtor mr-6"
                    />
                    <div v-if="!item.isRead" class="abs redPosition"></div>
                  </div>
                  <span class="name">{{ item.jsonUserData.UserName }}</span>
                </div>
              </div>
              <div
                v-if="!inforItem.isShow && checArrHaveNew(inforItem)"
                class="redPosition2 ml-6"
              ></div>
            </div>
          </section>
        </div>

        <div class="dialog_right w100pc">
          <div v-if="rightData == ''" class="fcc"></div>
          <div v-else>
            <div class="flex jc-sb aic">
              <span>订单编号：{{ rightData.orderNo }}</span>
              <span>{{ rightData.creatorDate }}</span>
            </div>
            <div class="container flex2 mt-32">
              <div
                class="flex mb-20"
                v-for="(orderItem, index) in rightData.itemList"
                :key="index"
              >
                <div>
                  <img
                    :src="orderItem.imageUrl + '?x-oss-process=style/b4'"
                    class="itemImg mr-16"
                  />
                </div>
                <ul>
                  <li class="itemTitle mb-8 flex">
                    <span class="itemName">商品：</span>
                    <div class="overHide_500">{{ orderItem.goodsName }}</div>
                  </li>
                  <li class="itemTitle mb-8 itemSku">
                    <span class="itemName">规格：</span>
                    {{ orderItem.orderOtherData | ToJsonSting }}
                  </li>
                  <li class="itemTitle mb-8">
                    <span class="itemName">数量：</span>
                    {{ orderItem.qty }}
                  </li>
                  <li class="itemTitle mb-8">
                    <span class="itemName">金额：</span>
                    {{ orderItem.totalPrice }}
                  </li>
                </ul>
              </div>
            </div>

            <ul
              class="flex aic mt-40"
              style="text-align: right; justify-content: flex-end"
            >
              <li class="mr-40">
                总数量:
                <span class="allCount">{{ countNumber }}件</span>
              </li>
              <li class="mr-40">
                运费:
                <span class="allCount">{{ rightData.shippingCost }}</span>
              </li>
              <li class="mr-40">
                总金额:
                <span class="allCount">{{ rightData.totalPrice }}</span>
              </li>
              <li class="detailBtn pointer" @click="toOtherPage">
                {{ rightDataBtnType }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  PagerOrderMsgAPI,
  GetOrderEntityAPI,
  GetMessageInfoAPI,
  GetReturnOrderEntityAPI,
} from "@/api/commonAPI";
import { PagerOrderMsgNumAPI } from "@/api/shopAPI";
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    ListData: Array,
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
  data() {
    return {
      rightDataBtnID: 0, //右下角的按钮的id
      rightDataBtnType: "订单详情", //当key 为SHOP_MESSAGE_004时为退款 其他为订单
      bigIndex: 0, //右边列表的大Index
      nextTimeDisplay: true, //下次不再提示
      activeIndex: 0, //左边小列表的index
      visible: this.show, //是否展示
      rightData: "", //右边的数据
      shopName: "", //店铺名
    };
  },
  filters: {
    ToJsonSting: function (value) {
      //过滤
      if (!value) return "";
      if (value) {
        let skuObjList = JSON.parse(value);
        let string = "";
        skuObjList.forEach((item) => {
          string += item.Key + ":" + item.Value;
        });
        return string;
      }
    },
    JsonPares: function (value) {
      //解析json
      if (!value) return "";
      if (value) {
        let value = JSON.parse(value);
        return value;
      }
    },
  },
  computed: {
    countNumber: function () {
      //计算总数
      let list = this.rightData.itemList;
      let countNumber = 0;
      list.forEach((item) => {
        countNumber += item.qty;
      });
      return countNumber;
    },
  },
  methods: {
    checArrHaveNew(list) {
      //检查红点
      let arr = list.value.rows.map((item) => {
        return item.isRead;
      });
      return arr.includes(false);
    },
    toOtherPage() {
      //跳转
      if (this.rightDataBtnType == "退款单详情") {
        this.$emit("update:show", false);
        this.$router.push({
          //退款单详情
          path: "/refundOrderDetail?id=" + this.rightDataBtnID,
        });
      } else {
        //订单详情
        this.$emit("update:show", false);
        this.$router.push({
          path: "/OrderDetil?ids=" + this.rightDataBtnID,
        });
      }
    },
    changeBoxValue() {
      //关闭页面的回调
      //获取新的订单数量API
      PagerOrderMsgNumAPI().then((res) => {
        console.log(res.data, "resres");
        this.$store.dispatch("changeDialogState", this.nextTimeDisplay); //下次是否弹窗
        this.$store.dispatch("changeReadNumber", res.data); //未读订单数
        this.$emit("update:show", false); //显示隐藏
        this.$emit("alwayShow", this.nextTimeDisplay);
        // this.ShowDialog = false;
      });
    },
    clickOrder(index) {
      //点击展示
      this.ListData.index.showList = !this.ListData.index.showList;
    },
    getItemDetailById(inforIndex, id, index, jsonUserData) {
      //获取详情
      this.ListData[inforIndex].value.rows[index].isRead = true;
      this.bigIndex = inforIndex;
      let newArr = this.$store.getters.ids.split(",").map((item) => {
        return Number(item);
      });
      if (newArr.indexOf(id) != -1) {
        newArr.splice(newArr.indexOf(id), 1);
      }
      this.$store.dispatch("changeIds", newArr.sort().toString());
      this.activeIndex = index;
      // console.log(jsonUserData, "jsonUserData");
      if (this.ListData[inforIndex].key == "SHOP_MESSAGE_004") {
        this.rightDataBtnID = jsonUserData.RetId;
        this.rightDataBtnType = "退款单详情";
      } else {
        this.rightDataBtnID = jsonUserData.OrderId;
      }
      GetOrderEntityAPI({
        id: id,
      }).then((res) => {
        console.log(res);
        this.rightData = res.data;
      });
      // if (
      //   this.ListData[inforIndex].key == "SHOP_MESSAGE_002" ||
      //   this.ListData[inforIndex].key == "SHOP_MESSAGE_003"||
      //   this.ListData[inforIndex].key == "SHOP_MESSAGE_001"
      // ) {
      //   //订单
      //   GetOrderEntityAPI({
      //     id: id,
      //   }).then((res) => {
      //     console.log(res);
      //     this.rightData = res.data;
      //   });
      // } else if (
      //   this.ListData[inforIndex].key == "SHOP_MESSAGE_004" ||
      //   this.ListData[inforIndex].key == "SHOP_MESSAGE_005"
      // ) {
      //   //退款
      //   GetReturnOrderEntityAPI({
      //     id: id,
      //   }).then((res) => {
      //     console.log(res);
      //     this.rightData = res.data;
      //   });
      // }
    },
  },
  mounted() {
    this.nextTimeDisplay = true;
    this.shopName = this.$store.getters.currentUser.shopName + "_消息通知";
    // console.log(this.ListData)
  },
};
</script>
<style lang="scss" scoped>
.overHide_500 {
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #b1b6c3;
}
/deep/ .el-checkbox {
  color: #b1b6c3;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #b1b6c3;
  border-color: #b1b6c3;
}
.redPosition {
  width: 6px;
  height: 6px;
  background: #e02020;
  border-radius: 50%;
  top: -2px;
  right: 4px;
}
.redPosition2 {
  width: 6px;
  height: 6px;
  background: #e02020;
  border-radius: 50%;
}
.S_title {
  font-size: 14px;
  color: #000a26;
}
/deep/ .el-dialog__header {
  background: rgba(246, 246, 246, 1);
  padding: 24px 24px 11px 24px;
}
/deep/ .el-dialog__body {
  padding: 0;
  min-height: 500px;
}
.activeBg {
  background-color: rgba(246, 246, 246, 1);
}
.avtor {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.silderList {
  width: 178px;
}
.dialog_left {
  // padding: 22px 12px 20px 24px;
  padding-top: 22px;
  border-right: 1px solid #f6f6f6;
}
.container {
  height: 400px;
  overflow-y: scroll;
}
.dialog_right {
  padding: 22px 1.25vw 18px 24px;
  .itemImg {
    width: 98px;
    height: 98px;
    border-radius: 8px;
  }
  .itemTitle {
    font-size: 12px;
    color: rgba(74, 80, 96, 1);
    font-weight: bold;
  }
  .itemName {
    font-size: 12px;
    color: #7d828f;
  }
  .itemSku {
    font-size: 12px;
    color: rgba(228, 109, 12, 1);
    font-weight: bold;
  }
  .allCount {
    font-size: 16px;
    font-weight: Bold;
    color: rgba(228, 109, 12, 1);
  }
  .detailBtn {
    width: 103px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    color: #ffffff;
    background: #0d69c5;
    border-radius: 4px;
  }
}
</style>