<template>
  <div style="width: 100%; height: 100%">
    <div :class="ban ? 'ban GoodsDetails' : 'noban GoodsDetails'">
      <van-tabs v-model="active" scrollspy>
        <div class="title_left" @click="fhgo()" :style="{ opacity: opacity }">
          <img src="@/assets/images/home/home_shopping_fanhui@2x.png" alt />
        </div>
        <div class="title_right" :style="{ opacity: opacity }"></div>
        <van-tab title="商品">
          <!-- 轮播图 -->
          <div class="shop_banner">
            <van-swipe @change="onChange" :loop="true" :autoplay="3000">
              <van-swipe-item v-for="(item, index) in shopbanner" :key="index">
                <img
                  :src="item + '?x-oss-process=style/b5'"
                  @click="preViewImg(shopbanner, index)"
                />
              </van-swipe-item>
              <template #indicator>
                <div class="custom-indicator">
                  {{ current + 1 }}/{{ shopbanner.length }}
                </div>
              </template>
            </van-swipe>
          </div>

          <!-- 砍价 倒计时-->
          <div class="flash" v-if="BARGAINIRG">
            <div class="left">
              <div class="d1">
                <p>
                  <span class="s1">￥</span>
                  <span class="s2">{{ bargainirgDataTow.minFloorPrice }}</span>
                </p>
                <span class="s3"
                  >最高可砍{{
                    goodDetailsData.price - bargainirgDataTow.minFloorPrice
                  }}元</span
                >
              </div>
              <div class="d2">原价￥{{ goodDetailsData.price }}</div>
            </div>
            <div class="right">
              <div class="d1">
                <!-- <span>42</span>
                <i>:</i>
                <span>45</span>
                <i>:</i>
                <span>21</span> -->

                <!-- 预热倒计时 -->
                <van-count-down
                  :time="time"
                  @finish="finish(1)"
                  v-if="timeshow"
                >
                  <template #default="timeData">
                    <span class="block">{{
                      addPreZero(timeData.days * 24 + timeData.hours)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.minutes)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.seconds)
                    }}</span>
                  </template>
                </van-count-down>

                <!-- 活动倒计时 -->
                <van-count-down
                  :time="timeTow"
                  @finish="finish(2)"
                  v-if="!timeshow"
                >
                  <template #default="timeData">
                    <span class="block">{{
                      addPreZero(timeData.days * 24 + timeData.hours)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.minutes)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.seconds)
                    }}</span>
                  </template>
                </van-count-down>
              </div>
              <div class="d2">距离活动{{ bargainirgText }}</div>
            </div>
          </div>

          <!-- 限时抢购 倒计时-->
          <div class="flash" v-if="DISCOUNT">
            <div class="left">
              <div class="d1">
                <p>
                  <span class="s1">￥</span>
                  <span class="s2">{{ DiscountDataTow.actPrice }}</span>
                </p>
                <span class="s3">限时抢</span>
              </div>
              <div class="d2">原价￥{{ DiscountDataTow.price }}</div>
            </div>
            <div class="right">
              <div class="d1">
                <van-count-down
                  :time="Discounttime"
                  @finish="finishTow(1)"
                  v-if="Discounttimeshow"
                >
                  <template #default="timeData">
                    <span class="block">{{
                      addPreZero(timeData.days * 24 + timeData.hours)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.minutes)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.seconds)
                    }}</span>
                  </template>
                </van-count-down>

                <van-count-down
                  :time="DiscounttimeTow"
                  @finish="finishTow(2)"
                  v-if="!Discounttimeshow"
                >
                  <template #default="timeData">
                    <span class="block">{{
                      addPreZero(timeData.days * 24 + timeData.hours)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.minutes)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.seconds)
                    }}</span>
                  </template>
                </van-count-down>
              </div>
              <div class="d2">距离活动{{ DiscountText }}</div>
            </div>
          </div>

          <!-- 拼团 倒计时-->
          <div class="flash" v-if="GROUP">
            <div class="left">
              <div class="d1">
                <p>
                  <span class="s1">￥</span>
                  <span class="s2">{{
                    groupdataTow.minGroupPrice | toFixedTow
                  }}</span>
                </p>
                <span class="s3">拼团买</span>
              </div>
              <div class="d2">
                原价￥{{ goodDetailsData.price | toFixedTow }}
              </div>
            </div>
            <div class="right">
              <div class="d1">
                <van-count-down
                  :time="grouptime"
                  @finish="finishThree(1)"
                  v-if="!groupstarttime"
                >
                  <template #default="timeData">
                    <span class="block">{{
                      addPreZero(timeData.days * 24 + timeData.hours)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.minutes)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.seconds)
                    }}</span>
                  </template>
                </van-count-down>

                <van-count-down
                  :time="grouptimeTow"
                  @finish="finishThree(2)"
                  v-if="groupstarttime"
                >
                  <template #default="timeData">
                    <span class="block">{{
                      addPreZero(timeData.days * 24 + timeData.hours)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.minutes)
                    }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{
                      addPreZero(timeData.seconds)
                    }}</span>
                  </template>
                </van-count-down>
              </div>
              <div class="d2">距离活动{{ groupText }}</div>
            </div>
          </div>

          <!-- 商品名称 -->
          <div class="shop_title">
            <div class="shop_title_d1">
              <!-- 拼团 -->
              <!-- <div class="pt_d3">
                <span class="s1">拼团价￥</span>
                <p>
                  <span class="s2">4900.00</span>
                  <span class="s3">单买价¥5990.00</span>
                </p>
              </div> -->
              <!-- 限时秒杀没有d1 -->

              <!-- 正常商品的价格和样式  搭配满减 满减活动-->
              <div class="d1" v-if="!BARGAINIRG">
                <span class="newprice">
                  <i>￥</i>
                  {{ goodDetailsData.price }}
                </span>
                <span class="oldprice" v-show="goodDetailsData.originalPrice"
                  >￥{{ goodDetailsData.originalPrice }}</span
                >
              </div>
            </div>

            <div class="shop_title_d2">
              <!-- <p>【顺丰当天发 至高降1871元 3期免息】Huawei/华为 Mate 20 Pro华为Mate20手机mate30保时捷P30官方旗舰店P40</p> -->
              <p>{{ goodDetailsData.goodsName }}</p>
              <div class="d2" @click="Linksshare()" v-if="fxshow">
                <img src="@/assets/images/1.5_img/dapei_icon1@2x.png" alt />
                <span>分享</span>
              </div>
            </div>
          </div>

          <!-- 活动  服务 -->
          <div class="shop_activity">
            <div class="shop_activity_div_yunf">
              <div class="d1">
                <span class="s1">运费</span>
                <span class="s2">{{ goodDetailsData.city }}</span>
                <i></i>
                <span class="s3" v-if="goodDetailsData.tmpPrice != 0"
                  >￥{{ goodDetailsData.tmpPrice }}</span
                >
                <span class="s3" v-else>免邮费</span>
              </div>
              <div class="d2">
                <span>已售{{ goodDetailsData.buyNum }}件</span>
              </div>
            </div>

            <div class="shop_activity_div ht2" @click="tcpreferential()">
              <div class="shop_activity_div_box">
                <span class="s1">优惠</span>
                <div class="d1_box">
                  <div class="d1">
                    <span class="diyi">优惠券</span>
                    <p
                      class="s3"
                      v-show="stroln.length != 0"
                      style="color: #f42636"
                    >
                      {{ stroln }}
                    </p>
                    <p class="s3" v-show="stroln.length == 0">
                      店铺暂没有优惠券
                    </p>
                  </div>
                  <div class="d2" v-if="FREEPOST">
                    <span class="diyi">满减活动</span>
                    <span class="dier">{{ FreepostText }}</span>
                    <span class="dis">去凑单></span>
                  </div>
                </div>
              </div>
              <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
            </div>

            <div class="shop_activity_div ht3" @click="tcafterSale()">
              <div class="shop_activity_div_box">
                <span class="s1">服务</span>
                <div class="s2">七天无理由退换货；退款无忧、正品保证</div>
              </div>
              <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
            </div>

            <div
              class="shop_activity_div shop_activity_div3"
              @click="tccategory(1)"
              v-if="!PREFERENTIAL"
            >
              <div class="shop_activity_div_box">
                <span class="s1 select">选择</span>
                <div class="s2">
                  <i v-for="(item, index) in specificationsList" :key="index"
                    >{{ item }} ;</i
                  >
                </div>
              </div>
              <img src="@/assets/images/home/home_shopping_xiala@2x.png" alt />
            </div>
          </div>

          <!-- 团购 -->
          <group
            :actList="goodDetailsData.actList"
            @selectgroupsku="SelectgroupNo"
          ></group>

          <!-- 超值搭配 -->
          <collocation
            :collocationList="goodDetailsData.actList"
            :goodsName="goodDetailsData.goodsName"
            :selectskuobj="selectskuobj"
            v-show="PREFERENTIAL"
            @selectskuname="tccategory(5)"
          ></collocation>
        </van-tab>

        <van-tab title="评价">
          <!-- 评价 -->
          <div class="shop_evaluate">
            <div
              class="shop_evaluate_title"
              @click="evaluateDataTow.length != 0 && tcevaluate()"
            >
              <span class="s1">商品评价</span>
              <p v-if="evaluateDataTow.length != 0">
                <span>查看全部</span>
                <img
                  src="@/assets/images/home/home_shopping_xiala_zhuse@2x.png"
                  alt
                />
              </p>
            </div>

            <div
              class="shop_evaluate_content"
              v-for="(item, index) in evaluateDataTow"
              :key="index"
            >
              <div class="left">
                <img :src="item.userImgUrl + '?x-oss-process=style/n1'" alt />
              </div>
              <div class="right">
                <div class="d1">
                  <p class="p1">
                    <span>{{ item.username }}</span>
                    <span>
                      <van-rate
                        v-model="item.start"
                        color="#FF5533"
                        void-icon="star"
                        void-color="#eee"
                        readonly
                      />
                      <i>{{ item.start }}.0</i>
                    </span>
                  </p>
                  <p class="p2">
                    <span>{{ item.creatorDate }}</span>
                    <span>{{ getSkuString(item.orderData) }}</span>
                  </p>
                </div>
                <div class="d2">
                  <p>{{ item.reviewBody }}</p>
                </div>
                <div class="d3" v-show="item.imgList.length != 0">
                  <div
                    v-for="(itemA, indexTow) in item.imgList"
                    :key="indexTow"
                  >
                    <img
                      :src="itemA + '?x-oss-process=style/b1'"
                      @click="preViewImg(item.imgList, indexTow)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="evaluateDataTow.length == 0"
              class="shop_evaluate_content_kong"
            >
              <span>该商品还没有评价</span>
            </div>
          </div>

          <!-- 店铺 -->
          <div class="store">
            <!-- <img :src="modelshop.bkImgUrl+'?x-oss-process=style/b1'" alt class="store_banner" /> -->
            <div class="store_shadow">
              <div class="store_shadow_box">
                <div class="d1">
                  <div class="left" @click="jumpStore()">
                    <img
                      :src="modelshop.logoImg + '?x-oss-process=style/n3'"
                      alt
                    />
                  </div>
                  <div class="right">
                    <p class="p1">
                      <span>{{ modelshop.shopName }}</span>
                      <span>官方认证</span>
                    </p>
                    <!-- <p class="p2">
                    <span>
                      商品：
                      <i>{{modelshop.onGoods}}</i>
                    </span>
                    <span>
                      粉丝：
                      <i>{{modelshop.favNum}}</i>
                    </span>
                    </p>-->

                    <!-- <span
                      @click="storecollect(goodDetailsData.shopId)"
                      :class="storecollectactive?'storecollectactive':''"
                    >
                      <img
                        src="@/assets/images/home_shopping_tab_icon2@2x.png"
                        alt
                        v-bind:style="{display:storeimg?'block':'none'}"
                      />
                      <i>{{storecollecttext}}</i>
                    </span>-->
                  </div>
                </div>
                <div class="d2">
                  <p class="p3">
                    <span @click="jumpStore()">进店></span>
                  </p>
                </div>
              </div>
              <div class="store_shadow_boxTow">
                <div class="d1">
                  <span class="s1">{{ modelshop.onGoods }}</span>
                  <span class="s2">全部商品</span>
                </div>
                <i></i>
                <div class="d1">
                  <span class="s1">{{ modelshop.favNum }}</span>
                  <span class="s2">收藏人数</span>
                </div>
                <i></i>
                <div class="d2" @click="storecollect(goodDetailsData.shopId)">
                  <img src="@/assets/images/1.5_img/dapei_icon4@2x.png" alt />
                  <span>{{ storecollecttext }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="详情">
          <div class="shop_details_title">
            <i></i>
            <span>图文详情</span>
            <i></i>
          </div>
          <div class="shop_details_content" v-html="goodDetailsData.details">
            <!-- <img src="@/assets/images/home/onda_shangping_img_01.png" alt />
            <img src="@/assets/images/home/onda_shangping_img_02.png" alt />-->
          </div>

          <!-- 购物说明 -->
          <div class="shop_details_foot">
            <div class="top">
              <span>购物说明</span>
            </div>
            <div class="bottom">
              <p>
                划线价格：指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过的销售价等，并非原价，仅供参考。
              </p>
              <p>
                未划线价格：指商品的实时标价，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券等发生变化最终以订单结算页价格为准。
              </p>
              <p>
                售后说明：订单完成后七天内无理由退货，在我的订单中申请售后，售后通过审核后，退款金额一律按付款路径返还。
              </p>
            </div>
          </div>

          <!-- <recommend></recommend> -->
        </van-tab>
      </van-tabs>

      <!-- 该商品已失效 -->
      <div class="failure_shop" v-if="goodDetailsData.status != 2">
        <span>该商品已下架</span>
      </div>

      <!-- 是否在砍价中 -->
      <div
        class="bargainshow"
        v-if="bargainirgDataThree.length != 0 && BARGAINIRG"
      >
        <span class="s1">您正在参加当前商品的砍价活动</span>
        <span class="s2" @click="jumpBargain()">去看看</span>
      </div>

      <!-- 底部 -->
      <div class="GoodsDetails_foot">
        <div class="GoodsDetails_foot_box">
          <div class="baguette" @click="jumpStore()">
            <img
              src="@/assets/images/home/home_shopping_tab_icon1@2x.png"
              alt
            />
            <span>进店</span>
          </div>

          <div class="collect" @click="collectswitch(goodDetailsData.id)">
            <img :src="collectimg" alt />
            <span :class="collecactive ? 'collecactive' : ''">{{
              collecttext
            }}</span>
          </div>

          <div class="cart" @click="jumpshoppingCart()">
            <img
              src="@/assets/images/home/home_shopping_tab_icon3@2x.png"
              alt
            />
            <span>购物车</span>
            <div v-if="cartNumInfor !== 0">{{ cartNumInfor }}</div>
          </div>

          <!-- 拼团 -->
          <div class="bu_oneTow" v-if="groupstarttime">
            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button1'
                  : 'button1active button1'
              "
              @click="tccategory(3, 1)"
            >
              <span>单独购买</span>
              <span class="s2">¥{{ goodDetailsData.price | toFixedTow }}</span>
            </button>

            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button2'
                  : 'button2active button2'
              "
              @click="tccategory(3, 2)"
            >
              <span>发起拼团</span>
              <span class="s2"
                >¥{{ groupdataTow.minGroupPrice | toFixedTow }}</span
              >
            </button>
          </div>

          <!-- 砍价 -->
          <div class="bu_one" v-if="BARGAINIRG">
            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button1'
                  : 'button1active button1'
              "
              @click="tccategory(2)"
              v-if="!timeshow"
            >
              加入购物车
            </button>

            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button2'
                  : 'button2active button2'
              "
              @click="tccategory(4, 1)"
              v-if="!timeshow && !iskj"
            >
              砍价买
            </button>

            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button2'
                  : 'button2active button2'
              "
              @click="tccategory(4, 2)"
              v-if="!timeshow && iskj"
            >
              活动中
            </button>

            <!-- 砍价购买里面的普通 -->
            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button1'
                  : 'button1active button1'
              "
              @click="tccategory(2)"
              v-if="timeshow"
            >
              加入购物车
            </button>
            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button2'
                  : 'button2active button2'
              "
              @click="tccategory(3, 0)"
              v-if="timeshow"
            >
              活动未开始
            </button>
          </div>

          <!-- 限时秒杀 -->
          <div class="bu_one" v-if="!Discounttimeshow">
            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button1'
                  : 'button1active button1'
              "
              @click="tccategory(2)"
            >
              加入购物车
            </button>

            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button2'
                  : 'button2active button2'
              "
              @click="tccategory(3, 2)"
            >
              立即购买
            </button>
          </div>

          <!-- 正常 -->
          <div
            class="bu_one"
            v-if="!groupstarttime && !BARGAINIRG && Discounttimeshow"
          >
            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button1'
                  : 'button1active button1'
              "
              @click="tccategory(2)"
            >
              加入购物车
            </button>

            <button
              :class="
                goodDetailsData.status == 2
                  ? 'button2'
                  : 'button2active button2'
              "
              @click="tccategory(3, 0)"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>

      <!-- 评价弹框 -->
      <van-popup v-model="evaluate" round position="bottom" v-if="evaluate">
        <div class="evaluate_shadow">
          <div class="evaluate_shadow_top">
            <span>商品评价</span>
            <img
              src="@/assets/images/home/gbdelete.png"
              @click="gbevaluate()"
              alt
            />
          </div>
          <div class="evaluate_shadow_bottom">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多评价了"
              @load="onLoad"
              :immediate-check="false"
            >
              <div
                class="shop_evaluate_content"
                v-for="(item, index) in evaluateData"
                :key="index"
              >
                <div class="left">
                  <img :src="item.userImgUrl + '?x-oss-process=style/n1'" alt />
                </div>
                <div class="right">
                  <div class="d1">
                    <p class="p1">
                      <span>{{ item.username }}</span>
                      <span>
                        <van-rate
                          v-model="item.start"
                          color="#FF5533"
                          void-icon="star"
                          void-color="#eee"
                          readonly
                        />
                        <i>{{ item.start }}.0</i>
                      </span>
                    </p>
                    <p class="p2">
                      <span>{{ item.creatorDate }}</span>
                      <span>{{ getSkuString(item.orderData) }}</span>
                    </p>
                  </div>
                  <div class="d2">
                    <p>{{ item.reviewBody }}</p>
                  </div>
                  <div class="d3" v-if="item.imgList.length != 0">
                    <div
                      v-for="(itemA, indexTow) in item.imgList"
                      :key="indexTow"
                    >
                      <img
                        :src="itemA + '?x-oss-process=style/b5'"
                        @click="preViewImg(item.imgList, indexTow)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </div>
        </div>
      </van-popup>

      <!-- 售后服务弹框 -->
      <van-popup v-model="afterSale" round position="bottom">
        <div class="afterSale_shadow">
          <div class="afterSale_shadow_top">
            <span>售后服务</span>
            <img
              src="@/assets/images/home/gbdelete.png"
              @click="gbafterSale()"
              alt
            />
          </div>
          <div class="afterSale_shadow_bottom">
            <!-- <div class="afterSale_shadow_content">
              <div class="afterSale_shadow_content_left">
                <img src="@/assets/images/mine_avatar@2x.png" alt />
              </div>
              <div class="afterSale_shadow_content_right">
                <p>商家发货&售后</p>
                <p>本商品由“华为官方旗舰店”从“广东深圳”发货与售后</p>
              </div>
            </div>-->
            <div class="afterSale_shadow_content">
              <div class="afterSale_shadow_content_left">
                <img src="@/assets/images/mine_avatar@2x.png" alt />
              </div>
              <div class="afterSale_shadow_content_right">
                <p>七天无理由退换货</p>
                <p>该商品支持7天无理由退货，请放心购买!</p>
              </div>
            </div>
            <div class="afterSale_shadow_content">
              <div class="afterSale_shadow_content_left">
                <img src="@/assets/images/mine_avatar@2x.png" alt />
              </div>
              <div class="afterSale_shadow_content_right">
                <p>退货无忧</p>
                <p>所有商铺由兆客易购担保，所有由商户问题的商品，均可退货</p>
              </div>
            </div>
            <div class="afterSale_shadow_content">
              <div class="afterSale_shadow_content_left">
                <img src="@/assets/images/mine_avatar@2x.png" alt />
              </div>
              <div class="afterSale_shadow_content_right">
                <p>破损服务</p>
                <p>签收后72小时内发现非客户原因商品破损问题，提供售后服务。</p>
              </div>
            </div>
          </div>
        </div>
      </van-popup>

      <!-- 优惠券弹框 -->
      <van-popup v-model="preferential" round position="bottom">
        <div class="preferential_shadow">
          <div class="preferential_shadow_top">
            <p class="p1">
              <span>优惠</span>
              <img
                src="@/assets/images/home/gbdelete.png"
                @click="gbpreferential()"
                alt
              />
            </p>
            <!-- <p class="p2">本优惠券仅支持本店铺内使用，不包含其他店铺商品</p> -->
          </div>

          <div class="preferential_shadow_bottom">
            <div class="reduced_activity" v-if="FREEPOST">
              <div class="top">
                <span>满减活动</span>
              </div>
              <div class="bottom" @click="jumpStoreProdList()">
                正在参与{{ FreepostText }}活动 去凑单>
              </div>
            </div>

            <div class="coupons_activity">
              <div class="coupons_activity_top">
                <p class="p1">优惠券</p>
                <p class="p2">满减优惠可与优惠券叠加使用</p>
              </div>
              <div
                class="preferential_shadow_content"
                v-for="(item, index) in preferentialData"
                :key="index"
              >
                <div class="left">
                  <p class="p1">￥{{ item.faceValue }}</p>
                  <p class="p2">满{{ item.quotaLimit }}使用</p>
                  <p class="p3">
                    有效期：{{ item.useStartDate.split(" ")[0] }}-{{
                      item.useEndDate.split(" ")[0]
                    }}
                  </p>
                </div>
                <div class="right" @click="CollectCoupons(item.id, index)">
                  <span>{{ item.receive }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <!-- sku -->
      <!-- v-if="isShow"   v-show="!isShow"-->

      <van-sku
        :get-container="tccategory"
        v-model="spshow"
        :sku="sku"
        :goods="goods"
        :hide-stock="sku.hide_stock"
        @add-cart="onAddCartClicked"
        :close-on-click-overlay="true"
        :show-add-cart-btn="cartshow"
        :initial-sku="initialSku"
        ref="getSku"
        :quota="quotanum"
        :hide-quota-text="true"
      >
        <template #sku-header-price="props">
          <div class="van-sku__goods-price">
            <span class="van-sku__price-symbol">￥</span>
            <span class="van-sku__price-num">{{ props.price }}</span>
          </div>
        </template>
        <template slot="sku-actions">
          <div class="van-sku-actions">
            <!-- 拼团的sku 里面的按钮 -->
            <div @click="define(3)" class="foot_div3" v-if="groupstarttime">
              {{ groupskubutton }}
            </div>

            <div
              class="foot_div1"
              v-if="actionsdiv1 && !groupstarttime"
              @click="defineTow"
            >
              加入购物车
            </div>

            <div
              @click="define(2, townum)"
              class="foot_div3"
              v-if="BARGAINIRG && actionsdiv2"
            >
              <!-- 确定，开始砍价 -->
              {{ BARGAINIRGbuttontext }}
            </div>

            <div
              @click="define(1)"
              class="foot_div2"
              v-if="actionsdiv2 && !BARGAINIRG && !groupstarttime"
            >
              立即购买
            </div>

            <div @click="defineThree" class="foot_div2" v-if="actionsdiv3">
              选择规格
            </div>
          </div>
        </template>
      </van-sku>

      <div class="shareshadow" v-show="shareshadow" @click="sharesclick()">
        <img src="@/assets/images/share.png" alt />
      </div>
    </div>

    <!-- 骨架屏 -->
    <div class="skeleton" v-show="loadingskeleton">
      <van-skeleton :row="1" class="banner" />
      <van-skeleton :row="1" class="main1" />
      <van-skeleton :row="1" class="main2" />
      <van-skeleton :row="3" class="main3" row-width="100" />

      <van-skeleton :row="3" class="main4" />
      <van-skeleton title avatar :row="3" />

      <van-skeleton :row="1" class="main4" />

      <van-skeleton :row="5" class="banner" />
    </div>
    <!-- <loading ref="load" v-if="loadingshow"></loading> -->
  </div>
</template>

<script>
import Vue from "vue";

import { ImagePreview } from "vant";
// 轮播图
import { Swipe, SwipeItem } from "vant";

//滚动导航
import { Tab, Tabs } from "vant";

// Rate 评分
import { Rate } from "vant";

// Popup 动作面板
import { Popup } from "vant";

// sku
import { Sku } from "vant";
Vue.use(Sku);

// Stepper 步进器
import { Stepper } from "vant";

//Toast提示
import { Toast } from "vant";

import { Skeleton } from "vant";

import { Checkbox, CheckboxGroup } from "vant";
import { CountDown } from "vant";

import {
  GetbusgoodsmodelAPI,
  CollectionAddAPI,
  DeleteByGoodsIdAPI,
  getlistAPI,
  DeleteByShopIdAPI,
  GetbusgoodsmodelRecAPI,
  GetUserCartCountAPI,
} from "@/api/MyApi";
import { AddToCartAPI } from "@/api/CartApi";
import { CollectCouponsAPI } from "@/api/coupons";
import { GetWeixinShareInfoAPI } from "@/api/other";
import { GetDefaultUserAddressAPI } from "@/api/index";
import { InsertActBargainAPI } from "@/api/activity";

import $ from "jquery";

const Base64 = require("js-base64").Base64;

import qs from "qs";

import wx from "weixin-js-sdk";

import loading from "@/components/loading";

import recommend from "@/components/recommend";

import group from "@/components/AllActivity/group";
import collocation from "@/components/AllActivity/collocation";

// 下拉处理
import { List } from "vant";

export default {
  data() {
    return {
      spshow: false,
      showPreview: false,
      titledata: "商品详情", //控制title的动态变量
      active: 0,
      specificationsList: [], //商品规格
      specificationsobj: {},
      shareshadow: false,
      ban: true, //判断出现阴影的时候控制页面不去滑动
      titlelist: ["商品", "评价", "详情"],
      shopbanner: [], //轮播图图片
      current: 0, //轮播图的指数计
      value: 3,
      old: true, //判断是否收藏的变量
      collectimg: require("@/assets/images/home/home_shopping_tab_icon2@2x.png"),
      collecttext: "收藏", //商品收藏文字
      shopcollectionshow: true, //店铺是否收藏
      evaluate: false, //评价弹框 显示隐藏的变量
      afterSale: false, //售后服务弹框 显示隐藏的变量
      preferential: false, //优惠弹框 显示隐藏的变量
      category: false, //分类弹框 显示隐藏的变量
      opacity: 0, //控制顶部的透明度
      goodDetailsData: {}, //商品详情data
      modelshop: {}, //店铺data
      collecactive: false, //收藏商品样式的控制变量
      storecollecttext: "收藏店铺", //收藏店铺的文字
      storeimg: true, //收藏店铺的图片 控制显示隐藏
      storecollectactive: false, //收藏店铺样式的控制变量
      evaluateData: [], //评价data
      loading: false,
      finished: false,
      evaluateDataTow: [],
      preferentialData: {}, //优惠券data
      classData: {
        //sku 弹框里面的所有值
        shopimg: "", //商品图片
        shopprice: 4910, //商品
        inventory: 10, //库存数量
        attribute: [
          //选择中的规格 属性
          {
            attributename: "Mate20极光色",
          },
          {
            attributename: "6G+128GB",
          },
        ],
        goodsPlist: [
          //所有的属性 和每个属性的值
        ],
        buynum: 2, //购买的数量
      },
      actionsdiv1: true,
      actionsdiv2: true,
      actionsdiv3: false, //搭配购买选择规格
      sKUList: [],
      // classlistData: {} //sku 分类的属性名称下面的属性值
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [],
        price: "0", // 默认价格（单位元）
        stock_num: 0, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        hide_stock: false, // 是否隐藏剩余库存
      },
      initialSku: {}, //默认选择规格
      goods: {
        // 商品标题
        title: "测试商品",
        // 默认商品 sku 缩略图
        picture:
          "https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg",
      },
      cartshow: true, //购物车按钮是否显示
      addlist: 0,
      stroln: "",
      vhtml: "", //富文本
      CartList: [], //没有登入时候的购物车数组
      loadingshow: true,
      selectedObj: {
        pageIndex: 0,
        pageSize: 3,
        ID: 0,
      },
      total: 0,
      cartNum: 0,
      fxshow: false,
      loadingskeleton: true,

      actTypeArr: [],
      GROUP: false, //是否有拼团活动
      BARGAINIRG: false, //是否有砍价活动
      DISCOUNT: false, //是否有限时活动
      FREEPOST: false, //是否有满减活动
      PREFERENTIAL: false, //是否有超值搭配

      groupdata: {}, //拼团活动全部内容
      groupdataTow: {}, //拼团活动部分内容
      groupdataThree: [],
      groupstarttime: false, //拼团活动是否开启
      groupText: "开始",
      grouptime: 30 * 60 * 60 * 1000,
      grouptimeTow: 30 * 60 * 60 * 1000,
      groupskubutton: "立即购买",
      isalone: 0, //是不是单独购买
      togroupNo: 0, //拼团的团号

      time: 30 * 60 * 60 * 1000, //砍价预热倒计时
      timeTow: 30 * 60 * 60 * 1000, //活动结束时间倒计时
      timeshow: false, //是否预热时间结束
      bargainirgData: {}, //砍价活动内容
      bargainirgDataTow: {},
      bargainirgDataThree: [], //是否正在参与砍价活动
      bargainirgText: "开始",
      quotanum: 0, //限制购买数量
      BARGAINIRGbuttontext: "确定购买",
      townum: 1, //判断砍价中  是否可以吗  //预热时间是否结束
      iskj: false, //是否在活动中

      Discounttime: 30 * 60 * 60 * 1000, //限时活动时间
      DiscounttimeTow: 30 * 60 * 60 * 1000,
      Discounttimeshow: true, //是否预热时间结束  true 预热时间没有结束
      DiscountText: "开始",
      DiscountData: {}, //限时秒杀内容
      DiscountDataTow: {},
      Discountstarttime: false, //限时秒杀是否开启

      FreepostData: {}, //满减包邮内容
      FreepostDataTow: {},
      FreepostText: "",

      selectskuobj: {}, //选中的sku弹框obj
    };
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Rate.name]: Rate,
    [Popup.name]: Popup,
    [Stepper.name]: Stepper,
    [Toast.name]: Toast,
    loading: loading,
    recommend: recommend,
    [List.name]: List,
    [Skeleton.name]: Skeleton,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [CountDown.name]: CountDown,
    group: group,
    collocation: collocation,
  },
  computed: {
    cartNumInfor: function () {
      return this.$store.getters.cartNumber;
    },
  },
  methods: {
    //去凑单
    jumpStoreProdList() {
      let shopidNew = this.modelshop.id;
      window.localStorage.setItem("ShopId", shopidNew);
      this.$router.push({
        path: "/GoodsDetails/StoreProdList",
        query: { ShopId: shopidNew, actId: this.FreepostDataTow.actId },
      });
    },
    preViewImg(imglist, index) {
      var arr = [];
      imglist.forEach((item) => {
        item = item + "?x-oss-process=style/89900";
        arr.push(item);
      });

      ImagePreview({
        images: arr,
        startPosition: index,
      });
    },
    SelectgroupNo(data) {
      this.togroupNo = data.actGroupId; //改变了父组件的值
      console.log(this.togroupNo, "this.togroupNo");
      this.tccategory(3, 2, 2);
    },
    // 去看看  查看自己的砍价活动
    jumpBargain() {
      this.$router.push({
        path: "/GoodsDetails/Bargain",
        query: { barginId: this.bargainirgDataThree[0].actBargainirgId },
      });
    },
    getSkuString(e) {
      if (e) {
        // console.log(e);
        let skuObjList = JSON.parse(e);
        let string = "";
        skuObjList.forEach((item) => {
          string += item.Key + "：" + item.Value;
        });
        return string;
      }
    },
    // 立即购买
    define(tznum, townum) {
      //townum是判断活动前是否点击购买
      console.log("立即购买立即购买立即购买");
      let event = this.$refs.getSku.getSkuData();
      // console.log(event, "eventevent");
      if (event.selectedSkuComb) {
        let id = event.selectedSkuComb.id;
        let num = event.selectedNum;
        if (tznum == 2) {
          //砍价
          if (townum == 1) {
            this.$router.push({
              path: "/GoodsDetails/OrderConfirmation",
              query: { id: id, num: num },
            });
            return;
          }
          let data = qs.stringify({
            actId: this.bargainirgDataTow.actId,
            skuId: id,
          });
          InsertActBargainAPI(data, "post").then((res) => {
            if (res.code == 0) {
              this.$router.push({
                path: "/GoodsDetails/Bargain",
                query: { barginId: res.errorData.barginId },
              });
            } else {
              this.$router.push({
                path: "/GoodsDetails/Bargain",
                query: { barginId: res.data.barginId },
              });

              var obj = {
                barginId: res.data.barginId,
                actId: this.bargainirgDataTow.actId,
              };
              localStorage.setItem("Bargainobj", JSON.stringify(obj));
            }
          });
        } else if (tznum == 3) {
          //拼团
          this.$router.push({
            path: "/GoodsDetails/OrderConfirmation",
            query: { id: id, num: num },
          });
          window.localStorage.setItem("isalone", this.isalone);
        } else {
          if (this.DiscountDataTow.limitBuyNum == 0) {
            Toast("已经超出限购数量，不可再购买");
            return false;
          }

          this.$router.push({
            path: "/GoodsDetails/OrderConfirmation",
            query: { id: id, num: num },
          });
        }
      } else {
        Toast("请选择规格");
      }
    },

    // 选择规格
    defineThree() {
      let event = this.$refs.getSku.getSkuData();
      if (event.selectedSkuComb) {
        let skuid = event.selectedSkuComb.id;
        let num = event.selectedNum;
        console.log(skuid, "skuidskuidskuid");
        console.log(this.sku.list, "skulist");

        this.selectskuobj = this.sku.list.filter((item) => item.id == skuid);
        this.selectskuobj[0].selectnum = num;

        console.log(this.selectskuobj, "选中的sku obj");
        this.spshow = false;
      } else {
        Toast("请选择规格");
      }
    },
    // 加入购物车
    defineTow() {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        console.log(this.$refs.getSku.getSkuData(), "22222222222");
        let event = this.$refs.getSku.getSkuData();
        if (event.selectedSkuComb) {
          let data = {
            skuID: event.selectedSkuComb.id,
            num: event.selectedNum,
          };
          AddToCartAPI(data, "post").then((res) => {
            console.log(res);
            Toast({
              duration: 1000, // 持续展示 toast
              position: "bottom",
              className: "GoodDetailTost",
              forbidClick: false, //显示弹窗之后是否能够点击背景 可以
              message: "成功加入购物车",
            });
            this.GetUserCartCountData();
            this.spshow = false;
            // this.GetbusgoodsmodelData(this.$route.query.ID);
          });
          console.log(event);
        } else {
          Toast("请选择规格");
        }
      } else {
        console.log("现在没有登入，加入购物车");
        let event = this.$refs.getSku.getSkuData();
        if (event.selectedSkuComb) {
          let objcart = {
            GoodsId: this.$route.query.ID,
            SkuId: event.selectedSkuComb.id,
            Qty: event.selectedNum,
          };
          if (window.localStorage.getItem("CartList")) {
            console.log(
              JSON.parse(window.localStorage.getItem("CartList")),
              "JSON.parse(window.localStorage.getItem('CartList'))"
            );

            console.log(objcart, "objcartobjcartobjcart");

            let CartList = JSON.parse(window.localStorage.getItem("CartList"));

            let index = CartList.findIndex(
              (item) =>
                item.GoodsId == objcart.GoodsId && item.SkuId == objcart.SkuId
            );

            if (index === -1) {
              CartList.push(objcart);
            } else {
              CartList[index].Qty += 1;
            }
            window.localStorage.setItem("CartList", JSON.stringify(CartList));

            console.log(CartList.length, "CartList.length");
            this.$store.dispatch("setCartNumber", CartList.length);
            // console.log(
            //   JSON.parse(window.localStorage.getItem("CartList")),
            //   "JSON.parse(window.localStorage.getItem('CartList'))Tow"
            // );
          } else {
            this.CartList.push(objcart);
            window.localStorage.setItem(
              "CartList",
              JSON.stringify(this.CartList)
            );
            console.log(this.CartList.length, "this.CartList.length");
            this.$store.dispatch("setCartNumber", this.CartList.length);
          }
          Toast("成功加入购物车");
        } else {
          Toast("请选择规格");
        }
        // this.$router.push({
        //   path: "/My/Login/LoginRegistered"
        // });
      }
    },
    onChange(index) {
      this.current = index;
    },
    // 点击收藏商品
    collectswitch(id) {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        if (this.old == true) {
          this.CollectionAddData(id, 1);
          this.collectimg = require("@/assets/images/home/home_shopping_tab_icon2_hove@2x.png");
          this.collecttext = "已收藏";
          this.old = false;
          this.collecactive = true;
          Toast("亲，您已经收藏成功");
        } else {
          this.CancelCollection(id);
          this.collectimg = require("@/assets/images/home/home_shopping_tab_icon2@2x.png");
          this.collecttext = "收藏";
          this.old = true;
          this.collecactive = false;
          Toast("亲，您已经取消收藏");
        }
      } else {
        this.$router.push({
          path: "/My/Login/LoginRegistered",
        });
      }
    },
    getAddressList() {
      //获取用户所有地址
      let data = {
        pInd: 1,
        pSize: 8,
        keyWord: "",
      };
      getlistAPI(data, "get").then((res) => {
        console.log(res.data.rows.length, "获取用户所有地址");
        if (res.data.rows.length == 0) {
          this.addlist = 0;
        } else {
          this.addlist = res.data.rows.length;
        }

        // if (this.addlist == 0) {
        //     this.$router.push({
        //       path: "/My/UsedAddress/AddAddress"
        //     });
        //   } else {
        //     this.$router.push({
        //       path: "/GoodsDetails/OrderConfirmation",
        //       query: { id: id, num: num }
        //     });
        //   }
      });
    },
    onAddCartClicked() {},
    //点击显示评价弹框
    tcevaluate() {
      this.loading = false;
      this.finished = false;
      this.selectedObj.pageIndex = 0;
      this.evaluateData = [];

      this.GetbusgoodsmodelRecdata(); //获取评价

      this.evaluate = true;
    },
    //点击隐藏评价弹框
    gbevaluate() {
      this.evaluate = false;
    },
    GetbusgoodsmodelRecdata() {
      this.selectedObj.pageIndex++;
      GetbusgoodsmodelRecAPI(this.selectedObj, "get")
        .then((res) => {
          console.log(res, "获取评价信息");
          this.total = res.data.total;
          this.evaluateData.push(...res.data.rows);
        })
        .then((res) => {
          // 加载状态结束
          this.loading = false;
          if (this.evaluateData.length === this.total) {
            this.finished = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.GetbusgoodsmodelRecdata();
    },
    //点击显示售后弹框
    tcafterSale() {
      this.afterSale = true;
    },
    //点击隐藏售后弹框
    gbafterSale() {
      this.afterSale = false;
    },
    //点击显示优惠弹框
    tcpreferential() {
      this.preferential = true;
    },
    //点击隐藏优惠弹框
    gbpreferential() {
      this.preferential = false;
    },
    // 点击显示sku 商品分类弹框
    tccategory(index, iskjhd, isgroupmain) {
      //index是判断怎么去展示sku iskjhd(砍价的时候是是否砍价中 拼团的时候是否是单独购买)  isgroupmain 是否是团主
      // console.log(index);
      if (index == 1) {
        //选择分类sku
        this.spshow = true;
        this.actionsdiv1 = true;
        this.actionsdiv2 = true;

        this.actionsdiv3 = false;
      } else if (index == 2) {
        //普通加入购物车
        console.log(this.$refs);
        this.spshow = true;
        this.actionsdiv1 = true;
        this.actionsdiv2 = false;

        // 是砍价要改变 加入购物车的的sku是原来的
        if (this.BARGAINIRG) {
          this.sku.list = this.goodDetailsData.skuList.map((item) => {
            return Object.assign(
              {},
              {
                id: item.id,
                shopId: item.shopId,
                categoryId: item.categoryId,
                skuNo: item.skuNo,
                barCode: item.barCode,
                goodsId: item.goodsId,
                imgId: item.imgId,
                skuName: item.skuName,
                price: item.price * 100, //价格
                vipPrice: item.vipPrice,
                stock_num: item.stockQty, //库存
                clickNum: item.clickNum,
                buyNum: item.buyNum,
                colorId: item.colorId,
                creatorDate: item.creatorDate,
                shopCode: item.shopCode,
                imageUrl: item.imageUrl,
                buyCnt: item.buyCnt,
                skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
              },
              ...(item.dataJson ? JSON.parse(item.dataJson) : "")
            );
          });
        }

        // 是限时秒杀要改变 单独购买的的sku是原来的价格库存
        if (!this.Discounttimeshow) {
          this.sku.list = this.goodDetailsData.skuList.map((item) => {
            return Object.assign(
              {},
              {
                id: item.id,
                shopId: item.shopId,
                categoryId: item.categoryId,
                skuNo: item.skuNo,
                barCode: item.barCode,
                goodsId: item.goodsId,
                imgId: item.imgId,
                skuName: item.skuName,
                price: item.actPrice * 100, //价格
                vipPrice: item.vipPrice,
                stock_num: item.stockQty, //库存
                clickNum: item.clickNum,
                buyNum: item.buyNum,
                colorId: item.colorId,
                creatorDate: item.creatorDate,
                shopCode: item.shopCode,
                imageUrl: item.imageUrl,
                buyCnt: item.buyCnt,
                skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
              },
              ...(item.dataJson ? JSON.parse(item.dataJson) : "")
            );
          });
        }
        this.actionsdiv3 = false;
      } else if (index == 3) {
        // console.log('111111111111111111111111111111111111111111111111')
        console.log(iskjhd, "iskjhdiskjhdiskjhd");
        //普通立即购买
        this.spshow = true;
        this.actionsdiv1 = false;
        this.actionsdiv2 = true;
        this.actionsdiv3 = false;
        window.localStorage.setItem("isgroupmain", 0);

        this.BARGAINIRGbuttontext = "确定购买";
        this.townum = 1;

        if (this.groupstarttime) {
          if (iskjhd == 1) {
            //单独购买
            this.groupskubutton = "立即购买";
            this.isalone = 1;
            window.localStorage.setItem("isgroupmain", 0);
            this.sku.list = this.goodDetailsData.skuList.map((item) => {
              return Object.assign(
                {},
                {
                  id: item.id,
                  shopId: item.shopId,
                  categoryId: item.categoryId,
                  skuNo: item.skuNo,
                  barCode: item.barCode,
                  goodsId: item.goodsId,
                  imgId: item.imgId,
                  skuName: item.skuName,
                  price: item.price * 100, //价格
                  vipPrice: item.vipPrice,
                  stock_num: item.stockQty, //库存
                  clickNum: item.clickNum,
                  buyNum: item.buyNum,
                  colorId: item.colorId,
                  creatorDate: item.creatorDate,
                  shopCode: item.shopCode,
                  imageUrl: item.imageUrl,
                  buyCnt: item.buyCnt,
                  skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
                },
                ...(item.dataJson ? JSON.parse(item.dataJson) : "")
              );
            });
          } else if (iskjhd == 2) {
            console.log("活动价格 sku");
            //发起拼团
            this.isalone = 0;
            // 库存变成活动数量  价格变成活动价格
            this.sku.list = this.goodDetailsData.skuList.map((item) => {
              return Object.assign(
                {},
                {
                  id: item.id,
                  shopId: item.shopId,
                  categoryId: item.categoryId,
                  skuNo: item.skuNo,
                  barCode: item.barCode,
                  goodsId: item.goodsId,
                  imgId: item.imgId,
                  skuName: item.skuName,
                  price: item.actPrice * 100, //价格
                  vipPrice: item.vipPrice,
                  stock_num: item.actNum, //库存
                  clickNum: item.clickNum,
                  buyNum: item.buyNum,
                  colorId: item.colorId,
                  creatorDate: item.creatorDate,
                  shopCode: item.shopCode,
                  imageUrl: item.imageUrl,
                  buyCnt: item.buyCnt,
                  skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
                },
                ...(item.dataJson ? JSON.parse(item.dataJson) : "")
              );
            });

            if (isgroupmain == 2) {
              window.localStorage.setItem("isgroupmain", this.togroupNo);
              this.groupskubutton = "参与拼团";
            } else {
              window.localStorage.setItem("isgroupmain", 0);
              this.groupskubutton = "发起拼团";
            }
          }
        }

        // 是限时秒杀要改变 单独购买的的sku是原来的价格库存
        if (!this.Discounttimeshow) {
          this.sku.list = this.goodDetailsData.skuList.map((item) => {
            return Object.assign(
              {},
              {
                id: item.id,
                shopId: item.shopId,
                categoryId: item.categoryId,
                skuNo: item.skuNo,
                barCode: item.barCode,
                goodsId: item.goodsId,
                imgId: item.imgId,
                skuName: item.skuName,
                price: item.actPrice * 100, //价格
                vipPrice: item.vipPrice,
                stock_num: item.stockQty, //库存
                clickNum: item.clickNum,
                buyNum: item.buyNum,
                colorId: item.colorId,
                creatorDate: item.creatorDate,
                shopCode: item.shopCode,
                imageUrl: item.imageUrl,
                buyCnt: item.buyCnt,
                skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
              },
              ...(item.dataJson ? JSON.parse(item.dataJson) : "")
            );
          });
        }
      } else if (index == 4) {
        //砍价买

        //  砍价的时候是库存数量是活动数量
        this.sku.list = this.goodDetailsData.skuList.map((item) => {
          return Object.assign(
            {},
            {
              id: item.id,
              shopId: item.shopId,
              categoryId: item.categoryId,
              skuNo: item.skuNo,
              barCode: item.barCode,
              goodsId: item.goodsId,
              imgId: item.imgId,
              skuName: item.skuName,
              price: item.price * 100, //价格
              vipPrice: item.vipPrice,
              stock_num: item.actNum, //库存
              clickNum: item.clickNum,
              buyNum: item.buyNum,
              colorId: item.colorId,
              creatorDate: item.creatorDate,
              shopCode: item.shopCode,
              imageUrl: item.imageUrl,
              buyCnt: item.buyCnt,
              skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
            },
            ...(item.dataJson ? JSON.parse(item.dataJson) : "")
          );
        });

        if (iskjhd == 2) {
          this.spshow = false;

          this.$router.push({
            path: "/GoodsDetails/Bargain",
            query: { barginId: this.bargainirgDataThree[0].actBargainirgId },
          });
        } else {
          this.spshow = true;
        }

        this.quotanum = 1;
        this.actionsdiv1 = false;
        this.actionsdiv2 = true;
        this.actionsdiv3 = false;
        this.BARGAINIRGbuttontext = "确定，开始砍价";
        this.townum = 2;
        window.localStorage.setItem("isgroupmain", 0);
      } else if (index == 5) {
        //搭配购买的一个判断  选择规格
        this.spshow = true;
        this.actionsdiv1 = false;
        this.actionsdiv2 = false;

        this.actionsdiv3 = true;
      }
    },
    //gbcategory
    gbcategory() {
      this.category = false;
    },
    // 返回上一级
    fhgo() {
      this.$router.go(-1);
    },
    // 跳转去订单详情
    jumpOrderConfirmation() {
      this.$router.push({ path: "/GoodsDetails/OrderConfirmation" });
    },
    //进入店铺
    jumpStore() {
      // console.log(this.goodDetailsData.shopId)
      let shopidNew = this.modelshop.id;
      
      console.log(this.modelshop.shopType, "this.modelshop.shopType店铺类型");
      if (this.modelshop.shopType == 3) {
         this.$router.push({
          path: "/GoodsDetails/ProprietaryStore",
          query: { ShopId: shopidNew },
        });
      } else {
         this.$router.push({
          path: "/GoodsDetails/Store",
          query: { ShopId: shopidNew },
        });
      }
    },
    //跳转去购物车
    jumpshoppingCart() {
      this.$router.push({
        path: "/shoppingCart",
      });
    },
    //点击属性里面的属性值去高亮
    SelectAttribute(index, indextow, id, ID) {
      console.log(id, "每个规格里面列表的id", ID, "规格的id");

      let newTowarr = this.sKUList.filter((item) => {
        if (item.colorId === id) {
          return item;
        }
      });

      console.log(newTowarr, this.sKUList);

      console.log(res.data.price, "res.data.price");

      // if (this.classData.goodsPlist[index].activeName == indextow) {
      //   this.classData.goodsPlist[index].activeName = null;
      // } else {
      this.classData.goodsPlist[index].activeName = indextow;
      // }
    },
    handleScroll(e) {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop);
      if (scrollTop < 200) {
        $(".van-tabs__nav").css("display", "none");
        $(".title_left").css("display", "none");
        // 当滚动距离小于200时，计算导航透明度，可以考虑修改为每20增加0.1
        // this.opacity = (scrollTop / 200).toFixed(1);
        this.opacity = scrollTop / 100;
        if (this.opacity > 0.1) {
          $(".van-tabs__nav").css("display", "flex");
          $(".title_left").css("display", "flex");
        }
        if (this.opacity > 0.8) {
          this.opacity = 0.9;
        }
        return;
      } else {
        this.opacity = 0.9;
        $(".van-tabs__nav").css("display", "flex");
      }
    },
    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    },
    // 根据序号查询商品详情 异步
    GetbusgoodsmodelData(id) {
      let data = {
        ID: id,
      };
      GetbusgoodsmodelAPI(data, "get").then((res) => {
        console.log(res, "商品信息");

        //所有的商品详情信息
        this.goodDetailsData = res.data;
        this.goodDetailsData.tmpPrice = res.data.tmpPrice.toFixed(2);

        this.goodDetailsData.details = this.goodDetailsData.details;

        // 店铺的信息
        this.modelshop = res.data.modelshop;

        window.localStorage.setItem("goodid", this.goodDetailsData.id);

        this.shopbanner = res.data.mainImg.split(",");
        console.log(
          this.shopbanner,
          "this.shopbannerthis.shopbannerthis.shopbanner轮播图"
        );

        // 全部活动

        // 拼团  // 砍价
        this.actTypeArr = res.data.actTypeArr.split(",");

        this.actTypeArr.forEach((item, index) => {
          if (item == "TYPE_GROUP") {
            //拼团
            this.GROUP = true;
            this.groupdata = res.data.actList[0];
            console.log(this.groupdata, "拼团活动全部");
            this.groupdataTow = this.groupdata.grouplist;
            console.log(this.groupdataTow, "拼团活动部分");

            this.groupdataThree = this.groupdataTow.buyList;

            var obj = new Date();
            var eTime = new Date(
              this.groupdata.startTime.replace(new RegExp("-", "gm"), "/")
            );
            this.grouptime = eTime - obj;
            if (this.grouptime <= 0) {
              //拼团活动开启
              this.groupstarttime = true;

              this.groupText = "结束";
              var objTow = new Date();
              var eTimeTow = new Date(
                this.groupdata.endTime.replace(new RegExp("-", "gm"), "/")
              );
              this.grouptimeTow = eTimeTow - objTow;
            } else {
              this.groupstarttime = false;
            }
          } else if (item == "TYPE_BARGAINIRG") {
            //砍价
            this.BARGAINIRG = true;
            this.bargainirgData = res.data.actList[0];

            this.bargainirgDataTow = this.bargainirgData.bargain;
            console.log(this.bargainirgData, "砍价");
            console.log(this.bargainirgDataTow, "砍价Tow");

            this.bargainirgDataThree = this.bargainirgData.bargainList;
            console.log(
              this.bargainirgDataThree,
              "判断是否正在参与砍价活动的数组"
            );

            if (this.bargainirgDataThree.length) {
              this.iskj = true;
            }

            var obj = new Date();
            var eTime = new Date(
              this.bargainirgData.startTime.replace(new RegExp("-", "gm"), "/")
            );

            this.time = eTime - obj;
            console.log(this.time, "this.time");

            if (this.time <= 0) {
              //开始活动倒计时
              this.bargainirgText = "结束";
              var objTow = new Date();
              var eTimeTow = new Date(
                this.bargainirgData.endTime.replace(new RegExp("-", "gm"), "/")
              );
              // var eTimeTow = new Date("2020-09-26 17:42:00");
              this.timeTow = eTimeTow - objTow;

              this.timeshow = false; //是否预热时间结束  没有结束
              if (this.timeTow <= 0) {
                this.timeshow = true; //是否预热时间结束  没有结束
              } else {
              }
            } else {
              this.timeshow = true; //是否预热时间结束  没有结束
            }
          } else if (item == "TYPE_DISCOUNT") {
            //限时秒杀
            this.DISCOUNT = true;
            this.DiscountData = res.data.actList[index];
            this.DiscountDataTow = this.DiscountData.disCountList[0];
            console.log(this.DiscountDataTow, "限时秒杀活动");

            var obj = new Date();
            var eTime = new Date(
              this.DiscountData.startTime.replace(new RegExp("-", "gm"), "/")
            );
            this.Discounttime = eTime - obj;

            if (this.Discounttime <= 0) {
              this.DiscountText = "结束";
              var objTow = new Date();
              var eTimeTow = new Date(
                this.DiscountData.endTime.replace(new RegExp("-", "gm"), "/")
              );
              this.DiscounttimeTow = eTimeTow - objTow;
              this.Discounttimeshow = false; //是否预热时间结束  没有结束

              this.quotanum = this.DiscountDataTow.limitBuyNum; //当前限时秒杀活动限制的数量
            } else {
              this.Discounttimeshow = true; //是否预热时间结束  没有结束
            }
          } else if (item == "TYPE_FREEPOST") {
            //满减包邮
            this.FREEPOST = true;
            this.FreepostData = res.data.actList[index];
            this.FreepostDataTow = this.FreepostData.freepostList;
            console.log(this.FreepostDataTow, "满减包邮活动");

            if (this.FreepostDataTow.freeType == 1) {
              //判断：1是包邮2是满减
              this.FreepostText = "满" + this.FreepostDataTow.buyPrice + "包邮";
            } else {
              this.FreepostText =
                "满" +
                this.FreepostDataTow.buyPrice +
                "-" +
                this.FreepostDataTow.discountsPrice;
            }
          } else if (item == "TYPE_PREFERENTIAL") {
            //超值搭配
            this.PREFERENTIAL = true;
          } else {
            this.BARGAINIRG = false;
            this.DISCOUNT = false;
          }
        });
        console.log(this.GROUP, "this.GROUP");

        // 默认价格和原价格
        this.sku.price = res.data.price;
        this.sku.stock_num = res.data.stockQty;
        this.goods.picture = res.data.baseImg + "?x-oss-process=style/b1";

        // 商品评价
        // this.evaluateData = res.data.reviewlist;
        this.selectedObj.ID = res.data.id;

        this.evaluateDataTow = res.data.reviewlist.slice(0, 1);

        // sku
        this.sku.tree = res.data.goodsPlist.map((item) => {
          return {
            id: item.id,
            categoryId: item.categoryId,
            k: item.propName, //规格名称
            sortIndex: item.sortIndex,
            groupName: item.groupName,
            creatorDate: item.creatorDate,
            k_s: item.tableName, //规格标识
            v: item.optlist
              ? item.optlist.map((i) => {
                  return {
                    id: i.id,
                    shopId: i.shopId,
                    propertyId: i.propertyId,
                    name: i.optName,
                    sortIndex: i.sortIndex,
                    creatorDate: i.creatorDate,
                    skuId: i.skuId,
                  };
                })
              : "",
          };
        });

        let arr = [];
        arr = res.data.colorlist.map((item) => {
          return Object.assign({}, item, {
            name: item.colorName,
            imgUrl: item.imgStr ? item.imgStr + "?x-oss-process=style/b1" : "",
            previewImgUrl: item.previewImgUrl
              ? item.previewImgUrl + "?x-oss-process=style/b1"
              : "",
          });
        });

        let oln = res.data.colorlist[0].tableName;

        this.sku.tree.unshift({
          k: "颜色分类",
          id: 0,
          activeName: 0,
          v: arr,
          k_s: oln,
        });

        this.specificationsList = []; //置空数组  查询调用接口的时候
        this.sku.tree.forEach((item) => {
          // console.log(item.k);
          this.specificationsList.push(item.k);
        });
        console.log(this.specificationsList, "this.specificationsList规格");

        // this.specificationsobj=this.specificationsList.join(' ');
        // console.log(this.specificationsobj, "this.specificationsobj");

        // sKUList
        this.sku.list = res.data.skuList.map((item) => {
          return Object.assign(
            {},
            {
              id: item.id,
              shopId: item.shopId,
              categoryId: item.categoryId,
              skuNo: item.skuNo,
              barCode: item.barCode,
              goodsId: item.goodsId,
              imgId: item.imgId,
              skuName: item.skuName,
              price: item.price * 100, //价格
              vipPrice: item.vipPrice,
              stock_num: item.stockQty, //库存
              clickNum: item.clickNum,
              buyNum: item.buyNum,
              colorId: item.colorId,
              creatorDate: item.creatorDate,
              shopCode: item.shopCode,
              imageUrl: item.imageUrl,
              buyCnt: item.buyCnt,
              skuStr: item.skuStr ? JSON.parse(item.skuStr) : "",
            },
            ...(item.dataJson ? JSON.parse(item.dataJson) : "")
          );
        });

        // console.log(this.sku.list, "list");

        // 默认选择的规格
        this.initialSku = this.sku.list[0];
        console.log(this.initialSku, "默认选择的规格");
        // console.log(this.classData.goodsPlist, "this.classData.goodsPlist");

        // 商品是否收藏
        if (this.goodDetailsData.isCollection == true) {
          this.collectimg = require("@/assets/images/home/home_shopping_tab_icon2_hove@2x.png");
          this.collecttext = "已收藏";
          this.collecactive = true;
          this.old = false;
        } else {
          this.collectimg = require("@/assets/images/home/home_shopping_tab_icon2@2x.png");
          this.collecttext = "收藏";
          this.collecactive = false;
          this.old = true;
        }

        // 店铺是否收藏
        if (this.goodDetailsData.isCollectionShop == true) {
          this.storecollecttext = "已收藏";
          this.storeimg = false;
          this.storecollectactive = true;
          this.shopcollectionshow = false;
        } else {
          this.storecollecttext = "收藏店铺";
          this.storeimg = true;
          this.storecollectactive = false;
          this.shopcollectionshow = true;
        }

        // 优惠券
        if (res.data.couList.length > 0) {
          let newList = res.data.couList.map((item) => {
            return Object.assign({}, item, { receive: "点击领取" });
          });

          console.log(newList, "newList");

          newList.forEach((item) => {
            if (item.isGet == 1) {
              item.receive = "已领取";
            } else {
              item.receive = "点击领取";
            }
          });
          this.stroln = "";
          newList.forEach((item) => {
            this.stroln =
              this.stroln +
              "满" +
              item.quotaLimit +
              "减" +
              item.faceValue +
              " ";
          });
          console.log(this.stroln, "stroln");

          this.preferentialData = newList;
        }

        console.log(
          window.localStorage.getItem("isWeiXin"),
          "window.localStorage.getItem"
        );

        if (window.localStorage.getItem("isWeiXin") == "true") {
          this.sharesdk();
          this.fxshow = true;
        } else {
          console.log("不在微信环境");
          this.fxshow = false;
          // this.fxshow = true;
        }

        this.GetDefaultAdd();
        this.GetUserCartCountData();
      });
    },
    // 获取购物车的数量
    GetUserCartCountData() {
      if (!window.localStorage.getItem("Token")) {
        if (window.localStorage.getItem("CartList")) {
          var storageList = JSON.parse(window.localStorage.getItem("CartList"));
        } else {
          var storageList = [];
        }
        if (storageList.length == 0) {
          // this.loadingshow = false;
          this.loadingskeleton = false;
          return false;
        }
        this.$store.dispatch("setCartNumber", storageList.length);
        this.cartNum = storageList.length;
        // this.loadingshow = false;
        this.loadingskeleton = false;
      } else {
        GetUserCartCountAPI("get").then((res) => {
          console.log(res, "数量");
          this.$store.dispatch("setCartNumber", res.data.slist);
          this.cartNum = res.data.slist;
          // window.localStorage.setItem('cartnum',res.data.slist)
          // this.loadingshow = false;
          this.loadingskeleton = false;
        });
      }
    },
    //领取优惠券
    CollectCoupons(id, index) {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        let data = qs.stringify({
          CouponsId: id,
        });
        CollectCouponsAPI(data, "post")
          .then((res) => {
            console.log(res, "领取优惠券");
          })
          .then((res) => {
            this.preferentialData[index].receive = "已领取";
          });
      } else {
        this.$router.push({
          path: "/My/Login/LoginRegistered",
        });
      }
    },
    // 添加收藏记录
    CollectionAddData(id, FavType) {
      let data = {
        Id: id,
        FavType: FavType,
      };
      CollectionAddAPI(data, "post").then((res) => {
        console.log(res, "添加收藏记录");
      });
    },
    // 点击取消收藏商品
    CancelCollection(Id) {
      DeleteByGoodsIdAPI(Id, "delete").then((res) => {
        console.log(res, "删除收藏记录");
      });
    },
    // 点击收藏店铺
    storecollect(shopId) {
      let Token = window.localStorage.getItem("Token");
      if (Token) {
        console.log(this.shopcollectionshow);
        if (this.shopcollectionshow) {
          this.CollectionAddData(shopId, 2);
          this.storecollecttext = "已收藏";
          this.storeimg = false;
          this.storecollectactive = true;
          Toast("亲，您已经收藏该店铺");
          this.shopcollectionshow = false;
        } else {
          this.CancelCollectionshop(shopId);
          this.storecollecttext = "收藏店铺";
          this.storeimg = true;
          this.storecollectactive = false;
          Toast("亲，您已经取消收藏该店铺");
          this.shopcollectionshow = true;
        }
      } else {
        this.$router.push({
          path: "/My/Login/LoginRegistered",
        });
      }
    },
    // 删除收藏的店铺
    CancelCollectionshop(id) {
      DeleteByShopIdAPI(id, "delete").then((res) => {});
    },
    sharesdk() {
      console.log(window.localStorage.getItem("userId"));

      let userId = window.localStorage.getItem("userId");
      let goodimg = this.goods.picture;
      let goodname = this.goodDetailsData.goodsName;

      // console.log(this.goodDetailsData,"this.goodDetailsDatathis.goodDetailsData")
      let ID = this.goodDetailsData.id;
      // console.log(ID, "ID");

      console.log(`${window.location.href}`, "`${window.location.href}`");

      let link = `${window.location.href}` + "&userId=" + userId;

      console.log(link, "link");

      GetWeixinShareInfoAPI({ url: `${window.location.href}` }, "get").then(
        (res) => {
          console.log(res, "ressssssssssssssssss");
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"], // 必填，需要使用的JS接口列表
          });
          //通过error接口处理失败验证
          wx.error(function (res) {
            console.log(res, "通过error接口0000处理失败验证");
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          wx.ready(function () {
            // console.log(1111111)
            //需在用户可能点击分享按钮前就先调用

            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）最新接口
            wx.onMenuShareAppMessage({
              title: "兆客易购", // 分享标题
              desc: goodname,
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: goodimg, // 分享图标
              success: function () {
                // 设置成功
                console.log(res, "自定义“分享给朋友");
              },
            });
            wx.onMenuShareTimeline({
              title: "兆客易购", // 分享标题
              desc: goodname,
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: goodimg, // 分享图标
              success: function () {
                // 设置成功
                console.log(res, "自定义“分享给朋友圈");
              },
            });
          });
        }
      );
    },
    // 链接分享
    Linksshare() {
      this.shareshadow = true;
      this.ban = false;
    },
    sharesclick() {
      this.shareshadow = false;
      this.ban = true;
    },
    //获取默认地址
    GetDefaultAdd() {
      if (!window.localStorage.getItem("Token")) {
        return false;
      }
      GetDefaultUserAddressAPI("get").then((res) => {
        console.log(res, "获取默认地址");
        let applyGood = {
          consignee: res.data.consignee,
          consigneeMobile: res.data.consigneeMobile,
          province: res.data.province,
          city: res.data.city,
          userArea: res.data.userArea,
          consigneeAddress: res.data.consigneeAddress,
          id: res.data.id,
          provinceNo: res.data.provinceNo,
        };
        window.localStorage.setItem("applyParams", JSON.stringify(applyGood));
      });
    },
    GetUserId() {
      //获取用户id
      return decodeURI(
        window.location.href.replace(
          new RegExp(
            "^(?:.*[&\\?]" +
              encodeURI("userId").replace(/[\.\+\*]/g, "\\$&") +
              "(?:\\=([^&]*))?)?.*$",
            "i"
          ),
          "$1"
        )
      );
    },
    addPreZero(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },
    finish(index) {
      // Toast('倒计时结束');
      if (index == 1) {
        this.bargainirgText = "结束";
        var objTow = new Date();
        var eTimeTow = new Date(
          this.bargainirgData.endTime.replace(new RegExp("-", "gm"), "/")
        );
        // var eTimeTow = new Date("2020-09-26 17:50:00");

        this.timeTow = eTimeTow - objTow;
        this.timeshow = false; //是否预热时间结束  没有结束
        this.GetbusgoodsmodelData(this.$route.query.ID);
      } else {
        this.GetbusgoodsmodelData(this.$route.query.ID);
      }
    },
    // 限时秒杀
    finishTow(index) {
      // Toast('倒计时结束');
      if (index == 1) {
        this.DiscountText = "结束";
        var objTow = new Date();

        var eTimeTow = new Date(
          this.DiscountData.endTime.replace(new RegExp("-", "gm"), "/")
        );
        this.DiscounttimeTow = eTimeTow - objTow;
        this.Discounttimeshow = false; //是否预热时间结束  没有结束
        this.quotanum = this.DiscountDataTow.limitBuyNum; //当前限时秒杀活动限制的数量
        this.GetbusgoodsmodelData(this.$route.query.ID);
      } else {
        this.GetbusgoodsmodelData(this.$route.query.ID);
      }
    },
    // 拼团 倒计时
    finishThree(index) {
      if (index == 1) {
        this.groupText = "结束";
        var objTow = new Date();
        var eTimeTow = new Date(
          this.groupdata.endTime.replace(new RegExp("-", "gm"), "/")
        );
        this.grouptimeTow = eTimeTow - objTow;
        this.groupstarttime = true; //是否预热时间结束  没有结束
        this.GetbusgoodsmodelData(this.$route.query.ID);
      } else {
        this.GetbusgoodsmodelData(this.$route.query.ID);
      }
    },
  },
  watch: {},
  mounted() {
    document.title = this.titledata;

    this.GetbusgoodsmodelData(this.$route.query.ID);

    let inviterUserId = this.GetUserId();
    window.localStorage.setItem("inviterUserId", inviterUserId);

    window.scrollTo(0, 0);
    window.addEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="less" scoped>
.GoodsDetails {
  width: 100%;
  min-height: 100%;
  height: auto;
  background: #f5f6f7;
  .shop_banner {
    width: 100%;
    height: 750px;
    .van-swipe {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
      /deep/ .custom-indicator {
        padding: 2px 5px;
        position: absolute;
        width: 60px;
        height: 28px;
        background: @text-colorA;
        opacity: @opacityfive;
        border-radius: 18px;
        color: @text-white;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 32px;
        right: 24px;
        font-size: 20px;
      }
    }
  }

  // 限时抢购
  .flash {
    width: 100%;
    height: 120px;
    background: url("../../../assets/images/1.5_img/zhekou_img_bg.jpg")
      no-repeat;
    background-size: 100% 100%;
    color: #fff;
    display: flex;
    .left {
      width: 65%;
      display: flex;
      flex-direction: column;
      padding-left: 32px;
      justify-content: center;
      .d1 {
        display: flex;
        align-items: center;
        p {
          display: flex;
          font-weight: bold;
          .s1 {
            font-size: 24px;
          }
          .s2 {
            font-size: 48px;
          }
        }
        .s3 {
          font-size: 20px;
          border: 1px solid #fff;
          margin-left: 14px;
          padding: 3px 4px;
        }
      }
      .d2 {
        padding-top: 12px;
        font-size: 24px;
        opacity: 0.6;
      }
    }
    .right {
      width: 35%;
      // padding-right:32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .d1 {
        display: flex;
        align-items: center;
        .van-count-down {
          display: flex;
          align-items: center;
          .block {
            font-size: 30px;
            min-width: 42px;
            padding: 0 4px;
            height: 35px;
            background: #fdf6f1;
            border-radius: 4px;
            color: rgba(253, 116, 54, 1);
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .colon {
            font-style: normal;
            margin: 0 8px;
            color: #fff;
            font-size: 28px;
          }
        }
      }
      .d2 {
        font-size: 24px;
        opacity: 0.6;
        padding-top: 8px;
      }
    }
  }

  .shop_title {
    width: 100%;
    background: @text-white;
    border-radius: 0 0 16px 16px;
    .shop_title_d1 {
      padding: 24px 20px 0;
      // height: 100px;
      display: flex;
      align-items: center;
      position: relative;
      .pt_d3 {
        display: flex;
        align-items: baseline;
        .s1 {
          color: @main-color;
          font-size: 24px;
        }
        p {
          display: flex;
          align-items: center;
          .s2 {
            color: @main-color;
            font-size: 48px;
          }
          .s3 {
            color: @auxiliary-color;
            background: rgba(255, 137, 73, 0.2);
            font-size: 24px;
            margin-left: 18px;
            padding: 4px 8px;
            border-radius: 4px;
          }
        }
      }
      .d1 {
        flex: 1;
        .newprice {
          i {
            font-size: 36px;
            font-weight: normal;
            font-style: normal;
          }
          font-size: 48px;
          color: @main-color;
          font-weight: bold;
        }
        .oldprice {
          font-size: 24px;
          color: @text-colorC;
          padding-left: 12px;
          text-decoration: line-through;
        }
      }
      .d2 {
        display: flex;
        // flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f6f7f9;
        position: absolute;
        right: 0;
        padding: 4px 10px;
        border-radius: 24px 0 0 24px;
        img {
          width: 40px;
          height: 41px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-top: 2px;
        }
      }
    }
    .shop_title_d2 {
      padding: 24px 20px 30px;
      display: flex;
      // align-items: center;
      p {
        font-size: 32px;
        font-weight: bold;
        color: @text-colorA;
        line-height: 42px;
        padding: 0 20px 0 0px;
        flex: 1;
        // text-indent: 32px
      }
      .d2 {
        border-left: 1px solid rgba(177, 182, 195, 0.5);
        padding: 0 0 0 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        min-width: 10vw;
        justify-content: center;
        img {
          width: 40px;
          height: 41px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-top: 6px;
        }
      }
    }
    .shop_title_d3 {
      padding: 32px 20px 20px;
      ul {
        display: flex;
        font-size: 24px;
        color: @text-colorD;
        li {
          flex: 1;
          display: flex;
          align-items: center;
        }
        li:nth-child(1) {
          justify-content: flex-start;
        }
        li:nth-child(2) {
          justify-content: center;
        }
        li:nth-child(3) {
          justify-content: flex-end;
        }
      }
    }
  }

  // 邀请拼团
  .invitation_pt {
    padding: 0 20px 40px;
    .box {
      width: 98%;
      // height: 464px;
      background: rgba(255, 137, 73, 0.12);
      border: 2px solid rgba(255, 137, 73, 0.12);
      border-radius: 16px;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      .d1 {
        margin-top: 40px;
        font-size: 28px;
        .s1 {
          color: @text-colorA;
          font-weight: bold;
          i {
            font-style: normal;
            color: @main-color;
          }
        }
        .s2 {
          color: @text-colorC;
          margin-left: 26px;
        }
      }
      .d2 {
        display: flex;
        justify-content: space-between;
        margin: 50px 0 70px;
        .item {
          border: 1px dashed @main-color;
          border-radius: 50%;
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 80px;
          }
        }
        .item:nth-child(1) {
          position: relative;
          span {
            position: absolute;
            padding: 2px;
            background: @main-color;
            border-radius: 4px;
            opacity: 0.8;
            font-size: 18px;
            color: #f5f6f7;
            top: 0;
            right: -9px;
          }
        }
        .item:nth-child(2) {
          margin: 0 44px;
        }
      }
      .d3 {
        margin: 0 0 40px;
        display: flex;
        flex-direction: column;
        .b1 {
          width: 546px;
          height: 80px;
          background: linear-gradient(#e73a3a 0%, #f64242 100%);
          border-radius: 40px;
          box-shadow: 0px 4px 10px 0px rgba(244, 38, 54, 0.24);
          color: @text-white;
          font-size: 32px;
          outline: none;
          border: none;
        }
        .b2 {
          width: 546px;
          background: none;
          border-radius: 40px;
          color: @main-color;
          font-size: 32px;
          outline: none;
          border: none;
          margin-top: 40px;
        }
      }
    }
  }

  .shop_activity {
    width: 100%;
    // margin: 16px 0;
    border-top: 16px solid #f5f6f7;

    border-bottom: 16px solid #f5f6f7;
    background: #f5f6f7;
    .shop_activity_div {
      padding: 0 20px;
      height: 88px;
      display: flex;
      align-items: center;
      background: @text-white;
      border-radius: 16px;
      margin-top: 16px;
      .shop_activity_div_box {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 12px;
        height: 100%;
        .s1 {
          color: @text-colorA;
          font-size: 24px;
          font-weight: bold;
        }
        .d1_box {
          flex: 1;
          padding-left: 20px;
          .d1 {
            display: flex;
            // align-items: flex-start;
            align-items: center;
            .diyi {
              background: @main-color;
              border-radius: 4px;
              font-size: 22px;
              color: #fff;
              padding: 4px 4px;
            }
            .s3 {
              font-size: 24px;
              color: @text-colorB;
              padding-left: 16px;
              flex: 1;
              line-height: 30px;
              i {
                font-style: normal;
                padding-right: 6px;
              }
            }
          }
          .d2 {
            display: flex;
            align-items: center;
            margin-top: 12px;
            .diyi {
              background: @main-color;
              border-radius: 4px;
              font-size: 22px;
              color: #fff;
              padding: 4px 4px;
            }
            .dier {
              display: flex;
              font-size: 20px;
              border-radius: 4px;
              margin-right: 12px;
              color: @main-color;
              padding: 6px 12px;
              margin-left: 30px;
              background: url("../../../assets/images/1.5_img/quan@2x.png")
                no-repeat;
              background-size: 100% 100%;
            }
            .dis {
              color: @main-color;
              margin-left: 20px;
              font-size: 20px;
            }
          }
        }
        .s2 {
          padding-left: 20px;
          font-size: 24px;
          color: @text-colorB;
          height: 88px;
          line-height: 88px;
          width: 580px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          i {
            font-style: normal;
            padding-right: 6px;
          }
        }
      }
      img {
        width: 13px;
        height: 24px;
      }
    }
    .ht2 {
      border-radius: 16px 16px 0 0;
      height: auto;
      padding: 16px 20px;
      .shop_activity_div_box {
        align-items: flex-start;
      }
    }
    .ht3 {
      border-radius: 0 0 16px 16px;
      margin-top: 0;
    }
    .shop_activity_div_yunf {
      padding: 0 20px;
      height: 88px;
      display: flex;
      align-items: center;
      background: @text-white;
      border-radius: 16px;
      .d1 {
        flex: 1;
        display: flex;
        align-items: center;
        .s1 {
          color: @text-colorA;
          font-size: 24px;
          font-weight: bold;
        }
        .s2 {
          padding-left: 20px;
          font-size: 26px;
        }
        .s3 {
          font-size: 26px;
        }
        i {
          margin: 0 34px;
          width: 1px;
          height: 26px;
          background: @text-colorC;
          display: flex;
        }
      }
      .d2 {
        color: @text-colorC;
        font-size: 26px;
      }
    }
    // .shop_activity_div3 {
    //   // margin: 16px 0 0;
    // }
  }

  //评价
  .shop_evaluate {
    padding: 0 20px 24px;
    background: @text-white;
    border-radius: 16px;
    margin-bottom: 16px;
    // border-bottom: 16px solid #f5f6f7;
    .shop_evaluate_title {
      height: 92px;
      display: flex;
      align-items: center;
      .s1 {
        flex: 1;
        font-size: 24px;
        font-weight: bold;
        color: @text-colorA;
      }
      p {
        display: flex;
        align-items: center;
        span {
          color: @main-color;
          font-size: 24px;
          padding-right: 12px;
        }
        img {
          width: 13px;
          height: 24px;
        }
      }
    }
    .shop_evaluate_content {
      display: flex;
      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        flex: 1;
        padding-left: 20px;
        .d1 {
          // height: 64px;
          .p1 {
            display: flex;
            align-items: center;
            padding-top: 6px;
            span:nth-child(1) {
              font-size: 24px;
              color: @text-colorA;
              flex: 1;
              font-weight: bold;
            }
            span:nth-child(2) {
              display: flex;
              align-items: center;
              i {
                font-style: normal;
                font-size: 20px;
                color: @main2-color;
                padding-left: 12px;
              }
            }
          }
          .p2 {
            font-size: 20px;
            color: @text-colorD;
            padding-top: 14px;
            line-height: 30px;
            span:nth-child(2) {
              padding-left: 12px;
            }
          }
        }
        .d2 {
          padding: 20px 0 24px;
          p {
            font-size: 24px;
            font-weight: 400;
            line-height: 42px;
            color: @text-colorA;
          }
        }
        .d3 {
          display: flex;
          div {
            width: 180px;
            height: 180px;
            margin-left: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          div:nth-child(1) {
            margin-left: 0;
          }
        }
      }
    }
    .shop_evaluate_content_kong {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      color: @text-colorC;
      padding: 40px 0 80px 0;
    }
  }
  // 店铺
  .store {
    width: 100%;
    // position: relative;
    display: flex;
    border-radius: 16px;
    .store_banner {
      width: 100%;
      height: 242px;
      object-fit: cover;
    }
    .store_shadow {
      width: 100%;
      border-radius: 16px;
      // height: 242px;
      // background: rgba(0, 10, 38, 0.5);
      // position: absolute;
      // top: 0;
      background: #fff;
      .store_shadow_box {
        padding: 40px 20px 0;
        display: flex;
        //  margin-top: 40px;
        .d1 {
          display: flex;
          flex: 1;
          .left {
            width: 120px;
            height: 120px;
            border-radius: 16px;
            overflow: hidden;
            // margin-top: 40px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .right {
            // margin-top: 40px;
            flex: 1;
            padding: 12px 0 0 24px;
            .p1 {
              display: flex;
              align-items: flex-start;
              flex-direction: column;
              span:nth-child(1) {
                font-size: 28px;
                font-weight: bold;
                color: @text-colorA;
              }
              span:nth-child(2) {
                font-size: 20px;
                color: @text-white;
                background: @main-color;
                border-radius: 4px;
                padding: 4px 8px;
                margin-top: 12px;
              }
            }
            .p2 {
              display: flex;
              padding-top: 16px;
              span {
                color: @text-white;
                font-size: 20px;
                i {
                  font-size: 28px;
                  font-style: normal;
                }
              }
              span:nth-child(2) {
                padding-left: 16px;
              }
            }
            .p3 {
              display: flex;
              align-items: center;
              padding-top: 28px;
              span {
                background: @auxiliary-color;
                color: @text-white;
                display: flex;
                align-items: center;
                padding: 8px 24px;
                border-radius: 20px;
                img {
                  width: 24px;
                  height: 24px;
                  padding-top: 1px;
                }
                i {
                  font-style: normal;
                  font-size: 28px;
                  padding-left: 4px;
                }
              }
              .storecollectactive {
                // pointer-events: none;
                background: #4c5671 !important;
              }
              span:nth-child(1) {
                background: @auxiliary-color;
              }
              span:nth-child(2) {
                margin-left: 24px;
                background: @main-color;
              }
            }
          }
        }
        .d2 {
          padding-top: 12px;
          color: @text-colorB;
          font-size: 28px;
        }
      }
      .store_shadow_boxTow {
        padding: 30px 20px 40px;
        display: flex;
        div {
          flex: 1;
        }
        .d1 {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .s1 {
            font-size: 32px;
            color: @text-colorA;
          }
          .s2 {
            font-size: 24px;
            color: @text-colorC;
            padding-top: 22px;
          }
        }
        .d2 {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            // width: 34px;
            height: 30px;
          }
          span {
            font-size: 28px;
            color: @auxiliary-color;
            padding-left: 8px;
          }
        }
        i {
          width: 1px;
          height: 92px;
          background: rgba(177, 182, 195, 0.5);
        }
      }
    }
  }
  // 详情
  .shop_details_title {
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @base-color;
    i {
      background: @text-colorD;
      width: 48px;
      height: 1px;
    }
    span {
      color: @text-colorD;
      font-size: 20px;
      margin: 0 8px;
    }
  }
  .shop_details_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    img {
      width: 100%;
    }
  }
  .shop_details_foot {
    padding: 30px 20px 70px;
    color: @text-colorB;
    background: @base-color;
    .top {
      font-size: 32px;
      height: 80px;
      display: flex;
      align-items: center;
      font-weight: bold;
    }
    .bottom {
      font-size: 22px;
      p {
        padding-top: 12px;
        line-height: 30px;
        letter-spacing: 2px;
      }
    }
  }

  .title_left {
    width: 10%;
    height: 80px;
    background: @text-white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 14px;
    }
  }
  .title_right {
    width: 90%;
    height: 80px;
    background: @text-white;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99;
  }
  .van-tabs {
    // height: 80px;
    width: 100%;
    /deep/ .van-tabs__wrap {
      width: 100%;
      position: fixed;
      top: 0;
      z-index: 999;
      display: flex;
      justify-content: center;
      background: none;
      /deep/ .van-tabs__nav {
        height: 80px;
        width: 80%;
        background: none;
        // opacity: 0.9;
        padding: 0;
        display: none;
        .van-tab {
          padding: 0;
        }
      }
    }
    /deep/ .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: none;
    }
    // .van-tabs__content {
    //   .van-tab__pane {
    //     height: 2000px;
    //   }
    // }
  }
  /deep/ .van-tabs__content {
    padding-bottom: 110px;
    box-sizing: border-box;
    overflow: hidden;
  }
  /deep/ .van-tabs__wrap {
    height: 80px;
    .van-tabs__nav--line {
      width: 80%;
      background: none;
      .van-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        .van-tab__text {
          font-size: 28px;
        }
      }
      .van-tab--active {
        color: @main-color;
      }
      .van-tabs__line {
        display: none;
      }
    }
  }
  // /deep/ .van-tabs__content {
  //   padding-top: 80px;
  // }
  .failure_shop {
    width: 100%;
    height: 80px;
    background: @text-colorC;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @text-white;
    font-size: 28px;
    position: fixed;
    bottom: 110px;
  }

  // 是否在砍价中
  .bargainshow {
    width: 100%;
    height: 80px;
    background: rgba(244, 38, 54, 0.9);
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: @text-white;
    font-size: 28px;
    position: fixed;
    bottom: 110px;
    .s1 {
      margin-left: 30px;
      font-size: 28px;
    }
    .s2 {
      width: 112px;
      height: 38px;
      border: 1px solid #ffffff;
      border-radius: 19px;
      font-size: 28px;
      margin-right: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .GoodsDetails_foot {
    height: 110px;
    background: @text-white;
    width: 100%;
    position: fixed;
    bottom: 0;
    .GoodsDetails_foot_box {
      padding: 0 20px;
      height: 100%;
      display: flex;
      align-items: center;
      .baguette {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
        width: 60px;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 20px;
          color: @main-color;
          padding-top: 8px;
        }
      }
      .collect {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
        width: 100px;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-top: 8px;
        }
        .collecactive {
          color: @main-color;
        }
      }
      .cart {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100px;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 20px;
          color: @text-colorB;
          padding-top: 8px;
        }
        div {
          position: absolute;
          font-size: 20px;
          border-radius: 12px;
          background: @main-color;
          color: @text-white;
          width: 32px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 20px;
          right: 10px;
        }
      }
      .bu_one {
        display: flex;
        .button1 {
          font-size: 32px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-auxiliarybackground;
          border: none;
          color: @text-white;
          pointer-events: unset;
        }
        .button1active {
          font-size: 32px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-auxiliarybackground;
          border: none;
          color: @text-white;
          opacity: 0.5;
          pointer-events: none;
        }
        .button1:active {
          background: @button-auxiliarybackground-on;
        }
        .button2 {
          font-size: 32px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-mainbackground;
          border: none;
          color: @text-white;
          pointer-events: unset;
        }
        .button2active {
          font-size: 32px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-mainbackground;
          border: none;
          color: @text-white;
          opacity: 0.5;
          pointer-events: none;
        }
        .button2:active {
          background: @button-mainbackground-on;
        }
      }
      .bu_oneTow {
        display: flex;
        .button1 {
          font-size: 28px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-auxiliarybackground;
          border: none;
          color: @text-white;
          pointer-events: unset;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .s2 {
            padding-top: 6px;
          }
        }
        .button1active {
          font-size: 28px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-auxiliarybackground;
          border: none;
          color: @text-white;
          opacity: 0.5;
          pointer-events: none;
        }
        .button1:active {
          background: @button-auxiliarybackground-on;
        }
        .button2 {
          font-size: 28px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-mainbackground;
          border: none;
          color: @text-white;
          pointer-events: unset;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .s2 {
            padding-top: 6px;
          }
        }
        .button2active {
          font-size: 28px;
          width: 210px;
          height: 80px;
          margin-left: 16px;
          border-radius: 60px;
          background: @button-mainbackground;
          border: none;
          color: @text-white;
          opacity: 0.5;
          pointer-events: none;
        }
        .button2:active {
          background: @button-mainbackground-on;
        }
      }
    }
  }

  // 评价弹框
  /deep/ .van-overlay {
    background: @backgroundBopcityW;
  }
  .van-popup {
    height: 85% !important;
    border-radius: 40px 40px 0px 0px;
  }
  .evaluate_shadow {
    width: 100%;
    height: 100%;
    .evaluate_shadow_top {
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
    .evaluate_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      .shop_evaluate_content {
        display: flex;
        margin: 0 20px;
        border-bottom: 1px solid @base-color;
        padding: 20px 0 32px;
        .left {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          flex: 1;
          padding-left: 20px;
          .d1 {
            // height: 64px;
            .p1 {
              display: flex;
              align-items: center;
              span:nth-child(1) {
                font-size: 24px;
                color: @text-colorA;
                flex: 1;
                font-weight: bold;
                padding-top: 6px;
              }
              span:nth-child(2) {
                display: flex;
                align-items: center;
                i {
                  font-style: normal;
                  font-size: 20px;
                  color: @main2-color;
                  padding-left: 12px;
                }
              }
            }
            .p2 {
              font-size: 20px;
              color: @text-colorD;
              padding-top: 14px;
              line-height: 30px;
              // line-height: 24px;
              span:nth-child(2) {
                padding-left: 12px;
              }
            }
          }
          .d2 {
            padding: 20px 0 24px;
            p {
              font-size: 24px;
              font-weight: 400;
              line-height: 42px;
              color: @text-colorA;
              word-break: break-all;
            }
          }
          .d3 {
            display: flex;
            div {
              width: 180px;
              height: 180px;
              margin-left: 20px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            div:nth-child(1) {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  // 售后服务弹框
  .afterSale_shadow {
    width: 100%;
    height: 100%;
    .afterSale_shadow_top {
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
    .afterSale_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      .afterSale_shadow_content {
        margin: 0 20px;
        display: flex;
        border-bottom: 1px solid @base-color;
        padding: 48px 0;
        .afterSale_shadow_content_left {
          img {
            width: 36px;
            height: 36px;
          }
        }
        .afterSale_shadow_content_right {
          flex: 1;
          padding-left: 16px;
          p:nth-child(1) {
            font-size: 28px;
            font-weight: 500;
            color: @text-colorA;
            padding-top: 4px;
          }
          p:nth-child(2) {
            font-size: 24px;
            font-weight: 400;
            color: @text-colorC;
            padding-top: 16px;
            line-height: 30px;
          }
        }
      }
    }
  }
  // 优惠券弹框
  .preferential_shadow {
    width: 100%;
    height: 100%;
    .preferential_shadow_top {
      height: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      .p1 {
        display: flex;
        align-items: center;
        padding: 20px 0 16px;
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
      .p2 {
        color: @text-colorE;
        font-size: 20px;
        padding-left: 40px;
      }
    }
    .preferential_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      padding-bottom: 40px;
      .reduced_activity {
        width: 100%;
        padding: 0 0 40px;
        .top {
          width: 100%;
          text-align: center;
          padding: 40px 0 30px;
          // font-weight:bold;
          font-size: 32px;
        }
        .bottom {
          width: 100%;
          color: @main-color;
          font-size: 28px;
          text-align: center;
        }
      }
      .coupons_activity {
        width: 100%;
        .coupons_activity_top {
          width: 100%;
          padding: 20px 0;
          .p1 {
            font-size: 32px;
            color: @text-colorA;
            text-align: center;
            // font-weight:bold;
          }
          .p2 {
            color: #909bb8;
            font-size: 24px;
            padding-top: 18px;
            text-align: center;
          }
        }
      }
      .preferential_shadow_content {
        margin: 0 20px;
        height: 149px;
        background: url("../../../assets/images/home/bj.png");
        background-size: 100% 100%;
        display: flex;
        color: @main3-color;
        margin-top: 20px;
        .left {
          width: 70%;
          margin-left: 20px;
          .p1 {
            font-size: 36px;
            font-weight: bold;
            padding: 28px 0 12px;
          }
          .p2 {
            font-size: 18px;
            font-weight: 400;
          }
          .p3 {
            font-size: 18px;
            font-weight: 400;
            padding-top: 12px;
          }
        }
        .right {
          width: 30%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 28px;
        }
      }
    }
  }
  // 分类
  .category_shadow {
    width: 100%;
    height: 100%;
    .category_shadow_top {
      height: 218px;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      background: @text-white;
      z-index: 999;
      .category_shadow_box {
        margin: 0 20px 0;
        display: flex;
        position: relative;
        border-bottom: 1px solid @base-color;
        padding-top: 24px;
        padding-bottom: 32px;
        .left {
          width: 160px;
          height: 160px;
          border-radius: 16px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          height: 160px;
          flex: 1;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .price {
            font-size: 40px;
            color: @main-color;
            i {
              font-size: 24px;
              font-style: normal;
            }
          }
          .inventory_select {
            display: flex;
            flex-direction: column;
            font-size: 22px;
            color: @text-colorB;
            line-height: 30px;
            .select {
              span {
                padding-right: 6px;
              }
            }
          }
        }
        .dwclose {
          position: absolute;
          width: 24px;
          height: 24px;
          right: 20px;
          top: 24px;
        }
      }
    }
    .category_shadow_bottom {
      width: 100%;
      height: 100%;
      padding-top: 218px;
      padding-bottom: 100px;
      box-sizing: border-box;
      overflow-y: auto;
      // padding-bottom: 40px;
      .category_shadow_bottom_box {
        margin: 0 20px;
        padding-bottom: 12px;
        .category_shadow_bottom_item {
          display: flex;
          flex-direction: column;
          .top {
            font-size: 24px;
            color: @text-colorC;
            height: 88px;
            display: flex;
            align-items: center;
          }
          .bottom {
            width: 100%;
            ul {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              li {
                background: @base-color;
                padding: 4px 12px;
                border-radius: 16px;
                border: 2px solid @base-color;
                display: flex;
                align-items: center;
                margin-bottom: 24px;
                margin-right: 28px;
                min-height: 60px;
                min-width: 106px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: @text-colorA;
                img {
                  width: 58px;
                  height: 58px;
                  border-radius: 16px;
                  padding-right: 12px;
                }
                span {
                  font-size: 28px;
                }
              }
              .Selectactive {
                background: rgba(244, 38, 54, 0.1);
                border: 2px solid @main-color;
                color: @main-color;
              }
            }
          }
        }
        // 步进器
        // .category_num {
        //   margin: 0 20px;
        //   border-top: 1px solid @base-color;
        //   display: flex;
        //   height: 100px;
        //   display: flex;
        //   align-items: center;
        //   .s1 {
        //     flex: 1;
        //     font-size: 24px;
        //     color: @text-colorC;
        //   }
        //   .right {
        //     .van-stepper {
        //       // 左边按钮的大小
        //       /deep/ .van-stepper__minus {
        //         width: 48px;
        //         height: 48px;
        //         border-radius: 16px;
        //       }
        //       // 右边按钮的大小
        //       /deep/ .van-stepper__plus {
        //         width: 48px;
        //         height: 48px;
        //         border-radius: 16px;
        //         font-size: 32px;
        //       }
        //       // 左边文字的大小
        //       /deep/ .van-stepper__minus::before {
        //         width: 20px;
        //       }
        //       // 右边文字的大小
        //       /deep/ .van-stepper__plus::before {
        //         width: 20px;
        //       }
        //       /deep/ .van-stepper__plus::after {
        //         height: 20px;
        //       }
        //       // 中间文字的大小
        //       /deep/ .van-stepper__input {
        //         background: none;
        //         font-size: 32px;
        //         width: 60px;
        //       }
        //     }
        //   }
        // }
      }
    }

    .category_shadow_foot {
      height: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 0;
      background: @text-white;
      z-index: 999;
      .foot1 {
        margin: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 32px;
        font-weight: 500;
        color: @text-white;
        .b1 {
          width: 347px;
          height: 80px;
          border-radius: 40px;
          outline: none;
          border: none;
          background: @button-auxiliarybackground;
        }
        .b1:active {
          background: @button-auxiliarybackground-on;
        }
        .b2 {
          width: 347px;
          height: 80px;
          border-radius: 40px;
          outline: none;
          border: none;
          background: @button-mainbackground;
        }
        .b2:active {
          background: @button-mainbackground-on;
        }
      }
      .foot2 {
        margin: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 32px;
        font-weight: 500;
        color: @text-white;
        .b1 {
          width: 100%;
          height: 80px;
          border-radius: 40px;
          outline: none;
          border: none;
          background: @button-auxiliarybackground;
        }
        .b1:active {
          background: @button-auxiliarybackground-on;
        }
      }
      .foot3 {
        margin: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 32px;
        font-weight: 500;
        color: @text-white;
        .b2 {
          width: 100%;
          height: 80px;
          border-radius: 40px;
          outline: none;
          border: none;
          background: @button-mainbackground;
        }
        .b2:active {
          background: @button-mainbackground-on;
        }
      }
    }
  }
  // sku 头部deep/
  /deep/.van-sku-header {
    margin-left: 20px;
    .van-sku-header__img-wrap {
      width: 160px;
      height: 160px;
      border-radius: 16px;
      overflow: hidden;
      margin: 24px 0;
      img {
        width: 160px;
        height: 160px;
      }
    }
    .van-sku-header__goods-info {
      height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 24px 48px 0 16px;
      .van-sku__goods-price {
        color: @main-color;
        display: flex;
        align-items: baseline;
        margin-bottom: 28px;
        .van-sku__price-symbol {
          font-size: 24px;
        }
        .van-sku__price-num {
          font-size: 40px;
        }
      }
      .van-sku-header-item {
        font-size: 22px !important;
        color: @text-colorB !important;
        line-height: normal !important;
        margin-top: 0 !important;
        .van-sku__stock {
          color: @text-colorB !important;
          margin-right: 0 !important;
          font-size: 22px !important;
        }
      }
    }
  }
  /deep/ .van-sku-body {
    .van-sku-group-container {
      margin-left: 20px;
      padding: 32px 0;
      .van-sku-row {
        margin: 0 20px 20px 0;
        .van-sku-row__title {
          padding-bottom: 26px;
          font-size: 24px;
          color: @text-colorC;
        }
        .van-sku-row__item--active {
          border: 1px solid rgba(238, 10, 36, 0.3) !important;
          background: rgba(236, 10, 36, 0.01) !important;
        }
        .van-sku-row__item {
          margin: 0 34px 23px 0;
          background: #f5f7f7;
          border: 1px solid #f5f7f7;
          border-radius: 10px;
          .van-sku-row__item-img {
            width: 42px;
            height: 42px;
            margin: 12px;
          }
          .van-sku-row__item-name {
            font-size: 28px;
            line-height: initial;
            //  color:@text-colorA;
            padding: 10px 15px;
          }
        }
      }
    }
    .van-sku-stepper-stock {
      margin-left: 20px;
      padding: 12px 0;
      .van-sku-stepper-container {
        margin-right: 20px;
        display: flex;
        align-items: center;
        .van-sku__stepper-title {
          font-size: 24px;
          color: @text-colorC;
          flex: 1;
          line-height: inherit;
        }
        .van-sku__stepper {
          float: initial;
          // 左边按钮的大小
          .van-stepper__minus {
            width: 48px;
            height: 48px;
            border-radius: 16px;
          }
          // 右边按钮的大小
          .van-stepper__plus {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            font-size: 32px;
          }
          // 左边文字的大小
          .van-stepper__minus::before {
            width: 20px;
          }
          // 右边文字的大小
          .van-stepper__plus::before {
            width: 20px;
          }
          .van-stepper__plus::after {
            height: 20px;
          }
          // 中间文字的大小
          .van-stepper__input {
            background: none;
            font-size: 32px;
            width: 60px;
            height: auto;
          }
        }
      }
    }
  }
  /deep/ .van-sku-actions {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .foot_div1 {
      width: 750px;
      height: 80px;
      background: @button-auxiliarybackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;
    }
    .foot_div1:active {
      background: @button-auxiliarybackground-on;
    }
    .foot_div2 {
      width: 750px;
      height: 80px;
      background: @button-mainbackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;
    }
    .foot_div2:active {
      background: @button-mainbackground-on;
    }
    .foot_div3 {
      width: 750px;
      height: 80px;
      background: @button-mainbackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;
    }
    .foot_div3:active {
      background: @button-mainbackground-on;
    }

    .van-button--warning {
      width: 347px;
      height: 80px;
      background: @button-auxiliarybackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
    }
    .van-button--warning:active {
      background: @button-auxiliarybackground-on;
    }
    .van-button--danger {
      width: 347px;
      height: 80px;
      background: @button-mainbackground;
      border-radius: 40px;
      font-size: 32px;
      color: @text-white;
    }
    .van-button--danger:active {
      background: @button-mainbackground-on;
    }
  }
  /deep/ .van-popup__close-icon {
    font-size: 32px !important;
  }
  .shareshadow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    img {
      width: 60%;
      position: absolute;
      top: 10%;
      right: 10%;
    }
  }
}
.ban {
  overflow: inherit;
}
.noban {
  overflow: hidden;
}
/deep/ .van-toast {
  bottom: 10% !important;
  background: pink !important;
}
.skeleton {
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  z-index: 999;
  overflow-y: auto;
  .banner {
    .van-skeleton__row {
      width: 100% !important;
      height: 200px;
      margin: 30px 0;
    }
  }
  .main1 {
    .van-skeleton__row {
      width: 30% !important;
      height: 16px;
    }
  }
  .main2 {
    .van-skeleton__row {
      width: 80% !important;
      height: 16px;
      margin: 10px 0;
    }
  }
  .main3 {
    .van-skeleton__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .van-skeleton__row {
        margin: 0 !important;
      }
    }
  }
  .main4 {
    .van-skeleton__row {
      width: 100% !important;
      height: 30px;
      margin: 20px 0;
    }
  }
}
</style>