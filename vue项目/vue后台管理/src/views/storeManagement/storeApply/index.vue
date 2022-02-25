<template>
  <errorPage v-if="CODE === 101" />
  <div class="storeApply br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="门店名称：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.pickupName"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.userName"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.mobile"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="门店地址：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.pickupAddr"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请时间：" label-width="120px" prop="name">
        <el-date-picker
          @change="confirmDate"
          v-model="timer"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="社会统一信用代码："
        class="ml-40"
        label-width="140px"
        prop="name"
      >
        <el-input
          placeholder="请输入"
          v-model="tablePagination.creditCode"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex aic ml-40">
      <el-button class="span_confirm_active pointer" @click="getListData"
        >确认筛选</el-button
      >
      <el-button @click="clearData">清空筛选条件</el-button>
      <el-button @click="exportExcel">数据导出</el-button>
    </div>
    <el-tabs
      @tab-click="handleClicks"
      style="padding-top: 15px; font-size: 12px"
      v-model="tablePagination.status"
    >
      <el-tab-pane label="待审核" name="0"></el-tab-pane>
      <el-tab-pane label="已审核" name="1"></el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <el-table
      ref="tableData"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection"></el-table-column>
      <!-- <el-table-column prop="shopCategory" label="类目"></el-table-column> -->
      <el-table-column prop="ppName" label="门店名称"></el-table-column>
      <el-table-column prop="linkMan" label="联系人"></el-table-column>
      <el-table-column prop="linkTel" label="电话"></el-table-column>
      <el-table-column prop="ppAddress" label="门店地址"></el-table-column>
      <el-table-column
        prop="creditCode"
        label="社会统一信用代码"
      ></el-table-column>
      <el-table-column prop="creatorDate" label="申请时间"></el-table-column>
      <el-table-column prop="opData" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isProc == 0"
            @click="handleClickBtn(scope.row, 'cheack')"
            type="text"
            size="small"
            >审核</el-button
          >
          <el-button disabled v-else type="text" size="small">已审核</el-button>
          <el-button
            @click="handleClickBtn(scope.row, 'todetail')"
            type="text"
            size="small"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div class="mt-30">
        <div v-show="tablePagination.status == 0">
          <!-- <el-checkbox v-model="pageAllChecked">全选</el-checkbox> -->
          <el-button class="ml-30" @click="toggleBtnChange('selectAll')"
            >全选</el-button
          >
          <!-- <el-button @click="exportDeliver()">导出发货信息</el-button> -->
          <el-button class="ml-30" @click="toggleBtnChange('cheack')"
            >批量审核</el-button
          >
        </div>
      </div>
      <el-pagination
        class="mt-30"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="tablePagination.pindx"
        :page-sizes="[6, 8, 16, 32, 50]"
        :page-size="6"
        :total="tablePagination.total"
      ></el-pagination>
    </section>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { GetPickupApplyPageAPI, PassPickupApplyAPI } from "@/api/shopStoreAPI";
export default {
  data() {
    return {
      pageAllChecked: "",
      CODE: 0, //代码
      tableData: [], //表数据
      timer: "",
      tablePagination: {
        total: 0, //全部
        pickupName: "", //门店名称
        userName: "", //联系人
        mobile: "", //电话
        pickupAddr: "", //门店地址
        creditCode: "", //社会统一码\
        startTime: "", //开始时间
        endTime: "", //结束时间
        status: 0, //审核状态，0是待审核，1是已审核
        pindx: 1,
        psize: 6,
      },
    };
  },
  methods: {
    exportExcel() {
      if (this.tableData.length == 0) {
        this.$message({
          type: "warning",
          message: "暂无数据!",
        });
        return false;
      }
      this.$confirm("确认导出本页数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let tableData = [
          [
            "门店名称",
            "联系人",
            "电话",
            "门店地址",
            "社会统一信用码",
            "申请时间",
            "状态",
          ],
        ]; // 表格表头

        this.tableData.forEach((item) => {
          console.log(item);
          let rowData = [];
          rowData = [
            item.ppName,
            item.linkMan,
            item.linkTel,
            item.ppAddress,
            item.creditCode,
            item.creatorDate,
            item.isProc == 0 ? "审核" : "已审核",
          ];
          tableData.push(rowData);
        });
        let ws = XLSX.utils.aoa_to_sheet(tableData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "数据"); // 工作簿名称
        XLSX.writeFile(wb, "门店入驻申请.xlsx"); // 保存的文件名
      });
    },
    toggleBtnChange(type) {
      //点击按钮
      if (type == "selectAll") {
        this.$refs.tableData.toggleAllSelection();
      }
      if (type == "cheack") {
        let ids = this.$refs.tableData.selection.map((item) => {
          return item.id;
        });
        let data = {
          ids: ids.join(","),
        };
        if (ids.length == 0) {
          this.$message({
            type: "warning",
            message: "请先选择商品!!",
          });
          return;
        }
        this.$confirm("确认全部通过审核？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          PassPickupApplyAPI(data, "PUT").then((res) => {
            console.log(res, "aaa");
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "审核成功",
              });
              this.getListData();
            }
          });
        });
      }
    },
    handleClickBtn(row, type) {
      console.log(row, "row");
      if (type == "todetail") {
        this.$router.push({
          name: "storeApplydDetail",
          query: {
            id: row.id,
          },
        });
      } else {
        this.$confirm("确认通过审核？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let data = {
            ids: row.id,
          };
          PassPickupApplyAPI(data, "PUT").then((res) => {
            console.log(res, "aaa");
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "审核成功",
              });
              this.getListData();
            }
          });
        });
      }
    },
    handleClicks() {
      // console.log()
      this.tablePagination.pindx = 1;
      this.tablePagination.psize = 6;
      this.getListData();
    },
    handleSizeChange(val) {
      this.tablePagination.psize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.tablePagination.pindx = val; // 当前页
      this.getListData();
    },
    cheackAll() {
      console.log("cheackAll");
    },
    clearData() {
      this.timer = "";
      this.tablePagination = {
        total: 0, //全部
        pickupName: "", //门店名称
        userName: "", //联系人
        mobile: "", //电话
        pickupAddr: "", //门店地址
        creditCode: "", //社会统一码\
        startTime: "", //开始时间
        endTime: "", //结束时间
        status: "0", //审核状态，0是待审核，1是已审核
        pindx: 1,
        psize: 6,
      };
      this.getListData();
    },
    confirmDate(e) {
      // console.log(e, "eeee");
      this.tablePagination.startTime = e[0];
      this.tablePagination.endTime = e[1];
      this.getListData();
    },
    getListData() {
      GetPickupApplyPageAPI(this.tablePagination, "get").then((res) => {
        console.log(res, "res");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.tableData = res.data.rows;
        this.tablePagination.total = res.data.total;
      });
    },
  },
  mounted() {
    this.getListData();
  },
};
</script>

<style lang="scss" scoped>
.storeApply {
  padding: 24px;
  background-color: #ffffff;
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