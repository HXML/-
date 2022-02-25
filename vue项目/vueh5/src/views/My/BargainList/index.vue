<template>
  <div style="width: 100%; height: 100%">
    <div class="BargainList">
      <div class="kong" v-if="BargainList.length == 0">
        <div class="kong_box">
          <img src="@/assets/images/1.5_img/1.5_kanjia_kong@2x.png" alt />
          <p class="p1">没有任何砍价记录呀</p>
          <!-- <p class="p2">邀请好友在商城内购买商品，可拿到现金返利哦</p>
          <button class="b1" @click="jumpInviteFriends()">邀请好友</button> -->
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
        <div class="content">
          <div
            class="item"
            v-for="(item, index) in BargainList"
            :key="index"
            @click="tzBargain(item.actBargainirgId)"
          >
            <div class="left">
              <img :src="item.goodsImg + '?x-oss-process=style/n4'" alt="" />
            </div>
            <!-- 正在砍价中 -->
            <div class="right" v-if="item.actStatus == 1">
              <div class="d1">
                {{ item.goodsName }}
              </div>
              <div class="d2">
                <p class="p1">
                  <span class="s1"
                    >当前价格￥{{ (item.skuPrice - item.bargainirgAmount)|toFixedTow }}</span
                  >
                  <span class="s2">¥{{ item.skuPrice }}</span>
                </p>
                <p class="p2">距离结束：<van-count-down :time="item.time" /></p>
              </div>
            </div>

            <!-- 砍价成功 -->
            <div class="rightTow" v-if="item.actStatus == 0">
              <div class="d1">
                {{ item.goodsName }}
              </div>
              <div class="d2">
                <p class="p1">
                  <span class="s1"
                    >当前价格￥{{ (item.skuPrice - item.bargainirgAmount) |toFixedTow}}</span
                  >
                  <span class="s2">¥{{ item.skuPrice }}</span>
                </p>
                <p class="p2">砍价成功，快来付款吧</p>
              </div>
            </div>

            <!-- 砍价过期 -->
            <div class="rightThree" v-if="item.actStatus == 2">
              <div class="d1">
                {{ item.goodsName }}
              </div>
              <div class="d2">
                <p class="p1">
                  <span class="s1"
                    >当前价格￥{{ (item.skuPrice - item.bargainirgAmount)|toFixedTow }}</span
                  >
                  <span class="s2">¥{{ item.skuPrice }}</span>
                </p>
                <p class="p2">当前商品已过期</p>
              </div>
            </div>
          </div>
        </div>
      </van-list>

      <loading ref="load" v-if="loadingshow"></loading>
    </div>
  </div>
</template>

<script>
import { MyBargainListAPI } from "@/api/activity";

import { CountDown } from "vant";
import { List } from "vant";
import loading from "@/components/loading";

import qs from "qs";

