<template>
  <div class="AccountSecurity">
    <div class="content">
      <ul>
        <li>
          <span class="itemname">会员名</span>
          <div>
            <span class="s1">{{ subdatapeople.nickName }}</span>
          </div>
        </li>
        <li>
          <span class="itemname">手机号</span>
          <div>
            <span class="s1">{{ subdatapeople.phone }}</span>
          </div>
        </li>
        <li @click="bindingWx()" v-if="isWeiXin">
          <span class="itemname">绑定微信</span>
          <div>
            <span class="s1 s2" v-show="subdata.oauthNickName == '未绑定微信号'"
              >绑定微信</span
            >
            <span class="s1" v-show="subdata.oauthNickName != '未绑定微信号'">
              <img :src="subdata.userImg + '?x-oss-process=style/n2'" alt="" />
              <span class="d1">{{ subdata.oauthNickName }}</span
              >已绑定
            </span>
          </div>
          <div>
            <img src="@/assets/images/mine_dropdown@2x.png" alt />
          </div>
        </li>
        <li @click="jumpChangeLoginPassword">
          <span class="itemname">修改登录密码</span>
          <div>
            <img src="@/assets/images/mine_dropdown@2x.png" alt />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { MyInfoAPI, MyBaseDataAPI } from "@/api/MyApi";
import { RelieveWxOpenIDAPI } from "@/api/activity";
import { Dialog } from "vant";
import qs from "qs";

export default {
  name: "AccountSecurity",
  data() {
    return {
      subdatapeople: [],
      subdata: {},
      isWeiXin: false,
    };
  },
  components: {},
  methods: {
    // 跳转到修改登入密码
    jumpChangeLoginPassword() {
      this.$router.push({
        path: "/My/SetUp/AccountSecurity/Changecode",
      });
    },
    // 我的信息 设置
    MySetUpData() {
      MyInfoAPI(this.subdata, "get").then((res) => {
        // console.log(res);
        this.subdatapeople = res;
      });
    },
    MyBaseData() {
      MyBaseDataAPI("get").then((res) => {
        // console.log(res, "个人中心信息");
        this.subdata = res;

        if (res.user == null) {
          this.loadingshow = false;
          Dialog.alert({
            title: "提示",
            message: "您的身份已过期,请重新登录",
          }).then(() => {
            // on close
            localStorage.clear();
            this.$router.push({ path: "/My/Login/LoginRegistered" });
          });
        } else {
          // this.loadingshow = false;
        }
      });
    },
    bindingWx() {
      Dialog.confirm({
        title: "更换绑定其他微信号",
      })
        .then(() => {
          var bb = window.localStorage.getItem("openid").split(",");
          let data = qs.stringify({
            openId: bb[0],
          });
          RelieveWxOpenIDAPI(data, "post").then(res=>{
             this.MyBaseData();
          })
        })
        .catch(() => {});
    },
  },
  mounted() {
    if (window.localStorage.getItem("isWeiXin") == "true") {
      this.isWeiXin = true;
      console.log("22222222222222222222222222");
    } else {
      this.isWeiXin = false;
      console.log("3333333333333333333");
    }
    this.MySetUpData();
    this.MyBaseData();

    console.log(window.localStorage.getItem("isWeiXin"));
  },
};
</script>

<style lang="less" scoped>
.AccountSecurity {
  width: 100%;
  background: @base-color;
  min-height: 100%;
  height: auto;
  .content {
    width: 100%;
    ul {
      width: 100%;
      li {
        background: @text-white;
        padding: 0 40px;
        display: flex;
        align-items: center;
        height: 80px;
        border-bottom: 1px solid @base-color;
        .itemname {
          flex: 1;
          font-size: 24px;
          color: @text-colorA;
          font-weight: bold;
        }
        div {
          display: flex;
          align-items: center;
          span {
            font-size: 24px;
            color: @text-colorA;
            padding-right: 12px;
          }
          .s1 {
            color: @text-colorC;
            display: flex;
            align-items: center;
            .d1 {
              color: rgba(0, 10, 38, 1);
              padding-right: 0px;
              padding: 0 4px;
            }
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }
          .s2 {
            color: rgba(255, 137, 73, 1);
          }
          img {
            width: 13px;
            height: 24px;
          }
        }
      }
    }
  }
}
</style>