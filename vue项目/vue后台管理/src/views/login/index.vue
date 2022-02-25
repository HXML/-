<template>
  <div class="login">
    <section class="login_header flex aic">
      <div class>
        <!-- <svg
          t="1592448799545"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3126"
          width="40"
          height="40"
        >
          <path
            d="M512 0C229.199448 0 0 229.234759 0 512s229.199448 512 512 512c282.765241 0 512-229.234759 512-512S794.765241 0 512 0"
            fill="#E50012"
            p-id="3127"
          />
          <path
            d="M503.172414 914.838069c-217.6 0-394.010483-176.410483-394.010483-394.010483S285.572414 126.852414 503.172414 126.852414s394.010483 176.375172 394.010483 393.975172c0 217.6-176.410483 394.010483-394.010483 394.010483M503.172414 70.62069C254.516966 70.62069 52.965517 272.172138 52.965517 520.827586S254.516966 971.034483 503.172414 971.034483 953.37931 769.483034 953.37931 520.827586 751.827862 70.62069 503.172414 70.62069"
            fill="#FFFFFF"
            p-id="3128"
          />
          <path
            d="M701.740138 370.758621l-180.894897 106.284138L339.915034 370.758621 229.517241 435.959172v205.082483L341.504 706.206897V503.048828l178.952828 107.308138v0.512l0.388413-0.247173 0.388414 0.247173v-0.529656l178.952828-107.290482V706.206897L812.137931 641.05931V435.941517z"
            fill="#FFFFFF"
            p-id="3129"
          />
          <path
            d="M635.586207 353.121103L512 282.482759l-123.586207 70.638344L512 423.724138z"
            fill="#FFFFFF"
            p-id="3130"
          />
        </svg>-->
        <!-- <div class="login_header_companyName fg1 font">兆客易购-商家后台</div> -->
        <img src="@/assets/images/shanghu-logoda.png" />

        <!-- <div class="login_header_erweima flex2 aic"> -->
        <!-- <span class="span">手机商城</span>
        <img src="../../assets/loginImg/pc_login_erweima@2x.png" class="erweima" alt="#" />-->
        <!-- <svg xmln="@/logo.svg" /> -->
        <!-- </div> -->
      </div>
    </section>
    <section class="login_content rel">
      <div class="loginForm abs">
        <span class="form_head">商户登录</span>
        <input
          oninput="if(value.length>11)value=value.slice(0,11)"
          placeholder="默认账户为手机号"
          class="form_nameInput"
          v-model="name"
        />
        <input
          placeholder="请输入登录密码"
          type="password"
          class="form_password"
          v-model="password"
          @keyup.enter="submitInfor"
        />
        <input
          type="submit"
          class="form_btn"
          value="登录"
          @click="submitInfor"
        />
        <div class="flex jc-sb form_alert">
          <span></span>
          <div>
            <!-- <span class="ml-35" @click="ruzhu">申请入驻</span> -->
            <!-- <span class="ml-35"></span> -->
            <span @click="showModle('忘记密码？')" class="ml-35"
              >忘记密码？</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- 弹出层 -->
    <el-dialog
      title="友情提示"
      :visible.sync="dialogVisible"
      center
      width="30%"
    >
      <div class="flex2 jc-sa dialog_content">
        <span>子账户：</span>
        <p>后台密码为您手机商城账户，如您忘记密码，请前往手机商城重设密码</p>
        <span>主账户：</span>
        <p>请联系兆客商城平台，或电联400-7777-316</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getSidAPI } from "@/api/commonAPI";
