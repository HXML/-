import request from '@/common/js/request'


export function AccountRunListAPI(params, type) { //收入明细
    return request({
        url: '/api/ShopAccount/AccountRunList',
        method: type,
        params
    })
}
export function OrdertRunNoListAPI(params, type) { //订单收支明细
    return request({
        url: '/api/ShopAccount/OrdertRunNoList',
        method: type,
        params
    })
}
export function AccountRunNoListAPI(params, type) { //支出明细
    return request({
        url: '/api/ShopAccount/AccountRunNoList',
        method: type,
        params
    })
}

export function AccountListAPI(params, type) { //平台提现记录
    return request({
        url: '/api/ShopAccount/AccountList',
        method: type,
        params
    })
}

export function GetAAPI(type) { //平台提现记录
    return request({
        url: '/api/ShopAccount/GetA',
        method: type
    })
}

export function GetACCAPI(type) { //平台提现记录
    return request({
        url: '/api/ShopAccount/GetData',
        method: type
    })
}

export function ApplyMoneyAPI(params, type) { //平台提现记录
    return request({
        url: '/api/ShopAccount/ApplyMoney',
        method: type,
        params
    })
}