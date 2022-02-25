<template>
  <errorPage v-if="CODE === 101" />
  <div class="release" id="release" v-else>
    <section class="section current">
      <div class="flex aic pt-20 normal">
        当前类目:
        <el-breadcrumb
          style="background-color: #ffffff; border: 0"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item>{{
            message.firstTitle && message.firstTitle.categoryName
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            message.secondTitle && message.secondTitle.categoryName
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            message.thirdTitle && message.thirdTitle.categoryName
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="span_btn pointer" @click="changeGoodType">切换类目</div>
      </div>
      <el-form label-position="right" class="goodTitle" id="release">
        <el-form-item label="商品标题：" required>
          <el-input
            class="titleInput"
            id="goodsName"
            type="text"
            v-model="submitObj.goodsName"
            show-word-limit
            placeholder="标题描述最多100个字"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <div class="flex2">
          <!-- <el-switch
            style="width: fit-content;"
            v-model="submitObj.isRecommend "
            active-text="推荐本商品"
            class="mt-24"
          ></el-switch>
          <el-switch
            style="width: fit-content;"
            v-model="submitObj.isNew "
            active-text="上市新品"
            class="mt-24"
          ></el-switch>-->

          <el-checkbox-group v-model="SwitchChecked" class="flex2">
            <el-checkbox
              class="mt-16 wfc"
              v-for="(item, index) in SwicthCheckList"
              @change="handleSwitchChange($event, index, item)"
              :key="index"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form>
    </section>
    <!-- 销售信息 -->
    <section class="saleInfor section">
      <p class="saleHeader">
        <span class="ml-16">销售信息</span>
      </p>
      <el-form label-position="right">
        <div>
          <el-form-item label="颜色分类：" required>
            <div class="flex2 ai-fs">
              <div
                v-for="(item, index) in submitObj.busGoodsColorList"
                :key="index"
                class="mb-12 flex aic"
              >
                <el-input
                  @blur="blurInput(item.colorName, index)"
                  v-model="item.colorName"
                  placeholder="输入主色或选择颜色"
                  class="w307"
                ></el-input>
                <el-input
                  clearable
                  v-model="item.rmk"
                  placeholder="备注（如偏大偏小）"
                  class="ml-8"
                  style="width: 159px"
                ></el-input>
                <div
                  class="addIMG pointer"
                  v-if="item.imgStr == undefined || item.imgStr == ''"
                  @click="AddImg(item, index, 'busGoodsColorList')"
                >
                  添加图片
                </div>
                <div v-else class="flex aic">
                  <img
                    class="colorAddImg ml-8"
                    @click="AddImg(item, index, 'busGoodsColorList')"
                    :src="item.imgStr + '?x-oss-process=style/89900'"
                    alt
                  />
                  <span
                    class="mainColor f12 ml-8 pointer"
                    @click="deleteImg(item, index)"
                    >删除图片</span
                  >
                </div>
                <span
                  class="mainColor f12 ml-8 pointer"
                  @click="deleteProp(item, index)"
                  >删除一行</span
                >
              </div>
              <div
                class="flex aic pointer"
                style="width: fit-content"
                @click="addColorClassify()"
              >
                <i
                  style="font-size: 18px; margin-ringt: 2px; color: #0d69c5"
                  class="el-icon-plus"
                ></i>
                <span style="color: #0d69c5">添加颜色分类</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          class="mt-24 mr-24"
          v-for="(var_item, var_index) in variableProperty"
          :key="var_index"
          required
          :label="var_item.gPropList[0].groupName"
        >
          <div class="flex2 mt-8">
            <el-radio-group
              v-if="var_item.gPropList.length !== 0"
              class="mt-6"
              text-color="#0D69C5"
              v-model="var_item.fid"
            >
              <div
                class="mb-16"
                v-if="var_item.gPropList.length !== 1 || var_item.isGroupName"
              >
                <el-radio
                  @change="radioGroupChange($event, var_index, porp_index)"
                  v-for="(propItem, porp_index) in var_item.gPropList"
                  :label="propItem.id"
                  :key="porp_index"
                  >{{ propItem.propName }}</el-radio
                >
              </div>
            </el-radio-group>
            <el-input
              v-model="var_item.optInput"
              placeholder="输入自定义值"
              style="width: 170px"
              class="input-with-select"
            >
              <el-button
                @click="AddSizeClass(var_item.optInput, var_item)"
                slot="append"
                >添加</el-button
              >
            </el-input>
            <!-- 选项 -->
            <div class="flex2">
              <div
                v-if="var_item.gPropList[var_item.raIndex].optList.length > 0"
                class="checkboxGroup flex fw"
              >
                <div
                  class="checkbox_item flex aic ml-8"
                  v-for="(i, index) in returnGroupList(
                    var_item.gPropList,
                    var_item.fid
                  )"
                  :key="index"
                >
                  <el-checkbox
                    @change="handleCheckItem(i, var_item)"
                    v-model="i.propChecked"
                    >{{ i.optName }}</el-checkbox
                  >
                  <el-input
                    v-show="i.propChecked"
                    v-model="i.remarks"
                    style="width: 90px; margin-left: 12px"
                    placeholder="输入备注"
                  ></el-input>
                </div>
              </div>
              <!-- <div class="add flex aic pointer" style="margin-top:20px">
                <i style="font-size:18px;margin-ringt:2px;color:#0D69C5;" class="el-icon-plus"></i>
                <span style="color:#0D69C5;">添加尺码-尺寸对照表(暂无)</span>
              </div>-->
            </div>
          </div>
        </el-form-item>

        <el-form-item
          id="SKULIST"
          v-if="
            tableColumnList[0].prop == 'colorClassify' ||
            submitObj.busGoodsColorList.length > 1
          "
          style="margin-top: 30px"
          required
          label="商品销售规格："
        >
          <div class="flex">
            <span class="tips">在标题选择内容可以进行筛选和批量填充</span>
            <span class="btnADD pointer" @click="AddDataForList()"
              >批量添加</span
            >
          </div>
          <!-- 表格 -->

          <el-table
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            :span-method="objectSpanMethod"
            border
            :data="dataList"
            style="width: 100%"
          >
            <el-table-column
              :label="item.propName"
              :property="item.prop"
              v-for="item in tableColumnList"
              :key="item.prop"
              align="center"
            >
              <template v-if="item.isInputed" slot="header">
                <div class="flex aic">
                  <span
                    v-if="item.prop == 'price' || item.prop == 'stockQty'"
                    style="color: red"
                    class="mr-4"
                    >*</span
                  >
                  <el-input
                    v-if="item.prop == 'price' || item.prop == 'stockQty'"
                    type="number"
                    v-model="item.inputVal"
                    size="mini"
                    min="0"
                    :placeholder="item.placeholder"
                  />

                  <el-input
                    v-else
                    v-model="item.inputVal"
                    size="mini"
                    :placeholder="item.placeholder"
                  />
                </div>
              </template>
              <!-- isInputed为true时为下拉选择的模式 除了四个默认的新加入的都为下拉选择并且生成一个选择值 与一个空数组 -->
              <template v-else slot="header">
                <el-select
                  clearable
                  @visible-change="changeSelection"
                  v-model="item.selectValue"
                  :placeholder="item.placeholder"
                >
                  <el-option
                    v-for="(item, index) in item.selectOption"
                    :key="index"
                    :label="item"
                    :value="index"
                  ></el-option>
                </el-select>
              </template>
              <template slot-scope="scope">
                <!-- item.prop=='colorClassify'成立时 为不可改 -->
                <div v-if="item.prop == 'price' || item.prop == 'stockQty'">
                  <el-input
                    type="number"
                    v-model="scope.row[scope.column.property]"
                    min="0"
                  ></el-input>
                </div>
                <div
                  v-else-if="item.prop == 'shopCode' || item.prop == 'barCode'"
                >
                  <el-input
                    type="string"
                    v-model="scope.row[scope.column.property]"
                  ></el-input>
                </div>
                <div v-else>
                  {{
                    scope.row[scope.column.property] &&
                    scope.row[scope.column.property].OptName
                  }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表格 -->
        </el-form-item>
        <el-form-item style="margin-top: 30px" required label="一口价：">
          <div class="flex2">
            <div>
              <el-input
                id="goodPrice"
                type="number"
                v-model="submitObj.price"
                style="width: 288px"
              >
                <template slot="append">元</template>
              </el-input>
              <!-- <span class="f12 ml-8">元</span> -->
            </div>
            <!-- <span class="f12 fontEColor mt-6">本类目下，宝贝价格必须在5.00元-999999.00元之间</span> -->
          </div>
        </el-form-item>
        <el-form-item required class="mt-16" label="总数量：" id="stockQty">
          <el-input
            v-if="
              tableColumnList[0].prop == 'colorClassify' ||
              submitObj.busGoodsColorList.length > 1
            "
            disabled
            type="number"
            v-model="allPrice"
            style="width: 288px"
            min="0"
          ></el-input>
          <el-input
            v-else
            type="number"
            v-model="submitObj.stockQty"
            style="width: 288px"
            min="0"
          >
            <template slot="append">件</template>
          </el-input>
          <!-- <span class="f12 ml-8">件</span> -->
        </el-form-item>
        <el-form-item required class="mt-16" label="商家编码：">
          <el-input
            id="spuNo"
            type="string"
            placeholder="只能输入数字与英文"
            v-model="submitObj.spuNo"
            @input="accountInput('spuNo', submitObj.spuNo)"
            style="width: 617px"
          ></el-input>
        </el-form-item>
        <el-form-item required class="mt-16" label="商品条形码：">
          <el-input
            id="barCode"
            type="string"
            placeholder="只能输入数字与英文"
            v-model="submitObj.barCode"
            style="width: 617px"
            @input="accountInput('barCode', submitObj.barCode)"
          ></el-input>
        </el-form-item>
      </el-form>
    </section>

    <section class="section ImgFontDec">
      <p class="saleHeader">
        <label class="flex ml-16">
          <span style="color: red">*</span>
          <span class="ml-4">图文描述</span>
        </label>
      </p>
      <div class="flex aic mt-16">
        <span class="labelName">商品主图：</span>
        <span class="labelTips"
          >商品主图文件大小不能超过3MB；建议使用800*800尺寸的图片</span
        >
      </div>
      <div class="flex mt-8 mb-24">
        <div
          class="add mr-16 mt-28 rel"
          v-for="(item, index) in IMGLISt"
          :key="index"
        >
          <div
            v-if="!item.imgUrl"
            @click="AddImg(item, index, 'IMGLISt')"
            class="upLoadImg fcc"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
          <img
            v-else
            @click="AddImg(item, index, 'IMGLISt')"
            style="width: 88px; height: 80px"
            :src="item.imgUrl + '?x-oss-process=style/89900'"
          />
          <i
            v-if="item.imgUrl"
            @click="deleteMainImg(item, index)"
            class="el-icon-circle-close abs closeImg"
          ></i>
        </div>
      </div>
      <!-- 富文本 -->
      <div v-if="ritchText !== null || isAddStatus" class="rel">
        <mceEditor
          v-on:openPictrue="openPictrue"
          :config="Config"
          v-model="ritchText"
          :url="Url"
          :max-size="MaxSize"
          :accept="Accept"
          :with-credentials="false"
          @on-ready="onEditorReady"
          @on-destroy="onEditorDestroy"
          @on-upload-success="onEditorUploadComplete"
          @on-upload-fail="onEditorUploadFail"
        ></mceEditor>
        <div class="abs prePhone">
          <img @click="chufa" src="@/assets/ihpone.png" alt />
        </div>
      </div>

      <el-form class="mt-24 flex aic">
        <el-form-item label=" 店铺中分类：">
          <el-cascader
            style="width: 288px; margin-right: 20px"
            ref="myCascader"
            :value="submitObj.shopCategoryId"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </section>
    <section class="section">
      <p class="saleHeader">
        <span class="ml-16">物流方式</span>
      </p>
      <el-form class="mt-24">
        <el-form-item label="运费模版：" id="expTmpId" required>
          <div class="flex">
            <el-select
              @change="changeyunfei"
              v-model="submitObj.expTmpId"
              placeholder="全部"
              style="width: 288px; margin-right: 20px"
            >
              <el-option
                v-for="(item, index) in deliveryTmpsList"
                :key="index"
                :label="item.tmpName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="BTN ml-24" @click="editModel">编辑运费模版</div>
            <!-- <div class="BTN ml-24">刷新运费模版</div> -->
          </div>
        </el-form-item>
        <el-form-item label="商品重量：" class="mt-16" id="weight" required>
          <div class="flex2">
            <div class="flex">
              <el-input
                type="number"
                v-model="submitObj.weight"
                style="width: 288px"
                placeholder="请输入内容"
              >
                <template slot="append">千克</template>
              </el-input>
              <!-- <span class="ml-24">千克</span> -->
            </div>
            <span style="color: #b1b6c3"
              >当前运费模板，按物流重量（含包装）计费</span
            >
          </div>
        </el-form-item>
      </el-form>
    </section>
    <section class="section">
      <p class="saleHeader">
        <span class="ml-16">售后服务</span>
      </p>
      <el-form class="mt-24">
        <el-form-item label="售后服务：" id="serviceType" required>
          <div class="flex2">
            <el-checkbox-group v-model="checkList" class="flex2">
              <el-checkbox
                @change="
                  handleCheckboxGroupChange(
                    $event,
                    item.dictValue,
                    item.dictValue
                  )
                "
                :disabled="item.dictValue == '4'"
                v-for="(item, index) in checkOption"
                :key="index"
                :label="item.dictName"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </section>
    <section class="section">
      <p class="saleHeader">
        <span class="ml-16">发布选项</span>
      </p>
      <el-form class="mt-24">
        <el-form-item label="发布选项：" required>
          <el-radio v-model="submitObj.status" :label="2">发布并上线</el-radio>
          <el-radio v-model="submitObj.status" :label="1">发布到仓库</el-radio>
          <span style="color: #e46d0c"
            >预售商品提前发布到仓库，到预售时间快速上线</span
          >
        </el-form-item>
      </el-form>
    </section>
    <div class="footer mt-24 fcc" id="submitBtn">
      <div @click="submitAllInfor()" class="submitBtn pointer">
        提交商品信息
      </div>
    </div>
    <!-- 图片空间 -->
    <div class="pictureSpace">
      <el-dialog title="我的图片空间" :visible.sync="showImgModel">
        <pictureSpace
          v-if="showImgModel"
          :pictureNumber="pictureNumber"
          :arrName="arrName"
          :arrIndex="arrIndex"
          v-on:getImgList="getImgList"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pictureSpace from "@/components/pictureSpace/index";
import mceEditor from "@/components/richText";
import uploadOssone from "@/components/uploadOssone";
import {
  GetProperListAPI,
  AddGoodsAPI,
  GoodsEditSaveAPI,
} from "@/api/goodsManage";
export default {
  components: {
    mceEditor,
    uploadOssone,
    pictureSpace,
  },
  computed: {
    // 计算属性的 getter
    allPrice: function () {
      let number = 0;
      this.dataList.forEach((item) => {
        number += Number(item.stockQty);
      });
      this.submitObj.stockQty = number; //把计算好的数量给到提交表单
      return number;
    },
  },
  data() {
    return {
      CODE: 0,
      SwitchChecked: ["推荐本商品", "上市新品"],
      SwicthCheckList: ["推荐本商品", "上市新品"], //推荐和新品的多选
      updateCount: 1, //是否新增数据
      editor: null, //富文本的实例editor
      arrIndex: null, //默认为0 数字第几个
      arrName: "", //数组名字
      spaceImgList: [], //来自图片空间的图片
      pictureNumber: 5, //上传图片限制个数
      showImgModel: false, //是否展示
      IMGLISt: [
        {
          imgId: 0,
          imgUrl: "",
        },
        {
          imgId: 0,
          imgUrl: "",
        },
        {
          imgId: 0,
          imgUrl: "",
        },
        {
          imgId: 0,
          imgUrl: "",
        },
        {
          imgId: 0,
          imgUrl: "",
        },
      ], // 图片
      submitObj: {
        isRecommend: true,
        isNew: true,
        newPropList: [], //所有点击新增的属性
        //后台需要的数据结构
        ID: 0, //当ID为0时 未发布商品 编辑时传id
        goodsName: "", //商品名称
        price: "", //价格
        stockQty: "", //数量
        spuNo: "", //商家编码
        barCode: "", //商家条形码
        imgList: "", //商品图片集合 多张图片id以逗号隔开
        details: null, //详情  富文本
        categoryId: "", //后台类目id
        shopCategoryId: "", //店铺中分类ID传 例:1  opindex
        expTmpId: "", //运费模板 传选中的  例:1 opindex
        weight: "", //重量
        serviceType: "", //售后服务   ID以逗号隔开
        status: 2, //状态（1仓库，2上架）
        //颜色单独集合
        busGoodsColorList: [
          //颜色分类列表
          {
            colorName: "", //颜色名称
            rmk: "", //颜色备注
            imgStr: "", //颜色后面的那张图片路径
            ImgId: 0,
          },
        ],
        skuGoodsList: [], //这里就到了每个SKU 这里是每一个的sku的集合
      },
      isAddStatus: true, //是否为添加状态
      imgUrlListId: [],
      options: [], //店铺中的分类
      //动态表格
      tableColumnList: [
        // (属性列表)一定存在的四个属性
        {
          prop: "price",
          propName: "价格",
          placeholder: "价格(元)",
          inputVal: "",
          isInputed: true,
        },
        {
          prop: "stockQty",
          propName: "数量(件)",
          placeholder: "数量",
          inputVal: "",
          isInputed: true,
        },
        {
          prop: "shopCode",
          propName: "商家编码",
          placeholder: "商家编码", ///sku
          inputVal: "",
          isInputed: true,
        },
        {
          prop: "barCode",
          inputVal: "",
          propName: "商品条形码",
          placeholder: "商品条形码",
          isInputed: true,
        },
      ],
      deliveryTmpsList: [], //运费模板
      alwaysObj: {
        //固定的四个属性
        price: "",
        stockQty: "",
        shopCode: "",
        barCode: "",
      },
      dataList: [], //表格数据每一行数据
      variableProperty: [], //发布商品时 后台返回的的数组
      checkOption: [], //售后选选项
      checkIdList: ["4"], //默认选中
      checkList: ["服务承诺:该类商品，必须支持【七天退货】服务"], //选中的 选项
      message: "", //接收的上级传过来的值
      //富文本的
      ritchText: null, //过度富文本
      Config: {},
      Url: "",
      Accept: "",
      MaxSize: 2097152, //默认
      withCredentials: false,
      //富文本的
    };
  },
  methods: {
    //改变多选的值
    handleSwitchChange(event, index, item) {
      console.log(event, index, item, "aaa");
      if (item === "推荐本商品") {
        this.submitObj.isRecommend = event;
      } else if (item === "上市新品") {
        this.submitObj.isNew = event;
      }
      console.log(this.SwitchChecked);
    },
    openPictrue(editor, aaa) {
      // console.log(aaa, "aaaaaaaaa");
      this.pictureNumber = 5;
      this.showImgModel = true;
      this.arrName = "formRicthText";
      console.log(editor);
      this.editor = editor;
    },
    getImgList(imgData, arrName, arrIndex) {
      console.log(imgData, arrName, arrIndex, "imgData, arrName,arrIndex");
      this.showImgModel = false;

      if (arrName === "IMGLISt" && arrIndex === null) {
        //商品主图
        let getArr = this.IMGLISt.reduce((finalList, item, index) => {
          // console.log(index, "imgData[index]");
          if (imgData[index]) {
            finalList.push({
              imgId: imgData[index].fileId,
              imgUrl: imgData[index].fileUrl,
            });
          }
          return finalList;
        }, []);
        let haveImgArr = this.IMGLISt.filter((item) => item.imgUrl !== "");
        let getarrhaveImg = getArr.filter((item) => item.imgUrl !== "");
        let newArr = [...haveImgArr, ...getarrhaveImg];
        this.IMGLISt = this.IMGLISt.map((item, index) => {
          // console.log(index, "imgData[index]");
          if (newArr[index]) {
            return {
              imgId: newArr[index].imgId,
              imgUrl: newArr[index].imgUrl,
            };
          } else {
            return {
              imgId: 0,
              imgUrl: "",
            };
          }
        });
      } else if (arrName === "busGoodsColorList") {
        //颜色的分类
        this.submitObj.busGoodsColorList[arrIndex].ImgId = imgData[0].fileId;
        this.submitObj.busGoodsColorList[arrIndex].imgStr = imgData[0].fileUrl;
      } else if (arrName === "formRicthText") {
        console.log(this.editor, "this.editor");
        imgData.forEach((item, index) => {
          this.editor.insertContent(
            `<img style="width:100%; vertical-align: top;" src='${imgData[index].fileUrl}?x-oss-process=style/base'>`
          );
        });
      } else {
        console.log(imgData[0], "imgData[0].fileId");
        this.IMGLISt[arrIndex].imgId = imgData[0].fileId;
        this.IMGLISt[arrIndex].imgUrl = imgData[0].fileUrl;
      }
      console.log(this.IMGLISt, " this.IMGLISt");
    },
    changeGoodType() {
      this.$confirm("修改类目将会丢失数据!确认离开?").then(() => {
        this.$router.push({ name: "release" });
      });
    },
    editModel() {
      this.$confirm("离开页面将会丢失数据!确认离开?").then(() => {
        this.$router.push({ name: "ExpressTemset" });
      });
    },
    accountInput(type, val) {
      let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
        len = val.length,
        str = "";
      for (var i = 0; i < len; i++) {
        if (codeReg.test(val[i])) {
          str += val[i];
        }
      }
      if (type == "spuNo") {
        this.submitObj.spuNo = str;
      } else if (type == "barCode") {
        this.submitObj.barCode = str;
      }
    },
    changeyunfei(e) {
      console.log(e);
      this.submitObj.expTmpId = e;
    },
    chufa() {
      console.log(document.getElementsByClassName("mce-text"));
      let arr = document.getElementsByClassName("mce-text");
      document.getElementsByClassName("mce-i-preview")[0].click();
    },
    blurChangePrice(priceNum) {
      if (priceNum < 0 || priceNum == 0) {
        console.log("输入不合法");
        return false;
      }
    },
    returnGroupList(list, id) {
      //通过fid 去过滤下面的oplist 0 为没有分组
      if (id !== 0) {
        if (list.find((item) => item.id == id) !== undefined) {
          return list.find((item) => item.id == id).optList;
        }
      } else {
        return list[0].optList;
      }
    },
    deleteMainImg(item, index) {
      this.IMGLISt[index].imgId = 0;
      this.IMGLISt[index].imgUrl = "";
    },
    AddImg(item, arrIndex, arrName) {
      console.log(item, arrIndex, arrName, "item, arrIndex, arrName");
      //添加图片
      this.spaceImgList = [];
      this.pictureNumber = 1; //当前为单张图片 上传
      this.arrName = arrName; //当classIndex为0时 为数组
      this.arrIndex = arrIndex; //当classIndex为0时 为数组
      this.showImgModel = true;
    },
    radioGroupChange($event, var_index, index) {
      this.$message({
        message: "改变radio将会清空所选的东西",
        type: "warning",
      });
      this.variableProperty[var_index].gPropList[index].optList.forEach(
        (item) => {
          item.propChecked = false;
        }
      ); //把下面的勾选的去掉
      this.tableColumnList.forEach((item) => {
        //下面选项置空
        if (
          item.prop === this.variableProperty[var_index].gPropList[0].tableName
        ) {
          item.selectOption = [];
        }
      });

      console.log(this.variableProperty[var_index].gPropList[0].tableName);
    },
    handleChange(val) {
      //这是店铺中的分类
      console.log(val);
      this.submitObj.shopCategoryId = val;
    },
    ReScrollTo(value, srcollName, srcollId) {
      if (!value) {
        this.$notify({
          title: "提示",
          message: srcollName,
          type: "warning",
        });
        var node = document.getElementById(srcollId);
        var yourHeight = 64;
        // scroll to your element
        node.scrollIntoView(true);
        // now account for fixed header
        var scrolledY = window.scrollY;
        if (scrolledY) {
          window.scroll(0, scrolledY - yourHeight);
        }
        return false;
      } else {
        return true;
      }
    },
    replaceData(str) {
      var reg = /[']/g;
      let strTow = str.replace(reg, "''");
      return strTow;
    },
    submitAllInfor() {
      //空值判断
      let needArr = [
        {
          val: this.submitObj.goodsName,
          noticeName: "请填写商品名称",
          domId: "goodsName",
        },
        {
          val: this.submitObj.price,
          noticeName: "请填写一口价",
          domId: "goodPrice",
        },
        {
          val: this.submitObj.spuNo,
          noticeName: "请填写商家编码",
          domId: "spuNo",
        },
        {
          val: this.submitObj.stockQty,
          noticeName: "请填写商品数量",
          domId: "stockQty",
        },
        {
          val: this.submitObj.barCode,
          noticeName: "请填写商家条形码",
          domId: "barCode",
        },
        {
          val: this.submitObj.expTmpId,
          noticeName: "请选择运费模板",
          domId: "expTmpId",
        },
      ];
      for (let index = 0; index < needArr.length; index++) {
        console.log(index, "index");
        let reslut = this.ReScrollTo(
          needArr[index].val,
          needArr[index].noticeName,
          needArr[index].domId
        );
        console.log(reslut, "reslutreslut");
        if (!reslut) {
          return false;
        } else {
          continue;
        }
      }
      if (this.submitObj.weight == 0 || this.submitObj.weight < 0) {
        this.ReScrollTo("", "请填写商品重量,或者商品重量不为0!", "weight");
        return false;
      }
      //空值判断

      //详情图片处理
      let ret = this.ritchText !== null ? this.ritchText.match(/img/gi) : [];
      console.log(ret);
      if (ret && ret.length > 15) {
        this.$notify({
          title: "提示",
          message: "商品详情不能上传15张图以上",
          type: "warning",
        });
        return false;
      }
      //详情图片处理

      //主图id处理
      let submitIds = this.IMGLISt.reduce((arr, item) => {
        if (item.imgId > 0) {
          arr.push(item.imgId);
        }
        return arr;
      }, []);
      this.submitObj.imgList = submitIds.join(",");
      //主图id处理
      this.getBackstageData();
      //富文本加密
      this.submitObj.details =
        this.ritchText == null ? "" : this.replaceData(this.ritchText);
      // //提交表单
      // console.log(this.submitObj, "this.submitObj");
      if (!this.isAddStatus) {
        var formData = new FormData();
        formData.append("jObject", JSON.stringify(this.submitObj));
        GoodsEditSaveAPI(formData, "post").then((res) => {
          console.log(res.code);
          if (res.code == 1) {
            this.$message({
              message: "编辑成功!",
              type: "success",
            });
            if (this.submitObj.status == 2) {
              this.$router.push({ name: "onSale" });
            } else if (this.submitObj.status == 1) {
              this.$router.push({ name: "offlineGoods" });
            }
          } else {
            this.$notify({
              title: "提示",
              message: res.msg,
              type: "warning",
            });
          }
        });
      } else {
        console.log(this.ritchText, "this.ritchText");
        console.log(this.submitObj, "this.submitObj");
        // return false;
        var formData = new FormData();
        formData.append("jObject", JSON.stringify(this.submitObj));
        AddGoodsAPI(formData, "PUT").then((res) => {
          console.log(res.msg);
          if (res.code == 1) {
            this.$message({
              message: "发布成功",
              type: "success",
            });
            if (this.submitObj.status == 2) {
              this.$router.push({ name: "onSale" });
            } else if (this.submitObj.status == 1) {
              this.$router.push({ name: "offlineGoods" });
            }
          } else {
            this.$notify({
              title: "提示",
              message: res.msg,
              type: "warning",
            });
          }
        });
      }
    },
    getBackstageData() {
      //将数据格式处理为后台的
      console.log(this.dataList, "this.dataListthis.dataList");
      let SkuList = [];
      this.dataList.forEach((item) => {
        let obj = {
          OptList: [],
        };
        for (let i in item) {
          if (
            i == "iD" ||
            i == "price" ||
            i == "stockQty" ||
            i == "shopCode" ||
            i == "barCode"
          ) {
            obj.iD = item.iD ? item.iD : 0;
            obj.stockQty = item.stockQty;
            obj.price = item.price;
            obj.shopCode = item.shopCode;
            obj.barCode = item.barCode;
          } else {
            if (i !== "OptList") {
              obj.OptList.push(item[i]);
            }
          }
        }
        SkuList.push(obj);
      });
      console.log(SkuList, "SkuListSkuListSkuList");
      this.submitObj.skuGoodsList = SkuList;
    },

    handleCheckboxGroupChange(event, val) {
      //售后服务多选
      console.log(event, val, this.checkList, "handleCheckboxGroupChange");
      if (event) {
        this.checkIdList.push(val);
      } else {
        this.checkIdList.splice(
          this.checkIdList.findIndex((item) => item == val),
          1
        );
      }
      console.log(this.checkIdList.join(","));
      this.submitObj.serviceType = this.checkIdList.join(",");
    },
    AddDataForList() {
      //批量添加
      // console.log(this.tableColumnList);
      let filterCondition = []; //筛选条件列表
      let filterContent = []; // 填充内容
      this.tableColumnList.forEach((item) => {
        if (item.isInputed) {
          //填充内容
          let obj = {
            key: item.prop,
            value: item.inputVal,
          };
          // obj[item.prop] = item.inputVal;
          filterContent.push(obj);
        } else {
          //晒选条件
          let obj = {
            key: item.prop,
            value: item.selectOption[item.selectValue],
          };
          // obj[item.prop] = item.selectOption[item.selectValue];
          filterCondition.push(obj);
          // Object.assign({}, filterContent, obj);
        }
      });
      this.dataList.forEach((item) => {
        let arr = filterCondition.map((k) => {
          if (k.value == "" || k.value == undefined) {
            //为空或者为undefine 是 返回true
            return true;
          } else {
            console.log(item[k.key], k.value, "k.value");
            return item[k.key].OptName == k.value;
          }
        });
        // console.log(arr, "arr");
        if (!arr.includes(false)) {
          ///如果数组内存不在false 就表示这条数据筛选了 然后把数据赋值
          filterContent.forEach((i) => {
            if (i.value !== "") {
              item[i.key] = i.value;
            } else {
              return false;
            }
          });
        }
      });
      this.submitObj.skuGoodsList.forEach((item) => {
        let arr = filterCondition.map((k) => {
          if (k.value == "" || k.value == undefined) {
            //为空或者为undefine 是 返回true
            return true;
          } else {
            return item[k.key] == k.value;
          }
        });
        if (!arr.includes(false)) {
          filterContent.forEach((i) => {
            item[i.key] = i.value;
          });
        }
      });
    },
    handleCheckItem(item, var_item) {
      console.log(var_item, "var_item");
      this.addOneMoreColumn(var_item); //添加一列
      //点击checkbox的时候
      this.tableColumnList.map((option) => {
        //新增下拉选项
        if (option.prop == var_item.gPropList[0].tableName) {
          option.selectOption.push(item.optName);
          return option;
        } else {
          return option;
        }
      });
      this.updateDataList(); //更新dataList的表格数据
      console.log(var_item, this.dataList, "var_item");
    },
    updateDataList() {
      //更新dataList
      let colorObj = {
        name: "colorClassify",
        list: this.submitObj.busGoodsColorList.map((item) => {
          //抽离颜色的分组
          return {
            name: item.colorName,
            OptId: -1, //-1代表的是颜色分类
            propertyId: -1, //-1代表的是颜色分类
          };
        }),
      };
      let newAddArr = []; //定义一个空数组 存放 propname值 与选项值
      this.variableProperty.forEach((item) => {
        return item.gPropList.forEach((i) => {
          console.log(i, "i.optList");
          let obj = {
            name: i.tableName,
            list: i.optList,
          };
          newAddArr.push(obj);
        });
      });
      let filterArr = []; //过滤已选中的数组 并把空数组去掉
      filterArr = newAddArr
        .map((obj) => {
          return {
            name: obj.name,
            list: obj.list.filter((i) => i.propChecked == true),
          };
        })
        .filter((item) => item.list.length > 0);
      let needArray = filterArr.map((item) => {
        console.log(item, "itemitemitemitemitemitem");
        //把选项值拿出当一个数组
        return {
          name: item.name,
          list: item.list.map((k) => {
            return {
              name: k.optName,
              propertyId: k.propertyId,
              OptId: k.id, //商品属性选项新增为0
            };
          }),
        };
      });
      let FinalArry = [colorObj, ...needArray];
      console.log(FinalArry, "FinalArry");
      console.log(this.dataList.length, "this.dataListthis.dataList "); //bug1 当新增的时候会把原有的price等属性置空
      this.dataList = []; //点击的时候要先清空
      this.getSkuData([], 0, FinalArry);
    },
    // 递归获取每条SKU数据
    getSkuData(skuArr = [], i, item) {
      // console.log(item[i].list, "item.list[i].length,item.list[i].length,");
      for (let j = 0; j < item[i].list.length; j++) {
        if (i < item.length - 1) {
          let obj = {};
          let key = item[i].name;
          let val = item[i].list[j].name;
          obj.OptList = [];
          obj[key] = {
            OptName: val,
            PropertyId: item[i].list[j].propertyId,
            OptId: item[i].list[j].OptId,
          };
          skuArr[i] = obj;
          this.getSkuData(skuArr, i + 1, item); // 递归循环
        } else {
          let obj = {};
          let key = item[i].name;
          let val = item[i].list[j].name;
          obj.OptList = [];
          obj[key] = {
            OptName: val,
            PropertyId: item[i].list[j].propertyId,
            OptId: item[i].list[j].OptId,
          };
          // obj[key] = val;
          this.dataList.push(Object.assign({}, ...skuArr, obj, this.alwaysObj)); // 扩展运算符，连接原有的属性,颜色属行,新增的属性
        }
      }
    },
    addOneMoreColumn(var_item) {
      //加一个属性
      let obj = {
        prop: var_item.gPropList[0].tableName,
        propName: var_item.gPropList[0].groupName,
        placeholder: var_item.gPropList[0].groupName,
        selectOption: [],
        selectValue: "",
        isInputed: false,
      };
      let checkArr = [];
      var_item.gPropList.forEach((item) => {
        //遍历所有的checkbox
        item.optList.map((opt) => {
          checkArr.push(opt.propChecked);
        });
      });
      // checkArr.includes(true) 是否有选中的状态
      if (checkArr.includes(true)) {
        //把所有的propname从tableColumnList找出来然后查找是否存在
        let arr = this.tableColumnList.map((item) => {
          return item.propName;
        });
        if (arr.indexOf(var_item.gPropList[0].groupName) === -1) {
          //不存在就加一个属性 加一列
          // console.log(arr.indexOf(var_item.gPropList[0].groupName));
          let newObj = {};
          let key = var_item.gPropList[0].tableName;
          let val = "";
          newObj[key] = val;
          this.tableColumnList.splice(1, 0, obj);
          let newArr = this.dataList.map((obj) => {
            //给datalist的所有都加上一个属性
            return Object.assign({}, obj, newObj);
          });
          this.dataList = newArr;
          // console.log(this.dataList, "aaa");
        }
      } else {
        // 存在的话 删除dataList的该属性 并减少tableColumnList一列
        let newARR = this.dataList.map((item) => {
          delete item[var_item.gPropList[0].tableName];
          return item;
        });
        console.log(newARR, "newARRnewARR");
        this.dataList = newARR;
        // console.log(this.dataList, "newARRnewARRnewARR");
        this.tableColumnList.splice(
          //删除属性列表 中 tableName 一样的值
          this.tableColumnList.findIndex(
            (item) => item.prop === var_item.gPropList[0].tableName
          ),
          1
        );
      }
    },
    resetArrList(arr) {
      //重拍
      let arr1 = this.tableColumnList.filter((item) => item.isInputed);
      let arr2 = this.tableColumnList.filter((item) => !item.isInputed);
      return [...arr2, ...arr1];
    },
    blurInput(name, index) {
      console.log(this.tableColumnList, "this.tableColumnList[0]");
      this.tableColumnList = this.resetArrList(this.tableColumnList);
      if (name === "") {
        return false;
      }
      //失去焦点时判断
      if (
        this.dataList.findIndex(
          (item) => item.colorClassify.OptName === name
        ) === -1
      ) {
        //不存在改颜色
        if (this.tableColumnList[0].prop === "colorClassify") {
          this.updateDataList(); //更新datalist
        } else {
          //判断第一个是否为颜色分类
          let obj = {
            prop: "colorClassify",
            propName: "颜色分类",
            isInputed: false,
            placeholder: "颜色分类",
            selectValue: "",
            selectOption: [],
          };
          this.tableColumnList.unshift(obj);
          this.updateDataList(); //更新datalist
          // this.dataList.push(newOBJ);
          // console.log(this.dataList, "this.dataList");
        }
        //此处给颜色oplist添加数据
        this.tableColumnList[0].selectOption[index] = name;
        let a = this.tableColumnList[0].selectOption;
        this.tableColumnList[0].selectOption = [...new Set(a)];
      } else {
        // this.submitObj.busGoodsColorList.pop();
        // this.$message.error("已存在改颜色,或者颜色值!! 请重新输入");
        return false;
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //第一列相同分类的合并
      if (columnIndex === 0) {
        const _row = this.flitterData(this.dataList).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    changeSelection() {
      //打开选择时强制刷新
      this.$forceUpdate();
    },

    flitterData(arr) {
      //处理第一行相同的
      let spanOneArr = [],
        concatOne = 0;
      arr.forEach((item, index) => {
        // console.log(index, item, "aaa");
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          // console.log(item.id);
          if (item.colorClassify === arr[index - 1].colorClassify) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
      };
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    addColorClassify() {
      //添加颜色分类
      this.submitObj.busGoodsColorList.push({
        colorName: "", //颜色名称
        rmk: "", //颜色备注
        imgStr: "", //颜色后面的那张图片路径
      });
      //此处需要获取到当前的对象的属性 并往数组加入一个颜色属性
    },
    deleteProp(item, index) {
      // console.log(this.tableColumnList, "this.tableColumnList");
      this.$confirm("此操作将删除该属性并失去表格数据,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.submitObj.busGoodsColorList, "this.tableColumnList");
          //删除属性列表 中 tableName 一样的值
          if (this.submitObj.busGoodsColorList.length == 1) {
            this.$message({
              type: "warning",
              message: "至少存在一个属性!",
            });
            return false;
          }
          this.submitObj.busGoodsColorList.splice(index, 1);
          this.tableColumnList[0].selectOption.splice(index, 1);
          this.updateDataList(); //更新dataList的表格数据
        })
        .catch(() => {});
    },
    deleteImg(item, index) {
      this.$confirm("此操作将删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.submitObj.busGoodsColorList);
          this.submitObj.busGoodsColorList[index].imgStr = "";
          this.submitObj.busGoodsColorList[index].ImgId = 0;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteItem(item, index) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.submitObj.busGoodsColorList);
          this.submitObj.busGoodsColorList[index];
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    AddSizeClass(optInput, var_item) {
      let optNames = var_item.gPropList[var_item.raIndex].optList.map(
        (item) => {
          return item.optName;
        }
      );
      if (!optInput) {
        console.log("空值");
        return false;
      }
      if (optNames.indexOf(optInput) !== -1) {
        console.log("重复的");
        this.$message({
          type: "warning",
          message: "已存在该选项",
        });
        return false;
      }
      let newProp = {
        propId: var_item.propertyId,
        optName: optInput,
      };
      this.submitObj.newPropList.push(newProp);
      console.log(optInput, var_item, var_item.gPropList, "var_item");
      let newItem = {
        id: 0,
        sortIndex: 0,
        optName: optInput,
        propChecked: true,
        propertyId: var_item.propertyId, //商品属性ID,
        OptId: 0, //商品属性选项新增为0
      };
      var_item.gPropList[var_item.raIndex].optList.push(newItem);
      this.handleCheckItem(newItem, var_item); //手动触发点击
      console.log(this.variableProperty);
      //添加自定义
    },
    onEditorReady() {
      //开始
    },
    onEditorDestroy() {
      //销毁
    },
    onEditorUploadComplete() {
      //完成
    },
    onEditorUploadFail() {
      //上传文件
    },
    getListInfor() {
      let titleInfor = this.$route.query;
      this.submitObj.categoryId = JSON.parse(titleInfor.thirdTitle).id; //传第三级的id
      console.log(
        JSON.parse(titleInfor.thirdTitle),
        "JSON.parse(this.$route.query)"
      );
      this.message = {
        firstTitle: JSON.parse(titleInfor.firstTitle),
        secondTitle: JSON.parse(titleInfor.secondTitle),
        thirdTitle: JSON.parse(titleInfor.thirdTitle),
      };
      let data = {
        // cateId:titleInfor.thirdTitle.id
        // cateId: 30
        id: 0, //商品id  0为添加商品
        propertyId: this.submitObj.categoryId, //属性id
        // propertyId: 83 //属性id
      };
      GetProperListAPI(data, "get").then((res) => {
        if (res.code == 101) {
          this.CODE = 101;
        }
        if (res.data.deliveryTmpsList.length == 0) {
          this.$confirm("请先添加运费模板,否则无法添加商品?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push({ name: "ExpressTemset" });
            })
            .catch(() => {
              this.$router.push({ name: "release" });
            });
        }

        this.deliveryTmpsList = res.data.deliveryTmpsList; //运费模板
        console.log(res.data.deliveryTmpsList, "queryqueryqueryquery");

        this.variableProperty = res.data.goodsPropModelsList.map((item) => {
          return {
            raIndex: item.raIndex,
            propertyId: item.propertyId,
            groupName: item.groupName,
            isGroupName: item.isGroupName,
            optInput: item.optInput,
            fid: item.fid == 0 ? item.gPropList[0].id : item.fid,
            gPropList: item.gPropList,
          };
        }); //所有的
        this.checkOption = res.data.serverTypeList; //取前三个最后一个必选
        this.options = res.data.goodsShopCategoryList; //店铺中的分类
        // console.log(res.data.goodsPropModelsList, "///分类数据");
      });
    },
    getDataListFromback(list) {
      //根据后台的数据转回到datalist
      let FinalArryA = list.map((item) => {
        // console.log(item, "listlistlist");
        return {
          iD: item.iD,
          price: item.price,
          stockQty: item.stockQty,
          shopCode: item.shopCode,
          barCode: item.barCode,
          OptList: item.optList
            ? item.optList.map((item) => {
                let obj = {};
                obj[item.tableName] = {
                  propertyId: item.propertyId,
                  optId: item.optId,
                  OptName: item.optName,
                };
                return obj;
              })
            : [],
        };
      });
      let FinalArryB = FinalArryA.map((item) => {
        // console.log(item);
        let ArrayB = {};
        ArrayB.iD = String(item.iD);
        ArrayB.price = String(item.price);
        ArrayB.stockQty = String(item.stockQty);
        ArrayB.barCode = String(item.barCode);
        ArrayB.shopCode = item.shopCode;
        return Object.assign({}, ArrayB, ...item.OptList);
      });
      return FinalArryB;
    },
    getColumnsFromBack(backInfor) {
      let newTableColumn = backInfor.propTableList.map((item) => {
        // console.log(item);
        return Object.assign({}, item, {
          placeholder: item.propName,
          selectOption: [],
          selectValue: "",
          isInputed: false,
        });
      });
      let arr2 = this.tableColumnList;
      this.tableColumnList = [...newTableColumn, ...arr2];
      //获取所有选中的checkbox
      let colorClassifyOptions = backInfor.busGoodsColorList.map((item) => {
        return item.colorName;
      });
      this.tableColumnList.map((item) => {
        //单独处理颜色分类
        if (item.prop === "colorClassify") {
          return item.selectOption.push(...colorClassifyOptions);
        } else {
          return item;
        }
      });
      //处理其他的的selectOption
      let checkArr = [];
      backInfor.goodsPropModelsList.forEach((item) => {
        item.gPropList.forEach((k) => {
          let obj = {
            tableName: k.tableName,
            list: [],
          };
          // console.log(k.tableName);
          k.optList.map((opt) => {
            if (opt.propChecked) {
              obj.list.push(opt.optName);
            }
          });
          checkArr.push(obj);
        });
      });
      let aaa = checkArr.map((item) => {
        let obj = {};
        obj[item.tableName] = item.list;
        return obj;
        console.log(obj);
      });
      this.tableColumnList.forEach((item) => {
        this.resetArr(aaa).forEach((arr) => {
          // console.log(item.prop, arr.tableName, "item.propitem.prop");
          if (item.prop === arr.tableName) {
            item.selectOption = [...new Set(arr.list)]; //去重
          }
        });
      });
    },
    resetArr(list) {
      console.log(list);
      //待优化  数组去掉重复的key值 并把改key所有下面的list 合并
      let c = [];
      let keys = [];
      list.forEach((item) => {
        for (let key in item) {
          keys.push(key);
        }
      });
      let keyNum = keys.reduce((allNames, name) => {
        if (name in allNames) {
          allNames[name]++;
        } else {
          allNames[name] = 1;
        }
        return allNames;
      }, {});
      //  console.log('keys', keys)
      // console.log('keyNum', keyNum)
      for (let i in keyNum) {
        // console.log("keyNum-i", i);
        let b = {};
        list.forEach((item) => {
          if (item[i]) {
            if (i in b) {
              b[i].push(...item[i]);
            } else {
              b[i] = item[i];
            }
            // console.log(item[i]);
          }
        });
        c.push(b);
      }
      // console.log("c", c);
      let d = [];
      c.forEach((item) => {
        let obj = {};
        obj.tableName = Object.keys(item)[0];
        obj.list = item[Object.keys(item)[0]];
        d.push(obj);
      });
      return d;
    },

    getEditInfor(id) {
      let data = {
        id: id, //商品id  0为添加商品
      };
      GetProperListAPI(data, "get").then((res) => {
        // console.log(res.data);
        if (res.code == 101) {
          this.CODE = 101;
        }
        if (!res.data.isRecommend) {
          this.SwitchChecked.remove("推荐本商品");
        }
        if (!res.data.isNew) {
          this.SwitchChecked.remove("上市新品");
        }
        this.submitObj = res.data;
        this.ritchText = res.data.details;

        let imgIds = res.data.imgList.split(","); //商品图片ids
        let urls = res.data.imgListStr.split(","); //商品图片 url
        this.IMGLISt = this.IMGLISt.map((item, index) => {
          console.log(urls[index], "urls[index]");
          if (urls[index] !== undefined) {
            return {
              imgId: imgIds[index],
              imgUrl: urls[index],
            };
          } else {
            return {
              imgId: 0,
              imgUrl: "",
            };
          }
        });
        this.deliveryTmpsList = res.data.deliveryTmpsList; //运费模板
        this.variableProperty = res.data.goodsPropModelsList.map((item) => {
          return {
            raIndex: item.raIndex,
            propertyId: item.propertyId,
            groupName: item.groupName,
            isGroupName: item.isGroupName,
            optInput: item.optInput,
            fid: item.fid == 0 ? item.gPropList[0].id : item.fid,
            gPropList: item.gPropList,
          };
        }); //所有的

        this.dataList = this.getDataListFromback(res.data.skuGoodsList);
        console.log(this.dataList, "this.dataListthis.dataList");
        this.checkOption = res.data.serverTypeList; //取前三个最后一个必选
        //处理已选中的数据
        let arr = [];
        let idArr = [];
        this.checkOption.forEach((item) => {
          // console.log(item, "serverTypeList");
          res.data.serviceType.split(",").forEach((k) => {
            // console.log(k, "aaa");
            if (k == item.dictValue) {
              arr.push(item.dictName);
              idArr.push(item.dictValue);
            }
          });
        });
        this.checkList = arr;
        this.checkIdList = idArr;
        //处理售后服务：已选中的数据
        this.options = res.data.goodsShopCategoryList; //店铺中的分类
        this.message = {
          firstTitle: {
            id: res.data.categoryList[0].id,
            categoryName: res.data.categoryList[0].categoryName,
            categoryLevel: res.data.categoryList[0].categoryLevel,
          },
          secondTitle: {
            id: res.data.categoryList[1].id,
            categoryName: res.data.categoryList[1].categoryName,
            categoryLevel: res.data.categoryList[1].categoryLevel,
          },
          thirdTitle: {
            id: res.data.categoryList[2].id,
            categoryName: res.data.categoryList[2].categoryName,
            categoryLevel: res.data.categoryList[2].categoryLevel,
          },
        };
        this.getColumnsFromBack(res.data); //获取每一列的数据 并把选中的选项
      });
    },
  },
  created() {
    console.log(
      this.$route.query.id,
      "当这个id为undefined时 就不是发布新的商品 而是编辑商品"
    );
    if (this.$route.query.id) {
      this.isAddStatus = false;
      this.submitObj.ID = this.$route.query.id;
      this.getEditInfor(this.$route.query.id);
    } else {
      this.isAddStatus = true;
      this.getListInfor();
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // ...
  //   this.$confirm("此操作将删除该属性并失去表格数据,是否继续?", "提示", {
  //     confirmButtonText: "确定",
  //     cancelButtonText: "取消",
  //     type: "warning",
  //   });
  // },
};
</script>
<style lang="scss" scoped>
.titleInput {
  /deep/ .el-input__inner {
    padding-right: 60px;
  }
}
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
  // padding-right: 60px;
}
.normal {
  /deep/ .el-breadcrumb {
    margin-bottom: 8px;
    height: 26px;
    line-height: 26px;
    padding-left: 24px;
  }
}
.w307 {
  width: 307px;
}
/deep/.el-form-item__label {
  text-align: left;
  width: 110px;
}
.goodTitle {
  .el-input {
    width: 620px;
  }
}
.closeImg {
  right: -6px;
  top: -6px;
}
.upLoadImg {
  height: 88px;
  width: 88px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pictureSpace {
  /deep/ .el-dialog {
    width: 50vw !important;
  }
}

/deep/ .el-input {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}

.prePhone {
  top: 40%;
  right: 50px;
}

/deep/.el-form-item {
  margin-bottom: unset;
}
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.footer {
  height: 58px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border-top: 2px solid rgba(13, 105, 197, 1);
  width: 100%;
  background-color: #ffffff;
}
.submitBtn {
  width: 158px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: rgba(13, 105, 197, 0.04);
  border-radius: 4px;
  border: 1px solid rgba(13, 105, 197, 1);
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(13, 105, 197, 1);
}

.BTN {
  line-height: 32px;
  text-align: center;
  width: 120px;
  height: 32px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px;
  border: 1px solid rgba(177, 182, 195, 1);
}
.section {
  box-shadow: 4px 4px 9px 1px rgba(221, 221, 221, 0.5);
  border-radius: 4px;
  background-color: #ffffff;
  padding: 0px 0px 24px 21px;
  margin-top: 20px;
}
.saleHeader {
  border-bottom: 1px solid #f5f5f5;
  height: 57px;
  line-height: 57px;
}
.tips {
  margin-right: 328px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(228, 109, 12, 1);
}
.current {
  .el-form {
    margin-top: 20px;
  }
  .el-breadcrumb {
    width: fit-content;
    padding: 4px;
  }
  .span_btn {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(13, 105, 197, 1);
    height: 30px;
    margin-left: 14px;
    line-height: 30px;
    text-align: center;
    width: 78px;
    background: rgba(13, 105, 197, 0.04);
    border-radius: 4px;
    border: 1px solid rgba(13, 105, 197, 1);
  }
}
.saleInfor {
  margin-top: 16px;
  background-color: #ffffff;
  box-shadow: 4px 4px 9px 1px rgba(221, 221, 221, 0.5);
  border-radius: 4px;
  /deep/ .el-form-item__content {
    margin-right: 90px;
  }
  .checkboxGroup {
    box-sizing: border-box;
    width: 790px;
    padding: 16px;
    margin-top: 15px;
    background-color: #f9f9f9;
    .checkbox_item {
      min-width: 178px;
    }
    .el-checkbox {
      line-height: 40px;
    }
    /deep/.el-input__inner {
      height: 28px;
    }
  }

  .btnADD {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
    text-align: center;
    width: 104px;
    height: 30px;
    background: rgba(13, 105, 197, 1);
    border-radius: 4px;
    border: 1px solid rgba(13, 105, 197, 1);
  }
  .el-form {
    padding: 22px 0 24px 20px;
  }
  .el-form-item__content {
    display: flex;
    align-items: center;
  }
  .colorAddImg {
    height: 32px;
    width: 32px;
    border-radius: 2px;
  }
  .addIMG {
    display: inline-block;
    margin-left: 8px;
    width: 88px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: rgba(249, 249, 249, 1);
    border-radius: 2px;
    border: 1px solid rgba(177, 182, 195, 1);
  }
}

//ImgFontDec
.ImgFontDec {
  .labelName {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(33, 33, 33, 1);
  }
  .labelTips {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(228, 109, 12, 1);
  }
}
</style>