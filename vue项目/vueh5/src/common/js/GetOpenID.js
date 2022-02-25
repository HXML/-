import $ from "jquery";

var WX_CODE = '';
var BASE_URL = 'http://dev-api.zk-mall.net/';
var WX_OPEN_ID = '';


//获取微信code
function getWXcode() {
    var appid = "wx6aa610d5ecc75560";
    var redirect_uri = BASE_URL + "/demo/pay.html";
    var redirect_uri = encodeURI(redirect_uri);

    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appid + "&redirect_uri=" + redirect_uri +
        "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";

    window.location = url;
}

// 获取微信openId
function getWXopenid() {
    $.ajax({
        url: BASE_URL + "/api/v1/PhoneUserOauth/GetUserOauthModel?Code=" + WX_CODE,
        type: "get",
        success: function(data) {
            // $("#wxOpenId").html(data.data);
            WX_OPEN_ID = data.data;
        }
    });
}
getWXcode();
getWXopenid();

alert(WX_OPEN_ID);


// window.localStorage.setItem(WX_OPEN_ID);




//获取微信支付用参数
// function getWx_PayData() {
//     var d = new Date();
//     var orderNo = "zk--" + d.getTime();
//     var url = BASE_URL + "/Api/Pay/getWxPayData?orderNo=" + orderNo + "?openId=" + WX_OPEN_ID;
//     alert("url: " + url);

//     $.ajax({

//         url: url,
//         contentType: "application/x-www-form-urlencoded",
//         type: "get",
//         headers: { "zk-agent": "ZK-DEMO,demo,paytest,1.0" },
//         success: function (data) {
//             $("#wxApiPara").html("获取支付参数成功！");
//             wx_PayData = JSON.parse(data.data);
//         }
//     });
// }