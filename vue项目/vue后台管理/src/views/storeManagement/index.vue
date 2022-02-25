<template>
  <div>
    <div class="goods flex">
      <div class="routerView flex2">
        <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" style="font-weight: 400"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>门店管理</el-breadcrumb-item>
          <div class="activBread">
            <el-breadcrumb-item>{{
              routeName.thirdRouteName
            }}</el-breadcrumb-item>
          </div>
        </el-breadcrumb>
        <router-view class="fg1"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeName: "",
      isCollapse: true,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        // console.log(route);
        this.routeName = {
          secRouteName: route.meta.secondTitle,
          thirdRouteName: route.meta.thirdTitle,
        };
      },
      immediate: true,
    },
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
.routerView {
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px #e8e8e8;
  width: 1200px;
}
/deep/ .el-breadcrumb {
  margin-bottom: 8px;
  height: 26px;
  line-height: 26px;
  padding-left: 24px;
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}
// .goods {
//   margin-top: 16px;
// }

.activBread {
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #0d69c5 !important;
  }
}
</style>