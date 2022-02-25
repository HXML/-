<template>
  <div class="selectDialog">
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
      <el-button @click="searchGood">搜索商品</el-button>
    </div>
    <el-divider></el-divider>
    <div class="scroll" @scroll="scrollEvent">
      <div
        class="flex aic scroll_item"
        v-for="good in goodsList"
        :key="good.id"
      >
        <el-radio-group v-model="selectedGood">
          <el-radio :label="good" class="flex aic">
            <el-image
              class="el_IMG"
              style="width: 5vw; height: 5vw"
              :src="good.mainImg + '?x-oss-process=style/n3'"
              fit="cover"
            ></el-image>
            <span class="ml-20">{{ good.goodsName }}</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex jc-sb mt-30">
      <span></span>
      <div>
        <el-button @click="cancelDailog">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认选择</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { GetShopGoodsByNameAPI, GetGoodsSkuAPI } from "@/api/activityApi";
export default {
  data() {
    return {
      selectedGood: "", //最后选择的商品
      total: 0,
      isFinished: false,
      isReachBottom: false,
      reachBottomDistance: 100,
      scrollHeight: 0,
      offsetHeight: 0,
      goodsList: [],
      pagination: {
        pindx: 0,
        psize: 6,
        goodsName: "",
        goodsSpu: "",
      },
    };
  },
  mounted() {
    this.getShopGoods();
  },
  methods: {
    handleConfirm() {
      console.log(this.selectedGood, "selectedGood");
      if (this.selectedGood) {
        this.$emit("selectedGood", this.selectedGood);
        this.$emit("dialogShow", false);
      } else {
        this.$message({
          duration: 1000,
          message: "请选择商品!!",
          type: "warning",
        });
      }
    },
    cancelDailog() {
      this.$emit("dialogShow", false);
    },
    searchGood() {
      //弹窗搜索
      this.pagination.pindx = 0;
      this.isFinished = false;
      this.goodsList = [];
      console.log(this.pagination, "this.pagination");
      this.getShopGoods();
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
        this.getShopGoods();
      }
    },
    getShopGoods() {
      if (this.isFinished) {
        return;
      }
      this.pagination.pindx += 1;
      this.pagination.psize;
      GetShopGoodsByNameAPI(this.pagination)
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
  },
};
</script>

<style lang="scss" scoped>
.selectDialog {
  .scroll_item {
    margin: 8px 12px;
  }
  .el-checkbox {
    display: flex;
    align-items: center;
  }
  .scroll {
    background-color: #ffff;
    width: 100%;
    height: 20vw;
    overflow-y: auto;
  }
  /deep/ .el-checkbox__label {
    display: flex;
    align-items: center;
  }
  /deep/ .el-radio__label {
    display: flex;
    align-items: center;
  }
  /deep/ .el-radio__inner {
    border: 1px solid black !important;
  }
}
</style>