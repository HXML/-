<template>
  <errorPage v-if="CODE === 101" />
  <div class="orderDetail" style="padding-bottom: 30px" v-else>
    <Step :message="Stepindex" />
    <!-- <el-divider></el-divider> -->
    <div class="header">
      <span class="sell_person">卖家信息</span>
      <span
        class="ml-8"
        style="color: #0d69c5"
        @click="
          modeldata.orderStatus < 3 ? (canEdit = !canEdit) : (canEdit = true)
        "
      >
        <i class="el-icon-edit"></i>修改
      </span>
      <span class="sell_infor">/ 仅可修改收货人信息，发货后都不可修改</span>
    </div>
    <div class="flex forms">
      <ul class="form1 flex2">
        <li class="flex">
          <span>昵称：</span>
          <span class="ovOne_200">{{ modeldata.nickName }}</span>
        </li>
        <li class="flex">
          <span>付款方式：</span>
          <span>{{ modeldata.oPayType }}</span>
        </li>
        <li class="flex jc-fs">
          <span>买家留言：</span>
          <div class="warpOver_200">{{ modeldata.userRmk }}</div>
        </li>
        <li v-if="modeldata.shopPickupPointId !== 0" class="flex jc-fs">
          <span>提货门店：</span>
          <div class="warpOver_200">{{ modeldata.shopPickupPointName }}</div>
        </li>
        <li class="flex jc-fs">
          <span>用户佣金：</span>
          <div class="warpOver_200">{{ modeldata.pUserCommission }}</div>
        </li>
        <li class="flex jc-fs">
          <span>平台佣金：</span>
          <div class="warpOver_200">{{ modeldata.commission }}</div>
        </li>
      </ul>
      <ul class="form2 flex2">
        <li class="flex">
          <span>收货人：</span>
          <span v-if="canEdit">{{ modeldata.consignee }}</span>
          <el-input v-else v-model="modeldata.consignee"></el-input>
        </li>
        <li class="flex">
          <span>收货电话：</span>
          <span v-if="canEdit">{{ modeldata.consigneeMobile }}</span>
          <el-input v-else v-model="modeldata.consigneeMobile"></el-input>
        </li>
        <li class="flex">
          <span>收货地址：</span>
          <span v-if="canEdit">{{ modeldata.consigneeAddress }}</span>
          <el-input v-else v-model="modeldata.consigneeAddress"></el-input>
        </li>
        <li v-if="modeldata.shopPickupPointId !== 0" class="flex">
          <span>门店地址：</span>
          <span>{{ modeldata.shopPickupPointAddress }}</span>
        </li>

        <span v-if="!canEdit" @click="confirmButton" class="confirmButton"
          >确认</span
        >
      </ul>
    </div>
    <el-divider v-if="expshow"></el-divider>

    <div class="header" v-if="expshow">
      <span class="sell_person">物流信息</span>
    </div>

    <!-- modeldata.shopPickupPointId -->

    <el-form class="flex fw wl" v-if="expshow">
      <!-- <span v-if="canEdit">{{modeldata.transCo}}</span> -->
      <el-form-item label="物流公司" label-width="100px" prop="name">
        <!-- {{expEdit}} -->
        <span v-show="expEdit" class="clearCondition_active">{{
          modeldata.transCo
        }}</span>
        <el-select
          v-show="!expEdit"
          placeholder="请选择"
          v-model="modeldata.transCo"
        >
          <el-option
            v-for="(item, index) in BusExpList"
            :key="index"
            v-bind:label="item.coName"
            :value="item.coName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" label-width="100px" prop="name">
        <span v-if="expEdit" class="clearCondition_active">{{
          modeldata.transNo
        }}</span>

        <el-input
          v-else
          placeholder="请输入"
          v-model="modeldata.transNo"
        ></el-input>
      </el-form-item>
      <div
        v-if="modeldata.orderStatus <= 21 || modeldata.orderStatus == 82"
        class="flex aic"
      >
        <el-form-item v-if="expEdit" prop="name">
          <div class="flex aic">
            <span
              class="ml-8"
              v-if="modeldata.orderStatus == 3"
              style="color: #0d69c5"
              @click="expEdit = !expEdit"
            >
              <i class="el-icon-edit"></i>修改
            </span>
            <span v-if="modeldata.orderStatus == 3" class="sell_infor"
              >/ 物流信息仅可修改一次，请谨慎修</span
            >
            <div
              class="span_confirm_active"
              @click="checkKuaidiInfor(modeldata.transNo)"
            >
              查看物流
            </div>
          </div>
        </el-form-item>
        <el-form-item v-else prop="name">
          <div class="flex aic">
            <div class="span_confirm_active pointer" @click="confirm">
              确认发货
            </div>
            <div
              v-show="false"
              class="span_confirm_active pointer"
              @click="expEdit = !expEdit"
            >
              取消
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div class="ts" v-if="expshow">
      <span v-show="modeldata.shopPickupPointId == 0"
        >( 必须填写物流信息 )</span
      >
      <span v-show="modeldata.shopPickupPointId > 0">( 物流信息非必填项 )</span>
    </div>

    <el-divider></el-divider>

    <!-- 列表页 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column min-width="180px" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <div class="flex aic">
            <div class="flex jc-fs ml-8">
              <div style="height: 70px; width: 70px">
                <el-image
                  :preview-src-list="[
                    scope.row.imageUrl + '?x-oss-process=style/b5',
                  ]"
                  style="height: 70px; width: 70px"
                  :src="scope.row.imageUrl + '?x-oss-process=style/s4'"
                  alt
                />
              </div>
              <div class="ml-8 title">{{ scope.row.goodsName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品属性">
        <template slot-scope="scope">
          <span
            v-for="(itemB, indexThree) in scope.row.orderOtherData"
            :key="indexThree"
          >
            <em v-if="itemB.Value != ''"
              >{{ itemB.Key }}：{{ itemB.Value }};</em
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态">{{ modeldata.oStatusStr }}</el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="qty" label="数量"></el-table-column>
      <el-table-column label="优惠">
        <template slot-scope="scope">
          <div>活动优惠：{{ scope.row.actPrice | toNumber }}</div>
          <div>平台优惠：{{ scope.row.favouredPrice | toNumber }}</div>
          <!-- <div>活动优惠：{{ scope.row.actPrice | toNumber }}</div> -->
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="商品总价"></el-table-column>
    </el-table>
    <div class="orderMessage">
      <span class="order_title">订单信息</span>

      <div v-if="modeldata.coTaxNo != ''">
        <span>发票抬头：</span>
        <span>{{ modeldata.invoiceTitle }}</span>
      </div>

      <div v-if="modeldata.coTaxNo != ''">
        <span>企业税号：</span>
        <span>{{ modeldata.coTaxNo }}</span>
      </div>

      <div v-if="modeldata.orderStatus > 0">
        <span>订单编号：</span>
        <span>{{ modeldata.orderNo }}</span>
      </div>
      <div v-if="modeldata.orderStatus > 1">
        <span>支付单号：</span>
        <span>{{ modeldata.payNo }}</span>
      </div>
      <div v-if="modeldata.orderStatus > 0">
        <span>创建时间：</span>
        <span>{{ modeldata.creatorDate }}</span>
      </div>
      <div v-if="modeldata.orderStatus > 1">
        <span>付款时间：</span>
        <span>{{ modeldata.payTime }}</span>
      </div>

      <div v-if="modeldata.orderStatus > 2">
        <span>发货时间：</span>
        <span>{{ modeldata.shipmentTime }}</span>
      </div>
      <div v-if="modeldata.orderStatus > 3">
        <span>完成时间：</span>
        <span>{{ modeldata.receiptTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Step from "@/components/Step/index";
import {
  OrderDetilAPI,
  BusExpListAPI,
  OrderTransAPI,
  OrderConsigneeAPI,
  RefundOperationOrderAPI,
} from "@/api/orderManage";
import qs from "qs";
export default {
  components: {
    Step,
  },
  data() {
    return {
      CODE: 0,
      canEdit: true, //可编辑状态
      expEdit: false, //物流可编辑状态
      expshow: false,
      modeldata: {},
      tableData: [],
      Stepindex: {
        index: 0,
        stepList: ["买家下单", "买家付款", "发货", "待收货", "订单完成"],
      },
      BusExpList: [],
    };
  },
  methods: {
    getModel() {
      let ids = this.$route.query.ids;
      let data = {
        orderId: ids,
      };

      OrderDetilAPI(data, "get")
        .then((res) => {
          if (res.code == 101) {
            this.CODE = 101;
            return;
          }
          this.modeldata = res.data;
          // modeldata.shopPickupPointId

          console.log(this.modeldata, "this.modeldata");
          res.data.itemList.forEach((element) => {
            var arr = new Array();
            var orderOtherData = JSON.parse(element.orderOtherData);

            orderOtherData.forEach((sel) => {
              arr.push(sel);
            });
            element.orderOtherData = arr;
          });

          this.tableData = res.data.itemList;
          console.log(this.tableData);
        })
        .then(() => {
          switch (this.modeldata.orderStatus) {
            case 1:
              this.expEdit = true;
              this.expshow = false;
              this.Stepindex.index = 0;
              break;
            case 2:
              this.Stepindex.index = 2;
              this.BusExpListseach();
              this.expEdit = false;
              this.expshow = true;
              break;
            case 21:
              this.Stepindex.index = 2;
              this.BusExpListseach();
              this.expEdit = false;
              this.expshow = true;
              break;
            case 3:
              this.expEdit = true;
              this.expshow = true;
              this.Stepindex.index = 3;
              break;
            case 5:
              this.expshow = true;
              this.expEdit = true;
              this.Stepindex.index = 4;
              break;
            case 82:
              this.BusExpListseach();
              this.expshow = true;
              this.expEdit = false;
              this.Stepindex.index = 2;
              break;
            default:
              this.expshow = false;
              this.expEdit = false;
              this.Stepindex.index = 4;
              break;
          }
        });
    },
    confirm() {
      let ids = this.$route.query.ids;
      var data = qs.stringify({
        orderId: ids,
        transCo: this.modeldata.transCo,
        transNo: this.modeldata.transNo,
      });

      if (
        this.modeldata.orderStatus == 2 ||
        this.modeldata.orderStatus == 3 ||
        this.modeldata.orderStatus == 82
      ) {
        OrderTransAPI(data, "post", 1).then((res) => {
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: "发货成功",
            });
          }
          this.getModel();
        });
      } else {
        RefundOperationOrderAPI(data, "post", 1).then((res) => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: "发货成功",
            });
          } else {
            this.$message({
              type: "success",
              message: res.msg,
            });
          }
          this.getModel();
        });
      }
    },
    BusExpListseach() {
      BusExpListAPI("", "get").then((res) => {
        console.log(res.data, "res.data");
        this.BusExpList = res.data;
      });
    },
    confirmButton() {
      this.canEdit = !this.canEdit;
      let ids = this.$route.query.ids;
      var data = qs.stringify({
        orderId: ids,
        consignee: this.modeldata.consignee,
        consigneeMobile: this.modeldata.consigneeMobile,
        consigneeAddress: this.modeldata.consigneeAddress,
      });
      OrderConsigneeAPI(data, "post", 1).then((res) => {
        this.getModel();
      });
    },
    checkKuaidiInfor(orderNo) {
      console.log(orderNo, this.modeldata.transCo, "orderNo");
      //查看物流
      window.location.href = `https://www.kuaidi100.com/chaxun?com=${this.modeldata.transCo}&nu=${orderNo}`;
    },
  },
  mounted() {
    this.getModel();
    this.BusExpListseach();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-table__row > td {
  border: none;
}
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}
.ts {
  padding-left: 24px;
  color: red;
  font-size: 12px;

  width: 100%;
  span {
    transform: scale(0.8);
  }
}
.wl {
  /deep/.el-input__inner {
    width: 184px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
  /deep/.el-form-item__label {
    font-size: 12px;
  }
  /deep/.el-form-item {
    margin-top: 10px;
    margin-bottom: 0px;
  }
  /deep/.el-form-item__label {
    padding-left: 20px;
  }
}

.clearCondition_active {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #e46d0c;
}
.title {
  // width: 250px;
  height: fit-content;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
.span_confirm_active {
  margin-bottom: 0px;
  margin-left: 20px;
  min-width: 70px;
  line-height: 32px;
  text-align: center;
  height: 32px;
  background: rgba(249, 249, 249, 1);
  border-radius: 4px;
  border: 1px solid rgba(232, 232, 232, 1);
  font-size: 14px;
  color: #e46d0c;
}
.orderDetail {
  background: rgba(255, 255, 255, 1);
  box-shadow: 2px 2px 9px 1px rgba(221, 221, 221, 0.5);
  border-radius: 4px;
  // min-height: 786px;;
  padding: 22px 33px 0 22px;
  .header {
    margin-top: 40px;
  }
  .sell_person {
    font-weight: bold;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
    line-height: 19px;
  }
  .sell_infor {
    color: #b1b6c3;
  }
  .forms {
    /deep/ .el-input__inner {
      height: 24px;
    }
    ul {
      color: #4a5060;
      li {
        display: flex;
        min-height: 24px;
      }
    }
    padding: 20px 0;
    .form2 {
      margin-left: 78px;
      li {
        align-items: center;
        span {
          min-width: 65px;
        }
      }
    }
    .confirmButton {
      width: 56px;
      height: 24px;
      text-align: center;
      background: rgba(13, 105, 197, 1);
      border-radius: 4px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      line-height: 24px;
      margin-left: 60px;
      margin-top: 16px;
    }
  }

  .orderMessage {
    margin-top: 24px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(74, 80, 96, 1);
    line-height: 30px;
    .order_title {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(33, 33, 33, 1);
      line-height: 30px;
    }
  }
}
</style>