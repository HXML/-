<template>
  <div class="footer">
    <div class="flex">
      <div class="footer_content">
        <!-- <a class="item" v-for="(item, index) in contents" :key="index">{{item}}</a> -->
        <p>
          &copy;2015-{{year}}兆客易购版权所有，并保留所有权利。
          <a
            class="beian"
            href="http://www.beian.miit.gov.cn/"
          >粤ICP备11057569号-6</a>：4007777316 E-mail：fw@tongcheng-315.com
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      contents: [
        "关于我们",
        "联系我们",
        "商家入驻",
        "友情链接",
        "站点地图",
        "手机商城",
        "销售联盟",
        "商城社区",
        "企业文化",
        "帮助中心",
        "留言板",
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.beian {
  font-size: 14px;
  color: #999999;
}
.footer {
  padding: 24px 0;
  font-size: 14px;
  color: #999999;
  .item {
    padding-left: 10px;
    margin-right: 10px;
    border-left: 1px solid #999999;
  }
  .item:first-child {
    border-left: 0;
  }
  .footer_content {
    // width: 994px;
    margin: auto;
    p {
      margin-top: 20px;
    }
  }
}
</style>