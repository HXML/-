<template>
  <div class="ProprietarySelect">
    <div class="ProprietarySelect_box">
      <div class="title" @click="jumpProprietaryLocation()">
        <div class="left">
          <img src="@/assets/images/1.6_img/ziying_mendian_icon1.png" alt="" />
          <span>{{ DetailedAddress }}</span>
        </div>
        <div class="right">
          <img src="" alt="" />
          <span>重新定位</span>
        </div>
      </div>
      <div class="content">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div
            class="item"
            v-for="(item, index) in StoreDataList"
            :key="index"
            @click="SelectList(item.id)"
          >
            <div class="left">
              <div class="leftdiv1">
                <div class="d1">
                  <img
                    v-if="item.imgList[0]"
                    :src="item.imgList[0] + '?x-oss-process=style/b1'"
                    alt=""
                  />
                  <img v-else src="@/assets/images/logo.png" alt="" />
                </div>
                <div class="d2">
                  <!-- <img
                    :src="itemA + '?x-oss-process=style/b1'"
                    alt=""
                    v-for="(itemA, indexTow) in item.imgList"
                    :key="indexTow"
                  /> -->
                  <div class="d2_yy" v-for="(itemA, indexTow) in item.imgList"
                      :key="indexTow">
                    <img
                      :src="itemA + '?x-oss-process=style/b1'"
                      alt=""
                    />
                    <p>

                    </p>
                  </div>
                </div>
              </div>
              <div class="leftdiv2">
                <div class="d1">{{ item.ppName }}</div>
                <div class="d2">
                  <p class="p1">
                    <img
                      src="@/assets/images/1.6_img/ziying_mendian_icon2.png"
                      alt=""
                    />
                    <span>{{ item.linkTel }}</span>
                  </p>
                  <p class="p2">
                    <img
                      src="@/assets/images/1.6_img/ziying_mendian_icon3.png"
                      alt=""
                    />
                    <span>{{ item.ppAddress }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="right">
              <span>{{ item.dictance.worth }}{{ item.dictance.unit }}</span>
            </div>
          </div>
        </van-list>
      </div>
    </div>

    <el-amap
      vid="amap"
      :plugin="plugin"
      :center="center"
      :zoom="zoom"
      style="display: none"
    >
      <el-amap-marker vid="marker" :position="center" :label="label">
      </el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import { StoreListAPI, OperatingPointUserAPI } from "@/api/Proprietary";
import { List } from "vant";
import loading from "@/components/loading";
import qs from "qs";
export default {
  name: "ProprietarySelect",
  data() {
    const self = this;
    return {
      submitData: {
        lng: "",
        Lat: "",
        pageIndex: 0,
        pageSize: 10,
        shopId: window.localStorage.getItem("ShopId"),
      },
      loading: false,
      finished: false,
      total: 0, //商品的总数量
      loadingshow: true,
      StoreDataList: [], //门店列表
      coAddress: "",
      DetailedAddress: "",
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
                  self.submitData.lng = result.position.lng;
                  self.submitData.Lat = result.position.lat;
                  self.DetailedAddress = result.formattedAddress;

                  if (window.localStorage.getItem("location")) {
                    let obj = JSON.parse(
                      window.localStorage.getItem("location")
                    );
                    console.log(obj, "objobjobj");
                    self.coAddress = obj.pname + obj.cityname + obj.adname;
                    self.DetailedAddress =
                      obj.pname + obj.cityname + obj.adname + obj.address;

                    if (obj.location.lng) {
                      self.submitData.lng = obj.location.lng;
                      self.submitData.Lat = obj.location.lat;
                    } else {
                      self.submitData.lng = obj.location.split(",")[0];
                      self.submitData.Lat = obj.location.split(",")[1];
                    }
                  }

                  self.StoreList();
                  self.$nextTick();
                }
              });
            },
          },
        },
      ],
    };
  },
  components: {
    [List.name]: List,
    loading: loading,
  },
  methods: {
    //跳转去门店申请入住
    jumpProprietaryLocation() {
      this.$router.push({
        path: "/GoodsDetails/ProprietaryLocation",
      });
    },
    // 门店列表
    StoreList() {
      this.submitData.pageIndex++;

      StoreListAPI(this.submitData, "get")
        .then((res) => {
          this.total = res.data.total;
          this.StoreDataList.push(...res.data.rows);
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.StoreDataList.length === this.total) {
            this.finished = true;
          }
        });
    },
    //选择门店
    SelectList(PointId) {
      let data = qs.stringify({
        ShopId: window.localStorage.getItem("ShopId"),
        ShopPickupPointId: PointId,
      });
      OperatingPointUserAPI(data, "post").then((res) => {
        this.$router.replace({
          path: "/GoodsDetails/ProprietaryStore",
        });
      });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.StoreList();
    },
  },
  mounted() {
    document.title = "选择门店";
  },
};
</script>

<style lang="less">
.ProprietarySelect {
  width: 100%;
  height: 100%;
  background: @text-white;
  .ProprietarySelect_box {
    padding: 0 30px;
    height: 100%;
  }
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    height: 100px;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #eaeaea;
    background: #fff;
    .left {
      display: flex;
      align-items: center;
      flex: 1;
      padding-left: 30px;
      img {
        width: 40px;
        height: 40px;
      }
      span {
        font-size: 28px;
        color: @text-colorB;
        padding-left: 12px;
        line-height: 32px;
      }
    }
    .right {
      padding-right: 30px;
      padding-left: 20px;
      span {
        font-size: 28px;
        color: @auxiliary-color;
      }
    }
  }
  .content {
    width: 100%;
    padding-top: 100px;
    .item {
      width: 100%;
      display: flex;
      margin: 0 0 36px;
      .left {
        flex: 1;
        display: flex;
        .leftdiv1 {
          display: flex;
          flex-direction: column;
          .d1 {
            width: 148px;
            height: 148px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }
          .d2 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 6px;
            .d2_yy {
              width: 44px;
              height: 44px;
              position: relative;
              img {
                width: 44px;
                height: 44px;
                border-radius: 4px;
              }
              p{
                width: 44px;
                height: 44px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                position: absolute;
                top: 0;
              }
            }
          }
        }
        .leftdiv2 {
          padding-left: 18px;
          .d1 {
            font-size: 32px;
            color: @text-colorA;
            margin-top: 12px;
          }
          .d2 {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            p {
              display: flex;
              img {
                width: 24px;
                height: 24px;
                padding-top: 4px;
              }
              span {
                padding-left: 6px;
                font-size: 26px;
                color: @text-colorC;
                line-height: 36px;
              }
            }
            .p2 {
              padding-top: 8px;
            }
          }
        }
      }
      .right {
        margin-top: 12px;
        color: @main-color;
        font-size: 28px;
      }
    }
    .item:nth-child(1) {
      margin-top: 24px;
    }
  }
}
</style>
