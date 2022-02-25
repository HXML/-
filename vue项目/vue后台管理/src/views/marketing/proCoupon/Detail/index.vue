<template>
  <errorPage v-if="CODE === 101" />
  <div class="bargaining" v-else>
    <el-form
      :model="formData"
      ref="formData"
      label-width="100px"
      class="demo-formData"
    >
      <el-form-item label="选择优惠券：">
        <el-link
          v-if="!goodName"
          @click="getAllGoods"
          :underline="false"
          type="primary"
          >选择优惠券</el-link
        >
        <span>{{ goodName.couponsName }}</span>
        <el-link
          class="ml-16"
          v-if="goodName"
          :underline="false"
          @click="getAllGoods"
          type="primary"
          >更换商品</el-link
        >
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="w-400"
          v-model="formData.rmk"
          placeholder="备注"
        ></el-input>
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
    <el-dialog title="选择产品" :visible.sync="dialogVisible">
      <div class="flex aic">
        <div class="flex aic mr-30">
          <div class="w-100">优惠券名称：</div>
          <el-input
            placeholder="请输入优惠券名称"
            class="w-160"
            v-model="pagination.cName"
          ></el-input>
        </div>
        <!-- <span></span> -->
        <el-button @click="searchGood">搜索</el-button>
      </div>
      <el-divider></el-divider>
      <div>
        <div class="scroll" @scroll="scrollEvent">
          <el-radio-group v-model="goodName">
            <el-radio
              v-for="(good, index) in goodsList"
              :key="index"
              :label="good"
              class="flex aic"
            >
              {{ good.couponsName }}
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
  EditBigWhellAwardDetaiAPI,
  GetPageAPI,
  GetBigWhellAwardDetaiAPI,
  AddBigWhellAwardAPI,
} from "@/api/activityApi";
import qs from "qs";
export default {
  data() {
    return {
      CODE: 0,
      pagination: {
        pindx: 1,
        psize: 16,
        status: "1", //1是所有券，2是未开始，3是领取中，4是已结束
        cName: "",
      },
      total: 0,
      isFinished: false,
      isReachBottom: false,
      reachBottomDistance: 100,
      scrollHeight: 0,
      offsetHeight: 0,

      jiangxiangId: 0,
      dialogVisible: false,
      GoodIndex: null,
      goodsList: [],
      cheackState: "",
      goodName: "",
      formData: {
        id: "",
        rmk: "",
      },
    };
  },
  methods: {
    diaLogConfirm() {
      this.dialogVisible = false;
    },
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
      GetPageAPI(data)
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

    cancled() {
      this.dialogVisible = false;
    },
    getAcInfor(id) {
      let data = {
        id: id,
      };
      GetBigWhellAwardDetaiAPI(data, "get").then((res) => {
        // console.log(res, "resss");
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.jiangxiangId = res.data.id;
        this.formData = res.data;
        this.goodName = {
          couponsName: res.data.awardName,
          id: res.data.awardId,
        };
      });
    },
    createActivity() {
      if (this.cheackState == "Edit") {
        let data = qs.stringify({
          couponsId: this.goodName.id,
          id: this.jiangxiangId,
          rmk: this.formData.rmk,
        });
        EditBigWhellAwardDetaiAPI(data, "put").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "编辑成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "proCoupon",
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
        // formData.append("json", JSON.stringify(this.formData));
        let data = qs.stringify({
          couponsId: this.goodName.id,
          rmk: this.formData.rmk,
        });
        AddBigWhellAwardAPI(data, "post").then((res) => {
          console.log(res, "res");
          if (res.code == 1) {
            this.$message({
              duration: 1000,
              message: "创建成功!",
              type: "success",
              onClose: () => {
                this.$router.push({
                  name: "proCoupon",
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
    submitForm() {
      // console.log(this.$refs[formName].validate, "formName");
      this.createActivity();
    },
  },

  created() {
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
  /deep/ .el-input__inner {
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