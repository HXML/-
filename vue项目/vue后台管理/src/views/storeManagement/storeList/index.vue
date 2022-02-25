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
      <router-link class="ml-10" to="storeDetail">
        <el-button>添加门店</el-button></router-link
      >
    </div>
    <el-tabs
      @tab-click="handleClicks"
      class="pt-16"
      v-model="tablePagination.status"
    >
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="已冻结" name="1"></el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <el-table
      ref="tableData"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="shopCategory" label="类目"> </el-table-column>
      <el-table-column prop="shopCategory" label="门店logo">
        <template slot-scope="scope">
          <el-image
            class="w-60 mr-20"
            :preview-src-list="[scope.row.logoImg + '?x-oss-process=style/b5']"
            :src="scope.row.logoImg + '?x-oss-process=style/s4'"
            alt
          />
        </template>
      </el-table-column>
      <el-table-column prop="ppName" label="门店名称"></el-table-column>
      <el-table-column prop="linkMan" label="联系人"></el-table-column>
      <el-table-column prop="linkTel" label="电话"></el-table-column>
      <el-table-column prop="ppAddress" label="门店地址"></el-table-column>
      <el-table-column prop="creditCode" label="社会统一信用代码">
        <template slot-scope="scope">
          {{ hideNumber(scope.row.creditCode) }}
        </template>
      </el-table-column>
      <el-table-column prop="joinDate" label="入驻时间"></el-table-column>
      <el-table-column prop="procTime" label="状态">
        <template slot-scope="scope" class="flex">
          <!-- {{ scope.row.status == 1 ? "正常" : "冻结" }} -->
          <span v-if="scope.row.status == 1">正常</span>
          <span v-else style="color: red">冻结</span>
        </template>
      </el-table-column>
      <el-table-column prop="opData" label="操作" fixed="right" width="130">
        <template slot-scope="scope" class="flex">
          <el-button
            @click="handleClickBtn(scope.row, 'delete')"
            type="text"
            size="small"
            >删除</el-button
          >
          <el-button
            @click="handleClickBtn(scope.row, 'edit')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="handleClickBtn(scope.row, 'freeze')"
            type="text"
            size="small"
          >
            {{ scope.row.status == 1 ? "冻结" : "恢复" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div class="mt-30">
        <!-- <el-button @click="exportDeliver()">导出发货信息</el-button> -->
        <el-button class="ml-30" @click="toggleBtnChange('selectAll')"
          >全选</el-button
        >
        <el-button class="ml-30" @click="toggleBtnChange('freeze')"
          >冻结</el-button
        >
        <el-button class="ml-30" @click="toggleBtnChange('recovery')"
          >恢复</el-button
        >
      </div>
      <!-- 分页 -->
      <!-- <el-pagination
        background
        :pager-count="5"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.pindx"
        :page-sizes="[4, 8, 16, 32]"
        :total="tablePagination.total"
      ></el-pagination> -->
      <el-pagination
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
    <!-- Form -->
  </div>
</template>

<script>
import {
  GetPickupPointPageAPI,
  PassPickupApplyAPI,
  FreezePickupPointAPI,
  DelPickupPointAPI,
} from "@/api/shopStoreAPI";
import FileSaver from "file-saver";
import XLSX from "xlsx";
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
        creditCode: "", //社会统一码
        startTime: "", //开始时间
        endTime: "", //结束时间
        status: 0, //门店状态，0是全部，1是冻结
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
            "类别",
            "门店名称",
            "联系人",
            "电话",
            "门店地址",
            "社会统一信用码",
            "入驻时间",
            "状态",
          ],
        ]; // 表格表头

        this.tableData.forEach((item) => {
          console.log(item);
          let rowData = [];
          rowData = [
            item.shopCategory,
            item.ppName,
            item.linkMan,
            item.linkTel,
            item.ppAddress,
            item.creditCode,
            item.creatorDate,
            item.status == 2 ? "冻结" : "正常",
          ];
          tableData.push(rowData);
        });
        let ws = XLSX.utils.aoa_to_sheet(tableData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "数据"); // 工作簿名称
        XLSX.writeFile(wb, "门店列表.xlsx"); // 保存的文件名
      });
    },
    hideNumber(str) {
      return str.replace(/(\w{4})\w{10}(\w{4})/, "$1********$2");
    },
    handleClickBtn(row, type) {
      console.log(row, "row");
      if (type == "edit") {
        this.$router.push({
          name: "storeDetail",
          query: {
            id: row.id,
            type: "edit",
          },
        });
      } else if (type == "delete") {
        // this.$router.push({
        //   name: "storeDetail",
        //   query: {
        //     id: row.id,
        //   },
        // });
        this.$confirm("此操作将删除所选中的门店, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            DelPickupPointAPI(
              {
                id: row.id,
              },
              "delete"
            ).then((res) => {
              console.log(res);
              if (res.code == 1) {
                this.$message({ type: "success", message: "删除成功!" });
                this.getListData();
              } else {
                this.$message({ type: "error", message: res.msg });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else if (type == "freeze") {
        //1是恢复，2是冻结
        let data = {
          ids: row.id,
          type: row.status == 1 ? 2 : 1, //1是恢复，2是冻结
        };
        FreezePickupPointAPI(data, "PUT").then((res) => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: row.status == 1 ? "冻结成功" : "恢复成功",
            });
            this.getListData();
          }
        });
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.tablePagination.psize = val;
      this.getListData();
    },
    handleClicks() {
      // console.log()
      this.tablePagination.pindx = 1;
      this.tablePagination.psize = 6;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.tablePagination.pindx = val; // 当前页
      this.getListData();
    },
    toggleBtnChange(type) {
      if (type == "selectAll") {
        this.$refs.tableData.toggleAllSelection();
      }
      if (type == "freeze" || type == "recovery") {
        // console.log(this.$refs.tableData.selection, "this.$refs.tableData");
        if (this.$refs.tableData.selection.length == 0) {
          this.$message({
            type: "warning",
            message: "请先选择",
          });
          return;
        }
        let ids = this.$refs.tableData.selection.map((item) => {
          return item.id;
        });
        let data = {
          ids: ids.join(","),
          type: type == "freeze" ? 2 : 1, //1是恢复，2是冻结
        };
        FreezePickupPointAPI(data, "PUT").then((res) => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: type == "freeze" ? "冻结成功" : "恢复成功",
            });
            this.getListData();
          }
        });
      }
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
        status: "0", //门店状态，0是全部，1是冻结
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
      GetPickupPointPageAPI(this.tablePagination, "get").then((res) => {
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