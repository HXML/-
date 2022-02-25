
<template>
  <!-- GetActWithPage 搭配满减活动 -->
  <errorPage v-if="CODE === 101" />
  <div class="activeList" v-else>
    <div class="header flex jc-sb">
      <div class="flex">
        <section class="flex aic">
          <span>套装名称：</span>
          <el-input
            class="w-160"
            placeholder="请输入活动名称"
            v-model="queryListData.actName"
          ></el-input>
        </section>
        <section class="flex aic ml-40">
          <span>主商品：</span>
          <el-input
            class="w-160"
            placeholder="请输入活动名称"
            v-model="queryListData.actName"
          ></el-input>
        </section>
        <section class="flex aic ml-40">
          <span>套餐类型：</span>
          <el-select v-model="queryListData.withType">
            <el-option label="固定组合套餐" :value="1"></el-option>
            <el-option label="自选商品套餐" :value="2"></el-option>
          </el-select>
        </section>
      </div>
      <div>
        <el-button @click="getData">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <el-tabs v-model="queryListData.sTatus" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="未开始" name="1"></el-tab-pane>
      <el-tab-pane label="进行中" name="2"></el-tab-pane>
      <el-tab-pane label="已结束" name="3"></el-tab-pane>
    </el-tabs>
    <el-button @click="toDetail">创建套餐</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        align="center"
        fixed
        prop="actName"
        label="活动名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="goodsName"
        label="主商品"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="typeStr"
        label="套餐类型"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="actStatus"
        label="套餐状态"
      ></el-table-column>
      <el-table-column align="center" label="活动时间">
        <template slot-scope="scope"
          >{{ scope.row.startTime }}-{{ scope.row.endTime }}</template
        >
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.actStatus == '进行中'"
            @click="closeAtc(scope.row)"
            type="text"
            size="small"
            >结束</el-button
          >
          <el-button
            @click="handleClickTab(scope.row, 'onlyRead')"
            type="text"
            size="small"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.actStatus !== '进行中'"
            @click="handleClickTab(scope.row, 'Edit')"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            v-if="
              scope.row.actStatus == '未开始' || scope.row.actStatus == '已结束'
            "
            @click="deleteActive(scope.row)"
            type="text"
            size="small"
            >删除</el-button
          >
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
  GetActWithPageAPI,
  DelActWithAPI,
  EndActWithAPI,
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
        sTatus: "0", //活动状态 0全部  1是未开始 2是进行中 3是已结束
        actName: "", //     活动名称'
        goodsName: "", //   主商品名称'
        withType: "", //     活动类型 1是固定 2是自选'
        pindx: 1, //       分页'
        psize: 6, //       分页'
      },
      activeName: "全部",
      timer: "",
      tableData: [],
    };
  },
  methods: {
    handleSizeChange(val) {
      this.queryListData.psize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.queryListData.pindx = val;
      this.getData();
    },
    confirmDate(e) {
      console.log(e, "eeee");
      this.queryListData.startTime = e[0];
      this.queryListData.endTime = e[1];
    },
    toDetail() {
      this.$router.push({
        name: "matchMaxDetail",
      });
    },
    resetSearch() {
      this.timer = "";
      this.queryListData = {
        sTatus: "0", //活动状态 0全部  1是未开始 2是进行中 3是已结束
        actName: "", //     活动名称'
        goodsName: "", //   主商品名称'
        withType: 1, //     活动类型 1是固定 2是自选'
        pindx: 1, //       分页'
        psize: 6, //       分页'
      };
      this.getData();
    },
    handleClick(e) {
      console.log(e.index);
      this.queryListData.sTatus = String(e.index);
      this.getData();
    },
    handleClickTab(row, type) {
      console.log(row);
      this.$router.push({
        name: "matchMaxDetail", //活动 + `?id=${row.actId}&type=${type}`,
        query: {
          id: row.actId,
          type: type,
        },
      });
    },
    closeAtc(row) {
      this.$confirm("此操作将结束此活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //结束
        // console.log(row);
        EndActWithAPI(
          {
            actId: row.actId,
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
    deleteActive(row) {
      this.$confirm("此操作将删除所选中的活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row);
          DelActWithAPI(
            {
              actId: row.actId,
            },
            "delete"
          ).then((res) => {
            console.log(res);
            if (res.code == 1) {
              this.$message({ type: "success", message: "删除成功!" });
              this.getData();
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
      //删除活动
    },
    getData() {
      GetActWithPageAPI(this.queryListData, "get").then((res) => {
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
.activeList {
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