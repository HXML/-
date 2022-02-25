<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">添加运费模板</div>
    </div>
    <el-divider></el-divider>
    <!-- 列表 -->
    <div class="comment_content">
      <div class="comment_content_box">
        <div class="bottom">
          <div
            class="Item"
            v-for="(item,index) in tableData"
            :key="index"
            style="margin-bottom: 1vw;"
          >
            <div class="Item_nav flex aic">
              <div class="ml-40">{{item.tmpName}}</div>
              <div class="ml-40">创建时间：{{item.creatorDate}}</div>
              <div class="ml-40">
                <span
                  class="ml-8"
                  style="color:#0D69C5;   cursor: pointer;"
                  @click="ExpCopy(item.id)"
                >复制模板</span>
              </div>
              <div class="ml-40 fright">
                <span
                  class="ml-8"
                  style="color:#0D69C5;   cursor: pointer;"
                  @click="expEdit(item.id)"
                >修改</span>
                <span
                  class="ml-8"
                  style="color:#0D69C5;   cursor: pointer;"
                  @click="deleteExp(item.id,index)"
                >删除</span>
              </div>
            </div>
            <div class="flex jc-sb" style="border-bottom:1px solid #E8E8E8; ">
              <el-table
                ref="filterTable"
                v-if="item.calcCostType==2"
                :data="item.expDelSub"
                style="width: 100%;"
              >
                <el-table-column prop="province" label="运送到">
                  <template slot-scope="scope">
                    <div class="flex aic">{{ scope.row.province}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="首重（kg）">
                  <template slot-scope="scope">
                    <!-- <span>{{scope.row.number}}</span>
                    <i class="ml-8 el-icon-edit"></i>-->
                    <div class="flex aic">{{ scope.row.firstWeight}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="firstWeightPrice" label="运费（kg）"></el-table-column>
                <el-table-column prop="coniWeight" label="续重（kg）"></el-table-column>
                <el-table-column prop="coniWeightPrice" label="运费（kg）"></el-table-column>
              </el-table>

              <el-table ref="filterTable" v-else :data="item.expDelSub" style="width: 100%;">
                <el-table-column prop="province" min-width="120px" label="运送到">
                  <template slot-scope="scope">
                    <div class="flex aic">{{ scope.row.province}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="首件（件）">
                  <template slot-scope="scope">
                    <!-- <span>{{scope.row.number}}</span>
                    <i class="ml-8 el-icon-edit"></i>-->
                    <div class="flex aic">{{ scope.row.firstUnit}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="firstPrice" label="运费（件）"></el-table-column>
                <el-table-column prop="coniUnit" label="续件（件）"></el-table-column>
                <el-table-column prop="coniPrice" label="运费（件）"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Form -->
  </div>
</template>




<style lang="scss" scoped>
.goods {
  margin: 16px 260px;
}
.el-breadcrumb {
  margin-bottom: 6px;
  height: 26px;
  line-height: 26px;
  padding-left: 24px;
  background-color: #ffffff;
}

.activBread {
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #0d69c5 !important;
  }
}
</style>
<script>
import { ExpListAPI, ExpdeleteAPI, ExpCopyAPI } from "@/api/settingAPI";

export default {
  data() {
    return {
      CODE: 0,
      tableData: [],
    };
  },
  methods: {
    confirmSelect() {
      this.$router.push({ path: "../ExpressTemsetAdd", query: { ids: 0 } });
    },
    expEdit(id) {
      this.$router.push({ path: "../ExpressTemsetAdd", query: { ids: id } });
    },
    getList() {
      ExpListAPI("", "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.tableData = res.data;
      });
    },
    deleteExp(expId, index) {
      this.$confirm("此操作将删除当前点击模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            expId: expId,
          };

          ExpdeleteAPI(data, "delete").then((res) => {
            if (res.code == 1) {
              this.$message({
                message: "恭喜你，删除成功!",
                type: "success",
              });
              this.tableData.splice(index, 1);
            } else {
              this.$message.error(res.msg);
              return;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    ExpCopy(expId) {
      this.$confirm("此操作将复制所选中的模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            expId: expId,
          };
          ExpCopyAPI(data, "get").then((res) => {
            this.$message({
              message: "恭喜你，复制成功!",
              type: "success",
            });

            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消复制模板",
          });
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
/deep/ .el-input__icon {
  line-height: 32px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}
.goodType {
  color: #b1b6c3;
  font-size: 10px;
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
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.ml-40 {
  margin-left: 40px;
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
    margin-left: 20px;
    width: 148px;
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
  .comment_content {
    margin-top: 20px;
    .comment_content_box {
      width: 100%;
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
            height: 32px;
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
}
.fright {
  float: right;
}
</style>