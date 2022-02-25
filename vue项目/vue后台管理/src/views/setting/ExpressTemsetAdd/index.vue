<template>
  <errorPage v-if="CODE === 101" />
  <div class="onSale br-8" v-else>
    <el-form class="fw">
      <div class="header">
        <span class="sell_person">新增快递模板</span>
      </div>
      <el-form-item label="运费模板名称：" label-width="120px" prop="name">
        <el-input
          placeholder="请输入"
          v-model="pageData.tmpName"
          style="width: 288px; margin-right: 20px"
        ></el-input>
      </el-form-item>
      <el-form-item label="所在地区：" label-width="120px" prop="name">
        <el-select
          v-model="pageData.provinceNo"
          placeholder="请选择"
          style="width: 188px; margin-right: 20px"
        >
          <el-option
            v-for="(i, index) in province"
            :key="index"
            @click.native="selectclick(i.id, i.deep, i.areaName)"
            v-bind:label="i.areaName"
            :value="i.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="pageData.cityNo"
          placeholder="请选择"
          style="width: 188px; margin-right: 20px"
        >
          <el-option
            v-for="(i, index) in city"
            :key="index"
            @click.native="selectclick(i.id, i.deep, i.areaName)"
            v-bind:label="i.areaName"
            :value="i.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="pageData.countyNo"
          placeholder="请选择"
          style="width: 188px; margin-right: 20px"
        >
          <el-option
            v-for="(i, index) in county"
            :key="index"
            @click.native="selectclick(i.id, i.deep, i.areaName)"
            v-bind:label="i.areaName"
            :value="i.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否包邮：" label-width="120px" prop="name">
        <el-radio-group v-model="pageData.isFreeShipping">
          <el-radio :label="0">自定义运费</el-radio>
          <el-radio :label="1">卖家承担运费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计价方式：" label-width="120px" prop="name">
        <el-radio-group v-model="pageData.calcCostType">
          <el-radio
            :label="1"
            @click.native="(until = '件'), (untilfont = '件')"
            >按件数</el-radio
          >
          <el-radio
            :label="2"
            @click.native="(until = 'KG'), (untilfont = '重')"
            >按重量</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="运送方式：" label-width="120px" prop="name">
        <el-radio-group v-model="pageData.transportType">
          <el-radio :label="1">快递</el-radio>
        </el-radio-group>
        <div class="comment_content" v-if="pageData.isFreeShipping == 0">
          <div class="comment_content_box">
            <div class="bottom">
              <div class="Item" style="margin-bottom: 1vw">
                <div class="Item_nav flex aic">
                  <div class="ml-10">
                    默认运费：
                    <el-input
                      placeholder
                      type="number"
                      v-if="pageData.calcCostType == 1"
                      v-model.number="tmpdefault.firstUnit"
                      style="width: 68px"
                    ></el-input>
                    <el-input
                      placeholder
                      v-else
                      type="number"
                      v-model.number="tmpdefault.firstWeight"
                      style="width: 68px"
                    ></el-input>
                  </div>
                  <div class="ml-10">
                    {{ until }}内
                    <el-input
                      placeholder
                      v-if="pageData.calcCostType == 1"
                      v-model.number="tmpdefault.firstPrice"
                      style="width: 68px"
                      type="number"
                    ></el-input>
                    <el-input
                      placeholder
                      v-else
                      type="number"
                      v-model.number="tmpdefault.firstWeightPrice"
                      style="width: 68px"
                    ></el-input>
                  </div>
                  <div class="ml-10">
                    元，每增加
                    <el-input
                      placeholder
                      type="number"
                      v-if="pageData.calcCostType == 1"
                      v-model.number="tmpdefault.coniUnit"
                      style="width: 68px"
                    ></el-input>
                    <el-input
                      placeholder
                      v-else
                      v-model.number="tmpdefault.coniWeight"
                      type="number"
                      style="width: 68px"
                    ></el-input>
                  </div>
                  <div class="ml-10">
                    {{ until }}，增加运费
                    <el-input
                      placeholder
                      type="number"
                      v-if="pageData.calcCostType == 1"
                      v-model.number="tmpdefault.coniPrice"
                      style="width: 68px"
                    ></el-input>
                    <el-input
                      placeholder
                      v-else
                      v-model.number="tmpdefault.coniWeightPrice"
                      style="width: 68px"
                    ></el-input
                    >元
                  </div>
                </div>
                <!-- 表格 -->
                <div
                  class="flex jc-sb"
                  style="border-bottom: 1px solid #e8e8e8"
                >
                  <el-table
                    ref="filterTable"
                    :data="pageData.expDelSub"
                    style="width: 100%"
                  >
                    <el-table-column
                      min-width="180px"
                      prop="province"
                      label="运送到"
                    >
                      <template slot-scope="scope">
                        <div class="flex aic">
                          <div class="flex jc-fs ml-8">
                            <div class="ml-8">{{ scope.row.province }}</div>
                            <span
                              class="ml-8 wd_30"
                              style="color: #0d69c5"
                              @click="tempaddressAdd(scope.$index)"
                            >
                              <i class="el-icon-edit"></i>编辑
                            </span>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="'首' + untilfont + '数（' + until + '）'"
                    >
                      <template slot-scope="scope">
                        <div class="flex aic">
                          <el-input
                            placeholder
                            type="number"
                            v-if="pageData.calcCostType == 1"
                            v-model.number="scope.row.firstUnit"
                            style="width: 68px"
                          ></el-input>

                          <el-input
                            v-else
                            placeholder
                            type="number"
                            v-model.number="scope.row.firstWeight"
                            style="width: 68px"
                          ></el-input>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column label="首费（元）">
                      <template slot-scope="scope">
                        <div class="flex aic">
                          <el-input
                            type="number"
                            placeholder
                            v-if="pageData.calcCostType == 1"
                            v-model.number="scope.row.firstPrice"
                            style="width: 68px"
                          ></el-input>

                          <el-input
                            v-else
                            placeholder
                            type="number"
                            v-model.number="scope.row.firstWeightPrice"
                            style="width: 68px"
                          ></el-input>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      :label="'续' + untilfont + '数（' + until + '）'"
                    >
                      <template slot-scope="scope">
                        <div class="flex aic">
                          <el-input
                            type="number"
                            placeholder
                            v-if="pageData.calcCostType == 1"
                            v-model.number="scope.row.coniUnit"
                            style="width: 68px"
                          ></el-input>

                          <el-input
                            v-else
                            type="number"
                            placeholder
                            v-model.number="scope.row.coniWeight"
                            style="width: 68px"
                          ></el-input>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column label="续费（元）">
                      <template slot-scope="scope">
                        <div class="flex aic">
                          <el-input
                            placeholder
                            type="number"
                            v-if="pageData.calcCostType == 1"
                            v-model.number="scope.row.coniPrice"
                            style="width: 68px"
                          ></el-input>

                          <el-input
                            v-else
                            placeholder
                            v-model.number="scope.row.coniWeightPrice"
                            type="number"
                            style="width: 68px"
                          ></el-input>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="100">
                      <template slot-scope="scope">
                        <div class="flex2 operation">
                          <span
                            @click="deltemps(scope.$index)"
                            type="text"
                            size="small"
                            >删除</span
                          >
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="header">
                  <span class="ml-8" style="color: #0d69c5" @click="Addtemps">
                    <i class="el-icon-edit"></i>为指定地区城市设置运费
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <!-- 退货列表 -->
      <el-divider></el-divider>
      <div class="header">
        <span class="sell_person">退货地址</span>
        <span class="ml-8 pointer" style="color: #0d69c5" @click="addressadd">
          <i class="el-icon-edit"></i>
          <span>添加退货地址</span>
        </span>
      </div>
      <el-table ref="filterTable" :data="tableData" style="width: 100%">
        <el-table-column min-width="80px" prop="goodsName" label="退货地址">
          <template slot-scope="scope">
            <div class="flex aic">
              <el-radio-group v-model="pageData.returnAddressId">
                <el-radio :label="scope.row.id">选择默认</el-radio>
              </el-radio-group>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="linkMan" label="联系人">
          <template slot-scope="scope">
            <div class="flex aic">{{ scope.row.linkMan }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所在地区">
          <template slot-scope="scope">
            <!-- <span>{{scope.row.number}}</span>
            <i class="ml-8 el-icon-edit"></i>-->
            <div class="flex aic">
              {{ scope.row.provinc }}{{ scope.row.city }}{{ scope.row.county }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnAddress"
          label="街道地址"
        ></el-table-column>
        <el-table-column prop="linkTel" label="联系电话"></el-table-column>
        <el-table-column prop="linkMobil" label="联系手机"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div class="flex2 operation">
              <span @click="addressEdit(scope.row.id)" type="text" size="small"
                >编辑</span
              >
              <span @click="deladrClick(scope.row.id)" type="text" size="small"
                >删除</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="btn">
        <el-button @click="qxclick">取 消</el-button>
        <el-button @click="ExpAdd" type="primary">确 定</el-button>
      </div>

      <!-- 退货添加 -->
      <el-dialog :title="formTtitle" :visible.sync="returnaddress">
        <el-form-item label="联系人：" label-width="120px" prop="name">
          <el-input
            placeholder="请输入"
            v-model="retdate.linkMan"
            style="width: 288px; margin-right: 20px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" label-width="120px" prop="name">
          <el-select
            v-model="retdate.provinceNo"
            placeholder="请选择"
            style="width: 188px; margin-right: 20px"
          >
            <el-option
              v-for="(i, index) in province"
              :key="index"
              @click.native="retselectclick(i.id, i.deep, i.areaName)"
              v-bind:label="i.areaName"
              :value="i.id"
            ></el-option>
          </el-select>

          <el-select
            v-model="retdate.cityNo"
            placeholder="请选择"
            style="width: 188px; margin-right: 20px"
          >
            <el-option
              v-for="(i, index) in retcity"
              :key="index"
              @click.native="retselectclick(i.id, i.deep, i.areaName)"
              v-bind:label="i.areaName"
              :value="i.id"
            ></el-option>
          </el-select>

          <el-select
            v-model="retdate.countyNo"
            placeholder="请选择"
            style="width: 188px; margin-right: 20px"
          >
            <el-option
              v-for="(i, index) in retcounty"
              :key="index"
              v-bind:label="i.areaName"
              :value="i.id"
              @click.native="retselectclick(i.id, i.deep, i.areaName)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址:" label-width="120px" prop="name">
          <el-input
            placeholder="请输入"
            v-model="retdate.returnAddress"
            style="width: 288px; margin-right: 20px"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话：" label-width="120px" prop="name">
          <el-input
            placeholder="请输入"
            v-model="telq"
            style="width: 88px; margin-right: 10px"
          ></el-input>
          <span>-</span>
          <el-input
            placeholder="请输入"
            v-model="telh"
            style="width: 188px; margin-right: 20px; margin-left: 10px"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系手机：" label-width="120px" prop="name">
          <el-input
            placeholder="请输入"
            v-model="retdate.linkMobil"
            style="width: 288px; margin-right: 20px"
          ></el-input>
        </el-form-item>
        <el-form-item label="退款说明：" label-width="120px" prop="name">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="retdate.returnRmk"
          ></el-input>
        </el-form-item>

        <div slot="footer" class="dialog-footer">
          <el-button @click="returnaddress = false">取 消</el-button>
          <el-button type="primary" @click="returnAddressAdd()"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <!-- 快递地址 -->
      <el-dialog :title="addrformTtitle" :visible.sync="tempaddress">
        <div
          class="flex jc-fs mt_30"
          v-for="(item, index) in addressData"
          :key="index"
        >
          <div class="mt-8">
            <el-checkbox
              :class="
                item.index >= 0 && item.index != listIndex ? 'pnontevent' : ''
              "
              :disabled="
                item.index >= 0 && item.index != listIndex ? true : false
              "
              v-model="item.check"
              @click.native="handleAllChecked(item.name, $event)"
              >{{ item.name }}</el-checkbox
            >
          </div>
          <div class="w_800 flex fw ml_80">
            <el-checkbox
              :class="
                items.index >= 0 && items.index != listIndex
                  ? 'w_200 mt-8 pnontevent'
                  : 'w_200 mt-8 '
              "
              v-for="(items, index) in item.sonArr"
              :key="index"
              v-model="items.check"
              @click.native="handleoneChecked(items.name, $event)"
              :disabled="
                items.index >= 0 && items.index != listIndex ? true : false
              "
              >{{ items.name }}</el-checkbox
            >
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="tempaddress = false">取 消</el-button>
          <el-button @click="handleDialogComfirm" type="primary"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  areaAPI,
  SRAAddAPI,
  SRAListAPI,
  ExpAddAPI,
  ExpEditModelAPI,
  ExpUpdateAPI,
  SRADeleteAPI,
  SRAModelAPI,
  SRAEditAPI,
} from "@/api/settingAPI";
import qs from "qs";
export default {
  data() {
    return {
      CODE: 0,
      pageData: {
        id: 0,
        tmpName: "", //模板名称
        provinceNo: "", //省
        cityNo: "", //市
        countyNo: "", //县
        isFreeShipping: 0, //是否包邮
        transportType: 1, //运送方式
        calcCostType: 1, //计价方式
        expDelSub: [],
        returnAddressId: 0,
      },
      tmpdefault: {
        //默认模板项  表头
        id: 0,
        expTmpId: 0,
        shopId: 0,
        provinceNo: "",
        province: "中国",
        calcCostType: 0,
        isDefault: 1,
        firstUnit: 1,
        firstPrice: 1,
        coniUnit: 1,
        coniPrice: 1,
        firstWeight: 1,
        firstWeightPrice: 1,
        coniWeight: 1,
        coniWeightPrice: 1,
      },
      addressData: [
        {
          name: "华东",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "上海",
              code: "31",
              check: false,
              index: -1,
            },
            {
              name: "江苏省",
              code: "32",
              check: false,
              index: -1,
            },
            {
              name: "浙江省",
              code: "33",
              check: false,
              index: -1,
            },
            {
              name: "安徽省",
              code: "34",
              check: false,
              index: -1,
            },
            {
              name: "江西省",
              code: "36",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "华北",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "北京",
              code: "11",
              check: false,
              index: -1,
            },
            {
              name: "天津",
              code: "12",
              check: false,
              index: -1,
            },
            {
              name: "山西省",
              code: "14",
              check: false,
              index: -1,
            },
            {
              name: "山东省",
              code: "37",
              check: false,
              index: -1,
            },
            {
              name: "河北省",
              code: "13",
              check: false,
              index: -1,
            },
            {
              name: "内蒙古自治区",
              code: "15",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "华中",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "湖南省",
              code: "43",
              check: false,
              index: -1,
            },
            {
              name: "湖北省",
              code: "42",
              check: false,
              index: -1,
            },
            {
              name: "河南省",
              code: "41",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "华南",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "广东省",
              code: "44",
              check: false,
              index: -1,
            },
            {
              name: "广西壮族自治区",
              code: "45",
              check: false,
              index: -1,
            },
            {
              name: "福建省",
              code: "35",
              check: false,
              index: -1,
            },
            {
              name: "海南省",
              code: "46",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "西北",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "辽宁省",
              code: "21",
              check: false,
              index: -1,
            },
            {
              name: "吉林省",
              code: "22",
              check: false,
              index: -1,
            },
            {
              name: "黑龙江省",
              code: "23",
              check: false,
              index: -1,
            },
            {
              name: "陕西省",
              code: "61",
              check: false,
              index: -1,
            },
            {
              name: "新疆维吾尔自治区",
              code: "65",
              check: false,
              index: -1,
            },
            {
              name: "甘肃省",
              code: "62",
              check: false,
              index: -1,
            },
            {
              name: "宁夏回族自治区",
              code: "64",
              check: false,
              index: -1,
            },
            {
              name: "青海省",
              code: "63",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "西南",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "重庆",
              code: "50",
              check: false,
              index: -1,
            },
            {
              name: "云南省",
              code: "53",
              check: false,
              index: -1,
            },
            {
              name: "西藏自治区",
              code: "54",
              check: false,
              index: -1,
            },
            {
              name: "四川省",
              code: "51",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "港澳台",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "香港特别行政区",
              code: "81",
              check: false,
              index: -1,
            },
            {
              name: "澳门特别行政区",
              code: "82",
              check: false,
              index: -1,
            },
            {
              name: "台湾",
              code: "71",
              check: false,
              index: -1,
            },
          ],
        },
        {
          name: "海外",
          check: false,
          index: -1,
          sonArr: [
            {
              name: "海外",
              code: "91",
              check: false,
              index: -1,
            },
          ],
        },
      ],
      listIndex: 0, //列表序列
      tableData: [], //退货地址列表
      returnaddress: false, //弹窗
      tempaddress: false, //弹窗
      formTtitle: "添加退货地址",
      addrformTtitle: "选择区域",
      until: "件", //单位,
      untilfont: "件", //单位,
      telq: "", //电话前半段
      telh: "", //电话后半段
      retdate: {
        //退货地址实体
        id: 0,
        shopId: 0,
        provinceNo: "",
        cityNo: "",
        countyNo: "",
        provinc: "",
        city: "",
        county: "",
        linkMan: "",
        linkTel: "",
        linkMobil: "",
        returnRmk: "",
        isDefault: 0,
        sortIndex: 0,
        returnAddress: "",
      },
      province: [], //省
      city: [], //城市
      county: [], //县
      addresspid: 0, //地址父级ID
      addresslever: 0,
      retprovince: [], //省
      retcity: [], //城市
      retcounty: [], //县
      retaddresspid: 0, //地址父级ID
      retaddresslever: 0,
    };
  },

  methods: {
    deladrClick(id) {
      this.$confirm("此操作将删除点击退货地址, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            adrId: id,
          };
          SRADeleteAPI(data, "delete").then((res) => {
            if (res.code != 1) {
              this.$message.error(res.msg);
              return;
            }
            if (res.code == 1) {
              this.$message({
                message: "恭喜你，删除成功!",
                type: "success",
              });
            }
            this.retdateList(); //退回列表
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleoneChecked(name, e) {
      var is = this.listIndex;
      for (let index = 0; index < this.addressData.length; index++) {
        for (let i = 0; i < this.addressData[index].sonArr.length; i++) {
          if (this.addressData[index].sonArr[i].name == name) {
            if (this.addressData[index].sonArr[i].check) {
              this.addressData[index].sonArr[i].index = -1;
            } else {
              this.addressData[index].sonArr[i].index = is;
            }
          }
        }
      }
    },
    handleAllChecked(name, e) {
      //多选
      var is = this.listIndex;
      for (let index = 0; index < this.addressData.length; index++) {
        if (this.addressData[index].name == name) {
          this.addressData[index].index = is; //判断是不是当前行选中
          for (let i = 0; i < this.addressData[index].sonArr.length; i++) {
            if (
              this.addressData[index].sonArr[i].index < 0 ||
              this.addressData[index].sonArr[i].index == is
            ) {
              this.addressData[index].sonArr[i].check = !this.addressData[index]
                .check;
              if (this.addressData[index].sonArr[i].check) {
                this.addressData[index].sonArr[i].index = is;
              } else {
                this.addressData[index].index = -2;
                this.addressData[index].sonArr[i].index = -1;
              }
            }
          }
        }
      }
    },
    addressadd() {
      this.returnaddress = true;
    },
    addressEdit(id) {
      var data = {
        adrId: id,
      };
      SRAModelAPI(data, "get").then((res) => {
        this.retdate = res.data;
        var tel = res.data.linkTel.split("-");
        this.telq = tel[0];
        this.telh = tel[1];

        this.editArea(res.data.provinceNo, 1, 2); //通过省的id查到市

        this.editArea(res.data.cityNo, 2, 2); //通过市的id查到县
      });

      this.returnaddress = true;
    },
    tempaddressAdd(index) {
      this.listIndex = index;
      this.tempaddress = true;
    },
    handleDialogComfirm() {
      this.tempaddress = false;
      var name = new Array();
      var code = new Array();
      //选择地址进行对应字段赋值
      for (let index = 0; index < this.addressData.length; index++) {
        for (let i = 0; i < this.addressData[index].sonArr.length; i++) {
          if (this.addressData[index].sonArr[i].index == this.listIndex) {
            name.push(this.addressData[index].sonArr[i].name);
            code.push(this.addressData[index].sonArr[i].code);
          }
        }
      }

      for (let i = 0; i < this.pageData.expDelSub.length; i++) {
        if (i == this.listIndex) {
          this.pageData.expDelSub[i].province = name.join(",");
          this.pageData.expDelSub[i].provinceNo = code.join(",");
          if (name.length == 0) {
            this.pageData.expDelSub[i].province = "请选择地区";
          }
        }
      }
    },
    Addtemps() {
      //默认模板实体
      var Addtemp = {
        id: 0,
        expTmpId: 0,
        shopId: 0,
        provinceNo: "",
        province: "请选择地区",
        calcCostType: 0,
        isDefault: 0,
        firstUnit: 1,
        firstPrice: 1,
        coniUnit: 1,
        coniPrice: 1,
        firstWeight: 1,
        firstWeightPrice: 1,
        coniWeight: 1,
        coniWeightPrice: 1,
      };

      this.pageData.expDelSub.push(Addtemp); //添加模板
    },
    deltemps(index) {
      this.pageData.expDelSub.splice(index, 1);
    },
    selectclick(pid, lev, name) {
      //模板地址三级联动
      if (lev == 0) {
        this.pageData.province = name;
      }
      if (lev == 1) {
        this.pageData.city = name;
      }
      if (lev == 2) {
        this.pageData.county = name;
        return;
      }

      this.addresspid = pid;
      this.addresslever = lev + 1;
      this.area();
    },
    area() {
      //模板地址查询
      var data = {
        pid: this.addresspid,
      };
      areaAPI(data, "get").then((res) => {
        if (this.addresslever == 0) {
          this.province = res.data;

          this.city = [];
          this.county = [];
        }
        if (this.addresslever == 1) {
          this.city = res.data;
          this.pageData.cityNo = "";
          this.pageData.countyNo = "";
          this.county = [];
        }
        if (this.addresslever == 2) {
          this.pageData.countyNo = "";

          this.county = res.data;
        }
      });
    },
    retselectclick(pid, lev, name) {
      //退货三级联动点击事件
      if (lev == 0) {
        this.retdate.provinc = name;
      }
      if (lev == 1) {
        this.retdate.city = name;
      }
      if (lev == 2) {
        this.retdate.county = name;
        return;
      }
      this.retaddresspid = pid;
      this.retaddresslever = lev + 1;

      this.retarea();
    },
    retarea() {
      //退货添加地址查询
      var data = {
        pid: this.retaddresspid,
      };
      areaAPI(data, "get").then((res) => {
        if (this.retaddresslever == 0) {
          //省
          this.province = res.data;

          this.retcity = [];
          this.retcounty = [];
        }
        if (this.retaddresslever == 1) {
          //市
          this.retcity = res.data;
          this.retdate.cityNo = "";
          this.retdate.countyNo = "";
          this.county = [];
        }
        if (this.retaddresslever == 2) {
          //县
          this.retdate.countyNo = "";

          this.retcounty = res.data;
        }
      });
    },
    returnAddressAdd() {
      this.retdate.linkTel = this.telq + "-" + this.telh;
      var data = qs.stringify(this.retdate);
      if (this.retdate.id == 0) {
        //添加退货列表
        SRAAddAPI(data, "post", true).then((res) => {
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }
          this.$message({
            message: "恭喜你，添加成功!",
            type: "success",
          });
          this.returnaddress = false;
          this.retdateList(); //退回列表
        });
      } else {
        //修改退货列表
        SRAEditAPI(data, "put", true).then((res) => {
          if (res.code != 1) {
            this.$message.error(res.msg);
            return;
          }
          this.$message({
            message: "恭喜你，修改成功!",
            type: "success",
          });
          this.returnaddress = false;
          this.retdateList(); //退回列表
        });
      }
    },
    qxclick() {
      this.$router.go(-1);
    },
    retdateList() {
      //退货地址列表查询
      SRAListAPI("", "get").then((res) => {
        if (res.code != 1) {
          this.$message.error(res.msg);
          return;
        }
        this.tableData = res.data;
        if (res.data.length > 0) {
          this.pageData.returnAddressId = res.data[0].id;
        }
      });
    },
    ExpAdd() {
      var sJson = JSON.stringify(this.pageData);

      var data = JSON.parse(sJson);
      if (this.pageData.isFreeShipping == 1) {
      } else {
        data.expDelSub.push(this.tmpdefault);
      }
      var datas = JSON.stringify(data);

      let ids = this.$route.query.ids;

      if (ids == 0) {
        //添加模板
        ExpAddAPI(datas, "post", 3).then((res) => {
          if (res.code == 1) {
            this.$message({
              message: "恭喜你，添加成功!",
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: res.msg,
              type: "success",
            });
          }

          //this.$router.go(-1);
        });
      } else {
        //修改模板
        ExpUpdateAPI(datas, "put", 3).then((res) => {
          if (res.code == 1) {
            this.$message({
              message: "恭喜你，修改成功!",
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: res.msg,
              type: "success",
            });
          }
        });
      }
    },
    ExpModel() {
      //查询模板实体数据
      var data = {
        expId: this.pageData.id,
      };
      ExpEditModelAPI(data, "get").then((res) => {
        for (let index = 0; index < res.data.expDelSub.length; index++) {
          var sp = res.data.expDelSub[index].provinceNo.split(",");
          for (let v = 0; v < this.addressData.length; v++) {
            for (let i = 0; i < this.addressData[v].sonArr.length; i++) {
              for (let s = 0; s < sp.length; s++) {
                if (this.addressData[v].sonArr[i].code == sp[s]) {
                  this.addressData[v].sonArr[i].check = true;
                  this.addressData[v].sonArr[i].index = index;
                }
              }
            }
          }

          if (res.data.expDelSub[index].isDefault == 1) {
            this.tmpdefault = res.data.expDelSub[index]; //默认项赋值
            res.data.expDelSub.splice(index, 1); //移除默认项
          }
        }

        if (res.data.calcCostType == 2) {
          this.untilfont = "重";
          this.until = "KG";
        }
        this.editArea(res.data.provinceNo, 1); //通过省的id查到市
        this.editArea(res.data.cityNo, 2); //通过市的id查到县
        this.pageData = res.data;
      });
    },
    editArea(pid, lev, type) {
      //type 等于2是修改退货地址   不传就是修改模板

      var data = {
        pid: pid,
      };
      areaAPI(data, "get").then((res) => {
        if (type == 2) {
          if (lev == 1) {
            this.retcity = res.data;
          }
          if (lev == 2) {
            this.retcounty = res.data;
          }
        } else {
          if (lev == 1) {
            this.city = res.data;
          }
          if (lev == 2) {
            this.county = res.data;
          }
        }
      });
    },
  },
  mounted() {
    let ids = this.$route.query.ids; //传过来的ID  添加未0

    if (ids > 0) {
      this.pageData.id = ids;
      this.ExpModel(); //查询模板实体
    }

    this.area(); //地址
    this.retdateList(); //退回列表
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input__icon {
  line-height: 32px;
}
.w_800 {
  width: 800px;
}
.w_200 {
  width: 200px;
}
.pnontevent {
  pointer-events: none;
}
.ml_80 {
  margin-left: 80px;
}
.Cont2 {
  border-top: 1px #e8e8e8 solid;
}
.goodType {
  color: #b1b6c3;
  font-size: 10px;
}
.mt_30 {
  margin-bottom: 30px;
}

.goodTitle {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
}
.mainTableInfor {
  .over_two {
    width: 250px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
}
/deep/.el-table th > .cell {
  height: 36px;
  line-height: 36px;
  width: 190px;
  background-color: #f9f9f9;
}
.div1 {
  display: inline;
}
.sell_person {
  font-weight: bold;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(33, 33, 33, 1);
  line-height: 19px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 30px;
  line-height: 30px;
}
.ml-10 {
  margin-left: 10px;
}
.onSale {
  padding: 24px;
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
  }
  .item_pirce {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(224, 32, 32, 1);
  }
  .item_name {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(33, 33, 33, 1);
  }

  .span_confirm {
    pointer-events: none;
    margin-left: 120px;
    width: 88px;
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(232, 232, 232, 1);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
  }
  .span_confirm_active {
    margin-left: 120px;
    width: 88px;
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(232, 232, 232, 1);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #e46d0c;
  }
  .span_confirm_active2 {
    margin-left: 20px;
    width: 88px;
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    border: 1px solid rgba(232, 232, 232, 1);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #e46d0c;
  }
  .clearCondition {
    pointer-events: none;
    margin-left: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(177, 182, 195, 1);
  }
  .clearCondition_active {
    margin-left: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #e46d0c;
  }

  .operation {
    span {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(13, 105, 197, 1);
    }
    span:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .Heng {
    height: 20px;
    width: 100%;
    background: #e6f0f9;
  }
}
.btn {
  margin-top: 40px;
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 20px, 0px;
  text-align: center;
  margin-bottom: 60px;
}
.comment_content {
  margin-top: 20px;
  .comment_content_box {
    width: 798px;
    .top {
      width: 100%;
      display: flex;
      font-size: 12px;
      color: rgba(33, 33, 33, 1);
      line-height: 16px;
      padding-bottom: 12px;
      .d1 {
        display: flex;
        min-width: 20%;
        text-align: center;
      }
      .d2 {
        display: flex;
        width: 16%;
        text-align: center;
      }
    }
    .bottom {
      width: 100%;
      .Item {
        width: 100%;
        .Item_nav {
          height: 52px;

          width: 100%;
          font-size: 10px;
          color: rgba(74, 80, 96, 1);
          border: 1px solid rgba(238, 238, 238, 1);
          background: rgba(230, 240, 249, 1);
          span {
            padding-left: 20px;
          }
          img {
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }
        }
        .mainInfor {
          width: 70%;
          .d1 {
            width: 80%;
            text-align: center;
          }
          .d2 {
            width: 20%;
          }
          .d3 {
            width: 20%;
          }
          .d4 {
            width: 20%;
          }
        }
      }
    }
  }
}
.wd_30 {
  width: 150px;
}
.el-icon-edit {
  cursor: pointer;
}
</style>