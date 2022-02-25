<template>
  <div id="app" class="mainFontColor f14">
    <pageHeader v-if="$route.name != 'login'" />
    <div class="fcc">
      <div class="flex">
        <commonAside v-if="$route.path !== '/login'" class="mr-16" />
        <router-view
          :class="$route.path !== '/login' ? 'router_view' : ''"
        ></router-view>
      </div>
    </div>
    <div v-if="backToTopSwitch" @click="backToTop" class="backToTop flex2 aic">
      <i style="color: rgba(13, 105, 197, 1)" class="el-icon-top"></i>
      <span>顶部</span>
    </div>
    <Footer />
    <MessageDialog
      v-if="show"
      :show.sync="show"
      :ListData="ListData"
      @alwayShow="alwayShow"
    />
  </div>
</template>
<script>
// console.log = function() {}   //是否关掉其全部的console.log
import pageHeader from "@/components/pageHeader/index";
import { PagerOrderMsgAPI } from "@/api/commonAPI";
import Footer from "./components/pageFooter/index";
import commonAside from "@/components/commonAside/index";
import MessageDialog from "@/components/MessageDialog/index";
export default {
  components: {
    pageHeader,
    commonAside,
    MessageDialog,
    Footer,
  },
  data() {
    return {
      show: false,
      // showDialog: false,
      ListData: [],
      backToTopSwitch: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    var flag = 0;
    var flagArr = [];
    for (let index = 1; index <= 14; index++) {
      flagArr.push(index);
    }

    console.log(this.getArr(flagArr), "this.getArr(flagArr);");
  },
  watch: {
    // nextTimeDisplay: function (newValue, oldValue) {
    //   //你需要执行的代码
    //   console.log(newValue, oldValue, "$store.state.ids.nextTimeDisplay");
    //   if (!newValue) {
    //     window.chatTimer = setInterval(() => {
    //       this.getListData();
    //     }, 5000);
    //   } else {
    //     clearInterval(window.chatTimer);
    //   }
    // },
    $route: {
      handler: function (route) {
        // console.log(this.$router.currentRoute.name);
        console.log(
          window.chatTimer,
          this.show,
          this.$store.state.ids.nextTimeDisplay,
          route.name == "login",
          "this.$store.state.ids.nextTimeDisplay"
        );
        // if (window.chatTimer) {
        //   //存在定时器不用
        //   return;
        // }

        if (this.show) {
          //展示弹窗时 删除定时器
          clearInterval(window.chatTimer);
          return;
        }

        if (this.$store.state.ids.nextTimeDisplay) {
          //下次不再展示 删除定时器
          clearInterval(window.chatTimer);
          return;
        }
        if (route.name == "login") {
          //登录页面时 删除定时器
          clearInterval(window.chatTimer);
          return;
        }
        this.startTimer();
        // if (
        //   route.name !== "login" &&
        //   !window.chatTimer &&
        //   !this.$store.state.ids.nextTimeDisplay
        // ) {
        //   // console.log("aaa");
        // }
      },
      immediate: true,
    },
  },
  methods: {
    getArr(arr) {
      arr.forEach((item) => {
        if (
          item % 7 == 0 ||
          String(item).substr(String(item).length - 1, 1) == "7"
        ) {
          // console.log(item, "item");
          arr.remove(item);
        } 
      });
      return arr;
    },
    startTimer() {
      clearInterval(window.chatTimer);
      window.chatTimer = setInterval(() => {
        this.getListData();
      }, 5000);
    },
    alwayShow(e) {
      console.log(e, "子组件来的值: 是否一致关闭 弹窗");
      if (!e) {
        // window.localStorage.setItem("nextTimeDisplay", true);
        this.startTimer();
      } else {
        // window.localStorage.setItem("nextTimeDisplay", false);
        clearInterval(window.chatTimer);
      }
    },
    getListData() {
      // console.log(timer, "timer");
      console.log(this.$store.getters.ids, "timer");
      let oldIdString = this.$store.getters.ids;
      let _that = this;
      if (_that.show) {
        clearInterval(window.chatTimer);
      }
      PagerOrderMsgAPI().then((res) => {
        // console.log(res, "resss");
        this.ListData = res.data;
        let arr = [];
        res.data.forEach((element) => {
          arr.push(...element.idArr);
        });
        this.$store.dispatch("changeIds", arr.sort().toString());
        // console.log(oldIdString, "oldIdString");
        // console.log(arr.sort().toString(), "newIdString");
        if (oldIdString === arr.sort().toString()) {
          console.log("不弹窗不弹窗不弹窗不弹窗不弹窗");
        } else {
          console.log("弹窗弹窗弹窗弹窗弹窗弹窗弹窗");
          // clearInterval(window.chatTimer);
          this.$store.dispatch("changeDialogState", true);
          _that.show = true;
        }
      });
    },
    backToTop() {
      window.scrollTo({
        top: 0,
        // behavior: "instant"//立即
        behavior: "smooth", //丝滑
      });
    },
    handleScroll(e) {
      // console.log(window.scrollY, "window.scrollY");
      if (window.scrollY > 400) {
        this.backToTopSwitch = true;
      } else {
        this.backToTopSwitch = false;
      }
    },
  },
};
</script>
<style lang="scss">
.router_view {
  display: flex;
}
li {
  list-style: none;
}
.backToTop {
  cursor: pointer;
  position: fixed;
  box-sizing: border-box;
  padding: 10px 5px;
  bottom: 100px;
  right: 100px;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 4px 9px 1px rgba(221, 221, 221, 0.5);
  border-radius: 4px;
  span {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(13, 105, 197, 1);
  }
}
</style>
