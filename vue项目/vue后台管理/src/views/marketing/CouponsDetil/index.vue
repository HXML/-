<template>
  <div class="onSale br-8">
    <el-form class="fw">
      <div class="header">
        <span class="sell_person">基本信息</span>
      </div>
      <el-divider></el-divider>
      <el-form-item label="优惠券名称：" label-width="120px" prop="linkMan">
        <el-input
          v-if="modeldata.id==0"
          placeholder="十个字内"
          maxlength="10"
          v-model="modeldata.couponsName"
          style="width:288px; margin-right:20px"
        ></el-input>
        <span v-if="modeldata.id>0" type="primary">{{modeldata.couponsName}}</span>
      </el-form-item>
      <el-form-item label="发券时间：" label-width="120px" prop="provinceNo">
        <div class="block" v-if="modeldata.id==0">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="value3"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
        <span v-if="modeldata.id>0" type="primary">{{modeldata.beginDate}} 至 {{modeldata.endDate}}</span>
      </el-form-item>
      <el-form-item label="使用时间：" label-width="120px" prop="provinceNo">
        <div class="block" v-if="modeldata.id==0">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="value2"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
        <span
          v-if="modeldata.id>0"
          type="primary"
        >{{modeldata.useStartDate}} 至 {{modeldata.useEndDate}}</span>
      </el-form-item>
      <el-form-item label="是否关联商品：" label-width="120px" prop="name">
        <el-radio v-if="modeldata.id==0" v-model="modeldata.isLinkGoods" label="1">是</el-radio>
        <el-radio v-if="modeldata.id==0" v-model="modeldata.isLinkGoods" label="0">否</el-radio>
        <span v-if="modeldata.id>0" type="primary">{{modeldata.isLinkGoods==1?'是':'否'}}</span>
      </el-form-item>
      <el-form-item label="商品范围：" v-if="modeldata.isLinkGoods==1" label-width="120px" prop="name">
        <span class="shopchk" @click="shopchkdisage()">选择商品</span>
        (已选择{{goodsNum}}个)
      </el-form-item>

      <el-form-item label="优惠金额：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          oninput="if(value>1000)value=1000"
          type="number"
          v-if="modeldata.id==0"
          v-model="modeldata.faceValue"
          style="width:288px; margin-right:20px"
          onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
        ></el-input>
        <span v-if="modeldata.id==0" class="spanzhus">请输入1/2/3/5及5的倍数，面额不得超过1000元</span>
        <span v-if="modeldata.id>0" type="primary">{{modeldata.faceValue}}</span>
      </el-form-item>
      <el-form-item label="使用门槛：" label-width="120px" prop="name">
        <span>满</span>
        <el-input
          placeholder="请输入"
          oninput="if(value>100000)value=100000"
          type="number"
          v-if="modeldata.id==0"
          v-model="modeldata.quotaLimit"
          style="width:188px; margin-right:20px;margin-left:10px"
          onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
        ></el-input>
        <span v-if="modeldata.id>0" type="primary">{{modeldata.quotaLimit}}</span>
        <span class="spanzhus">使用门槛必须大于优惠金额</span>
      </el-form-item>
      <el-form-item label="发行量：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="modeldata.maxNum"
          style="width:288px; margin-right:20px"
          maxlength="10"
        ></el-input>
        <span class="spanzhus">优惠券创建后,发行量只能增加，不能减少，请谨慎设置</span>
      </el-form-item>
      <el-divider></el-divider>
      <div class="header">
        <span class="sell_person">发券信息</span>
      </div>
      <el-form-item label="领券方式：" label-width="120px" prop="name">
        <el-radio v-if="modeldata.id==0" v-model="modeldata.isPublic" label="1">公开</el-radio>
        <el-radio v-if="modeldata.id==0" v-model="modeldata.isPublic" label="0">不公开</el-radio>
        <span v-if="modeldata.id>0" type="primary">{{modeldata.isPublic==1?'公开':'不公开'}}</span>
      </el-form-item>

      <div class="btn">
        <el-button @click="qxclick">取 消</el-button>
        <el-button @click="ExpAdd" type="primary">确 定</el-button>
      </div>
    </el-form>

    <el-dialog :title="formTtitle" :visible.sync="shopchk">
      <div style="margin-top: 20px">
        <el-checkbox
          style="margin-top: 5px"
          :class="modeldata.id==0?'':'pnontevent'"
          v-for="(item,index) in shopList"
          :key="index"
          v-model="item.checked"
          v-bind:label="item.goodsName"
          border
          size="medium"
        ></el-checkbox>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="shopchk = false">取 消</el-button>
        <el-button type="primary" @click="shopGoods()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { switchTime } from "@/common/js/ycpd_Utils";
