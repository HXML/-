<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="title">
      <div>
        <img src="@/assets/images/home/b2c_home_ss@2x.png" alt />
      </div>
      <input type="text" :placeholder="placeholder" v-focus v-model="valuedata" />
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
    <!-- <div class="HotSearch">
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
    </div> -->
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
    placeholder: "", //默认值
    valuedata: "", //搜索的value
    SearchRecordsData: [], //搜索记录
    SearchRecordsData2: [],
    searchlist: [],
    HotSearchsData: [],
    SearchRecordsshow:false
  }),
  components: {},
  methods: {
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

      if (this.$cookies.isKey("SearchDataStroe")) {
        var str = this.$cookies.get("SearchDataStroe");
        this.searchlist = str.split(",");
        this.searchlist.push(this.valuedata);
        let arr2 = this.searchlist;
        let arrstroe = [...new Set(arr2)];
        console.log(arrstroe);
        this.$cookies.set("SearchDataStroe", arrstroe, "-1");
        
      } else {
        this.SearchRecordsData.push(this.valuedata);
        let arrstroe = this.SearchRecordsData;
        this.$cookies.set("SearchDataStroe", arrstroe, "-1");
      }

      this.$router.push({
        path: "/GoodsDetails/StoreProdList",
        query: { Keyword: this.valuedata }
      });
    },
    //清空历史记录
    empty(){
       this.$cookies.remove("SearchDataStroe");
       this.SearchRecordsData2=[];
       this.SearchRecordsshow=false
    },
    // 热门搜索
    GetHotSearchList(){
      GetHotSearchAPI('get').then(res=>{
        console.log(res.data,"热门搜索")
        let str=res.data;
        let arr=str.split(',')
        this.HotSearchsData=arr
        console.log(arr)
      })
    }
  },
  mounted() {
    this.valuedata = this.$route.query.ProductListSearchValue;
    this.GetHotSearchList();
    console.log(this.$cookies.isKey("SearchDataStroe"));

    if (this.$cookies.isKey("SearchDataStroe")) {
      this.SearchRecordsshow=true
      this.$cookies.get("SearchDataStroe");
      console.log(this.$cookies.get("SearchDataStroe"));
      var str = this.$cookies.get("SearchDataStroe");
      this.SearchRecordsData2 = str.split(",");
    }else{
      this.SearchRecordsshow=false
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
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    padding: 0 4%;
    img {
      //   width: 26px;
      height: 26px;
    }
    input {
      outline: none;
      border: none;
      padding-left: 24px;
      width: 520px;
      font-size: 28px;
    }
    span {
      font-size: 24px;
      font-weight: 500;
      color: @main-color;
    }
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
        align-items:center;
        img {
          // width: 16px;
          height: 24px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-left: 4px;
          padding-top:2px;
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
          padding: 8px 20px;
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }
  .HotSearch {
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
          padding: 8px 20px;
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>