<template>
  <div
    :class="['drag-button', state === 1?'border-right trans':state === 2?'border-left trans':'']"
    @click.stop.prevent="click"
    @touchstart="touchstart($event)"
    @touchmove.stop.prevent="touchmove($event)"
    @touchend="touchend($event)"
    ref="self"
  >
    <div class="drag-content">
      <!-- <img src="@/assets/img/icon/icon-drag.png"> -->
      回到首页
    </div>
  </div>
</template>
 
<script>
export default {
  name: "BaseDragBtn",
  props: {
    sticky: {
      type: Boolean,
      default: !0,
    },
  },
  data() {
    return {
      state: 2,
    };
  },
  mounted() {
    this.self = this.$refs["self"];
    this.windowWidth = document.body.clientWidth;
    this.windowHeight = document.body.clientHeight;
    this.halfSelfWidth = this.self.offsetWidth / 2;
    this.halfSelfHeight = this.self.offsetHeight / 2;
    this.self.style.left = this.windowWidth - this.halfSelfWidth * 2 + "px";
    this.self.style.top = this.windowHeight - 140 + "px";
    // console.log(this.self.offsetWidth);
  },
  methods: {
    click() {
      if (this.$route.path !== "/") {
        this.$router.push({ path: "/" });
      }
    },
    touchstart() {},
    touchmove(e) {
      if (this.state !== 0) {
        this.state = 0;
      }
      const targetX = e.targetTouches[0].clientX;
      const targetY = e.targetTouches[0].clientY;
      if (
        this.halfSelfWidth < targetX &&
        targetX < this.windowWidth - this.halfSelfWidth
      ) {
        this.self.style.left = targetX - this.halfSelfWidth + "px";
      }
      if (
        this.halfSelfHeight < targetY &&
        targetY < this.windowHeight - this.halfSelfHeight
      ) {
        this.self.style.top = targetY - this.halfSelfHeight + "px";
      }
    },
    touchend() {
      if (this.sticky) {
        if (
          parseInt(this.self.style.left) + this.halfSelfWidth <=
          this.windowWidth / 2
        ) {
          this.self.style.left = "0px";
          this.state = 1;
        } else {
          this.self.style.left =
            this.windowWidth - this.halfSelfWidth * 2 + "px";
          this.state = 2;
        }
      }
    },
  },
};
</script>
 
<style lang="less" scoped>
.drag-button {
  width: 100px;
  height: 100px;
  position: fixed;
  z-index: 999;
  font-size: 20px;
  // color: #ffffff;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d3d3d3;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 1px 10px #c8b4b4;
  .drag-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      display: inline-block;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      user-select: none;
      pointer-events: none;
    }
  }
  .drag-content:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
.border-right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  border-left: none;
}
.border-left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-right: none;
}
.trans {
  transition: left 0.3s;
}
</style>