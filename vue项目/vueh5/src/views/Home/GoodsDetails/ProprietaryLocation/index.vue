<template>
  <div class="ProprietaryLocation">
    <div class="title">
      <!-- zoom：放缩程度 , 
    	plugin：data中有定义，是一些插件，如工具栏等等，
    	center：定位经纬度位置
    	el-amap：高德地图组件
     -->
      <el-amap vid="amap" :plugin="plugin" :center="center" :zoom="zoom">
        <el-amap-marker vid="marker" :position="center" :label="label">
        </el-amap-marker>
      </el-amap>
    </div>
    <div class="content">
      <div class="content_box">
        <div class="top">
          <input
            type="text"
            placeholder="搜索地址"
            v-model="Searchvalue"
            @input="debounceInput()"
          />
          <!-- @change="getCity()" -->

          <button
            :class="qractive ? 'buttonactive' : ''"
            @click="qractive && qr()"
          >
            确定
          </button>
        </div>
        <div class="bottom">
          <div
            class="item"
            v-for="(item, index) in nearAddList"
            :key="index"
            @click="SelectAdd(index, item)"
          >
            <div class="left">
              <p class="p1">{{ item.name }}</p>
              <p class="p2">
                {{ item.Distance ? item.Distance : item.distance + "m内" }}｜{{
                  item.address
                }}
              </p>
            </div>
            <div class="right" :class="{ active: activeName == index }">
              <span>√</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { aroundAPIText, aroundAPIAround } from "@/api/other";
import { debounce, throttle } from "@/common/js/debounceAndThrottle.js";
import Vue from "vue";
import axios from "axios";
import $ from "jquery";
import { CalculationOfDistanceAPI } from "@/api/Proprietary";

export default {
  name: "ProprietaryLocation",
  data() {
    const self = this;
    return {
      arr: [],
      CurrentCity: {}, //当前地址
      nearAddList: [], //附近门店地址
      center: [0, 0], //中心点坐标
      lng: 0, //经度
      lat: 0,
      zoom: 16, //放大倍数
      loaded: false,
      label: {
        //中心的描述文字
        content: "",
        offset: [0, 0],
      },
      //其他组件
      plugin: [
        {
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 1000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: false, //显示定位按钮，默认：true
          buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          // zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: "all",
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log(result, "result");
                if (result && result.position) {
                  self.lng = result.position.lng; //设置经度
                  self.lat = result.position.lat; //设置维度
                  self.center = [self.lng, self.lat]; //设置坐标
                  self.loaded = true; //load
                  self.label = {
                    content: result.formattedAddress,
                    offset: [20, 15],
                  };
                  self.CurrentCity = result.addressComponent;

                  self.nearAddList = result.pois.map((item) => {
                    return {
                      pname: result.addressComponent.province,
                      cityname: result.addressComponent.city,
                      adname: result.addressComponent.district,
                      address: result.addressComponent.township,
                      ...item,
                    };
                  });
                  // console.log(self.nearAddList,"self.nearAddList")
                  self.$nextTick(); //页面渲染好
                  // self.$forceUpdate();
                }
              });
            },
          },
        },
      ],
      activeName: -1, //左边列表定义的高亮值
      qractive: false, //按钮的高亮
      Searchvalue: "",
    };
  },
  components: {},
  methods: {
    debounceInput: debounce(function () {
      this.getCity();
    }, 1000),
    //选择地址
    SelectAdd(index, item) {
      (this.label = {
        //中心的描述文字
        content: item.name,
        offset: [20, 15],
      }),
        this.onClickItem(item);
      this.activeName = index;
      this.qractive = true;

      console.log(item, "sssssssssssssssssssssssss");

      window.localStorage.setItem("location", JSON.stringify(item));
    },
    //确认
    qr() {
      this.$router.go(-1);
      // this.$router.push({
      //   path: "/GoodsDetails/ProprietaryEnter",
      // });
    },
    onClickItem(item) {
      console.log(item, "itemitemitemitemitem");

      if (item.location.lng) {
        this.center = [item.location.lng, item.location.lat]; //设置坐标
      } else {
        //设置坐标
        this.center = [
          item.location.split(",")[0],
          item.location.split(",")[1],
        ];
      }
    },
    //搜索关键字
    getCity() {
      var _this = this;
      console.log(
        _this.Searchvalue,
        _this.center,
        "_this.Searchvalue,_this.center"
      );
      console.log(_this.CurrentCity, "_this.CurrentCity");

      let data = {
        key: "8aa3e3edaca357533eaf479ad192c8fc",
        location: _this.center.join(","),
        keywords: _this.Searchvalue,
        city: _this.CurrentCity.city,
        offset: 20,
        extensions: "all",
        radius: 40000,
      };
      // aroundAPIAround(data).then((res) => {
      //   // let _this = this;
      //   console.log(res, "获取附近的检索");
      //   if (res.info === "OK") {
      //     this.nearAddList = res.pois;
      //   }
      // });
      $.get(
        "https://restapi.amap.com/v3/place/text?",
        {
          key: "8aa3e3edaca357533eaf479ad192c8fc",
          location: _this.center.join(","),
          keywords: _this.Searchvalue,
          // city: _this.CurrentCity.city,
          offset: 20,
          extensions: "all",
          radius: 40000,
        },
        function (data) {
          // _this.nearAddList = data.pois;

          let queue = data.pois.map((item) => {
            let bbb = {
              lng1: _this.center[0],
              lat1: _this.center[1],
              lng2: item.location.split(",")[0],
              lat2: item.location.split(",")[1],
            };
            return new Promise((resolve) => {
             
              CalculationOfDistanceAPI(bbb, "get").then((res) => {
                resolve(res);
              });

            });
          });
          
          Promise.all(queue).then((result) => {
            console.log(result, data.pois, "aa");
            let newArr = data.pois.map((item, index) => {
              return Object.assign(
                {
                  Distance: result[index].worth + result[index].unit,
                },
                item
              );
            });
            _this.nearAddList = newArr;
            console.log(newArr, "newArrnewArrnewArr");
            //TODO
            //执行后续操作
          });

        }
      );
    },
  },
  mounted() {
    document.title = "选择位置";
  },
  watch: {},
};
</script>

