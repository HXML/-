import request from '@/common/js/request'
// 登入
export function GetUserMessageAPI(params, type) { //获取消息
    return request({
        url: '/api/v1/ZkHome/GetUserMessage',
        method: type,
        params
    })
}



export function GetShopBuyListAPI(params, type) { //根据SKU属性获取商品信息
    return request({
        url: '/api/v1/PhoneBusShoppingCart/GetShopBuyList',
        method: type,
        params
    })
}


export function GetGoodsBuyTmpAPI(data, type) { //根据订单 地址 获取运费
    return request({
        url: '/api/v1/PhoneBusShoppingCart/GetGoodsBuyTmp',
        method: type,
        data
    })
}



export function GetDefaultUserAddressAPI(data, type) { //根据SKU属性获取商品信息
    return request({
        url: '/api/PhoneUserAddress/GetDefaultUserAddress',
        method: type,
        data
    })
}




export function CreateShopOrderBYSkuAsyncAPI(params, type) { //根据SKUID 生成订单 商品直接购买
    return request({
        url: '/api/v1/PhoneBusOrder/CreateShopOrderBYSkuAsync',
        method: type,
        params
    })
}


export function GetHotSearchAPI(params, type) { //店铺热门搜索字段
    return request({
        url: '/api/v1/PhoneShopOther/GetHotSearch',
        method: type,
        params
    })
}




export function GetShopCartConfirmListAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/v1/PhoneBusShoppingCart/GetShopCartConfirmList',
        method: type,
        contentType,
        data
    })
}


export function OrderConfirmAPIAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/v1/PhoneBusShoppingCart/OrderConfirmAPI',
        method: type,
        contentType,
        data
    })
}


export function GetShopCartTmpAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/v1/PhoneBusShoppingCart/GetShopCartTmp',
        method: type,
        contentType,
        data
    })
}




export function CreateShopOrderAsyncSsmAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/v1/PhoneBusOrder/CreateShopOrderAsyncSsm',
        method: type,
        contentType,
        data
    })
}


export function PayShopOrderAsyncAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/v1/PhoneBusOrder/PayShopOrderAsync',
        method: type,
        contentType,
        data
    })
}



export function PlayStartAPI(data, type) { //开始抽奖
    return request({
        url: '/api/PhoneActivity/PlayStart',
        method: "post",
        data
    })
}
export function ShareNtableGameAPI(data, type) { //分享后获取次数
    return request({
        url: '/api/PhoneActivity/ShareNtableGame',
        method: "post",
        data
    })
}
export function ResidueJoinNumberAPI(data, type) { //获取剩余抽奖次数
    return request({
        url: '/api/PhoneActivity/ResidueJoinNumber',
        method: "get",
        data
    })
}
export function GetBigWhellListAPI(params, type) { //获取剩余抽奖次数
    return request({
        url: '/api/PhoneActivity/GetBigWhellList',
        method: type,
        params
    })
}
export function TakeBigWhellPrizaAPI(params, type) { //获取剩余抽奖次数
    return request({
        url: '/api/PhoneActivity/TakeBigWhellPriza',
        method: type,
        params
    })
}