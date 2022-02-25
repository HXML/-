<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="订单状态：" label-width="120px" prop="name">
        <el-select v-model="pageData.statusId" placeholder="全部" class="w-164">
          <el-option label="全部" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="提现完成" value="3"></el-option>
          <el-option label="审核不通过" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：" label-width="120px" prop="name">
        <el-date-picker
          class="w-164"
          value-format="yyyy-MM-dd"
          v-model="pageData.timeQ"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
        <span class="mr-8 ml-8">至</span>
        <el-date-picker
          class="w-164"
          value-format="yyyy-MM-dd"
          v-model="pageData.TimeH"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">确认筛选</div>
      <span
        :class="pageData.statusId!==''
        ||pageData.timeQ!==''
        ||pageData.TimeH!==''?'clearCondition_active pointer':'clearCondition pointer'"
        @click="clearAllInput"
      >清空筛选条件</span>
    </div>

    <!-- 列表 -->
    <div class="comment_content">
      <div class="comment_content_box">
        <div class="top">
          <div class="d1">提现金额</div>
          <div class="d2">手续费</div>
          <div class="d2">提现银行</div>
          <div class="d3">提现账户</div>
          <div class="d2">户名</div>
          <div class="d2">平台回执</div>
          <div class="d2">状态</div>
        </div>
        <div class="bottom">
          <div
            class="Item"
            v-for="(item,index) in tableData"
            :key="index"
            style="margin-bottom: 1vw;"
          >
            <div class="Item_nav flex aic">
              <div class="ml-40">流水号：{{item.cashOutNo}}</div>
              <div class="ml-40">申请时间：{{item.creatorDate}}</div>
              <div class="ml-40">结算时间：{{item.completeTime}}</div>
            </div>
            <div class="flex jc-sb" style="border-bottom:1px solid #E8E8E8; ">
              <div class="flex2" style="width: 100%;border-left:1px solid #E8E8E8;">
                <div
                  :class="index>1?'flex jc-sb aic pb-20':'Cont2 flex jc-sb aic pb-20'"
                  style="border-right:1px solid #E8E8E8;padding:10px;"
                >
                  <span class="d1">{{item.amount}}</span>
                  <span class="d2">{{item.serviceCharge}}</span>
                  <span class="d2">{{item.bankName}}</span>
                  <span class="d3">{{item.bankAccount}}</span>
                  <span class="d2">{{item.bankAccountName}}</span>
                  <span class="d2">{{item.auditRmk}}</span>
                  <span class="d2">{{item.statusStr}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="flex jc-sb aic mt-22 xiajia">
      <!-- 分页 -->
      <el-pagination
        :pager-count="5"
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.query.curPage"
        :page-size="tablePagination.query.pagesize"
        :total="tablePagination.total"
      ></el-pagination>
    </section>
    <!-- Form -->
  </div>
</template>




<style lang="scss" scoped>
.goods {
  margin: 16px 260px;
}
.el-breadcrumb {
  margin-bottom: 6px;
  height: 26px;
  line-height: 26px;
  padding-left: 24px;
  background-color: #ffffff;
}

.activBread {
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #0d69c5 !important;
  }
}
</style>
<script>
import { AccountListAPI } from "@/api/settlementAPI";

import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
      CODE: 0,
      priceEdit: false, //是否编辑price
      pageAllChecked: false, //全选开关
      numEdit: false, //是否编辑num
      /* 分页组件*/
      tablePagination: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 4, // 每页显示条目个数，支持 .sync 修饰符
        },
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
        statusId: "",
      },
      ruleForm: {
        name: "",
        region: "",
      },
      tableData: [], //外层表格
    };
  },
  methods: {
    confirmSelect() {
      //获取到节点上面的val
      this.pageData.pageIndex = 1;
      this.getList();
    },

    /* 当前页改变时*/
    handleCurrentChange(val) {
      this.tablePagination.query.curPage = val; // 当前页
      this.pageData.pageIndex = val;
      this.getList();
    },
    getList() {
      this.pageData.timeQ = switchDayTime(this.pageData.timeQ);
      this.pageData.TimeH = switchDayTime(this.pageData.TimeH);
      //获取数据
      AccountListAPI(this.pageData, "get")
        .then((res) => {
          if (res.code == 101) {
            this.CODE = 101;
          }
          this.tableData = res.data.rows;
          this.tablePagination.total = res.data.total;
        })
        .then((res) => {});
    },
    clearAllInput() {
      //清空所有条件
      this.pageData = {
        pageIndex: 1,
        pageSize: 4,
        timeQ: "", //商品编码：
        TimeH: "",
        statusId: "",
      };
      this.sType = [];
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input__icon {
  line-height: 32px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}
.goodType {
  color: #b1b6c3;
  font-size: 10px;
}
.goodTitle {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
}
.mainTableInfor {
  .over_two {
    width: 250px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
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
.ml-40 {
  margin-left: 40px;
}
.onSale {
  padding: 24px 24px 0 24px;
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
  }
  .item_pirce {
    font-size: 12px;
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
  .span_confirm_active2 {
    margin-left: 20px;
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
  .Heng {
    height: 20px;
    width: 100%;
    background: #e6f0f9;
  }
  .d1 {
    display: flex;
    width: 200px;
    text-align: center;
  }
  .d2 {
    display: flex;
    width: 200px;
    text-align: center;
  }
  .d3 {
    display: flex;
    width: 400px;
    text-align: center;
  }
  .comment_content {
    margin-top: 20px;
    .comment_content_box {
      width: 998px;
      .top {
        width: 100%;
        display: flex;
        font-size: 12px;
        color: rgba(33, 33, 33, 1);
        line-height: 16px;
        padding-bottom: 12px;
      }
      .bottom {
        width: 100%;
        .Item {
          width: 100%;
          .Item_nav {
            height: 32px;
            width: 100%;
            font-size: 10px;
            color: rgba(74, 80, 96, 1);
            border: 1px solid rgba(238, 238, 238, 1);
            background: rgba(230, 240, 249, 1);
            span {
              padding-left: 20px;
            }
            img {
              margin-right: 8px;
              width: 20px;
              height: 20px;
            }
          }
          .mainInfor {
            width: 70%;
            .d1 {
              width: 80%;
              text-align: center;
            }
            .d2 {
              width: 20%;
            }
            .d3 {
              width: 20%;
            }
            .d4 {
              width: 20%;
            }
          }
        }
      }
    }
  }
}
</style>