<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="操作账号：" label-width="120px" prop="name">
        <el-select class="w-164" v-model="Users" ref="Use" @change="UserChange" placeholder="请选择类型">
          <el-option value="0">请选择操作账号</el-option>
          <el-option
            v-for="(item,index) in sUser"
            :key="index"
            :value="item.userId"
          >{{item.userName}}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="操作模块：" label-width="120px" prop="name">
        <el-select
          class="w-164"
          v-model="modules"
          ref="Module"
          @change="handleChange"
          placeholder="请选择类型"
        >
          <el-option value="0">请选择类型</el-option>
          <el-option
            v-for="(item,index) in sModule"
            :key="index"
            :value="item.opNo"
          >{{item.opModule}}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="操作时间：" label-width="120px" prop="name">
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

      <el-form-item label="内容：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.conten" class="w-164" maxlength="30"></el-input>
      </el-form-item>
    </el-form>
    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">确认筛选</div>
      <span
        :class="pageData.uId!==''
        ||pageData.No!==''
        ||pageData.sTime!==''
        ||pageData.conten!==''
        ||pageData.eTime!==''"
        @click="clearAllInput"
      >清空筛选条件</span>
    </div>

    <!-- 列表 -->
    <el-table ref="filterTable" :data="tableData" style="width: 100%;margin-top:20px;">
      <el-table-column prop="username" label="操作账号"></el-table-column>

      <el-table-column prop="opModule" label="操作模块"></el-table-column>
      <el-table-column prop="opFun" label="操作页面"></el-table-column>
      <el-table-column prop="creatorDate" label="操作时间"></el-table-column>
      <!-- <el-table-column prop="ip" label="操作人IP"></el-table-column> -->
      <el-table-column prop="opData" label="内容"></el-table-column>
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
    <!-- Form -->
  </div>
</template>

<script>
import { LogAPI, GetModuleAPI, GetUAPI } from "@/api/settingAPI";

export default {
  data() {
    return {
      CODE: 0,
      priceEdit: false, //是否编辑price
      pageAllChecked: false, //全选开关
      numEdit: false, //是否编辑num
      // 下拉联级选择
      options: [],
      /* 分页组件*/
      tablePagination: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 8, // 每页显示条目个数，支持 .sync 修饰符
        },
      },
      // form表单
      dialogFormVisible: false,
      formTtitle: "编辑价格",
      // form表单
      sModule: [], //操作模块下拉框数据
      modules: "",
      sUser: [], //操作用户下拉框数据
      Users: "",
      pageData: {
        pIdex: 1,
        pSize: 8,
        uId: "", //操作账号
        No: "", //操作模块
        sTime: "", //操作时间 开始
        eTime: "", //操作时间 结束
        conten: "",
      },
      ruleForm: {
        name: "",
        region: "",
      },
      tableData: [], //外层表格
      dialogTable: [], //弹窗表格
    };
  },
  methods: {
    handleChange(val) {
      if (val == 0) {
        this.pageData.No = "";
        this.modules = "";
        return;
      }

      let obj = this.sModule.find((item) => {
        return item.opNo === val;
      });
      this.pageData.No = val;
      this.modules = obj.opModule;
    },

    UserChange(val) {
      if (val == 0) {
        this.pageData.uId = "";
        this.Users = "";
        return;
      }
      let obj = this.sUser.find((item) => {
        return item.userId === val;
      });
      this.pageData.uId = val;
      this.Users = obj.userName;
    },

    handleAllChecked() {
      //点击全选
      console.log(this.pageAllChecked, "pageAllChecked");
      if (!this.pageAllChecked) {
        this.tableData.forEach((item) => {
          console.log(item);
          item.checked = true;
        });
      } else {
        this.tableData.forEach((item) => {
          console.log(item);
          item.checked = false;
        });
      }
    },

    confirmSelect() {
      console.log(this.pageData);

      this.getList();
    },

    /* 当前页改变时*/
    handleCurrentChange(val) {
      this.tablePagination.query.curPage = val; // 当前页
      this.pageData.pIdex = val;
      this.getList();
    },

    getList() {
      //获取数据
      LogAPI(this.pageData, "get")
        .then((res) => {
          console.log(res);
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
        pIdex: 1,
        pSize: 8,
        uId: "", //操作账号
        No: "", //操作模块
        sTime: "", //操作时间 开始
        eTime: "", //操作时间 结束
        conten: "",
      };
      this.modules = "";
      this.sType = [];
      this.getList();
    },
  },
  mounted() {
    this.getList();

    GetModuleAPI().then((res) => {
      console.log(res);
      this.sModule = res.data;
    });

    GetUAPI().then((res) => {
      console.log("aaaaa", res);
      this.sUser = res.data;
    });
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
  height: 786px;
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