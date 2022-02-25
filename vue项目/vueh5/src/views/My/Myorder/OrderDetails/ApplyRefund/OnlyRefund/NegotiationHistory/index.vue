<template>
  <div class="NegotiationHistory">
    <div class="content">
      
      <div
        :class="item.rtype==0?'content_box1':'content_box'"
        v-for="(item,index) in HistoryList"
        :key="index"
      >
        <div class="data">
          <span>{{item.creatorDate}}</span>
        </div>
        <div class="chat">

          <div class="d2" v-if="item.rtype!=0">
            <img :src="item.headImgStr+'?x-oss-process=style/b1'" alt />
          </div>

          <div class="d1">
            <div class="d1_box">
              <!-- <p>{{item.logBody}}，货物状态：未收到货，原因：{{item.reason}}，金额：888.90元</p> -->
              <p>{{item.logBody}}</p>
              <div v-for="(item,indexTow) in item.rejectImg" :key="indexTow">
                <img :src="item+'?x-oss-process=style/b1'" alt />
              </div>
            </div>
          </div>

          <div class="d2" v-if="item.rtype==0">
            <img :src="item.headImgStr+'?x-oss-process=style/b1'" alt />
          </div>


        </div>
      </div>

      <!-- <div class="content_box">
        <div class="data">
          <span>2020-05-15</span>
        </div>
        <div class="chat">
          <div class="d2">
            <img src="http://img.zk-mall.net/prod/logo.png?x-oss-process=style/b3" alt />
          </div>
          <div class="d1">
            <div class="d1_box">
              <p>发起了仅退款申请，货物状态：未收到货，原因：拍多/拍错/效果不好/不喜欢，金额：888.90元</p>
            </div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { GetReturnOrderModelAsyncAPI } from "@/api/MyApi";
export default {
  name: "NegotiationHistory",
  data() {
    return {
      HistoryList: []
    };
  },
  methods: {
    //协商历史获取
    GetReturnOrder() {
      let data = {
        Id: this.$route.query.id
      };
      GetReturnOrderModelAsyncAPI(data, "get").then(res => {
        console.log(res, "协商历史");
        this.HistoryList = res.data.logList;
        console.log(this.HistoryList);
      });
    }
  },
  mounted() {
    this.GetReturnOrder();
  }
};
</script>

<style lang="less" scoped>
.NegotiationHistory {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .content {
    padding: 0 40px;
    .content_box {
      width: 100%;
      .data {
        width: 100%;
        padding: 30px 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: @text-colorD;
      }
      .chat {
        display: flex;
        justify-content: flex-start;
        .d1 {
          width: 500px;
          .d1_box {
            background: @text-white;
            padding: 20px;
            box-shadow: @other-shadow;
            border-radius: 16px;
            position: relative;
            margin-left: 16px;
            p {
              font-size: 28px;
              color: @text-colorA;
              line-height: 46px;
            }
          }
          .d1_box:before {
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 12px solid transparent;
            border-right: 12px solid @text-white;
            position: absolute;
            top: 20px;
            left: -24px;
          }
        }
        .d2 {
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
        }
      }
    }
    .content_box1 {
      width: 100%;
      .data {
        width: 100%;
        padding: 30px 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: @text-colorD;
      }
      .chat {
        display: flex;
        justify-content: flex-end;
        .d1 {
          width: 500px;
          .d1_box {
            background: @text-white;
            padding: 20px;
            box-shadow: @other-shadow;
            border-radius: 16px;
            position: relative;
            margin-right: 16px;
            display: flex;
            flex-direction: column;
            p {
              font-size: 28px;
              color: @text-colorA;
              line-height: 46px;
            }
            div {
              display: flex;
              align-items: center;
              padding-top: 16px;
              img {
                width: 80px;
                height: 80px;
                border-radius: 2px;
                margin-right: 16px;
              }
            }
          }
          .d1_box:before {
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 12px solid transparent;
            border-left: 12px solid @text-white;
            position: absolute;
            top: 20px;
            right: -24px;
          }
        }
        .d2 {
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>