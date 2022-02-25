<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="商品名称：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.cName" class="w-164" maxlength="30"></el-input>
      </el-form-item>

      <el-form-item label="有效期：" label-width="120px" prop="name" class="aic">
        <el-date-picker
          class="w-164"
          v-model="pageData.sTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间"
        ></el-date-picker>
        <span class="mr-8 ml-8 fontZ">至</span>
        <el-date-picker
          class="w-164"
          v-model="pageData.eTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">确认查询</div>
      <el-button @click="JumpDetail(0)" size="small" style="margin-left: 10px;">添加优惠券</el-button>
    </div>
    <el-tabs v-model="pageData.status" @tab-click="handleClick">
      <el-tab-pane label="所有券" name="1"></el-tab-pane>
      <el-tab-pane label="未开始" name="2"></el-tab-pane>
      <el-tab-pane label="进行中" name="3"></el-tab-pane>
      <el-tab-pane label="已结束" name="4"></el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <el-table ref="filterTable" :data="tableData" style="width: 100%;">
      <el-table-column prop="couponsName" label="券名称">
        <template slot-scope="scope">
          <div class="flex aic">
            <div class="flex jc-fs">
              <div class="title">{{scope.row.couponsName}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="faceValue" label="面额">
        <template slot-scope="scope">
          <div class="flex aic">
            <span>¥</span>
            {{ scope.row.faceValue}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="quotaLimit" label="条件">
        <template slot-scope="scope">
          <div class="flex aic" v-if="scope.row.couponsType==1">满{{scope.row.quotaLimit}}</div>
          <div class="flex aic" v-else>无门槛</div>
        </template>
      </el-table-column>
      <el-table-column min-width="100" prop="buyNum" label="领取时间">
        <template slot-scope="scope">
          <div class="flex aic">{{scope.row.beginDate}}</div>至
          <div class="flex aic">{{scope.row.endDate}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="faceValue" label="限制/人"></el-table-column> -->
      <el-table-column prop="maxNum" label="发行量"></el-table-column>
      <el-table-column prop="currNum" label="已领取"></el-table-column>
      <el-table-column prop="statusStr" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <div class="flex2 operation">
            <span @click="dialogVisible = true" type="text" size="small">链接</span>
            <span type="text" @click="JumpDetail(scope.row.id)" size="small">修改</span>
            <span
              type="text"
              @click="EndCoupon(scope.row.id)"
              size="small"
              v-if="scope.row.statusStr!='已结束'"
            >结束</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div></div>
      <!-- 分页 -->
      <el-pagination
        :pager-count="5"
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.query.curPage"
        :page-size="tablePagination.query.pagesize"
        :total="tablePagination.total"
      ></el-pagination>
    </section>

    <el-dialog title="链接" :visible.sync="dialogVisible" width="30%" top="30vh">
      <span>这是一段链接</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetPageAPI, EndCouponAPI } from "@/api/activityApi";
export default {
  data() {
    return {
      CODE: 0,
      // 下拉联级选择
      options: [],
      /* 分页组件*/
      tablePagination: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 4, // 每页显示条目个数，支持 .sync 修饰符
        },
      },
      tableData: [],
      // form表单
      pageData: {
        pIndx: 1,
        pSize: 4,
        status: "1", //1是所有券，2是未开始，3是领取中，4是已结束
        cName: "",
        sTime: "",
        eTime: "",
      },
      dialogVisible: false,
    };
  },
  methods: {
    handleClick(tab, event) {
      //点击标签页
      console.log(tab.name);
      this.pageData.pIndx = 1;
      this.getList();
    },
    JumpDetail(id_) {
      //跳转去修改
      this.$router.push({ path: "../CouponsDetil", query: { id: id_ } });
    },
    confirmSelect() {
      //点击查询
      this.pageData.pIndx = 1;
      this.getList();
    },
    /* 当前页改变时*/
    handleCurrentChange(val) {
      this.tablePagination.query.curPage = val; // 当前页
      this.pageData.pIndx = val;
      this.getList();
    },
    getList() {
      //获取数据
      GetPageAPI(this.pageData, "get").then((res) => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        let newList = res.data.rows.map((item) => {
          return Object.assign({}, item, { checked: false });
        });
        this.tableData = newList;
        this.tablePagination.total = res.data.total;
      });
    },
    EndCoupon(id_) {
      //手动结束优惠券领取

      this.$confirm("此操作将结束该优惠券的领取时间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //结束优惠券的领取
          console.log(id_);
          var data_ = {
            id: id_,
          };
          EndCouponAPI(data_, "put").then((res) => {
            console.log(res);
            this.getList();
          });
        })
        .catch(() => {
          //取消删除
        });
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