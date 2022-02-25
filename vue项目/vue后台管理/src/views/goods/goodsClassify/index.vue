<template>
  <errorPage v-if="CODE===101" />
  <div class="goodClassify br-8" v-else>
    <div class="header">
      <div class="flex aic jc-sb fontDColor f12 headContent w410">
        <span>类目名称</span>
        <span>操作</span>
      </div>
      <el-divider></el-divider>
    </div>
    <div class="container">
      <div class="addFristTitle mt-20 mb-24 pointer" @click="AddFirstTitle">添加一级类目</div>
      <div v-for="(item,index) in classifyList" :key="index" class="mt-16 w410">
        <div class="first flex aic jc-sb">
          <div>
            <div class="flex aic">
              <img @click="item.isOpen=!item.isOpen" src="@/assets/down.png" class="down_png" />
              <el-input
                v-model="item.categoryName"
                placeholder="请输入内容"
                class="mr-8"
                style="width:136px;"
              ></el-input>
              <div class="flex aic" @click="AddSecondTitle(index,item.id);item.isOpen=true;">
                <i class="el-icon-circle-plus mainColor f18"></i>
                <span class="mainColor f10 mainwidth pointer">添加子类目</span>
              </div>
            </div>
          </div>
          <div class="flex aic">
            <div class="mr-30">
              <i
                @click="upClick(index,item.id)"
                class="el-icon-top mr-24 upColor"
                :class="index===0?'disabledColor':''"
              ></i>
              <i
                @click="downClick(index,item.id)"
                class="el-icon-bottom downColor"
                :class="index===classifyList.length-1?'disabledColor':''"
              ></i>
            </div>
            <span class="fontCColor mainwidth55 pointer" @click="DeleteFirstTitle(index,item.id)">删除</span>
          </div>
        </div>
        <div v-if="item.isOpen">
          <div class="flex2" v-for="(son,sonIndex) in item.children" :key="sonIndex">
            <div class="flex aic jc-sb">
              <el-input
                v-model="son.categoryName"
                placeholder="请输入内容"
                class="mr-8 ml-48 mt-8"
                style="width:136px;"
              ></el-input>
              <div class="flex aic">
                <div class="mr-30">
                  <i
                    @click="sonlistUp(index, sonIndex,son.id)"
                    class="el-icon-top mr-24 upColor"
                    :class="sonIndex===0?'disabledColor':''"
                  ></i>
                  <i
                    @click="sonlistDown(index, sonIndex,son.id)"
                    class="el-icon-bottom downColor"
                    :class="sonIndex===item.children.length-1?'disabledColor':''"
                  ></i>
                </div>
                <span class="fontCColor pointer" @click="DeleteSonTitle(index,sonIndex,son.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-button class="saveBtn" @click="SubmitAll()">保存商品类目</el-button>
  </div>
</template>