export default {
  name: "BargainList",
  components: {
    [CountDown.name]: CountDown,
    [List.name]: List,
    loading: loading,
  },
  data() {
    return {
      titledata: "我的砍价", //控制title的动态变量
      BargainList: [],
      loading: false,
      finished: false,
      PIdx: 1, //商品页面的初始化的index
      total: 0, //商品的总数量
      loadingshow: true,
    };
  },
  methods: {
    // 给个位数时间加0
    addPreZero(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },
    //获取砍价列表
    MyBargainList() {
      let data = {
        pindx: this.PIdx,
        psize: 10,
      };
      MyBargainListAPI(data, "get")
        .then((res) => {
          this.total = res.total;
          this.PIdx++;
          this.loadingshow = false;

          this.BargainList.push(
            ...res.data.rows.map((item) => {
              return Object.assign({}, item, { time: 30 * 60 * 60 * 1000 });
            })
          );
          console.log(this.BargainList, "this.BargainList");

          this.BargainList.forEach((item) => {
            var obj = new Date();
            var eTime = new Date(
              item.endTime.replace(new RegExp("-", "gm"), "/")
            );
            item.time = eTime - obj;
          });
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.BargainList.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.MyBargainList();
    },
    tzBargain(id) {
      this.$router.push({
        path: "/GoodsDetails/Bargain",
        query: { barginId: id },
      });
    },
  },
  mounted() {
    document.title = this.titledata;
    this.MyBargainList();
  },
};
</script>

<style lang="less" scoped>
.BargainList {
  width: 100%;
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
  .content {
    width: 100%;
    padding-top: 24px;
    .item {
      padding: 0 0 0 24px;
      display: flex;
      margin-bottom: 24px;
      .left {
        img {
          width: 240px;
          height: 240px;
          border-radius: 16px;
        }
      }
      .right {
        height: 216px;
        flex: 1;
        padding: 0 24px 0 34px;
        margin: 24px 12px 0 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: url("../../../assets/images/1.5_img/1.5_kanjia_zhong@2x.png")
          no-repeat;
        background-position: right top;
        background-size: 131px 131px;
        .d1 {
          //   margin-top: 24px;
          font-size: 28px;
          color: #000a26;
          line-height: 37px;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .d2 {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .p1 {
            display: flex;
            align-items: baseline;
            .s1 {
              font-size: 30px;
              text-align: left;
              color: #f42636;
              line-height: 30px;
              font-weight: bold;
              flex: 1;
            }
            .s2 {
              font-size: 24px;
              text-align: left;
              color: rgba(125, 130, 143, 1);
              line-height: 30px;
              padding-left: 12px;
            }
          }
          .p2 {
            font-size: 24px;
            color: rgba(125, 130, 143, 1);
            padding-top: 12px;
            display: flex;
            align-items: center;
            .van-count-down {
              color: rgba(125, 130, 143, 1);
              font-size: 24px;
            }
          }
        }
      }
      .rightTow {
        height: 216px;
        flex: 1;
        padding: 0 24px 0 34px;
        margin: 24px 12px 0 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: url("../../../assets/images/1.5_img/1.5_kanjia_ok@2x.png")
          no-repeat;
        background-position: right top;
        background-size: 131px 131px;
        .d1 {
          //   margin-top: 24px;
          font-size: 28px;
          color: #000a26;
          line-height: 37px;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .d2 {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .p1 {
            display: flex;
            align-items: baseline;
            .s1 {
              font-size: 30px;
              text-align: left;
              color: #f42636;
              line-height: 30px;
              font-weight: bold;
              flex: 1;
            }
            .s2 {
              font-size: 24px;
              text-align: left;
              color: rgba(125, 130, 143, 1);
              line-height: 30px;
              padding-left: 12px;
            }
          }
          .p2 {
            font-size: 24px;
            color: rgba(125, 130, 143, 1);
            padding-top: 12px;
            display: flex;
            align-items: center;
            .van-count-down {
              color: rgba(125, 130, 143, 1);
              font-size: 24px;
            }
          }
        }
      }
      .rightThree {
        height: 216px;
        flex: 1;
        padding: 0 24px 0 34px;
        margin: 24px 12px 0 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: url("../../../assets/images/1.5_img/1.5_kanjia_shixiao@2x.png")
          no-repeat;
        background-position: right top;
        background-size: 131px 131px;
        .d1 {
          //   margin-top: 24px;
          font-size: 28px;
          color: rgba(177, 182, 195, 1);
          line-height: 37px;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .d2 {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .p1 {
            display: flex;
            align-items: baseline;
            .s1 {
              font-size: 30px;
              text-align: left;
              color: rgba(177, 182, 195, 1);
              line-height: 30px;
              font-weight: bold;
              flex: 1;
            }
            .s2 {
              font-size: 24px;
              text-align: left;
              color: rgba(177, 182, 195, 1);
              line-height: 30px;
              padding-left: 12px;
            }
          }
          .p2 {
            font-size: 24px;
            color: rgba(177, 182, 195, 1);
            padding-top: 12px;
            display: flex;
            align-items: center;
            .van-count-down {
              color: rgba(177, 182, 195, 1);
              font-size: 24px;
            }
          }
        }
      }
    }
  }
}
</style>