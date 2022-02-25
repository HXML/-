<template>
  <div style="width:100%;height:100%;">
    <div class="Friends">
      
      <div class="kong" v-if="contentdata1.length==0">
        <div class="kong_box">
          <img src="@/assets/images/kong/haoyou@2x.png" alt />
          <p class="p1">这里孤零零的，一个人也没有</p>
          <p class="p2">邀请好友在商城内购买商品，可拿到现金返利哦</p>
          <button class="b1" @click="jumpInviteFriends()">邀请好友</button>
        </div>
      </div>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        v-else
      >
        <div class="content1">
          <div class="c1_box" v-for="(item,index) in contentdata1" :key="index">
            <div class="c_item">
              <div class="c_left">
                <img :src="item.imageUrl+'?x-oss-process=style/n3'" alt />
              </div>
              <div class="c_right">
                <span class="s1">{{item.nikeName}}</span>
                <span class="s2">{{item.invitedTime}}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    
    <loading ref="load" v-if="loadingshow"></loading>
  </div>
</template>


<script>
import Vue from "vue";
import { MyFriendsAPI } from "@/api/MyApi";

// 下拉处理
import { List } from "vant";
Vue.use(List);

import loading from "@/components/loading";

export default {
  name: "Friends",
  data() {
    return {
      titledata: "我的好友", //控制title的动态变量
      contentdata1: [],
      loading: false,
      finished: false,
      total: 0, //商品的总数量
      PIdx: 1, //商品页面的初始化的index
      loadingshow: true
    };
  },
  components: {
    loading: loading
  },
  methods: {
    // 我的好友列表
    MyFriends() {
      var data = {
        pIdx: this.PIdx,
        psize: 10
      };
      MyFriendsAPI(data, "get")
        .then(res => {
          console.log(res, "好友列表长度");
            this.total = res.total;
            this.PIdx++;
            this.contentdata1.push(...res.data.rows);
            this.loadingshow = false;
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          if (this.contentdata1.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.MyFriends();
    },
    //去链接分享邀请好友
    jumpInviteFriends() {
      this.$router.push({ path: "/My/InviteFriends" });
    }
  },
  mounted() {
    document.title = this.titledata;
    this.MyFriends();
  }
};
</script>

<style lang="less" scoped>
.Friends {
  width: 100%;
  background: @text-white;
  min-height: 100%;
  height: auto;
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
      }
      .p2 {
        font-size: 28px;
        text-align: center;
        color: @text-colorC;
        margin-top: 22px;
      }
      .b1 {
        width: 188px;
        height: 70px;
        background: @button-auxiliarybackground;
        border-radius: 35px;
        color: @text-white;
        border: none;
        font-size: 32px;
        margin-top: 76px;
      }
    }
  }
  .content1 {
    width: 100%;
    background: @text-white;
    .c1_box {
      width: 100%;
      .c_item {
        width: 100%;
        background: @text-white;
        height: 145px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #fff;
        .c_left {
          width: 104px;
          height: 104px;
          border-radius: 50%;
          margin-left: 20px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .c_right {
          flex: 1;
          padding: 0 47px 0 26px;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          border-bottom: 1px solid @base-color;
          .s1 {
            font-size: 28px;
            color: @text-colorA;
            padding-bottom: 10px;
          }
          .s2 {
            font-size: 20px;
            color: @text-colorD;
          }
        }
      }
    }
  }
}
</style>