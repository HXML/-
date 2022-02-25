<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="商品名称：" label-width="120px" prop="name">
        <el-input
          class="w-164"
          placeholder="请输入"
          v-model="pageData.gName"
        ></el-input>
      </el-form-item>

      <el-form-item label="删除时间：" label-width="120px" prop="name">
        <el-date-picker
          class="w-164 mr-10"
          v-model="pageData.tFirst"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间"
        ></el-date-picker>至
        <el-date-picker
          class="w-164 ml-10 "
          v-model="pageData.tLast"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">确认筛选</div>
      <span
        :class="pageData.gName!==''
        ||pageData.tFirst!==''
        ||pageData.tLast!==''?'clearCondition_active pointer':'clearCondition pointer'"
        @click="clearAllInput"
      >清空筛选条件</span>
    </div>
    <!-- 列表 -->
    <el-table ref="filterTable" :data="tableData" style="width: 100%;margin-top:20px;">
      <el-table-column min-width="180px" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <div class="flex aic">
            <el-checkbox v-model="scope.row.checked" @change="handleCheckedChange"></el-checkbox>
            <div class="flex jc-fs ml-8">
              <img
                style="height:70px;width:70px;"
                :src="scope.row.mainImg+'?x-oss-process=style/s4'"
                alt
              />
              <div class="ml-8 title">{{scope.row.goodsName}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格">
        <template slot-scope="scope">
          <div class="flex aic">
            <span>¥</span>
            {{ scope.row.price}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stockQty" label="库存">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.number}}</span>
          <i class="ml-8 el-icon-edit"></i>-->
          <div class="flex aic">{{ scope.row.stockQty}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="buyNum" label="总销量"></el-table-column>
      <el-table-column prop="deleteTime" label="删除时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <div class="flex2 operation">
            <span @click="handleClick(scope.row)" type="text" size="small">恢复到仓库</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div>
        <el-checkbox v-model="pageAllChecked" @click.native="handleAllChecked()">全选</el-checkbox>
        <el-button @click="offlGood">恢复到仓库</el-button>
      </div>
      <!-- 分页 -->
      <!-- <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.query.curPage"
        :page-size="tablePagination.query.pagesize"
        :total="tablePagination.total"
      ></el-pagination>-->
      <el-pagination
        :pager-count="5"
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[4, 8, 16, 32]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePagination.total"
      ></el-pagination>
    </section>
    <!-- Form -->
  </div>
</template>

<script>
import {
  RecycleList_API,
  ShopCateListAPI,
  IsShelfAPI,
} from "@/api/goodsManage";

import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
      currentPage: 1,
      CODE: 0,
      priceEdit: false, //是否编辑price
      pageAllChecked: false, //全选开关
      numEdit: false, //是否编辑num
      /* 分页组件*/
      tablePagination: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 4, // 每页显示条目个数，支持 .sync 修饰符
        },
      },
      // form表单
      dialogFormVisible: false,
      formTtitle: "编辑价格",
      // form表单
      sType: [], //假的
      pageData: {
        pageIndex: 1,
        pageSize: 4,
        gName: "", //商品名称：
        tFirst: "", //商品编码：
        tLast: "",
        oStr: "",
        oStrType: "",
      },
      ruleForm: {
        name: "",
        region: "",
      },
      tableData: [], //外层表格
    };
  },
  methods: {
    handleCheckedChange() {
      //列表单选事件
      let num = 0;
      this.tableData.forEach((item) => {
        if (item.checked == true) {
          num++;
        }
      });
      if (num === this.tableData.length) {
        this.pageAllChecked = true;
      } else {
        this.pageAllChecked = false;
      }
      // console.log(this.tableData.length,"this.tableData.length")
    },

    handleClick(row) {
      let data = {
        shelf: 1, // shelf1下架 shelf2上架
      };
      IsShelfAPI(row.id, data, "put")
        .then((res) => {
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }

          if (res.code == 1) {
            this.$message({
              type: "success",
              message: "恢复成功!",
            });
          }
        })
        .then((res) => {
          this.getList();
        });
    },
    handleAllChecked() {
      //点击全选
      if (!this.pageAllChecked) {
        this.tableData.forEach((item) => {
          item.checked = true;
        });
      } else {
        this.tableData.forEach((item) => {
          item.checked = false;
        });
      }
    },
    Editprice(id) {
      this.priceEdit = true;
      this.dialogFormVisible = true;
      this.formTtitle = "编辑价格";
      let data = {
        id,
      };
    },

    EditNum(id) {
      this.dialogFormVisible = true;
      this.numEdit = true;
      this.formTtitle = "编辑库存";
    },
    offlGood() {
      //下架选中的商品
      let ids = [];
      let listID = this.tableData.forEach((item) => {
        if (item.checked) {
          ids.push(item.id);
        }
      });
      if (ids.length <= 0) {
        this.$message({
          type: "info",
          message: "请先选择商品",
        });
        return;
      }
      let data = {
        shelf: 1, // shelf1下架 shelf2上架
      };
      let idsString = ids.join(",");

      IsShelfAPI(idsString, data, "put").then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: "恢复成功!",
          });
          this.getList();
        }
      });
    },
    confirmSelect() {
      //获取到节点上面的val
      this.pageData.pageIndex = 1;
      this.getList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageData.pageSize = val;
      this.getList();
    },
    /* 当前页改变时*/
    handleCurrentChange(val) {
      this.tablePagination.query.curPage = val; // 当前页
      this.pageData.pageIndex = val;
      this.getList();
    },
    getList() {
      this.pageData.tFirst = switchDayTime(this.pageData.tFirst);
      this.pageData.tLast = switchDayTime(this.pageData.tLast);
      //获取数据
      RecycleList_API(this.pageData, "get")
        .then((res) => {
          if (res.code == 101) {
            this.CODE = 101;
          }
          let newList = res.data.rows.map((item) => {
            return Object.assign({}, item, { checked: false });
          });
          this.tableData = newList;
          this.tablePagination.total = res.data.total;
        })
        .then((res) => {
          this.pageAllChecked = false;
        });
    },
    clearAllInput() {
      //清空所有条件
      this.pageData = {
        pageIndex: 1,
        pageSize: 4,
        gName: "", //商品名称：
        tFirst: "", //商品编码：
        tLast: "",
        oStr: "",
        oStrType: "",
      };
      this.sType = [];
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}

.onSale {
  padding: 24px 24px 0 24px;
  // min-height: 786px;
  background-color: #ffffff;
  .onSaleing {
    color: #219541;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .title {
    width: 240px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
  .xiajia {
    padding: 24px 0;
    /deep/.el-checkbox {
      margin-right: 22px;
    }
  }
  .item {
    margin-right: 40px;
    margin-bottom: 12px;
  }
  .item_pirce {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(224, 32, 32, 1);
  }
  .item_name {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }

  .span_confirm {
    pointer-events: none;
    margin-left: 120px;
    width: 88px;
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(232, 232, 232, 1);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
  }
  .span_confirm_active {
    margin-left: 120px;
    width: 88px;
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(232, 232, 232, 1);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #e46d0c;
  }
  .clearCondition {
    pointer-events: none;
    margin-left: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
  }
  .clearCondition_active {
    margin-left: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #e46d0c;
  }

  .operation {
    span {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(13, 105, 197, 1);
    }
    span:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>