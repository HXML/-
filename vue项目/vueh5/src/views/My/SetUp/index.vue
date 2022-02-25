<template>
  <div class="SetUp">
    <div class="title">
      <ul>
        <li>
          <span class="setupname">头像</span>
          <div class="tx_div">
            <img :src="avatar" alt />
            <!-- <p>更换</p> -->
            <van-uploader :after-read="afterRead" upload-text="更换" upload-icon="none" />
          </div>
        </li>
        <li>
          <span class="setupname">会员名</span>
          <div>{{subdatapeople.userName}}</div>
        </li>
        <li>
          <span class="setupname">昵称</span>
          <input
            type="text"
            v-model="subdatapeople.nickName"
            @blur="SetNickName()"
            class="changename"
            placeholder="点击添加昵称"
          />
        </li>
        <li>
          <span class="setupname">手机号</span>
          <div>{{subdatapeople.phone}}</div>
        </li>
        <li @click="choosesex()">
          <span class="setupname">性别</span>
          <div class="sex">{{sexmsg?sexmsg:'选择性别>'}}</div>
        </li>

        <li class="an" @click="jumpAccountSecurity()">
          <span class="setupname">账户与安全</span>
          <div class="jt">
            <img src="@/assets/images/mine_dropdown@2x.png" alt />
          </div>
        </li>

        <li class="tc" @click="logOut">
          <span>退出当前登录</span>
        </li>
      </ul>
    </div>

    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="top">选择性别</div>
          <div class="bottom">
            <p @click="nan()">男</p>
            <p @click="nu()">女</p>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import Vue from "vue";
// 图片上传
import { Uploader } from "vant";
import { compression } from "@/common/js/compression.js"; // 压缩图片
// 遮罩层
import { Overlay } from "vant";
import {
  MyInfoAPI,
  MyBaseDataAPI,
  SetSexAPI,
  SetHeadImgAPI,
  SetNickNameAPI
} from "@/api/MyApi";

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

export default {
  name: "SetUp",
  data() {
    return {
      avatar: require("@/assets/images/mine_avatar@2x.png"),
      show: false,
      sexmsg: "选择性别>",
      subdata: [],
      subdatapeople: []
    };
  },
  components: {
    [Overlay.name]: Overlay,
    [Uploader.name]: Uploader
  },
  methods: {
    logOut() {
      //登出
      localStorage.clear();
      this.$router.push({
        path: "/My/Login/LoginRegistered"
      });
    },
    async afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);

      const Ifrom = new FormData();
      await compression(file.file).then(res => {
        console.log("压缩中!!!");
        Ifrom.append("file", res);
      });

      SetHeadImgAPI(Ifrom, "Put").then(res => {
        console.log(res);
      });
      this.avatar = file.content;
    },
    choosesex() {
      this.show = true;
    },
    nan() {
      this.show = false;
      this.sexmsg = "男";
   

      var formd = new FormData();
      formd.append("Sex", 1);
      SetSexAPI(formd, "Put").then(res => {
        console.log(res);
      });
    },
    nu() {
      this.show = false;
      this.sexmsg = "女";
   

      var formd = new FormData();
      formd.append("Sex", 2);
      SetSexAPI(formd, "Put").then(res => {
        console.log(res);
      });
    },
    // 跳转到账号安全
    jumpAccountSecurity() {
      this.$router.push({ path: "/My/SetUp/AccountSecurity" });
    },
    // 我的信息 设置
    MySetUpData() {
      MyInfoAPI(this.subdata, "get").then(res => {
        console.log(res);
        this.subdatapeople = res;
        this.avatar = res.userImg + "?x-oss-process=style/n3";
        this.sexmsg = res.sex == 1 ? "男" : res.sex == 2 ? "女" : this.sexmsg;
      });
    },
    SetNickName() {
      var data = new FormData();
      data.append("name", this.subdatapeople.nickName);

      SetNickNameAPI(data, "put").then(res => {
        console.log(res);
      });
    }
  },
  mounted() {
    this.sexmsg = this.$cookies.get("sex");
    this.MySetUpData();
  }
};
</script>

<style lang="less" scoped>
.SetUp {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .title {
    width: 100%;
    ul {
      display: flex;
      flex-direction: column;
      width: 100%;
      .an {
        margin-top: 14px;
      }
      .tc {
        margin-top: 108px;
        display: flex;
        justify-content: center;
        align-items: center;
        // color: @main-color;
        font-weight: bold;
        font-size: 28px;
      }
      li {
        display: flex;
        align-items: center;
        background: @text-white;
        height: 80px;
        padding: 0 40px;
        font-size: 24px;
        .setupname {
          flex: 1;
          font-weight: bold;
          color: @text-colorA;
        }
        .changename {
          outline: none;
          border: none;
          text-align: right;
          flex: 2;
        }
        .sex {
          color: @text-colorA;
        }
        .jt {
          img {
            width: 13px;
            height: 24px;
            border-radius: initial;
          }
        }
        .tx_div {
          width: 64px;
          height: 64px;
        }
        div {
          color: @text-colorC;
          font-size: 24px;
          position: relative;
          /deep/ .van-uploader {
            position: absolute;
            width: 64px;
            height: 64px;
            top: 0;
            left: 0;
            border-radius: 50%;
            .van-uploader__upload {
              margin: 0;
              width: 64px;
              height: 64px;
              background: @text-colorA;
              opacity: @opacityfive;
              border-radius: 50%;
            }
            .van-uploader__upload-text {
              margin: 0;
              color: #fff;
              font-size: 20px;
            }
          }
          p {
            position: absolute;
            width: 64px;
            height: 64px;
            top: 0;
            background: @text-colorA;
            opacity: @opacityfive;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            font-weight: 400;
            font-size: 20px;
          }
          img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
.van-overlay {
  z-index: 10;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 355px;
  height: 250px;
  background: @text-white;
  border-radius: 16px;
  font-size: 28px;
  .top {
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid @base-color;
    color: @text-colorB;
  }
  .bottom {
    display: flex;
    flex-direction: column;
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 82px;
      color: @text-colorA;
    }
  }
}
</style>