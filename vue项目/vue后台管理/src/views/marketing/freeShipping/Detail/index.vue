<template>
  <errorPage v-if="CODE === 101" />
  <div class="limitDiscount" v-else>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="100px"
      class="demo-formData"
    >
      <el-form-item label="活动名称：" prop="actName">
        <el-input
          show-word-limit
          maxlength="10"
          placeholder="请输入十字以内"
          class="w-400"
          v-model="formData.actName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="开始时间："
        prop="startTime"
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
      <el-form-item label="活动商品：" prop="isAllShop">
        <div>
          <el-radio v-model="formData.isAllShop" :label="0">部分参与</el-radio>
          <el-radio v-model="formData.isAllShop" :label="1">全店参与</el-radio>
          <el-button v-if="formData.isAllShop == 0" @click="getAllGoods"
            >选择参与活动的商品({{ checkGoods.length }})</el-button
          >
        </div>
        <div v-if="formData.isAllShop == 0" class="flex fw">
          <!-- {{checkGoods}} -->
          <div class="mr-20" v-for="(good, index) in checkGoods" :key="index">
            {{ good.goodsName }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="活动设置：" prop="activeSetting">
        <section class="mb-16">
          买家消费满
          <el-input-number
            class="w-120"
            v-model="formData.buyPrice"
            :min="0"
            :controls="false"
            :precision="2"
          ></el-input-number>
          元，同时满
          <el-input-number
            class="w-120"
            v-model="formData.buyNum"
            :min="0"
            :controls="false"
            :precision="0"
          ></el-input-number>
          件
        </section>
        <div class="flex2">
          <el-radio class="mb-16" v-model="formData.freeType" :label="2">
            满减
            <el-input-number
              class="w-120"
              v-model="formData.discountsPrice"
              :min="0"
              :controls="false"
              :precision="2"
            ></el-input-number>
            元
          </el-radio>
          <div class="flex2">
            <el-radio v-model="formData.freeType" :label="1"
              >包邮
              <el-button @click="showAddDialog">选择包邮地区</el-button>
            </el-radio>
            <div class="flex" v-if="formData.freeType == 1">
              <span v-for="(item, index) in formData.Province" :key="index"
                >{{ item.name }}，</span
              >
            </div>
          </div>
        </div>
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

    <!-- 选择参与活动的商品弹窗 -->
    <el-dialog id="Srcoll" title="选择产品" :visible.sync="dialogVisible">
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
      <el-checkbox-group v-model="checkGoods" @change="changeGroup">
        <div class="scroll" @scroll="scrollEvent">
          <div class="flex aic" v-for="good in goodsList" :key="good.id">
            <el-checkbox
              :disabled="good.isUseAct == 1"
              :label="good"
              class="flex aic"
            >
              <el-image
                class="el_IMG"
                style="width: 5vw; height: 5vw"
                :src="good.mainImg + '?x-oss-process=style/n3'"
                fit="cover"
              ></el-image>
              <span>{{ good.goodsName }}</span>
            </el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancled">取 消</el-button>
        <el-button type="primary" @click="diaLogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择地址的弹窗 -->
    <el-dialog
      title="选择地区"
      :visible.sync="tempaddress"
      :close-on-click-modal="false"
    >
      <addressTemplate @confirmsg="confirmsg" />
    </el-dialog>
  </div>
</template>

<script>
import {
  InsertFreePostAPI,
  GetShopGoodsByNameAPI,
  GetGoodsSkuAPI,
  EditFreePostAPI,
  GetActFrePostDetaiAPI,
} from "@/api/activityApi";
import addressTemplate from "@/components/addressTemplate";
export default {
  data() {
    return {
      CODE: 0,
      tempaddress: false, //
      tableData: [], //
      dialogVisible: false, //
      actId: null, //活动id
      cheackState: "",
      GoodIndex: null, //过渡选中
      checkGoods: [],
      goodsList: [], //店铺所有商品
      selectGoodIndex: null, //最后选中的商品
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

      formData: {
        goodsIds: 0,
        isAllShop: 0, //是否全店参与
        buyPrice: 0, //金额限制
        buyNum: 0, //数量限制
        discountsPrice: 0, //优惠金额   满减时必填
        actName: "", //活动名称
        startTime: "", //开始时间
        endTime: "", //结束时间
        freeType: 2, //1是包邮  2是满减
        Province: [], //Province
      },
      rules: {
        actName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        startTime: [{ required: true, message: "请输入", trigger: "blur" }],
        isAllShop: [{ required: true, message: "请输入", trigger: "blur" }],
        isHost: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  components: {
    addressTemplate,
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
    confirmsg(checklist) {
      this.tempaddress = false;
      this.formData.Province = checklist;
      console.log(checklist, "checklist");
    },
    deleteGood(good) {
      let ClearIndex = this.checkGoods.findIndex((item, i) => {
        console.log(item.id, "item.goodsId");
        return item.id == good.goodsId;
      });
      this.formData.TimeGoods.splice(ClearIndex, 1);
      this.checkGoods.splice(ClearIndex, 1);
    },
    getActPrice(type, price, rate, disPrice) {
      // console.log(type, "typetype");
      if (type == 1) {
        return (price * (Number(rate) / 10)).toFixed(2);
      } else {
        return (price - disPrice).toFixed(2);
      }
    },
    changeGroup(arr) {
      //多选的数组
      console.log(arr, "arr");
      this.formData.TimeGoods = arr.map((item) => {
        return {
          // id: item.id,
          // spuNo: item.spuNo,
          disCountType: 1, //折扣类型
          goodsName: item.goodsName,
          price: item.price,
          mainImg: item.mainImg,
          goodsId: item.id,
          discountRate: 10,
          discountPrice: 0,
          buyNum: 1,
        };
      });
      console.log(this.formData.TimeGoods, "this.formData.TimeGoods");
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
    handleSizeChange(val) {
      this.pagination.psize = val;
      this.getAllGoods();
    },
    handleCurrentChange(val) {
      this.pagination.pindx = val;
      this.getAllGoods();
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
          placeholder: "活动价格(元)",
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
    cancled() {
      this.GoodIndex = this.selectGoodIndex;
      this.dialogVisible = false;
    },
    diaLogConfirm() {
      console.log(this.checkGoods, "this.checkGoods");
      this.dialogVisible = false;
      return;
      this.selectGoodIndex = this.GoodIndex;
      let GoodsID = this.goodsList[this.selectGoodIndex].id;
      this.formData.goodsId = this.goodsList[this.selectGoodIndex].id;
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
        // console.log(this.tableColumnList, this.tableData, "tableDatatableData");
      });
    },
    getAllGoods() {
      this.dialogVisible = true;
      this.getMoreGoods(); //加载数据
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
            this.goodsList.push(...res.data.rows);
          }
        })
        .then(() => {
          // 数据全部加载完成
          if (this.goodsList.length === this.total) {
            this.isFinished = true;
          }
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
        actId: id,
      };
      GetActFrePostDetaiAPI(data, "get").then((res) => {
        // console.log(res, "resss");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.formData = res.data;
        this.formData.timer = [res.data.startTime, res.data.endTime];
        this.checkGoods = res.data.postGoods;
      });
    },
    createActivity() {
      this.formData.buyPrice = Number(this.formData.buyPrice);
      this.formData.discountsPrice = Number(this.formData.discountsPrice);
      this.formData.goodsIds = this.checkGoods
        .map((item) => {
          return item.id;
        })
        .join(",");
      var newData = Object.assign(this.formData, {
        actId: Number(this.actId),
      });
      var formData = new FormData();
      if (this.cheackState == "Edit") {
        formData.append("json", JSON.stringify(newData));
        EditFreePostAPI(formData, "put").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "编辑成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "freeShipping",
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
        InsertFreePostAPI(formData, "post").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "创建成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "freeShipping",
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
    showAddDialog() {
      this.tempaddress = true;
    },
    submitForm(formName) {
      // console.log(this.$refs[formName].validate, "formName");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formData.skuGoods, "this.formData.skuGoods");
          if (this.checkGoods.length == 0 && this.formData.isAllShop == 0) {
            // alert("submit!");
            this.$message({
              duration: 1000,
              message: "请选择活动商品!",
              type: "error",
            });
            return;
          }
          if (this.formData.buyPrice === 0 && this.formData.buyNum == 0) {
            // alert("submit!");
            this.$message({
              duration: 1000,
              message: "至少选择一种条件!",
              type: "error",
            });
            return;
          }

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
  mounted() {},
};
</script>
<style lang="scss" scoped>
.el-input-number {
  .el-input-number__decrease,
  .el-input-number__increase {
    height: 32px;
    line-height: 32px;
  }
}

// .hover-row {
//   background-color: #ffff !important;
// }
.el_IMG {
  margin: 10px 20px;
}
.el-checkbox {
  display: flex;
  align-items: center;
}
/deep/ .el-dialog {
  // width: 40vw !important;
  .scroll {
    height: 20vw;
    overflow-y: auto;
  }
  .el-checkbox__inner {
    border: 1px solid black;
  }
  .el-checkbox__label {
    display: flex;
    align-items: center;
  }
}

.limitDiscount {
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffff;
  .el-radio {
    margin: 4px;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-dialog .el-radio {
    margin: 10px;
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