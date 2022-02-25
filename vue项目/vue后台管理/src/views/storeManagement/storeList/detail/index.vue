<template>
  <errorPage v-if="CODE === 101" />
  <div class="detail" v-else>
    <div class="header f16">基本信息</div>
    <el-divider></el-divider>
    <el-form :rules="rules" :model="formData" ref="formData">
      <el-form-item label="门店类目：" prop="name">
        <el-select
          class="w-240"
          v-model="formData.shopCategoryId"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in classList"
            :key="index"
            :label="item.labelName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称：" prop="ppName">
        <el-input class="w-240" v-model="formData.ppName"></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="linkMan">
        <el-input
          :disabled="type == 'edit'"
          class="w-240"
          v-model="formData.linkMan"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="linkTel">
        <el-input
          :disabled="type == 'edit'"
          maxlength="11"
          class="w-240"
          v-model="formData.linkTel"
        ></el-input>
        <el-button
          v-if="type !== 'edit'"
          class="ml-30"
          type="primary"
          @click="queryNumber('formData')"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item label="门店地址：" prop="ppAddress">
        <el-input class="w-240" v-model="formData.ppAddress"></el-input>
      </el-form-item>
      <el-form-item label="社会统一信用代码：" prop="creditCode">
        <el-input class="w-240" v-model="formData.creditCode"></el-input>
      </el-form-item>
      <el-form-item label="门店详情" prop="name" v-if="type == 'edit'">
        <div class="flex aic">
          <el-image
            v-for="item in formData.imgList"
            :key="item.id"
            class="w-120 mr-20"
            :preview-src-list="[item + '?x-oss-process=style/b5']"
            :src="item + '?x-oss-process=style/s4'"
            alt
          />
          <!-- <uploadOssone
              v-on:func="func($event, index)"
              :value="imgs[index]"
              class="mr-16"
            />
            <i
              v-if="imgs[index]"
              class="el-icon-delete absIcon"
              @click="deleImg(index)"
            ></i> -->
        </div>
      </el-form-item>
    </el-form>

    <el-divider class="mt-160"></el-divider>
    <footer class="flex aic mt-60">
      <el-button round class="w-240 ml-160" @click="$router.go(-1)"
        >返回</el-button
      >
      <el-button
        round
        type="primary"
        class="w-240 ml-160"
        @click="addStore('formData')"
      >
        {{ type == "edit" ? "编辑门店" : "添加门店" }}
      </el-button>
    </footer>
  </div>
</template>

<script>
import qs from "qs";
import uploadOssone from "@/components/uploadOssone";
import { ShopCateListAPI } from "@/api/goodsClassifyAPI";
import {
  InsertPickupPointAPI,
  UpdatePickupPointAPI,
  GetPickupPointDetailAPI,
  getUserAPI,
} from "@/api/shopStoreAPI";
export default {
  components: {
    uploadOssone,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号搜索"));
      } else if (value) {
        var data = {
          Keyword: value,
        };
        getUserAPI(data, "get").then((res) => {
          console.log(res);
          if (res.data != undefined || res.data != null) {
            this.formData.userId = res.data.userId;
            callback();
          } else {
            callback(new Error(res.msg));
          }
        });
      } else {
        callback();
      }
    };
    return {
      CODE: 0,
      value: 0,
      id: 0, //门店id
      type: "", //进入页面的状态 //edit 等
      classList: [], //门店分类
      idArr: [], //图片ids
      imgs: [], //图片
      formData: {
        id: 0, //门店id
        shopCategoryId: 0, //门店类目id必选
        shopCategory: "", //门店类目
        creditCode: "", //社会统一信用代码必填
        ppName: "", //门店名称必填
        linkMan: "", //联系人必填
        linkTel: "", //联系电话必填
        ppAddress: "", //门店地址必填
        userId: "", //拥有者id必填
        imgs: "", //图片id，用逗号隔开
      },

      rules: {
        ppName: [
          { required: true, message: "请输入门店名称", trigger: "blur" },
        ],
        linkMan: [
          { required: true, message: "请输入联系人名称", trigger: "blur" },
        ],
        linkTel: [
          { validator: validatePass, required: true, trigger: "focus" },
        ],
        ppAddress: [
          { required: true, message: "请输入门店地址", trigger: "blur" },
        ],
        creditCode: [
          {
            required: true,
            message: "请输入社会统一信用代码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    // deleImg(index) {
    //   //删除
    //   this.idArr.splice(index, 1);
    //   this.imgs.splice(index, 1);
    // },
    // func(e, index) {
    //   this.idArr.push(e.imgId);
    //   this.imgs.push(e.imgUrl);
    // },
    queryNumber(formName) {
      //表单验证
      this.$refs[formName].validateField("linkTel");
    },
    getDetailInfor() {
      //获取详情数据
      let data = {
        id: this.id,
      };
      GetPickupPointDetailAPI(data, "get").then((response) => {
        console.log(response, response.data.imgs.split(","), "aaa");
        this.formData = {
          id: response.data.id, //门店id
          shopCategoryId: response.data.shopCategoryId, //门店类目id必选
          shopCategory: response.data.shopCategory, //门店类目
          creditCode: response.data.creditCode, //社会统一信用代码必填
          ppName: response.data.ppName, //门店名称必填
          linkMan: response.data.linkMan, //联系人必填
          linkTel: response.data.linkTel, //联系电话必填
          ppAddress: response.data.ppAddress, //门店地址必填
          userId: response.data.userId, //拥有者id必填
          imgs: response.data.imgs, //图片id，用逗号隔开
          imgList: response.data.imgList, //图片id，用逗号隔开
        };
        this.imgs = response.data.imgList;
        this.idArr = response.data.imgs.split(",");
      });
    },
    addStore(formName) {
      console.log(this.$refs);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.imgs = this.idArr.join(","); //处理图片
          // alert("创建");
          let data = qs.stringify(this.formData);
          if (this.type == "edit") {
            UpdatePickupPointAPI(data, "post").then((res) => {
              // console.log(res, "ress");
              if (res.code == 1) {
                this.$message({
                  duration: 1000,
                  message: "编辑成功!",
                  type: "success",
                  onClose: () => {
                    this.$router.go(-1);
                  },
                });
              } else {
                this.$message({
                  duration: 1000,
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {
            InsertPickupPointAPI(data, "post").then((res) => {
              // console.log(res, "ress");
              if (res.code == 1) {
                this.$message({
                  duration: 1000,
                  message: "保存成功!",
                  type: "success",
                  onClose: () => {
                    this.$router.go(-1);
                  },
                });
              } else {
                this.$message({
                  duration: 1000,
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getStoreClass() {
      ShopCateListAPI().then((res) => {
        let arr = res.data.map((item) => {
          return {
            labelName: item.categoryName,
            id: item.id,
          };
        });
        this.classList = [
          {
            labelName: "全类目",
            id: 0,
          },
          ...arr,
        ];
      });
    },
  },
  mounted() {
    this.getStoreClass();
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    // console.log(this.$route.meta.thirdTitle);
    if (this.$route.query.type == "edit") {
      this.getDetailInfor();
    }
  },
};
</script>
<style lang="scss" scoped>
.absIcon {
  position: absolute;
  right: 10px;
  top: -5px;
}
.detail {
  /deep/ .el-form-item__label {
    width: 160px;
  }
  /deep/ .el-form-item__error {
    margin-left: 160px;
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