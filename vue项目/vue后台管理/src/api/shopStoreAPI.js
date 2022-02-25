import request from '@/common/js/request' //门店接口

export function GetPickupApplyPageAPI(params, type) { //查询门店申请分页
    return request({
        url: '/api/ShopPickupPoint/GetPickupApplyPage',
        params,
        method: type
    })
}
export function GetPickupApplyDetailAPI(params, type) { //查询门店申请详情
    return request({
        url: '/api/ShopPickupPoint/GetPickupApplyDetail',
        params,
        method: type
    })
}
export function PassPickupApplyAPI(params, type) { //审核通过门店申请
    return request({
        url: '/api/ShopPickupPoint/PassPickupApply',
        params,
        method: type
    })
}
export function GetPickupPointPageAPI(params, type) { //查询门店分页
    return request({
        url: '/api/ShopPickupPoint/GetPickupPointPage',
        params,
        method: type
    })
}
export function InsertPickupPointAPI(data, type) { //添加门店
    return request({
        url: '/api/ShopPickupPoint/InsertPickupPoint',
        data,
        method: type
    })
}
export function UpdatePickupPointAPI(data, type) { //修改门店
    return request({
        url: '/api/ShopPickupPoint/UpdatePickupPoint',
        data,
        method: type
    })
}
export function getUserAPI(params, type) { //获取
    return request({
        url: '/api/ShopPickupPoint/getUser',
        params,
        method: type
    })
}
export function FreezePickupPointAPI(params, type) { //冻结/恢复 门店  
    return request({
        url: '/api/ShopPickupPoint/FreezePickupPoint',
        params, //1是恢复，2是冻结
        method: type
    })
}
export function DelPickupPointAPI(params, type) { //删除门店
    return request({
        url: '/api/ShopPickupPoint/DelPickupPoint',
        params,
        method: type
    })
}
export function AuditPickupAccountCashAPI(params, type) { //审核/拒绝 提现申请
    return request({
        url: '/api/ShopPickupPoint/AuditPickupAccountCash',
        params,
        method: type
    })
}
export function SetShopCashTypeAPI(params, type) { //提现设置
    return request({
        url: '/api/ShopPickupPoint/SetShopCashType',
        params,
        method: type
    })
}
export function GetPickupRankingPageAPI(params, type) { //查询门店余额分页
    return request({
        url: '/api/ShopPickupPoint/GetPickupRankingPage',
        params,
        method: type
    })
}
export function GetShopPickupCashPageAPI(params, type) { //查询门店提现申请分页
    return request({
        url: '/api/ShopPickupPoint/GetShopPickupCashPage',
        params,
        method: type
    })
}
export function GetPickupSurveyPageAPI(params, type) { //查询门店概况分页
    return request({
        url: '/api/ShopPickupPoint/GetPickupSurveyPage',
        params,
        method: type
    })
}
export function GetPickupAccountDetailListAPI(params, type) { //查询门店账户提成明细
    return request({
        url: '/api/ShopPickupPoint/GetPickupAccountDetailList',
        params,
        method: type
    })
}
export function SetShopCategoryRateAPI(data, type) { //设置门店类目分成
    return request({
        url: '/api/ShopPickupPoint/SetShopCategoryRate',
        data,
        method: type
    })
}
export function GetPickupBalancePageAPI(params, type) { //查询门店余额分页
    return request({
        url: '/api/ShopPickupPoint/GetPickupBalancePage',
        params,
        method: type
    })
}
export function GetPickupPointDetailAPI(params, type) { //查询门店余额分页
    return request({
        url: '/api/ShopPickupPoint/GetPickupPointDetail',
        params,
        method: type
    })
}
export function GetShopCashTypeAPI(params, type) { //查询门店提现设置
    return request({
        url: '/api/ShopPickupPoint/GetShopCashType',
        params,
        method: type
    })
}
export function GetShopCashRateAPI(params, type) { //查询门店提现设置
    return request({
        url: '/api/ShopPickupPoint/GetShopCashRate',
        params,
        method: type
    })
}