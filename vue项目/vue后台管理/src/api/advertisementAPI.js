import request from '@/common/js/request'

export async function AddAdOrderAPI(data, type) { //新建广告计划
    return request({
        url: '/api/ShopAd/AddAdOrder',
        method: type,
        data
    })
}
export function GetOrderPageAPI(params, type) { //获取广告订单分页
    return request({
        url: '/api/ShopAd/GetOrderPage',
        method: type,
        params
    })
}
export function AdPlanOprationAPI(params, type) { //广告推广状态操作
    return request({
        url: '/api/ShopAd/AdPlanOpration',
        method: type,
        params
    })
}
export function GetPlaceListAPI(params, type) { //获取广告位推广位置
    return request({
        url: '/api/ShopAd/GetPlaceList',
        method: type,
        params
    })
}
export function GetAdPlanDetailAPI(params, type) { //查询广告详情
    return request({
        url: '/api/ShopAd/GetAdPlanDetail',
        method: type,
        params
    })
}
export function EditAdOrderAPI(data, type) { //修改广告详情
    return request({
        url: '/api/ShopAd/EditAdOrder',
        method: type,
        data
    })
}
export function GetAdBiToAdPlanByDayAPI(params, type) { //查询推广报表，按小时分组，查询不同推广计划的数据
    return request({
        url: '/api/ShopAd/GetAdBiToAdPlanByDay',
        method: type,
        params
    })
}
export function GetAdBiBetweenByTimeAPI(params, type) { //查询两个时间段内的推广的报表数据
    return request({
        url: '/api/ShopAd/GetAdBiBetweenByTime',
        method: type,
        params
    })
}
export function GetAdBiByNearlySevenDayAPI(params, type) { //查询店铺近7天的bi数据
    return request({
        url: '/api/ShopAd/GetAdBiByNearlySevenDay',
        method: type,
        params
    })
}
export function GetAdBiContrastByTimeAPI(params, type) { //查询店铺近7天的bi数据
    return request({
        url: '/api/ShopAd/GetAdBiContrastByTime',
        method: type,
        params
    })
}
export async function getWxPayDataAPI(data, type) { //获取微信支付信息
    return request({
        url: 'https://pay.zk-mall.net/Api/Pay/getWxPayData/oepnid',
        method: type,
        data
    })
}
export async function getAlPayPageAPI(data, type) { //获取支付宝页面
    return request({
        url: 'https://pay.zk-mall.net/Api/Pay/getAlPayPage',
        method: type,
        data
    })
}
export async function OrderIsPayAPI(params, type) { //是否支付该订单
    return request({
        url: '/api/v1/PhoneBusOrder/OrderIsPay',
        method: type,
        params
    })
}
export async function CreatePayDataAPI(data, type) { //是否支付该订单
    return request({
        url: '/api/ShopAd/CreatePayData',
        method: type,
        data
    })
}