<template>
  <div>
    <!-- 拼团 -->
    <div class="SpellGroup" v-if="groupDatalist.length != 0">
      <div class="top">已有{{ groupDatalist.length }}人参加拼团活动</div>
      <div class="bottom">
        <div class="bottom_box">
          <van-swipe
            :autoplay="4000"
            indicator-color="white"
            vertical
            :show-indicators="false"
            :touchable="false"
          >
            <van-swipe-item
              v-for="(item, index) in groupDatalistTow"
              :key="index"
            >
              <div
                class="item"
                v-for="(itemA, indexTow) in item"
                :key="indexTow"
              >
                <div class="left">
                  <img
                    :src="itemB.imgUrl + '?x-oss-process=style/n3'"
                    alt
                    v-for="(itemB, indexThree) in itemA.imgUserList"
                    :key="indexThree"
                  />
                </div>
                <div class="right">
                  <div class="d1">
                    <span class="s1"
                      >还差{{
                        itemA.limitPeopleNum - itemA.peopleNum
                      }}人成团</span
                    >
                    <span class="s2">
                      <span>剩余</span>
                      <van-count-down :time="itemA.time" />
                    </span>
                  </div>
                  <div class="d2">
                    <span
                      @click="
                        selectgroupsku(
                          itemA.actGroupId,
                          itemA.userId,
                          item[indexTow].imgUserList
                        )
                      "
                      >参团</span
                    >
                  </div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// 轮播图
import { Swipe, SwipeItem } from "vant";

import { CountDown } from "vant";
import { Toast } from "vant";

export default {
  name: "group",
  data() {
    return {
      actListlist: [], //所有活动
      groupData: [], //拼团活动
      groupDatalist: [], //拼团活动列表
      groupDatalistTow: [], //拼团活动列二维数组  以3个活动为一组
    };
  },
  props: ["actList"],
  components: {
    [CountDown.name]: CountDown,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
     [Toast.name]: Toast,
  },
  methods: {
    queryData(a) {
      console.log(a, "拼团动全部");

      if (a[0].actTypeNo == "TYPE_GROUP") {
        this.actListlist = a;
        // console.log(this.actListlist, "this.actListlist");

        var i = a.findIndex((value) => value.actTypeNo == "TYPE_GROUP");
        // console.log(i,"i");

        this.groupData = this.actListlist[i];

        // console.log(this.actListlist,"this.actListlist")
        console.log(this.groupData, "this.groupData");

        this.groupDatalist = this.groupData.grouplist.buyList;
        console.log(this.groupDatalist, "this.groupDatalist");
        let arr = [];

        arr = this.groupDatalist.map((item) => {
          return Object.assign({}, item, { time: 30 * 60 * 60 * 1000 });
        });
        //  var obj = new Date();
        //  var eTime = new Date(
        //     this.arr.timeOverTime.replace(new RegExp("-", "gm"), "/")
        //  );
        //  this.time = eTime - obj;
        arr.forEach((item) => {
          // console.log(item.timeOverTime)
          var obj = new Date();
          var eTime = new Date(
            item.timeOverTime.replace(new RegExp("-", "gm"), "/")
          );
          item.time = eTime - obj;
          // console.log(item.time)
        });

        this.groupDatalistTow = this.arrchange(arr, 3);

        console.log(this.groupDatalistTow, "将一维数组变成二维数组");
      }
    },
    // 将一维数组变成二维数组
    arrchange(arr, size) {
      // arr是一维数组 size是二维数组包含几条数据
      var arr2 = [];
      for (var i = 0; i < arr.length; i = i + size) {
        arr2.push(arr.slice(i, i + size));
      }
      return arr2; // 新的二维数组
    },
    // 点击选择sku  参团
    selectgroupsku(val, userId, arr) {
      // console.log(val,"valvalval")
      // console.log(userId,"userId")
      // console.log(window.localStorage.getItem('userId'),"window.localStorage.getItem('userId')")

      var isP = arr.findIndex(
        (value) => value.userId == window.localStorage.getItem("userId")
      );
      console.log(isP, "isP");
      if(isP!=-1){
        Toast("你已经在这个拼团活动中");
        return false;
      }
  
      let data = {
        actGroupId: val,
      };
      this.$emit("selectgroupsku", data);
    },
  },
  watch: {
    actList: function (a, b) {
      //a是value的新值，b是旧值
      if (a.length == 0) {
      } else {
        this.queryData(a);
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less">
// 拼团
.SpellGroup {
  padding: 0 20px;
  background: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
  .top {
    width: 100%;
    padding: 24px 0 12px;
    font-size: 28px;
    color: @text-colorA;
    font-weight: bold;
  }
  .bottom {
    width: 100%;
    .bottom_box {
      width: 100%;
      height: 390px;
      /deep/ .van-swipe {
        width: 100%;
        height: 390px;
        .van-swipe-item {
          // width: 100% !important;
          height: 390px !important;
        }
      }
      // .van-swipe{
      //    height: 390px !important;
      // }
      // .van-swipe-item {
      //   color: #fff;
      //   font-size: 20px;
      //   height:390px !important;
      //   text-align: center;
      //   background-color: #39a9ed;
      // }
    }
    .item {
      width: 100%;
      display: flex;
      align-items: center;
      height: 130px;
      border-bottom: 1px solid #f5f6f7;
      .left {
        flex: 1;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        img:nth-child(2) {
          margin-left: -20px;
        }
        img:nth-child(3) {
          margin-left: -20px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .d1 {
          display: flex;
          flex-direction: column;
          .s1 {
            font-size: 28px;
            color: @text-colorA;
            font-weight: bold;
          }
          .s2 {
            font-size: 28px;
            color: @text-colorC;
            padding-top: 6px;
            display: flex;
            align-items: center;
            .van-count-down {
              color: #7d828f;
              font-size: 28px;
            }
          }
        }
        .d2 {
          margin-left: 20px;
          span {
            width: 124px;
            height: 52px;
            background: linear-gradient(#e73a3a 0%, #f64242 100%);
            border-radius: 26px;
            box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: #fff;
          }
        }
      }
    }
    .item:last-child {
      border-bottom: none;
    }
  }
}
</style>