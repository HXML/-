<template>
  <errorPage v-if="CODE === 101" />
  <div class="storeApply br-8" v-else>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分成设置" name="first">
        <!-- <div class="flex aic" v-for="item in classList" :key="item.id">
          <span>{{ item.labelName }}</span>
          <el-input></el-input>
        </div> -->
        <el-table :data="classList" style="width: 100%">
          <el-table-column prop="labelName" label="门店类目"> </el-table-column>
          <el-table-column prop="rate" label="设置(%)">
            <template slot-scope="scope">
              <el-input
                oninput="if(value>100)value=100;if(value<0)value=1"
                type="number"
                class="w-140"
                v-model.number="scope.row.rate"
              >
                <template slot="append">%</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table>

        <div class="fcc mt-30">
          <el-button
            round
            type="primary"
            @click="passTheItem('Commission')"
            class="w-240"
            >确认保存</el-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane label="提现设置" name="second">
        <!-- <div>提现方式:</div> -->
        <el-form>
          <el-form-item label="提现方式：" label-width="100px">
            <el-checkbox-group @change="changeBox" v-model="type">
              <el-checkbox label="1" name="1">支付宝</el-checkbox>
              <el-checkbox label="2" name="2">微信</el-checkbox>
              <el-checkbox label="3" name="3">银行卡</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="提现提示：" label-width="100px">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="data2.textarea"
              maxlength="30"
              show-word-limit
            >
            </el-input>
          </el-form-item> -->
        </el-form>
        <div class="fcc mt-30">
          <el-button
            round
            type="primary"
            @click="passTheItem('Withdrawal')"
            class="w-240"
            >确认保存</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- <el-divider class="mt-100"></el-divider> -->
  </div>
</template>

<script>
import qs from "qs";
import { GetShopCashRateAPI } from "@/api/shopStoreAPI";
import {
  SetShopCategoryRateAPI,
  GetShopCashTypeAPI,
  SetShopCashTypeAPI,
} from "@/api/shopStoreAPI";
export default {
  data() {
    return {
      classList: [],
      data2: {
        textarea: "",
        types: [],
      },
      type: [],
      activeName: "first",
      CODE: 0, //代码
    };
  },
  methods: {
    getStoreClass() {
      GetShopCashRateAPI().then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
          return;
        }
        this.classList = res.data.map((item) => {
          return {
            labelName: item.categoryName,
            categoryId: item.id,
            rate: item.royaltyRate ? item.royaltyRate : 0,
          };
        });
      });
    },
    handleClick(e) {
      console.log(e.index);
      if (e.index !== 0) {
        GetShopCashTypeAPI().then((res) => {
          console.log(res);
          this.type = res.data.types.split(",");
          this.data2.textarea = res.data.rmk;
        });
      }
    },
    changeBox() {
      console.log(this.type);
    },
    passTheItem(type) {
      if (type == "Commission") {
        // let data = qs.stringify(this.classList);
        var formData = new FormData();
        formData.append("json", JSON.stringify(this.classList));
        SetShopCategoryRateAPI(formData, "post").then((res) => {
          // console.log(res, "resss");
          if (res.code == 1) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      }
      if (type == "Withdrawal") {
        let data = {
          types: this.type.join(","),
          rmk: this.data2.textarea,
        };
        SetShopCashTypeAPI(data, "PUT").then((res) => {
          // console.log(res,"ss")
          if (res.code == 1) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "至少选择一种提现方式",
              type: "error",
            });
          }
        });
      }
    },
  },
  mounted() {
    this.getStoreClass();
  },
};
</script>

<style lang="scss" scoped>
.storeApply {
  padding: 24px;
  background-color: #ffffff;
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  /deep/ .el-range-separator {
    height: 32px;
    line-height: 32px;
    width: fit-content;
  }
  /deep/ .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
}
</style>