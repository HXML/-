<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-tabs v-model="tabsFrist" @tab-click="handleClick" value="Account">
      <el-tab-pane label="账号管理" name="Account"></el-tab-pane>

      <el-tab-pane label="角色管理" name="Role"></el-tab-pane>
    </el-tabs>

    <div class="UserBox" v-show="Ushow">
      <el-button type="primary" size="mini" plain @click="JumpNew()">添加用户</el-button>

      <!-- 用户列表 -->
      <el-table :data="UserData" style="width: 100%;margin-top:20px;">
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="isEnabled" label="账号状态">
          <template slot-scope="scope">{{scope.row.isEnabled == 1?"正常使用":"停止使用"}}</template>
        </el-table-column>
        <el-table-column prop="creatorDate" label="创建时间"></el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div class="flex2 operation">
              <span
                v-if="scope.row.isMe==0"
                @click="showEditBox(scope.row.userId,scope.row.userName)"
                type="text"
                size="small"
              >修改</span>
              <span v-if="scope.row.isMe==0">
                <span
                  @click="EditEnabled(scope.row.userId,0)"
                  type="text"
                  size="small"
                  v-if="scope.row.isEnabled==1"
                >禁用</span>
                <span @click="EditEnabled(scope.row.userId,1)" type="text" size="small" v-else>启用</span>
              </span>
              <span
                @click="Delete(scope.row.userId)"
                type="text"
                size="small"
                v-if="scope.row.isMe==0"
              >删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页  hide-on-single-page属性当分页只有一页时，隐藏分页 -->
      <section class="flex xiajia">
        <el-pagination
         :pager-count="5"
          background
          hide-on-single-page
          layout="prev, pager, next"
          @current-change="handleCurrentChange_user"
          :current-page="tablePagination_user.query.curPage"
          :page-size="tablePagination_user.query.pagesize"
          :total="tablePagination_user.total"
        ></el-pagination>
      </section>
    </div>
    <div class="Rolebox" v-show="Rshow">
      <!-- 角色列表 -->
      <el-table :data="RoleData" style="width: 100%;margin-top:20px;">
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="shopInNum" label="账号数量"></el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div class="flex2 operation">
              <span
                @click="LookDetail(scope.row.id,scope.row.roleName)"
                type="text"
                size="small"
              >查看权限</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <section class="flex xiajia">
        <el-pagination
         :pager-count="5"
          background
          hide-on-single-page
          layout="prev, pager, next"
          @current-change="handleCurrentChange_role"
          :current-page="tablePagination_role.query.curPage"
          :page-size="tablePagination_role.query.pagesize"
          :total="tablePagination_role.total"
        ></el-pagination>
      </section>
    </div>

    <!-- 查看角色权限 -->
    <el-dialog
      :title="formTtitle"
      :visible.sync="dialogFormVisible"
      top="10vh"
      :append-to-body="true"
      :lock-scroll="false"
    >
      <div class="diaLogContent" style="height: 60vh;overflow:auto;">
        <div
          style="width: 100%;height: 100%;text-align: center;line-height: 60vh;color: #303133;"
          v-if="RoleResDate.length <= 0"
        >暂无权限</div>

        <div v-else>
          <el-card class="box-card" v-for="(itemV1,index1) in RoleResDate" :key="index1">
            <div slot="header" class="clearfix">
              <span>{{itemV1.resourceName}}</span>
            </div>
            <div class="text item" style="margin-right: 0;">
              <el-card class="box-card" v-for="(itemV2,index2) in itemV1.children" :key="index2">
                <div slot="header" class="clearfix">
                  <span>{{itemV2.resourceName}}</span>
                </div>
                <span v-for="(itemV3,index3) in itemV2.children" :key="index3">
                  <el-tag
                    color="#ffffff"
                    style="margin-right: 5px;margin-bottom: 5px;"
                  >{{itemV3.resourceName}}</el-tag>
                </span>
              </el-card>
            </div>
          </el-card>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="handleDialogComfirm">确 定</el-button> -->
      </div>
    </el-dialog>

    <!-- 修改用户角色 -->
    <el-dialog :title="formTtitle1" :visible.sync="dialogFormVisible1">
      <div class="diaLogContent">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            :label="item.id"
            name="useRole"
            v-for="(item,index) in EditRoleData"
            :key="index"
            :checked="item.checked"
          >{{item.roleName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false;editRole=0">关 闭</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetRoleAPi,
  GetUserAPi,
  EnableAPi,
  DelShopUAPi,
  GetRoleAllAPi,
  EditShopUserAPi,
  RoleResListAPi
} from "@/api/settingAPI";

import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
       CODE:0,
      Ushow: true,
      Rshow: false,
      tabsFrist: "Account",
      dialogFormVisible: false,
      formTtitle: "查看权限",
      dialogFormVisible1: false,
      formTtitle1: "更改用户角色",
      checkList: [],
      /* 分页组件*/
      tablePagination_user: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 8 // 每页显示条目个数，支持 .sync 修饰符
        }
      },
      /* 分页组件*/
      tablePagination_role: {
        total: 10, // 总条目数
        loading: true, // 是否加载loading动画
        query: {
          curPage: 1, // 当前页数
          pagesize: 8 // 每页显示条目个数，支持 .sync 修饰符
        }
      },
      sType: [], //假的
      RolepageData: {
        pIdex: 1,
        pSize: 8
      },
      UserpageData: {
        pIdex: 1,
        pSize: 8
      },
      ruleForm: {
        name: "",
        region: ""
      },
      tableData: [], //外层表格
      RoleData: [], // 角色数据
      EditRoleData: [], //用来做修改的角色数据
      UserData: [], // 用户数据
      RoleResDate: [], // 角色权限数据
      RoleResDataV1: []
    };
  },
  methods: {
    LookDetail(roleID, RoleName) {
      //查看角色权限
      this.formTtitle = RoleName + "的权限";
      this.dialogFormVisible = true;
      this.GetRoleRes(roleID);
    },
    JumpNew() {
      this.$router.push({ path: "../AddUser", query: 1 });
    },
    handleClick(tab, event) {
      //选择选项卡

      // console.log(tab, event);
      if (tab.name == "Account") {
        this.Ushow = true;
        this.Rshow = false;
        if (this.UserData.length <= 0) {
          this.GetUser();
        }
      }
      if (tab.name == "Role") {
        this.Rshow = true;
        this.Ushow = false;
        if (this.RoleData.length <= 0) {
          this.getRole();
        }
      }
    },

    /* 当前页改变时*/
    handleCurrentChange_user(val) {
      this.tablePagination_user.query.curPage = val; // 当前页
      this.UserpageData.pageIndex = val;
      this.GetUser();
    },
    /* 当前页改变时*/
    handleCurrentChange_role(val) {
      this.tablePagination_role.query.curPage = val; // 当前页
      this.RolepageData.pageIndex = val;
      this.getRole();
    },

    //显示修改用户角色的窗口
    showEditBox(userId, userName) {
      this.EditRoleData = [];
      this.checkList = [];
      this.editRole = userId;
      this.formTtitle1 = userName + "的角色";
      //查询全部商户角色
      GetRoleAllAPi("get").then(res => {
         if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        console.log(res);
        this.EditRoleData = res.data;

        //获取当前选择用户的数据
        var user_;
        this.UserData.forEach(item => {
          if (item.userId == userId) {
            user_ = item;
          }
        });

        //循环角色列表
        this.EditRoleData.forEach(item => {
          var isuse = true;
          //循环用户拥有的角色id，显示选中
          user_.roleId.forEach(item1 => {
            if (item.id == item1) {
              item.checked = true;
              isuse = false;
            }
          });

          //若没有匹配的id，则不选中
          if (isuse) {
            item.checked = false;
          }
        });

        this.dialogFormVisible1 = true;
      });
    },

    submitEdit() {
      console.log(this.checkList);
      console.log(this.editRole);

      var fromD = new FormData();
      fromD.append("userId", this.editRole);
      fromD.append("roleId", this.checkList.join(","));

      EditShopUserAPi(fromD, "put").then(res => {
        console.log(res);
        this.dialogFormVisible1 = false;
        this.GetUser();
        this.getRole();
      });
    },
    getRole() {
      this.RoleData = [];

      GetRoleAPi(this.RolepageData, "get").then(res => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        let newList = res.data.rows.map(item => {
          return Object.assign({}, item, { checked: false });
        });

        this.RoleData = newList;
        this.tablePagination_role.total = res.data.total;
      });
    },

    GetUser() {
      GetUserAPi(this.UserpageData, "get").then(res => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        let newlist = res.data.rows.map(item => {
          return Object.assign({}, item, { checked: false });
        });

        this.UserData = newlist;
        this.tablePagination_user.total = res.data.total;
      });
    },

    EditEnabled(userId, val) {
      var _data = {
        UserID: userId,
        Enable: val
      };

      EnableAPi(userId, _data, "put")
        .then(res => {
           if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
          this.GetUser();
        });
    },
    Delete(userId) {
      DelShopUAPi(userId, "delete")
        .then(res => {
           if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
          this.GetUser();
        });
    },
    GetRoleRes(RoleID) {
      this.RoleData;
      this.RoleResDate = [];
      RoleResListAPi(RoleID, "get").then(res => {
        console.log(res);
        if (res.data != null) {
          res.data.forEach(item => {
            if (item.priPcode == 0) {
              this.RoleResDate.push(item);
              item.children = [];
              res.data.forEach(itemV2 => {
                if (itemV2.priPcode == item.priCode) {
                  item.children.push(itemV2);

                  itemV2.children = [];
                  res.data.forEach(itemV3 => {
                    if (itemV3.priPcode == itemV2.priCode) {
                      itemV2.children.push(itemV3);
                    }
                  });
                }
              });
            }
          });

          console.log(this.RoleResDate, "处理后");
        }
      });
    }
  },
  mounted() {
    this.GetUser();
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  transition: 0.3s;
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
  padding:  24px 24px 0 24px;
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