<template>
  <!-- 收入明细 -->
    <errorPage v-if="CODE===101" />
  <div class="revenue br-8" v-else>
    <el-card class="box-card">
      <div slot="header" style="height:20px" class="clearfix">
        <span style="margin-right:20px;font-size:15px;">店铺首页轮播设置</span>
      </div>

      <div class="text item" v-for="(item,index) in imgData " :key="index">
        <el-input
          placeholder="图片地址"
          :disabled="true"
          v-model="item.imgStr"
          @blur="addApi(index)"
          class="Ainput"
        ></el-input>
        <el-button @click="imgxz(index)" class="Abutton">选择</el-button>
        <el-input
          placeholder="跳转链接"
          v-model="item.linkUrl"
          @blur="addApi(index)"
          class="Ainput Binput"
        ></el-input>

        <i class="el-icon-top mr-30 upColor" @click="Indexsort(index,1)"></i>
        <i class="el-icon-bottom downColor" @click="Indexsort(index,2)"></i>
        <span class="fontCColor" @click="del(index)">删除</span>
      </div>
      <div class="btnfooter">
        <el-button type="primary" @click="btnclick">确 定</el-button>
        <!-- <div class="text item yulan">预览</div>slot="header" -->
      </div>
    </el-card>

    <el-dialog :title="formImg" :visible.sync="dialogImg">
      <el-container style="height: 800px;">
        <!-- 左边 -->
        <el-aside width="300px">
          <!--         
        <div class="block" style="padding:20px">
          <el-tree :data="fileG" :props="props" @node-click="Clictree"></el-tree>
          </div>-->

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
                      :index="'1-'+index"
                      v-for="(item,index) in fileG"
                      :key="item.id"
                      @click="Clictree(item.id)"
                      style="display: flex;"
                    >
                      <span style="flex:1;">{{item.groupName}}</span>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 右边 -->
        <el-main style="padding: none;">
          <el-card class="box-card" shadow="never" style="border:none;height: 800px;">
            <div slot="header" class="clearfix">
              <!-- <span>卡片名称</span> -->
              <el-input
                size="small"
                placeholder="请输入图片名称搜索"
                style="width:200px;"
                v-model="pageData.keyWord"
              >
                <i slot="suffix" class="el-input__icon el-icon-search" @click="ClickInput()"></i>
              </el-input>
              <!-- <el-input v-model="pageData.keyWord" style="width:200px;" placeholder="请输入内容"></el-input> -->

              <div style="display: flex;margin-top: 20px;">
                <el-breadcrumb separator-class="el-icon-arrow-right" style="flex: 1;">
                  <el-breadcrumb-item>我的图片</el-breadcrumb-item>
                </el-breadcrumb>
                <span>{{this.shopConfig.fileSize}}/{{this.shopConfig.maxFileSize}}</span>
              </div>
            </div>

            <div
              style="overflow-y: auto;height: 600px;padding-bottom: 25px;"
              v-infinite-scroll="load"
              infinite-scroll-delay="300"
            >
              <div>
                <div
                  style="display:inline-block;width:5vw;height:5vw ;margin: 5px;"
                  v-for="item in fileData"
                  :key="item.id"
                >
                  <div>
                    <el-image
                      style="width:5vw;height:5vw ;"
                      :src="item.fileUrl+'?x-oss-process=style/n3'"
                      fit="cover"
                      @click="imgDetail(item.id)"
                    ></el-image>
                  </div>
                </div>
                <div style="text-align: center;">
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
        <img :src="form.fileUrl+'?x-oss-process=style/n5'" max-width="500" />
      </div>

      <el-form ref="form" :model="form" label-width="80px" style="margin-top:20px;">
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
        <el-button type="primary" @click="imgbtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>










<script>
import {
  CongifModelAPI,
  ShopAdListAPI,
  ShopAdListUpdatedAPI
} from "@/api/shopAPI";
import {
  GetFGAPI,
  GetListAPI,
  AddFileAPI,
  GetConfigAPI,
  FileItemAPI,
  DelFileAPI,
  ShiftAPI,
  GroupAddAPI,
  DELGAPI
} from "@/api/shopAPI";

