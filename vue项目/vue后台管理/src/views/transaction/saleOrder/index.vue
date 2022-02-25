<template>
  <errorPage v-if="CODE === 101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item
        label="创建时间："
        label-width="120px"
        prop="name"
        style="margin-right: 20px"
      >
        <el-date-picker
          value-format="yyyy-MM-dd"
          class="w-164"
          v-model="pageData.sTime"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
        <span class="mr-10 ml-10">至</span>
        <el-date-picker
          value-format="yyyy-MM-dd"
          class="w-164"
          v-model="pageData.eTime"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="订单状态：" label-width="120px" prop="name">
        <el-select v-model="pageData.oStatus" placeholder="全部" class="w-164">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="等待买家付款" :value="1"></el-option>
          <el-option label="等待发货" :value="2"></el-option>
          <el-option label="已发货" :value="3"></el-option>
          <el-option label="已完成" :value="5"></el-option>
          <el-option label="关闭的订单" :value="80"></el-option>
          <el-option label="三个月前的订单" :value="-1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="买家昵称：" label-width="120px" prop="name">
        <el-input
          class="w-164"
          placeholder="请输入"
          v-model="pageData.nName"
        ></el-input>
      </el-form-item>

      <el-form-item label="订单编号：" label-width="120px" prop="name">
        <el-input
          class="w-164"
          placeholder="请输入"
          v-model="pageData.oNo"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">
        搜索订单
      </div>
      <!-- <div class="span_confirm_active2" @click="confirmSelect">批量导出</div> -->
      <span
        :class="
          pageData.oStatus !== '' ||
          pageData.NikName !== '' ||
          pageData.oNo !== '' ||
          pageData.tFirst !== '' ||
          pageData.tLast !== ''
            ? 'clearCondition_active pointer'
            : 'clearCondition pointer'
        "
        @click="clearAllInput"
        >清空筛选条件</span
      >
    </div>
    <el-tabs
      @tab-click="handleClicks"
      style="padding-top: 15px; font-size: 12px"
      v-model="pageData.ooStatus"
    >
      <el-tab-pane label="近三月的订单" name="0"></el-tab-pane>
      <el-tab-pane label="等待买家付款" name="1"></el-tab-pane>
      <el-tab-pane label="等待发货" name="2"></el-tab-pane>
      <el-tab-pane label="已发货" name="3"></el-tab-pane>
      <el-tab-pane label="已完成" name="5"></el-tab-pane>
      <el-tab-pane label="关闭的订单" name="80"></el-tab-pane>
      <el-tab-pane label="三个月前的订单" name="-1"></el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <div class="comment_content">
      <div class="comment_content_box">
        <div class="top">
          <div class="d1">商品信息</div>
          <div class="d2">单价</div>
          <div class="d3">数量</div>
          <div class="d4">售后</div>
          <div class="d5">交易状态</div>
          <div class="d6">实收款</div>
          <div class="d6">备注</div>
        </div>
        <div class="bottom">
          <div
            class="Item"
            v-for="(item, index) in tableData"
            :key="index"
            style="margin-bottom: 1vw"
          >
            <div class="Item_nav flex aic">
              <el-checkbox
                @change="handleCheckedChange()"
                class="pl-20"
                v-model="item.checked"
              ></el-checkbox>
              <div class="ml-40">订单号：{{ item.orderNo }}</div>
              <div class="ml-40">创建时间：{{ item.creatorDate }}</div>
              <div class="ml-40 flex aic">
                <div>
                  <img
                    style="border-radius: 50%"
                    :src="item.userHeadImg + '?x-oss-process=style/n3'"
                    alt
                    v-if="item.userHeadImg != null"
                  />
                  <img
                    style="border-radius: 50%"
                    src="@/assets/images/avatar.png"
                    alt
                    v-else
                  />
                </div>
                {{ item.nickName }}
              </div>
              <div v-if="item.shopPickupPointId !== 0" class="ml-40">
                提货门店：{{ item.shopPickupPointName }}
              </div>
            </div>
            <div class="flex jc-sb" style="border-bottom: 1px solid #e8e8e8">
              <div
                class="flex2"
                style="width: 68%; border-left: 1px solid #e8e8e8"
              >
                <div
                  v-for="(goodItem, i) in item.itemList"
                  :key="goodItem.id"
                  :class="
                    i > 1
                      ? 'flex jc-sb aic pb-20'
                      : 'Cont2 flex jc-sb aic pb-20'
                  "
                  style="border-right: 1px solid #e8e8e8; padding: 10px"
                >
                  <div class="flex" style="width: 60%">
                    <el-image
                      :preview-src-list="[
                        goodItem.imageUrl + '?x-oss-process=style/b5',
                      ]"
                      style="height: 70px; width: 70px"
                      :src="goodItem.imageUrl + '?x-oss-process=style/n3'"
                    />
                    <div class="flex2 ml-8" style="width: 60%">
                      <span class="goodTitle over_two">{{
                        goodItem.goodsName
                      }}</span>
                      <span class="goodType">{{ goodItem.skuOpt }}</span>
                    </div>
                  </div>
                  <span style="min-width: 20%">￥{{ goodItem.price }}</span>
                  <span style="min-width: 10%">{{ goodItem.qty }}</span>
                  <span
                    class="mr-16"
                    style="text-align: center; min-width: 10%"
                  >
                    <div v-if="goodItem.returnStatus > 0">
                      {{ goodItem.statusStr }}
                      <br />
                      <span>
                        <a
                          @click="ItemRefund(goodItem.refundID)"
                          class="ashou"
                          style="color: #0d69c5; cursor: pointer"
                          >退款详情</a
                        >
                      </span>
                    </div>
                  </span>
                </div>
              </div>
              <!-- 交易状态 -->
              <div
                class="fcc"
                style="border-right: 1px solid #e8e8e8; width: 10.6%"
              >
                <div class="flex2 aic">
                  <span>{{ item.oStatusStr }}</span>
                  <span>
                    <a
                      @click="JumpDetail(item.id)"
                      class="ashou"
                      style="color: #0d69c5; cursor: pointer"
                      >订单详情</a
                    >
                  </span>
                </div>
              </div>
              <div
                class="fcc"
                style="border-right: 1px solid #e8e8e8; width: 10.6%"
              >
                <div class="flex2 aic">
                  <span>¥{{ item.totalPrice }}</span>
                  <span style="text-align: center"
                    >（含快递费：{{ item.shippingCost }}）</span
                  >
                </div>
              </div>
              <div
                class="fcc"
                style="
                  border-right: 1px solid #e8e8e8;
                  width: 10.6%;
                  word-break: break-word;
                  text-align: center;
                "
              >
                <div class="flex2 aic">
                  <span v-if="item.shopRmk == ''">
                    <a
                      href="#"
                      style="color: #0d69c5; cursor: pointer"
                      @click="ShowShopRmkBox(item.id)"
                      >添加备注</a
                    >
                  </span>
                  <span v-else class="info">
                    <el-tooltip
                      class="item"
                      effect="light"
                      content="item.shopRmk"
                      placement="right"
                      style="margin: 0"
                    >
                      <div slot="content" style="width: 200px">
                        <span>{{ item.shopRmk }}</span>
                      </div>

                      <span>
                        商家备注：
                        <br />
                        {{ item.shopRmk.slice(0, 100) }}
                        <!--取前100个字符 -->
                      </span>
                    </el-tooltip>
                  </span>

                  <el-tooltip
                    class="item"
                    effect="light"
                    content="item.shopRmk"
                    placement="right"
                    style="margin: 0"
                  >
                    <div slot="content" style="width: 200px">
                      <span>{{ item.userRmk }}</span>
                    </div>
                    <span class="info">
                      用户备注：
                      <br />
                      {{ item.userRmk }}
                    </span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="flex jc-sb aic mt-22 xiajia">
      <div>
        <el-checkbox v-model="pageAllChecked" @click.native="handleAllChecked()"
          >全选</el-checkbox
        >
        <!-- <el-button @click="exportDeliver()">导出发货信息</el-button> -->
        <el-button @click="MoreDeliver()">批量发货</el-button>
      </div>
      <!-- 分页 -->
      <!-- <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.query.curPage"
        :page-size="tablePagination.query.pagesize"
        :total="tablePagination.total"
      ></el-pagination>-->
      <el-pagination
        :pager-count="5"
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.pIdex"
        :page-sizes="[4, 8, 16, 32]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
      ></el-pagination>
    </section>
    <!-- Form -->
    <el-dialog :title="formTtitle" :visible.sync="dialogFormVisible">
      <div class="diaLogContent">
        <div class="content_header flex aic">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="shopRmk"
            maxlength="200"
            show-word-limit
            rows="5"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogComfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  RecycleList_API,
  ShopCateListAPI,
  IsShelfAPI,
} from "@/api/goodsManage";
import { OPageApi, ShopRmkAPI } from "@/api/orderManage";

