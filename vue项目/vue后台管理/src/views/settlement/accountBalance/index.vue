<template>
  <!-- 收入明细 -->
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="流水号：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.runNo" class="w-164"></el-input>
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
        :class="pageData.runNo!==''
        ||pageData.timeQ!==''
        ||pageData.TimeH!==''?'clearCondition_active pointer':'clearCondition pointer'"
        @click="clearAllInput"
      >清空筛选条件</span>
    </div>
    <!-- 列表 -->
    <el-table ref="filterTable" :data="tableData" style="width: 100%;margin-top:20px;">
      <el-table-column prop="runNo" label="流水号">
        <template slot-scope="scope">
          <div class="flex aic">{{ scope.row.runNo}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="incomeAmount" label="入账金额">
        <template slot-scope="scope">
          <div class="flex aic">
            <span>¥</span>
            {{ scope.row.incomeAmount}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="incomeTypeStr" label="收入类型">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.number}}</span>
          <i class="ml-8 el-icon-edit"></i>-->
          <div class="flex aic">{{ scope.row.incomeTypeStr}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单编号">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.number}}</span>
          <i class="ml-8 el-icon-edit"></i>-->
          <div class="flex aic">{{ scope.row.orderNo}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="creatorDate" label="创建时间"></el-table-column>
    </el-table>
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

<script>
import { AccountRunListAPI } from "@/api/settlementAPI";

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
        runNo: "",
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
      AccountRunListAPI(this.pageData, "get")
        .then((res) => {
          console.log(res);
          if (res.code == 101) {
            this.CODE = 101;
          }
          this.tableData = res.data.rows;
          this.tablePagination.total = res.data.total;
        })
        .then((res) => {
          this.pageAllChecked = false;
        });
    },
    clearAllInput() {
      //清空所有条件
      this.pageData = {
        pageIndex: 1,
        pageSize: 4,
        timeQ: "", //商品编码：
        TimeH: "",
        runNo: "",
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
    padding: 24px 0;
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