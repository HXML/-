import request from '@/common/js/request'



export function getWxPayDataAPI(data, type,openid) { // 微信支付
 

    return request({
        url: 'https://pay.zk-mall.net/Api/Pay/getWxPayData/'+openid,
        method: type,
        data
    })
}



export function GetPayInfoByOrderNoAPI(params, type) { // 获取支付信息
    return request({
        url: '/api/v1/PhoneBusOrder/GetPayInfoByOrderNo',
        method: type,
        params
    })
}



export function getAlPayPageAPI(data, type) { // 支付宝支付
    return request({
        url: 'https://pay.zk-mall.net/Api/Pay/getAlPayPage/',
        method: type,
        data
    })
}




export function GetAlPayisTrueAPI(params,type) { // 判断支付宝是否支付成功
    return request({
        url: '/api/v1/PhoneBusOrder/GetAlPayisTrue',
        method: type,
        params
    })
}



// 判断非微信支付是否成功
export function OrderIsPay(params,type) { // 判断支付宝是否支付成功
    return request({
        url: '/api/v1/PhoneBusOrder/OrderIsPay',
        method: type,
        params
    })
}