import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
      currentPage: 1,
      CODE: 0,
      priceEdit: false, //是否编辑price
      pageAllChecked: false, //全选开关
      numEdit: false, //是否编辑num
      /* 分页组件*/
      // tablePagination: {
      //   total: 10, // 总条目数
      //   loading: true, // 是否加载loading动画
      //   curPage: 1,
      // },
      // form表单
      dialogFormVisible: false,
      formTtitle: "商家备注",
      shopRmkoId: 0,
      shopRmk: "",
      // form表单
      sType: [], //假的
      pageData: {
        pIdex: 1,
        pSize: 4,
        nName: "", //商品名称：
        sTime: "", //商品编码：
        eTime: "",
        oStatus: "",
        ooStatus: "",
        oNo: "",
        isMonth: 0,
      },
      ruleForm: {
        name: "",
        region: "",
      },
      tableData: [], //外层表格
    };
  },

  methods: {
    //跳转退款详情
    ItemRefund(id) {
      console.log(id);
      this.$router.push({ path: "../refundOrderDetail", query: { id } });
    },
    //跳转详情
    JumpDetail(id) {
      this.$router.push({ path: "../OrderDetil", query: { ids: id } });
    },

    //跳转发货
    MoreDeliver() {
      let ids_ = [];
      let listID = this.tableData.forEach((item) => {
        if (item.checked && item.orderStatus == 2) {
          ids_.push(item.id);
        }
      });
      console.log(ids_);
      if (ids_.length <= 0) {
        this.$message.error("请至少选择一个未发货的订单(只会处理未发货的订单)");
        return;
      }

      this.$router.push({
        path: "../batchdel",
        query: { ids: ids_.join(",") },
      });
    },

    //导出发货信息
    exportDeliver() {
      let ids = [];
      let listID = this.tableData.forEach((item) => {
        if (item.checked) {
          ids.push(item.id);
        }
      });

      console.log(ids);
    },

    // 点击标签页
    handleClicks(tab, event) {
      // console.log(typeof tab.name, "tab.name");
      this.pageData.pIdex = 1;
      this.pageData.oStatus = Number(tab.name);
      this.pageData.isMonth = 0;
      if (tab.name == -1 || tab.name == 0) {
        this.pageData.oStatus = 0;
        if (tab.name == 0) {
          this.pageData.isMonth = 1;
        } else {
          this.pageData.isMonth = -1;
        }
      }
      console.log(this.pageData.isMonth);
      this.getList();
    },

    handleCheckedChange() {
      //列表单选事件
      let num = 0;
      console.log(this.tableData);
      this.tableData.forEach((item) => {
        if (item.checked == true) {
          num++;
        }
      });
      if (num === this.tableData.length) {
        this.pageAllChecked = true;
      } else {
        this.pageAllChecked = false;
      }
      // console.log(this.tableData.length,"this.tableData.length")
    },

    handleClick(row) {
      let data = {
        shelf: 1, // shelf1下架 shelf2上架
      };
      IsShelfAPI(row.id, data, "put").then((res) => {
        this.getList();
      });
    },

    handleAllChecked() {
      //点击全选
      if (!this.pageAllChecked) {
        this.tableData.forEach((item) => {
          item.checked = true;
        });
      } else {
        this.tableData.forEach((item) => {
          item.checked = false;
        });
      }
    },

    confirmSelect() {
      //获取到节点上面的val
      if (this.pageData.isMonth != 0) {
        this.pageData.ooStatus = this.pageData.oStatus;
      }
      this.getList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageData.pSize = val;
      this.getList();
    },
    /* 当前页改变时*/
    handleCurrentChange(val) {
      console.log(val);
      this.pageData.currentPage = val; // 当前页
      this.pageData.pIdex = val;
      this.getList();
    },
    getList() {
      this.pageData.sTime = switchDayTime(this.pageData.sTime);
      this.pageData.eTime = switchDayTime(this.pageData.eTime);

      //获取数据
      OPageApi(this.pageData, "get")
        .then((res) => {
          console.log(res);
          if (res.code == 101) {
            this.CODE = 101;
          }
          let newlist = res.data.rows.map((item) => {
            return Object.assign({}, item, { checked: false });
          });
          this.tableData = newlist;
          this.pageData.total = res.data.total;
        })
        .then((res) => {
          console.log(this.tableData);
          this.pageAllChecked = false;
        });
    },
    clearAllInput() {
      //清空所有条件
      this.pageData = {
        pIdex: 1,
        pSize: 4,
        oStatus: "", //订单状态：
        sTime: "", //开始时间：
        eTime: "", //结束时间
        oNo: "", //订单编号
        nName: "", //买家昵称
      };
      this.sType = [];
      this.getList();
    },
    ShowShopRmkBox(oId) {
      //打开商家备注弹窗
      this.dialogFormVisible = true;
      this.shopRmkoId = oId;
      console.log(oId);
    },
    handleDialogComfirm() {
      //提交商家备注
      if (this.shopRmk.length <= 0) {
        this.$message({ message: "填写的备注不能为空", type: "warning" });
        return;
      }
      var data_ = {
        Rmk: this.shopRmk,
      };

      ShopRmkAPI(this.shopRmkoId, data_, "put").then((res) => {
        console.log(res);
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.getList();
        this.shopRmk = "";
        this.dialogFormVisible = false;
      });
    },
  },
  mounted() {
    // console.log(this.$route.params.id, "this.$route.params.id");
    if (this.$route.params.id) {
      this.pageData.ooStatus = this.$route.params.id;
    }
    // console.log(this.$route.query);
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.over_two {
  // width: 250px;
  height: fit-content;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
.info {
  //超过5行的文本自动隐藏
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input__icon {
  line-height: 32px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}
.goodType {
  color: #b1b6c3;
  font-size: 10px;
}
.goodTitle {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
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
.ml-40 {
  margin-left: 40px;
}
.onSale {
  padding: 24px 24px 0 24px;
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
  .comment_content {
    margin-top: 20px;
    .comment_content_box {
      width: 100%;
      .top {
        width: 100%;
        display: flex;
        font-size: 12px;
        color: rgba(33, 33, 33, 1);
        line-height: 16px;
        padding-bottom: 12px;
        .d1 {
          display: flex;
          min-width: 40%;
          text-align: center;
        }
        .d2 {
          display: flex;
          width: 10%;
          text-align: center;
        }
        .d3 {
          display: flex;
          width: 10%;
          text-align: center;
        }
        .d4 {
          display: flex;
          width: 10%;
          text-align: center;
        }

        .d5 {
          display: flex;
          width: 10%;
          text-align: center;
        }
        .d6 {
          display: flex;
          width: 10%;
          text-align: center;
        }
        .d7 {
          display: flex;
          width: 10%;
          text-align: center;
        }
      }
      .bottom {
        width: 100%;
        .Item {
          width: 100%;
          .Item_nav {
            height: 32px;
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
}
</style>