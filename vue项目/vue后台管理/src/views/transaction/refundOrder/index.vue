<template>
  <errorPage v-if="CODE===101" />
  <div class="onSale br-8" v-else>
    <el-form class="flex fw">
      <el-form-item label="买家昵称：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.NickName" class="w-164"></el-input>
      </el-form-item>
      <el-form-item label="申请时间：" label-width="120px" prop="name" style="margin-right: 20px;">
        <el-date-picker
          v-model="pageData.StartCreatorDate"
          type="date"
          class="w-164 mr-10"
          placeholder="选择日期时间"
        ></el-date-picker>至
        <el-date-picker
          class="w-164 ml-10"
          v-model="pageData.EndCreatorDate"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="退款编号：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.ReturnNo" class="w-164"></el-input>
      </el-form-item>
      <el-form-item label="退款金额：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.StartReturnPrice" class="w-164 mr-10"></el-input>至
        <el-input placeholder="请输入" v-model="pageData.EndReturnPrice" class="w-164 ml-10"></el-input>
      </el-form-item>
      <el-form-item label=" 订单编号：" label-width="120px" prop="name">
        <el-input placeholder="请输入" v-model="pageData.OrderNo" class="w-164"></el-input>
      </el-form-item>
      <el-form-item label="退款时间：" label-width="120px" prop="name">
        <el-select v-model="refundNumber" placeholder="全部" class="w-164">
          <el-option label="全部" value="0"></el-option>
          <el-option label="最近申请" value="1"></el-option>
          <el-option label="历史退款" value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex aic">
      <div class="span_confirm_active pointer" @click="confirmSelect">搜索订单</div>
      <span
        :class="
        pageData.NickName!==''
        ||pageData.StartCreatorDate!==''
        ||pageData.EndCreatorDate!==''
        ||pageData.ReturnNo!==''
        ||pageData.StartReturnPrice!==''
        ||pageData.EndReturnPrice!==''
        ||pageData.OrderNo!==''
        ?'clearCondition_active pointer':'clearCondition pointer'"
        @click="clearAllInput"
      >清空筛选条件</span>
    </div>
    <el-tabs
      @tab-click="handleClicks"
      style="padding-top: 15px;font-size: 12px; color:#E46D0C"
      v-model="tabIndex"
    >
      <el-tab-pane label="全部订单" name="0"></el-tab-pane>
      <el-tab-pane label="仅退款（未发货）" name="3"></el-tab-pane>
      <el-tab-pane label="仅退款（已发货）" name="2"></el-tab-pane>
      <el-tab-pane label="退货退款（已发货）" name="1"></el-tab-pane>
      <!-- <el-tab-pane label="售后" name="5"></el-tab-pane> -->
    </el-tabs>
    <!-- 退款类型 -->
    <!-- <span>退款类型：</span>
    <el-select
      v-model="pageData.oStatus"
      placeholder="全部"
      style="width:148px;height:32px; margin-right:20px"
    >
      <el-option label="全部" value="0"></el-option>
      <el-option label="退款退货" value="1"></el-option>
      <el-option label="发货仅退款" value="2"></el-option>
      <el-option label="未发货退款" value="3"></el-option>
    </el-select>-->
    <span>退款状态：</span>
    <el-select
      @change="changeState"
      v-model="pageData.ReturnStatus"
      placeholder="全部"
      style="width:148px; margin-right:20px"
    >
      <el-option v-for="(item,index) in tuikuanStatus" :key="index" :label="item" :value="index"></el-option>
    </el-select>
    <span>退款原因：</span>
    <el-select
      v-model="pageData.ReturnReason"
      @change="changeTuiKuan"
      placeholder="全部"
      style="width:148px; margin-right:20px"
    >
      <el-option v-for="(item,index) in tuikuanList" :key="index" :label="item" :value="index"></el-option>
    </el-select>
    <!-- 退款类型 -->
    <!-- 列表 -->
    <div class="comment_content">
      <div class="comment_content_box">
        <div class="top flex jc-sb">
          <div class="fg1 flex jc-sa">
            <div class="d1 fg3 tac">商品信息</div>
            <!-- <div class="d2 fg1">交易金额</div> -->
            <div class="d3 fg1 tac">退款金额</div>
            <div class="d4 fg1 tac">申请时间</div>
          </div>
          <div class="d5 tac">退款原因</div>
          <div class="d6 tac">退货物流</div>
          <div class="d7 tac">发货物流</div>
          <div class="d8 tac">退款状态</div>
        </div>
        <div class="bottom">
          <div
            class="Item"
            v-for="(item,index) in tableData"
            :key="index"
            style="margin-bottom: 1vw;"
          >
            <div class="Item_nav flex aic w100pc">
              <el-checkbox v-model="item.checked" @change="handleCheckedChange()" class="pl-20"></el-checkbox>
              <div class="ml-40">退款编号:{{item.returnNo}}</div>
              <div class="ml-40">订单号：{{item.orderNo}}</div>
              <div class="ml-40 flex aic">买家昵称：{{item.nickName}}</div>
            </div>
            <el-table :show-header="false" :data="item.inforlist">
              <el-table-column class-name="clomAA" label="信息">
                <template slot-scope="scope">
                  <div class="flex jc-sb aic">
                    <div class="flex">
                      <el-image
                        style="height:70px;width:70px;"
                        :preview-src-list="[scope.row.img]"
                        :src="scope.row.img"
                      ></el-image>
                      <div class="flex2 ml-8">
                        <div class="goodTitle">{{scope.row.goodsName}}</div>
                        <span class="goodType">{{getSkuString(scope.row.orderOtherData) }}</span>
                      </div>
                    </div>
                    <!-- <div class="min_width_90">{{scope.row.totalPrice}}</div> -->
                    <div class="min_width_90">{{scope.row.returnPrice}}</div>
                    <div class="min_width_90">{{scope.row.creatorDate}}</div>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="returnReason" label="姓名" width="90"></el-table-column> -->
              <el-table-column prop="transCo" label="姓名" width="90">
                <template slot-scope="scope">
                  <div class="flex2 aic" v-if="scope.row.transCo">
                    <span>{{scope.row.transCo}}</span>
                    <span
                      class="mainColor f12 pointer"
                      @click="checkKuaidiInfor(scope.row.transCo,scope.row.transNo)"
                    >查看物流</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="shipTransCo" label="发货物流" width="90">
                <template slot-scope="scope">
                  <div class="flex2 aic" v-if="scope.row.shipTransCo">
                    <span>{{scope.row.shipTransCo}}</span>
                    <span
                      class="mainColor f12 pointer"
                      @click="checkKuaidiInfor(scope.row.shipTransCo,scope.row.shipTransNo)"
                    >查看物流</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="returnStatusStr" label="退款状态" width="90">
                <template slot-scope="scope">
                  <div class="flex2 aic">
                    <span
                      :class="scope.row.returnStatusStr=='退款待处理'||scope.row.returnStatusStr=='等待买家退货'?'fontCColor':''"
                    >{{scope.row.returnStatusStr}}</span>
                    <span class="mainColor f12 pointer" @click="toreFuDetail(scope.row.id)">详情</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <section class="flex jc-sb aic mt-22 xiajia">
      <div>
        <el-checkbox v-model="pageAllChecked" @click.native="handleAllChecked()">全选</el-checkbox>
        <el-button
          :class="checkedLIst.length===0?'pointer_None':''"
          @click="exportDeliver(1)"
        >批量同意退货退款</el-button>
        <el-button
          :class="checkedLIst.length===0?'pointer_None':''"
          @click="exportDeliver(2)"
        >批量同意退款</el-button>
      </div>
      <!-- 分页 -->
      <!-- <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :loading="tablePagination.loading"
        :current-page="tablePagination.query.curPage"
        :page-size="tablePagination.query.pagesize"
        :total="tablePagination.total"
        v-if="tablePagination.total!=0"
      ></el-pagination>-->
      <el-pagination
        :pager-count="5"
        :loading="true"
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tablePagination.curPage"
        :page-sizes="[4, 8, 16, 32]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePagination.total"
      ></el-pagination>
    </section>
    <!-- Form -->
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showDailog">
      <template slot="title">
        <div class="flex ai-fe">
          <span class="f16">{{DailogTitle}}</span>
          <span class="f12 fontAColor ml-8">{{DailogDesc}}</span>
        </div>
      </template>
      <el-table :data="RefuData">
        <el-table-column property="orderNo" label="订单编号" align="center"></el-table-column>
        <el-table-column property="returnReason" label="原因" align="center"></el-table-column>
        <el-table-column property="totalPrice" label="交易金额" align="center"></el-table-column>
        <el-table-column property="returnPrice" label="退款金额" align="center">
          <template slot-scope="scope">
            <div class="flex aic">
              <span>￥</span>
              <el-input
                type="number"
                min="0"
                max="11"
                style="width:100px"
                class="fontBColor"
                v-model="scope.row.returnPrice"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column property="returnStatus" label="审核状态" align="center">
          <template slot-scope="scope">{{tuikuanStatus[scope.row.returnStatus] }}</template>
        </el-table-column>
      </el-table>
      <div class="footer fontAColor f12 flex jc-sb">
        <span></span>
        <div class="mt-16">
          <div class="top">
            <span>
              退款总订单：
              <span class="mainColor f16">{{RefuData.length}}</span> 笔
            </span>
            <span class="ml-24">
              退款总金额：¥
              <span class="mainColor f16">{{countAllPrice(RefuData)}}</span>
            </span>
          </div>
          <div class="flex mt-24">
            <div @click="showDailog=false" class="btn_cancle mr-16 pointer">取消</div>
            <div @click="confirmRefu" class="btn_confirm pointer">确认</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 弹窗 -->
  </div>
