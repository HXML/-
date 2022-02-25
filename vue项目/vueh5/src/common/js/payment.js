import {
  Toast
} from "vant";
import {
  GetPayInfoByOrderNoAPI,
  getWxPayDataAPI,
  getAlPayPageAPI
} from "@/api/pay";
import qs from "qs";


import router from '@/router/index.js'


// 微信支付
export function etWx_PayData(orderNo) {
  return new Promise((resolve, reject) => {
    console.log(orderNo, "订单号")
    let datanew = {
      OrderNO: orderNo
    };
    GetPayInfoByOrderNoAPI(datanew, "get").then(res => {
      console.log(res, "获取支付信息");

      if (res.code == 0) {
        Toast(res.msg);
        return false;
      }

      console.log(localStorage.getItem("openid"), "localStorage.getItem");
      let openid = localStorage.getItem("openid");

      var objBefor = {
        shopId: res.data.shopId,
        totalAmount: res.data.totalAmount.toFixed(2),
        orderNo: res.data.orderNo
      };
      console.log(objBefor, "objBefor")
      var checkedIdStr = JSON.stringify(objBefor);
      window.localStorage.setItem("payinformation", checkedIdStr);

      if (!openid) {
        // Toast("请在微信端完成支付!");
        // return;
        //不在微信环境
        console.log('现在是浏览器环境');
        let data = qs.stringify({
          orderNo: res.data.orderNo,
          tradeType: "MWEB", //特殊类型
          subject: res.data.subject,
          body: res.data.body,
          totalAmount: res.data.totalAmount.toFixed(2),
          ip: res.data.ip,
          userId: res.data.userId,
          shopId: res.data.shopId,
          sourceSys: res.data.sourceSys,
          sign: res.data.sign
        });
        getWxPayDataAPI(data, "post", 'openid').then(res => {
          console.log(res, "获取微信支付用参数");
          if (res.data == "EXPIRED") {
            Toast('您的订单已经失效')
          } else if (res.data == "TRADE_TYPE_ERROR") {
            Toast('支付订单与下单订单的环境不一致，请重新下单支付')
          } else {
            resolve(res.data)
            reject(res.data)
          }
        });
      } else {
        console.log('现在是微信环境')
        let data = qs.stringify({
          orderNo: res.data.orderNo,
          tradeType: "JSAPI", //特殊类型
          subject: res.data.subject,
          body: res.data.body,
          totalAmount: res.data.totalAmount.toFixed(2),
          ip: res.data.ip,
          userId: res.data.userId,
          shopId: res.data.shopId,
          sourceSys: res.data.sourceSys,
          tradeNo: res.data.tradeNo,
          sign: res.data.sign
        });
        getWxPayDataAPI(data, "post", openid).then(res => {
          console.log(res, "获取微信支付用参数");

          if (res.data == "EXPIRED") {
            Toast('您的订单已经失效')
          } else if (res.data == "TRADE_TYPE_ERROR") {
            Toast('支付订单与下单订单的环境不一致，请重新下单支付')
          } else {
            let wx_PayData = JSON.parse(res.data);
            console.log(wx_PayData, "wx_PayData")
            callpay(wx_PayData);
          }
        });
      }
    });
  })
}


// 支付宝支付
export function AlipayData(orderNo) {
  return new Promise((resolve, reject) => {
    console.log(orderNo, "订单号")

    window.localStorage.setItem("alorderNo", orderNo)

    let datanew = {
      OrderNO: orderNo
    };
    GetPayInfoByOrderNoAPI(datanew, "get").then(res => {
      console.log(res, "获取支付信息");

      if (process.env.VUE_APP_URL === 'https://t-api.zk-mall.net/') { // 如果是测试环境, 则生成控制台
        var dqurl = 'https://t-shop.zk-mall.net/#'
      } else {
        var dqurl = 'https://shop.zk-mall.net/#'
      }

      // var aaaaa=dqurl+'/GoodsDetails/pay'
      // console.log(aaaaa,"aaaaa");

      console.log(dqurl, "dqurl dqurl dqurl1")

      let data = qs.stringify({
        orderNo: res.data.orderNo,
        tradeType: '', //特殊类型
        subject: res.data.subject,
        body: res.data.body,
        totalAmount: res.data.totalAmount.toFixed(2),
        ip: res.data.ip,
        userId: res.data.userId,
        shopId: res.data.shopId,
        sourceSys: res.data.sourceSys,
        sign: res.data.sign,
        returnUrl: dqurl + '/GoodsDetails/pay'
      });
      getAlPayPageAPI(data, "post").then(res => {
        console.log(res, "获取zfb支付用参数")
        resolve(res.data)
        reject(res.data)
      })
    })
  });
}

//调用微信JS api 支付
function callpay(wx_PayData) {
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", jsApiCall(wx_PayData), false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", jsApiCall(wx_PayData));
      document.attachEvent("onWeixinJSBridgeReady", jsApiCall(wx_PayData));
    }
  } else {
    jsApiCall(wx_PayData);
  }
}
//调用微信JS api 支付
function jsApiCall(wx_PayData) {
  WeixinJSBridge.invoke("getBrandWCPayRequest", wx_PayData, function (res) {
    //WeixinJSBridge.log(res.err_msg);
    //alert(res.err_code + res.err_desc + res.err_msg);
    if (res.err_msg == "get_brand_wcpay_request:ok") {
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      // router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})
      // location.reload(); 
      router.replace({
        path: "/My/Myorder/paysuccess"
      })
      // router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})

      // window.location.href =
      //   link+"#/My/Myorder?orderstatus=2";
    } else {
      // alert(res.err_msg)
      // window.location.href =
      // link+"#/My/Myorder?orderstatus=1";
      router.replace({
        path: `/My/Myorder?orderstatus=1`,
      })
    }
  });
}



//微信外微信支付
export function callpayTow() {


  // router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})


  // if (typeof WeixinJSBridge == "undefined") {
  //   if (document.addEventListener) {
  //     document.addEventListener("WeixinJSBridgeReady", jsApiCallTow(), false);
  //   } else if (document.attachEvent) {
  //     document.attachEvent("WeixinJSBridgeReady", jsApiCallTow());
  //     document.attachEvent("onWeixinJSBridgeReady", jsApiCallTow());
  //   }
  // } else {
  //   jsApiCallTow();
  // }
}

function jsApiCallTow() {

  //WeixinJSBridge.log(res.err_msg);
  //alert(res.err_code + res.err_desc + res.err_msg);
  // console.log(1111)
  // router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})
  // location.reload();

  //   WeixinJSBridge.invoke("getBrandWCPayRequest", function(res) {
  //   if (res.err_msg == "get_brand_wcpay_request:ok") {
  //     console.log(2222)
  //     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
  //     console.log(num,"num")
  //     if(num==2){
  //       router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})
  //       location.reload();
  //     }else{
  //       router.replace({path: "/My/Myorder",query: { orderstatus: 2 }})
  //       // ocation.reload();
  //     }
  //     // window.location.href =
  //     //   link+"#/My/Myorder?orderstatus=2";
  //   } else {
  //     console.log(3333)
  //     // window.location.href =
  //     // link+"#/My/Myorder?orderstatus=1";
  //     router.replace({path: "/My/Myorder",query: { orderstatus: 1 }})
  //   }
  // });
}