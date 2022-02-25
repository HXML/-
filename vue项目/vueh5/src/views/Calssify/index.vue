<template>
  <div class="Calssify">
    <!-- 分类 搜索 -->
    <div class="Calssify_search">
      <input type="text" :placeholder="SearchPlaceholder" @click="jumpSearch()" />
      <img src="@/assets/images/home/b2c_home_ss@2x.png" alt />
    </div>

    <!-- 内容 -->
    <div class="Calssify_main">
      <div class="Calssify_main_left">
        <ul>
          <li
            v-for="(item,index) in LeftList"
            :key="index"
            @click="clickLeftList(index)"
            :class="{active: activeName == index}"
          >{{item.categoryName}}</li>
        </ul>
      </div>
      <div class="Calssify_main_right">
        <!-- <div class="main_banner">
          <img src="@/assets/images/home/banner1.png" alt />
        </div>-->
        <div class="main_content">
          <div class="main_content_item" v-for="(item,index) in rightList" :key="index">
            <div class="top">
              <span>{{item.categoryName}}</span>
            </div>
            <div class="bottom">
              <ul>
                <li
                  v-for="(itemA,indextow) in item.mlist"
                  :key="indextow"
                  @click="jumpProductList(itemA.id)"
                >
                  <van-image lazy-load :src="itemA.imageUrl+'?x-oss-process=style/n4'">
                    <template v-slot:loading>
                      <img :src="itemA.imageUrl+'?x-oss-process=style/n4-s'" class="IMGGGG" />
                    </template>
                    <template v-slot:error>
                      <van-icon name="photograph" />
                    </template>
                  </van-image>
                  <span>{{itemA.categoryName}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from "vue";

import { Image as VanImage } from "vant";
import { Lazyload, Icon } from "vant";

import {
  GetBusGoodsCategorylistAPI,
  GetBusGoodsCategoryNextlistAPI,
} from "@/api/MyApi";

export default {
  name: "Calssify",
  data() {
    return {
      SearchPlaceholder: "搜索商品名称",
      activeName: 0, //左边列表定义的高亮值
      LeftList: [],
      rightList: [],
      LeftPId: 0, //左边列表的id值
    };
  },
  components: {
    [VanImage.name]: VanImage,
    [Lazyload.name]: Lazyload,
    [Icon.name]: Icon,
  },
  methods: {
    jumpSearch() {
      this.$router.push({ path: "/Search" });
    },
    // 左边列表的高亮
    clickLeftList(index) {
      this.activeName = index;
      for (const key in this.LeftList) {
        if (key == index) {
          this.GetBusGoodsCategoryNextlistData(this.LeftList[key].id);
        }
      }
    },
    //点击3级分类中的商品
    jumpProductList(id) {
      //  console.log(id)
      this.$router.push({ path: "/ProductList", query: { ID: id } });
    },
    // 一级列表
    GetBusGoodsCategorylistData() {
      let data = {
        CategoryLevel: 1,
      };
      GetBusGoodsCategorylistAPI(data, "get").then((res) => {
        console.log(res, "左边的一级列表");
        this.LeftList = res.data;
        this.LeftPId = res.data[0].id;
        this.GetBusGoodsCategoryNextlistData(this.LeftPId);
      });
    },
    //二级 三级列表
    GetBusGoodsCategoryNextlistData(LeftPId) {
      // console.log(LeftPId)
      let datatow = {
        CategoryLevel: 2,
        PId: LeftPId,
      };
      GetBusGoodsCategoryNextlistAPI(datatow, "get").then((res) => {
        console.log(res, "右边的二级 三级列表");

        this.rightList = res.data;
      });
    },
  },
  mounted() {
   

    document.title = "分类";
    this.GetBusGoodsCategorylistData();
  },
  activated() {
    document.title = "分类";
  },
};
</script>

<style lang="less" scoped>
.IMGGGG {
  width: 140px;
  height: 140px;
}

.van-icon-photograph {
  font-size: 60px;
}
.Calssify {
  width: 100%;
  height: 100%;
  background: @base-color;
  .Calssify_search {
    position: fixed;
    height: 96px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @base-color;
    input {
      text-indent: 60px;
      border: @border-colorD;
      background: @text-white;
      width: 94%;
      height: 68px;
      border-radius: 34px;
      font-size: 28px;
    }
    img {
      width: 26px;
      height: 26px;
      position: absolute;
      top: 36px;
      left: 40px;
    }
  }
  .Calssify_main {
    width: 100%;
    height: 100%;
    padding-top: 96px;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    .Calssify_main_left {
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
    .Calssify_main_right {
      width: 76%;
      overflow-y: auto;
      box-sizing: border-box;
      padding-bottom: 130px;
      .main_banner {
        width: 96%;
        height: 158px;
        border-radius: 10px;
        margin: 12px auto;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .main_content {
        width: 96%;
        margin: auto;
        .main_content_item {
          display: flex;
          flex-direction: column;
          .top {
            span {
              padding: 36px 0 16px 0;
              font-weight: bold;
              color: @text-colorA;
              font-size: 28px;
              display: flex;
            }
          }
          .bottom {
            width: 100%;
            background: @text-white;
            border-radius: 16px;
            ul {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              li {
                width: 33.3%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                margin: 20px 0;
                /deep/ .van-image {
                  width: 140px;
                  height: 140px;
                }
                /deep/ .van-image__loading-icon {
                  font-size: 80px !important;
                }
                /deep/ .van-image__error-icon {
                  font-size: 80px !important;
                }
                span {
                  display: flex;
                  width: 140px;
                  font-size: 24px;
                  color: @text-colorC;
                  padding-top: 20px;
                  line-height: 32px;
                  justify-content: center;
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