<script>
import {
  ShopCateListAPI,
  AddSTypeAPI,
  StorAPI,
  ShopCateDelAPI,
} from "@/api/goodsClassifyAPI";
import qs from "qs";
export default {
  data() {
    return {
      CODE: 0,
      classifyList: [],
    };
  },
  methods: {
    AddFirstTitle() {
      //添加一级类目
      this.classifyList.push({
        id: 0,
        isOpen: true,
        categoryName: "",
        children: [
          {
            id: 0,
            categoryName: "",
          },
        ],
      });
    },
    AddSecondTitle(index, Pid) {
      //给指定一级类目天机子类目
      this.classifyList[index].children.push({
        id: 0,
        pId: Pid,
        categoryName: "",
      });
    },
    DeleteFirstTitle(index, id) {
      var data_ = {
        cId: id,
      };
      ShopCateDelAPI(data_, "delete").then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        //删除指定类目
        this.classifyList.splice(
          //删除属性列表 中 tableName 一样的值
          this.classifyList.findIndex((item, i) => i === index),
          1
        );
        this.$message.success("操作成功");
        console.log(res);
      });
    },
    DeleteSonTitle(index, sonIndex, id) {
      //删除指定类目下面的子类目
      if (this.classifyList[index].children.length <= 1) {
        this.$message.error("必须有一个子类目");
        return false;
      }
      console.log(id, "idid");
      if (id > 0) {
        var data_ = {
          cId: id,
        };
        ShopCateDelAPI(data_, "delete").then((res) => {
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }
          this.classifyList[index].children.splice(
            //删除属性列表 中 tableName 一样的值
            this.classifyList[index].children.findIndex(
              (item, i) => i === sonIndex
            ),
            1
          );
          this.$message.success("操作成功");
          // console.log(res);
        });
      } else {
        this.classifyList[index].children.splice(
          //删除属性列表 中 tableName 一样的值
          this.classifyList[index].children.findIndex(
            (item, i) => i === sonIndex
          ),
          1
        );
      }
    },
    // 上移
    upClick(index, id) {
      console.log("upClick", index);
      let newArr = this.swapItems(this.classifyList, index, index - 1);
      this.classifyList = newArr;

      //status 1是上移，2是下移
      var data_ = {
        id: id,
        status: 1,
      };
      StorAPI(data_, "put", id).then((res) => {
        console.log(res);
      });
    },
    // 下移
    downClick(index, id) {
      console.log("downClick", index);
      let newArr = this.swapItems(this.classifyList, index, index + 1);
      this.classifyList = newArr;

      //status 1是上移，2是下移
      var data_ = {
        id: id,
        status: 2,
      };
      StorAPI(data_, "put", id).then((res) => {
        console.log(res);
      });
    },
    //子分类上移
    sonlistUp(index, sonindex, id) {
      console.log("upClick", sonindex);
      let newArr = this.swapItems(
        this.classifyList[index].children,
        sonindex,
        sonindex - 1
      );
      this.classifyList[index].children = newArr;

      //status 1是上移，2是下移
      var data_ = {
        id: id,
        status: 1,
      };
      StorAPI(data_, "put", id).then((res) => {
        console.log(res);
      });
    },
    //子分类下移
    sonlistDown(index, sonindex, id) {
      let newArr = this.swapItems(
        this.classifyList[index].children,
        sonindex,
        sonindex + 1
      );
      this.classifyList[index] = newArr;

      //status 1是上移，2是下移
      var data_ = {
        id: id,
        status: 2,
      };
      StorAPI(data_, "put", id).then((res) => {
        console.log(res);
      });
    },
    swapItems(arr, index1, index2) {
      // 上下移动的核心。splice函数 返回的是被删除 项  并且 会改变原数组
      // arr.splice(index2, 1, arr[index])[0] 这个得到是的 被删除的 项 并且原数组 已经得到替换。所以需要将被删除项 设置为上一项的值
      //如果解释不是很清楚。自己去控制台 打印 玩玩  （主要是为自己理解做笔记）
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    GetClassList() {
      //查询分类数据
      ShopCateListAPI("GET").then((res) => {
        console.log(res);
        if (res.code == 101) {
          this.CODE = 101;
        }
        this.classifyList = res.data;
      });
    },
    SubmitAll() {
      //提交修改
      console.log(this.classifyList);

      var OneClass = [];
      var isReturn = false;
      this.classifyList.forEach((item) => {
        var TwoClass = [];
        if (item.categoryName == "") {
          this.$message({ message: "分类名不能为空", type: "warning" });
          isReturn = true;
          return;
        }
        item.children.forEach((itemC) => {
          if (itemC.categoryName == "") {
            this.$message({ message: "子分类名不能为空", type: "warning" });
            isReturn = true;
            return;
          }
          var ClassSon = {
            CategoryName: itemC.categoryName,
            Id: itemC.id,
          };
          TwoClass.push(ClassSon);
        });

        var ClassItem = {
          CategoryName: item.categoryName,
          Id: item.id,
          children: TwoClass,
        };
        OneClass.push(ClassItem);
      });

      if (isReturn) {
        return;
      }

      console.log(OneClass);

      var data_ = new FormData();
      data_.append("json", JSON.stringify(OneClass));

      AddSTypeAPI(data_, "post", true).then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        console.log(res);
        if (res.code == 1) {
          this.$message({ message: "保存成功", type: "success" });
          this.GetClassList();
        }
      });
    },
  },
  mounted() {
    this.GetClassList();
  },
};
</script>
<style lang="scss" scoped>
// height: 32px;
// line-height: 32px;
.goodClassify {
  .saveBtn {
    width: 250px;
    height: 42px;
    background: rgba(13, 105, 197, 1);
    border-radius: 4px;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    // line-height: 42px;
    // text-align: center;
    margin-top: 82px;
  }
  .disabledColor {
    pointer-events: none;
    color: #e8e8e8 !important;
  }
  .upColor {
    font-size: 18px;
    color: #e46d0c;
  }
  .mainwidth {
    min-width: 110px;
  }
  .mainwidth55 {
    min-width: 55px;
  }
  .downColor {
    font-size: 18px;
    color: #4a5060;
  }

  .ml-48 {
    margin-left: 48px;
  }
  .mr-30 {
    margin-right: 30px;
  }
  .w410 {
    width: 410px;
  }
  .down_png {
    margin-right: 16px;
    height: 16px;
    width: 16px;
  }
  padding: 24px 24px 0 24px;
  /deep/.el-input__inner {
    height: 24px;
    line-height: 24px;
    width: 136px;
  }
  .el-divider--horizontal {
    margin: 0;
  }
  background-color: #ffff;
  .headContent {
    height: 41px;
  }
  .container {
    .addFristTitle {
      width: 112px;
      height: 32px;
      background: rgba(228, 109, 12, 1);
      border-radius: 4px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
      text-align: center;
    }
  }
}
</style>