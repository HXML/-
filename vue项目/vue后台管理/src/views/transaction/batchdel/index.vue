<template>
  <div class="batchdel" style="padding-bottom: 30px;">
    <!-- 列表页 -->
    <div class="list" v-for="(i,index) in modeldata" :key="index">
      <el-table
        :show-header="false"
        :data="i.showAllList?i.itemList:splitList(i.itemList)"
        style="width: 100%"
      >
        <el-table-column min-width="180px" prop="goodsName">
          <template slot-scope="scope">
            <div class="flex aic">
              <div class="flex jc-fs ml-8">
                <img
                  style="height:70px;width:70px;"
                  :src="scope.row.imageUrl+'?x-oss-process=style/s4'"
                  alt="#"
                />
                <div class="ml-8 title">{{scope.row.goodsName}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="scope">
          <template slot-scope="scope">
            <span
              v-for="(itemB,indexThree) in scope.row.orderOtherData"
              :key="indexThree"
            >{{itemB.Value}};</span>
          </template>
        </el-table-column>
        <el-table-column prop="price">
          <template slot-scope="scope">
            <div class="ml-8 title">￥{{scope.row.price}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="qty">
          <template slot-scope="scope">
            <div class="ml-8 title">*{{scope.row.qty}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="showAllListClass"
        v-if="i.itemList.length>2"
        @click="i.showAllList=!i.showAllList"
      >
        <span>展开全部</span>
        <i :class="i.showAllList?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
      </div>
      <div>
        <el-form class="flex2 fw wl">
          <el-form-item label="订单编号：" label-width="95px" prop="name">
            <span>{{i.orderNo}}</span>
          </el-form-item>

          <el-form-item label="发货信息:" label-width="90px" prop="name">
            <span>{{i.consignee}}; {{i.consigneeMobile}}; {{i.consigneeAddress}}</span>
          </el-form-item>
        </el-form>
      </div>
      <el-form class="flex fw wl">
        <!-- <span v-if="canEdit">{{modeldata.transCo}}</span> -->
        <el-form-item label="物流公司" label-width="90px" prop="name">
          <el-select placeholder="请选择" v-model="i.transCo">
            <el-option
              v-for="(item,index) in BusExpList"
              :key="index"
              v-bind:label="item.coName"
              :value="item.coName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" label-width="80px" prop="name">
          <el-input placeholder="请输入" v-model="i.transNo"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn">
      <el-button type="primary" @click="btnclick">确认发货</el-button>
    </div>
  </div>
</template>

<script>
import {
  BusExpListAPI,
  OrderBatchLiverListAPI,
  BatchLiverTransAPI
} from "@/api/orderManage";
import qs from "qs";
export default {
  data() {
    return {
      modeldata: [],
      BusExpList: [],
      filled: 0,
      notfilled: 0
    };
  },
  methods: {
    splitList(list) {
      let arr = [];
      list.forEach((e, index) => {
        if (index == 0) {
          arr.push(e);
        }
        if (index == 1) {
          arr.push(e);
        }
      });
      return arr;
    },
    getModel() {
      let ids = this.$route.query.ids;
      let data = {
        orderIds: ids
      };
      OrderBatchLiverListAPI(data, "get").then(res => {
        res.data.forEach(element1 => {
          element1.itemList.forEach(element => {
            var arr = new Array();
            var orderOtherData = element.orderOtherData
              ? JSON.parse(element.orderOtherData)
              : "";
            orderOtherData.forEach(sel => {
              if (sel.Key == "SkuColorName" || sel.Key == "SkuOptName") {
                arr.push(sel);
              }
            });
            element.orderOtherData = arr;
          });
        });
        this.modeldata = res.data.map(item => {
          return Object.assign({}, item, { showAllList: false });
        });
      });
    },
    BusExpListseach() {
      BusExpListAPI("", "get").then(res => {
        this.BusExpList = res.data;
      });
    },
    btnclick() {
      this.filled = 0;
      this.notfilled = 0;

      for (let index = 0; index < this.modeldata.length; index++) {
        let element = this.modeldata[index].transNo;
        if (element != null && element != "") {
          this.filled++; //已填写
        } else {
          this.notfilled++; //未填写
        }
      }
      this.$confirm(
        "已填写快递信息" +
          this.filled +
          "条,未填写" +
          this.notfilled +
          "条, 是否继续发货?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var data = this.modeldata;
          data.forEach(element1 => {
            element1.itemList.forEach(element => {
              var arr = new Array();
              var orderOtherData = JSON.stringify(element.orderOtherData);

              element.orderOtherData = orderOtherData;
            });
          });
          var datas = JSON.stringify(data);
          BatchLiverTransAPI(datas, "post", 3).then(res => {
            if (res.code != 1) {
              this.$message.error(res.msg);
              return;
            }

            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "发货成功!"
              });
              this.$router.go(-1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发货"
          });
        });
    }
  },
  mounted() {
    this.BusExpListseach();
    this.getModel();
  }
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
.showAllListClass {
  cursor: pointer;
  margin-left: 20px;
  margin-top: 10px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  color: rgba(13, 105, 197, 1);
}
.wl {
  /deep/.el-input__inner {
    width: 184px;
    height: 32px;
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
.divblock {
  display: flex;
  align-items: flex-end;
}
.list {
  background-color: #fff;
  margin-bottom: 20px;
  padding-bottom: 20px;
}
.btn {
  background-color: #fff;
  height: 60px;
  line-height: 60px;
  padding: 20px, 0px;
  text-align: center;
}
.clearCondition_active {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #e46d0c;
}

.span_confirm_active {
  margin-top: 10px;
  margin-bottom: 0px;
  margin-left: 20px;
  width: 70px;
  line-height: 32px;
  text-align: center;
  height: 32px;
  background: rgba(249, 249, 249, 1);
  border-radius: 4px;
  border: 1px solid rgba(232, 232, 232, 1);
  font-size: 14px;
  font-family: MicrosoftYaHei;
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