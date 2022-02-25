<template>
  <errorPage v-if="CODE===101" />
  <div class="picture br-8" v-else>
    <el-container>
      <!-- 左边 -->
      <el-aside class="br-8 boxShadow" width="300px">
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
                  <el-button
                    type="text"
                    style="margin-left: 80px;"
                    @click="dialogFGVisible=true"
                  >新增分组</el-button>
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

                    <el-popover placement="top" width="160" v-model="item.checked">
                      <p>确定删除这个分组吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.checked = false">取消</el-button>
                        <el-button type="text" size="mini" @click="DelFileGroup(item.id)">确定</el-button>
                      </div>
                      <el-button type="text" slot="reference">删除</el-button>
                    </el-popover>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 右边 -->
      <el-main class="br-8 boxShadow padding-0">
        <el-card class="box-card" shadow="never" style="border:none;height: 40.25vw;">
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
            <el-button
              style="float: right;"
              size="small"
              type="primary"
              round
              @click="ClickBottom"
            >上传图片</el-button>
            <div class="flex mt-20">
              <el-breadcrumb
                class="fg1"
                style="background-color:#ffffff;border:0;"
                separator-class="el-icon-arrow-right"
              >
                <el-breadcrumb-item>我的图片</el-breadcrumb-item>
                <el-breadcrumb-item>{{FileGroupName}}</el-breadcrumb-item>
              </el-breadcrumb>
              <span>{{this.shopConfig.fileSize}}/{{this.shopConfig.maxFileSize}}</span>
            </div>
          </div>

          <div style="display: flex;align-items: center;">
            <span style="flex:1;">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checked"
                @change="AllChecked()"
              >全选</el-checkbox>
            </span>
            <span style>
              <el-popover placement="left" width="200" trigger="click">
                <div>
                  <el-radio-group v-model="FGradio" style>
                    <div v-for="item in fileG" :key="item.id" style="padding-bottom: 10px;">
                      <el-radio :label="item.id">{{item.groupName}}</el-radio>
                    </div>
                  </el-radio-group>
                </div>
                <div>
                  <el-button size="mini" @click="ShiftFile">确认移动</el-button>
                </div>
                <el-button slot="reference" type="text">移动</el-button>
              </el-popover>
              <el-button type="text" @click="DeleteImg" style="margin-left: 5px;">删除</el-button>
            </span>
          </div>
          <div
            style="overflow-y: auto;height: 30vw;padding-bottom: 25px;"
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
                  <el-checkbox
                    v-model="item.checked"
                    style="float: left;margin-bottom: -22px;margin-left: 3px;"
                    @change="itemChecked"
                  ></el-checkbox>
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

    <!-- Form -->
    <el-dialog :title="formTtitle" :visible.sync="dialogFormVisible">
      <div class="diaLogContent" v-loading="loading">
        <div class="content_header flex aic">
          <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
          <el-upload
            v-if="dialogFormVisible"
            list-type="picture-card"
            ref="upload"
            action
            :multiple="true"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="fileList"
            :http-request="UpFileLoad"
            :on-change="UploadFileChange"
            :before-upload="upFront"
            :on-success="(response, file, fileList)=>{return onSuccess(response, file, fileList, index)}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span style="opacity: 0.6;margin-right: 5px;">单张图片不能大于5M，每次上传不能大于10M</span>
        <el-button @click="ClickCancel">取 消</el-button>
        <el-button type="primary" @click="UploadSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Form1 -->
    <el-dialog
      :title="formImgTtitle"
      v-if="dialogImgDetailVisible"
      :visible.sync="dialogImgDetailVisible"
    >
      <div class="diaLogContent">
        <div class="diaLoagImg">
          <img class="w100pc" :src="form.fileUrl" />
        </div>

        <!-- <el-image
          :preview-src-list="[form.fileUrl]"
          class="diaLoagImg"
          :src="form.fileUrl"
        />-->
      </div>

      <el-form ref="form" :model="form" label-width="80px" style="margin-top:20px;">
        <el-form-item label="图片名">
          <el-input v-model="form.fileName"></el-input>
        </el-form-item>
        <el-form-item label="图片分类">
          <el-input v-model="form.groupName" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.fileUrl" readonly="readonly"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="EditFileInfo(form.id)">保 存</el-button>
        <el-button @click="dialogImgDetailVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <div class="btnfooter">
        <el-button type="primary" @click="btnclick">确 定</el-button>
        <div class="text item yulan">预览</div>
    </div>-->

    <!-- Form2 -->
    <el-dialog :title="formFileGTtitle" :visible.sync="dialogFGVisible">
      <el-form ref="form" label-width="80px" style="margin-top:20px;">
        <el-form-item label="分组名称">
          <el-input v-model="AddGroupName"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="AddFileGroup">提 交</el-button>
        <el-button @click="dialogFGVisible = false">取 消</el-button>
      </div>
    </el-dialog>
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
  EditPicInfoAPI,
} from "@/api/shopAPI";
import { compress, compression } from "@/utils/upLoadimg"; //上传图片 何国荣
export default {
  data() {
    return {
      CODE: 0,
      bottmLoading: true,
      loading: false,
      Delvisible: false,
      formFileGTtitle: "添加文件分组",
      dialogFGVisible: false,
      FGradio: 0,
      checked: false,
      isIndeterminate: false,
      MaxUploadfile: 0,
      props: {
        label: "groupName",
        children: [],
      },
      input: "",
      fileG: [],
      fileData: [],
      fromData: new FormData(),
      pageData: {
        pIndx: 1,
        pSize: 30,
        gId: 0,
        keyWord: "",
      },
      dialogFormVisible: false,
      dialogImgDetailVisible: false,
      formTtitle: "添加图片",
      formImgTtitle: "图片详情",
      fileList: [], // 文件列表
      dialogVisible: false,
      dialogImageUrl: "",
      shopConfig: {},
      form: {
        fileName: "sdasdas",
        groupId: "sss",
        fileUrl: "sssssssss",
      },
      AddGroupName: "",
      NotLoad: false,
      FileGroupName: "",
    };
  },
  methods: {
    ClickBottom() {
      //点击上传文件
      if (this.fileG.length <= 0) {
        this.$message({
          type: "info",
          message: "请先创建分组",
        });
        return;
      }
      this.dialogFormVisible = true;
    },
    EditFileInfo(id) {
      //修改文化名称
      console.log(id);
      if (this.form.fileName.length > 30) {
        this.$message({
          type: "info",
          message: "图片名称不能大于30个字符",
        });
        return;
      }
      var from_ = new FormData();
      from_.append("id", id);
      from_.append("fileName", this.form.fileName);

      EditPicInfoAPI(from_, "put").then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功",
        });
        console.log(res);
      });
    },
    AllChecked() {
      //点击全选
      this.isIndeterminate = false;
      if (this.checked == true) {
        this.fileData.forEach((item) => {
          item.checked = true;
        });
      } else {
        this.fileData.forEach((item) => {
          item.checked = false;
        });
      }
      console.log(this.fileData);
    },
    itemChecked() {
      //点击单个复选框
      let fileDataCount = this.fileData.length;
      let checkedCont = 0;
      this.fileData.forEach((item) => {
        if (item.checked === true) checkedCont++;
      });
      if (checkedCont == fileDataCount) {
        this.checked = true;
        this.isIndeterminate = false;
      } else if (checkedCont > 0) {
        this.checked = false;
        this.isIndeterminate = true;
      } else {
        this.checked = false;
        this.isIndeterminate = false;
      }
    },
    imgDetail(id_) {
      // 查看图片详情
      this.dialogImgDetailVisible = true;

      var data_ = {
        id: id_,
      };
      console.log(data_);
      FileItemAPI(data_, "get").then((res) => {
        console.log(res);
        res.data.fileUrl += "?x-oss-process=style/89900";
        this.form = res.data;
      });
    },
    onSuccess(response, file, fileList, idx) {
      console.log(response, file, fileList, idx);
      this.fileList[idx].pics.push({ name: file.name, url: file.url });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getFg() {
      // 查询分组
      GetFGAPI().then((res) => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.fileG = res.data;
        this.pageData.gId = res.data[0].id;
        this.FileGroupName = res.data[0].groupName;
        this.pageData.pIndx = 1;
        this.getFile();
      });
    },
    AddFg(val) {
      console.log(val);
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
      // 查询文件
      console.log("加载了", this.pageData.pIndx);
      GetListAPI(this.pageData, "get").then((res) => {
        console.log(res);
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
        console.log(this.NotLoad);
      });
    },
    getSpaces() {
      // 可用空间
      GetConfigAPI().then((res) => {
        console.log("aaa", res);
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
    upFront(file) {},
    UploadFileChange(file, fileList) {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      console.log(file, "file");
      console.log(fileList, "fileList");

      if (file.size > 5242880) {
        this.$message({
          type: "info",
          message: "单个图片不能大于5M",
        });
        fileList.splice(fileList.indexOf(file), 1);
      }

      this.fileList = fileList;
      console.log(this.fileList);
    },
    UpFileLoad(params) {
      // 点击文件上传后执行的第一步，原本是每个文件执行一次上传，现在是把它们存到一个list里面
      this.loading = true;
      this.MaxUploadfile += params.file.size;
      //等比例压缩图片
      return;
    },
    ClickCancel() {
      this.fileList = [];
      this.dialogFormVisible = false;
      this.loading = false;
      this.bottmLoading = true;
      this.MaxUploadfile = 0;
      this.$refs.upload.clearFiles(); //清空已上传的文件列表
    },
    async UploadSubmit() {
      //第二步
      this.$refs.upload.submit(); //上传图片 第一步 ⬆
      if (this.fileList.length <= 0) {
        this.$message({
          type: "info",
          message: "请选择图片",
        });
        return;
      }
      console.log(this.MaxUploadfile);
      if (this.MaxUploadfile > 10485760) {
        this.$message({
          type: "info",
          message: "单次上传不可大于10M",
        });
        this.loading = false;
        this.bottmLoading = true;
        this.fileList = [];
        this.MaxUploadfile = 0;
        return;
      }

      //压缩图片
      let Ifrom = await this.yasuo(); // 返回一个FromData对象
      console.log("压缩完了!!!");

      // 点击文件上传第二步，将文件集合上传到后台

      AddFileAPI(Ifrom, "post", 2)
        .then((res) => {
          console.log(res);
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }
          this.fileData = [];
          this.pageData.pIndx = 1;
          this.getSpaces();
          this.getFile();
          this.fileList = [];
          this.dialogFormVisible = false;
          this.loading = false;
          this.MaxUploadfile = 0;
          this.bottmLoading = true;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.msg);

          this.fileList = [];
          this.dialogFormVisible = false;
          this.loading = false;
          this.MaxUploadfile = 0;
          this.bottmLoading = true;
          this.$refs.upload.clearFiles(); //清空已上传的文件列表
        });
    },
    // 压缩文件 并生成FormData
    async yasuo() {
      const Ifrom = new FormData();
      Ifrom.append("GroupID", this.pageData.gId);
      for (let index = 0; index < this.fileList.length; index++) {
        console.log("压缩中!!!");
        await compression(this.fileList[index].raw).then((res) => {
          // Ifrom.append("files", this.fileList[index].raw);
          Ifrom.append("files", res);
        });
      }
      return Ifrom;
    },
    ClickInput() {
      //点击搜索
      this.bottmLoading = true;
      this.fileData = [];
      this.pageData.pIndx = 1;
      this.getFile();
    },
    DeleteImg() {
      //删除文件
      var ids_ = [];
      this.fileData.forEach((item) => {
        if (item.checked == true) {
          ids_.push(item.id);
        }
      });
      if (ids_.length <= 0) {
        this.$message({
          type: "info",
          message: "请先选择文件",
        });
        return;
      }

      var dataa_ = {
        ids: ids_.toString(),
      };

      DelFileAPI(dataa_, "delete").then((res) => {
        console.log(res);
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }

        var that = this;
        for (var i = that.fileData.length - 1; i >= 0; i--) {
          var index = that.fileData[i];
          if (index.checked) {
            that.fileData.splice(i, 1);
          }
        }
        if (this.fileData.length < 5) {
          this.pageData.pIndx = 1;
          this.fileData = [];
          this.getFile();
        }
        this.getSpaces();
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
        });
      });
    },
    ShiftFile() {
      //修改文件所在分组
      var ids_ = [];
      this.fileData.forEach((item) => {
        if (item.checked == true) {
          ids_.push(item.id);
        }
      });
      if (ids_.length <= 0) {
        this.$message({
          type: "info",
          message: "请先选择文件",
        });
        return;
      }
      if (this.FGradio == 0) {
        this.$message({
          type: "info",
          message: "请选择目标文件分组",
        });
        return;
      }
      if (this.FGradio == this.pageData.gId) {
        this.$message({
          type: "info",
          message: "文件已存在当前文件分组",
        });
        return;
      }
      var data_ = {
        GroupId: this.FGradio,
        ids: ids_.join(","),
      };
      ShiftAPI(this.FGradio, data_, "put").then((res) => {
        console.log(res);
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        ids_.forEach((id) => {
          this.fileData = this.fileData.filter((t) => t.id != id); //返回元素不等于id的其他元素
          console.log(this.fileData);
        });
        this.$message({
          showClose: true,
          message: "移动成功",
          type: "success",
        });
      });
    },
    AddFileGroup() {
      //新增文件分组
      var data_ = {
        GroupName: this.AddGroupName,
      };
      GroupAddAPI(data_, "post").then((res) => {
        console.log(res);
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success",
        });
        this.fileData = [];
        this.getFg();
        this.dialogFGVisible = false;
      });
    },
    DelFileGroup(id) {
      //删除文件分组
      if (this.fileData.length > 0) {
        this.$message.error("分组内还有文件，不能删除");
        return;
      }
      DELGAPI(id, "delete").then((res) => {
        console.log(res);
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success",
        });
        this.fileData = [];
        this.getFg();
      });
    },
  },
  mounted() {
    this.getFg();
    this.getSpaces();
  },
};
</script>

<style lang="scss" scoped>
.diaLoagImg {
  // width: 350px;
  height: 350px;
  overflow: auto;
}
.picture {
  min-height: 786px;
}
/deep/ .el-container {
  // min-height: 786px;
  height: 100%;
}
// /deep/ .el-card__body {
//   height: 500px;
// }
.el-card__header {
  padding: 0.938vw 1.042vw;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  height: 100px;
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
  height: 600px;
}
</style>