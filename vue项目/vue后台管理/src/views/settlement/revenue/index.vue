<template>
  <!-- 收入明细 -->
    <errorPage v-if="CODE===101" />
  <div class="revenue br-8" v-else>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin-right:20px;font-size:15px;">营收概况</span>
        <span>更新时间：</span>
        <span>{{ItemDate.updateTime}}</span>
      </div>
      <div class="text item">
        <div>
          <span>店铺总成交额：</span>
          <span class="item_pirce">￥{{ItemDate.historicalIncome}}</span>
        </div>

        <!-- <div>
          <span>待结算金额：</span>
          <span class="item_pirce">￥{{ItemDate.balance}}</span>
        </div> -->

        <div>
          <span>店铺可提现金额：</span>
          <span class="item_pirce">￥{{ItemDate.balance}}</span>
          <el-button style="padding: 3px 10px" @click="ShowBox()" type="text">结算提现</el-button>
        </div>

        <div>
          <span>总成交订单数：</span>
          <span class="item_pirce">{{ItemDate.totalOrder}}</span>
        </div>

        <div>
          <span>总售出商品数：</span>
          <span class="item_pirce">{{ItemDate.totalSellGoods}}</span>
        </div>
      </div>
    </el-card>

    <Modal :show="show" :title="title" @hideModal="hideModal" @submit="submit">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="margin-right:20px;font-size:15px;">结算提现</span>
        </div>
        <div class="text">
          <el-form class="flex fw">
            <table class="tables">
              <tr>
                <td>
                  <span>店铺可提现金额：</span>
                </td>
                <td>
                  <span class="item_pirce">￥{{ItemDate.balance}}</span>
                </td>
              </tr>

              <tr>
                <td>
                  <span>申请提现金额：</span>
                </td>
                <td>
                  <el-input
                    placeholder="请输入"
                    v-model="money"
                    type="number"
                    min="100"
                    :max="ItemDate.balance"
                    style="width:288px; margin-right:20px"
                    maxlength="10"
                  ></el-input>
                  <el-button
                    style="padding: 3px 10px"
                    type="text"
                    @click="money=ItemDate.balance"
                  >全部</el-button>
                </td>
              </tr>

              <tr>
                <td>
                  <span>提现户名：</span>
                </td>
                <td>
                  <span class="table_span">{{ShopAcc.bankAccountName}}</span>
                </td>
              </tr>

              <tr>
                <td>
                  <span>账号：</span>
                </td>
                <td>
                  <span class="table_span">{{ShopAcc.bankAccount}}</span>
                </td>
              </tr>

              <tr>
                <td>
                  <span>开户行：</span>
                </td>
                <td>
                  <span class="table_span">{{ShopAcc.bankName}}</span>
                </td>
              </tr>
            </table>

            <div style="margin-top: 100px;width: 100%;">
              <span>平台收到申请后，结算无误将在7个工作日内将款项打入对公银行账户</span>
            </div>
            <div></div>

            <div></div>
          </el-form>
        </div>
      </el-card>
    </Modal>
  </div>
</template>

<script>
import { GetAAPI, GetACCAPI, ApplyMoneyAPI } from "@/api/settlementAPI";
import Modal from "../modal.vue";
import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
      CODE:0,
      title: "弹窗标题", //弹窗标题
      show: false, //弹窗显示
      priceEdit: false, //是否编辑price
      pageAllChecked: false, //全选开关
      numEdit: false, //是否编辑num
      /* 分页组件*/
      tablePagination: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 4 // 每页显示条目个数，支持 .sync 修饰符
        }
      },
      // form表单
      dialogFormVisible: false,
      formTtitle: "编辑价格",
      // form表单
      sType: [], //假的
      pageData: {
        pageIndex: 1,
        pageSize: 4,
        timeQ: "", //商品编码：
        TimeH: "",
        runNo: ""
      },
      ruleForm: {
        name: "",
        region: ""
      },
      tableData: [], //外层表格
      ItemDate: {}, //数据
      ShopAcc: {},
      money: 100
    };
  },
  components: {
    Modal
  },
  methods: {
    confirmSelect() {
      //获取到节点上面的val
      this.pageData.pageIndex = 1;
      this.getDate();
    },

    ShowBox() {
      this.getShopAcc();
      this.show = true;
    },

    hideModal() {
      // 取消弹窗回调
      this.show = false;
    },

    submit() {
      // 确认弹窗回调
      var price = this.money;
      // 提现金额限制
      
      var leastm =  this.ShopAcc.leastMoney;

      if (price < leastm) {
        this.$message.error("提现金额必须不小于"+leastm);
        return;
      }
      if (price > this.ItemDate.balance) {
        this.$message.error("余额不足");
        return;
      }
      var data = {
        Money: price
      };

      ApplyMoneyAPI(data, "post").then(res => {
        if (res.code == 1) {
          this.$message({
            message: "提交提现申请成功",
            type: "success"
          });
           if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
          this.getDate();
        } else {
          this.$message.error("提交提现申请失败");
        }
      });

      this.show = false;
    },

    getDate() {
      //获取数据
      GetAAPI("get")
        .then(res => {
          console.log(res);
           if (res.code == 101) {
            this.CODE = 101;
          }
          this.ItemDate = res.data;
        })
        .then(res => {});
    },

    getShopAcc() {
      GetACCAPI("get").then(res => {
        console.log(res);
         if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.ShopAcc = res.data;
      });
    },

    clearAllInput() {
      //清空所有条件
      this.pageData = {
        pageIndex: 1,
        pageSize: 4,
        timeQ: "", //商品编码：
        TimeH: "",
        runNo: ""
      };
      this.sType = [];
      this.getDate();
    }
  },
  mounted() {
    this.getDate();
  }
};
</script>

<style lang="scss" scoped>
.tables tr {
  height: 30px;
}
.tables tr td {
  font-size: 15px;
  font-weight: 500;
}
.table_span {
  color: #9a9a9a;
}

/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.box-card {
  box-shadow: none;
  border: none;
}
.revenue {
  // height: 500px;
  // min-height: 786px;
  background-color: #ffffff;
  .onSaleing {
    color: #219541;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .title {
    width: 240px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
  .xiajia {
    /deep/.el-checkbox {
      margin-right: 22px;
    }
  }
  .item {
    margin-right: 40px;
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
    line-height: 30px;
  }
  .item_pirce {
    font-family: MicrosoftYaHei;
    color: rgba(224, 32, 32, 1);
  }
  .item_name {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }

  .span_confirm {
    pointer-events: none;
    margin-left: 120px;
    width: 88px;
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(232, 232, 232, 1);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
  }
  .span_confirm_active {
    margin-left: 120px;
    width: 88px;
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
  .clearCondition {
    pointer-events: none;
    margin-left: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
  }
  .clearCondition_active {
    margin-left: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #e46d0c;
  }

  .operation {
    span {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(13, 105, 197, 1);
    }
    span:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>