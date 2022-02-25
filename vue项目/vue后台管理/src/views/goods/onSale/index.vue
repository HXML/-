<template>
  <errorPage v-if="CODE === 101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="商品名称：" label-width="110px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.name"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品类目：" label-width="110px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.type"
          class="w-164"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品编码：" label-width="110px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.no"
          class="w-164"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label=" 店铺中分类：" label-width="110px" prop="name">
        <el-cascader
          v-model="sType"
          class="w-164"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="价格：" label-width="110px" prop="name">
        <el-input placeholder="0" v-model="ruleForm.name" style="width:127px; margin-right:10px"></el-input>至
        <el-input placeholder="0" v-model="ruleForm.name" style="width:127px; margin-left:10px"></el-input>
      </el-form-item>-->
      <el-form-item label="销量：" label-width="110px" prop="name">
        <el-input
          class="w-64"
          placeholder="0"
          v-model="pageData.minBuyN"
          style="width: 127px"
          maxlength="6"
        ></el-input>
        <span class="mr-8 ml-8">至</span>
        <el-input
          class="w-64"
          placeholder="0"
          v-model="pageData.maxBuyN"
          style="width: 127px"
          maxlength="6"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">
        确认筛选
      </div>
      <span
        :class="
          pageData.name !== '' ||
          pageData.type !== '' ||
          pageData.no !== '' ||
          pageData.sType !== '' ||
          pageData.minBuyN !== '' ||
          pageData.maxBuyN !== ''
            ? 'clearCondition_active pointer'
            : 'clearCondition pointer'
        "
        @click="clearAllInput"
        >清空筛选条件</span
      >
    </div>
    <!-- 列表 -->
    <el-table
      ref="filterTable"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column min-width="240px" prop="goodsName" label="商品名称">
        <template slot-scope="scope">
          <div class="flex aic">
            <el-checkbox
              v-model="scope.row.checked"
              @change="handleCheckedChange"
            ></el-checkbox>
            <div class="flex jc-fs ml-8 pointer" :title="scope.row.goodsName">
              <div class="wfc" style="height: 70px; width: 70px">
                <el-image
                  :preview-src-list="[
                    scope.row.mainImg + '?x-oss-process=style/b4',
                  ]"
                  style="height: 70px; width: 70px"
                  :src="scope.row.mainImg + '?x-oss-process=style/n4'"
                  alt
                />
              </div>
              <div class="ml-8 title">{{ scope.row.goodsName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格">
        <template slot-scope="scope">
          <div class="flex aic">
            <span>¥</span>
            {{ scope.row.price }}
            <i @click="Editprice(scope.row.id)" class="ml-8 el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stockQty" label="库存">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.number}}</span>
          <i class="ml-8 el-icon-edit"></i>-->
          <div class="flex aic">
            {{ scope.row.stockQty }}
            <i @click="EditNum(scope.row.id)" class="ml-8 el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="buyNum" label="总销量"></el-table-column>
      <el-table-column prop="upShelfTime" label="发布时间"></el-table-column>
      <el-table-column prop="creatorDate" label="创建时间">
        <template slot-scope="scope">
          <div class="flex2 operation">
            <div>{{ scope.row.creatorDate }}</div>
            <div class="onSaleing">出售中</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <div class="flex2 operation">
            <span @click="handleEditGood(scope.row)" type="text" size="small"
              >编辑商品</span
            >
            <span type="text" @click="offlGood(scope.row.id)" size="small"
              >立即下架</span
            >
            <span type="text" size="small" @click="CpyeGoodsUrl(scope.row.id)"
              >复制链接</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic xiajia">
      <div>
        <el-checkbox v-model="pageAllChecked" @click.native="handleAllChecked()"
          >全选</el-checkbox
        >
        <el-button @click="offlGood()">商品下架</el-button>
      </div>
      <!-- 分页 -->
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
    <el-dialog :title="formTtitle" :visible.sync="dialogFormVisible">
      <div class="diaLogContent">
        <div class="content_header flex aic">
          <span>商品标题：</span>
          <p>{{ this.dialogTable.goodsName }}</p>
        </div>
        <div class="content_header flex aic" style="margin: 7px 0 7px 0">
          <span>显示价格：</span>
          <div v-if="formTtitle == '编辑库存'" class="flex aic">
            ¥{{ dialogTable.goodsPrice }}
          </div>
          <div v-else>
            <el-input v-model="dialogTable.goodsPrice" />
          </div>
          <!-- <el-input v-model="dialogTable.goodsPrice" style="max-width: 200px;" /> -->
        </div>
        <el-table :data="dialogTable.skuList" height="250" style="width: 100%">
          <el-table-column prop="skuName" label="颜色分类"></el-table-column>
          <el-table-column prop="stock" label="库存" width="180">
            <template slot-scope="scope">
              <div v-if="formTtitle == '编辑价格'" class="flex aic">
                {{ scope.row.stock }}
              </div>
              <div v-else>
                <el-input v-model="scope.row.stock" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="售价">
            <template slot-scope="scope">
              <div v-if="formTtitle == '编辑库存'" class="flex aic">
                {{ scope.row.price }}
              </div>
              <div v-else>
                <el-input v-model="scope.row.price" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogComfirm">确 定</el-button>
      </div>
    </el-dialog>
    <textarea
      style="position: absolute; top: 0; left: 0; opacity: 0; z-index: -10"
      id="CopyBox"
    ></textarea>
  </div>
