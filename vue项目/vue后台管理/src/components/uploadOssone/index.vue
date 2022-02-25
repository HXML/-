<template>
  <el-upload
    ref="uploadxls"
    class="avatar-uploader upload-img"
    action
    :show-file-list="false"
    :http-request="handlePictureCardPreview"
    accept="image/png, image/gif, image/jpg, image/jpeg"
  >
    <img v-if="imageUrl" :src="imageUrl+'?x-oss-process=style/n5'" class="avatar" />
    <i v-show="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  text-align: center;
}
.avatar {
  width: 88px;
  height: 88px;
  display: block;
}
</style>

<script>
import { compress } from "@/utils/upLoadimg";
export default {
  props: {
    value: "",
  },
  data() {
    return {
      disabled: false,
      imageUrl: "",
    };
  },
  mounted() {
    window.localStorage.setItem("alwaysShowDialog", true);
    // console.log(this.value, "this.value");
    this.imageUrl = this.value;
    console.log(this.imageUrl);
  },
  watch: {
    value(val) {
      this.imageUrl = val;
    },
  },
  methods: {
    handlePictureCardPreview(data) {
      let file = data.file;
      console.log(file, "file");
      compress(file, (val) => {
        this.imageUrl = "";
        this.$emit("func", val);
        // console.log(val, "callback");
        this.imageUrl = `${val.imgUrl}`;
      });
    },
  },
};
</script>