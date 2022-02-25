<template>
  <div class="pageAside" id="pageAside">
    <ul class="contentBox">
      <li
        class="flex ai-fs mb-24 wfc"
        v-for="(item, index) in routers"
        :key="index"
      >
        <img :src="item.icon" alt="#" :class="index == 3 ? 'mt--4' : 'mt-2'" />
        <div class="ml-12">
          <div class="RouterName">{{ item.name }}</div>
          <div class="flex fw w220">
            <router-link
              v-for="(son, index) in item.sonRouters"
              :key="index"
              :to="{ name: son.sonPath }"
            >
              <span
                v-if="son.showItem"
                class="sonRouter pointer"
                :class="
                  $route.name === son.sonPath
                    ? 'activeA'
                    : 'pt-3 pb-3 pl-4 pr-4'
                "
                >{{ son.sonName }}</span
              >
            </router-link>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shopType: window.localStorage.getItem("shopType"),
      routerLists: [
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon1.svg"),
          name: "店铺",
          sonRouters: [
            {
              showItem: window.localStorage.getItem("shopType") != 3, //单个显示
              sonName: "店铺模版",
              sonPath: "template",
            },
            {
              showItem: true, //单个显示
              sonName: "店铺消息",
              sonPath: "Message",
            },
            {
              showItem: true, //单个显示
              sonName: "店铺设置",
              sonPath: "shopSetting",
            },
            {
              showItem: true, //单个显示
              sonName: "图片空间",
              sonPath: "picture",
            },
            {
              showItem: true, //单个显示
              sonName: "店铺公告",
              sonPath: "Notice",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon2.svg"),
          name: "商品",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "发布商品",
              sonPath: "release",
            },
            {
              showItem: true, //单个显示
              sonName: "商品评价",
              sonPath: "comment",
            },
            {
              showItem: true, //单个显示
              sonName: "出售中的商品",
              sonPath: "onSale",
            },

            {
              showItem: true, //单个显示
              sonName: "商品自定义分类",
              sonPath: "goodsClassify",
            },
            {
              showItem: true, //单个显示
              sonName: "仓库中的商品",
              sonPath: "offlineGoods",
            },
            {
              showItem: true, //单个显示
              sonName: "商品回收站",
              sonPath: "recycleGoods",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon3.svg"),
          name: "交易",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "已售商品",
              sonPath: "saleOrder",
            },
            {
              showItem: true, //单个显示
              sonName: "退款订单",
              sonPath: "refundOrder",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon4.svg"),
          name: "平台结算",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "营收概况",
              sonPath: "revenue",
            },
            {
              showItem: true, //单个显示
              sonName: "收入明细",
              sonPath: "accountBalance",
            },
            {
              showItem: true, //单个显示
              sonName: "支出明细",
              sonPath: "expenditure",
            },
            {
              showItem: true, //单个显示
              sonName: "提现记录",
              sonPath: "wdrecord",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon5.svg"),
          name: "营销",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "消费券",
              sonPath: "DiscountCoupon",
            },
            {
              showItem: true, //单个显示
              sonName: "搭配满减",
              sonPath: "matchMax",
            },
            {
              showItem: true, //单个显示
              sonName: "满减包邮",
              sonPath: "freeShipping",
            },
            {
              showItem: true, //单个显示
              sonName: "拼团",
              sonPath: "makeGroup",
            },
            {
              showItem: true, //单个显示
              sonName: "砍价",
              sonPath: "bargaining",
            },
            {
              showItem: true, //单个显示
              sonName: "限时折扣",
              sonPath: "limitDiscount",
            },
            {
              showItem: true, //单个显示
              sonName: "推广优惠券",
              sonPath: "proCoupon",
            },
            {
              showItem: true, //单个显示
              sonName: "新品试用",
              sonPath: "newTestPlan",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon6.svg"),
          name: "设置",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "快递模版",
              sonPath: "ExpressTemset",
            },
            {
              showItem: true, //单个显示
              sonName: "退货地址",
              sonPath: "Returnaddress",
            },
            {
              showItem: true, //单个显示
              sonName: "店铺资料",
              sonPath: "shopData",
            },
            {
              showItem: true, //单个显示
              sonName: "人员管理",
              sonPath: "Role",
            },
            {
              showItem: true, //单个显示
              sonName: "操作日志",
              sonPath: "Log",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon6.svg"),
          name: "门店管理",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "门店入驻申请",
              sonPath: "storeApply",
            },
            {
              showItem: true, //单个显示
              sonName: "门店列表",
              sonPath: "storeList",
            },
            {
              showItem: true, //单个显示
              sonName: "门店概况",
              sonPath: "storeProfile",
            },
            {
              showItem: true, //单个显示
              sonName: "门店余额",
              sonPath: "storeRanking",
            },
            {
              showItem: true, //单个显示
              sonName: "门店提现",
              sonPath: "storeWithdrawal",
            },
            {
              showItem: true, //单个显示
              sonName: "门店设置",
              sonPath: "storeSetting",
            },
          ],
        },
        {
          icon: require("@/assets/1.2/shanghu_home_daohang_icon6.svg"),
          name: "推广",
          sonRouters: [
            {
              showItem: true, //单个显示
              sonName: "我要推广",
              sonPath: "wantToPromote",
            },
            {
              showItem: true, //单个显示
              sonName: "推广计划",
              sonPath: "promotePlan",
            },
            {
              showItem: true, //单个显示
              sonName: "推广报表",
              sonPath: "promotionReport",
            },
          ],
        },
      ],
    };
  },
  computed: {
    routers: function () {
      //计算总数
      var finalArray = [];
      if (this.shopType == 3) {
        //自营门店才需要门店管理
        return this.routerLists;
      } else {
        let index = this.routerLists.findIndex(
          (item) => item.name == "门店管理"
        );
        console.log(index, "index");
        return this.routerLists
          .slice(0, index)
          .concat(this.routerLists.slice(index + 1, this.routerLists.length));
      }
    },
  },
  created() {
    // console.log(this.$route.name, "$route.name");
  },
};
</script>

<style lang="scss" scoped>
.pageAside {
  height: fit-content;
  .w220 {
    width: 180px;
  }
  .activeA {
    color: #e46d0c !important;
    background: rgba(228, 109, 12, 0.2);
    padding: 3px 4px;
    border-radius: 4px;
  }
  .contentBox {
    padding: 18px 24px 18px 12px;
    width: 220px;
    min-height: 820px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 2px 4px 0px #e8e8e8;
  }
  .RouterName {
    margin-bottom: 4px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    color: #000a26;
  }
  .sonRouter {
    line-height: 1.8vw;
    margin-right: 16px;
    font-size: 13px;
    color: #4a5060;
  }
  .sonRouter:hover {
    color: #e46d0c !important;
  }
}
</style>