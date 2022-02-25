import request from '@/common/js/request'

export function getSidAPI(type) { //获取SID
    return request({
        url: '/api/Authentication/getSid',
        method: type,
    })
}
export function getToken2API() { //续签
    return request({
        url: '/api/Authentication/getToken2',
        method: 'post',
    })
}


export function ShopOrderReviewAPI(params, type) { //评价API
    return request({
        url: '/Admin/ShopOrderReview/GetPage',
        method: type,
        params
    })
}

export function PutImageAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/comm/Com/PutImage/USER_HEAD',
        method: 'post',
        type,
        contentType,
        data
    })
}


// api/ShopMessage/PagerOrderMsg  弹出列表
// api/ShopMessage/GetOrderEntity   查看d订单消息详情  
// api/ShopMessage/GetMessageInfo  查看提醒消息详情
export function PagerOrderMsgAPI(params, type) { //弹出列表
    return request({
        url: '/api/ShopMessage/PagerOrderMsg',
        method: 'get',
        params
    })
}
export function GetOrderEntityAPI(params, type) { //查看d订单消息详情
    return request({
        url: '/api/ShopMessage/GetOrderEntity',
        method: 'get',
        params
    })
}
export function GetMessageInfoAPI(params, type) { //查看提醒消息详情
    return request({
        url: '/api/ShopMessage/GetMessageInfo',
        method: 'get',
        params
    })
}
export function GetReturnOrderEntityAPI(params, type) { //退款
    return request({
        url: '/api/ShopMessage/GetReturnOrderEntity',
        method: 'get',
        params
    })
}