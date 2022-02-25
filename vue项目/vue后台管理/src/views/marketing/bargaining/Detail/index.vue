<template>
  <errorPage v-if="CODE === 101" />
  <div class="bargaining" v-else>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="100px"
    >
      <el-form-item label="活动名称：" prop="actName">
        <el-input
          maxlength="10"
          placeholder="请输入十字以内"
          class="w-400"
          v-model="formData.actName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="活动时间："
        prop="timer"
        :rules="{
          required: true,
          message: '活动时间不能为空',
          trigger: 'blur',
        }"
      >
        <el-date-picker
          class="w-400"
          @change="confirmDate"
          v-model="formData.timer"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="砍价商品：">
        <el-link
          v-if="!goodName"
          @click="getAllGoods"
          :underline="false"
          type="primary"
          >选择商品</el-link
        >
        <span>{{ goodName }}</span>
        <el-link
          class="ml-16"
          v-if="goodName"
          :underline="false"
          @click="getAllGoods"
          type="primary"
          >更换商品</el-link
        >
      </el-form-item>
      <el-form-item label="商品设置：" prop="activeSetting">
        <div v-if="tableData.length !== 0">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column
              v-for="item in tableColumnList"
              :key="item.prop"
              :label="item.propName"
              :property="item.prop"
            >
              <template slot="header">{{ item.placeholder }}</template>
              <template slot-scope="scope">
                <div
                  v-if="
                    item.prop == 'shopCode' ||
                    item.prop == 'barCode' ||
                    item.prop == 'price' ||
                    item.prop == 'stockQty'
                  "
                >
                  <span type="number" min="0">{{
                    scope.row[scope.column.property]
                  }}</span>
                </div>
                <el-input-number
                  v-else-if="item.prop == 'actPrice'"
                  class="w-80"
                  v-model="scope.row[scope.column.property]"
                  :min="0.01"
                  :max="Number(scope.row.price)"
                  :controls="false"
                  :precision="2"
                ></el-input-number>
                <el-input-number
                  v-else-if="item.prop == 'actStockQty'"
                  class="w-80"
                  v-model="scope.row[scope.column.property]"
                  :min="0"
                  :max="Number(scope.row.stockQty)"
                  :controls="false"
                  :precision="0"
                ></el-input-number>
                <div v-else>
                  {{
                    scope.row[scope.column.property] &&
                    scope.row[scope.column.property].OptName
                  }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="砍价方式：" prop="activeSetting">
        <div class="flex2">
          <el-radio v-model="formData.actType" :label="1">
            每次砍掉
            <el-input-number
              class="w-120"
              v-model="formData.fixedPrice"
              :min="0.01"
              :controls="false"
              :precision="2"
            ></el-input-number>
            元 <span class="tips">砍掉的价格最好小于活动价格</span>
          </el-radio>
          <el-radio v-model="formData.actType" :label="2" class="mt-20">
            随机砍掉
            <el-input-number
              @blur="changePrice"
              class="w-120"
              v-model="formData.minPrice"
              :min="0.01"
              :controls="false"
              :precision="2"
              placeholder="最小值"
            ></el-input-number>
            -
            <el-input-number
              @blur="changePrice"
              class="w-120"
              v-model="formData.maxPrice"
              :min="formData.minPrice + 0.01"
              :controls="false"
              :precision="2"
              placeholder="最大值"
            ></el-input-number>
            元
          </el-radio>
        </div>
      </el-form-item>
      <el-form-item label="活动预热：">
        <el-radio v-model="formData.isHost" :label="1">开启</el-radio>
        <el-radio v-model="formData.isHost" :label="0">关闭</el-radio>
        <el-select
          v-if="formData.isHost == 1"
          v-model="formData.hostHour"
          placeholder="请选择"
        >
          <el-option label="24" :value="24"></el-option>
          <el-option label="36" :value="36"></el-option>
          <el-option label="48" :value="48"></el-option>
          <el-option label="72" :value="72"></el-option>
        </el-select>
        <span v-if="formData.isHost == 1">小时</span>
        <span v-if="formData.hostHour && formData.isHost == 1" class="tips"
          >开启后.商品详情页在活动开始前{{
            formData.hostHour
          }}小时，展示未开始的拼团活动，但活动开始前用户无法拼团购买</span
        >
      </el-form-item>
    </el-form>
    <div class="fcc mt-120">
      <div class="flex aic">
        <span class="pointer btn_back" @click="$router.go(-1)">返回</span>
        <span
          v-if="cheackState == 'Edit' || cheackState == ''"
          @click="submitForm('formData')"
          class="pointer btn_create"
          >{{ this.cheackState == "Edit" ? "保存活动" : "创建活动" }}</span
        >
      </div>
    </div>
    <!-- <el-dialog
      title="选择商品"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="50%"
    >
      <el-radio-group v-model="GoodIndex" class="flex fw">
        <el-radio
          :title="good.goodsName"
          :label="index"
          v-for="(good, index) in goodsList"
          :key="good.id"
          :disabled="good.isUseAct == 1"
          >{{ good.goodsName }}</el-radio
        >
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancled">取 消</el-button>
        <el-button type="primary" @click="diaLogConfirm">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="选择产品" :visible.sync="dialogVisible">
      <div class="flex aic">
        <div class="flex aic mr-30">
          <span>商品名称：</span>
          <el-input
            placeholder="请输入商品名称"
            class="w-140"
            v-model="pagination.goodsName"
          ></el-input>
        </div>
        <div class="flex aic mr-30">
          <span>商品编码：</span>
          <el-input
            placeholder="请输入商品编码"
            class="w-140"
            v-model="pagination.goodsSpu"
          ></el-input>
        </div>
        <!-- <span></span> -->
        <el-button @click="searchGood">搜索</el-button>
      </div>
      <el-divider></el-divider>
      <div>
        <div class="scroll" @scroll="scrollEvent">
          <el-radio-group v-model="GoodIndex">
            <el-radio
              v-for="(good, index) in goodsList"
              :key="index"
              :label="index"
              :disabled="good.isUseAct == 1"
              class="flex aic"
            >
              <el-image
                class="el_IMG"
                style="width: 5vw; height: 5vw"
                :src="good.imgUrl + '?x-oss-process=style/n3'"
                fit="cover"
              ></el-image>
              <div class="overflow450 ml-30" :title="good.goodsName">
                {{ good.goodsName }}
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancled">取 消</el-button>
        <el-button type="primary" @click="diaLogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetShopGoodsByNameAPI,
  InsertActBarginirgAPI,
  EditActBarginirgAPI,
  GetGoodsSkuAPI,
  GetShopGoodsAPI,
  GetActBargainirgAPI,
} from "@/api/activityApi";
export default {
  data() {
    return {
      CODE: 0,
      pagination: {
        pindx: 1,
        psize: 6,
        goodsName: "",
        goodsSpu: "",
      },

      total: 0,
      isFinished: false,
      isReachBottom: false,
      reachBottomDistance: 100,
      scrollHeight: 0,
      offsetHeight: 0,

      tableData: [], //
      dialogVisible: false, //
      actId: null, //活动id
      cheackState: "",
      GoodIndex: null, //过渡选中
      goodsList: [], //店铺所有商品
      selectGoodIndex: null, //最后选中的商品
      formData: {
        actName: "", //活动名称
        startTime: "", //开始时间
        endTime: "", //结束时间
        isHost: 1, //是否预热
        hostHour: 24, //预热小时数
        goodsId: null, //商品id
        actType: 1, //活动类型 1是固定2是随机
        fixedPrice: 0, //固定砍金额
        maxPrice: 0, //随机砍最大金额
        minPrice: 0, //随机砍最小金额
        skuGoods: [], //sku列表
      },
      rules: {
        actName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        fixedPrice: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  computed: {
    goodName: function () {
      if (this.selectGoodIndex) {
        return this.goodsList[this.selectGoodIndex].goodsName;
      } else {
        return this.formData.goodsName;
      }
    },
  },
  methods: {
    searchGood() {
      //弹窗搜索
      this.pagination.pindx = 1;
      this.isFinished = false;
      this.goodsList = [];
      console.log(this.pagination, "this.pagination");
      this.getMoreGoods();
    },
    scrollEvent(e) {
      //下拉加载
      let scrollTop = e.target.scrollTop;
      let scrollHeight = e.target.scrollHeight;
      let offsetHeight = Math.ceil(e.target.getBoundingClientRect().height);
      let currentHeight = scrollTop + offsetHeight + this.reachBottomDistance;
      if (currentHeight < scrollHeight && this.isReachBottom) {
        this.isReachBottom = false;
      }
      if (this.isReachBottom) {
        return;
      }
      if (currentHeight >= scrollHeight) {
        console.log("触底");
        this.isReachBottom = true; //数据加载完成之后
        this.getMoreGoods();
      }
    },
    getAllGoods(type) {
      this.dialogVisible = true;
      this.getMoreGoods(type); //加载数据
    },
    getMoreGoods() {
      if (this.isFinished) {
        return;
      }
      let data = {
        pindx: this.pagination.pindx++,
        psize: this.pagination.psize,
        goodsName: this.pagination.goodsName,
        goodsSpu: this.pagination.goodsSpu,
      };
      GetShopGoodsByNameAPI(data)
        .then((res) => {
          // console.log(res, "resssss");
          if (res.data.rows.length > 0) {
            this.total = res.data.total;
            this.goodsList.push(
              ...res.data.rows.map((item) => {
                return {
                  skuList: [],
                  isUseAct: item.isUseAct,
                  isMian: 1,
                  goodsId: item.id,
                  goodsName: item.goodsName,
                  skuId: 0,
                  price: item.price,
                  packagePrice: item.price,
                  packageNum: item.packageNum,
                  imgUrl: item.mainImg,
                };
              })
            );
          }
        })
        .then(() => {
          // 数据全部加载完成
          if (this.goodsList.length === this.total) {
            this.isFinished = true;
          }
        });
    },
    changePrice(e) {
      //换值
      if (this.formData.minPrice > this.formData.maxPrice) {
        var temp = this.formData.minPrice;
        this.formData.minPrice = this.formData.maxPrice;
        this.formData.maxPrice = temp;
      }
    },
    getAttrClomes(list) {
      //获取属性列表
      let newTableColumn = list.map((item) => {
        // console.log(item);
        return Object.assign({}, item, {
          placeholder: item.propName,
          selectOption: [],
          selectValue: "",
          isInputed: false,
        });
      });
      let arr = [
        {
          prop: "shopCode",
          propName: "商家编码",
          placeholder: "商家编码", ///sku
          inputVal: "",
          isInputed: false,
        },
        {
          prop: "barCode",
          inputVal: "",
          propName: "商品条形码",
          placeholder: "商品条形码",
          isInputed: false,
        },

        {
          prop: "price",
          propName: "价格",
          placeholder: "价格(元)",
          inputVal: "",
          isInputed: true,
        },
        {
          prop: "stockQty",
          propName: "数量(件)",
          placeholder: "数量",
          inputVal: "",
          isInputed: true,
        },
        {
          prop: "actPrice", //活动价格
          propName: "价格",
          placeholder: "活动低价(元)",
          inputVal: "",
          isInputed: true,
        },
        {
          prop: "actStockQty", //活动数量
          propName: "数量",
          placeholder: "活动数量(件)",
          inputVal: "",
          isInputed: true,
        },
      ];
      return [
        {
          prop: "colorClassify",
          propName: "颜色",
          placeholder: "颜色", ///sku
          inputVal: "",
          isInputed: false,
        },
        ...newTableColumn,
        ...arr,
      ];
    },
    getBackstageData() {
      //将数据格式处理为后台的
      console.log(this.tableData, "this.tableData");
      let SkuList = [];
      this.tableData.forEach((item) => {
        let obj = {
          OptList: [],
        };
        for (let i in item) {
          // console.log(i, "qqqq");
          if (
            i == "price" ||
            i == "stockQty" ||
            i == "shopCode" ||
            i == "barCode" ||
            i == "actPrice" ||
            i == "actStockQty" ||
            i == "id"
          ) {
            console.log(item, "itemitem");
            obj.price = Number(item.price);
            obj.id = Number(item.id);
            obj.stockQty = Number(item.stockQty);
            obj.shopCode = item.shopCode;
            obj.barCode = item.barCode;
            obj.actPrice = Number(item.actPrice);
            obj.actStockQty = Number(item.actStockQty);
          } else {
            if (i !== "OptList") {
              obj.OptList.push(item[i]);
            }
          }
        }
        SkuList.push(obj);
      });
      this.formData.skuGoods = SkuList;
    },
    getDataListFromback(list) {
      //根据后台的数据转回到datalist
      let FinalArryA = list.map((item) => {
        console.log(item, "listlistlist");
        return {
          id: item.id,
          price: item.price,
          stockQty: item.stockQty,
          shopCode: item.shopCode,
          actPrice: item.actPrice,
          actStockQty: item.actStockQty,
          barCode: item.barCode,
          OptList: item.optList
            ? item.optList.map((item) => {
                let obj = {};
                obj[item.tableName] = {
                  propertyId: item.propertyId,
                  optId: item.optId,
                  OptName: item.optName,
                };
                return obj;
              })
            : [],
        };
      });
      let FinalArryB = FinalArryA.map((item) => {
        console.log(item, "itemitem");
        let ArrayB = {};
        ArrayB.price = Number(item.price);
        ArrayB.actPrice = Number(item.actPrice);
        ArrayB.actStockQty = Number(item.actStockQty);
        ArrayB.id = Number(item.id);
        ArrayB.stockQty = String(item.stockQty);
        ArrayB.barCode = String(item.barCode);
        ArrayB.shopCode = item.shopCode;
        return Object.assign({}, ArrayB, ...item.OptList);
      });
      console.log(FinalArryB, "FinalArryBFinalArryB");
      return FinalArryB;
    },
    cancled() {
      this.GoodIndex = this.selectGoodIndex;
      this.dialogVisible = false;
    },
    diaLogConfirm() {
      this.selectGoodIndex = this.GoodIndex;
      let GoodsID = this.goodsList[this.selectGoodIndex].goodsId;
      this.formData.goodsId = this.goodsList[this.selectGoodIndex].goodsId;
      let postData = {
        GoodsID: GoodsID,
      };
      GetGoodsSkuAPI(postData, "get").then((res) => {
        console.log(res, "ressss");
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "warning",
          });
          this.selectGoodIndex = null;
          this.tableData = [];
          return;
        }
        this.tableData = this.getDataListFromback(res.data.skuGoods); //获取表格数据
        this.tableColumnList = this.getAttrClomes(res.data.propTableList); //获取属性列表
        this.dialogVisible = false;
        // console.log(this.tableColumnList, this.tableData, "tableDatatableData");
      });
    },
    confirmDate(e) {
      console.log(e, "eeee");
      if (e) {
        this.formData.startTime = e[0];
        this.formData.endTime = e[1];
      }
    },
    getAcInfor(id) {
      let data = {
        ActId: id,
      };
      GetActBargainirgAPI(data, "get").then((res) => {
        // console.log(res, "resss");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.formData = res.data;
        this.formData.timer = [res.data.startTime, res.data.endTime];
        this.tableColumnList = this.getAttrClomes(res.data.propTableList); //获取属性列表
        this.tableData = this.getDataListFromback(res.data.skuGoods);
      });
    },
    createActivity() {
      this.getBackstageData();
      var newData = Object.assign(this.formData, {
        actId: Number(this.actId),
      });
      var formData = new FormData();
      if (this.cheackState == "Edit") {
        formData.append("json", JSON.stringify(newData));
        EditActBarginirgAPI(formData, "put").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "编辑成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "bargaining",
                });
              },
            });
          } else {
            this.$message({
              duration: 1000,
              message: res.msg,
              type: "error",
            });
          }
        });
      } else {
        // console.log(this.formData,"this.formData")
        formData.append("json", JSON.stringify(this.formData));
        InsertActBarginirgAPI(formData, "post").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "创建成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "bargaining",
                });
              },
            });
          } else {
            this.$message({
              duration: 1000,
              message: res.msg,
              type: "error",
            });
          }
        });
      }
    },
    submitForm(formName) {
      // console.log(this.$refs[formName].validate, "formName");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formData.skuGoods, "this.formData.skuGoods");
          // if (this.formData.skuGoods.length !== 0) {
          //   alert("submit!");
          //   return;
          // }
          this.createActivity();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  created() {
    // console.log(this.$route.query);
    if (this.$route.query.id) {
      this.actId = this.$route.query.id;
      this.getAcInfor(this.$route.query.id);
      this.cheackState = this.$route.query.type;
    }
  },
};
</script>
<style lang="scss" scoped>
.bargaining {
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffff;
  .el-radio {
    margin: 4px;
  }
  /deep/ .el-dialog {
    .scroll {
      height: 20vw;
      overflow-y: auto;
    }
    .overflow450 {
      width: 450px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-radio-group {
      display: flex;
      flex-direction: column;
    }
    .el-radio {
      margin-bottom: 16px;
    }
    .el-radio__label {
      display: flex;
      align-items: center;
    }
    // .el-radio {
    //   margin: 8px 8px !important;
    //   width: 150px !important;
    //   white-space: nowrap;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    // }
    .el-radio__inner {
      border: 1px solid black !important;
    }
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-range-separator {
    height: 32px;
    line-height: 32px;
    width: fit-content;
  }
  .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  .goodsLists {
    height: 150px;
    width: 100%;
    border: 1px solid #f4f4f4;
  }
  .selectArea {
    width: 200px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #f9f9f9;
    border: 1px solid #7d828f;
  }
  .btn_back {
    width: 200px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 8px;
    font-size: 16px;
    background-color: #f9f9f9;
    border: 1px solid #7d828f;
  }
  .btn_create {
    margin-left: 50px;
    background: #0d69c5;
    width: 200px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 8px;
    font-size: 16px;
    color: #ffffff;
  }
  .tips {
    margin-left: 30px;
    font-size: 12px;
    color: #b1b6c3;
  }
}
</style>