import qs from "qs";
export default {
  data() {
    return {
       CODE:0,
      dialogImgDetailVisible: false,
      dialogImg: false,
      bottmLoading: true,
      formImgTtitle: "选择图片",
      formImg: "选择图片",
      input: "",
      fileData: [],
      pageData: {
        pIndx: 1,
        pSize: 30,
        gId: 0,
        keyWord: ""
      },
      fileList: [],
      shopConfig: {},
      form: {
        fileName: "",
        groupId: "",
        fileUrl: ""
      },
      imgData: [
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 1,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 2,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 3,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 4,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 5,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 6,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 7,
          isnull: true
        },
        {
          adImgId: 0,
          adType: 0,
          id: 0,
          imgStr: "",
          linkUrl: "",
          openType: 0,
          pkValue: 0,
          shopId: 0,
          sortIndex: 8,
          isnull: true
        }
      ],
      imgindex: 0,
      fileG: []
      // form表单
    };
  },
  methods: {
    imgbtn() {
      this.imgData[this.imgindex].imgStr = this.form.fileUrl;
      this.imgData[this.imgindex].adImgId = this.form.fileId;
      this.dialogImgDetailVisible = false;
      this.dialogImg = false;
    },
    itemChecked(id) {
      //点击单个复选框
      this.fileData.forEach(item => {});
    },
    imgDetail(id_) {
      // 查看图片详情
      this.dialogImgDetailVisible = true;

      var data_ = {
        id: id_
      };
      console.log(data_);
      FileItemAPI(data_, "get").then(res => {
        console.log(res);

        this.form = res.data;
      });
    },
    getFg() {
      // 查询分组
      GetFGAPI().then(res => {
        console.log(res);
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
      console.log("触底了", this.pageData.pIndx);
      this.getFile();
    },
    getFile() {
      console.log("加载了", this.pageData.pIndx);
      // 查询文件
      GetListAPI(this.pageData, "get").then(res => {
        console.log(res);
        res.data.rows.forEach(element => {
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
        console.log(this.NotLoad);
      });
    },
    getSpaces() {
      // 可用空间
      GetConfigAPI().then(res => {
        this.shopConfig = res.data;
      });
    },
    Clictree(val) {
      //点击分组
      this.fileG.forEach(item => {
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
    swapItems(arr, index1, index2) {
      var sortqian = arr[index1].sortIndex;
      var sorthou = arr[index2].sortIndex;
      arr[index1].sortIndex = sorthou;
      arr[index2].sortIndex = sortqian;

      // 上下移动的核心。splice函数 返回的是被删除 项  并且 会改变原数组
      // arr.splice(index2, 1, arr[index])[0] 这个得到是的 被删除的 项 并且原数组 已经得到替换。所以需要将被删除项 设置为上一项的值
      //如果解释不是很清楚。自己去控制台 打印 玩玩  （主要是为自己理解做笔记）
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    shaixuan(arr) {
      let arrnew = [];
      arr.forEach(element => {
        if (!element.isnull) {
          arrnew.push(element);
        }
      });

      return arrnew;
    },
    del(index) {
      this.imgData[index].shopId = 0;
      this.imgData[index].linkUrl = "";
      this.imgData[index].imgStr = "";
      this.imgData[index].isnull = true;

      var newarr = [];
      for (let i = index; i < 7; i++) {
        if (!this.imgData[i + 1].isnull) {
          
          newarr = this.swapItems(this.imgData, i, i + 1);
        }
        else{
return;

        }
      }
      for (let j = 0; j < this.imgData.length; j++) {
        newarr[j].sortIndex = j + 1;
      }

      //  var data = qs.stringify({
      //     adList: this.shaixuan(newarr)
      //   });
      //   alert("fff")
      //   ShopAdListUpdatedAPI(data, "post", 1).then(res => {
      //     if (res.code == 1) {
      //       this.$message({
      //         message: "恭喜你，修改成功!",
      //         type: "success"
      //       });
      //       this.imgData = newArr;
      //     } else {
      //       this.$message({
      //         message: res.msg,
      //         type: "success"
      //       });
      //     }
      //   });
    },
    Indexsort(index, type) {
      if (this.imgData[index].isnull) {
        return;
      }
      if (index == 0&&type==1) {
        return;
      }
      if (index == 7&&type==2) {
        return;
      }
      let newArr = [];
      //type 1 升  2降
      if (type == 1) {
        newArr = this.swapItems(this.imgData, index, index - 1);
      } else {
        newArr = this.swapItems(this.imgData, index, index + 1);
      }

      // var data = qs.stringify({
      //   adList: this.shaixuan(this.imgData)
      // });

      // ShopAdListUpdatedAPI(data, "post", 1).then(res => {
      //   if (res.code == 1) {
      //     this.$message({
      //       message: "恭喜你，修改成功!",
      //       type: "success"
      //     });
      //     this.imgData = newArr;
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: "success"
      //     });
      //   }
      // });
    },
    imgxz(index) {
      this.imgindex = index;
      this.dialogImg = true;
    },
    addApi(index) {
      if (
        this.imgData[index].linkUrl != "" &&
        this.imgData[index].imgStr != ""
      ) {
        this.imgData[index].isnull = false;
      } else {
        this.imgData[index].isnull = true;
      }
    },
    btnclick() {
      var data = qs.stringify({
        adList: this.shaixuan(this.imgData)
      });

      ShopAdListUpdatedAPI(data, "post", 1).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "恭喜你，保存成功!",
            type: "success"
          });
          this.CongifModel();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    CongifModel() {
      var thisvue = this;
      ShopAdListAPI("", "get").then(res => {
        var i = 0;
         if (res.code == 101) {
            this.CODE = 101;
          }
        res.data.forEach(element => {
          thisvue.imgData[i].adImgId = element.adImgId;
          thisvue.imgData[i].adType = element.adType;
          thisvue.imgData[i].id = element.id;
          thisvue.imgData[i].imgStr = element.imgStr;
          thisvue.imgData[i].linkUrl = element.linkUrl;
          thisvue.imgData[i].openType = element.openType;
          thisvue.imgData[i].pkValue = element.pkValue;
          thisvue.imgData[i].shopId = element.shopId;
          thisvue.imgData[i].sortIndex = element.sortIndex;
          thisvue.imgData[i].isnull = false;
          i++;
          console.log(i);
          if (i == 8) {
            return;
          }
        });
        console.log(thisvue.imgData);
        console.log("thisvue.imgData[i]");
      });
    }
  },
  mounted() {
    this.CongifModel();
    this.getFg();
    this.getSpaces();
  }
};
</script>

<style lang="scss" scoped>
.Ainput{
    width: 307px !important;
}
.Abutton{
  margin-left: 20px;
}
.Binput{
  margin-left: 40px;
}
.mr-30 {
  margin-right: 30px;
}
.upColor {
  font-size: 22px;
  margin-left: 10px;
  color: #e46d0c;
}
.downColor {
  font-size: 22px;
  color: #4a5060;
}
.fontCColor {
  cursor: pointer;
}
.btnfooter {
  margin-top: 30px;
  // margin-left: 25%;
}
.yulan {
  float: right;
  cursor: pointer;
}
.el-button--primary{
  width: 122px;
    border-radius: 8px;
    height: 42px;
}
.el-button--primary:hover{
  width: 122px;
    border-radius: 8px;
    height: 42px;
    background: #05428D;
}
.tables tr {
  height: 30px;
}
.tables tr td {
  font-size: 15px;
  font-weight: 500;
}
.table_span {
  color: #9a9a9a;
}

/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  background-color: #f9f9f9;
}

/deep/.el-card__header th > .cell {
  height: 36px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.box-card {
  box-shadow: none;
  border: none;
}
.revenue {
  // min-height: 786px;
  background-color: #ffffff;
  .onSaleing {
    color: #219541;
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .title {
    width: 240px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
  .xiajia {
    /deep/.el-checkbox {
      margin-right: 22px;
    }
  }
  .item {
    margin-right: 40px;
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
    line-height: 30px;
  }
  .item_pirce {
    font-family: MicrosoftYaHei;
    color: #b7b7b7;
  }
  .item_name {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }
}
body > .el-container {
  margin-bottom: 40px;
}
.el-card__body {
  height: 500px;
}
.el-card__header {
  padding: 0.938vw 1.042vw;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  height: 50px;
  /* position: absolute; */
  top: 0;
  width: 100%;
  background: #fff;
}
.el-aside {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #fff;
  color: #333;
  /* text-align: center; */
  /* line-height: 10px; */
  margin-left: 10px;
  padding: 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  min-height: 600px;
}
</style>