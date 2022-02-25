<template>
  <!-- 收入明细 -->
    <errorPage v-if="CODE===101" />
  <div class="revenue br-8" v-else>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin-right:20px;font-size:15px;">店铺资料</span>
      </div>
      <div class="text item">

        <div>
          <span>店 铺 名 称：</span>
          <span class="item_pirce">{{ItemDate.shopName}}</span>
        </div>

        <div>
          <span>店 铺 类 型：</span>
          <span class="item_pirce">{{ItemDate.shopTypeStr}}</span>
        </div>

        <div>
          <span>店铺保证金：</span>
          <span class="item_pirce">{{ItemDate.shopCashDeposit}}</span>
          <!-- <el-button style="padding: 3px 10px" @click="ShowBox()" type="text">结算提现</el-button> -->
        </div>

        <div>
          <span>商 户 地 址：</span>
          <span class="item_pirce">{{ItemDate.address}}</span>
        </div>

        <div>
          <span>商 户 行 业：</span>
          <span class="item_pirce">{{ItemDate.scopeBusiness}}</span>
        </div>

        <div>
          <span>户      名：</span>
          <span class="item_pirce">{{ItemDate.bankAccountName}}</span>
        </div>

        <div>
          <span>账      户：</span>
          <span class="item_pirce">{{ItemDate.bankAccount}} (如需修改请联系平台修改)</span>
        </div>

        <div>
          <span>开   户  行：</span>
          <span class="item_pirce">{{ItemDate.bankName}}</span>
        </div>

        <div>
          <span>商  户 Logo：</span>
          <span class="item_pirce"><img :src="ItemDate.logoImg+'?x-oss-process=style/s4'" height="30" width="30"></span>
        </div>

        
      </div>
    </el-card>


  </div>
</template>

<script>
import { GetShopAPi } from "@/api/settingAPI";
import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
       CODE:0,
      // form表单
      sType: [], //假的
      pageData: {
        pageIndex: 1,
        pageSize: 4,
        timeQ: "", //商品编码：
        TimeH: "",
        runNo: ""
      },
      ItemDate:{},
    };
  },
  methods: {
    confirmSelect() {
      //获取到节点上面的val
      this.pageData.pageIndex = 1;
      this.getDate();
    },

    ShowBox() {
      this.getShopAcc();
      this.show = true;
    },

    hideModal() {
      // 取消弹窗回调
      this.show = false;
    },

    submit() {
      // 确认弹窗回调
    

    },

    getDate() {
      //获取数据
      GetShopAPi("get")
        .then(res => {
          console.log(res);
           if (res.code == 101) {
            this.CODE = 101;
          }
          this.ItemDate = res.data;
        })
        .then(res => {});
    },


  },
  mounted() {
    this.getDate();
  }
};
</script>

<style lang="scss" scoped>
.tables tr {
  height: 30px;
}
.tables tr td {
  font-size: 15px;
  font-weight: 500;
}
.table_span {
  color: #9a9a9a;
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
.box-card {
  box-shadow: none;
  border: none;
}
.revenue {
  // height: 500px;
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
    /deep/.el-checkbox {
      margin-right: 22px;
    }
  }
  .item {
    margin-right: 40px;
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
    line-height: 30px;
  }
  .item_pirce {
    font-family: MicrosoftYaHei;
    color: #b7b7b7;
  }
  .item_name {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
}
</style>