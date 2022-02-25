<template>
  <div class="AddAddress">
    <div class="content">
      <ul>
        <li>
          <span class="s1">收件人</span>
          <input type="text" placeholder="姓名" v-model="submitData.consignee" />
        </li>
        <li>
          <span>手机号码</span>
          <input
            type="number"
            placeholder="能联系到您的电话号码"
            v-model="submitData.consigneeMobile"
            oninput="if(value.length>11)value=value.slice(0,11)"
          />
        </li>
        <li>
          <span>所在地区</span>
          <div class="add">
            <p type="text" @click="selectadd" :class="pactive?'pactive':''">{{areacontent}}</p>
            <img src="@/assets/images/mine_dropdown@2x.png" alt />
          </div>
        </li>
        <li>
          <span>详细地址</span>
          <input placeholder="街道、楼牌号等" v-model="submitData.consigneeAddress" />
        </li>
      </ul>
      <div class="Choicedefault">
        <van-checkbox v-model="checked" checked-color="#F42636" @click="checkedChange"></van-checkbox>
        <span :class="checked?'addA':''">设为默认地址</span>
      </div>
    </div>

    <van-overlay :show="show" @click="noshow" />
    <van-area
      :area-list="areaList"
      :value="submitData.AreaId"
      :search-result="searchResult"
      :style="transy?'transform:translateY(-280px)':''"
      @cancel="cancel()"
      @confirm="confirm"
      title="选择地址"
    />
    <div class="foot">
      <span
        @click="saveMessage(submitData.id)"
        :class="submitData.consignee&&submitData.consigneeMobile&&submitData.consigneeAddress&&areacontent!=='选择省市区县'?'enalbleClick':''"
      >保存信息</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// import areaList from "../../../../assets/js/area.js";
// 地址
import { Area } from "vant";
Vue.use(Area);

// 遮罩层
import { Overlay } from "vant";
Vue.use(Overlay);

import { Checkbox, CheckboxGroup } from "vant";
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
 
import {
  PostAddUserAddressAPI,
  addressUpdateAPI,
  GetUserAddressAPI,
  PhoneUserAddressAPI,
  getlistAPI
} from "@/api/MyApi";

import { GetDefaultUserAddressAPI } from "@/api/index";

