<template>
  <errorPage v-if="CODE===101" />
  <div class="comment" v-else>
    <div class="comment_title">
      <div class="top">
        <span>您收到的评价情况</span>
      </div>

      <div class="bottom">
        <template>
          <el-table :data="tableData" border style="width: 720px">
            <el-table-column label="星级" width="120">
              <template>
                <div class="block">
                  <el-rate v-model="value1" disabled :colors="colors"></el-rate>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="最近一周" width="120"></el-table-column>
            <el-table-column prop="address" label="最近一月" width="120"></el-table-column>
            <el-table-column prop="date" label="最近六月" width="120"></el-table-column>
            <el-table-column prop="name" label="半年以前" width="120"></el-table-column>
            <el-table-column prop="address" label="总计"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>

    <div class="comment_content">
      <div class="comment_content_box">
        <div class="top">
          <div class="d1">买家评价</div>
          <div class="d2">评价内容</div>
          <div class="d3">评价星级</div>
          <div class="d4">商品信息</div>
        </div>
        <div class="bottom">
          <div class="Item" v-for="(item,index) in evaluationlist" :key="index">
            <div class="Item_nav">
              <span>订单号：{{item.orderNo}}</span>
            </div>
            <div class="Item_main">
              <div class="d1">
                <img :src="item.userImg+'?x-oss-process=style/n2'" alt />
                <p>
                  <span>{{item.username}}</span>
                  <span
                    style="color:rgba(177,182,195,1);font-size:10px;padding-top:2px;"
                  >{{item.creatorDate}}</span>
                </p>
              </div>
              <div class="d2">
                <p>{{item.reviewBody}}</p>
                <div>
                  <el-image
                    v-for="(img,index) in item.imgList"
                    :key="index"
                    class="mr-16"
                    :src="img+'?x-oss-process=style/n2'"
                    :preview-src-list="changeImgStyle(item.imgList,'?x-oss-process=style/b5',index)"
                  ></el-image>
                  <!-- <img :src="img" alt v-for="(img,index) in item.imgList" :key="index" /> -->
                </div>
              </div>
              <div class="d3">
                <template>
                  <div class="block">
                    <el-rate v-model="item.start" disabled :colors="colors"></el-rate>
                  </div>
                </template>
              </div>
              <div class="d4">{{item.goodsName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="foot">
      <el-pagination
       hide-on-single-page
       :pager-count="5"
        background
        layout="prev, pager, next"
        :total="Total"
        :page-size="pageSize"
        @current-change="paging"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ShopOrderReviewAPI } from "@/api/commonAPI";
export default {
  data() {
    return {
      CODE: 0,
      tableData: [
        {
          date: "0",
          name: "0",
          address: "0",
        },
        {
          date: "0",
          name: "0",
          address: "0",
        },
        {
          date: "0",
          name: "0",
          address: "0",
        },
        {
          date: "0",
          name: "0",
          address: "0",
        },
        {
          date: "0",
          name: "0",
          address: "0",
        },
        {
          date: "0",
          name: "0",
          address: "0",
        },
        {
          date: "0",
          name: "0",
          address: "0",
        },
      ],
      value1: 5,
      colors: ["#E46D0C", "#E46D0C", "#E46D0C"],
      evaluationlist: [],
      Total: 0,
      pageSize: 0,
      PIdex: 1, //页数
    };
  },
  methods: {
    changeImgStyle(arr, style, index) {
      // console.log(arr.slice(index), style, index, "arr.slice(index)");
      let arr1 = arr.slice(index).map((item) => {
        return item + style;
      });
      let arr2 = arr.slice(0, index).map((item) => {
        return item + style;
      });
      return [...arr1, ...arr2];
      //改变图片的 显示大小
      // return arr.map(item => {
      //   return item + style;
      // });
    },
    ShopOrderReviewData() {
      var data = {
        pIdex: this.PIdex,
        pSize: 5,
      };
      ShopOrderReviewAPI(data, "get").then((res) => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.Total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.evaluationlist = res.data.rows;
      });
    },
    paging(val) {
      console.log(val);
      this.PIdex = val;
      this.ShopOrderReviewData();
    },
  },
  mounted() {
    this.ShopOrderReviewData();
  },
};
</script>

<style lang="scss" scoped>
.comment {
  background: rgba(255, 255, 255, 1);
  box-shadow: 2px 2px 9px 1px rgba(221, 221, 221, 0.5);
  border-radius: 4px;
  .comment_title {
    padding-left: 24px;
    .top {
      width: 100%;
      padding: 12px 0;
      font-size: 12px;
      font-weight: bold;
    }
    .bottom {
      width: 100%;
      /deep/ .el-table__header .is-leaf {
        height: 36px;
        padding: 0;
        background: rgba(249, 249, 249, 1);
        text-align: center;
      }
      /deep/ .el-table td,
      .el-table th {
        height: 36px;
        padding: 0;
      }
      /deep/ .el-table__row td .cell {
        width: 120px;
        text-align: center;
      }
      /deep/ .block .el-rate__icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }
  }
  .comment_content {
    padding-left: 24px;
    margin-top: 20px;
    padding-right: 32px;
    .comment_content_box {
      width: 998px;
      .top {
        width: 100%;
        display: flex;
        font-size: 12px;
        color: rgba(33, 33, 33, 1);
        line-height: 16px;
        padding-bottom: 12px;
        .d1 {
          width: 20%;
          text-align: center;
        }
        .d2 {
          width: 30%;
          text-align: center;
        }
        .d3 {
          width: 20%;
          text-align: center;
        }
        .d4 {
          width: 30%;
          text-align: center;
        }
      }
      .bottom {
        width: 100%;
        .Item {
          width: 100%;
          .Item_nav {
            width: 100%;
            font-size: 10px;
            color: rgba(74, 80, 96, 1);
            line-height: 14px;
            height: 24px;
            border: 1px solid rgba(238, 238, 238, 1);
            display: flex;
            align-items: center;
            span {
              padding-left: 20px;
            }
          }
          .Item_main {
            width: 100%;
            display: flex;
            min-height: 80px;
            padding: 10px 0;
            .d1 {
              width: 20%;
              display: flex;
              justify-content: center;
              img {
                width: 32px;
                height: 32px;
              }
              p {
                display: flex;
                flex-direction: column;
                padding-left: 8px;
                align-items: flex-start;
              }
            }
            .d2 {
              width: 30%;
              display: flex;
              justify-content: center;
              flex-direction: column;

              padding: 0 20px;
              div {
                display: flex;
                line-height: 16px;
                padding-top: 4px;
                img {
                  width: 32px;
                  height: 32px;
                  border-radius: 1px;
                  margin-left: 8px;
                }
                img:nth-child(1) {
                  margin-left: 0px;
                }
                img:hover {
                  width: auto;
                  height: auto;
                  position: fixed;
                  top: 50px;
                }
              }
            }
            .d3 {
              width: 20%;
              display: flex;
              justify-content: center;
            }
            .d4 {
              width: 30%;
              display: flex;
              justify-content: center;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
  .foot {
    padding-left: 24px;
    margin-top: 20px;
    padding-right: 32px;
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
  }
}
</style>