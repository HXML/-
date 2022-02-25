import request from '@/common/js/request'
//订单管理模块



export function OPageApi(params, type) {
    return request({
        url: "api/ShopOrder/OPage",
        method: type,
        params
    })
}

export function OrderDetilAPI(params, type) { //订单详情
    return request({
        url: '/api/ShopOrder/OrderDetil',
        method: type,
        params
    })
}

export function BusExpListAPI(params, type) { //订单发货快递列表
    return request({
        url: '/api/ShopOrder/BusExpList',
        method: type,
        params
    })
}

export function OrderTransAPI(data, type, contentType) { //订单发货快递列表
    return request({
        url: '/api/ShopOrder/OrderTrans',
        method: type,
        contentType,
        data
    })
}


export function OrderConsigneeAPI(data, type, contentType) { //订单收货信息修改
    return request({
        url: '/api/ShopOrder/OrderConsignee',
        method: type,
        contentType,
        data
    })
}

export function BatchLiverTransAPI(data, type, contentType) { //订单发货快递列表
    return request({
        url: '/api/ShopOrder/BatchLiverTrans',
        method: type,
        contentType,
        data
    })
}


export function OrderBatchLiverListAPI(params, type) { //订单发货快递列表
    return request({
        url: '/api/ShopOrder/BatchLiverList',
        method: type,
        params
    })
}



export function RefundOperationOrderAPI(data, type, contentType) { //订单发货快递列表
    return request({
        url: '/api/GoodsReturn/RefundOperationOrder',
        method: type,
        contentType,
        data
    })
}

export function ShopRmkAPI(oId, params, type) { //添加商家备注
    return request({
        url: '/api/ShopOrder/ShopRmk/' + oId,
        method: type,
        params
    })
}