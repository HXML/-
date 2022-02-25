<template>
  <div style="width: 100%; height: 100%">
    <div class="Myorder">
      <div class="navList">
        <div class="nav_top" v-show="ismdorder">
          <input
            type="text"
            placeholder="请输入收货人信息搜索订单"
            v-model="selectxx"
          />
          <span @click="sskeyword()">搜索</span>
        </div>
        <ul>
          <li
            :class="{ myColor: index == isActive }"
            @click="liseGo(index, 500)"
            v-for="(item, index) in myList"
            :key="index"
          >
            <span>{{ item.Listtext }}</span>
            <span
              class="xhx"
              :class="{ myimgColor: index == isActive }"
              :key="index"
            ></span>
          </li>
        </ul>
      </div>
      <div
        @click="jumpurl()"
        class="Wxwithout"
        style="width: 100%; overflow: hidden; display: none"
      ></div>
      <div class="mainContent">
        <div class="swiper-container">
          <div class="swiper-wrapper">

            <!-- 全部 -->
            <div
              :class="
                ismdorder ? 'swiper-slide swiper-slideTow' : 'swiper-slide'
              "
            >
              <van-list
                v-model="loadingOne"
                :finished="finishedOne"
                finished-text="没有更多了"
                @load="onLoad"
                :immediate-check="false"
                v-if="obligation1.length != 0"
              >
                <div class="order_content">
                  <div
                    class="order-store-item"
                    v-for="(item, index) in obligation1"
                    :key="index"
                  >
                    <div class="storename" v-show="!ismdorder">
                      <p>
                        <img
                          src="@/assets/images/mine_Order_icon6@2x.png"
                          alt
                        />
                        <span>{{ item.shopName }}</span>
                      </p>
                      <span>{{ item.oStatusStr }}</span>
                    </div>

                    <div class="storenameTow" v-show="ismdorder">
                      <p>
                        <span class="s1">下单时间：{{ item.creatorDate }}</span>
                        <span class="s2">{{ item.oStatusStr }}</span>
                      </p>
                      <p>
                        <span class="s1"
                          >收货人： {{ item.consignee }}
                          {{ item.consigneeMobile }}</span
                        >
                      </p>
                    </div>

                    <div class="good">
                      <ul @click="jumpOrderDetails(item.id, ismdorder)">
                        <li
                          v-for="(itemA, indexTow) in item.itemList"
                          :key="indexTow"
                        >
                          <div class="good_left">
                            <img
                              :src="itemA.imageUrl + '?x-oss-process=style/b1'"
                              alt
                            />
                          </div>
                          <div class="good_right">
                            <div class="d1">
                              <p>{{ itemA.goodsName }}</p>
                              <p>
                                <span
                                  v-for="(itemB,
                                  indexThree) in itemA.orderOtherData"
                                  :key="indexThree"
                                  >{{ itemB.Key }}：{{ itemB.Value }} ;</span
                                >
                              </p>
                            </div>
                            <div class="d2">
                              <span>￥{{ itemA.price }}</span>
                              <span>x{{ itemA.qty }}</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="goodprice">
                      <span>
                        共{{ countnum(item.itemList) }}件，实付
                        <i>￥{{ item.totalPrice }}</i>
                      </span>
                    </div>

                    <div class="orderstate">
                      <button
                        class="b1"
                        v-show="text(item, 1, ismdorder)"
                        @click="CancelOrder(item.id, index)"
                      >
                        取消订单
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 2, ismdorder)"
                        @click="RemindDelivery(item.id)"
                      >
                        提醒发货
                      </button>
                     <button
                        class="b3"
                        v-show="text(item, 3, ismdorder)"
                        @click="Alipayshow? tctype(item.totalPrice, item.orderNo)
                            : debounceBtn(item.orderNo)
                        "
                      >
                        立即支付
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 4, ismdorder)"
                        @click="Confirmgoods(item.id, index)"
                      >
                        确认收货
                      </button>
                      <button class="b3" v-show="text(item, 5, ismdorder)">
                        查看物流
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 6, ismdorder)"
                        @click="jumpToEvaluate(item.id, item.orderNo)"
                      >
                        去评价
                      </button>
                     
                    </div>
                    
                  </div>
                </div>
              </van-list>
              <div class="kong" v-if="obligation1.length == 0">
                <div class="kong_box">
                  <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
                  <p class="p1">报告，这里订单数为0</p>
                  <p class="p2">您购买的所有订单都在这里集合</p>
                </div>
              </div>
            </div>

            <!-- 待付款 -->
            <div
              :class="
                ismdorder ? 'swiper-slide swiper-slideTow' : 'swiper-slide'
              "
            >
              <van-list
                v-model="loadingTow"
                :finished="finishedTow"
                finished-text="没有更多了"
                @load="onLoadTow"
                :immediate-check="false"
                v-if="obligation2 != 0"
              >
                <div class="order_content">
                  <div
                    class="order-store-item"
                    v-for="(item, index) in obligation2"
                    :key="index"
                  >
                    <div class="storename" v-show="!ismdorder">
                      <p>
                        <img
                          src="@/assets/images/mine_Order_icon6@2x.png"
                          alt
                        />
                        <span>{{ item.shopName }}</span>
                      </p>
                      <span>{{ item.oStatusStr }}</span>
                    </div>
                    <div class="storenameTow" v-show="ismdorder">
                      <p>
                        <span class="s1">下单时间：{{ item.creatorDate }}</span>
                        <span class="s2">{{ item.oStatusStr }}</span>
                      </p>
                      <p>
                        <span class="s1"
                          >收货人： {{ item.consignee }}
                          {{ item.consigneeMobile }}</span
                        >
                      </p>
                    </div>
                    <div class="good">
                      <ul @click="jumpOrderDetails(item.id, ismdorder)">
                        <li
                          v-for="(itemA, indexTow) in item.itemList"
                          :key="indexTow"
                        >
                          <div class="good_left">
                            <img
                              :src="itemA.imageUrl + '?x-oss-process=style/b1'"
                              alt
                            />
                          </div>
                          <div class="good_right">
                            <div class="d1">
                              <p>{{ itemA.goodsName }}</p>
                              <p>
                                <span
                                  v-for="(itemB,
                                  indexThree) in itemA.orderOtherData"
                                  :key="indexThree"
                                  >{{ itemB.Key }}：{{ itemB.Value }} ;</span
                                >
                              </p>
                            </div>
                            <div class="d2">
                              <span>￥{{ itemA.price }}</span>
                              <span>x{{ itemA.qty }}</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="goodprice">
                      <span>
                        共{{ countnum(item.itemList) }}件，实付
                        <i>￥{{ item.totalPrice }}</i>
                      </span>
                    </div>
                    <div
                      class="goodgroupNo"
                      v-if="item.actType == 'TYPE_GROUP'"
                    >
                      <div class="goodgroup_box">
                        <p class="p1">拼团活动订单</p>
                      </div>
                    </div>

                    <!-- <div class="orderstate">
                      <button
                        class="b1"
                        v-show="item.orderStatus == 1 && item.isMyOrder == 1"
                        @click="CancelOrder(item.id, index)"
                      >
                        取消订单
                      </button>
                      <button
                        class="b2"
                        v-show="item.orderStatus == 2 && item.isMyOrder == 1"
                        @click="RemindDelivery(item.id)"
                      >
                        提醒发货
                      </button>
                      <button
                        class="b3"
                        v-show="item.orderStatus == 1 && item.isMyOrder == 1"
                        @click="tctype(item.totalPrice, item.orderNo)"
                      >
                        立即支付
                      </button>
                      <button
                        class="b2"
                        v-show="item.orderStatus == 3 && item.isMyOrder == 1"
                        @click="Confirmgoods(item.id, index)"
                      >
                        确认收货
                      </button>
                      <button
                        class="b3"
                        v-show="item.orderStatus == 3 && !ismdorder"
                      >
                        查看物流
                      </button>
                      <button
                        class="b2"
                        v-show="
                          item.isReview == 0 &&
                          item.orderStatus == 5 &&
                          item.isMyOrder == 1
                        "
                        @click="jumpToEvaluate(item.id, item.orderNo)"
                      >
                        去评价
                      </button>
                    </div> -->
                    <div class="orderstate">
                      <button
                        class="b1"
                        v-show="text(item, 1, ismdorder)"
                        @click="CancelOrder(item.id, index)"
                      >
                        取消订单
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 2, ismdorder)"
                        @click="RemindDelivery(item.id)"
                      >
                        提醒发货
                      </button>
                      <!-- <button
                        class="b3"
                        v-show="text(item, 3, ismdorder)"
                        @click="tctype(item.totalPrice, item.orderNo)"
                      >
                        立即支付
                      </button> -->

                      <button
                        class="b3"
                        v-show="text(item, 3, ismdorder)"
                        @click="Alipayshow? tctype(item.totalPrice, item.orderNo)
                            : debounceBtn(item.orderNo)
                        "
                      >
                        立即支付
                      </button>

                      <button
                        class="b2"
                        v-show="text(item, 4, ismdorder)"
                        @click="Confirmgoods(item.id, index)"
                      >
                        确认收货
                      </button>
                      <button class="b3" v-show="text(item, 5, ismdorder)">
                        查看物流
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 6, ismdorder)"
                        @click="jumpToEvaluate(item.id, item.orderNo)"
                      >
                        去评价
                      </button>
                    </div>
                  </div>
                </div>
              </van-list>

              <div class="kong" v-if="obligation2.length == 0">
                <div class="kong_box">
                  <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
                  <p class="p1">报告，这里订单数为0</p>
                  <p class="p2">您购买的所有订单都在这里集合</p>
                </div>
              </div>
            </div>

            <!-- 待发货 -->
            <div
              :class="
                ismdorder ? 'swiper-slide swiper-slideTow' : 'swiper-slide'
              "
            >
              <van-list
                v-model="loadingThree"
                :finished="finishedThree"
                finished-text="没有更多了"
                @load="onLoadThree"
                :immediate-check="false"
                v-if="obligation3.length != 0"
              >
                <div class="order_content">
                  <div
                    class="order-store-item"
                    v-for="(item, index) in obligation3"
                    :key="index"
                  >
                    <div class="storename" v-show="!ismdorder">
                      <p>
                        <img
                          src="@/assets/images/mine_Order_icon6@2x.png"
                          alt
                        />
                        <span>{{ item.shopName }}</span>
                      </p>
                      <span v-if="item.itemGroupList">{{
                        item.itemGroupList.limitPeopleNum !=
                          item.itemGroupList.peopleNum && !item.istimeEnd
                          ? "待成团"
                          : item.oStatusStr
                      }}</span>

                      <span v-else>{{ item.oStatusStr }}</span>
                    </div>
                    <div class="storenameTow" v-show="ismdorder">
                      <p>
                        <span class="s1">下单时间：{{ item.creatorDate }}</span>
                        <span class="s2">{{ item.oStatusStr }}</span>
                      </p>
                      <p>
                        <span class="s1"
                          >收货人： {{ item.consignee }}
                          {{ item.consigneeMobile }}</span
                        >
                      </p>
                    </div>
                    <div class="good">
                      <ul @click="jumpOrderDetails(item.id, ismdorder)">
                        <li
                          v-for="(itemA, indexTow) in item.itemList"
                          :key="indexTow"
                        >
                          <div class="good_left">
                            <img
                              :src="itemA.imageUrl + '?x-oss-process=style/b1'"
                              alt
                            />
                          </div>
                          <div class="good_right">
                            <div class="d1">
                              <p>{{ itemA.goodsName }}</p>
                              <p>
                                <span
                                  v-for="(itemB,
                                  indexThree) in itemA.orderOtherData"
                                  :key="indexThree"
                                  >{{ itemB.Key }}：{{ itemB.Value }} ;</span
                                >
                              </p>
                            </div>
                            <div class="d2">
                              <span>￥{{ itemA.price }}</span>
                              <span>x{{ itemA.qty }}</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="goodprice">
                      <span>
                        共{{ countnum(item.itemList) }}件，实付
                        <i>￥{{ item.totalPrice }}</i>
                      </span>
                    </div>

                    <div class="orderstate" v-if="!item.itemGroupList">
                      <button
                        class="b1"
                        v-show="text(item, 1, ismdorder)"
                        @click="CancelOrder(item.id, index)"
                      >
                        取消订单
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 2, ismdorder)"
                        @click="RemindDelivery(item.id)"
                      >
                        提醒发货
                      </button>

                       <button
                        class="b3"
                        v-show="text(item, 3, ismdorder)"
                        @click="Alipayshow? tctype(item.totalPrice, item.orderNo)
                            : debounceBtn(item.orderNo)
                        "
                      >
                        立即支付
                      </button>

                      <button
                        class="b2"
                        v-show="text(item, 4, ismdorder)"
                        @click="Confirmgoods(item.id, index)"
                      >
                        确认收货
                      </button>
                      <button class="b3" v-show="text(item, 5, ismdorder)">
                        查看物流
                      </button>
                      <button
                        class="b2"
                        v-show="text(item, 6, ismdorder)"
                        @click="jumpToEvaluate(item.id, item.orderNo)"
                      >
                        去评价
                      </button>
                    </div>

                    <div class="goodgroup" v-if="item.itemGroupList">
                      <div
                        class="goodgroup_box"
                        @click="jumpGroupDetails(item.itemGroupList.actGroupId)"
                      >
                        <p
                          class="p1"
                          v-if="
                            item.itemGroupList.limitPeopleNum !=
                              item.itemGroupList.peopleNum && !item.istimeEnd
                          "
                        >
                          [拼团中] 还差{{
                            item.itemGroupList.limitPeopleNum -
                            item.itemGroupList.peopleNum
                          }}人成团，剩余<van-count-down
                            :time="item.groupOverTime"
                            @finish="finish"
                          />
                        </p>

                        <p
                          class="p1"
                          v-if="
                            item.itemGroupList.limitPeopleNum ==
                              item.itemGroupList.peopleNum && !item.istimeEnd
                          "
                        >
                          [拼团成功]等待商家发货
                        </p>

                        <p class="p1" v-if="item.istimeEnd">[拼团失败]</p>

                        <p
                          class="p2"
                          v-if="
                            item.itemGroupList.limitPeopleNum !=
                              item.itemGroupList.peopleNum && !item.istimeEnd
                          "
                        >
                          邀请好友>
                        </p>
                      </div>
                    </div>

                    <div class="goodgroupTow" v-if="item.itemGroupList"></div>
                  </div>
                </div>
              </van-list>
              <div class="kong" v-if="obligation3.length == 0">
                <div class="kong_box">
                  <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
                  <p class="p1">报告，这里订单数为0</p>
                  <p class="p2">您购买的所有订单都在这里集合</p>
                </div>
              </div>
            </div>

            <div
              :class="
                ismdorder ? 'swiper-slide swiper-slideTow' : 'swiper-slide'
              "
            >
              <van-list
                v-model="loadingFour"
                :finished="finishedFour"
                finished-text="没有更多了"
                @load="onLoadFour"
                :immediate-check="false"
                v-if="obligation4 != 0"
              >
                <div class="order_content">
                  <div
                    class="order-store-item"
                    v-for="(item, index) in obligation4"
                    :key="index"
                  >
                    <div class="storename" v-show="!ismdorder">
                      <p>
                        <img
                          src="@/assets/images/mine_Order_icon6@2x.png"
                          alt
                        />
                        <span>{{ item.shopName }}</span>
                      </p>
                      <span>{{ item.oStatusStr }}</span>
                    </div>
                    <div class="storenameTow" v-show="ismdorder">
                      <p>
                        <span class="s1">下单时间：{{ item.creatorDate }}</span>
                        <span class="s2">{{ item.oStatusStr }}</span>
                      </p>
                      <p>
                        <span class="s1"
                          >收货人： {{ item.consignee }}
                          {{ item.consigneeMobile }}</span
                        >
                      </p>
                    </div>
                    <div class="good">
                      <ul @click="jumpOrderDetails(item.id, ismdorder)">
                        <li
                          v-for="(itemA, indexTow) in item.itemList"
                          :key="indexTow"
                        >
                          <div class="good_left">
                            <img
                              :src="itemA.imageUrl + '?x-oss-process=style/b1'"
                              alt
                            />
                          </div>
                          <div class="good_right">
                            <div class="d1">
                              <p>{{ itemA.goodsName }}</p>
                              <p>
                                <span
                                  v-for="(itemB,
                                  indexThree) in itemA.orderOtherData"
                                  :key="indexThree"
                                  >{{ itemB.Key }}：{{ itemB.Value }} ;</span
                                >
                              </p>
                            </div>
                            <div class="d2">
                              <span>￥{{ itemA.price }}</span>
                              <span>x{{ itemA.qty }}</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="goodprice">
                      <span>
                        共{{ countnum(item.itemList) }}件，实付
                        <i>￥{{ item.totalPrice }}</i>
                      </span>
                    </div>
                    <div class="orderstate">
                      <button
                        class="b2"
                        @click="Confirmgoods(item.id, index)"
                        v-show="!ismdorder"
                      >
                        确认收货
                      </button>

                      <button
                        class="b2"
                        @click="Confirmgoods(item.id, index)"
                        v-show="ismdorder"
                      >
                        确认提货
                      </button>

                      <button
                        class="b3"
                        @click="ShowExpress(item.transNo, index)"
                        v-show="!ismdorder"
                      >
                        查看物流
                      </button>
                    </div>
                  </div>
                </div>
              </van-list>
              <div class="kong" v-if="obligation4.length == 0">
                <div class="kong_box">
                  <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
                  <p class="p1">报告，这里订单数为0</p>
                  <p class="p2">您购买的所有订单都在这里集合</p>
                </div>
              </div>
            </div>

            <div
              :class="
                ismdorder ? 'swiper-slide swiper-slideTow' : 'swiper-slide'
              "
            >
              <van-list
                v-model="loadingFive"
                :finished="finishedFive"
                finished-text="没有更多了"
                @load="onLoadFive"
                :immediate-check="false"
                v-if="obligation5.length != 0"
              >
                <div class="order_content">
                  <div
                    class="order-store-item"
                    v-for="(item, index) in obligation5"
                    :key="index"
                  >
                    <div class="storename" v-show="!ismdorder">
                      <p>
                        <img
                          src="@/assets/images/mine_Order_icon6@2x.png"
                          alt
                        />
                        <span>{{ item.shopName }}</span>
                      </p>
                      <span>{{ item.oStatusStr }}</span>
                    </div>

                    <div class="storenameTow" v-show="ismdorder">
                      <p>
                        <span class="s1">下单时间：{{ item.creatorDate }}</span>
                        <span class="s2">{{ item.oStatusStr }}</span>
                      </p>
                      <p>
                        <span class="s1"
                          >收货人： {{ item.consignee }}
                          {{ item.consigneeMobile }}</span
                        >
                      </p>
                    </div>
                    <div class="good">
                      <ul @click="jumpOrderDetails(item.id, ismdorder)">
                        <li
                          v-for="(itemA, indexTow) in item.itemList"
                          :key="indexTow"
                        >
                          <div class="good_left">
                            <img
                              :src="itemA.imageUrl + '?x-oss-process=style/b1'"
                              alt
                            />
                          </div>
                          <div class="good_right">
                            <div class="d1">
                              <p>{{ itemA.goodsName }}</p>
                              <p>
                                <span
                                  v-for="(itemB,
                                  indexThree) in itemA.orderOtherData"
                                  :key="indexThree"
                                  >{{ itemB.Key }}：{{ itemB.Value }} ;</span
                                >
                              </p>
                            </div>
                            <div class="d2">
                              <span>￥{{ itemA.price }}</span>
                              <span>x{{ itemA.qty }}</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="goodprice">
                      <span>
                        共{{ countnum(item.itemList) }}件，实付
                        <i>￥{{ item.totalPrice }}</i>
                      </span>
                    </div>
                    <div class="orderstate">
                      <!-- <button class="b1">取消订单</button>
                      <button class="b2">提醒发货</button>
                      <button class="b3">立即支付</button> 
                      <button class="b2">确认收货</button>
                      <button class="b3">查看物流</button>-->
                      <button
                        class="b2"
                        @click="jumpToEvaluate(item.id, item.orderNo)"
                        v-show="!ismdorder"
                      >
                        去评价
                      </button>
                    </div>
                  </div>
                </div>
              </van-list>
              <div class="kong" v-if="obligation5.length == 0">
                <div class="kong_box">
                  <img src="@/assets/images/kong/kong_icon8@2x.png" alt />
                  <p class="p1">报告，这里订单数为0</p>
                  <p class="p2">您购买的所有订单都在这里集合</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <van-popup v-model="zfshow" round position="bottom">
        <div class="type_shadow">
          <div class="type_shadow_top">
            <span>选择支付方式</span>
            <img
              src="@/assets/images/home/gbdelete.png"
              @click="gbtype()"
              alt
            />
          </div>
          <div class="type_shadow_bottom">
            <div class="type_shadow_content">
              <div class="d1">
                <p class="p1">
                  <span class="s1">{{ PaytotalPrice }}</span>
                  <span class="s2">元</span>
                </p>
                <p class="p2">您需支付</p>
              </div>
              <div class="d2">
                <p class="p1" @click="debounceBtn()" v-show="WeChatshow">
                  <img src="@/assets/images/zk1.1/zhifu_icon1@2x.png" alt />
                  <span>微信支付</span>
                </p>

                <p class="p2" v-show="Alipayshow" @click="debounceBtnTow">
                  <img src="@/assets/images/zk1.1/zhifu_icon2@2x.png" alt />
                  <span>支付宝支付</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </van-popup>

      <div v-html="alhtml" ref="alipayWap"></div>
    </div>

    <loading ref="load" v-if="loadingshow"></loading>

    <div class="wlbox" v-show="wlshow" id="boxyy" @click="boxyy">
      <div class="wldiv">
        <div class="top">
          <div class="d1">
            <img :src="datawlTow.imageUrl + '?x-oss-process=style/n4'" alt />
          </div>
          <div class="d2">
            <div class="p1">
              <p class="s1">{{ datawlTow.goodsName }}</p>
              <p class="s2">共{{ datawlTow.qty }}件</p>
            </div>
            <div class="p2">
              <span class="s1">{{ logisticsData.expName }}</span>
              <span class="s2">{{ logisticsData.number }}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom_box">
            <van-steps
              direction="vertical"
              :active="1"
              inactive-icon="circle"
              active-icon="circle"
            >
              <div class="li">
                <p class="p1">
                  <span class="s1"></span>
                  <span class="s2"></span>
                </p>
                <van-step>
                  <h3>
                    <p class="h3_p1">
                      {{ datawl.consignee }} {{ datawl.consigneeMobile }}
                    </p>
                    <p class="h3_p2">{{ datawl.consigneeAddress }}</p>
                  </h3>
                </van-step>
              </div>
              <div
                class="li"
                v-for="(item, index) in logisticsData.list"
                :key="index"
              >
                <p class="p1">
                  <span class="s1">{{ item.itemtime }}</span>
                  <span class="s2">{{ item.itemtimeday }}</span>
                </p>
                <van-step>
                  <h3>{{ item.status }}</h3>
                </van-step>
              </div>
            </van-steps>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import Swiper from "swiper";