</template>

<script>
import {
  GetS_API,
  ShopCateListAPI,
  GetSkuAPI,
  IsShelfAPI,
  EditP_API,
  EditS_API,
  GetGoodsDtailUrlAPI,
} from "@/api/goodsManage";
export default {
  data() {
    return {
      currentPage: 1,
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
          pagesize: 4, // 每页显示条目个数，支持 .sync 修饰符
        },
      },
      // form表单
      dialogFormVisible: false,
      formTtitle: "编辑价格",
      // form表单
      sType: [], //假的
      pageData: {
        pIndx: 1,
        pSize: 4,
        name: "", //商品名称：
        no: "", //商品编码：
        type: "",
        minBuyN: "",
        maxBuyN: "",
        sType: "", //商铺内分类
      },
      ruleForm: {
        name: "",
        region: "",
      },
      tableData: [], //外层表格
      dialogTable: [], //弹窗表格
      GoodsDtailUrl: "",
    };
  },
  methods: {
    handleEditGood(row) {
      // 点击编辑商品
      console.log(row.id);
      this.$router.push({
        name: "releaseComponet",
        query: {
          id: row.id,
        },
      });
    },
    handleChange(val) {
      console.log(val[1], "aaa");
      this.pageData.sType = val[1];
    },
    handleDialogComfirm() {
      //弹出层的确认按钮
      this.dialogFormVisible = false;
      let newList = this.dialogTable.skuList.map((item) => {
        if (this.formTtitle == "编辑价格") {
          return {
            SkuID: Number(item.skuID),
            Price: Number(item.price),
          };
        } else {
          return {
            SkuID: Number(item.skuID),
            Stock: Number(item.stock),
          };
        }
      });
      if (this.formTtitle == "编辑价格") {
        let postData = {
          Json: JSON.stringify(newList),
          GoodsPrice: Number(this.dialogTable.goodsPrice),
        };
        EditP_API(this.dialogTable.id, postData, "put").then((res) => {
          console.log(res, "ressssssssss");
          if (res.code == 1) {
            this.getList();
          }
        });
      } else {
        let postData = {
          Json: JSON.stringify(newList),
        };
        EditS_API(this.dialogTable.id, postData, "put").then((res) => {
          console.log(res, "ressssssssss");
          if (res.code == 1) {
            this.getList();
          }
        });
      }
    },
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
    Editprice(id) {
      //jiage
      this.priceEdit = true;
      this.dialogFormVisible = true;
      this.formTtitle = "编辑价格";
      console.log(id, "id");
      let data = {
        id,
      };
      GetSkuAPI(data, "get").then((res) => {
        //给对象加属性
        let targetOBJ = {};
        let score = data;
        this.dialogTable = Object.assign({}, res.data, data);
      });
    },

    EditNum(id) {
      //kucun
      this.dialogFormVisible = true;
      this.numEdit = true;
      this.formTtitle = "编辑库存";

      let data = {
        id,
      };
      GetSkuAPI(data, "get").then((res) => {
        console.log(res);
        this.dialogTable = res.data;
        this.dialogTable = Object.assign({}, res.data, data);
      });
    },
    offlGood(idString) {
      //下架选中的商品
      console.log(idString, "idstinr");
      if (idString) {
        let data = {
          shelf: 1, // shelf1下架 shelf2上架
        };
        console.log(idString);
        this.$confirm("此操作将下架该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            IsShelfAPI(idString, data, "put").then((res) => {
              if (res.code != 1) {
                this.$message.error(res.msg);
                return;
              }
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "下架成功!",
                });
              }
              this.getList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        let ids = [];
        let listID = this.tableData.forEach((item) => {
          if (item.checked) {
            ids.push(item.id);
          }
        });
        let data = {
          shelf: 1, // shelf1下架 shelf2上架
        };
        if (ids.length <= 0) {
          this.$message({
            type: "info",
            message: "请先选择商品",
          });
          return;
        }
        let idsString = ids.join(",");
        console.log(idsString);

        this.$confirm("此操作将下架所选中的商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            IsShelfAPI(idsString, data, "put").then((res) => {
              console.log(res);
              this.getList();
            });
            this.$message({
              type: "success",
              message: "下架成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    confirmSelect() {
      //获取到节点上面的val
      this.getList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageData.pSize = val;
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
      GetS_API(this.pageData, "get")
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
        pIndx: 1,
        pSize: 4,
        name: "", //商品名称：
        no: "", //商品编码：
        type: "",
        minBuyN: "",
        maxBuyN: "",
        sType: "", //商铺内分类
      };
      this.sType = [];
      this.getList();
    },
    //查询商品详情地址
    GetGoodsDtailsUrl() {
      GetGoodsDtailUrlAPI("get").then((res) => {
        console.log(res);
        this.GoodsDtailUrl = res.data;
      });
    },
    CpyeGoodsUrl(GoodsId) {
      var input = document.getElementById("CopyBox");
      input.value = this.GoodsDtailUrl.dictValue + GoodsId; // 商品详情地址加上商品id
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功!",
      });
    },
  },
  mounted() {
    this.getList();
    ShopCateListAPI().then((res) => {
      console.log(res);
      this.options = res.data;
    });
    this.GetGoodsDtailsUrl();
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
  // min-height: 786px;
  padding: 24px 24px 0 24px;
  background-color: #ffffff;
  .onSaleing {
    color: #219541;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .title {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: fit-content;
    // width: 240px;
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