<template>
  <div style="width:100%;height:100%;">

    <div :class="Addressdata.length==0?'UsedAddresskong':'UsedAddress'">
      <div class="kong" v-if="Addressdata.length==0">
        <div class="kong_box">
          <img src="@/assets/images/kong/kong_icon5@2x.png" alt />
          <p class="p1">还没有收货地址</p>
          <p class="p2">所有的收货地址都可以在这里管理哦</p>
          <button class="b1" @click="jumpAddAddress()">添加地址</button>
        </div>
      </div>

      <van-list
        v-model="loading"
        :immediate-check="false"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        v-if="Addressdata.length!=0"
      >
        <div class="content" v-for="(item,index) in Addressdata" :key="index">
          <van-swipe-cell @open="opencell(index)" @close="closecell(index)">
            <div
              class="c_item">
              <div class="left" @click="clickFlagTow && SelectAddress(item.consignee,item.consigneeMobile,item.province,item.city,item.userArea,item.consigneeAddress,item.id,item.provinceNo)">
                <span>{{item.consignee&&item.consignee[0]}}</span>
              </div>
              <div class="right">
                <div class="d1" @click="clickFlagTow && SelectAddress(item.consignee,item.consigneeMobile,item.province,item.city,item.userArea,item.consigneeAddress,item.id,item.provinceNo)">
                  <p>
                    <span class="s1" v-show="item.isDefault!==0?true:false">默认</span>
                    <span class="s2">{{item.consignee}}</span>
                    <span class="s3">{{item.consigneeMobile}}</span>
                  </p>
                  <p>{{item.province}}{{item.city}}{{item.userArea}}{{item.consigneeAddress}}</p>
                </div>
                <div class="d2" v-show="item.editshow" @click="EditorAddAddress(item.id)">
                  <span>编辑</span>
                </div>
              </div>
            </div>
            <template #right>
              <div @click="EditorAddAddress(item.id)">
                <img src="@/assets/images/mini_Collect_icon4@2x.png" alt />
                <span>编辑</span>
              </div>
              <div>
                <img src="@/assets/images/mini_Collect_icon2@2x.png" alt />
                <span @click="deleteAddress(item.id,item.userId,index)">删除</span>
              </div>
            </template>
          </van-swipe-cell>
        </div>
      </van-list>

      <div class="foot" v-if="Addressdata.length!=0">
        <span @click="jumpAddAddress()">新建收货地址</span>
      </div>
    </div>


    <loading ref="load" v-if="loadingshow"></loading>


  </div>
</template>

<script>
import Vue from "vue";
import {
  getlistAPI,
  DeleteUserAddressAPI,
  getAddressDefaultAPI
} from "@/api/MyApi";
import { SwipeCell, List } from "vant";

import loading from "@/components/loading";



Vue.use(SwipeCell);
Vue.use(List);

