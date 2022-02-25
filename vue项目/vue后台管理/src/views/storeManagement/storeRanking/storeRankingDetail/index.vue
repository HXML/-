<template>
  <div class="detail">
    <div class="mb-20">
      财务明细：<span class="fontAColor">
        数据仅展示近一年的明细，更长时间请到历史记录查询</span
      >
    </div>
    <el-form inline>
      <el-form-item label="时间：" prop="timer">
        <el-date-picker
          class="w-400"
          @change="confirmDate"
          v-model="timer"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="订单编号：" prop="timer">
        <el-input v-model="formData.orderNo" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item label="" class="ml-30" prop="timer">
        <el-button @click="handleClickBtn('search')">搜索</el-button>
        <el-button @click="handleClickBtn('clear')">清空条件</el-button>
        <el-button>导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="bizNo" label="订单号" width="180">
      </el-table-column>
      <el-table-column prop="incomeAmount" label="佣金金额" width="180">
      </el-table-column>
      <el-table-column prop="typeStr" label="类型"> </el-table-column>
      <el-table-column prop="summary" label="备注"> </el-table-column>
      <el-table-column prop="creatorDate" label="到账时间"> </el-table-column>
    </el-table>

    <section class="flex jc-sb aic mt-22 xiajia">
      <div class="mt-30"></div>
      <!-- 分页 -->
      <el-pagination
        class="mt-30"
        :pager-count="8"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formData.pindx"
        :page-sizes="[8, 16, 32]"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="formData.total"
      ></el-pagination>
    </section>
  </div>
</template>

<script>
import { GetPickupAccountDetailListAPI } from "@/api/shopStoreAPI";
export default {
  data() {
    return {
      timer: [],
      formData: {
        total: 0,
        id: "",
        orderNo: "",
        startTime: "",
        endTime: "",
        pindx: 1,
        psize: 8,
      },
      tableData: [],
    };
  },
  methods: {
    handleClickBtn(type) {
      if (type == "search") {
        this.getList();
      }
      if (type == "clear") {
        this.timer = "";
        this.formData = {
          total: 0,
          id: "",
          orderNo: "",
          startTime: "",
          endTime: "",
          pindx: 1,
          psize: 8,
        };
        this.getList();
      }
    },
    confirmDate(e) {
      if (e) {
        this.formData.startTime = e[0];
        this.formData.endTime = e[1];
      }
    },
    handleCurrentChange(val) {
      this.formData.pindx = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.formData.pageSize = val;
      this.getList();
    },
    getList() {
      GetPickupAccountDetailListAPI(this.formData, "get").then((res) => {
        this.formData.total = res.data.total;
        this.tableData = res.data.rows;
      });
    },
  },
  mounted() {
    this.formData.id = this.$route.query.id;
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.detail {
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffff;
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
}
</style>