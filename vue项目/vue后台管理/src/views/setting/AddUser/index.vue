<template>
  <div class="onSale br-8">
    <el-card class="box-card" shadow="never" x>
      <div slot="header" class="clearfix">
        <span>添加用户</span>
      </div>
      <div class="text item">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户账号" prop="UserId">
            <el-input v-model="ruleForm.UserId" class="mr-28" style="width:400px;" id="userShow"></el-input>
            <el-button type="primary" @click="checkNumber('ruleForm')">查询</el-button>
            <span>
              <i class="el-icon-check" style="color:#67c23a;" v-show="canUser"></i>
            </span>
          </el-form-item>

          <el-form-item label="用户角色" prop="type">
            <el-collapse v-model="activeNames" @change="handleChangeColl" v-loading="loading">
              <el-collapse-item name="2">
                <template slot="title">
                  <i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  <el-checkbox-group v-model="ruleForm.type">
                    <el-checkbox
                      :label="item.id"
                      name="type"
                      v-for="(item,index) in RoleData"
                      :key="index"
                    >
                      {{item.roleName}}
                      <i class="header-icon el-icon-info"></i>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form-item label="备注">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  GetRoleAPi,
  RoleResListAPi,
  getUserAPi,
  GetRoleAllAPi,
  InsertSUAPi,
} from "@/api/settingAPI";

import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户会员号或手机号搜索"));
      } else if (value) {
        // getUserAPi
        var data = {
          Keyword: value,
        };
        getUserAPi(data, "get").then((res) => {
          console.log(res);
          if (res.data != undefined || res.data != null) {
            this.userID_ = res.data.userId;
            callback();
            this.canUser = true;
            document.getElementById("userShow").style.borderColor = "#67c23a";
          } else {
            callback(new Error(res.msg));
            this.canUser = false;
            document.getElementById("userShow").style.borderColor = "#F56C6C";
          }
        });
      } else {
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      // console.log(rule, value, callback);
      //提交新增
      var dat = {
        UserId: this.userID_,
        type: this.ruleForm.type.toString(),
        desc: this.ruleForm.desc,
      };
      console.log("sss");
      InsertSUAPi(dat, "post").then((res) => {
        console.log(res);
        if (res.code != 1) {
          callback(new Error(res.msg));
        } else {
          this.$router.push({ path: "../Role" });
          this.options = res.data;
        }
      });
    };
    return {
      loading: false,
      //下拉框数据
      options: [],
      Svalue: "",
      //表单数据
      ruleForm: {
        UserId: "",
        type: [],
        desc: "",
      },
      canUser: false,
      userID_: "",
      activeNames: "1",
      rules: {
        UserId: [{ validator: validatePass, trigger: "focus" }],
        type: [{ validator: validatePass2, trigger: "focus" }],
      },
      tableData: [], //外层表格
      RoleData: [], // 角色数据
      UserData: [], // 用户数据
      RoleResDate: [], // 角色权限数据
      aaaaa: 0,
    };
  },
  methods: {
    checkNumber(formName) {
      this.$refs[formName].validateField("UserId");
    },
    submitForm(formName) {
      this.$refs[formName].validate();
    },
    handleChangeColl(val) {
      if (this.RoleData.length > 0) {
        return;
      }
      this.loading = true;
      GetRoleAllAPi("get").then((res) => {
        console.log(res);

        this.RoleData = res.data;
        this.loading = false;
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
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
  // padding: 24px;
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
}
</style>