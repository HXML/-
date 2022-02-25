<template>
  <div>
    <!-- 超值搭配 -->
    <div class="collocation">
      <div class="d1">
        <div class="d1_top">
          <span>超值搭配</span>
        </div>
        <div class="d1_bottom">
          <img :src="collocationht.imgUrl + '?x-oss-process=style/n3'" alt />
          <div>
            <p class="p1">
              {{ goodsNameTow }}
            </p>
            <p class="p2" @click="selectsku">{{ skuvalue }}</p>
          </div>
        </div>
        <div class="d1_foot">
          <img src="@/assets/images/1.5_img/dapei_icon2@2x.png" alt />
        </div>
      </div>
      <div class="d2">
        <div class="d2_box" v-for="(item, index) in dpgoodlist" :key="index">
          <img
            :src="item.imgUrl + '?x-oss-process=style/n4'"
            alt
            class="titleimg"
          />
          <div class="d2_box_xm">
            <div class="d2_top">
              <p>{{ item.goodsName }}</p>
            </div>
            <div class="d2_bottom">
              <van-checkbox
                v-model="item.checked"
                :disabled="item.disabled"
                @change="storeAllcheck()"
                ><span class="s1"
                  >¥{{ item.packagePrice | toFixedTow() }} X{{
                    item.packageNum
                  }}</span
                ></van-checkbox
              >
            </div>
          </div>
        </div>
      </div>
      <div class="d3">
        <div class="d3_left">
          <span class="s1">已选择 {{ dggoodnumBig }} 个配件</span>
          <p>
            组合价
            <span class="s2">¥{{ dggoodpriceAllBig | toFixedTow }}</span>
          </p>
        </div>
        <div class="d3_right">
          <button @click="collocationPay()">搭配购买</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { Checkbox, CheckboxGroup } from "vant";
import { AddModelBuyActIDAsyncAPI } from "@/api/activity";
//Toast提示
import { Toast } from "vant";
import qs from "qs";

export default {
  name: "group",
  data() {
    return {
      collocationlist: [], //所有活动
      collocationData: {}, //搭配活动
      collocationht: {}, //活动列表
      goodsNameTow: "", //商品名称
      dpgoodlist: [], //搭配的商品列表
      dggoodpriceAll: 0, //计算组合价
      dggoodnum: 0, //计算组合的数量
      dggoodpricemain: 0, //计算主商品价格
      selectskulist: {}, //选择中的skuid
      skuvalue: "请选择规格",
      skuidList: [], //所有选择商品的sku
      actId: "", //活动id
      skumainId: "",
    };
  },
  props: ["collocationList", "goodsName", "selectskuobj"],
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Toast.name]: Toast,
  },
  methods: {
    queryData(a) {
      if (a[0].actTypeNo == "TYPE_PREFERENTIAL") {
        this.collocationlist = a;
        var i = a.findIndex((value) => value.actTypeNo == "TYPE_PREFERENTIAL");
        this.collocationData = this.collocationlist[i];
        this.collocationht = this.collocationData.preferentialList;
        console.log(
          this.collocationData,
          "搭配活动搭配活动搭配活动搭配活动搭配活动全部"
        );
        this.actId = this.collocationht.actId;
        // console.log(this.actId, "this.actId");
        // console.log(this.collocationht, "搭配活动列表");

        this.dpgoodlist = this.collocationht.withGoods.map((item) => {
          return Object.assign({}, item, {
            checked: true,
            disabled: false,
          });
        });

        // 判断搭配商品是否是可以自己选择 1是固定2是自选
        if (this.collocationht.packageType == 1) {
          this.dpgoodlist.forEach((item) => {
            item.disabled = true;

            this.skuidList.push(item.skuId);
          });
        } else {
          this.dpgoodlist.forEach((item) => {
            item.disabled = false;

            this.skuidList.push(item.skuId);
          });
        }
        // console.log(this.skuidList, "this.skuidList");
        // console.log(this.dpgoodlist, "搭配的商品列表");

        // 计算组合价

        this.dpgoodlist.forEach((item) => {
          // console.log(item.checked, "item.checked");
          if (item.checked) {
            this.dggoodpriceAll += item.packagePrice * item.packageNum;
            this.dggoodnum++;
          }
        });

        console.log(this.dggoodpriceAll, "计算组合价");
      }
    },
    //点击按钮
    storeAllcheck() {
      // console.log(this.dpgoodlist, "this.dpgoodlist");

      this.dggoodpriceAll = 0;
      this.dggoodnum = 0;
      this.skuidList = [];

      this.dpgoodlist.forEach((item) => {
        // console.log(item.checked, "item.checked");
        if (item.checked) {
          this.dggoodpriceAll += item.packagePrice * item.packageNum;
          this.dggoodnum++;
          this.skuidList.push(item.skuId);
        }
      });
      console.log(this.skuidList, "this.skuidList");
    },
    queryDataTow(a) {
      this.goodsNameTow = a;
    },
    // 选择中的skuid
    queryDataThree(a) {
      this.selectskulist = a[0];
      console.log(this.selectskulist, "传给子组件选中的sku obj");

      this.skumainId = this.selectskulist.id;

      this.dggoodpricemain =
        (this.selectskulist.price / 100) * this.selectskulist.selectnum;
      console.log(this.dggoodpricemain, "this.dggoodpricemain");

      console.log(this.selectskulist.skuStr, "skuStr");
      this.skuvalue = "";
      this.selectskulist.skuStr.forEach((item) => {
        this.skuvalue += item.value + " ";
      });
      console.log(this.skuvalue, "this.skuvalue");
    },
    // 点击选择sku
    selectsku() {
      this.$emit("selectskuname");
    },
    //搭配购买
    collocationPay() {
      // console.log(this.skuvalue, "this.skuvalue");
      if (this.skuvalue == "请选择规格") {
        Toast("请先选择规格");
        this.$emit("selectskuname");
      } else {
        if (!this.skumainId) {
          return false;
        }
        // console.log(this.skuidList, "this.skuidList");
        // console.log(this.skumainId, "this.skumainId");
        let arr = this.skuidList;
        arr.push(this.skumainId);
        console.log(arr.join(","), "arr");
        let data = qs.stringify({
          skuids: arr.join(","),
          ActId: this.actId,
        });
        AddModelBuyActIDAsyncAPI(data, "post").then((res) => {
          this.$router.push({
            path: "/GoodsDetails/CartOrderConfirmation",
            query: { ids: res.data.join(",") },
          });
        });
      }
    },
  },
  watch: {
    collocationList: function (a, b) {
      //a是value的新值，b是旧值
      if (a.length == 0) {
      } else {
        this.queryData(a);
      }
    },
    goodsName: function (a, b) {
      console.log(a, "goodsNamegoodsNamegoodsName");
      if (a) {
        this.queryDataTow(a);
      } else {
      }
    },
    selectskuobj: function (a) {
      if (a) {
        this.queryDataThree(a);
      } else {
      }
    },
    // dggoodpriceAll:function(){

    // }
  },
  mounted() {},
  computed: {
    dggoodpriceAllBig: function () {
      return this.dggoodpriceAll + this.dggoodpricemain;
    },
    dggoodnumBig: function () {
      return this.dggoodnum;
    },
  },
};
</script>

