<template>
  <errorPage v-if="CODE === 101" />
  <div class="shop br-8 flex jc-sb" v-else>
    <div :class="shopType !== '3' ? 'left' : ''" style="width: 50%">
      <div class="ml-50">
        <div class="Title">
          <span class="title_name">客服设置</span>
          <div class="p2 flex aic mt-10">
            <span class="s1">客服微信：</span>
            <div class="flex aic">
              <el-image
                class="codequery"
                v-if="WXimg"
                :preview-src-list="[WXimg + '?x-oss-process=style/b4']"
                :src="WXimg + '?x-oss-process=style/s4'"
                alt
              />
              <el-button v-else @click="imgxz('WXimg')">添加图片</el-button>
              <div v-if="WXimg">
                <span
                  class="s2 checkFont pointer mr-14 ml-14"
                  @click="
                    WXimg = '';
                    WXimgId = '';
                  "
                  >删除</span
                >
                <span class="s2 checkFont pointer" @click="imgxz('WXimg')"
                  >选择</span
                >
              </div>
            </div>
          </div>
          <p class="p2 mt-20">
            <span class="s1">客服名称：</span>
            <el-input
              class="inputEL"
              placeholder="输入客服名称"
              v-model="csName"
              type="text"
            />
          </p>
        </div>
        <div class="Title mt-50">
          <span class="title_name">店招设置</span>
          <div class="p2 flex aic mt-20">
            <span class="s1">店招logo：</span>
            <div class="flex aic">
              <el-image
                class="codequery"
                v-if="logo"
                :preview-src-list="[logo + '?x-oss-process=style/b4']"
                :src="logo + '?x-oss-process=style/s4'"
              />
              <el-button v-else @click="imgxz('logo')">添加图片</el-button>
              <div v-if="logo">
                <span
                  class="s2 checkFont mr-14 ml-14 pointer"
                  @click="
                    logo = '';
                    logoid = '';
                  "
                  >删除</span
                >
                <span class="s2 checkFont pointer" @click="imgxz('logo')"
                  >更换</span
                >
              </div>
            </div>
          </div>
          <div>
            <div class="p2 flex aic mt-16">
              <span class="s1">店招背景：</span>
              <div class="flex aic">
                <el-image
                  class="codequery"
                  v-if="bkimg"
                  :preview-src-list="[bkimg + '?x-oss-process=style/b4']"
                  :src="bkimg + '?x-oss-process=style/s4'"
                />
                <el-button v-else @click="imgxz('bkimg')">添加图片</el-button>
                <div v-if="bkimg">
                  <span
                    class="s2 checkFont pointer mr-14 ml-14"
                    @click="
                      bkimg = '';
                      bkimgid = 0;
                    "
                    >删除</span
                  >
                  <span class="s2 checkFont pointer" @click="imgxz('bkimg')"
                    >更换</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d2 rel">
          <div class="top mt-16">
            <img :src="bkimg + '?x-oss-process=style/n3'" alt />
          </div>
          <div class="bottom">
            <div>
              <img :src="logo + '?x-oss-process=style/n3'" alt />
              <span class="s1">{{ shopName }}</span>
              <span class="s2">{{ shopTypeStr }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- !this.logo || !this.bkimg || !this.WXimg || !this.csName -->
      <div class="ml-50 mt-50">
        <el-button
          :disabled="!this.logo"
          type="primary"
          class="w_122"
          @click="btnclick(false)"
          >保 存</el-button
        >
      </div>
    </div>
    <div v-if="shopType !== '3'" class="right" style="width: 50%">
      <div class="ml-50">
        <span class="title_name">店铺设置</span>
        <div class="p2 flex aic mt-20">
          <span class="s1">店铺链接：</span>
          <input
            class="lianjieInput"
            v-model="shopUrl"
            :disabled="true"
            type="text"
          />
          <span
            v-if="!showTips"
            class="s2 pointer checkFont"
            @click="GetshopDtailUrlcopy()"
            >复制链接</span
          >
          <span v-else class="checkFont" style="color: rgba(13, 105, 197, 1)"
            >复制成功，去粘贴</span
          >
        </div>
        <div class="flex mt-24">
          <ul class="flex">
            <span class="s1">店铺模板：</span>
            <li class="mr-50">
              <el-radio @change="changeRadio" v-model="radio" label="TMPLATE_01"
                >简约时尚</el-radio
              >
              <div class="topImg">
                <img src="@/assets/images/templateOne.png" alt />
              </div>
            </li>
            <li>
              <el-radio @change="changeRadio" v-model="radio" label="TMPLATE_02"
                >品质生活</el-radio
              >
              <div class="topImg">
                <img src="@/assets/images/templateTow.png" alt />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <el-dialog :title="formImg" :visible.sync="dialogImg">
      <el-container>
        <!-- 左边 -->
        <el-aside width="300px">
          <el-row class="tac">
            <el-col>
              <el-menu default-active="1" class="el-menu-vertical-demo">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-camera"></i>
                    <span>我的图片</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item
                      :index="'1-' + index"
                      v-for="(item, index) in fileG"
                      :key="item.id"
                      @click="Clictree(item.id)"
                      style="display: flex"
                    >
                      <span style="flex: 1">{{ item.groupName }}</span>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 右边 -->
        <el-main style="padding: none">
          <el-card class="box-card" shadow="never" style="border: none">
            <div slot="header" class="clearfix">
              <!-- <span>卡片名称</span> -->
              <el-input
                size="small"
                placeholder="请输入图片名称搜索"
                style="width: 200px"
                v-model="pageData.keyWord"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="ClickInput()"
                ></i>
              </el-input>
              <div style="display: flex; margin-top: 20px">
                <el-breadcrumb
                  separator-class="el-icon-arrow-right"
                  style="flex: 1"
                >
                  <el-breadcrumb-item>我的图片</el-breadcrumb-item>
                </el-breadcrumb>
                <span
                  >{{ this.shopConfig.fileSize }}/{{
                    this.shopConfig.maxFileSize
                  }}</span
                >
              </div>
            </div>

            <div
              class="container"
              v-infinite-scroll="load"
              infinite-scroll-delay="300"
            >
              <div>
                <div
                  style="
                    display: inline-block;
                    width: 5vw;
                    height: 5vw;
                    margin: 5px;
                  "
                  v-for="item in fileData"
                  :key="item.id"
                >
                  <div>
                    <el-image
                      style="width: 5vw; height: 5vw"
                      :src="item.fileUrl + '?x-oss-process=style/n3'"
                      fit="cover"
                      @click="imgDetail(item.id)"
                    ></el-image>
                  </div>
                </div>
                <div style="text-align: center">
                  <p v-if="bottmLoading">加载中...</p>
                  <p v-else>没有更多了</p>
                </div>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-dialog>

    <!-- Form1 -->

    <el-dialog :title="formImgTtitle" :visible.sync="dialogImgDetailVisible">
      <div class="diaLogContent">
        <img :src="form.fileUrl + '?x-oss-process=style/n5'" max-width="500" />
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        style="margin-top: 20px"
      >
        <el-form-item label="图片名">
          <el-input v-model="form.fileName"></el-input>
        </el-form-item>
        <el-form-item label="图片分类">
          <el-input v-model="form.groupName"></el-input>
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.fileUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImgDetailVisible = false">取 消</el-button>
        <el-button type="primary" @click="imgbtn()">确 定</el-button>
      </div>
    </el-dialog>

    <textarea
      style="position: absolute; top: 0; left: 0; opacity: 0; z-index: -10"
      id="CopyBox"
    ></textarea>
  </div>
</template>




<script>
import {
  GetFGAPI,
  GetListAPI,
  AddFileAPI,
  GetConfigAPI,
  FileItemAPI,
  DelFileAPI,
  ShiftAPI,
  GroupAddAPI,
  DELGAPI,
} from "@/api/shopAPI";
import qs from "qs";
import {
  CongifModelUpdateAPI,
  CongifModelAPI,
  GetshopDtailUrlAPI,
} from "@/api/shopAPI";

export default {
  data() {
    return {
      shopType: window.localStorage.getItem("shopType"),
      CODE: 0,
      // IsCanBackPlatfom:"0",
      showTips: false,
      dialogImgDetailVisible: false,
      dialogImg: false,
      shopUrl: "",
      bottmLoading: true,
      formImgTtitle: "选择图片",
      formImg: "选择图片",
      input: "",
      fileData: [],
      pageData: {
        pIndx: 1,
        pSize: 30,
        gId: 0,
        keyWord: "",
      },
      fileList: [],
      shopConfig: {},
      form: {
        fileName: "",
        groupId: "",
        fileUrl: "",
      },
      fileG: [],
      radio: "TMPLATE_01",
      logo: "",
      logoid: 0,
      bkimg: "",
      bkimgid: 0,
      WXimg: "",
      WXimgId: 0,
      shopName: "华为旗舰店",
      shopTypeStr: "华为旗舰店",
      imgindex: "",
      csName: "",
    };
  },
  methods: {
    changeRadio(e) {
      // console.log(e, "aaa");
      this.btnclick(true);
    },
    GetshopDtailUrlcopy() {
      this.showTips = true;
      setTimeout(() => {
        this.showTips = false;
      }, 4000);
      var input = document.getElementById("CopyBox");
      input.value = this.shopUrl; // 商品详情地址加上商品id
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
    },
    GetshopDtailUrl() {
      GetshopDtailUrlAPI("get").then((res) => {
        this.shopUrl = res.data;
      });
    },
    imgbtn() {
      let that = this;
      if (that.imgindex == "logo") {
        that.logo = that.form.fileUrl;
        that.logoid = that.form.fileId;
      }
      if (that.imgindex == "WXimg") {
        that.WXimg = that.form.fileUrl;
        that.WXimgId = that.form.fileId;
        // that.$set(that, "WXimgId", that.form.fileId);
      }
      if (that.imgindex == "bkimg") {
        that.bkimg = that.form.fileUrl;
        that.bkimgid = that.form.fileId;
      }
      that.dialogImgDetailVisible = false;
      that.dialogImg = false;
      console.log(that.WXimgId, "当前id");
      that.$forceUpdate();
    },
    itemChecked(id) {
      //点击单个复选框
      this.fileData.forEach((item) => {});
    },
    btnclick(type) {
      if (!this.logoid) {
        return false;
      }
      var modeldata = {
        ShopLogo: this.logoid,
        BkImg: this.bkimgid,
        HomeTmplate: this.radio,
      };

      var qsdata = qs.stringify({
        Configs: modeldata,
        shopService: this.WXimgId,
        ShopCsName: this.csName,
        // IsCanBackPlatfom:this.IsCanBackPlatfom
      });

      CongifModelUpdateAPI(qsdata, "post", 1).then((res) => {
        if (res.code == 1) {
          // if (type) {
          //   return;
          // }
          this.$message({
            message: "恭喜你，修改成功!",
            type: "success",
          });
          // this.CongifModel();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    imgDetail(id_) {
      // 查看图片详情
      this.dialogImgDetailVisible = true;

      var data_ = {
        id: id_,
      };
      FileItemAPI(data_, "get").then((res) => {
        this.form = res.data;
      });
    },
    getFg() {
      // 查询分组
      GetFGAPI().then((res) => {
        this.fileG = res.data;
        this.pageData.gId = res.data[0].id;
        this.FileGroupName = res.data[0].groupName;
        this.pageData.pIndx = 1;
        this.getFile();
      });
    },

    load() {
      //触底加载
      if (!this.NotLoad) {
        return;
      }
      this.pageData.pIndx++;
      this.getFile();
    },
    getFile() {
      // 查询文件
      GetListAPI(this.pageData, "get").then((res) => {
        res.data.rows.forEach((element) => {
          this.fileData.push(element);
        });
        if (res.data.rows.length < 30) {
          this.NotLoad = false;
          this.bottmLoading = false;
        } else {
          this.NotLoad = true;
        }
        if (this.pageData.pIndx == 1 && res.data.rows.length >= 30) {
          this.load();
        }
      });
    },
    getSpaces() {
      // 可用空间
      GetConfigAPI().then((res) => {
        this.shopConfig = res.data;
      });
    },
    Clictree(val) {
      //点击分组
      this.fileG.forEach((item) => {
        if (item.id == val) {
          this.FileGroupName = item.groupName;
        }
      });
      this.pageData.pIndx = 1;
      this.pageData.gId = val;
      this.checked = false;
      this.bottmLoading = true;
      this.fileData = [];
      this.getFile();
    },

    ClickInput() {
      //点击搜索
      this.bottmLoading = true;
      this.fileData = [];
      this.pageData.pIndx = 1;
      this.getFile();
    },
    imgxz(index) {
      this.imgindex = index;
      this.dialogImg = true;
    },
    shopmodelData() {
      var vuethis = this;
      CongifModelAPI("", "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
        }
        vuethis.logo = res.data.config.shopLogoUrl;
        vuethis.logoid = res.data.config.shopLogo;
        vuethis.bkimg = res.data.config.bkImgUrl;
        vuethis.bkimgid = res.data.config.bkImg;
        vuethis.WXimg = res.data.shopmodel.shopWxUrl;
        vuethis.WXimgId = res.data.shopmodel.shopWxQrcode;
        vuethis.csName = res.data.shopmodel.shopCsName;
        vuethis.shopTypeStr = res.data.shopmodel.shopTypeStr;
        vuethis.shopName = res.data.shopmodel.shopName;
        vuethis.radio = res.data.config.homeTmplate;
        // vuethis.IsCanBackPlatfom = ""+res.data.shopmodel.isCanBackPlatfom;
      });
    },
  },
  mounted() {
    this.shopmodelData();
    this.getFg();
    this.getSpaces();
    this.GetshopDtailUrl();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-breadcrumb {
  background-color: #fff;
  border: none;
}
.container {
  overflow-y: auto;
  height: 400px;
  padding-bottom: 25px;
}

.el-button--primary.is-disabled {
  background-color: rgba(177, 182, 195, 1);
  border-color: rgba(177, 182, 195, 1);
}
.el-button--primary {
  background-color: #0d69c5;
}
.el-button--primary:hover {
  background-color: #05428d;
}
.el-radio {
  margin-left: 30px;
}
.lianjieInput {
  width: 232px;
  background-color: #fff;
  border: 0;
  font-size: 12px;
  color: #7d828f;
  line-height: 20px;
}
/deep/.el-input__inner {
  // width: 184px;
  height: 32px;
  font-size: 12px;
  line-height: 32px;
}
.checkFont {
  font-size: 12px;
  font-weight: 400;
  color: #e46d0c;
}
.topImg {
  margin-top: 16px;
  background: #fff;
  width: 150px;
  height: 300px;
  overflow: auto;
  img {
    width: 100%;
    display: flex;
  }
}
.bottom_height {
  height: 120px;
}
.d2 {
  border-radius: 10px;
  width: 450px;
  height: 120px;
  margin-left: 80px;
  position: relative;
}
.top {
  width: 450px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.bottom {
  position: absolute;
  border-radius: 10px;
  top: 0;
  width: 450px;
  height: 120px;
  background-image: linear-gradient(rgba(8, 22, 59, 0.9), rgba(8, 22, 59, 0.9));
  div {
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-top: 20px;
    img {
      width: 70px;
      height: 70px;
    }
    .s1 {
      font-size: 18px;
      color: #fff;
      padding-left: 16px;
    }
    .s2 {
      font-size: 10px;
      color: #ff8949;
      border: 1px solid #ff8949;
      margin-left: 8px;
      padding: 0 4px;
      border-radius: 4px;
    }
  }
}
.codequery {
  width: 32px;
  height: 32px;
}
.w_122 {
  width: 122px;
}
.left {
  border-right: 1px solid #eeeeee;
}
.inputEL {
  width: 168px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
}
.title_name {
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  color: #0d69c5;
}
.title_name::before {
  content: "|";
  width: 4px;
  height: 13px;
  background: #0d69c5;
  margin-right: 8px;
}

.btnfooter {
  text-align: center;
  padding: 20px;
}
.logobtn {
  color: #409eff;
  margin-left: 24px;
  cursor: pointer;
}
.shop {
  // min-height: 786px;
  background: #fff;
  padding: 32px 0px 26px 0;
}
</style>