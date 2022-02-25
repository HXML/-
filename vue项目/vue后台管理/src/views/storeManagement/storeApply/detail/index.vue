<template>
  <errorPage v-if="CODE === 101" />
  <div class="detail" v-else>
    <div class="header f16">基本信息</div>
    <el-divider></el-divider>
    <el-form>
      <el-form-item
        label="门店类目："
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-input
          class="w-240"
          disabled
          v-model="formData.shopCategory"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="门店名称："
        prop="name"
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-input class="w-240" disabled v-model="formData.ppName"></el-input>
      </el-form-item>
      <el-form-item
        label="联系人："
        prop="name"
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-input class="w-240" disabled v-model="formData.linkMan"></el-input>
      </el-form-item>
      <el-form-item
        label="电话："
        prop="name"
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-input class="w-240" disabled v-model="formData.linkTel"></el-input>
      </el-form-item>
      <el-form-item
        label="门店地址："
        prop="name"
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-input
          class="w-240"
          disabled
          v-model="formData.ppAddress"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="社会统一信用代码："
        prop="name"
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-input
          class="w-240"
          disabled
          v-model="formData.creditCode"
        ></el-input>
      </el-form-item>
      <el-form-item label="门店详情" prop="name">
        <el-image
          v-for="item in formData.imgList"
          :key="item.id"
          class="w-120 mr-20"
          :preview-src-list="[item + '?x-oss-process=style/b5']"
          :src="item + '?x-oss-process=style/s4'"
          alt
        />
      </el-form-item>
    </el-form>
    <footer class="flex aic mt-160">
      <el-button round class="w-240 ml-160" @click="$router.go(-1)"
        >返回</el-button
      >
      <el-button round type="primary" @click="passTheItem" class="w-240 ml-160"
        >审核</el-button
      >
    </footer>
  </div>
</template>

<script>
import {
  GetPickupApplyDetailAPI,
  PassPickupApplyAPI,
} from "@/api/shopStoreAPI";
export default {
  data() {
    return {
      CODE: 0,
      formData: {},
      id: 0,
    };
  },
  computed: {},
  methods: {
    getDetailInfor(data) {
      GetPickupApplyDetailAPI(data, "get").then((response) => {
        console.log(response, "aaa");
        this.formData = response.data;
      });
    },
    passTheItem() {
      let data = {
        ids: this.id,
      };
      PassPickupApplyAPI(data, "PUT").then((res) => {
        // console.log(res, "aaa");
        if (res.code == 1) {
          this.$message({
            duration: 1000,
            type: "success",
            message: "审核成功",
            onClose: () => {
              this.$router.go(-1);
            },
          });
        }
      });
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDetailInfor(this.$route.query);
  },
};
</script>
<style lang="scss" scoped>
.detail {
  /deep/ .el-form-item__label {
    width: 160px;
  }
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-range-separator {
    height: 32px;
    line-height: 32px;
    width: fit-content;
  }
  /deep/ .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffff;
}
</style>