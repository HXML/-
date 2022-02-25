<template>
  <errorPage v-if="CODE === 101" />
  <div class="storeApply br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="时间：" label-width="120px" prop="name">
        <el-select
          class="w-164"
          v-model="tablePagination.time"
          placeholder="请选择"
        >
          <el-option label="今日" :value="1"> </el-option>
          <el-option label="本周" :value="2"> </el-option>
          <el-option label="本月" :value="3"> </el-option>
          <el-option label="上月" :value="4"> </el-option>
          <el-option label="近三月" :value="5"> </el-option>
          <el-option label="近六月" :value="6"> </el-option>
          <el-option label="近一年" :value="7"> </el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="提现方式：" label-width="120px" prop="name">
        <el-select
          class="w-164"
          v-model="tablePagination.cashType"
          placeholder="请选择"
        >
          <el-option label="全部" :value="0"> </el-option>
          <el-option label="支付宝" :value="1"> </el-option>
          <el-option label="微信" :value="2"> </el-option>
          <el-option label="银行卡" :value="3"> </el-option>
        </el-select>
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
      <el-tab-pane label="已拒绝" name="2"></el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <el-table
      ref="tableData"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection" label="全选"></el-table-column>
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
      <el-table-column prop="pickupName" label="门店名称"></el-table-column>
      <el-table-column prop="linkMan" label="联系人"></el-table-column>
      <el-table-column prop="linkTel" label="电话"></el-table-column>
      <el-table-column prop="cashTypeStr" label="提现方式"></el-table-column>
      <el-table-column prop="openingBank" label="开户行"></el-table-column>
      <el-table-column prop="cashAccount" label="提现账户"></el-table-column>
      <el-table-column prop="amount" label="提现金额"></el-table-column>
      <el-table-column prop="accountName" label="户名"></el-table-column>
      <el-table-column prop="balance" label="账户余额"></el-table-column>
      <el-table-column prop="creatorDate" label="申请时间"></el-table-column>
      <!-- 0是未审核，1是已审核，2是已拒绝 -->
      <!-- {{ tablePagination.status }} -->
      <el-table-column
        :key="Math.random()"
        prop="opData"
        label="操作"
        v-if="tablePagination.status == 0"
      >
        <template slot-scope="scope">
          <el-button @click="handleClickBtn(scope.row)" type="text" size="small"
            >审核</el-button
          >
          <el-button @click="open(scope.row)" type="text" size="small"
            >拒绝</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        :key="Math.random()"
        v-if="tablePagination.status == 1"
        prop="auditTime"
        label="审核时间"
      >
      </el-table-column>
      <el-table-column
        :key="Math.random()"
        v-if="tablePagination.status == 2"
        prop="auditRmk"
        label="理由"
      >
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.auditRmk"
            placement="right"
          >
            <div>
              {{ scope.row.auditRmk | ellipsis }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div class="mt-30">
        <div v-if="tablePagination.status == 0">
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
      <!-- 分页 -->
      <!-- <el-pagination
        class="mt-30"
        :pager-count="5"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.pindx"
        :page-size="tablePagination.psize"
        :total="tablePagination.total"
      ></el-pagination> -->
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
import {
  GetShopPickupCashPageAPI,
  AuditPickupAccountCashAPI,
} from "@/api/shopStoreAPI";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 5) {
        return value.slice(0, 5) + "...";
      }
      return value;
    },
  },
  data() {
    return {
      pageAllChecked: "",
      CODE: 0, //代码
      tableData: [], //表数据
      timer: "",
      tablePagination: {
        time: "", // 日期：1是本日，2是本周，3是本月，4是上月，5是近三个月，6是近6个月，7是近一年
        cashType: "", //提现类型：1是支付宝，2是微信，3是银行卡
        total: 0, //全部
        pickupName: "", //门店名称
        linkMan: "", //联系人
        linkTel: "", //电话
        pickupAddr: "", //门店地址
        status: 0, //状态：0是未审核，1是已审核，2是已拒绝
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
            "门店名称",
            "联系人",
            "电话",
            "提现方式",
            "开户行",
            "提现账户",
            "提现金额",
            "户名",
            "账户余额",
          ],
        ]; // 表格表头

        this.tableData.forEach((item) => {
          console.log(item);
          let rowData = [];
          rowData = [
            item.pickupName,
            item.linkMan,
            item.linkTel,
            item.cashTypeStr,
            item.openingBank,
            item.cashAccount,
            item.amount,
            item.accountName,
            item.balance,
          ];
          tableData.push(rowData);
        });
        let ws = XLSX.utils.aoa_to_sheet(tableData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "数据"); // 工作簿名称
        XLSX.writeFile(wb, "门店提现.xlsx"); // 保存的文件名
      });
    },
    open(row) {
      this.$prompt("请输入拒绝理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showInput: true,
      })
        .then(({ value }) => {
          // console.log(value, "aaa");
          let data = {
            ids: row.id,
            status: 2, // 	状态：1是通过，2是拒绝
            rmk: value,
          };
          AuditPickupAccountCashAPI(data, "PUT").then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "成功拒绝",
              });
              this.getListData();
            }
          });
        })
        .catch(() => {
          // console.log("取消");
          // return;
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    handleClickBtn(row) {
      let data = {
        ids: row.id,
        status: 1, // 	状态：1是通过，2是拒绝
        rmk: "",
      };
      AuditPickupAccountCashAPI(data, "PUT").then((res) => {
        // console.log(res, "aaa");
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: "审核成功",
          });
          this.getListData();
        }
      });
    },
    toggleBtnChange(type) {
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
        AuditPickupAccountCashAPI(data, "PUT").then((res) => {
          // console.log(res, "aaa");
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: "审核成功",
            });
            this.getListData();
          }
        });
      }
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

    handleSizeChange(val) {
      this.tablePagination.psize = val;
      this.getListData();
    },
    cheackAll() {
      console.log("cheackAll");
    },
    clearData() {
      this.timer = "";
      this.tablePagination = {
        time: "", // 日期：1是本日，2是本周，3是本月，4是上月，5是近三个月，6是近6个月，7是近一年
        cashType: "", //提现类型：1是支付宝，2是微信，3是银行卡
        total: 0, //全部
        pickupName: "", //门店名称
        linkMan: "", //联系人
        linkTel: "", //电话
        pickupAddr: "", //门店地址
        status: 0, //状态：0是未审核，1是已审核，2是已拒绝
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
    // 获取表数据
    getListData() {
      GetShopPickupCashPageAPI(this.tablePagination, "get").then((res) => {
        console.log(res, "res");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.tableData = res.data.rows.map((item, index) => {
          console.log(item, "lll");
          return Object.assign(item, {
            openingBank: item.getCashType == 3 ? item.openingBank : "无",
          });
        });

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