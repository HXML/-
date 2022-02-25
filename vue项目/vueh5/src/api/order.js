import request from '@/common/js/request'


export function FinishShopOrderAsyncAPI(data, type) { //  个人中心>>异步获取订单列表信息>>订单详情  完成订单  确认收货
    return request({
        url: '/api/v1/PhoneBusOrder/FinishShopOrderAsync',
        method: type,
        data
    })
}

export function GetWuliuMsgAPI(params, type) {  //获取物流信息
    return request({
        url: '/api/v1/PhoneWuLiu/GetWuliuMsg',
        method: type,
        params
    })
}

