<template>
  <div style="width: 100%; height: 100%">
    <div
      :class="
        listactive
          ? 'ProductList bjcolor1 ProductListkong'
          : 'bjcolor2 ProductListkong ProductList'
      "
    >
      <div class="title_box">
        <div class="title_box_top">
          <div class="d1">
            <img src="@/assets/images/home/b2c_home_ss@2x.png" alt />
            <input
              type="text"
              :placeholder="placeholder"
              v-model="ProductListSearchValue"
              @click="jumpSearch()"
            />
          </div>
          <div class="d2">
            <img :src="Switchimg" alt @click="SwitchCss()" />
          </div>
        </div>

        <div class="title_box_bottom">
          <div
            class="div1"
            @click="comprehensive(index)"
            :class="{ divactive: divactive == index }"
            v-for="(item, index) in titleList"
            :key="index"
          >
            <span>{{ item }}</span>
            <span class="triangle" v-show="index == 1 || index == 2">
              <i class="i1"></i>
              <i class="i2"></i>
            </span>
          </div>
        </div>
      </div>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        v-if="listData.length != 0"
      >
        <div :class="listactive ? 'content_box1' : 'content_box2'">
          <div
            :class="listactive ? 'content_Item1' : 'content_Item2'"
            v-for="(item, index) in listData"
            :key="index"
            @click="jumpGoodsDetails(item.id)"
          >
            <div class="content_img">
              <img :src="item.mainImg + '?x-oss-process=style/n4'" alt />
            </div>
            <div class="content_text">
              <div class="content_text_top">
                <p class="p1">{{ item.goodsName }}</p>
                <p class="p2">
                  <span class="s1">
                    <i>¥</i>
                    {{ item.price }}
                  </span>
                  <span class="s2">{{ item.buyNum }}人付款</span>
                </p>
              </div>
              <div class="content_text_bottom"  v-if="item.freeType!=0">
                <p class="p3">
                <span v-if="item.freeType==2">满{{item.buyPrice}}-{{item.discountsPrice}}</span>
                <span v-if="item.freeType==1">包邮</span>
              </p>
                <p class="p4">
                  <span class="s1">{{ item.shopName }}</span>
                  <span class="s2">{{ item.city }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <div class="kong" v-if="listData.length == 0">
        <div class="kong_box">
          <img src="@/assets/images/kong/kong_icon3@2x.png" alt />
          <p class="p1">
            哟嚯，搜索不到有关
            <i>{{ ProductListSearchValue }}</i> 商品
          </p>
          <p class="p2">换个关键词试试</p>
        </div>
      </div>
    </div>
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>


<script>
import Vue from "vue";

// 下拉处理
import { List } from "vant";

import { getbusgoodslistAPI } from "@/api/MyApi";
import loading from "@/components/loading";

export default {
  name: "ProductList",
  data() {
    return {
      titledata: "商品列表", //控制title的动态变量
      ProductListSearchValue: "",
      placeholder: "2020新款女装", //搜索的默认值
      Switchimg: require("@/assets/images/home/ss_icon1@2x.png"), //切换按钮的默认图片
      listactive: true, //控制下面列表的样式变量
      titleList: ["综合", "销量", "价格"],
      divactive: 0, //titleList的高亮变量
      triangleshow: true, //控制/titleList里面三角形上下的显示隐藏
      sales: true, //判断销量的第一次点击和第二次点击
      price: true, //判断价格的第一次点击和第二次点击
      screen: true, //判断筛选的第一次点击和第二次点击
      value: 0,
      show: false, //阴影层的显示隐藏的变量
      screenactive: true, //控制下拉框的样式的变量
      listData: [], //商品列表
      selectedObj: {
        pIdx: 0,
        pSize: 7,
        shopId: "", //店铺id
        categoryId: "", //商品类别id
        keyword: "", //关键字搜索
        shopcategoryId: "", //店铺类别id
        orderbyID: 0, //排序 0为ID排序 销量倒序 1.2 价格排序3和4
        cityNo: "", //城市num
        proviceNo: "", //省num
        couId: 0, //优惠券id
        actId:'',//活动id
      },
      City: {},
      Province: {},
      orderbyid: 0, //去拿到当前orderbyid的值
      formData: {
        id: "",
        nameid: "",
      },
      loading: false,
      finished: false,
      PIdx: 1, //商品列表的初始化的index
      total: 0, //商品列表商品的总数量
      loadingshow: true,
    };
  },
  components: {
    [List.name]: List,
    loading: loading,
  },
  methods: {
    //点击商品去商品详情
    jumpGoodsDetails(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    // 点击搜索回去搜索页面
    jumpSearch() {
      // console.log(this.ProductListSearchValue)
      this.$router.push({
        path: "/GoodsDetails/StoreSearch",
        query: { ProductListSearchValue: this.ProductListSearchValue },
      });
    },
    //点击上面的切换样式
    SwitchCss() {
      if (this.Switchimg == require("@/assets/images/home/ss_icon1@2x.png")) {
        this.Switchimg = require("@/assets/images/home/ss_icon2@2x.png");
        this.listactive = false;
      } else {
        this.Switchimg = require("@/assets/images/home/ss_icon1@2x.png");
        this.listactive = true;
      }
    },
    // 点击 综合 销量 价格
    comprehensive(index) {
      console.log(index, "index");
      this.divactive = index;

      if (index === 0) {
        this.selectedObj.orderbyID = index;
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();
      } else if (index === 1) {
        if (this.sales) {
          this.selectedObj.orderbyID = 1;
          this.sales = false;
        } else {
          this.selectedObj.orderbyID = 2;
          this.sales = true;
        }
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();
      } else if (index === 2) {
        if (this.price) {
          this.selectedObj.orderbyID = 3;
          this.price = false;
        } else {
          this.selectedObj.orderbyID = 4;
          this.price = true;
        }
        this.selectedObj.pIdx = 0;
        this.loading = true;
        this.finished = false;
        this.listData = [];
        this.getbusgoodslistData();
      }
    },
    //获取商品列表
    getbusgoodslistData() {
      this.selectedObj.pIdx++;
      this.selectedObj.actId=this.$route.query.actId
      getbusgoodslistAPI(this.selectedObj, "get")
        .then((res) => {
          console.log(res);
          this.total = res.data.total;
          this.listData.push(...res.data.rows);
          this.loadingshow = false;
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          // console.log(this.listData.length, this.total);
          if (this.listData.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      this.getbusgoodslistData();
    },
  },
  mounted() {
    document.title = this.titledata;

    this.selectedObj.shopId = localStorage.getItem("ShopId");

    this.selectedObj.shopcategoryId = this.$route.query.ID;
    this.selectedObj.keyword = this.$route.query.Keyword;

    if (this.$route.query.couId) {
      this.selectedObj.couId = this.$route.query.couId;
    } else {
      this.selectedObj.couId = 0;
    }

    // this.selectedObj.shopcategoryId = localStorage.getItem("ShopId");

    this.ProductListSearchValue = this.$route.query.Keyword;
    this.getbusgoodslistData();
  },
};
</script>

<style lang="less" scoped>
.bjcolor1 {
  background: @text-white !important;
}
.bjcolor2 {
  background: @base-color !important;
}
.ProductList {
  width: 100%;
  background: @text-white;
  min-height: 100%;
  height: auto;
  .title_box {
    height: 156px;
    position: fixed;
    top: 0;
    background: @text-white;
    width: 100%;
    z-index: 99;
    .title_box_top {
      padding: 12px 20px 0;
      display: flex;
      align-items: center;
      .d1 {
        width: 634px;
        height: 60px;
        background: @text-white;
        border: 2px solid @main-color;
        border-radius: 40px;
        display: flex;
        align-items: center;
        img {
          width: 26px;
          height: 26px;
          padding-left: 24px;
        }
        input {
          padding-left: 16px;
          width: 400px;
          outline: none;
          border: none;
          color: @text-colorB;
          font-size: 28px;
          height: 50px;
        }
      }
      .d2 {
        padding-left: 26px;
        img {
          width: 52px;
          height: 52px;
        }
      }
    }
    .title_box_bottom {
      width: 100%;
      display: flex;
      height: 80px;
      .div1 {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: @text-colorB;
        .triangle {
          padding-left: 4px;
          .i1 {
            display: flex;
            border-style: solid;
            border-width: 8px 8px 8px 8px;
            border-color: transparent transparent #747987 transparent;
            width: 0px;
            height: 0px;
          }
          .i2 {
            display: flex;
            border-style: solid;
            border-width: 8px 8px 8px 8px;
            border-color: #747987 transparent transparent transparent;
            width: 0px;
            height: 0px;
            margin-top: 4px;
          }
        }
      }
      .divactive {
        color: @main-color;
      }
    }
  }
  .content_box1 {
    padding: 156px 20px 0;
    .content_Item1 {
      width: 100%;
      height: 240px;
      display: flex;
      margin-bottom: 24px;
      .content_img {
        width: 240px;
        height: 240px;
        border-radius: 16px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content_text {
        flex: 1;
        padding-left: 28px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .content_text_top {
          .p1 {
            font-size: 24px;
            font-weight: bold;
            color: @text-colorA;
            line-height: 37px;
            margin-top: 12px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .p2 {
            display: flex;
            align-items: baseline;
            margin-top: 20px;
            .s1 {
              font-size: 32px;
              color: @main-color;
              i {
                font-style: normal;
                font-size: 20px;
              }
            }
            .s2 {
              font-size: 20px;
              color: @text-colorC;
              padding-left: 16px;
            }
          }
        }
        .content_text_bottom {
          margin-bottom: 12px;
          .p3 {
            display: flex;
            span {
              display: flex;
              font-size: 20px;
              border: 2px solid rgba(244, 38, 54, 1);
              border-radius: 4px;
              margin-right: 12px;
              color: @main-color;
              padding: 2px 4px;
            }
          }
          .p4 {
            display: flex;
            align-items: center;
            font-size: 20px;
            padding-top: 12px;
            .s1 {
              color: @text-colorD;
            }
            .s2 {
              color: @text-colorC;
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
  .content_box2 {
    padding: 156px 20px 0;
    background: @base-color;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .content_Item2 {
      width: 346px;
      background: @text-white;
      box-shadow: 0px 1px 21px 0px rgba(44, 49, 140, 0.1);
      border-radius: 16px;
      margin: 8px 0 12px 0;
      .content_img {
        width: 346px;
        height: 346px;
        border-radius: 16px 16px 0px 0px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content_text {
        padding: 20px 20px 30px 20px;
        .content_text_top {
          display: flex;
          flex-direction: column;
          height: 120px;
          justify-content: space-between;
          .p1 {
            font-size: 24px;
            font-weight: bold;
            color: @text-colorA;
            line-height: 37px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .p2 {
            display: flex;
            align-items: baseline;
            margin-top: 20px;
            .s1 {
              font-size: 32px;
              color: @main-color;
              i {
                font-style: normal;
                font-size: 20px;
              }
            }
            .s2 {
              font-size: 20px;
              color: @text-colorC;
              padding-left: 16px;
            }
          }
        }
        .content_text_bottom {
          .p3 {
            display: flex;
            margin-top: 40px;
            span {
              display: flex;
              font-size: 20px;
              border: 2px solid rgba(244, 38, 54, 1);
              // border: 2px transparent solid;
              // border-image: linear-gradient(
              //     to right,
              //     rgba(255, 137, 73, 1),
              //     rgba(244, 38, 54, 1)
              //   )
              //   1 10;
              border-radius: 4px;
              margin-right: 12px;
              color: @main-color;
              padding: 2px 4px;
            }
          }
          .p4 {
            display: flex;
            align-items: center;
            font-size: 20px;
            padding-top: 24px;
            .s1 {
              color: @text-colorD;
            }
            .s2 {
              color: @text-colorC;
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
  //筛选阴影
  .screen_shadow {
    width: 100%;
    height: 1005px;
    position: fixed;
    z-index: 10;
    top: 156px;
    transform: translateY(-1010px);
    background: #fff;
    border-top: 1px solid @base-color;
    border-radius: 0 0 16px 16px;
    transition: 0.5;
    .screen_shadow_box {
      height: 100%;
      box-sizing: border-box;
      padding: 0 28px 140px 48px;
      overflow-y: auto;
      .screen_shadow_item1 {
        .p1 {
          font-size: 28px;
          color: @text-colorD;
          height: 80px;
          display: flex;
          align-items: center;
        }
        .div_box {
          display: flex;
          flex-wrap: wrap;
          span {
            width: 168px;
            height: 68px;
            background: @base-color;
            border-radius: 8px;
            display: flex;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 30px;
            color: @text-colorB;
            padding: 0 10px;
            position: relative;
            overflow: hidden;
            border: 2px solid @base-color;
            i {
              background: @main-color;
              width: 50px;
              height: 50px;
              position: absolute;
              bottom: 0;
              right: 0;
              display: none;
              // align-items: center;
              // justify-content: center;
              border-radius: 50%;
              transform: translate(20px, 20px);
              img {
                width: 30px;
                height: 30px;
                padding: 2px 0 0 2px;
              }
            }
            .iActive {
              display: flex;
            }
          }
          .spanActive {
            border: 2px solid @main-color;
            color: @main-color;
            background: rgba(244, 38, 54, 0.1);
          }
        }
      }
      .screen_shadow_item2 {
        .p1 {
          font-size: 28px;
          color: @text-colorD;
          height: 80px;
          display: flex;
          align-items: center;
        }
        .div_box {
          display: flex;
          flex-wrap: wrap;
          span {
            min-width: 168px;
            height: 68px;
            background: @base-color;
            border-radius: 8px;
            display: flex;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 24px;
            margin-bottom: 24px;
            color: @text-colorB;
            padding: 0 10px;
            border: 2px solid @base-color;
            position: relative;
            overflow: hidden;
            i {
              background: @main-color;
              width: 50px;
              height: 50px;
              position: absolute;
              bottom: 0;
              right: 0;
              display: none;
              border-radius: 50%;
              transform: translate(20px, 20px);
              img {
                width: 30px;
                height: 30px;
                padding: 2px 0 0 2px;
              }
            }
            .region2active {
              display: flex;
            }
          }
          .regionactive {
            border: 2px solid @main-color;
            color: @main-color;
            background: rgba(244, 38, 54, 0.1);
          }
        }
      }
    }
    .screen_shadow_bottom {
      height: 140px;
      background: @text-white;
      width: 100%;
      position: absolute;
      bottom: 0;
      border-radius: 0 0 16px 16px;
      display: flex;
      align-items: center;
      .screen_bottom_box {
        width: 100%;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .b1 {
          width: 347px;
          height: 80px;
          border: 2px solid @auxiliary-color;
          border-radius: 40px;
          font-size: 32px;
          color: @auxiliary-color;
          background: @text-white;
          outline: none;
        }
        .b2 {
          width: 347px;
          height: 80px;
          border: 2px solid @main3-color;
          border-radius: 40px;
          font-size: 32px;
          color: @text-white;
          background: @main3-color;
          outline: none;
        }
      }
    }
  }
  .screen_shadow2 {
    width: 100%;
    height: 1005px;
    position: fixed;
    z-index: 10;
    top: 156px;
    transform: translateY(-0px);
    background: #fff;
    transition: 3s;
    border-top: 1px solid @base-color;
    border-radius: 0 0 16px 16px;
  }
  /deep/ .van-list__loading {
    font-size: 26px;
    line-height: 100px;
    text-align: center;
  }
  /deep/ .van-list__finished-text {
    font-size: 26px;
    line-height: 100px;
    text-align: center;
  }
}
.ProductListkong {
  // background: @text-white;
  .kong {
    width: 100%;
    .kong_box {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding-top: 200px;
      img {
        width: 265px;
        height: 250px;
      }
      .p1 {
        font-size: 32px;
        font-weight: 500;
        text-align: center;
        color: @text-colorB;
        margin-top: 70px;
        i {
          font-style: normal;
          color: @auxiliary-color;
        }
      }
      .p2 {
        font-size: 28px;
        text-align: center;
        color: @text-colorC;
        margin-top: 22px;
      }
    }
  }
}
</style>