export default {
  name: "AddAddress",
  data() {
    return {
      areaList: JSON.parse(window.localStorage.getItem("areaList")),
      searchResult: [],
      transy: false,
      show: false,
      areaId: "",
      areacontent: "选择省市区县",
      checked: false,
      pactive: false,
      submitData: {
        AreaId: "440309",
        id: 0,
        userId: 0,
        consignee: "",
        consigneeMobile: "",
        consigneeAddress: "",
        provinceNo: "",
        province: "",
        city: "",
        userArea: "",
        lon: 0,
        lat: 0,
        isDefault: 0,
        creatorDate: new Date()
      },
      list: 0,
      path: false,
      obj: {},
      pathTow: false,
      objTow: {}
    };
  },
  components: {},
  methods: {
    checkedChange() {
      //点击单选
      this.submitData.isDefault = this.checked ? 0 : 1;
      console.log(this.checked);
      console.log(this.submitData.isDefault);
    },
    // 点击选择省市区
    selectadd() {
      this.show = true;
      this.transy = true;
    },
    // 点击遮罩层关闭遮罩层和area
    noshow() {
      this.show = false;
      this.transy = false;
    },
    // 点击取消关闭遮罩层和area
    cancel() {
      this.show = false;
      this.transy = false;
    },
    // 点击取消关闭遮罩层和area和拿到值
    confirm(value) {
      console.log(value, "value");
      // var add = "";
      // for (var i = 0; i < value.length; i++) {
      //   add += value[i].name;
      // }
      this.submitData.AreaId = value[2].code;
      this.submitData.province = value[0].name;
      this.submitData.provinceNo = value[0].code;
      this.submitData.city = value[1].name;
      this.submitData.userArea = value[2].name;
      this.areacontent = value[0].name + value[1].name + value[2].name;

      this.show = false;
      this.transy = false;
      this.pactive = true;
    },
    saveMessage(id) {
      if (id) {
        let data = this.submitData;
        PhoneUserAddressAPI(data, id, "PUT").then(res => {
          console.log(res, "编辑地址");
          this.$router.replace({ path: "/My/UsedAddress" });
        });
      } else {
        //保存信息
        let data = this.submitData;
        PostAddUserAddressAPI(data, "post").then(res => {
          console.log(res, "保存信息");

          console.log(this.path, "this.path");
          console.log(this.pathTow, "this.pathTow");

          if (this.path||this.pathTow) {
            this.GetDefaultAdd();
          } else {
            this.$router.replace({ path: "/My/UsedAddress" });
          }
        });
      }
    },
    //获取默认地址
    GetDefaultAdd() {
      GetDefaultUserAddressAPI("get").then(res => {
        console.log(res, "获取默认地址");
        let applyGood = {
          consignee: res.data.consignee,
          consigneeMobile: res.data.consigneeMobile,
          province: res.data.province,
          city: res.data.city,
          userArea: res.data.userArea,
          consigneeAddress: res.data.consigneeAddress,
          id: res.data.id,
          provinceNo: res.data.provinceNo
        };
        window.localStorage.setItem("applyParams", JSON.stringify(applyGood));

        if (this.path) {
          let id = Object.values(this.obj)[0];
          let num = Object.values(this.obj)[1];
          this.$router.push({
            path: "/GoodsDetails/OrderConfirmation",
            query: { id: id, num: num }
          });
        }

        if (this.pathTow) {
          let id = Object.values(this.objTow)[0];
          this.$router.push({
            path: "/GoodsDetails/CartOrderConfirmation",
            query: { ids: id }
          });
        }

      });
    },
    //获取用户所有地址
    getAddressList() {
      let data = {
        pInd: 1,
        pSize: 8
      };
      getlistAPI(data, "get").then(res => {
        console.log(res.data.rows.length, "获取用户所有地址");
        if (res.data.rows.length == 0) {
          this.list = 0;
          this.checked = true;
          this.submitData.isDefault = 1;
        } else {
          this.list = res.data.rows.length;
        }
      });
    }
  },
  mounted() {
    if (this.$route.query.id) {
      let data = {
        ID: this.$route.query.id
      };
      GetUserAddressAPI(data, "get").then(res => {
        this.submitData = res.data;
        this.areacontent =
          res.data.province + res.data.city + res.data.userArea;
        this.pactive = true;

        if (res.data.isDefault == 1) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      });
    }

    this.getAddressList();
    console.log(this.areaList, " this.areaList");
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      console.log(from.query);
      let oln = "/GoodsDetails/OrderConfirmation";
      let olnTow = "/GoodsDetails/CartOrderConfirmation";

      if (from.path == oln) {
        // console.log("yes");
        vm.obj = from.query;
        vm.path = true;
        vm.pathTow = false;
      } else if (from.path == olnTow) {
        vm.objTow = from.query;
        vm.pathTow = true;
        vm.path = false;
      } else {
        // console.log("no");
        vm.path = false;
        vm.pathTow = false;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.AddAddress {
  width: 100%;
  background: @text-white;
  min-height: 100%;
  height: auto;
  .content {
    width: 100%;
    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      li {
        display: flex;
        height: 98px;
        align-items: center;
        border-bottom: 1px solid @base-color;
        span {
          padding-left: 44px;
          font-size: 32px;
          color: @text-colorA;
          font-weight: 400;
          flex: 1;
        }
        .s1 {
          letter-spacing: 2.2vw;
        }
        input {
          font-size: 28px;
          font-weight: 400;
          flex: 3.2;
          padding-right: 27px;
          outline: none;
          border: none;
          color: @text-colorA;
        }
        input::-webkit-input-placeholder {
          color: @text-colorD;
        }
        .add {
          flex: 3.2;
          display: flex;
          align-items: center;
          padding-right: 27px;
          p {
            flex: 1;
            font-size: 28px;
            color: @text-colorD;
          }
          .pactive {
            color: @text-colorA;
          }
          img {
            width: 12px;
            height: 24px;
          }
        }
      }
    }
  }
  /deep/ .van-picker {
    position: fixed;
    bottom: -280px;
    width: 100%;
    transition: 0.6s;
    z-index: 99;
    box-shadow: 0px 7px 27px 0px rgba(0, 0, 0, 0.14);
    border-radius: 16px 16px 0px 0px;
  }
  /deep/ .van-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
  .Choicedefault {
    padding-left: 43px;
    display: flex;
    align-items: center;
    padding-top: 40px;
    /deep/ .van-checkbox {
      width: 18px;
      height: 18px;
      .van-checkbox__icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        .van-icon {
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    span {
      font-size: 28px;
      color: @text-colorD;
      padding-left: 16px;
    }
    .addA {
      color: @main-color;
    }
  }
  /deep/ .van-picker__cancel {
    color: @text-colorB;
  }
  /deep/ .van-picker-column__item {
    color: #000;
  }
  /deep/ .van-picker__confirm {
    color: @main-color;
  }
  /deep/ .van-picker-column__item--selected {
    color: @main-color;
  }
  /deep/ [class*="van-picker__toolbar"]::after {
    border: none;
  }
  /deep/ .van-picker__title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .van-picker__toolbar {
    height: 60px;
    line-height: 60px !important;
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
      border-radius: 40px;
      background: @text-colorD;
      pointer-events: none;
    }
    .enalbleClick:active {
      opacity: @opacityfive;
      background: @button-mainbackground-on;
      pointer-events: unset;
    }
    .enalbleClick {
      background: @button-mainbackground;
      pointer-events: unset;
    }
  }
}
</style>