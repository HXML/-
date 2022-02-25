<template>
  <div>
    <section v-for="(reg, index) in addressData" :key="index">
      <div class="flex mt-40 mb-40">
        <el-checkbox
          class="mr-40"
          @change="handleCheckAllChange($event, index)"
          >{{ reg.name }}</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <div class="flex fw">
            <el-checkbox
              class="mt-4 mb-4"
              v-for="city in reg.sonArr"
              :label="city"
              :key="city.code"
              >{{ city.name }}</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </div>
    </section>
    <el-button @click="diaLogConfirm">确认选择</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
      checkAll: false,
      checkedCities: [],
    };
  },
  methods: {
    diaLogConfirm() {
      this.$emit("confirmsg", this.checkedCities);
    },
    handleCheckAllChange(val, index) {
      console.log(val, index, "val");
      if (val) {
        //   this.isIndeterminate = false;
        let arr = [...this.addressData[index].sonArr];
        console.log(arr, "arr");
        this.checkedCities.push(...arr);
        console.log([...new Set(this.checkedCities)], "this.checkedCities");
      } else {
        var arr = this.checkedCities; //总数组
        var brr = this.addressData[index].sonArr; //要被删除的数组
        for (var i = 0; i < brr.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j] == brr[i]) {
              arr.splice(j, 1);
              j--;
            }
          }
        }
      }
    },
    handleCheckedCitiesChange(value) {
      console.log(value, "value");
    },
  },
};
</script>