</template>

<script>
//引用的API
import {
  GoodsReturnListAPI,
  ReturnItemsListByIdsAPI,
  RefundOperationAPI,
} from "@/api/returnOrderAPI";
import qs from "qs";

//时间控件
import { switchDayTime } from "@/common/js/ycpd_Utils";

export default {
  data() {
    return {
      currentPage: 1,
      CODE: 0,
      showDailog: false, //退款弹窗
      DailogTitle: "", //退款头部
      DailogDesc: "", //退款说明
      RefuData: [], //退款弹窗列表

      tabIndex: "0",
      refundNumber: "", //先随便写,后台还没有处理
      tableData: [],
      priceEdit: false, //是否编辑price
      pageAllChecked: false, //全选开关
      numEdit: false, //是否编辑num
      /* 分页组件*/
      tablePagination: {
        total: 0, // 总条目数
        loading: true, // 是否加载loading动画
        curPage: 1,
      },
      // form表单
      dialogFormVisible: false,
      formTtitle: "编辑价格",
      // form表单
      checkedLIst: [], //选中的列表
      sType: [], //假的
      tuikuanStatus: [
        "全部",
        "待处理",
        "已同意",
        "已发货",
        "已完成(退款成功)",
        "已取消",
        "已拒绝",
      ],
      tuikuanList: [
        "全部",
        "拍错/多拍/效果不好/不喜欢",
        "质量问题",
        "收到商品少件/破损/污渍",
        "与描述不符",
        "其他",
        "卖家发错货",
      ],
      pageData: {
        PageIndex: 1,
        PageSize: 4,
        NickName: "", //商品名称：
        OrderNo: "", //订单编号
        ReturnNo: "", //退款编号
        StartCreatorDate: "", //申请开始时间
        EndCreatorDate: "", //申请截止时间
        StartReturnPrice: "", //退款金额(最低)
        EndReturnPrice: "", //退款金额(最高)
        RefundType: "", //退款类型 （1退款退货，2已发货仅退款，3未发货退款）
        ReturnStatus: "", //0全部 传value
        ReturnReason: "", //传值
      },
      ruleForm: {
        name: "",
        region: "",
      },
    };
  },

  methods: {
    checkKuaidiInfor(transCo, orderNo) {
      console.log(orderNo, "orderNo");
      //查看物流
      // window.location.href = `https://www.kuaidi100.com/chaxun?com=''&nu=${orderNo}`;

      window.location.href = `https://www.kuaidi100.com/chaxun?com=${transCo}&nu=${orderNo}`;
    },
    getSkuString(e) {
      if (e) {
        console.log(e);
        let skuObjList = JSON.parse(e);
        let string = "";
        skuObjList.forEach((item) => {
          string += item.Key + ":" + item.Value;
        });
        return string;
      }
    },
    changeState(e) {
      //退款状态：的改变
      this.pageData.ReturnStatus = e;
      this.getList();
    },
    countAllPrice(list) {
      let number = 0;
      list.forEach((item) => {
        number += Number(item.returnPrice);
      });
      return number.toFixed(2);
    },
    toreFuDetail(id) {
      this.$router.push({
        name: "refundOrderDetail",
        query: { id },
      });
    },
    changeTuiKuan(e) {
      ///退款y原因 传string
      if (this.tuikuanList[e] === "全部") {
        this.pageData.ReturnReason = "";
      } else {
        this.pageData.ReturnReason = this.tuikuanList[e];
      }
      this.getList();
    },

    //批量同意
    exportDeliver(index) {
      if (index == 1) {
        this.showDailog = true;
        this.DailogTitle = "批量同意退货";
        this.DailogDesc = "/确认退货后，买家将把退货商品寄回您的默认收货地址";
        //点击批量同意退货退款
        let ids = []; //获取到所有选中的id
        let listID = this.tableData.forEach((item) => {
          console.log(item.inforlist[0].refundType, "itemitemitemitemitem");
          if (
            item.checked &&
            item.inforlist[0].returnStatus == 1 &&
            item.inforlist[0].refundType == 1
          ) {
            //批量同意退货
            ids.push(item.inforlist[0].id);
          }
        });
        let data = {
          idsStr: ids.join(","),
        };
        console.log(data);
        ReturnItemsListByIdsAPI(data, "get").then((res) => {
          this.RefuData = res.data;
        });
      }
      if (index === 2) {
        this.showDailog = true;
        this.DailogTitle = "批量同意退款";
        this.DailogDesc = "/ 确认退款后，订单关闭且退款金额原路返还至买家账户";
        //点击批量同意退款
        let ids = []; //获取到所有选中的id
        let listID = this.tableData.forEach((item) => {
          if (
            item.checked &&
            item.inforlist[0].returnStatus === 1 &&
            (item.inforlist[0].refundType === 2 ||
              item.inforlist[0].refundType === 3)
          ) {
            //批量同意退货
            ids.push(item.inforlist[0].id);
          }
        });
        let data = {
          idsStr: ids.join(","),
        };
        console.log(data);
        ReturnItemsListByIdsAPI(data, "get").then((res) => {
          this.RefuData = res.data;
        });
      }

      // console.log(ids);
    },
    confirmRefu() {
      //弹窗的确认事件
      if (this.DailogTitle == "批量同意退款") {
        let ids = this.RefuData.map((item) => {
          return item.id;
        });
        let prices = this.RefuData.map((item) => {
          return {
            Price: item.returnPrice,
            ReturnId: item.id,
          };
        });
        console.log(ids, "idsidsidsids");
        var data = qs.stringify({
          ids: ids.join(","),
          returnNoPricesStr: JSON.stringify(prices),
          returnStatus: 5,
        });
        RefundOperationAPI(data, "post", 1).then((res) => {
          console.log(res, "resres");
          if (res.code == 1) {
            this.showDailog = false;
            this.$message({
              message: "恭喜你，批量同意退款成功",
              type: "success",
            });
            this.getList();
          } else if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      } else if (this.DailogTitle == "批量同意退货") {
        let ids = this.RefuData.map((item) => {
          return item.id;
        });
        var data = qs.stringify({
          ids: ids.join(","),
          returnStatus: 2,
        });
        RefundOperationAPI(data, "POST")
          .then((res) => {
            if (res.code == 1) {
              this.showDailog = false;
              this.$message({
                message: "恭喜你，批量同意退货成功",
                type: "success",
              });
            } else if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          })
          .then(() => {
            this.getList();
          });
      }
    },

    // 点击标签页
    handleClicks(e) {
      this.tablePagination.curPage = 1;
      console.log(e.name, "lklll");
      if (e.name == "0") {
        this.pageData.RefundType = "";
      } else {
        this.pageData.RefundType = e.name;
      }
      this.getList();
    },

    handleCheckedChange() {
      //列表单选事件
      let num = 0;
      // console.log(this.tableData);
      this.tableData.forEach((item) => {
        if (item.checked == true) {
          num++;
          this.checkedLIst.push(item);
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
      console.log(this.tableData);
      if (!this.pageAllChecked) {
        this.tableData.forEach((item) => {
          item.checked = true;
          this.checkedLIst.push(item);
        });
      } else {
        this.tableData.forEach((item) => {
          item.checked = false;
          this.checkedLIst = [];
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
      this.pageData.PageSize = val;
      this.getList();
    },
    /* 当前页改变时*/
    handleCurrentChange(val) {
      // if (typeof val == "string") {
      //   ///将当前页面的index存入sesion
      //   sessionStorage.setItem("currentPageIndex", val);
      // } else {
      //   sessionStorage.setItem("currentPageIndex", JSON.stringify(val));
      // }
      console.log(val);
      this.tablePagination.curPage = val; // 当前页
      this.pageData.PageIndex = val;
      this.getList();
    },
    getList() {
      //获取数据
      this.pageData.PageIndex = this.tablePagination.curPage; //把获取到的index赋给当前页
      GoodsReturnListAPI(this.pageData, "get")
        .then((res) => {
          if (res.code == 101) {
            this.CODE = 101;
          }
          console.log(res);
          let newlist = res.data.rows.map((item) => {
            return Object.assign({}, item, { checked: false });
          });
          this.tableData = newlist.map((item) => {
            return {
              checked: false, //是否选中
              returnNo: item.returnNo, //退款编号
              orderNo: item.orderNo, //订单编号
              nickName: item.nickName, //昵称
              inforlist: [
                {
                  id: item.id,
                  img: item.goodsImg
                    ? `${item.goodsImg}?x-oss-process=style/b1`
                    : "",
                  goodsName: item.goodsName,
                  orderOtherData: item.orderOtherData, //类型
                  totalPrice: item.totalPrice, //交易价格
                  returnPrice: item.returnPrice, ////退款金额
                  creatorDate: item.creatorDate, //申请时间
                  returnReason: item.returnReason, //退款原因
                  transCo: item.transCo, //退款物流
                  transNo: item.transNo, //退款物流单号
                  shipTransCo: item.shipTransCo, //发货物流
                  shipTransNo: item.shipTransNo, //发货物流单号
                  returnStatus: item.returnStatus, //退款状态
                  refundType: item.refundType, //退款类型（1退款退货，2发货仅退款，3未发货退款）
                  returnStatusStr: item.returnStatusStr, //退款状态
                },
              ],
            };
          });
          this.tablePagination.total = res.data.total;
        })
        .then((res) => {
          console.log(this.tableData);
          this.pageAllChecked = false;
        });
    },
    clearAllInput() {
      //清空所有条件
      this.pageData = {
        PageIndex: 1,
        PageSize: 4,
        NickName: "", //商品名称：
        OrderNo: "", //订单编号
        ReturnNo: "", //退款编号
        StartCreatorDate: "", //申请开始时间
        EndCreatorDate: "", //申请截止时间
        StartReturnPrice: "", //退款金额(最低)
        EndReturnPrice: "", //退款金额(最高)
        RefundType: "", //退款类型 （1退款退货，2发货仅退款，3未发货退款）
        ReturnStatus: "", //0全部 传value
        ReturnReason: "", //传值
      };
      this.getList();
    },
  },
  //初始化加载的方法
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.clomAA{
  min-width: 50vw !important;
}
/deep/.el-table__body {
  width: auto !important;
}
/deep/.el-tabs__item.is-active {
  color: #e46d0c;
}
/deep/.el-tabs__active-bar {
  background-color: #e46d0c;
}
/deep/ .el-tabs__item:hover {
  color: #e46d0c;
}
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input__icon {
  line-height: 32px;
}
.min_width_90{
  min-width: 90px;
}
.btn_cancle {
  width: 80px;
  line-height: 32px;
  text-align: center;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(125, 130, 143, 1);
}
.btn_confirm {
  width: 80px;
  line-height: 32px;
  text-align: center;
  height: 32px;
  color: #ffffff;
  background: #0d69c5;
  border-radius: 2px;
}
.max_width_90 {
  min-width: 90px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}

.goodType {
  width: 180px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  color: #b1b6c3;
  font-size: 10px;
}
.goodTitle {
  width: 180px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
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
        .d5 {
          width: 92px;
        }
        .d6 {
          width: 92px;
        }
        .d7 {
          width: 92px;
        }
        .d8 {
          width: 92px;
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
            width: 80%;
            // .d1 {
            //   width: 80%;
            //   text-align: center;
            // }
            // .d2 {
            //   width: 20%;
            // }
            // .d3 {
            //   width: 20%;
            // }
            // .d4 {
            //   width: 20%;
            // }
          }
        }
      }
    }
  }
}
</style>