// Popup 动作面板
import { Popup } from "vant";

// 下拉处理
import { List, Toast } from "vant";
import { Dialog } from "vant";
import qs from "qs";

import {
  GetBusOrderpageListAsyncAPI,
  PayShopCancelOrderAsynccAPI,
  PayShopOrderAsyncAPI,
  RemindOrderAsyncAPI,
} from "@/api/MyApi";

import { getWxPayDataAPI } from "@/api/pay";

import { FinishShopOrderAsyncAPI, GetWuliuMsgAPI } from "@/api/order";
import loading from "@/components/loading";

import { etWx_PayData, callpayTow, AlipayData } from "@/common/js/payment.js";

import { debounce, throttle } from "@/common/js/debounceAndThrottle.js";

import { _setToken, _getToken } from "@/common/js/storage";

import { Step, Steps } from "vant";

import { CountDown } from "vant";

export default {
  name: "Myorder",
  data() {
    return {
      selectxx: "", //搜索的关键字
      ismdorder: false, //是否是门店订单
      alhtml: "",
      Alipayshow: true, //支付宝按钮隐藏显示
      WeChatshow: true, //微信支付按钮隐藏显示
      PayorderNo: "",
      PaytotalPrice: 0,
      zfshow: false,
      titledata: "我的订单", //控制title的动态变量
      loadingshow: true,
      isActive: 0,
      myList: [
        {
          Listtext: "全部",
        },
        {
          Listtext: "待付款",
        },
        {
          Listtext: "待发货",
        },
        {
          Listtext: "待收货",
        },
        {
          Listtext: "待评价",
        },
      ],
      orderstatus: 0, //判断请求的状态的
      obligation1: [], //全部
      obligation2: [], //待付款
      obligation3: [], //待发货
      obligation4: [], //待收货
      obligation5: [], //已完成
      pIdx: 0, //商品页面的初始化的index

      loadingOne: false,
      finishedOne: false,
      totalOne: 0, //商品的总数量

      loadingTow: false,
      finishedTow: false,
      totalTow: 0, //店铺的总数量

      loadingThree: false,
      finishedThree: false,
      totalThree: 0, //店铺的总数量

      loadingFour: false,
      finishedFour: false,
      totalFour: 0, //店铺的总数量

      loadingFive: false,
      finishedFive: false,
      totalFive: 0, //店铺的总数量

      isclick1: true,
      wxlink: "",
      wlshow: false,
      active: 1,
      logisticsData: {},
      datawl: {},
      datawlTow: {},
    };
  },
  computed: {
    text() {
      //ismdorder 是否是门店订单
      return function (item, type, ismdorder) {
        if (type == 1) {
          //取消订单
          return item.orderStatus == 1 && item.isMyOrder == 1;
        }
        if (type == 2) {
          //提醒发货
          return item.orderStatus == 2 && item.isMyOrder == 1;
        }
        if (type == 3) {
          //立即支付
          return item.orderStatus == 1 && item.isMyOrder == 1;
        }
        if (type == 4) {
          //确认收货
          return item.orderStatus == 3 && item.isMyOrder == 1;
        }
        if (type == 5) {
          //查看物流
          return item.orderStatus == 3 && !ismdorder && item.isMyOrder == 1;
        }
        if (type == 6) {
          //去评价
          return (
            item.isReview == 0 && item.orderStatus == 5 && item.isMyOrder == 1
          );
        }
      };
    },
  },
  components: {
    [List.name]: List,
    loading: loading,
    [Popup.name]: Popup,
    [Step.name]: Step,
    [Steps.name]: Steps,
    [CountDown.name]: CountDown,
  },
  methods: {
    sskeyword() {
      this.pIdx = 0;
      this.obligation1 = [];
      this.obligation2 = [];
      this.obligation3 = [];
      this.obligation4 = [];
      this.obligation5 = [];
      this.GetMyOrderList();
    },
    // 倒计时结束定点
    finish() {
      this.GetMyOrderList();
    },
    // 选择支付方式
    tctype(totalPrice, orderNo) {
      console.log(totalPrice, orderNo, "totalPrice,orderNo");
      this.PaytotalPrice = totalPrice;
      this.PayorderNo = orderNo;

      this.zfshow = true;
    },
    gbtype() {
      this.zfshow = false;
    },
    // 微信外部支付
    jumpurl() {
      window.location.href = this.wxlink;
      callpayTow(1);
    },
    ListTopActove() {
      this.loadingshow = true;
      if (this.$route.query.orderstatus == 5) {
        this.$route.query.orderstatus = 4;
        this.liseGo(this.$route.query.orderstatus, 0);
      } else {
        this.liseGo(this.$route.query.orderstatus, 0);
      }
    },
    // 返回一个特定的 DOM 节点，作为挂载的父节点
    liseGo(index, date) {
      this.loadingshow = true;

      this.isActive = index;

      this.pIdx = 0;

      this.loadingOne = true;
      this.finishedOne = false;
      this.obligation1 = [];

      this.loadingTow = true;
      this.finishedTow = false;
      this.obligation2 = [];

      this.loadingThree = true;
      this.finishedThree = false;
      this.obligation3 = [];

      this.loadingFour = true;
      this.finishedFour = false;
      this.obligation4 = [];

      this.loadingFive = true;
      this.finishedFive = false;
      this.obligation5 = [];

      if (index === 0) {
        this.orderstatus = 0;
      } else if (index === 1) {
        //待付款
        this.orderstatus = 1;
      } else if (index === 2) {
        this.orderstatus = 2;
      } else if (index === 3) {
        this.orderstatus = 3;
      } else if (index === 4) {
        this.orderstatus = 5;
      }
      this.GetMyOrderList();

      this.mySwiper.slideTo(index, date, false); //切换到第index个slide，速度为0.5秒
    },
    getSwiper() {
      var that = this;
      console.log(this.loadingshow, "this.loadingshow");
      this.loadingshow = true;
      // swiper-container  class名称
      this.mySwiper = new Swiper(".swiper-container", {
        autoplay: false, //可选选项，自动滑动
        on: {
          slideChangeTransitionEnd: function () {
            // this指向的是当前的swiper实例，that指向的是vue实例
            that.isActive = this.activeIndex; //切换结束时，告诉我现在是第几个slide

            that.pIdx = 0;

            that.loadingOne = true;
            that.finishedOne = false;
            that.obligation1 = [];

            that.loadingTow = true;
            that.finishedTow = false;
            that.obligation2 = [];

            that.loadingThree = true;
            that.finishedThree = false;
            that.obligation3 = [];

            that.loadingFour = true;
            that.finishedFour = false;
            that.obligation4 = [];

            that.loadingFive = true;
            that.finishedFive = false;
            that.obligation5 = [];

            if (this.activeIndex == 0) {
              that.orderstatus = 0;
            } else if (this.activeIndex == 1) {
              that.orderstatus = 1;
            } else if (this.activeIndex == 2) {
              that.orderstatus = 2;
            } else if (this.activeIndex == 3) {
              that.orderstatus = 3;
            } else if (this.activeIndex == 4) {
              that.orderstatus = 5;
            }
            that.GetMyOrderList();
          },
        },
      });
    },
    GetMyOrderList() {
      //待付款
      this.pIdx++;
      let data = {
        orderstatus: this.orderstatus,
        keyword: this.selectxx,
        pIdx: this.pIdx,
        pSize: 5,
        pickupId: this.$route.query.pickupId,
      };
      GetBusOrderpageListAsyncAPI(data, "get")
        .then((res) => {
          console.log(res);
          let arr = res.data.olist.rows.map((item) => {
            return {
              id: item.id,
              orderNo: item.orderNo,
              shopName: item.shopName,
              actId: item.actId,
              actType: item.actType,
              isActOk: item.isActOk,
              actPrice: item.actPrice,
              consignee: item.consignee,
              consigneeMobile: item.consigneeMobile,
              creatorDate: item.creatorDate,
              consigneeAddress: item.consigneeAddress,
              orderStatus: item.orderStatus,
              shippingCost: item.shippingCost,
              orderPrice: item.orderPrice,
              favouredPrice: item.favouredPrice,
              totalPrice: item.totalPrice,
              orderOtherData: item.orderOtherData,
              transNo: item.transNo,
              itemGroupList: item.itemGroupList,
              groupOverTime: 30 * 60 * 60 * 1000,
              istimeEnd: false,
              isMyOrder: item.isMyOrder,
              itemList: item.itemList.map((i) => {
                return {
                  id: i.id,
                  goodsName: i.goodsName,
                  qty: i.qty,
                  price: i.price,
                  totalPrice: i.totalPrice,
                  favouredPrice: i.favouredPrice,
                  orderOtherData: i.orderOtherData
                    ? JSON.parse(i.orderOtherData)
                    : "",
                  isReturn: i.isReturn,
                  imageUrl: i.imageUrl,
                };
              }),
              oStatusStr: item.oStatusStr,
            };
          });

          console.log(arr, "arrrrrrrr");

          for (var i = 0; i < arr.length; i++) {
            if (arr[i].itemGroupList) {
              var obj = new Date();
              var eTime = new Date(
                arr[i].itemGroupList.timeOverTime.replace(
                  new RegExp("-", "gm"),
                  "/"
                )
              );
              arr[i].groupOverTime = eTime - obj;
              // console.log(arr[i].groupOverTime,"arr[i].groupOverTime")
              if (
                arr[i].groupOverTime <= 0 &&
                arr[i].itemGroupList.limitPeopleNum !=
                  arr[i].itemGroupList.peopleNum
              ) {
                arr[i].istimeEnd = true;
              }
              // console.log(arr[i].istimeEnd,"arr[i].istimeEnd=")
            }
          }

          if (this.orderstatus == 0) {
            this.totalOne = res.data.olist.total;
            this.obligation1.push(...arr);
          } else if (this.orderstatus == 1) {
            this.totalTow = res.data.olist.total;
            this.obligation2.push(...arr);
          } else if (this.orderstatus == 2) {
            this.totalThree = res.data.olist.total;
            this.obligation3.push(...arr);
          } else if (this.orderstatus == 3) {
            this.totalFour = res.data.olist.total;
            this.obligation4.push(...arr);
          } else if (this.orderstatus == 5) {
            this.totalFive = res.data.olist.total;
            this.obligation5.push(...arr);
          }
          this.loadingshow = false;

          console.log(this.loadingshow, "this.loadingshow22222");
        })
        .then((res) => {
          if (this.orderstatus == 0) {
            // 加载状态结束
            this.loadingOne = false;
            if (this.obligation1.length === this.totalOne) {
              this.finishedOne = true;
            }
          } else if (this.orderstatus == 1) {
            // 加载状态结束
            this.loadingTow = false;
            if (this.obligation2.length === this.totalTow) {
              this.finishedTow = true;
            }
          } else if (this.orderstatus == 2) {
            // 加载状态结束
            this.loadingThree = false;
            if (this.obligation3.length === this.totalThree) {
              this.finishedThree = true;
            }
          } else if (this.orderstatus == 3) {
            // 加载状态结束
            this.loadingFour = false;
            if (this.obligation4.length === this.totalFour) {
              this.finishedFour = true;
            }
          } else if (this.orderstatus == 5) {
            // 加载状态结束
            this.loadingFive = false;
            if (this.obligation5.length === this.totalFive) {
              this.finishedFive = true;
            }
          }
        });
    },
    // 取消订单
    CancelOrder(id, index) {
      Dialog.confirm({
        title: "是否取消订单?",
      })
        .then(() => {
          let data = {
            OrderIDs: id,
          };
          PayShopCancelOrderAsynccAPI(data, "post")
            .then((res) => {
              console.log(res, "取消订单");
              Toast("取消订单成功！");
            })
            .then((res) => {
              this.obligation2.splice(index, 1);
              location.reload();
            });
        })
        .catch(() => {});
    },
    debounceBtn: throttle(function (orderNo) {
      if (this.Alipayshow) {
        this.ImmediatelyPay(this.PayorderNo);
      } else {
        console.log(orderNo, "微信环境的订单号");
        this.ImmediatelyPay(orderNo);
      }
    }, 1000),
    debounceBtnTow: throttle(function () {
      this.AlipayBtn(this.PayorderNo);
    }, 1000),
    //立即支付
    ImmediatelyPay(orderNo) {
      console.log(orderNo, "xxxxxxorder");

      if (window.localStorage.getItem("isWeiXin") == "true") {
        etWx_PayData(orderNo, 2);
      } else {
        etWx_PayData(orderNo, 2).then((val) => {
          console.log(val, "val val val 当前支付的url");
          this.wxlink = val;
          this.jumpurl();
        });
      }
    },
    // 创建订单 支付宝支付
    AlipayBtn(orderNo) {
      AlipayData(orderNo, 1).then((val) => {
        console.log(val, "支付宝弹出页面");
        this.alhtml = val;
        this.$nextTick(() => {
          this.$refs.alipayWap.children[0].submit();
        });
      });
    },
    // 提醒发货
    RemindDelivery(id) {
      // console.log(id,"id")
      if (_getToken("remind" + id)) {
        Toast("已提醒商家发货");
      } else {
        _setToken("remind" + id, id);
        let data = qs.stringify({
          ID: id,
        });
        RemindOrderAsyncAPI(data, "post", 1).then((res) => {
          console.log(res, "提醒发货");
          Toast("已提醒商家发货");
        });
      }
    },
    //确认收货
    Confirmgoods(id, index) {
      Dialog.confirm({
        title: "是否确认收货?",
      })
        .then(() => {
          let data = qs.stringify({
            OrderIDs: id,
          });
          console.log(data);
          FinishShopOrderAsyncAPI(data, "post")
            .then((res) => {
              console.log(res, "确认收货");
              Toast("收货成功");
            })
            .then((res) => {
              this.obligation4.splice(index, 1);
            });
        })
        .catch(() => {});
    },
    //计算所有店铺的数量
    countnum(itemList) {
      let storeAllTow = 0;
      itemList.forEach((item) => {
        return (storeAllTow += item.qty);
      });
      return storeAllTow;
    },
    // 跳转去订单详情
    jumpOrderDetails(id, ismdorder) {
      console.log(ismdorder, "ismdorderismdorderismdorder");
      if (ismdorder) {
        let ismd = 1;
        this.$router.push({
          path: "/My/Myorder/OrderDetails",
          query: { IDs: id, ismd: ismd },
        });
      } else {
        let ismd = 0;
        this.$router.push({
          path: "/My/Myorder/OrderDetails",
          query: { IDs: id, ismd: ismd },
        });
      }
    },
    // 跳转去 去评价
    jumpToEvaluate(id, orderNo) {
      this.$router.replace({
        path: "/My/Myorder/OrderDetails/ToEvaluate",
        query: { IDs: id, OrderNo: orderNo },
      });
    },
    ShowExpress(trno, index) {
      console.log(trno, index, "trno,index");
      this.datawl = this.obligation4[index];
      this.datawlTow = this.obligation4[index].itemList[0];
      console.log(this.datawl, "this.datawl");
      let data = {
        no: trno,
        // no: 75374767693697,
      };
      GetWuliuMsgAPI(data, "get").then((res) => {
        console.log(res);
        this.logisticsData = res.result;

        this.wlshow = true;
      });
      // window.location.href =
      //   "https://m.kuaidi100.com/app/query/?coname=indexall&nu=" +
      //   this.OrderDetails[0].transNo;
    },
    boxyy(event) {
      if (event.target.id == "boxyy") {
        this.wlshow = false;
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetMyOrderList();
    },
    onLoadTow() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetMyOrderList();
    },
    onLoadThree() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetMyOrderList();
    },
    onLoadFour() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetMyOrderList();
    },
    onLoadFive() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetMyOrderList();
    },
    // 邀请好友 跳转去拼团详情
    jumpGroupDetails(actGroupId) {
      this.$router.push({
        path: "/GoodsDetails/GroupDetails",
        query: { groupId: actGroupId },
      });
    },
  },
  mounted() {
    // 初始化swiper
    document.title = this.titledata;
    this.orderstatus = this.$route.query.orderstatus;

    if (this.$route.query.pickupId) {
      //判断是否是门店的id
      this.myList = [
        {
          Listtext: "全部",
        },
        {
          Listtext: "今日订单",
        },
        {
          Listtext: "本月订单",
        },
        {
          Listtext: "待提货",
        },
        {
          Listtext: "售后",
        },
      ];
      this.ismdorder = true;
    } else {
      this.ismdorder = false;
    }

    if (window.localStorage.getItem("isWeiXin") == "true") {
      console.log("是微信环境");
      this.Alipayshow = false;
    } else {
      this.Alipayshow = true;
      console.log("不是微信环境");
    }

    if (window.localStorage.getItem("isAlipay") == "true") {
      console.log("是支付宝环境");
      this.WeChatshow = false;
    } else {
      console.log("是支付宝环境");
      this.WeChatshow = true;
    }

    this.getSwiper();
    this.ListTopActove();
  },
};
</script>

