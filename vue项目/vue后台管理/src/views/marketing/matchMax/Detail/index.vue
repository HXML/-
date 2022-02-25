<template>
  <!-- GetActWithPage 搭配满减活动 -->
  <errorPage v-if="CODE === 101" />
  <div class="makeGroup" v-else>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="100px"
      class="demo-formData"
    >
      <el-form-item label="套餐名称：" prop="actName">
        <el-input
          maxlength="10"
          placeholder="请输入十字以内"
          class="w-400"
          v-model="formData.actName"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="timer"
        label="活动时间："
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
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="套餐类型：" prop="groupManNum">
        <el-radio v-model="formData.actType" :label="1">固定组合套餐</el-radio>
        <el-radio v-model="formData.actType" :label="2">自选组合套餐</el-radio>
      </el-form-item>
      <el-form-item label="搭配商品：" prop="groupManNum">
        <div class="flex">
          <div class="mr-16">
            <div v-if="checkedMainGood.imgUrl" class="flex2 aic">
              <img
                :src="checkedMainGood.imgUrl + '?x-oss-process=style/n3'"
                class="avatar"
              />
              <div
                :name="checkedMainGood.goodsName"
                class="w-120 overflowTwo"
                style="line-height: 2"
              >
                {{ checkedMainGood.goodsName }}
              </div>
            </div>

            <div
              v-else
              class="fcc checkName avatar-uploader"
              @click="getAllGoods('mainGood')"
            >
              <div class="flex2 aic">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <span style="color: #8c939d">请先选择主商品</span>
              </div>
            </div>
          </div>
          <div>
            <div v-if="checkedMainGood" class="flex">
              <div class="mr-40 flex">
                <div
                  v-for="(item, index) in checkedGoodSkus"
                  :key="index"
                  class="flex2 mr-16"
                >
                  <img
                    :src="item.imgUrl + '?x-oss-process=style/n3'"
                    class="avatar"
                  />
                  <div
                    :name="item.goodsName"
                    class="w-120 overflowTwo"
                    style="line-height: 2"
                  >
                    {{ item.goodsName }}
                  </div>
                </div>
              </div>
              <div
                class="fcc checkName avatar-uploader mr-16"
                v-if="checkedGoodSkus.length < 5"
              >
                <div class="flex2 aic" @click="getAllGoods('collType')">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <span style="color: #8c939d">选择搭配商品</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="搭配设置：" prop="groupManNum"> </el-form-item>
    </el-form>
    <el-table :data="tableGoods" style="width: 100%">
      <el-table-column align="center" fixed prop="imgUrl" label="主图">
        <template slot-scope="scope">
          <el-image
            class="el_IMG"
            style="width: 5vw; height: 5vw"
            :src="scope.row.imgUrl + '?x-oss-process=style/n3'"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :prop="'goodsName'"
        label="标题"
      ></el-table-column>
      <el-table-column align="center" prop="isMian" label="商品类型">
        <template slot-scope="scope">
          {{ scope.row.isMian == 1 ? "主商品" : "搭配商品" }}
        </template></el-table-column
      >
      <el-table-column align="center" prop="price" label="价格">
        <template slot-scope="scope">
          {{ scope.row.isMian == 1 ? "" : scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="packageNum" label="搭配数量">
        <template slot-scope="scope">
          <div v-if="scope.row.isMian == 1"></div>
          <div v-else>
            <el-input-number
              size="small"
              :min="1"
              v-model="scope.row.packageNum"
            ></el-input-number></div></template
      ></el-table-column>
      <el-table-column align="center" prop="packagePrice" label="搭配价格">
        <template slot-scope="scope">
          <div v-if="scope.row.isMian == 1"></div>
          <el-input-number
            v-else
            class="w-120"
            v-model="scope.row.packagePrice"
            :min="0"
            :max="scope.row.price"
            :controls="false"
            :precision="2"
          ></el-input-number> </template
      ></el-table-column>

      <el-table-column align="center" prop="packageNum" label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteActive(scope)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="flex jc-sb">
      <span></span>
      <div class="flex">
        <!-- <span>搭配原价： ￥998.00</span>
        <span>搭配套餐价： ￥898.00</span> -->
      </div>
    </div>
    <div class="fcc mt-120">
      <div class="flex aic">
        <span class="btn_back pointer" @click="$router.go(-1)">返回</span>
        <span
          v-if="cheackState == 'Edit' || cheackState == ''"
          @click="submitForm('formData')"
          class="btn_create pointer"
          >{{ this.cheackState == "Edit" ? "保存活动" : "创建活动" }}</span
        >
      </div>
    </div>
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
      <div v-if="this.diaLogType == 'mainGood'">
        <div class="scroll" @scroll="scrollEvent">
          <el-radio-group v-model="checkedMainGood">
            <el-radio
              v-for="(good, index) in goodsList"
              :key="index"
              :label="good"
              :disabled="good.isUseAct == 1"
            >
              <el-image
                class="el_IMG"
                style="width: 5vw; height: 5vw"
                :src="good.imgUrl + '?x-oss-process=style/n3'"
                fit="cover"
              ></el-image>
              <div class="overflow450" :title="good.goodsName">
                {{ good.goodsName }}
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <div
        v-if="this.diaLogType == 'collType'"
        class="scroll"
        @scroll="scrollEvent"
      >
        <div v-for="(good, index) in goodsList" :key="good.goodsId">
          <div
            :class="
              good.isUseAct == 1 || good.goodsId == checkedMainGood.goodsId
                ? 'disabled'
                : 'pointer'
            "
            class="flex aic"
            @click="handleCheckBoxItem($event, index, good.goodsId)"
          >
            <i
              :class="
                good.skuList.length == 0
                  ? 'el-icon-circle-plus'
                  : 'el-icon-remove'
              "
            ></i>
            <el-image
              class="el_IMG"
              style="width: 5vw; height: 5vw"
              :src="good.imgUrl + '?x-oss-process=style/n3'"
              fit="cover"
            ></el-image>
            <span>{{ good.goodsName }}</span>
          </div>
          <el-checkbox-group
            v-model="checkedGoodSkus"
            :max="5"
            @change="checkChange"
          >
            <el-checkbox
              class="ml-140"
              v-for="(item, index) in good.skuList"
              :key="index"
              :label="item"
            >
              {{ item.goodsName }}
            </el-checkbox>
          </el-checkbox-group>
          <!-- <span
            class="ml-140"
            v-for="(item, index) in good.skuList"
            :key="index"
          >
            {{ item }}
            {{ item.skuName }}
          </span> -->
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
  GetGoodsSkuAPI,
  GetActWithDetaiAPI,
  InsertActWithAPI,
  EditActWithAPI,
} from "@/api/activityApi";
export default {
  data() {
    return {
      CODE: 0,
      diaLogType: "",
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
      checkedMainGood: "", //选择的主商品
      checkedGoodSkus: [], //选中的skus

      formData: {
        actId: 0,
        actName: "", //活动名称
        startTime: "", //开始时间
        durationHour: 1, //
        isHost: 1,
        actType: 1, //1是固定2是自由
        withGoods: [
          // {
          //   goodsId: 101, //	商品id，主商品必填
          //   skuId: 0, //skuid，非主商品必填
          //   isMian: 1, ///是否主商品  0 为搭配的商品
          //   packagePrice: 100, //	搭配价
          //   packageNum: 1, //搭配数量
          // },
        ], //	搭配数
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
  computed: {
    goodName: function () {
      if (this.selectGoodIndex) {
        return this.goodsList[this.selectGoodIndex].goodsName;
      } else {
        return this.formData.goodsName;
      }
    },
    tableGoods: function () {
      if (this.checkedMainGood) {
        return [this.checkedMainGood, ...this.checkedGoodSkus]; //合并主商品以及附赠商品
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
    handleCheckBoxItem(e, index, id) {
      console.log(e, index, id, "e, index, id");
      if (!e) {
        this.goodsList[index].skuList = [];
        return;
      }
      console.log(index, id, "aa");
      let postData = {
        GoodsID: id,
      };
      GetGoodsSkuAPI(postData, "get").then((res) => {
        console.log(res, "ressss");
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "warning",
          });
          return;
        }
        if (this.goodsList[index].skuList.length == 0) {
          this.goodsList[index].skuList = res.data.skuGoods.map((item) => {
            // isMian: 0;
            console.log(item, "itemitem");
            return {
              imgUrl: item.imgUrl,
              goodsName: item.skuName,
              goodsId: 0,
              skuId: item.id,
              price: item.price,
              isMian: 0,
              packagePrice: item.price,
              packageNum: 1,
            };
          });
        } else {
          this.goodsList[index].skuList = [];
        }
      });
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
          imgUrl: item.mainImg,
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
            console.log(item, "itemitem asd");
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
    checkChange(e) {
      console.log(e, "aaa");
      if (e.length > 5) {
        return false;
      }
    },
    cancled() {
      this.GoodIndex = this.selectGoodIndex;
      this.dialogVisible = false;
    },
    diaLogConfirm() {
      console.log(this.checkGoods, this.checkedGoodSkus, "this.checkGoods");
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
    getAllGoods(type) {
      this.diaLogType = type;
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
                // id: 510
                // spuNo: "123444"
                // goodsName: "砍价111"
                // price: 11
                // mainImg: "http://img.zk-mall.net/test/SHOP_FILE/20091415565146320084005.jpg"
                // isUseAct: 0
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
      GetActWithDetaiAPI(data, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        // console.log(res, "resss");
        this.formData = res.data;
        this.formData.timer = [res.data.startTime, res.data.endTime];
        if (this.cheackState) {
          // this.checkedGoodSkus=
          this.checkedMainGood = res.data.withGoods[0];
          this.checkedGoodSkus = res.data.withGoods.slice(
            1,
            res.data.withGoods.length
          );
        }
      });
    },
    createActivity() {
      this.formData.withGoods = this.tableGoods;
      console.log(this.tableGoods, " this.formData");
      var newData = Object.assign(this.formData, {
        actId: Number(this.actId),
      });
      var formData = new FormData();
      if (this.cheackState == "Edit") {
        formData.append("json", JSON.stringify(newData));
        EditActWithAPI(formData, "put").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "编辑成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "matchMax",
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
        InsertActWithAPI(formData, "post").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "创建成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "matchMax",
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
    deleteActive(scope) {
      console.log(scope.$index);
      if (scope.$index == 0) {
        this.$confirm("此操作将删除所选中的所有商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.checkedMainGood = "";
          this.checkedGoodSkus = [];
          this.tableGoods = [];
          this.$message({
            duration: 1000,
            message: "删除成功",
            type: "success",
          });
        });
      } else {
        this.$confirm("此操作将删除所选中的商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.checkedGoodSkus.splice(scope.$index - 1, 1);
          this.$message({
            duration: 1000,
            message: "删除成功",
            type: "success",
          });
        });

        // this.tableGoods.splice(scope.$index, 1);
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
.el_IMG {
  margin: 10px 20px;
}
.el-checkbox {
  display: flex;
  align-items: center;
}
/deep/ .el-dialog {
  .el-radio {
    margin: 8px 8px !important;
    display: flex;
    align-items: center;
  }
  .el-checkbox__inner {
    border: 1px solid black;
  }
  .el-radio__label {
    display: flex;
    align-items: center;
  }
  .overflow450 {
    width: 450px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-radio__inner {
    border: 1px solid black !important;
  }
  .scroll {
    height: 20vw;
    overflow-y: auto;
  }
  .el-checkbox__label {
    display: flex;
    align-items: center;
  }
  // .el-radio__label {
  //   margin: 4px;
  //   display: flex;
  //   align-items: center;
  // }
  // .el-radio {
  //   margin: 4px;
  //   display: flex;
  //   align-items: center;
  // }
}
.makeGroup {
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffff;

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
.avatar {
  width: 120px;
  height: 120px;
}
.checkName {
  width: 140px;
  height: 140px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.disabled {
  // color: #8c939d;
  opacity: 0.3;
  pointer-events: none;
}
</style>