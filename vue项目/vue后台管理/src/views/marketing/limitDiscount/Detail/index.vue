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
          v-model="formData.startTime"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="持续时间：" prop="durationHour">
        <el-select v-model="formData.durationHour" placeholder="请选择">
          <el-option label="1小时" :value="1"></el-option>
          <el-option label="2小时" :value="2"></el-option>
          <el-option label="4小时" :value="4"></el-option>
          <el-option label="8小时" :value="8"></el-option>
          <el-option label="12小时" :value="12"></el-option>
          <el-option label="24小时" :value="24"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动预热：" prop="isHost">
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
      <el-form-item label="选择商品：" prop="activeSetting">
        <el-link @click="getAllGoods" :underline="false" type="primary"
          >选择商品</el-link
        >
      </el-form-item>
      <el-form-item label="商品设置：" prop="activeSetting"></el-form-item>
    </el-form>

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
    <el-table :data="formData.timeGoods" style="width: 100%">
      <el-table-column align="center" fixed prop="mainImg" label="商品">
        <template slot-scope="scope">
          <el-image
            class="el_IMG"
            style="width: 5vw; height: 5vw"
            :src="scope.row.mainImg + '?x-oss-process=style/n3'"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="goodsName"
        label="标题"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="price"
        label="原价"
      ></el-table-column>
      <el-table-column align="center" label="活动价">
        <template slot-scope="scope">
          {{
            getActPrice(
              scope.row.disCountType,
              scope.row.price,
              scope.row.discountRate,
              scope.row.discountPrice
            )
          }}元
        </template>
      </el-table-column>
      <el-table-column align="center" prop="actStatus" label="活动折扣">
        <template slot-scope="scope">
          <div class="flex2 aic">
            <el-radio-group v-model="scope.row.disCountType">
              <el-radio :label="1"
                >打
                <el-input-number
                  class="w-100"
                  v-model="scope.row.discountRate"
                  :min="1"
                  :max="10"
                  :controls="false"
                  :precision="1"
                  placeholder="最大值"
                ></el-input-number>
                折</el-radio
              >
              <el-radio :label="2"
                >减
                <el-input-number
                  class="w-100"
                  v-model="scope.row.discountPrice"
                  :min="0.00"
                  :max="scope.row.price"
                  :controls="false"
                  :precision="2"
                  placeholder="最大值"
                ></el-input-number>
                元</el-radio
              >
            </el-radio-group>
          </div></template
        >
      </el-table-column>
      <el-table-column align="center" prop="actStatus" label="限购数量">
        <template slot-scope="scope">
          <el-input-number
            class="w-100"
            size="mini"
            v-model="scope.row.buyNum"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteGood(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
import {
  InsertActLimitTimeAPI,
  GetShopGoodsByNameAPI,
  GetGoodsSkuAPI,
  EditActLimitTimeAPI,
  GetActLimitTimeDetailAPI,
} from "@/api/activityApi";
export default {
  data() {
    return {
      CODE: 0,
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
        actId: 0,
        actName: "", //活动名称
        startTime: "", //开始时间
        durationHour: 1, //
        isHost: 1,
        hostHour: 24,
        timeGoods: [],
      },
      rules: {
        actName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        startTime: [{ required: true, message: "请输入", trigger: "blur" }],
        durationHour: [{ required: true, message: "请输入", trigger: "blur" }],
        isHost: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  components: {},
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
    deleteGood(good) {
      // console.log(ClearIndex, "ClearIndex");
      this.formData.timeGoods.remove(good);
      this.checkGoods.remove(good);
    },
    getActPrice(type, price, rate, disPrice) {
      // console.log(type, "typetype");
      if (type == 1) {
        return (price * (Number(rate) / 10)).toFixed(2);
      } else {
        return Number(price - disPrice).toFixed(2);
      }
    },
    changeGroup(arr) {
      //多选的数组
      this.formData.timeGoods = arr.map((item) => {
        console.log(item, "item");
        return {
          // id: item.id,
          // spuNo: item.spuNo,
          disCountType: 1, //折扣类型
          goodsName: item.goodsName,
          price: item.price,
          mainImg: item.mainImg,
          goodsId: item.id || item.goodsId,
          discountRate: 10,
          discountPrice: 0,
          buyNum: 1,
        };
      });
      console.log(this.formData.timeGoods, "this.formData.timeGoods");
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
          this.formData = [];
          return;
        }
        this.formData = res.data;
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
            this.goodsList.push(
              ...res.data.rows.map((item) => {
                return Object.assign({}, item, {
                  goodsId: item.id,
                });
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
      GetActLimitTimeDetailAPI(data, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.formData = res.data;
        this.checkGoods = res.data.timeGoods;
        this.formData.timer = [res.data.startTime, res.data.endTime];
      });
    },
    createActivity() {
      // this.getBackstageData();
      console.log(this.checkGoods, "this.checkGoods");
      var newData = Object.assign(this.formData, {
        actId: Number(this.actId),
      });

      var formData = new FormData();
      if (this.cheackState == "Edit") {
        formData.append("json", JSON.stringify(newData));
        EditActLimitTimeAPI(formData, "put").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "编辑成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "limitDiscount",
                });
              },
            });
          } else {
            this.$message({
              duration: 1000,
              message: res.msg,
              // message: `${res.errorData.goodsName}`,
              type: "error",
            });
          }
        });
      } else {
        // console.log(this.formData,"this.formData")
        formData.append("json", JSON.stringify(this.formData));
        InsertActLimitTimeAPI(formData, "post").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "创建成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "limitDiscount",
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
          console.log(this.formData, "this.formData");
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
  mounted() {},
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-checkbox__inner {
    border: 1px solid black;
  }
  .el-checkbox__label {
    display: flex;
    align-items: center;
  }
}
.el-input-number {
  .el-input-number__decrease,
  .el-input-number__increase {
    height: 32px;
    line-height: 32px;
  }
}
.el_IMG {
  margin: 10px 20px;
}
.el-checkbox {
  display: flex;
  align-items: center;
}
.el-dialog {
  // width: 40vw !important;
  .scroll {
    height: 20vw;
    overflow-y: auto;
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