<style lang="less" scoped>
@import "../../../../node_modules/swiper/swiper.less";
.Myorder {
  width: 100%;
  background: @base-color;
  // min-height: 100%;
  // height: auto;
  height: 100%;
  overflow: hidden;
  .navList {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 100;
    background: @base-color;
    .nav_top {
      display: flex;
      align-items: center;
      padding: 0 24px;
      margin: 12px 0;
      input {
        flex: 1;
        border: 1px solid #ccc;
        outline: none;
        height: 60px;
        border-radius: 8px;
        text-indent: 16px;
        font-size: 28px;
      }
      span {
        font-size: 28px;
        padding-left: 24px;
      }
    }
    ul {
      display: flex;
      justify-content: space-around;
      .myColor {
        color: @main-color !important;
        pointer-events: none;
      }
      li {
        display: flex;
        flex-direction: column;
        // flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        height: 90px;
        color: @text-colorB;
        .xhx {
          width: 36px;
          height: 3px;
          background: @base-color;
          margin-top: 0.7vw;
        }
        .myimgColor {
          background: @button-mainbackground;
        }
      }
    }
  }
  .mainContent {
    width: 100%;
    // padding-top: 90px;
    height: 100%;
    .swiper-container {
      width: 100%;

      height: 100%;
      /deep/ .swiper-slide {
        min-height: 150vw;
        overflow-y: auto;
        box-sizing: border-box;
        padding-top: 90px;
      }
      .swiper-slideTow {
        padding-top: 174px;
      }
      .order_content {
        margin: 0 20px;
        .order-store-item {
          margin-bottom: 24px;
          background: @text-white;
          width: 100%;
          box-shadow: @other-shadow;
          border-radius: 16px;
          .storename {
            padding: 36px 0 24px;
            width: 100%;
            display: flex;
            align-items: center;
            p {
              flex: 1;
              display: flex;
              align-items: center;
              padding-left: 24px;
              img {
                width: 32px;
                height: 32px;
              }
              span {
                font-size: 24px;
                color: @text-colorA;
                padding-left: 14px;
                font-weight: 400;
              }
            }
            span {
              padding-right: 24px;
              font-size: 28px;
              font-weight: 500;
              color: @main-color;
            }
          }
          .storenameTow {
            display: flex;
            flex-direction: column;
            padding: 36px 24px 18px;
            p {
              display: flex;
              align-items: center;
              padding-bottom: 24px;
              .s1 {
                flex: 1;
                color: #4a5060;
                font-size: 24px;
              }
              .s2 {
                font-size: 28px;
                color: #f42737;
              }
            }
          }
          .good {
            padding: 0 24px;
            ul {
              width: 100%;
              li {
                margin-bottom: 24px;
                width: 100%;
                display: flex;
                .good_left {
                  width: 169px;
                  height: 169px;
                  border-radius: 16px;
                  overflow: hidden;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
                .good_right {
                  padding-left: 24px;
                  flex: 1;
                  display: flex;
                  align-items: flex-start;
                  .d1 {
                    flex: 3;
                    display: flex;
                    flex-direction: column;
                    // align-items: end;
                    p:nth-child(1) {
                      font-size: 24px;
                      color: @text-colorA;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                      margin-top: 12px;
                      line-height: 28px;
                    }
                    p:nth-child(2) {
                      font-size: 20px;
                      color: @text-colorC;
                      background: @base-color;
                      padding: 8px 12px;
                      border-radius: 16px;
                      margin-top: 12px;
                      line-height: 26px;
                      width: fit-content;
                    }
                  }
                  .d2 {
                    flex: 1.6;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    span:nth-child(1) {
                      font-size: 28px;
                      color: @text-colorA;
                      margin-top: 12px;
                    }
                    span:nth-child(2) {
                      font-size: 28px;
                      padding-top: 12px;
                      color: @text-colorC;
                    }
                  }
                }
              }
            }
          }
          .goodprice {
            font-size: 24px;
            color: @text-colorA;
            padding: 20px 24px 20px;
            display: flex;
            justify-content: flex-end;
            i {
              font-style: normal;
              color: @main-color;
            }
          }
          .orderstate {
            display: flex;
            justify-content: flex-end;
            padding: 0px 0 36px;
            button {
              border-radius: 28px;
              padding: 12px 20px;
              background: none;
              margin-right: 24px;
              font-size: 24px;
            }
            .b1 {
              color: @text-colorB;
              border: 1px solid @text-colorB;
            }
            .b2 {
              color: @main-color;
              border: 1px solid @main-color;
            }
            .b3 {
              color: @text-white;
              background: @main-color;
              border: 1px solid @main-color;
            }
          }
          .goodgroup {
            display: flex;
            align-items: center;
            padding: 0 24px;
            .goodgroup_box {
              width: 100%;
              display: flex;
              align-items: center;
              height: 60px;
              justify-content: space-between;
              background: rgba(255, 137, 73, 0.1);
              border-radius: 16px;
              .p1 {
                font-size: 26px;
                color: rgba(255, 137, 73, 1);
                padding-left: 12px;
                display: flex;
                align-items: center;
                .van-count-down {
                  color: rgba(255, 137, 73, 1);
                  font-size: 26px;
                }
              }
              .p2 {
                font-size: 24px;
                color: rgba(244, 38, 54, 1);
                padding-right: 12px;
              }
            }
          }
          .goodgroupTow {
            height: 30px;
          }

          .goodgroupNo {
            display: flex;
            align-items: center;
            padding: 0 24px;
            margin-bottom: 20px;
            .goodgroup_box {
              width: 100%;
              display: flex;
              align-items: center;
              height: 60px;
              justify-content: space-between;
              background: rgba(255, 137, 73, 0.1);
              border-radius: 16px;
              .p1 {
                font-size: 26px;
                color: rgba(255, 137, 73, 1);
                padding-left: 12px;
                display: flex;
                align-items: center;
                .van-count-down {
                  color: rgba(255, 137, 73, 1);
                  font-size: 26px;
                }
              }
              .p2 {
                font-size: 24px;
                color: rgba(244, 38, 54, 1);
                padding-right: 12px;
              }
            }
          }
        }
      }
    }
  }
  /deep/ .van-overlay {
    background: @backgroundBopcityW;
  }
  /deep/ .van-popup {
    height: 85%;
    border-radius: 40px 40px 0px 0px;
  }
  .type_shadow {
    width: 100%;
    height: 100%;
    .type_shadow_top {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      span {
        font-size: 32px;
        color: @text-colorA;
        flex: 1;
        padding-left: 40px;
      }
      img {
        width: 24px;
        height: 24px;
        padding-right: 40px;
      }
    }
    .type_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      padding-bottom: 100px;
      .type_shadow_content {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        .d1 {
          margin: 80px auto;
          text-align: center;
          .p1 {
            display: flex;
            align-items: baseline;
            .s1 {
              font-size: 88px;
              font-weight: 700;
              color: @text-colorB;
            }
            .s2 {
              font-size: 32px;
              color: @text-colorB;
            }
          }
          .p2 {
            font-size: 32px;
            color: @text-colorB;
            padding-top: 40px;
          }
        }
        .d2 {
          .p1 {
            display: flex;
            align-items: center;
            width: 90%;
            height: 136px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(182, 195, 177, 0.5);
            border-radius: 16px;
            box-shadow: 0px 4px 3px 0px #ebeef6;
            // justify-content: center;
            margin: 24px auto 0;
            img {
              width: 69px;
              margin-left: 200px;
            }
            span {
              font-size: 32px;
              font-weight: 700;
              color: @text-colorB;
              padding-left: 36px;
            }
          }
          .p2 {
            display: flex;
            align-items: center;
            width: 90%;
            height: 136px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(182, 195, 177, 0.5);
            border-radius: 16px;
            box-shadow: 0px 4px 3px 0px #ebeef6;
            margin: auto;
            // justify-content: center;
            margin-top: 24px;
            img {
              margin-left: 200px;
              width: 69px;
            }
            span {
              font-size: 32px;
              font-weight: 700;
              color: @text-colorB;
              padding-left: 36px;
            }
          }
        }
      }
    }
  }
}