export default {
  name: "UsedAddress",
  data() {
    return {
      loading: false,
      finished: false,
      titledata: "常用地址", //控制title的动态变量
      Addressdata: [], // 请求列表参数
      pInd: 1, //初始化index
      total: 0, //一共有多少条
      clickFlag: false,
      clickFlagTow: false,
      obj: {},
      fromnum: 0,
      loadingshow:true
    };
  },
  components: {
    loading:loading
  },
  methods: {
    opencell(index) {
      this.Addressdata[index].editshow = false;
    },
    closecell(index) {
      this.Addressdata[index].editshow = true;
    },
    // 跳转到添加地址页面
    jumpAddAddress() {
      this.$router.replace({ path: "/My/UsedAddress/AddAddress" });
    },
    EditorAddAddress(id) {
      this.$router.replace({
        path: "/My/UsedAddress/AddAddress",
        query: { id: id }
      });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.getAddressList();
    },
    // 获取地址列表
    getAddressList() {
      //获取用户所有地址
      let data = {
        pInd: this.pInd++,
        pSize: 12,
        keyWord: ""
      };
      getlistAPI(data, "get")
        .then(res => {
          this.total = res.data.total;
          if (res.data.rows.length > 0) {
            console.log(res);
            // let arr = res.data.rows.filter(function(item) {
            //   return item.isDefault !== 1;
            // });
            let newList = res.data.rows.map(item => {
              return Object.assign({}, item, { editshow: true });
            });
            this.Addressdata.push(...newList);
            // let ids = this.Addressdata.filter(item => item.isDefault === 1);
            // console.log(ids);
            this.loadingshow=false
          }
        })
        .then(res => {
          // this.getDefault()
          this.loadingshow=false
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (this.Addressdata.length === this.total) {
            this.finished = true;
          }
        });
    },
    // //获取默认地址
    // getDefault() {
    //   getAddressDefaultAPI("get").then(res => {
    //     console.log(res, "获取默认地址");
    //     res = {
    //       ...res, // 遍历objc的所有属性
    //       editshow: true
    //     };

    //     this.Addressdata.unshift(res);

    //     console.log(this.Addressdata, "this.Addressdata");
    //   });
    // },
    deleteAddress(index, userID, delIndex) {
      //删除某一行
      let deleteData = {
        id: index //地址ID
        // UserId: userID //用户ID
      };
      // this.Addressdata.splice(delIndex, 1);
      DeleteUserAddressAPI(deleteData, "delete")
        .then(res => {
          console.log(res);
        })
        .then(res => {
          this.Addressdata.splice(delIndex, 1);
        });
    },
    // 点击地址选择地址返回上一级
    SelectAddress(
      name,
      tel,
      province,
      city,
      area,
      detailed,
      addid,
      provinceNo
    ) {
      //  console.log( Object.keys(this.obj)[0]," Object.keys(this.obj)[0]")
      //  console.log( Object.values(this.obj)[0]," Object.keys(this.obj)[0]")
      // localStorage.setItem("name", name);
      // localStorage.setItem("tel", tel);
      // localStorage.setItem("jointadd", jointadd);

      // let jointadd = province + city + area + detailed;
      // console.log(addid);

      let applyGood = {
        consignee: name,
        consigneeMobile: tel,
        province: province,
        city: city,
        userArea: area,
        consigneeAddress: detailed,
        id: addid,
        provinceNo: provinceNo
      };
      window.localStorage.setItem("applyParams", JSON.stringify(applyGood));
      // console.log(Object.values(this.obj)[1],"Object.values(this.obj)[1]")

      let idvalue = Object.values(this.obj)[0];
      let numvalue = Object.values(this.obj)[1];
      console.log(idvalue);

      if (this.fromnum == 1) {
        this.$router.push({
          path: "/GoodsDetails/OrderConfirmation",
          query: { id: idvalue, num: numvalue }
        });
      } else {
        this.$router.push({
          path: "/GoodsDetails/CartOrderConfirmation",
          query: { ids: idvalue }
        });
      }
    }
  },
  created() {
    this.getAddressList();
  },
  mounted() {
    document.title = this.titledata;

    // this.getDefault();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      // console.log(from.query);
      let oln = "/GoodsDetails/OrderConfirmation";
      let olnTow = "/GoodsDetails/CartOrderConfirmation";

      console.log(from.query);
      console.log(window.localStorage.getItem("frompathadd"), "sdaadsa");

      if (
        window.localStorage.getItem("frompathadd") == oln ||
        window.localStorage.getItem("frompathadd") == olnTow
      ) {
        vm.clickFlagTow = true;
        // vm.obj = from.query;
        if (window.localStorage.getItem("frompathadd") == oln) {
          // window.localStorage.setItem("frompathadd", from.path);
          // window.localStorage.setItem("fromqueryadd",JSON.stringify(from.query));
          vm.fromnum = 1;
          vm.obj = JSON.parse(window.localStorage.getItem("fromqueryadd"));
        } else if (window.localStorage.getItem("frompathadd") == olnTow) {
          vm.fromnum = 2;
          vm.obj = JSON.parse(window.localStorage.getItem("fromqueryadd"));
        }
      } else {
        vm.clickFlagTow = false;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.UsedAddress {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  padding-bottom: 135px;
  box-sizing: border-box;
  /deep/ .van-list__finished-text {
        font-size: 26px;
        line-height: 100px;
        text-align: center;
      }
      /deep/ .van-list__loading {
        font-size: 26px;
        line-height: 100px;
        text-align: center;
      }
  .content {
    width: 100%;
    .c_item {
      background: @text-white;
      display: flex;
      align-items: center;
      height: 152px;
      border-bottom: 1px solid @base-color;
      .left {
        // padding: 0 40px;
        width: 18vw;
        display: flex;
        justify-content: center;
        span {
          width: 68px;
          height: 68px;
          background: rgba(255, 241, 242, 1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: @main-color;
        }
      }
      .right {
        flex: 1;
        display: flex;
        .d1 {
          flex: 1;
          padding-right: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:nth-child(1) {
            display: flex;
            align-items: baseline;
            .s1 {
              width: 50px;
              height: 28px;
              font-size: 20px;
              background: @main-color;
              border-radius: 4px;
              color: @text-white;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 16px;
            }
            .s2 {
              font-size: 32px;
              color: @text-colorA;
            }
            .s3 {
              font-size: 24px;
              color: @text-colorC;
              padding-left: 16px;
            }
          }
          p:nth-child(2) {
            margin-top: 16px;
            font-size: 24px;
            color: @text-colorC;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // -webkit-line-clamp: 2;
            // -webkit-box-orient: vertical;
            // overflow: hidden;
          }
        }
        .d2 {
          width: 18vw;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 1px solid @text-colorD;
          span {
            font-size: 24px;
            color: @text-colorD;
          }
        }
      }
    }
    /deep/ .van-swipe-cell__right {
      display: flex;
      div {
        width: 18vw;
        height: 152px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          width: 32px;
          height: 32px;
          opacity: @opacityeight;
        }
        span {
          color: @text-white;
          font-size: 24px;
          padding-top: 12px;
        }
      }
      div:nth-child(1) {
        background: @button-auxiliarybackground;
      }
      div:nth-child(2) {
        background: @button-mainbackground;
      }
    }
  }
  .foot {
    position: fixed;
    width: 100%;
    height: 80px;
    bottom: 45px;
    color: @text-white;
    span {
      margin: 0 20px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @button-mainbackground;
      border-radius: 40px;
    }
    span:active {
      background: @button-mainbackground-on;
    }
  }
  
}
.UsedAddresskong {
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
}

</style>