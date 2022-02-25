<template>
  <!-- 收入明细 -->
  <errorPage v-if="CODE===101" />
  <div class="revenue br-8" v-else>
    <el-card class="box-card">
      <div slot="header" style="height:20px" class="clearfix">
        <span style="margin-right:20px;font-size:15px;">店铺公告</span>
      </div>

      <div>
        <el-table :data="MessageData" style="width: 100%">
          <el-table-column prop="title" label="标题">
            <template slot-scope="scope">
              <i class="el-icon-warning-outline"></i>
              {{scope.row.title}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="GetMessageInfo(scope.row.id)" type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
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
    <el-dialog
      :title="MessageInfo.title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>{{MessageInfo.body}}</span>

      <span slot="footer" class="dialog-footer">
        <p style="margin-bottom: 10px;color: #606266;">{{MessageInfo.creatorDate}}</p>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetMessagePageAPI,
  GetMessageInfoAPI,
  GetNoticePageAPI,
  NoticeInfoAPI,
} from "@/api/shopAPI";

import qs from "qs";
export default {
  data() {
    return {
      CODE: 0,
      /* 分页组件*/
      tablePagination: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 6, // 每页显示条目个数，支持 .sync 修饰符
        },
      },
      dialogVisible: false,
      dialogImg: false,
      MessageData: [],
      MessageInfo: {},
      pageData: {
        pIndx: 1,
        pSize: 6,
      },
      fileList: [],
    };
  },
  methods: {
    /* 当前页改变时*/
    handleCurrentChange(val) {
      this.tablePagination.query.curPage = val; // 当前页
      this.pageData.pIndx = val;
      this.PagerMessage();
    },
    handleClose() {
      this.PagerMessage();
      this.dialogVisible = false;
    },
    //查询消息分页
    PagerMessage() {
      GetNoticePageAPI(this.pageData, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
        }
        let newList = res.data.rows.map((item) => {
          return Object.assign({}, item, { checked: false });
        });
        this.MessageData = newList;
        this.tablePagination.total = res.data.total;
      });
    },
    //获取消息详情
    GetMessageInfo(msgId) {
      var params = {
        id: msgId,
      };

      NoticeInfoAPI(params, "get").then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.MessageInfo = res.data;
        this.dialogVisible = true;
      });
    },
  },
  mounted() {
    this.PagerMessage();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .warning-row {
  background: #d4ecf5;
}

/deep/ .el-table .success-row {
  background: #f0f9eb;
}

.mr-30 {
  margin-right: 30px;
}
.upColor {
  font-size: 22px;
  margin-left: 10px;
  color: #e46d0c;
}
.downColor {
  font-size: 22px;
  color: #4a5060;
}
.fontCColor {
  cursor: pointer;
}
.btnfooter {
  margin-top: 30px;
  margin-left: 25%;
}
.yulan {
  float: right;
  cursor: pointer;
}
.tables tr {
  height: 30px;
}
.tables tr td {
  font-size: 15px;
  font-weight: 500;
}
.table_span {
  color: #9a9a9a;
}

/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}

/deep/.el-card__header th > .cell {
  height: 36px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.box-card {
  box-shadow: none;
  border: none;
}
.revenue {
  // height: 500px;
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
    /deep/.el-checkbox {
      margin-right: 22px;
    }
  }
  .item {
    margin-right: 40px;
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
    line-height: 30px;
  }
  .item_pirce {
    font-family: MicrosoftYaHei;
    color: #b7b7b7;
  }
  .item_name {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
}
body > .el-container {
  margin-bottom: 40px;
}
.el-card__body {
  height: 500px;
}
.el-card__header {
  padding: 0.938vw 1.042vw;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  height: 100px;
  /* position: absolute; */
  top: 0;
  width: 100%;
  background: #fff;
}
.el-aside {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #fff;
  color: #333;
  /* text-align: center; */
  /* line-height: 10px; */
  margin-left: 10px;
  padding: 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  height: 600px;
}
</style>