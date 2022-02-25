<template>
  <div style="width:100%;height:100%;">
    <div :class="MessageList.length==0?'messagekong':'message'">
      <div class="kong" v-if="MessageList.length==0">
        <div class="kong_box">
          <img src="@/assets/images/kong/kong_icon1@2x.png" alt />
          <p class="p1">没任何消息提醒呢</p>
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
        <div class="main" v-for="(item,index) in MessageList" :key="index">
          <div class="main_title">
            <span>{{item.creatorDate}}</span>
          </div>
          <div class="main_content">
            <div class="top">
              <!-- <img src="@/assets/images/mine_avatar@2x.png" alt /> -->
              
              <img src="@/assets/images/logo.png" alt v-if="item.messageType==11||item.messageType==2||item.messageType==3||item.messageType==30||item.messageType==41" />
              <img :src="item.shopImgUrl+'?x-oss-process=style/b1'" alt v-else />
             
              <span v-if="item.messageType==11||item.messageType==2||item.messageType==3||item.messageType==30||item.messageType==41">兆客易购平台</span>
              <span v-else>{{item.shopName}}</span>
            </div>
            <div class="bottom" @click="bannerhref(item.jumpUrl)">
              <div class="main_item">
                
                <div class="d3" v-if="item.messageType==11||item.messageType==2||item.messageType==3||item.messageType==30"></div>
                <div class="d1" v-else>
                  <span>{{item.title}}</span>
                </div>

                <div class="d2">
                  <img :src="item.imgUrl+'?x-oss-process=style/b1'" v-if="item.imgUrl" alt />
                  <p>{{item.message}}</p>
                </div>
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
import { GetUserMessageAPI } from "@/api/index";
import { EventBus } from "@/common/js/event-bus.js";
import loading from "@/components/loading";

import { List } from "vant";

export default {
  name: "message",
  data() {
    return {
      MessageList: [],
      loading: false,
      finished: false,
      PIdx: 1, //商品页面的初始化的index
      total: 0, //商品的总数量
      loadingshow:true,
      titledata: "消息", //控制title的动态变量
    };
  },
  components: {
    [List.name]: List,
    loading:loading
  },
  methods: {
    bannerhref(linkUrl) {
      window.open(linkUrl, "_self");
      //  "_blank"  新打开一个窗口
      //  "_self"    覆盖当前的窗口
    },
    GetUserMessagedata() {
      let data = {
        pIdx: this.PIdx++,
        pSize: 5
      };
      GetUserMessageAPI(data, "get")
        .then(res => {
          console.log(res, "获取信息列表");
          this.total = res.data.total;
          this.MessageList.push(...res.data.rows);
          this.loadingshow=false
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          if (this.MessageList.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetUserMessagedata();
    }
  },
  mounted() {
    document.title = this.titledata;
    this.GetUserMessagedata();
  }
};
</script>

<style lang="less" scoped>
.message {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: @base-color;
  padding-bottom: 140px;
  box-sizing: border-box;
  .main {
    width: 96%;
    margin: auto;
    padding-top: 12px;
    .main_title {
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 24px;
        color: @text-colorD;
      }
    }
    .main_content {
      width: 100%;
      box-shadow: 0px 1px 21px 0px rgba(44, 49, 140, 0.1);
      border-radius: 16px;
      background: @text-white;
      padding-bottom: 16px;
      .top {
        height: 86px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid @base-color;
        padding: 0 34px;
        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        span {
          font-size: 28px;
          color: @text-colorB;
          padding-left: 20px;
        }
      }
      .bottom {
        padding: 0 34px;
        .main_item {
          width: 100%;
          margin-bottom: 12px;
          .d1 {
            height: 70px;
            font-size: 28px;
            font-weight: bold;
            display: flex;
            align-items: center;
          }
          .d2 {
            display: flex;
            border-radius: 8px;
            background: @base-color;
            padding: 12px;
            align-items: flex-start;
            img {
              width: 120px;
              height: 120px;
              border-radius: 8px;
            }
            p {
              flex: 1;
              padding-left: 12px;
              padding-top: 12px;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              font-size: 24px;
              line-height: 38px;
              color: @text-colorC;
            }
          }
          .d3{
            height: 40px;
          }
        }
      }
    }
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
.messagekong {
  background: @text-white;
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
    }
  }
}
</style>