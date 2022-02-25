<template>
  <div class="ProprietaryClass">
    <div class="content">
      <div class="left">
        <ul>
          <li
            v-for="(item, index) in LeftList"
            :key="index"
            @click="clickLeftList(index, item)"
            :class="{ active: activeName == index }"
          >
            {{ item.categoryName }}
          </li>
        </ul>
      </div>

      <div class="right">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div
            class="right_item"
            v-for="(item, index) in arrayTwo"
            :key="index"
          >
            <div class="top">
              <span>{{ item.name }}</span>
            </div>
            <div class="bottom">
              <ul>
                <li
                  v-for="(itemA, indexTow) in item.list"
                  :key="indexTow"
                  class="main2_item"
                  @click="jumpGood(itemA.id)"
                >
                  <div class="li_top">
                    <img
                      :src="itemA.mainImg + '?x-oss-process=style/b1'"
                      alt=""
                    />
                  </div>
                  <div class="li_bottom">
                    <div class="d1">
                      {{ itemA.goodsName }}
                    </div>
                    <div class="d2">
                      <p class="p1">
                        <span>¥</span>{{ itemA.price | toFixedTow }}
                      </p>
                      <p class="p2">已售{{ itemA.buyNum }}件</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <tabbarTow ref="tab"></tabbarTow>
  </div>
</template>

<script>
import {
  GetGoodsShopCategoryListAPI,
  ShopPickupPointGoodsListAPI,
} from "@/api/Proprietary";
import { List } from "vant";

import tabbarTow from "@/components/tabbarTow";
export default {
  name: "ProprietaryClass",
  data() {
    return {
      id: "", //点击一级列表的id
      LeftList: [],
      activeName: 0, //左边列表定义的高亮值
      shopdata: [], //右边的商品列表
      arrayTwo: [],
      loading: false,
      finished: false,
      PIdx: 1, //商品页面的初始化的index
      total: 0, //商品的总数量
    };
  },
  components: {
    tabbarTow: tabbarTow,
    [List.name]: List,
  },
  methods: {
    // 左边列表的高亮
    clickLeftList(index, item) {
      this.activeName = index;
      for (const key in this.LeftList) {
        if (key == index) {
          this.id = item.id;
          this.PIdx = 1;
          this.shopdata = [];
          this.loading = true;
          this.finished = false;
          this.ShopPickupPointGoodsList(this.id);
        }
      }
    },
    //获取左边列表的数据
    GetGoodsShopCategoryList() {
      if (this.$route.query.ShopId) {
        var ShopId = this.$route.query.ShopId;
      } else {
        var ShopId = window.localStorage.getItem("ShopId");
      }
      let data = {
        shopCategoryId: window.localStorage.getItem("shopCategoryId"),
        shopId: ShopId,
      };
      GetGoodsShopCategoryListAPI(data, "get").then((res) => {
        this.LeftList = res.data;
        this.id = res.data[0].id;
        this.ShopPickupPointGoodsList(this.id);
      });
    },
    // 点击一级分类显示二级产品分类以及商品
    ShopPickupPointGoodsList(id) {
      let data = {
        shopCategoryId: id,
        pageIndex: this.PIdx++,
        pageSize: 5,
      };
      ShopPickupPointGoodsListAPI(data, "get")
        .then((res) => {
          this.total = res.data.total;
          this.shopdata.push(...res.data.rows);

          // 转换后的二维数组
          var arrayOne = Object.values(
            this.shopdata.reduce((res, item) => {
              res[item.twoShopCategoryId]
                ? res[item.twoShopCategoryId].push(item)
                : (res[item.twoShopCategoryId] = [item]);
              return res;
            }, {})
          );

          this.arrayTwo = arrayOne.map((item) => {
            return {
              name: item[0].categoryName,
              list: item,
            };
          });

          console.log(this.arrayTwo, "2this.arrayTwo");
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.shopdata.length === this.total) {
            this.finished = true;
          }
        });
    },
    jumpGood(id) {
      this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.ShopPickupPointGoodsList(this.id);
    },
  },
  mounted() {
    this.$refs.tab.active = 1; //父组件通过$refs获取子组件的值
    document.title = "商品分类";
    this.GetGoodsShopCategoryList();
  },
};
</script>

<style lang="less" scoped>
.ProprietaryClass {
  width: 100%;
  height: 100%;
  background: @base-color;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: 24%;
      height: 100%;
      background: @text-white;
      ul {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        padding-bottom: 120px;
        li {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: @text-colorA;
          font-size: 28px;
          font-weight: 500;
        }
        .active {
          color: @main-color;
          background: @base-color;
        }
      }
    }
    .right {
      width: 76%;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 0 20px 130px;
      .right_item {
        width: 100%;
        .top {
          width: 100%;
          padding: 40px 0 20px;
          span {
            font-size: 28px;
            color: @text-colorB;
            font-weight: bold;
          }
        }
        .bottom {
          width: 100%;
          ul {
            width: 100%;
            .main2_item {
              width: 100%;
              background: @text-white;
              border-radius: 16px;
              margin-bottom: 24px;
              box-shadow: 0px 4px 8px 0px rgba(0, 11, 38, 0.06);
              .li_top {
                width: 100%;
                height: 400px;
                overflow: hidden;
                border-radius: 16px 16px 0 0;
                img {
                  width: 100%;
                  height: 100%;
                  // object-fit: cover;
                }
              }
              .li_bottom {
                padding: 24px;
                .d1 {
                  font-size: 26px;
                  color: @text-colorA;
                  line-height: 38px;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
                .d2 {
                  display: flex;
                  align-items: center;
                  padding-top: 24px;
                  .p1 {
                    font-size: 30px;
                    color: rgba(244, 39, 55, 1);
                    flex: 1;
                    span {
                      font-size: 20px;
                    }
                  }
                  .p2 {
                    font-size: 24px;
                    color: @text-colorD;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>