<template>
  <errorPage v-if="CODE === 101" />
  <div class="proCoupon" v-else>
    <div class="header flex jc-sb">
      <div class="flex">
        <section class="flex aic">
          <span>优惠券名称：</span>
          <el-input
            class="w-160"
            placeholder="请输入活动名称"
            v-model="queryListData.couponsName"
          ></el-input>
        </section>
        <section class="flex aic ml-40">
          <span>有效期：</span>
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
        </section>
      </div>
      <div>
        <el-button @click="getData"> 搜索优惠券</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <el-divider></el-divider>

    <el-button @click="toDetail">添加优惠券</el-button>
    <!-- 列表 -->
    <el-table ref="filterTable" :data="tableData" style="width: 100%">
      <el-table-column prop="couponsName" label="券名称">
        <template slot-scope="scope">
          <div class="flex aic">
            <div class="flex jc-fs">
              <div class="title">{{ scope.row.couponsName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="faceValue" label="面额">
        <template slot-scope="scope">
          <div class="flex aic">
            <span>¥</span>
            {{ scope.row.faceValue }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="quotaLimit" label="条件">
        <template slot-scope="scope">
          <div class="flex aic" v-if="scope.row.couponsType == 1">
            满{{ scope.row.quotaLimit }}
          </div>
          <div class="flex aic" v-else>无门槛</div>
        </template>
      </el-table-column>
      <el-table-column min-width="100" prop="buyNum" label="领取时间">
        <template slot-scope="scope">
          <div class="flex aic">{{ scope.row.beginDate }}</div>
          至
          <div class="flex aic">{{ scope.row.endDate }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="faceValue" label="限制/人"></el-table-column> -->
      <el-table-column prop="maxNum" label="发行量"></el-table-column>
      <el-table-column prop="currNum" label="已领取"></el-table-column>
      <el-table-column prop="statusStr" label="优惠券状态"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <div class="flex">
            <el-button
              @click="handleClickTab(scope.row.id, 'onlyRead')"
              type="text"
              size="small"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="handleClickTab(scope.row.id, 'Edit')"
              size="small"
              >编辑</el-button
            >
            <el-button type="text" @click="closeAtc(scope.row)" size="small"
              >结束推广</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-button @click="toDetail">点我</el-button>list -->
    <el-pagination
      :pager-count="5"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tablePagination.currentPage"
      :page-sizes="[4, 6, 8, 16, 32]"
      :page-size="6"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablePagination.total"
    ></el-pagination>
  </div>
</template>

<script>
import {
  DelBigWhellAwardAPI,
  GetPageAPI,
  EndCouponAPI,
  GetBigWhellAwardByShopIdAPI,
} from "@/api/activityApi";
export default {
  data() {
    return {
      CODE: 0,
      tablePagination: {
        total: 0,
        currentPage: 1,
      },
      queryListData: {
        couponsName: "", //活动名称
        startTime: "", //活动开始时间
        endTime: "", //活动结束时间
        pindx: 1,
        psize: 6,
      },
      activeName: "全部",
      timer: "",
      tableData: [],
    };
  },
  methods: {
    JumpDetail(id_) {
      //跳转去修改
      this.$router.push({ name: "proCouponDetail", query: { id: id_ } });
    },
    closeAtc(row) {
      console.log(row.id);
      this.$confirm("此操作将结束此活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        DelBigWhellAwardAPI(
          {
            id: row.id,
          },
          "delete"
        ).then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.$message({ type: "success", message: "结束成功!" });
            this.getData();
          } else {
            this.$message({ type: "error", message: res.msg });
          }
        });
      });
    },
    handleClick(e) {
      console.log(e.index);
      this.queryListData.sTatus = String(e.index);
      this.getData();
    },
    handleClickTab(id, type) {
      console.log(id, type);
      this.$router.push({
        name: "proCouponDetail", //活动 + `?id=${id.actId}&type=${type}`,
        query: {
          id: id,
          type: type,
        },
      });
    },
    confirmDate(e) {
      console.log(e, "eeee");
      this.queryListData.startTime = e[0];
      this.queryListData.endTime = e[1];
    },
    resetSearch() {
      this.timer = "";
      this.queryListData = {
        sTatus: "0", //活动状态 0全部  1是未开始 2是进行中 3是已结束
        actName: "", //活动名称
        startTime: "", //活动开始时间
        endTime: "", //活动结束时间
        pindx: 1,
        psize: 6,
      };
      this.getData();
    },
    toDetail() {
      this.$router.push({
        name: "proCouponDetail",
      });
    },
    handleSizeChange(val) {
      this.queryListData.psize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.queryListData.pindx = val;
      this.getData();
    },
    getData() {
      GetBigWhellAwardByShopIdAPI(this.queryListData, "get").then((res) => {
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
    this.getData();
  },
};
</script>

<style lang="scss">
.el-pagination {
  margin-top: 24px;
  text-align: right;
}
.proCoupon {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px #e8e8e8;
  .el-divider {
    background-color: #f5f5f5;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-range-separator {
    height: 32px;
    line-height: 32px;
    width: fit-content;
  }
  .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
}
</style>








