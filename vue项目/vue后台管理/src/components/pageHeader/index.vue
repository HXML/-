<template>
  <div class="pageHeader flex jc-sb aic mb-24 mt-14">
    <router-link to="/">
      <img src="@/assets/1.2/LOGO.svg" alt />
    </router-link>
    <div class="flex aic">
      <!-- <span>常见问题？</span>
      <el-divider direction="vertical"></el-divider>-->
      <span>欢迎您~{{ shopName }}</span>
      <span @click="handleLogOut" class="logOut pointer">[退出]</span>
    </div>
  </div>
</template>

<script>
import { _removeToken } from "@/common/js/storage";
export default {
  data() {
    return {
      shopName: "",
    };
  },
  methods: {
    handleLogOut() {
      // window.localStorage.setItem("vuex", null);
      this.$store.dispatch("changeDialogState", false);
      clearInterval(window.chatTimer);
      window.localStorage.clear();
      _removeToken();
      this.$router.push({
        path: "/login",
      });
    },
  },
  mounted() {
    // console.log(
    //   this.$store.getters.currentUser.shopName,
    //   "this.$store.getters.currentUser"
    // );
    this.shopName = this.$store.getters.currentUser
      ? this.$store.getters.currentUser.shopName
      : "";
  },
};
</script>

<style lang="scss" scoped>
.problem {
  font-size: 16px;
  color: #4a5060;
}
.company {
  font-size: 16px;
  color: #4a5060;
}
.logOut {
  margin-left: 8px;
  color: rgba(224, 32, 32, 1);
}
.el-divider {
  width: 1px;
  background-color: rgba(74, 80, 96, 1);
}
.pageHeader {
  margin: 14px auto;
  width: 1392px;
}
</style>