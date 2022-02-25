import request from '@/common/js/request'

export function GetWeixinShareInfoAPI(params, type) { //获取微信分享信息
    return request({
        url: '/api/v1/PhoneUserOauth/GetWeixinShareInfo',
        method: type,
        params
    })
}



export function GetQrCodeAPI(params, type) { //获取邀请二维码
    return request({
        url: '/api/v1/PhoneUserOauth/GetQrCode',
        method: type,
        params
    })
}





export function GetCouGoodsListAPI(type) { //推荐商品
    return request({
        url: '/api/v1/PhoneBusGoods/GetCouGoodsList',
        method: type,
    })
}


// 高德周边搜索API
export function aroundAPIAround(params) {
    return request({
        url: '/v3/v3/place/around',
        method: 'get',
        params
    })
}

//高德关键字搜索API
// export function aroundAPIText(params, type, contentType) {
//     return request({
//         url: '/place/text?parameters',
//         method: type,
//         contentType,
//         params
//     })
// }
export function aroundAPIText(params) {
    return request({
        url: '/v3/v3/place/text',
        method: 'get',
        params
    })
}