<style lang="less">
.ProprietaryLocation {
  width: 100%;
  height: 100%;
  background: @text-white;
  position: relative;
  .title {
    width: 100%;
    height: 60%;
    background: #fff;
    .amap-logo {
      display: none !important;
      //去掉高德地图logo
    }
    .amap-copyright {
      opacity: 0;
    }
  }
  .content {
    width: 100%;
    height: 45%;
    background: #fff;
    position: absolute;
    bottom: 0;
    border-radius: 16px 16px 0px 0px;
    box-shadow: 0px 4px 8px 0px rgba(0, 11, 38, 0.06);
    .content_box {
      //   padding: 0 36px;
      height: 100%;
      position: relative;
      overflow-y: auto;
      .top {
        width: 92%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 160px;
        background: #fff;
        position: fixed;
        left: 4%;
        input {
          width: 556px;
          height: 80px;
          background: #f5f6f7;
          border-radius: 44px;
          outline: none;
          border: none;
          text-indent: 32px;
        }
        button {
          outline: none;
          border: none;
          width: 100px;
          height: 80px;
          background: rgba(177, 182, 196, 0.5);
          border-radius: 40px;
          color: #fff;
        }
        .buttonactive {
          background: linear-gradient(180deg, #f64242 1%, #e73a3a);
        }
      }
      .bottom {
        width: 92%;
        margin: auto;
        height: 100%;
        padding-top: 160px;
        .item {
          width: 100%;
          height: 120px;
          display: flex;
          align-items: center;
          .left {
            flex: 1;
            .p1 {
              font-size: 32px;
              color: #000b26;
            }
            .p2 {
              padding-top: 12px;
              font-size: 28px;
              color: #b1b6c4;
            }
          }
          .right {
            color: #fff;
          }
          .active {
            color: red;
          }
        }
      }
    }
  }
}
</style>