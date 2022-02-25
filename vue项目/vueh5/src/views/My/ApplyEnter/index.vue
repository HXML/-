<template>
  <div class="apply_enter_big">
    <div class="apply_enter">
      <form style="padding-top: 1vw">
        <div class="input_item flex aic">
          <span class="item_name">公司名称：</span>
          <input
            value
            type="text"
            class="item_input"
            placeholder="您公司全称"
            v-model="submitData.coName"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">公司地址：</span>
          <!-- <input value type="text" class="item_input" placeholder="**省 **市 **区" /> -->
          <!-- <p class="right_p"></p> -->

          <div class="right_xz">
            <p
              type="text"
              @click="selectadd"
              :class="pactive1 ? 'pactive1 right_p' : 'right_p'"
            >
              {{ Addres }}
            </p>
            <vanIcon color="#A8ACB6" name="arrow" />
          </div>
        </div>
        <div class="input_item flex aic">
          <span class="item_name">详细地址：</span>
          <input
            value
            type="text"
            class="item_input"
            v-model="DetailedAddres"
            placeholder="公司注册地址，例：***大厦***楼***"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">联系人：</span>
          <input
            value
            type="text"
            class="item_input"
            placeholder="如何称呼您"
            v-model="submitData.linkMan"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">联系方式：</span>
          <input
            value
            type="number"
            class="item_input"
            placeholder="如何联系您"
            v-model="submitData.linkTel"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">入驻行业：</span>
          <div class="right_xz">
            <p
              @click="ChoiceResidence()"
              :class="pactive ? 'pactive right_p' : 'right_p'"
            >
              {{ HreqIndustry }}
            </p>
            <vanIcon color="#A8ACB6" name="arrow" />
          </div>
        </div>
        <div class="input_item flex aic">
          <span class="item_name">主营产品：</span>
          <input
            value
            type="text"
            class="item_input"
            placeholder="例：美容护肤、餐饮美食、3C电子"
            v-model="submitData.mainProducts"
          />
        </div>
        <div class="input_item flex aic">
          <span class="item_name">入驻类型：</span>
          <!-- <input value type="text" class="item_input" placeholder="选择类型" /> -->
          <div class="right_xz">
            <p
              class="right_p"
              :class="pactive2 ? 'pactive2 right_p' : 'right_p'"
              @click="tctype()"
            >
              {{ submitData.reqShopType }}
            </p>
            <vanIcon color="#A8ACB6" name="arrow" />
          </div>
        </div>
        <div
          class="submit_btn"
          :class="
            submitData.coName &&
            submitData.linkMan &&
            submitData.linkTel &&
            HreqIndustry !== '选择行业' &&
            submitData.mainProducts &&
            submitData.reqShopType !== '选择类型' &&
            Addres !== '*省 **市 **区' &&
            DetailedAddres
              ? 'submit_btn_active'
              : 'disabled_btn'
          "
          @click="submit"
        >
          提交申请
        </div>
      </form>

      <p class="forThanks flex2 aic">
        <span>尊敬的商家，您好！感谢您选择我们。</span>
        <span>您提交申请后，3日内将会有我们的业务人员联系您。</span>
        <span>
          如有疑问请拨打：
          <span class="phoneNumber">
            <a href="javascript:;">400-7777-316</a>
          </span>
        </span>
      </p>

      <!-- 弹出 入驻行业 -->
      <van-popup v-model="enter" round position="bottom">
        <div class="afterSale_shadow">
          <div class="afterSale_shadow_top">
            <span>入驻行业</span>
            <img
              src="@/assets/images/home/gbdelete.png"
              @click="gbafterSale()"
              alt
            />
          </div>
          <div class="afterSale_shadow_bottom">
            <div class="afterSale_shadow_content">
              <ul>
                <li
                  v-for="(item, index) in enterdata"
                  :key="index"
                  @click="xzenter(item, index)"
                  :class="{ activeenter: activeenter == index }"
                >
                  {{ item.categoryName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </van-popup>

      <!-- 入驻类型 -->
      <van-popup v-model="type" round position="bottom">
        <div class="type_shadow">
          <div class="type_shadow_top">
            <span>入驻类型</span>
            <img
              src="@/assets/images/home/gbdelete.png"
              @click="gbtype()"
              alt
            />
          </div>
          <div class="type_shadow_bottom">
            <div class="type_shadow_content">
              <ul>
                <li
                  v-for="(item, index) in typedata"
                  :key="index"
                  @click="xztype(index, item.typechecked, item.typename)"
                >
                  <div class="left">
                    <p class="p1" :class="{ typeactive: activeName == index }">
                      {{ item.typename }}
                    </p>
                    <p class="p2" :class="{ typeactive: activeName == index }">
                      {{ item.typetext }}
                    </p>
                  </div>
                  <div class="right">
                    <van-checkbox
                      v-model="item.typechecked"
                      checked-color="#F42636"
                    ></van-checkbox>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <van-overlay :show="show" @click="noshow" />
    <van-area
      :area-list="areaList"
      value="440309"
      :search-result="searchResult"
      :style="transy ? 'transform:translateY(-280px)' : ''"
      @cancel="cancel()"
      @confirm="confirm"
      title="选择地址"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { Icon } from "vant";
// Popup 动作面板
import { Popup } from "vant";
// 地址
import { Area } from "vant";

// 遮罩层
import { Overlay } from "vant";

// 按钮
import { Checkbox, CheckboxGroup } from "vant";

import { PhoneShopOtherAPI } from "@/api/MyApi";

import { GetBusGoodsShopCategorylistAPI, ShopCateListAPI } from "@/api/store";

export default {
  components: {
    vanIcon: Icon,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Area.name]: Area,
    [Overlay.name]: Overlay,
  },
  data() {
    return {
      allIn: true,
      enter: false, // 显示弹框 入驻行业
      pactive: false, //入驻行业的样式变量
      pactive1: false, //地址的样式变量
      pactive2: false, //入驻类型的样式变量
      areaList: JSON.parse(window.localStorage.getItem("areaList")),
      transy: false, //控制地址显示隐藏的变量
      show: false, //控制阴影的显示隐藏的变量
      // areacontent: "**省 **市 **区", //选择的地址
      type: false, //显示弹框 入驻类型
      searchResult: [],
      activeenter: -1, //入驻行业切换
      activeName: -1, //入驻类型切换
      Addres: "*省 **市 **区", //地址
      DetailedAddres: "", //详细地址
      HreqIndustry: "选择行业",
      submitData: {
        coName: "",
        coAddress: "",
        linkMan: "",
        linkTel: "",
        reqShopType: "选择类型",
        shopCategoryId: "选择行业id",
        mainProducts: "",
      },
      enterdata: [],
      typedata: [
        {
          typename: "旗舰店",
          typetext: "以自有品牌（商标为R或TM状态）入驻开设的店铺",
          typechecked: false,
        },
        {
          typename: "专营店",
          typetext: "同一招商大类两个及以上品牌",
          typechecked: false,
        },
        {
          typename: "专卖店",
          typetext: "持品牌授权文件",
          typechecked: false,
        },
        // {
        //   typename: "自营店",
        //   typetext: "持品牌授权文件",
        //   typechecked: false,
        // },
      ],
      // entervalue: "选择行业", //选择行业的value
      // typevalue: "选择类型"
    };
  },
  mounted() {
    document.title = "商城入驻";
    this.GetBusGoodsCategorylistData();
  },
  methods: {
    // 一级列表
    GetBusGoodsCategorylistData() {
      ShopCateListAPI("get").then((res) => {
        this.enterdata = res.data;
      });
    },
    // 点击选择行业的列表item
    xzenter(item, index) {
      this.HreqIndustry = item.categoryName;

      this.submitData.shopCategoryId = item.id;

      this.enter = false;
      this.pactive = true;
      this.activeenter = index;
    },
    submit() {
      this.submitData.coAddress = this.Addres + this.DetailedAddres;
      let data = this.submitData;
      PhoneShopOtherAPI(data, "post")
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.$router.replace({ path: "/My/ApplyEnter/Successed" });
          }
        })
        .catch((err) => {});
    },
    getAddressList() {
      // getlistAPI().then(res => {
      //   console.log(res);
      // })
    },
    //选择申请入驻
    ChoiceResidence() {
      this.enter = true;
    },
    gbafterSale() {
      this.enter = false;
    },
    // 选择申请类型
    tctype() {
      this.type = true;
    },
    gbtype() {
      this.type = false;
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
    cancel() {
      this.show = false;
      this.transy = false;
    },
    confirm(value) {
      var add = "";
      for (var i = 0; i < value.length; i++) {
        add += value[i].name;
      }
      this.Addres = add;

      // this.submitData.province = value[0].name;
      // this.submitData.city = value[1].name;
      // this.submitData.userArea = value[2].name;
      // this.areacontent = value[0].name + value[1].name + value[2].name;

      this.show = false;
      this.transy = false;
      this.pactive1 = true;
    },
    // 选择类型
    xztype(index, ischeck, isname) {
      this.activeName = index;
      this.submitData.reqShopType = isname;
      this.typedata.forEach((item, index) => {
        this.typedata[index].typechecked = false;
      });
      this.typedata[index].typechecked = true;
      this.type = false;
      this.pactive2 = true;
    },
  },
};
</script>

