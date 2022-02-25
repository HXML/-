<template>
  <!-- 倒计时组件 -->
  <div class="downTime-wrapper">
    <!-- 这里是显示还未结束时的内容，这里只是我这得布局，你可以随意。 -->
    <div class="time flex" v-show="!isShow">
      <div class="hour">
        {{myDay}}
        <span class="unit">天</span>
      </div>
      <div class="hour">
        {{myHours}}
        <span class="unit">时</span>
      </div>
      <div class="minute">
        {{myMinutes}}
        <span class="unit">分</span>
      </div>
      <div class="second">
        {{mySeconds}}
        <span class="unit">秒</span>
      </div>
    </div>
    <!-- 这里是显示结束后的内容 -->
    <span class="second" v-show="isShow">{{clocker}}</span>
  </div>
</template>

<script>
export default {
  name: "downTime",
  props: {
    // 接收父组件传递过来的参数,这里传了  结束时间 - 开始时间 - 结束后显示的内容
    endTime: {
      type: Number
    },
    startTime: {
      type: Number
    },
    endMsg: {
      type: String
    }
  },

  data() {
    return {
      isShow: false, // 控制显示结束或还未结束显示的内容
      clocker: "", // 结束后显示的内容
      timeObj: null, // 时间对象,下方会用到
      myDay: 0, // 我定义来接收计算出来的 天 的
      myHours: 0, // 我定义来接收计算出来的 小时 的
      myMinutes: 0, // 我定义来接收计算出来的 分钟 的
      mySeconds: 0 // 我定义来接收计算出来的 秒钟 的
    };
  },

  mounted() {
    // 计算时间差
    let timeLag = (this.endTime - this.startTime) / 1000;
    // 判断当前是否时分秒的值是否大于10
    let add = num => {
      return num < 10 ? "0" + num : num;
    };
    // 时间倒计时运算的方法
    let timeFunction = () => {
      let time = timeLag--;
      this.timeObj = {
        // 时间对象
        seconds: Math.floor(time % 60),
        minutes: Math.floor(time / 60) % 60,
        hours: Math.floor(time / 60 / 60) % 24,
        days: Math.floor(time / 60 / 60 / 24)
      };
      // 计算出时分秒
      this.myDay = `${add(this.timeObj.days)}`;
      this.myHours = `${add(this.timeObj.hours)}`;
      this.myMinutes = `${add(this.timeObj.minutes)}`;
      this.mySeconds = `${add(this.timeObj.seconds)}`;
      // 当时间差小于等于0时,停止倒计时
      if (time <= 0) {
        this.isShow = true;
        this.clocker = this.endMsg || "该团已经结束";
        clearInterval(go);
      }
    };
    // 开始执行倒计时
    timeFunction();
    // 每一秒执行一次
    let go = setInterval(() => {
      timeFunction();
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.downTime-wrapper {
  font-size: 0.12rem;
  font-weight: bold;
  .second {
    color: rgb(235, 62, 61);
  }
  .time {
    font-size: 18px;
    color: #e02020;
  }
  .unit {
    margin-right: 8px;
    font-size: 12px;
    color: #7d828f;
  }
}
</style>