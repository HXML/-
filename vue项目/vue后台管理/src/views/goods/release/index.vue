<template>
  <div class="release">
    <errorPage v-if="CODE===101" />
    <div v-else style=" background-color: #ffffff; height:100%;">
      <!-- 联级选择器 -->
      <div class="panel br-8">
        <span class="title">请在下方选择您要发布商品的类目</span>
        <div class="flex">
          <section class="section">
            <div class="section_head">
              <span class="span_title">选择一级类目</span>
            </div>
            <ul>
              <li
                v-for="(item,index) in firstList"
                :key="index"
                class="flex jc-sb aic pointer"
                @click="changeIndex('first',index,item)"
                :class="index==firstActive?'activeLi':''"
              >
                <span>{{item.categoryName}}</span>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </section>
          <section class="section" v-show="firstActive!==null">
            <div class="section_head">
              <span class="span_title">选择二级类目</span>
            </div>
            <ul>
              <li
                v-for="(item,index) in secondList"
                :key="index"
                class="flex jc-sb aic pointer"
                @click="changeIndex('second',index,item)"
                :class="index==secondActive?'activeLi':''"
              >
                <span>{{item.categoryName}}</span>
                <i class="el-icon-arrow-right"></i>
              </li>
            </ul>
          </section>
          <section class="section" v-show="secondActive!==null">
            <div class="section_head">
              <span class="span_title">选择三级类目</span>
            </div>
            <ul>
              <li
                v-for="(item,index) in thirdList"
                :key="index"
                class="flex jc-sb aic pointer"
                :class="index==thirdActive?'activeLi':''"
                @click="changeIndex('third',index,item)"
              >
                <span>{{item.categoryName}}</span>
              </li>
            </ul>
          </section>
        </div>
        <div class="panelFooter" v-if="firstTitle!==''">
          <span>已选类目：{{firstTitle.categoryName}}{{secondTitle.categoryName}}{{thirdTitle.categoryName}}</span>
        </div>
        <div class="fcc">
          <div
            class="pointer"
            :class="thirdActive==null?'btn':'activeBtn'"
            @click="toRelease()"
          >下一步，发布商品</div>
        </div>
      </div>
    </div>
  </div>
  <!-- <releaseComponet :message="{firstTitle,secondTitle,thirdTitle}" v-else /> -->
</template>

<script>
import { GoodsCateListAPI } from "@/api/goodsManage";
export default {
  data() {
    return {
      CODE: 0,
      firstActive: null,
      secondActive: null,
      thirdActive: null,
      firstTitle: "",
      secondTitle: "",
      thirdTitle: "",
      firstList: [],
      secondList: [],
      thirdList: [],
    };
  },
  methods: {
    changeIndex(name, index, item) {
      if (name == "first") {
        //第一个列表li的点击事件
        this.firstActive = index;
        this.firstTitle = item;
        console.log(item.id, "console.log(item.id);console.log(item.id);");
        this.getFirstList(item.id, "getSecondList");
        if (this.secondActive !== null) {
          this.secondActive = null;
          this.thirdActive = null;
        }
      }
      if (name == "second") {
        //第二个列表li的点击事件
        this.getFirstList(item.id, "getThirdList");
        this.secondActive = index;
        this.secondTitle = item;
        this.thirdActive = null;
      }
      if (name == "third") {
        //第三个列表li的点击事件
        this.thirdActive = index;
        this.thirdTitle = item;
      }
    },
    toRelease() {
      this.$router.push({
        name: "releaseComponet",
        query: {
          firstTitle: JSON.stringify(this.firstTitle),
          secondTitle: JSON.stringify(this.secondTitle),
          thirdTitle: JSON.stringify(this.thirdTitle),
        },
      });
    },
    getFirstList(id, string) {
      let data = {
        pId: id,
      };
      if (string === "getFirstList") {
        GoodsCateListAPI(data, "get").then((res) => {
          console.log(res);
          if (res.code == 101) {
            this.CODE = 101;
          }
          this.firstList = res.data;
        });
      } else if (string === "getSecondList") {
        GoodsCateListAPI(data, "get").then((res) => {
          console.log(res);
          this.secondList = res.data;
        });
      } else if (string === "getThirdList") {
        GoodsCateListAPI(data, "get").then((res) => {
          console.log(res);
          this.thirdList = res.data;
        });
      }
    },
  },
  mounted() {
    this.getFirstList(0, "getFirstList");
  },
};
</script>

<style lang="scss" scoped>
.panelFooter {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(177, 182, 195, 1);
  margin-top: 12px;
}
.footer {
  text-align: center;
  line-height: 50px;
  position: fixed;
  width: 67%;
  bottom: 0;
  height: 50px;
  background-color: #ffffff;
}
.el-cascader-panel {
  background-color: #ffffff;
}
.panel {
  // min-height: 786px;

  padding: 24px 24px 0 24px;
  .title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(228, 109, 12, 1);
  }
  .section {
    margin-top: 15px;
    border: 1px solid #eeeeee;
    width: 312px;
    ul {
      height: 476px;
      overflow-y: scroll;
    }
    li {
      border-left: 2px solid #fff;
      padding: 8px 17px 0 20px;
      height: 38px;
      line-height: 38px;
    }
    .activeLi {
      border-left: 2px solid #0d69c5;
      background: rgba(13, 105, 197, 0.08);
    }
  }
  .btn {
    pointer-events: none;
    margin-top: 60px;
    text-align: center;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
    width: 250px;
    height: 42px;
    line-height: 42px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(177, 182, 195, 1);
  }
  .activeBtn {
    margin-top: 60px;
    text-align: center;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    width: 250px;
    height: 42px;
    line-height: 42px;
    background: #0d69c5;
    border-radius: 4px;
    border: 1px solid #0d69c5;
  }
  .section_head {
    width: 312px;
    height: 47px;
    line-height: 47px;
    border: 1px solid #eeeeee;
    .span_title {
      margin-left: 20px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(33, 33, 33, 1);
    }
  }
}
</style>