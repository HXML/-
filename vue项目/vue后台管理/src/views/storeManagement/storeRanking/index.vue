<template>
  <errorPage v-if="CODE === 101" />
  <div class="storeProfile br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="门店名称：" label-width="100px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.pickupName"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人：" label-width="100px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.linkMan"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>

      <el-form-item label="电话：" label-width="100px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="tablePagination.linkTel"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex aic ml-40">
      <el-button @click="handleClicks" class="span_confirm_active pointer"
        >确认筛选</el-button
      >
      <el-button @click="clearData">清空筛选条件</el-button>
      <el-button @click="exportExcel">数据导出</el-button>
    </div>
    <el-tabs
      @tab-click="handleClicks"
      style="padding-top: 15px; font-size: 12px"
      v-model="tablePagination.cateId"
    >
      <el-tab-pane
        v-for="(item, index) in classList"
        :key="index"
        :label="item.labelName"
        :name="item.id + ''"
      ></el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <el-table
      ref="filterTable"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <el-table-column prop="shopCategory" label="门店类目"></el-table-column>
      <el-table-column prop="logoImg" label="门店logo">
        <template slot-scope="scope">
          <el-image
            class="w-90 mr-20"
            :preview-src-list="[scope.row.logoImg + '?x-oss-process=style/b5']"
            :src="scope.row.logoImg + '?x-oss-process=style/s4'"
            alt
          />
        </template>
      </el-table-column>
      <el-table-column prop="ppName" label="门店名称"></el-table-column>
      <el-table-column prop="linkMan" label="联系人"></el-table-column>
      <el-table-column prop="linkTel" label="电话"></el-table-column>
      <el-table-column prop="balance" label="账户余额">
        <template slot-scope="scope" class="flex">
          <el-button
            class="underline"
            @click="Details(scope.row)"
            type="text"
            size="small"
            >{{ scope.row.balance }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia mt-30">
      <div class="mt-30"></div>
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
    <!-- Form -->
  </div>
</template>

<script>
import { ShopCateListAPI } from "@/api/goodsClassifyAPI";
import {
  GetPickupBalancePageAPI,
  PassPickupApplyAPI,
} from "@/api/shopStoreAPI";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      indexMethod: 1,
      value: "",
      pageAllChecked: "",
      CODE: 0, //代码
      classList: [],
      tableData: [], //表数据
      timer: "",
      tablePagination: {
        time: "",
        total: 0, //全部
        pickupName: "", //门店名称
        linkMan: "", //联系人
        linkTel: "", //电话
        cateId: "",
        pindx: 1,
        psize: 6,
      },
    };
  },
  methods: {
    exportExcel() {
      //数据导出
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
            "门店类目",
            "门店名称",
            "联系人",
            "电话",
            "账户余额",
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
            item.balance,
          ];
          tableData.push(rowData);
        });
        let ws = XLSX.utils.aoa_to_sheet(tableData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "数据"); // 工作簿名称
        XLSX.writeFile(wb, "门店余额.xlsx"); // 保存的文件名
      });
    },
    handleClicks(val) {
      // console.log(val.paneName);
      this.tablePagination.cateId = val.paneName;
      this.getListData();
    },
    clearData() {
      this.value = "";
      this.tablePagination = {
        time: "",
        total: 0, //全部
        pickupName: "", //门店名称
        linkMan: "", //联系人
        linkTel: "", //电话
        cateId: "",
        pindx: 1,
        psize: 6,
      };
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
    Details(rows) {
      console.log("aa");
      this.$router.push({
        name: "storeRankingDetail",
        query: {
          id: rows.id,
        },
      });
    },
    getListData() {
      GetPickupBalancePageAPI(this.tablePagination, "get").then((res) => {
        console.log(res, "res");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.tableData = res.data.rows;
        this.tablePagination.total = res.data.total;
      });
    },
    getStoreClass() {
      ShopCateListAPI().then((res) => {
        let arr = res.data.map((item) => {
          return {
            labelName: item.categoryName,
            id: item.id,
          };
        });
        this.classList = [
          {
            labelName: "全类目",
            id: 0,
          },
          ...arr,
        ];
      });
    },
  },
  mounted() {
    this.getListData();
    this.getStoreClass();
  },
};
</script>

<style lang="scss" scoped>
.storeProfile {
  .underline {
    text-decoration: underline;
  }
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