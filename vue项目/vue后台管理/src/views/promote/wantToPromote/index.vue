<template>
  <errorPage v-if="CODE === 101" />
  <div class="wantToPromote container" v-else>
    <section>
      <div class="itemContainer">
        <div class="header flex aic">
          实时数据汇总：
          <div class="flex aic jc-sb">
            <el-date-picker
              v-model="date1"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <span class="ml-30 mr-30">对比</span>
            <el-date-picker
              v-model="date2"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </div>
        <el-button class="mt-20" type="primary" @click="getTableData"
          >查询</el-button
        >
        <el-table :data="tableAllData" stripe class="mt-30">
          <el-table-column prop="viewNum" label="展现量"> </el-table-column>
          <el-table-column prop="clickNum" label="点击量"> </el-table-column>
          <el-table-column prop="ctr" label="点击率"> </el-table-column>
          <el-table-column prop="tradingVolume" label="总成交金额">
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-divider></el-divider> -->
      <el-table :data="oneList" stripe class="mt-30 itemContainer">
        <el-table-column label="时间">
          <template slot-scope="scope">
            <div class="flex2">
              <span> {{ scope.row.time }}</span>
              <span> {{ twoList[scope.$index].time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="展现量">
          <template slot-scope="scope">
            <div class="flex2">
              <span> {{ scope.row.viewNum }}</span>
              <span> {{ twoList[scope.$index].viewNum }}</span>
            </div>
          </template></el-table-column
        >
        <el-table-column label="点击量">
          <template slot-scope="scope">
            <div class="flex2">
              <span> {{ scope.row.clickNum }}</span>
              <span> {{ twoList[scope.$index].clickNum }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点击率"
          ><template slot-scope="scope">
            <div class="flex2">
              <span> {{ scope.row.ctr }}</span>
              <span> {{ twoList[scope.$index].ctr }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成交金额">
          <template slot-scope="scope">
            <div class="flex2">
              <span> {{ scope.row.tradingVolume }}</span>
              <span> {{ twoList[scope.$index].tradingVolume }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="ml-30">
      <div class="itemContainer">
        推广计划
        <el-divider></el-divider>
        <el-table :data="planList" stripe>
          <el-table-column prop="adPlanName" label="计划名称">
          </el-table-column>
          <el-table-column prop="typeStr" label="展位"> </el-table-column>
          <el-table-column prop="adPrice" label="花费"> </el-table-column>
        </el-table>
        <div class="flex mt-30">
          <el-button type="primary" @click="addMorePaln"
            >新建推广计划</el-button
          >
          <el-button @click="cheackAll">查看所有计划</el-button>
        </div>
      </div>
      <div class="itemContainer mt-30">
        推广效果
        <el-divider></el-divider>
        <el-table :data="sevenDayData" stripe>
          <el-table-column prop="time" label="时间"> </el-table-column>
          <el-table-column prop="viewNum" label="展现量"> </el-table-column>
          <el-table-column prop="tradingVolume" label="点击量">
          </el-table-column>
        </el-table>
        <div class="flex mt-30">
          <el-button @click="$router.push({ name: 'promotionReport' })"
            >推广明细</el-button
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  GetAdBiContrastByTimeAPI,
  GetAdBiByNearlySevenDayAPI,
  GetOrderPageAPI,
} from "@/api/advertisementAPI.js";

export default {
  data() {
    return {
      oneList: [], //第一天的数据
      twoList: [], //第一天的数据
      planList: [], //推广计划
      sevenDayData: [], //七天数据
      CODE: 0,
      tableAllData: [], //日期对比返回的表格数据对比
      tableData: [], //日期对比返回的表格数据对比
      date1: new Date(),
      date2: new Date().getTime() - 3600 * 1000 * 24,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    addMorePaln() {
      this.$router.push({
        path: "/promote/promotePlan/addPlan",
      });
    },
    cheackAll() {
      this.$router.push({
        path: "/promote/promotePlan",
      });
    },
    getTableData() {
      let data = {
        // dayTime: "2020-11-11",
        dayOne: this.date1,
        dayTwo: new Date(this.date2),
      };
      GetAdBiContrastByTimeAPI(data, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        console.log(res, "data");
        this.tableAllData = [res.data.oneAll, res.data.twoAll];
        this.oneList = res.data.oneList; //列表一
        this.twoList = res.data.twoList; //列表二
      });
    },
    getPlanList() {
      //获取表格数据
      let data = {
        total: 0, //全部
        pageIndex: 1,
        pageSize: 7,
      };
      GetOrderPageAPI(data, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        // console.log(res, "eee");
        this.planList = res.data.rows;
      });
    },
    getNearBySeven() {
      GetAdBiByNearlySevenDayAPI().then((res) => {
        //获取前七天的数据
        // console.log(res, "eee");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.sevenDayData = res.data;
      });
    },
  },
  mounted() {
    this.getTableData();
    this.getPlanList();
    this.getNearBySeven();
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}
.container {
  display: grid;
  display: -ms-grid;
  grid-template-columns: 60% 40%;
}
.wantToPromote {
  .itemContainer {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 4px 0px #e8e8e8;
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
}
</style>