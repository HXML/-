<template>

      <div class="shop_recommend" v-if="shopdata.length!=0">
            <div class="shop_recommend_title">
              <img src="@/assets/images/zk1.1/1.1_img_icon1@2x.png" alt />
              <span>您可能还喜欢</span>
              <img src="@/assets/images/zk1.1/1.1_img_icon1@2x.png" alt />
            </div>
              <div class="content2_main">
                <ul>
                  <li
                    v-for="(item,index) in shopdata"
                    :key="index"
                    @click="jumpGoodsDetails(item.id)"
                  >
                    <div class="goodimg">
                      <van-image lazy-load :src="item.mainImg+'?x-oss-process=style/b1'"></van-image>
                    </div>
                    <div class="goodtext">
                      <p class="p1">{{item.goodsName}}</p>
                      <p class="p2">
                        <span>
                          <i>￥</i>
                          {{item.price}}
                        </span>
                        <span>已售{{item.buyNum}}件</span>
                      </p>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
</template>

<script>
import Vue from "vue";
import { GetCouGoodsListAPI } from "@/api/other";

import { Image as VanImage } from "vant";
import { Lazyload } from "vant";



export default {
  name: "recommend",
  data() {
    return {
      shopdata: [], //推荐商品数组
    };
  },
  components: {
    [VanImage.name]: VanImage,
  },
  methods: {
    // 推荐商品
    GetCouGoodsListData() {
      GetCouGoodsListAPI("get").then((res) => {
        // console.log(res, "推荐商品");
        this.shopdata = res.data;
      });
    },
    // 跳转到商品详情
    jumpGoodsDetails(id) {
      console.log(id);
      console.log(this.$route.path);
      if(this.$route.path=='/GoodsDetails'){
        this.$router.replace({ path: "/GoodsDetails", query: { ID: id } });
        window.location.reload(); //强制刷新页面
      }else{
        this.$router.push({ path: "/GoodsDetails", query: { ID: id } });
      }
    },
  },
  mounted() {
     
  },
  created() {
    this.GetCouGoodsListData();
  }
};
</script>


<style lang="less" scoped>
.shop_recommend {
    width: 100%;
    background: #f5f6f7;
    .shop_recommend_title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 36px 0 24px;
      img {
        width: 30px;
        height: 30px;
      }
      span {
        color: @auxiliary-color;
        font-size: 32px;
        margin: 0 12px;
      }
    }
    .content2_main {
      width: 94%;
      margin: auto;
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 49%;
          background: @text-white;
          box-shadow: 0px 0px 16px 0px rgba(0, 10, 38, 0.06);
          border-radius: 16px;
          margin-bottom: 16px;
          .goodimg {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 347px;
            border-radius: 16px 16px 0px 0px;
            overflow: hidden;
            .van-image {
              width: 100%;
              height: 100%;
            }
            /deep/ .van-image__loading-icon {
              font-size: 80px !important;
            }
            /deep/ .van-image__error-icon {
              font-size: 80px !important;
            }
          }
          .goodtext {
            padding: 20px 12px;
            display: flex;
            flex-direction: column;
            height: 120px;
            justify-content: space-between;
            .p1 {
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              color: @text-colorA;
              font-size: 24px;
              line-height: 32px;
              font-weight: bold;
            }
            .p2 {
              display: flex;
              align-items: baseline;
              span:nth-child(1) {
                font-size: 32px;
                color: @main-color;
                i {
                  font-size: 28px;
                  font-style: normal;
                }
              }
              span:nth-child(2) {
                font-size: 20px;
                color: @text-colorD;
                padding-left: 8px;
              }
            }
          }
        }
      }
    }
  }
</style>
