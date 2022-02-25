<template>
  <errorPage v-if="CODE === 101" />
  <div class="promotePlan" v-else>
    推广计划
    <el-divider></el-divider>
    <el-button type="primary" @click="addMorePaln">新建推广计划</el-button>
    <el-table :data="tableData" stripe class="mt-16">
      <el-table-column prop="typeStr" label="投放类型"> </el-table-column>
      <el-table-column prop="adPlanName" label="推广计划名称">
      </el-table-column>
      <el-table-column prop="adPrice" label="花费"> </el-table-column>
      <el-table-column prop="statusStr" label="状态"> </el-table-column>
      <el-table-column prop="name" label="推广时间">
        <template slot-scope="scope">
          {{ scope.row.planPublishBeginTime }} 至
          {{ scope.row.planPublishEndTime }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.statusStr == '推广中'"
            @click.prevent="handleClick(scope.row)"
            type="text"
            size="small"
          >
            暂停推广
          </el-button>
          <el-button
            @click.prevent="handleClick(scope.row)"
            v-if="scope.row.statusStr == '暂停'"
            type="text"
            size="small"
          >
            参与推广
          </el-button>
          <el-button
            @click.prevent="handleClick(scope.row)"
            v-if="scope.row.statusStr == '已过期'"
            type="text"
            size="small"
          >
            删除
          </el-button>
          <el-button
            @click.prevent="showPayDailog(scope.row)"
            v-if="scope.row.statusStr == '新建'"
            type="text"
            size="small"
          >
            待支付
          </el-button>
          <el-button
            @click.prevent="handleDetail(scope.row)"
            type="text"
            size="small"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div class="mt-30"></div>
      <el-pagination
        class="mt-30"
        :pager-count="5"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="tablePagination.pageIndex"
        :page-sizes="[10, 16, 32, 50]"
        :page-size="10"
        :total="tablePagination.total"
      ></el-pagination>
    </section>

    <!-- 支付的弹窗 -->
    <el-dialog
      title="推广支付"
      :visible.sync="payVisiable"
      v-if="payVisiable"
      width="30%"
    >
      <div>
        支付方式：
        <el-select v-model="payType" placeholder="选择支付方式">
          <el-option label="微信支付" :value="1"> </el-option>
          <el-option label="支付宝支付" :value="2"> </el-option>
        </el-select>
      </div>
      <div class="mt-30">支付金额： {{ this.adPrice }}</div>
      <div class="fcc" v-if="wechatSrc">
        <div class="flex2 aic">
          <img class="w-160" :src="wechatSrc" />
          <span>微信扫码支付</span>
        </div>
      </div>
      <div class="flex jc-sa mt-60">
        <el-button class="w-160" @click="cancelPay">取消</el-button>
        <el-button class="w-160" type="primary" @click="pay">去支付</el-button>
      </div>
    </el-dialog>
    <!-- 支付宝 -->
    <div v-html="pageHtml" ref="alipayWap"></div>
    <!-- 支付宝 -->
  </div>
</template>

<script>
import qs from "qs";
import {
  GetOrderPageAPI,
  getAlPayPageAPI,
  getWxPayDataAPI,
  AdPlanOprationAPI,
  AddAdOrderAPI,
  CreatePayDataAPI,
  OrderIsPayAPI,
} from "@/api/advertisementAPI";
export default {
  watch: {
    payVisiable(val) {
      console.log(val, "val");
      if (!val) {
        clearInterval(window.payTimer);
        window.payTimer = null;
      }
    },
  },
  data() {
    return {
      CODE: 0,
      tableData: [],
      tablePagination: {
        total: 0, //全部
        pageIndex: 1,
        pageSize: 10,
      },
      //支付
      AdOrderNo: "",
      wechatSrc: "",
      payVisiable: false,
      payType: 1,
      pageHtml: "",
      adPrice: "",
    };
  },
  methods: {
    cancelPay() {
      this.payVisiable = false;
      clearInterval(window.payTimer);
    },
    showPayDailog(row) {
      console.log(row.adOrderNo, "row");
      this.adOrderNo = row.adOrderNo;
      this.adPrice = row.adPrice;
      this.payVisiable = true;
    },
    async pay() {
      try {
        if (this.payType == 1) {
          let data = {
            AdOrderNo: this.adOrderNo,
            PayType: 1,
          };
          let result = await CreatePayDataAPI(qs.stringify(data), "post");
          let result2 = await getWxPayDataAPI(
            qs.stringify(result.data),
            "post"
          );
          this.wechatSrc = result2.data;
          clearInterval(window.payTimer); //c触发前清除
          window.payTimer = setInterval(() => {
            // console.log(1);
            let data = {
              orderNo: result.data.orderNo,
              // orderNo: "AD20111714480389552112",
            };
            OrderIsPayAPI(data, "get").then((res) => {
              console.log(res, "ress");
              if (res.data) {
                clearInterval(window.payTimer);
                this.payVisiable = false;
                this.$message({
                  duration: 2000,
                  message: "支付成功!",
                  type: "success",
                  onClose: () => {
                    this.getListData();
                  },
                });
              }
            });
          }, 2000);
        } else {
          let data = {
            AdOrderNo: this.adOrderNo,
            PayType: 2,
          };
          let result = await CreatePayDataAPI(qs.stringify(data), "post");
          let result2 = await getAlPayPageAPI(
            qs.stringify(result.data),
            "post"
          );
          this.pageHtml = result2.data;
          this.$nextTick(() => {
            this.$refs.alipayWap.children[0].submit();
          });
        }
      } catch (error) {
        this.$message({
          duration: 1000,
          message: "请求错误!!",
          type: "error",
        });
      }
    },
    addMorePaln() {
      //跳转新增
      this.$router.push({
        path: "/promote/promotePlan/addPlan",
      });
    },
    handleDetail(row) {
      this.$router.push({
        path: `/promote/promotePlan/addPlan?id=${row.id}&type=Edit`,
      });
    },
    handleClick(row) {
      //操作

      if (row.statusStr == "推广中") {
        // console.log(row, "row");

        this.$confirm("确认暂停该计划？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let data = {
            ids: row.id,
            type: 1,
          };
          AdPlanOprationAPI(data, "GET").then((res) => {
            this.getListData();
          });
        });
        return;
      }
      if (row.statusStr == "暂停") {
        // console.log(row, "row");
        this.$confirm("确认启用该计划？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let data = {
            ids: row.id,
            type: 2,
          };
          AdPlanOprationAPI(data, "GET").then((res) => {
            this.getListData();
          });
        });
        return;
      }
      if (row.statusStr == "已过期") {
        // console.log(row, "row");
        this.$confirm("确认删除该计划？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let data = {
            ids: row.id,
            type: 3,
          };
          AdPlanOprationAPI(data, "GET").then((res) => {
            this.getListData();
          });
        });
        return;
      }
    },
    handleSizeChange(val) {
      //修改条数
      this.tablePagination.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      //修改页数
      this.tablePagination.pageIndex = val; // 当前页
      this.getListData();
    },
    getListData() {
      GetOrderPageAPI(this.tablePagination, "get").then((res) => {
        console.log(res, "eee");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.tableData = res.data.rows;
        this.tablePagination.total = res.data.total;
      });
    },
  },
  beforeDestroy() {
    clearInterval(window.payTimer);
  },
  Destroy() {
    clearInterval(window.payTimer);
  },
  mounted() {
    this.getListData();
  },
};
</script>
<style lang="scss" scoped>
.promotePlan {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px #e8e8e8;
}
</style>