.wlbox {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  .wldiv {
    width: 660px;
    height: 984px;
    background: #ffffff;
    border-radius: 16px;
    position: relative;
    .top {
      height: 140px;
      width: 604px;
      background: #ffeee5;
      border-radius: 16px 16px 0px 0px;
      display: flex;
      align-items: center;
      padding: 0 28px;
      color: #7d7977;
      font-size: 26px;
      position: absolute;
      top: 0;
      z-index: 99;
      .d1 {
        img {
          width: 100px;
          height: 100px;
          background: #ffcc65;
          border-radius: 8px;
        }
      }
      .d2 {
        padding-left: 18px;
        flex: 1;
        .p1 {
          display: flex;
          // align-items: center;
          .s1 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 340px;
            height: 46px;
          }
          .s2 {
            color: #f39868;
            padding-left: 12px;
          }
        }
        .p2 {
          // margin-top: 15px;
          .s2 {
            padding-left: 16px;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .bottom_box {
        width: 100%;
        height: 914px;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 140px 20px 0;
        /deep/ .van-steps--vertical {
          padding: 0;
          .van-step--vertical {
            line-height: 36px !important;
            padding: 6px 20px 30px;
            min-height: 60px;
            font-size: 24px;
            .van-step__line {
              width: 1px !important;
              border-left: 1px dashed #ccc;
              background: #fff;
            }
          }
          .li {
            .van-icon-circle::before {
              background: #fff;
              color: #ccc;
            }
            display: flex;
            .p1 {
              font-size: 22px;
              color: #b1b6c3;
              display: flex;
              flex-direction: column;
              padding: 10px 8vw 0 0;
              min-width: 9vw;
              align-items: center;
              .s2 {
                padding-top: 12px;
              }
            }
            .van-step__title {
              color: rgba(74, 80, 96, 0.8);
              h3 {
                font-weight: normal;
              }
              .h3_p2 {
                padding-top: 6px;
              }
            }
            .van-step__title--active h3 {
              color: #000a26;
              font-weight: bold !important;
            }
          }
          .li:nth-child(1) {
            .van-step__circle-container {
              background: red;
              width: 40px;
              height: 40px;
              background: url("../../../assets/images/dizhi@2x.png");
              background-size: 100% 100%;
              .van-icon {
                display: none;
              }
            }
            .van-step__title {
              color: rgba(177, 182, 195, 1);
            }
          }
          .li:last-child {
            .van-step__line {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>