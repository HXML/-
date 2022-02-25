export function IsWeixinOrAlipay() {
    var ua = window.navigator.userAgent.toLowerCase();
    //判断是不是微信
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      console.log("微信");

      let isWeiXin=true
      window.localStorage.setItem("isWeiXin", true);
      window.localStorage.setItem("isAlipay", false);

      if (isWeiXin && !window.localStorage.getItem("openid")) {
        // alert(GetUserId("openid"))
        window.localStorage.setItem("openid",GetUserId("openid"));
      }
      return;
    }
    //判断是不是支付宝
    if (ua.match(/AlipayClient/i) == "alipayclient") {
      console.log("支付宝");
      window.localStorage.setItem("isAlipay", true);
      window.localStorage.setItem("isWeiXin", false);

      return;
    }
    //哪个都不是
    console.log("啥也不是");

    window.localStorage.setItem("isWeiXin", false);
    window.localStorage.setItem("isAlipay", false);
}

//截取openid
function GetUserId(name) {
    //获取用户id
    return decodeURI(
      window.location.href.replace(
        new RegExp(
          "^(?:.*[&\\?]" +
            encodeURI(name).replace(/[\.\+\*]/g, "\\$&") +
            "(?:\\=([^&]*))?)?.*$",
          "i"
        ),
        "$1"
      )
    );
}