<style lang="less">
// 超值搭配
.collocation {
  padding: 0 0 40px 20px;
  background: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
  // border-bottom: 16px solid #f5f6f7;
  .d1 {
    padding: 0 20px 0 0;
    .d1_top {
      height: 80px;
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      color: @text-colorA;
    }
    .d1_bottom {
      display: flex;
      align-items: center;
      img {
        width: 88px;
        height: 88px;
        border-radius: 16px;
      }
      div {
        padding-left: 26px;
        flex: 1;
        .p1 {
          color: @text-colorA;
          font-size: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 560px;
        }
        .p2 {
          font-size: 22px;
          color: #ff8949;
          padding-top: 10px;
          line-height: 32px;
          // word-break: break-all;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 1;
          // -webkit-box-orient: vertical;
        }
      }
    }
    .d1_foot {
      padding: 17px 0;
      img {
        width: 46px;
        height: 46px;
      }
    }
  }
  .d2 {
    display: flex;
    overflow-x: auto;
    .d2_box {
      padding-left: 28px;
      .titleimg {
        width: 196px;
        height: 196px;
        border-radius: 16px;
      }
      .d2_box_xm {
         width: 196px;
        margin-top: 12px;
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .d2_top {
        p {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 24px;
          line-height: 30px;
          color: @text-colorA;
        }
        // margin: 12px 0;
      }
      .d2_bottom {
        display: flex;
        align-items: center;
        /deep/ .van-checkbox {
          .van-checkbox__icon {
            font-size: 16px;
          }
          .van-checkbox__icon--checked .van-icon {
            background-color: #fff;
            border-color: @main-color;
            color: @main-color;
          }
        }
        .s1 {
          font-size: 22px;
          color: @main-color;
          //   padding-left: 12px;
        }
      }
    }
    .d2_box:first-child {
      padding-left: 0;
    }
  }
  .d3 {
    display: flex;
    padding: 30px 20px 0 0;
    .d3_left {
      flex: 1;
      .s1 {
        font-size: 22px;
        color: @text-colorB;
      }
      p {
        font-size: 22px;
        color: @text-colorB;
        padding-top: 12px;
        .s2 {
          color: @main-color;
          font-size: 28px;
        }
      }
    }
    .d3_right {
      button {
        width: 166px;
        height: 60px;
        background: linear-gradient(#e73a3a 0%, #f64242 100%);
        border-radius: 30px;
        color: #fff;
        border: none;
        outline: none;
      }
    }
  }
}
</style>