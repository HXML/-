<template>
  <div class="search">
    <!-- 搜索框 -->
    <div :class="titleshow?'title':'title title_boxactive'">
      <div class="title_box">
        <div class="title_d1">
          <img src="@/assets/images/home/b2c_home_ss@2x.png" alt />
        </div>
        <input
          type="text"
          :placeholder="placeholder"
          v-focus
          v-model="valuedata"
          @focus="PhoneFocus()"
          @blur="PhoneBlur()"
        />
      </div>
      <span @click="jumpProductList()">搜索</span>
    </div>

    <!-- 搜索记录 -->
    <div class="SearchRecords" v-show="SearchRecordsshow">
      <div class="top">
        <span class="s1">搜索记录</span>
        <div @click="empty()">
          <img src="@/assets/images/home/home_ss_qingkong@2x.png" alt />
          <span>清空</span>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li
            v-for="(item,index) in SearchRecordsData2"
            :key="index"
            @click="SearchRecordslist(item)"
          >{{item}}</li>
        </ul>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div class="HotSearch">
      <div class="top">
        <span class="s1">热门搜索</span>
      </div>
      <div class="bottom">
        <ul>
          <li
            v-for="(item,index) in HotSearchsData"
            :key="index"
            @click="HotSearchlist(item)"
          >{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { GetHotSearchAPI } from "@/api/index";

import Vue from "vue";
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

export default {
  name: "search",
  data: () => ({
    placeholder: "男装", //默认值
    valuedata: "", //搜索的value
    SearchRecordsData: [], //搜索记录
    SearchRecordsData2: [],
    searchlist: [],
    HotSearchsData: [],
    SearchRecordsshow: false,
    titleshow:false
  }),
  components: {},
  methods: {
    // 触发两个input焦点
    PhoneFocus() {
      this.titleshow = false;
    },
    // 失去两个input焦点
    PhoneBlur() {
      this.titleshow = true;
    },
    SearchRecordslist(item) {
      this.valuedata = item;
      this.jumpProductList();
    },
    HotSearchlist(item) {
      this.valuedata = item;
      this.jumpProductList();
    },
    // 点击搜索
    jumpProductList() {
      //带着搜索的值去查询 跳转去商品列表
      if (this.valuedata == undefined) {
        this.valuedata = this.placeholder;
      } else {
      }

      if (this.$cookies.isKey("SearchData")) {
        var str = this.$cookies.get("SearchData");
        this.searchlist = str.split(",");
        this.searchlist.push(this.valuedata);
        let arr2 = this.searchlist;
        let arr = [...new Set(arr2)];
        console.log(arr);
        this.$cookies.set("SearchData", arr, "-1");
      } else {
        this.SearchRecordsData.push(this.valuedata);
        let arr = this.SearchRecordsData;
        this.$cookies.set("SearchData", arr, "-1");
      }

      this.$router.push({
        path: "/ProductList",
        query: { Keyword: this.valuedata }
      });
    },
    //清空历史记录
    empty() {
      this.$cookies.remove("SearchData");
      this.SearchRecordsData2 = [];
      this.SearchRecordsshow = false;
    },
    // 热门搜索
    GetHotSearchList() {
      GetHotSearchAPI("get").then(res => {
        console.log(res.data, "热门搜索");
        let str = res.data;
        let arr = str.split(",");
        this.HotSearchsData = arr;
        console.log(arr);
      });
    }
  },
  mounted() {
    this.valuedata = this.$route.query.ProductListSearchValue;
    this.GetHotSearchList();
    console.log(this.$cookies.isKey("SearchData"));

    if (this.$cookies.isKey("SearchData")) {
      this.SearchRecordsshow = true;
      this.$cookies.get("SearchData");
      console.log(this.$cookies.get("SearchData"));
      var str = this.$cookies.get("SearchData");
      this.SearchRecordsData2 = str.split(",");
    } else {
      this.SearchRecordsshow = false;
    }
  },
  directives: {
    focus: {
      // 指令的定义
      // 当绑定元素插入到 DOM 中。

      inserted: function(el) {
        // 聚焦元素
        el.focus();
      }
      //也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
      //有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
      //update: function (el) {
      //el.focus()
      //}
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: @base-color;
  padding-top: 16px;
  box-sizing: border-box;
  .title {
    width: 86%;
    margin: auto;
    height: 88px;
    background: @text-white;
    border: 1px solid rgba(240, 240, 240, 1);
    border-radius: 44px;
    margin-bottom: 36px;
    display: flex;
    align-items: center;
    padding: 0 4%;
    .title_box {
      display: flex;
      align-items: center;
      flex: 1;
      .title_d1 {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          // width: 26px;
          height: 26px;
        }
      }
      input {
        outline: none;
        border: none;
        padding-left: 24px;
        font-size: 28px;
        width: 100%;
        caret-color: #f42636;
      }
    }
    span {
      font-size: 24px;
      font-weight: 500;
      color: @main-color;
    }
  }
  .title_boxactive{
     width: 86%;
    margin: auto;
    height: 88px;
    background: @text-white;
    border: 1px solid @main-color;
    border-radius: 44px;
    margin-bottom: 36px;
    display: flex;
    align-items: center;
    padding: 0 4%;
  }
  .SearchRecords {
    margin: 0 40px;
    .top {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      .s1 {
        flex: 1;
        font-size: 20px;
        color: @text-colorB;
      }
      div {
        display: flex;
        align-items: center;
        img {
          // width: 16px;
          height: 24px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-left: 4px;
          padding-top: 2px;
        }
      }
    }
    .bottom {
      width: 100%;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          background: @text-white;
          border-radius: 16px;
          font-size: 28px;
          color: @text-colorB;
          font-weight: 400;
          line-height: 40px;
          min-height: 40px;
          padding: 8px 20px;
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }
  .HotSearch {
    margin: 30px 40px 0;
    .top {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      .s1 {
        flex: 1;
        font-size: 20px;
        color: @text-colorB;
      }
    }
    .bottom {
      width: 100%;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          background: @text-white;
          border-radius: 16px;
          font-size: 28px;
          color: @text-colorB;
          font-weight: 400;
          line-height: 40px;
          min-height: 40px;
          padding: 8px 20px;
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>