import { loginAPI } from "@/api/login";
import qs from "qs";
import { _setToken, _setEndTime, _setFlag, _setSid } from "@/common/js/storage";
export default {
  data() {
    return {
      dialogVisible: false, //弹框的显示开关
      name: "", //账号
      password: "", //密码
    };
  },
  components: {},
  mounted() {
    clearInterval(window.chatTimer);
    window.localStorage.setItem("oldIds", "");
    window.location.title = "兆客易购商家后台-欢迎登录";
    getSidAPI("get").then((res) => {
      console.log(res);
      _setSid(res.data);
      this.$store.dispatch("changeSid", res.data);
    });
  },
  methods: {
    ruzhu() {},
    submitInfor() {
      if (this.name == "") {
        this.$message({
          message: "请输入账号",
          type: "warning",
        });
        return false;
      }
      if (this.password == "") {
        this.$message({
          message: "请输入登录密码",
          type: "warning",
        });
        return false;
      }
      // alert("777");
      console.log(this.$store.getters.Sid, "sid");
      var data = qs.stringify({
        tcUser: this.name, //yonghuming
        tcPass: this.password, //password
        sid: this.$store.getters.Sid, //sid
      });
      loginAPI(data, "post", 1).then((res) => {
        // console.log(res.data.msg, "resresres");
        // console.log(
        //   res.data.onlineUser.userIdentity != 101,
        //   res.data.onlineUser.userIdentity != 102
        // );
        console.log(res.data.isLoginOk, "res.data.isLoginOk");
        if (res.data.isLoginOk) {
          if (
            res.data.onlineUser.userIdentity !== 101 &&
            res.data.onlineUser.userIdentity !== 102 &&
            res.data.onlineUser.userIdentity !== 103
          ) {
            this.$message({
              message: "您尚未注册为商家，请前往客户端注册",
              type: "error",
            });
            return false;
          }
          window.localStorage.setItem(
            "userImg",
            res.data.userImg + "?x-oss-process=style/n5"
          );
          this.$store.dispatch("setUser", res.data.onlineUser);
          // console.log("aa", res.data.onlineUser);
          clearInterval(window.chatTimer);//弹窗的定时器
          _setToken(res.data.token);//获取token
          _setFlag(true);//续签的flag
          _setEndTime(res.data.onlineUser.creatorDate);//结束时间
          window.localStorage.setItem("nextTimeDisplay", true);//弹窗的
          window.localStorage.setItem("shopType", res.data.shopType); //店铺类型
          this.$router.push({ name: "Home" });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });

      // 没有接口的时候打开下面的
      // _setToken("666");
      // this.$router.push({ name: "Home" });
    },
    showModle(text) {
      if (text == "忘记密码？") {
        console.log(text);
        this.dialogVisible = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-color: #fff;
  // min-height: 100vh;
  width: 100vw;
  // padding-top: 20px;
  .login_header {
    height: 60px;
    width: 990px;
    margin: auto;
    // margin-bottom: 20px;
    .logo {
      width: 54px;
      height: 54px;
    }
    .font {
      font-size: 30px;
      height: 60px;
      line-height: 60px;
      // font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(244, 38, 54, 1);
    }
    .span {
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(244, 38, 54, 1);
    }
    .erweima {
      margin-top: 4px;
      width: 56px;
      height: 56px;
    }
  }
  .login_content {
    width: 100%;
    height: 580px;
    background: url("../../assets/loginImg/pc_login_bg@2x.png") no-repeat;
    background-size: 100% 100%;

    .loginForm {
      padding: 27px 20px 27px 22px;
      right: 422px;
      top: 117px;
      width: 342px;
      min-height: 358px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 59px 0px rgba(0, 85, 115, 0.18);
      border-radius: 8px;
      .form_head {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(0, 10, 38, 1);
      }
      .form_nameInput {
        z-index: 999;
        margin: 30px 0 auto;
        outline: none;
        -webkit-appearance: none;
        background: url("../../assets/loginImg/pc_login_icon1@2x.png") no-repeat
          #fff;
        background-position: left 1vw top 0.8vw;
        // background-size: 20px;
        text-indent: 50px;
        width: 300px;
        height: 52px;
        border: 1px solid rgba(177, 182, 195, 0.2);
        border-radius: 26px;
        color: #000;
      }
      .form_password {
        margin: 14px auto;
        outline: none;
        -webkit-appearance: none;
        background: url("../../assets/loginImg/pc_login_icon2@2x.png") no-repeat
          #fff;
        background-position: left 1vw top 0.8vw;
        // background-size: 20px;
        text-indent: 50px;
        width: 300px;
        height: 52px;
        border: 1px solid rgba(177, 182, 195, 0.2);
        border-radius: 26px;
        color: #000;
      }
      .form_btn {
        margin-top: 40px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        outline: none;
        width: 300px;
        height: 48px;
        background: linear-gradient(
          0deg,
          rgba(231, 58, 58, 1) 0%,
          rgba(246, 66, 66, 1) 100%
        );
        border-radius: 24px;
      }
      .ml-35 {
        cursor: pointer;
        margin-left: 35px;
      }
      .form_alert {
        margin-top: 34px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(74, 80, 96, 1);
      }
    }
  }
  .dialog_content {
    min-height: 120px;
  }
}
</style>