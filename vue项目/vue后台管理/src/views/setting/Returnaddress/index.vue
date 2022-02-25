<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="fw">
      <!-- 退货列表 -->

      <div class="header">
        <span class="sell_person">退货地址</span>
        <span class="ml-8 pointer" style="color:#0D69C5;" @click="addressadd">
          <i class="el-icon-edit "></i><span>添加退货地址</span>
        </span>
      </div>
      <el-divider></el-divider>
      <el-table ref="filterTable" :data="tableData" style="width: 100%;">
        <el-table-column prop="linkMan" label="联系人">
          <template slot-scope="scope">
            <div class="flex aic">{{ scope.row.linkMan}}</div>
          </template>
        </el-table-column>
        <el-table-column label="所在地区">
          <template slot-scope="scope">
            <!-- <span>{{scope.row.number}}</span>
            <i class="ml-8 el-icon-edit"></i>-->
            <div class="flex aic">{{ scope.row.provinc}}{{ scope.row.city}}{{ scope.row.county}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="returnAddress" label="街道地址"></el-table-column>
        <el-table-column prop="linkTel" label="联系电话"></el-table-column>
        <el-table-column prop="linkMobil" label="联系手机"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div class="flex2 operation">
              <span @click="addressEdit(scope.row.id)" type="text" size="small">编辑</span>
              <span @click="deladrClick(scope.row.id)" type="text" size="small">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 退货添加 -->
      <el-dialog :title="formTtitle" :visible.sync="returnaddress">
        <el-form-item label="联系人：" label-width="120px" prop="linkMan">
          <el-input
            placeholder="请输入"
            v-model="retdate.linkMan"
            style="width:288px; margin-right:20px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" label-width="120px" prop="provinceNo">
          <el-select
            v-model="retdate.provinceNo"
            placeholder="请选择"
            style="width:188px; margin-right:20px"
          >
            <el-option
              v-for="(i,index) in province"
              :key="index"
              @click.native="retselectclick(i.id,i.deep,i.areaName)"
              v-bind:label="i.areaName"
              :value="i.id"
            ></el-option>
          </el-select>

          <el-select
            v-model="retdate.cityNo"
            placeholder="请选择"
            style="width:188px; margin-right:20px"
          >
            <el-option
              v-for="(i,index) in retcity"
              :key="index"
              @click.native="retselectclick(i.id,i.deep,i.areaName)"
              v-bind:label="i.areaName"
              :value="i.id"
            ></el-option>
          </el-select>

          <el-select
            v-model="retdate.countyNo"
            placeholder="请选择"
            style="width:188px; margin-right:20px"
          >
            <el-option
              v-for="(i,index) in retcounty"
              :key="index"
              v-bind:label="i.areaName"
              :value="i.id"
              @click.native="retselectclick(i.id,i.deep,i.areaName)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址:" label-width="120px" prop="name">
          <el-input
            placeholder="请输入"
            v-model="retdate.returnAddress"
            style="width:288px; margin-right:20px"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话：" label-width="120px" prop="name">
          <el-input placeholder="请输入" v-model="telq" style="width:88px; margin-right:10px"></el-input>
          <span>-</span>
          <el-input
            placeholder="请输入"
            v-model="telh"
            style="width:188px; margin-right:20px;margin-left:10px"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系手机：" label-width="120px" prop="name">
          <el-input
            placeholder="请输入"
            v-model="retdate.linkMobil"
            style="width:288px; margin-right:20px"
          ></el-input>
        </el-form-item>
        <el-form-item label="退款说明：" label-width="120px" prop="name">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="retdate.returnRmk"></el-input>
        </el-form-item>

        <div slot="footer" class="dialog-footer">
          <el-button @click="returnaddress = false">取 消</el-button>
          <el-button type="primary" @click="returnAddressAdd()">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  areaAPI,
  SRAAddAPI,
  SRAListAPI,
  ExpEditModelAPI,
  ExpUpdateAPI,
  SRADeleteAPI,
  SRAModelAPI,
  SRAEditAPI
} from "@/api/settingAPI";
import qs from "qs";
export default {
  data() {
    return {
      CODE: 0,
      telq: "", //电话前半段
      telh: "", //电话后半段
      tableData: [], //退货地址列表
      formTtitle: "添加退货地址",
      returnaddress: false, //弹窗
      retdate: {
        //退货地址实体
        id: 0,
        shopId: 0,
        provinceNo: "",
        cityNo: "",
        countyNo: "",
        provinc: "",
        city: "",
        county: "",
        linkMan: "",
        linkTel: "",
        linkMobil: "",
        returnRmk: "",
        isDefault: 0,
        sortIndex: 0,
        returnAddress: "",
        creatorDate: ""
      },
      province: [],
      retprovince: [], //省
      retcity: [], //城市
      retcounty: [], //县
      retaddresspid: 0, //地址父级ID
      retaddresslever: 0
    };
  },

  methods: {
    deladrClick(id) {
      this.$confirm("此操作将删除点击退货地址, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            adrId: id
          };
          SRADeleteAPI(data, "delete").then(res => {
            if (res.code == 1) {
              this.$message({
                message: "恭喜你，删除成功!",
                type: "success"
              });
            } else {
              this.$message.error(res.msg);
              return;
            }
            this.retdateList(); //退回列表
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addressadd() {
      this.returnaddress = true;
      this.retdate = {
        //退货地址实体
        id: 0,
        shopId: 0,
        provinceNo: "",
        cityNo: "",
        countyNo: "",
        provinc: "",
        city: "",
        county: "",
        linkMan: "",
        linkTel: "",
        linkMobil: "",
        returnRmk: "",
        isDefault: 0,
        sortIndex: 0,
        returnAddress: "",
        creatorDate: ""
      };
      this.telq = "";
      this.telh = "";
    },

    retselectclick(pid, lev, name) {
      //退货三级联动点击事件
      if (lev == 0) {
        this.retdate.provinc = name;
      }
      if (lev == 1) {
        this.retdate.city = name;
      }
      if (lev == 2) {
        this.retdate.county = name;
        return;
      }
      this.retaddresspid = pid;
      this.retaddresslever = lev + 1;

      this.retarea();
    },
    retarea() {
      //退货添加地址查询
      var data = {
        pid: this.retaddresspid
      };
      areaAPI(data, "get").then(res => {
        if (this.retaddresslever == 0) {
          //省
          this.province = res.data;

          this.retcity = [];
          this.retcounty = [];
        }
        if (this.retaddresslever == 1) {
          //市
          this.retcity = res.data;
          this.retdate.cityNo = "";
          this.retdate.countyNo = "";
          this.county = [];
        }
        if (this.retaddresslever == 2) {
          //县
          this.retdate.countyNo = "";

          this.retcounty = res.data;
        }
      });
    },
    returnAddressAdd() {
      this.retdate.linkTel = this.telq + "-" + this.telh;
      var data = qs.stringify(this.retdate);
      if (this.retdate.id == 0) {
        //添加退货列表
        SRAAddAPI(data, "post", true).then(res => {
          this.$message({
            message: "恭喜你，添加成功!",
            type: "success"
          });
          this.returnaddress = false;
          this.retdateList(); //退回列表
        });
      } else {
        //修改退货列表
        SRAEditAPI(data, "put", true).then(res => {
          this.$message({
            message: "恭喜你，修改成功!",
            type: "success"
          });
          this.returnaddress = false;
          this.retdateList(); //退回列表
        });
      }
    },
    qxclick() {
      this.$router.go(-1);
    },
    retdateList() {
      //退货地址列表查询
      SRAListAPI("", "get").then(res => {
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.tableData = res.data;
      });
    },
    addressEdit(id) {
      var data = {
        adrId: id
      };
      SRAModelAPI(data, "get").then(res => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }

        this.retdate = res.data;
        var tel = res.data.linkTel.split("-");
        this.telq = tel[0];
        this.telh = tel[1];

        this.editArea(res.data.provinceNo, 1, 2); //通过省的id查到市

        this.editArea(res.data.cityNo, 2, 2); //通过市的id查到县
      });

      this.returnaddress = true;
    },
    area() {
      //模板地址查询
      var data = {
        pid: 0
      };
      areaAPI(data, "get").then(res => {
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.province = res.data;
      });
    },
    editArea(pid, lev, type) {
      //type 等于2是修改退货地址   不传就是修改模板

      var data = {
        pid: pid
      };
      areaAPI(data, "get").then(res => {
        if (type == 2) {
          if (lev == 1) {
            this.retcity = res.data;
          }
          if (lev == 2) {
            this.retcounty = res.data;
          }
        } else {
          if (lev == 1) {
            this.city = res.data;
          }
          if (lev == 2) {
            this.county = res.data;
          }
        }
      });
    }
  },
  mounted() {
    let ids = this.$route.query.ids; //传过来的ID  添加未0
    this.area(); //地址
    if (ids > 0) {
      this.pageData.id = ids;
      this.ExpModel(); //查询模板实体
    }

    this.retdateList(); //退回列表
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input__icon {
  line-height: 32px;
}
.w_800 {
  width: 800px;
}
.w_200 {
  width: 200px;
}
.pnontevent {
  pointer-events: none;
}
.ml_80 {
  margin-left: 80px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}
.goodType {
  color: #b1b6c3;
  font-size: 10px;
}
.mt_30 {
  margin-bottom: 30px;
}

.goodTitle {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
}
.mainTableInfor {
  .over_two {
    width: 250px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
}
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}
.div1 {
  display: inline;
}
.sell_person {
  font-weight: bold;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
  line-height: 19px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.ml-10 {
  margin-left: 10px;
}
.onSale {
  padding:  24px 24px 0 24px;
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
  .span_confirm_active2 {
    margin-left: 20px;
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
  .Heng {
    height: 20px;
    width: 100%;
    background: #e6f0f9;
  }
}
.btn {
  margin-top: 40px;
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 20px, 0px;
  text-align: center;
  margin-bottom: 60px;
}
.comment_content {
  margin-top: 20px;
  .comment_content_box {
    width: 798px;
    .top {
      width: 100%;
      display: flex;
      font-size: 12px;
      color: rgba(33, 33, 33, 1);
      line-height: 16px;
      padding-bottom: 12px;
      .d1 {
        display: flex;
        min-width: 20%;
        text-align: center;
      }
      .d2 {
        display: flex;
        width: 16%;
        text-align: center;
      }
    }
    .bottom {
      width: 100%;
      .Item {
        width: 100%;
        .Item_nav {
          height: 52px;

          width: 100%;
          font-size: 10px;
          color: rgba(74, 80, 96, 1);
          border: 1px solid rgba(238, 238, 238, 1);
          background: rgba(230, 240, 249, 1);
          span {
            padding-left: 20px;
          }
          img {
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }
        }
        .mainInfor {
          width: 70%;
          .d1 {
            width: 80%;
            text-align: center;
          }
          .d2 {
            width: 20%;
          }
          .d3 {
            width: 20%;
          }
          .d4 {
            width: 20%;
          }
        }
      }
    }
  }
}
.wd_30 {
  width: 150px;
}
.el-icon-edit {
  cursor: pointer;
}
</style>