<style lang="less">
.apply_enter {
  width: 92%;
  background: #fff;
  min-height: 100%;
  height: auto;
  margin: auto;
  .item_name {
    min-width: 175px;
    font-size: 28px;
  }

  .right_xz {
    flex: 1;
    display: flex;
    align-items: center;
    border-bottom: 1px solid @border-colorA;
  }
  .item_input {
    height: 80px;
    border: 0;
    width: 100%;
    border-bottom: 1px solid @border-colorA;
    font-size: 28px;
    color: @text-colorA;
  }
  .input_item input::-webkit-input-placeholder {
    color: @text-colorC;
  }
  .input_item {
    margin-top: 20px;
  }
  .right_p {
    height: 80px;
    border: 0;
    // border-bottom: 1px solid #E4E4E4;
    font-size: 28px;
    flex: 1;
    display: flex;
    align-items: center;
  }
  .pactive {
    color: @text-colorA;
  }
  .pactive1 {
    color: @text-colorA;
  }
  .pactive2 {
    color: @text-colorA;
  }

  input::-webkit-input-placeholder {
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 400;
    color: @text-colorC;
  }
  .submit_btn {
    margin-bottom: 32px;
    text-align: center;
    width: 670px;
    height: 88px;
    border-radius: 44px;
    line-height: 88px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-top: 94px;
  }
  .disabled_btn {
    opacity: 0.5;
    background: @text-colorD;
    pointer-events: none;
  }
  .submit_btn_active {
    background: @button-mainbackground;
    pointer-events: unset;
  }
  .submit_btn_active:active {
    background: @button-mainbackground-on;
    pointer-events: unset;
  }

  .forThanks {
    margin: auto;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: @text-colorB;
    line-height: 38px;
  }
  .phoneNumber {
    color: @main-color;
    a {
      color: @main-color;
    }
  }
  /deep/ .van-popup {
    height: 80%;
    /deep/ .van-action-sheet__header {
      height: 100px;
      text-align: left;
      font-size: 32px;
      color: @text-colorA;
      display: flex;
      align-items: center;
      .van-action-sheet__close {
        display: none;
      }
    }
  }
  // 入驻行业
  /deep/ .van-overlay {
    background: @backgroundBopcityW;
  }
  /deep/ .van-popup {
    height: 85%;
    border-radius: 40px 40px 0px 0px;
  }
  .afterSale_shadow {
    width: 100%;
    height: 100%;
    .afterSale_shadow_top {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      span {
        font-size: 32px;
        color: @text-colorA;
        flex: 1;
        padding-left: 40px;
      }
      img {
        width: 24px;
        height: 24px;
        padding-right: 40px;
      }
    }
    .afterSale_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      .afterSale_shadow_content {
        margin: 0 20px;
        display: flex;
        ul {
          width: 100%;
          li {
            padding: 24px 0;
          }
          .activeenter {
            color: @main-color;
          }
        }
      }
    }
  }

  // 入驻类型
  /deep/ .van-overlay {
    background: @backgroundBopcityW;
  }
  .van-popup {
    height: 85%;
    border-radius: 40px 40px 0px 0px;
  }
  .type_shadow {
    width: 100%;
    height: 100%;
    .type_shadow_top {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      span {
        font-size: 32px;
        color: @text-colorA;
        flex: 1;
        padding-left: 40px;
      }
      img {
        width: 24px;
        height: 24px;
        padding-right: 40px;
      }
    }
    .type_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      .type_shadow_content {
        margin: 0 20px;
        display: flex;
        ul {
          width: 100%;
          li {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid @base-color;
            padding: 40px 0;
            .left {
              flex: 3;
              // color: @main-color;
              .p1 {
                font-size: 28px;
                font-weight: 500;
                columns: @text-colorA;
              }
              .p2 {
                font-size: 24px;
                padding-top: 16px;
                line-height: 30px;
                color: @text-colorC;
              }
            }
            .right {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              padding-right: 12px;
            }
          }
          .typeactive {
            color: @main-color !important;
          }
        }
      }
    }
  }
}
.apply_enter_big {
  width: 100%;
  background: #fff;
  height: 100%;

  .van-picker {
    position: fixed;
    bottom: -280px;
    width: 100%;
    transition: 0.6s;
    z-index: 99;
    box-shadow: 0px 7px 27px 0px rgba(0, 0, 0, 0.14);
    border-radius: 16px 16px 0px 0px;
  }
  .van-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
  .van-picker__cancel {
    color: @text-colorB;
  }
  .van-picker-column__item {
    color: #000;
  }
  .van-picker__confirm {
    color: @main-color;
  }
  .van-picker-column__item--selected {
    color: @main-color;
  }
  [class*="van-picker__toolbar"]::after {
    border: none;
  }
  .van-picker__title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .van-picker__toolbar {
    height: 60px;
    line-height: 60px !important;
  }
}
</style>