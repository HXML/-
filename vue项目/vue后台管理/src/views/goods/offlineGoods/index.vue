<template>
  <errorPage v-if="CODE === 101" />
  <div class="offlineGoods br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="商品名称：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.gName"
          class="w-164"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品类目：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.gType"
          class="w-164"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品编码：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.gCode"
          class="w-164"
        ></el-input>
      </el-form-item>
      <el-form-item label=" 店铺中分类：" label-width="120px" prop="name">
        <el-cascader
          class="w-164"
          v-model="shopCateId"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="价格：" label-width="120px" prop="name">
        <el-input
          placeholder="0"
          v-model="pageData.fPrice"
          class="w-120 mr-10"
        ></el-input
        >至
        <el-input
          placeholder="0"
          v-model="pageData.lPrice"
          class="w-120 ml-10"
        ></el-input>
      </el-form-item>
      <el-form-item label="销量：" label-width="120px" prop="name">
        <el-input
          placeholder="0"
          v-model="pageData.fBuyNum"
          class="w-120 mr-10"
        ></el-input
        >至
        <el-input
          placeholder="0"
          v-model="pageData.lBuyNum"
          class="w-120 ml-10"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">
        确认筛选
      </div>
      <span
        :class="
          pageData.gName !== '' ||
          pageData.gType !== '' ||
          pageData.gCode !== '' ||
          pageData.fPrice !== '' ||
          pageData.lPrice !== '' ||
          pageData.shopCateId !== '' ||
          pageData.fBuyNum !== '' ||
          pageData.lBuyNum !== ''
            ? 'clearCondition_active pointer'
            : 'clearCondition pointer'
        "
        @click="clearAllInput"
        >清空筛选条件</span
      >
    </div>
    <!-- 列表 -->
    <el-table
      @sort-change="handleChangePrice"
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
            <div class="flex jc-fs ml-8">
              <el-image
                :preview-src-list="[
                  scope.row.mainImg + '?x-oss-process=style/b4',
                ]"
                style="height: 70px; width: 70px"
                :src="scope.row.mainImg + '?x-oss-process=style/s4'"
                alt
              />
              <div class="ml-8 title">{{ scope.row.goodsName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" sortable="custom">
        <template slot-scope="scope">
          <div class="flex aic">
            <span>¥</span>
            {{ scope.row.price }}
            <i @click="Editprice(scope.row.id)" class="ml-8 el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stockQty" label="库存" sortable>
        <template slot-scope="scope">
          <!-- <span>{{scope.row.number}}</span>
          <i class="ml-8 el-icon-edit"></i>-->
          <div class="flex aic">
            {{ scope.row.stockQty }}
            <i @click="EditNum(scope.row.id)" class="ml-8 el-icon-edit"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="buyNum" label="总销量" sortable></el-table-column>

      <el-table-column
        prop="creatorDate"
        label="创建时间"
        sortable
      ></el-table-column>
      <el-table-column prop="downShelfTime" label="下架时间" sortable>
        <template slot-scope="scope">
          <div class="flex2 operation">
            <div>{{ scope.row.downShelfTime }}</div>
            <div class="offlineGoodsing">仓库中</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <div class="flex2 operation">
            <span @click="handleEditGood(scope.row)" type="text" size="small"
              >编辑商品</span
            >
            <span @click="offlGoodOne(scope.row)" type="text" size="small"
              >立即上架</span
            >
            <span type="text" size="small">复制链接</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div>
        <el-checkbox v-model="pageAllChecked" @click.native="handleAllChecked()"
          >全选</el-checkbox
        >
        <el-button @click="offlGood">商品上架</el-button>
        <el-button @click="DelGoods">批量删除</el-button>
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
  </div>
</template>

<script>
import {
  WarehouseGoods_API,
  ShopCateListAPI,
  GetSkuAPI,
  IsShelfAPI,
  EditP_API,
  EditS_API,
  Del_API,
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
      shopCateId: [], //假的
      pageData: {
        pageIndex: 1,
        pageSize: 4,
        gName: "", //商品名称：
        gCode: "", //商品编码：
        gType: "", //商品类型
        oStr: 1, //初始值为0  排序字段 1:价格(PRICE)2:库存(STOCK_QTY)3:销量(BUY_NUM)4:
        oStrType: 1, //初始值为0  排序类型1:Esc顺序 2:Desc倒叙
        fPrice: "", //前价格
        lPrice: "", //后价格
        fBuyNum: "", //前数量
        lBuyNum: "", //后数量
        shopCateId: "", //商铺内分类
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
    offlGoodOne(row) {
      let data = {
        shelf: 2, // shelf1下架 shelf2上架
      };
      IsShelfAPI(row.id, data, "put").then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        } else {
          this.$message({
            type: "success",
            message: "上架成功!",
          });
        }
        this.getList();
      });
    },
    handleChangePrice(val) {
      console.log(val);
    },
    handleChange(val) {
      this.pageData.shopCateId = val[1];
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
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }
          if (res.code == 1) {
            this.getList();
            this.$message({
              message: "恭喜你，修改成功!",
              type: "success",
            });
          }
        });
      } else {
        let postData = {
          Json: JSON.stringify(newList),
        };
        EditS_API(this.dialogTable.id, postData, "put").then((res) => {
          if (res.code == 1) {
            this.getList();
          }
          this.$message({
            message: "恭喜你，修改成功!",
            type: "success",
          });
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
    },
    Editprice(id) {
      //jiage
      this.priceEdit = true;
      this.dialogFormVisible = true;
      this.formTtitle = "编辑价格";
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
        this.dialogTable = res.data;
        this.dialogTable = Object.assign({}, res.data, data);
      });
    },
    offlGood() {
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
        shelf: 2, // shelf1下架 shelf2上架
      };
      let idsString = ids.join(",");
      if (ids.length == 0) {
        return false;
      }
      IsShelfAPI(idsString, data, "put").then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.$message({
          type: "success",
          message: "上架成功!",
        });
        this.getList();
      });
    },
    DelGoods() {
      this.$confirm("此操作将删除所选中的商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
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
          let idsString = ids.join(",");
          Del_API(idsString, "delete").then((res) => {
            if (res.code != 1) {
              this.$message.error(res.msg);
              return;
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
    confirmSelect() {
      //获取到节点上面的val

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
      WarehouseGoods_API(this.pageData, "get")
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
        gCode: "", //商品编码：
        gType: "", //商品类型
        oStr: 1,
        oStrType: 1,
        fPrice: "", //前价格
        lPrice: "", //后价格
        fBuyNum: "", //前数量
        lBuyNum: "", //后数量
        shopCateId: "", //商铺内分类
      };
      this.shopCateId = [];
      this.getList();
    },
  },
  mounted() {
    this.getList();
    ShopCateListAPI().then((res) => {
      this.options = res.data;
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

.offlineGoods {
  padding: 24px 24px 0 24px;
  // min-height: 786px;
  background-color: #ffffff;
  .offlineGoodsing {
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