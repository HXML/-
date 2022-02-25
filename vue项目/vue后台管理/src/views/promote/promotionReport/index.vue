<template>
  <errorPage v-if="CODE === 101" />
  <div class="promotionReport" v-else>
    <div class="header">
      <div class="flex jc-sb aic">
        <span>数据汇总</span>
        <!-- <span> <i class="el-icon-date"></i> 过去30天</span> -->
        <el-date-picker
          @change="changeTimer"
          v-model="value2"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <el-divider></el-divider>
      <div class="flex jc-sa">
        <div class="item flex2 aic">
          <span>展现量</span>
          <span class="mt-16">{{ biAll.viewNum }}</span>
        </div>
        <div class="item flex2 aic">
          <span>点击量</span>
          <span class="mt-16">{{ biAll.clickNum }}</span>
        </div>
        <div class="item flex2 aic">
          <span>点击率</span>
          <span class="mt-16">{{ biAll.ctr }}</span>
        </div>
        <div class="item flex2 aic">
          <span>总成交金额</span>
          <span class="mt-16">{{ biAll.tradingVolume }}</span>
        </div>
        <div class="item flex2 aic">
          <span>成交订单量</span>
          <span class="mt-16">
            {{ biAll.tradingVolume }}
          </span>
        </div>
      </div>
    </div>
    <div class="header mt-30">
      <div class="flex jc-sb">
        <span></span>
        <el-button @click="exportData"> 导出 </el-button>
      </div>
      <el-table :data="tableData" stripe>
        <el-table-column prop="time" label="时间"> </el-table-column>
        <el-table-column prop="viewNum" label="展现量"> </el-table-column>
        <el-table-column prop="clickNum" label="点击量"> </el-table-column>
        <el-table-column prop="ctr" label="点击率"> </el-table-column>
        <el-table-column prop="tradingVolume" label="成交金额">
        </el-table-column>
        <el-table-column label="明细">
          <template slot-scope="scope">
            <el-button
              @click="showList(scope.row.time)"
              type="text"
              size="small"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="timer"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="50%"
    >
      <el-table
        :span-method="objectSpanMethod"
        border
        :data="dialogListData"
        stripe
      >
        <el-table-column prop="time" label="时间"> </el-table-column>
        <el-table-column prop="planName" label="商品名称"> </el-table-column>
        <el-table-column prop="viewNum" label="展现量"> </el-table-column>
        <el-table-column prop="clickNum" label="点击量"> </el-table-column>
        <el-table-column prop="ctr" label="点击率"> </el-table-column>
        <el-table-column prop="tradingVolume" label="成交金额">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
  GetAdBiToAdPlanByDayAPI,
  GetAdBiBetweenByTimeAPI,
} from "@/api/advertisementAPI.js";
export default {
  data() {
    return {
      CODE: 0,
      value2: [new Date().getTime() - 3600 * 1000 * 24 * 90, new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tableData: [], //列表数据
      dialogVisible: false, //显示
      biAll: "", //bi数据
      dialogListData: [], //弹窗表格
      timer: "",
    };
  },
  methods: {
    exportData() {
      //
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
        let tableData = [["时间", "展现量", "点击量", "点击率", "成交金额"]]; // 表格表头

        this.tableData.forEach((item) => {
          console.log(item);
          let rowData = [];
          rowData = [
            item.time,
            item.viewNum,
            item.clickNum,
            item.ctr,
            item.tradingVolume,
          ];
          tableData.push(rowData);
        });
        let ws = XLSX.utils.aoa_to_sheet(tableData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "数据"); // 工作簿名称
        XLSX.writeFile(wb, "推广报表.xlsx"); // 保存的文件名
      });
    },
    changeTimer(e) {
      // console.log(e, "sss");
      this.getData();
    },
    getData() {
      //获取数据
      let data = {
        // dayTime: "2020-11-11",
        startDay: new Date(this.value2[0]),
        endDay: this.value2[1],
      };
      GetAdBiBetweenByTimeAPI(data, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        console.log(res, "data");
        this.tableData = res.data.list;
        this.biAll = res.data.all;
      });
    },
    getListData(time) {
      this.timer = time;
      let data = {
        dayTime: time,
      };
      GetAdBiToAdPlanByDayAPI(data).then((res) => {
        // console.log(res, "Ressss");
        this.dialogListData = res.data;
      });
    },
    showList(time) {
      this.dialogVisible = true;
      this.getListData(time);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.flitterData(this.dialogListData).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },

    flitterData(arr) {
      //处理第一行相同的
      let spanOneArr = [],
        concatOne = 0;
      arr.forEach((item, index) => {
        // console.log(index, item, "aaa");
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          // console.log(item.id);
          if (item.time === arr[index - 1].time) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
      };
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-dialog__body {
    width: 100%;
    height: 600px;
    overflow-y: auto;
  }
}
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  // background-color: #f9f9f9;
}
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
.header {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px #e8e8e8;
}
</style>