import {
  GoodsListCouponsAPI,
  ShopCouponsModelAPI,
  ShopCouponsEditAPI,
  ShopCouponsAddAPI,
} from "@/api/activityApi";
import qs from "qs";
export default {
  data() {
    return {
      modeldata: {
        id: 0,
        couponsName: "",
        quotaLimit: 0,
        faceValue: 0,
        maxNum: 0,
        beginDate: "",
        endDate: "",
        useStartDate: "",
        useEndDate: "",
        isPublic: "1",
        isLinkGoods: "0",
        goodsJoinList: [],
      },
      shopList: [],
      editShopList: [],
      formTtitle: "商品地址选择",
      shopchk: false, //弹窗
      pickerOptions: {
        shortcuts: [
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      goodsNum: 0,
      value2: "", //使用时间：
      value3: "", //发券时间：
    };
  },

  methods: {
    ExpAdd() {
      let id = this.$route.query.id; //传过来的ID  添加未0
      if (id == 0) {
        this.modeldata.beginDate = switchTime(this.value3[0]);
        this.modeldata.endDate = switchTime(this.value3[1]);
        this.modeldata.useStartDate = switchTime(this.value2[0]);
        this.modeldata.useEndDate = switchTime(this.value2[1]);
        this.modeldata.goodsJoinList = [];
        for (let i = 0; i < this.shopList.length; i++) {
          if (this.shopList[i].checked) {
            var datajoin = {
              GoodsId: this.shopList[i].id,
            };
            this.modeldata.goodsJoinList.push(datajoin);
          }
        }

        var dats = qs.stringify({ model: this.modeldata });

        //添加接口
        ShopCouponsAddAPI(dats, "post", true).then((res) => {
          if (res.code == 1) {
            this.$message({
              message: "恭喜你，添加成功!",
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message.error(res.msg);
            return;
          }
        });
      } else {
        //修改接口
        var dats = qs.stringify({ model: this.modeldata });

        ShopCouponsEditAPI(dats, "put", true).then((res) => {
          if (res.code == 1) {
            this.$message({
              message: "恭喜你，修改成功!",
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: res.msg,
              type: "success",
            });
          }
        });
      }
    },
    qxclick() {
      this.$router.go(-1);
    },
    shopchkdisage() {
      this.shopchk = true;
    },
    shopGoods() {
      this.goodsNum = 0;

      for (let index = 0; index < this.shopList.length; index++) {
        if (this.shopList[index].checked) {
          console.log(6);
          this.goodsNum += 1;
        }
      }
      this.shopchk = false;
    },
    modelCoudata(id) {
      var data = {
        id: id,
      };
      ShopCouponsModelAPI(data, "get").then((res) => {
        this.modeldata = res.data;

        for (let i = 0; i < this.shopList.length; i++) {
          for (let index = 0; index < res.data.goodsJoinList.length; index++) {
            if (this.shopList[i].id == res.data.goodsJoinList[index].goodsId) {
              this.shopList[i].checked = true;
              this.goodsNum += 1;
            }
          }
        }
      });
    },
  },
  mounted() {
    let id = this.$route.query.id; //传过来的ID  添加未0

    GoodsListCouponsAPI("", "get").then((res) => {
      let newList = res.data.map((item) => {
        return Object.assign({}, item, { checked: false });
      });
      this.shopList = newList;
      if (id > 0) {
        this.modelCoudata(id);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/.el-range-separator {
  line-height: 28px;
}

/deep/ .el-input__icon {
  line-height: 28px;
}
/deep/ .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0px;
}
.shopchk {
  color: #409eff;
  cursor: pointer;
}
.w_800 {
  width: 800px;
}
.spanzhus {
  margin-left: 15 px;
  color: #b1b6c3;
}
.w_200 {
  width: 200px;
}
.pnontevent {
  pointer-events: none;
}
.ml_80 {
  margin-left: 80px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}
.goodType {
  color: #b1b6c3;
  font-size: 10px;
}
.mt_30 {
  margin-bottom: 30px;
}

.goodTitle {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
}
.mainTableInfor {
  .over_two {
    width: 250px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
}
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}
.div1 {
  display: inline;
}
.sell_person {
  font-weight: bold;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
  line-height: 19px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.ml-10 {
  margin-left: 10px;
}
.onSale {
  padding: 24px;
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
  .span_confirm_active2 {
    margin-left: 20px;
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
  .Heng {
    height: 20px;
    width: 100%;
    background: #e6f0f9;
  }
}
.btn {
  margin-top: 40px;
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 20px, 0px;
  text-align: center;
  margin-bottom: 60px;
}
.comment_content {
  margin-top: 20px;
  .comment_content_box {
    width: 798px;
    .top {
      width: 100%;
      display: flex;
      font-size: 12px;
      color: rgba(33, 33, 33, 1);
      line-height: 16px;
      padding-bottom: 12px;
      .d1 {
        display: flex;
        min-width: 20%;
        text-align: center;
      }
      .d2 {
        display: flex;
        width: 16%;
        text-align: center;
      }
    }
    .bottom {
      width: 100%;
      .Item {
        width: 100%;
        .Item_nav {
          height: 52px;

          width: 100%;
          font-size: 10px;
          color: rgba(74, 80, 96, 1);
          border: 1px solid rgba(238, 238, 238, 1);
          background: rgba(230, 240, 249, 1);
          span {
            padding-left: 20px;
          }
          img {
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }
        }
        .mainInfor {
          width: 70%;
          .d1 {
            width: 80%;
            text-align: center;
          }
          .d2 {
            width: 20%;
          }
          .d3 {
            width: 20%;
          }
          .d4 {
            width: 20%;
          }
        }
      }
    }
  }
}
.wd_30 {
  width: 150px;
}
.el-icon-edit {
  cursor: pointer;
}
</style>