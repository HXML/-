import request from '@/common/js/request'
// 优惠券



export function CollectCouponsAPI(data, type) { //领取优惠券
    return request({
        url: '/api/v1/PhoneCoupons/CollectCoupons',
        method: type,
        data
    })
}


export function ShowCouponsListAPI(params, type) { //获取店铺优惠券
    return request({
        url: '/api/v1/PhoneCoupons/ShowCouponsList',
        method: type,
        params
    })
}


export function GetUserCouponsListAPI(params, type) { //用户个人消费券
    return request({
        url: '/api/v1/PhoneCoupons/GetUserCouponsList',
        method: type,
        params
    })
}


export function GetUserShopCouponsListAPI(params, type) { //用户个人消费券
    return request({
        url: '/api/v1/PhoneCoupons/GetUserShopCouponsList',
        method: type,
        params
    })
}

export function GetUserShopCouponsListBuyAPI(params, type) { //用户个人消费券
    return request({
        url: '/api/v1/PhoneCoupons/GetUserShopCouponsListBuy',
        method: type,
        params
    })
}


export function GetShopCouponsModelAPI(data, type) { //获取单个优惠券
    return request({
        url: '/api/v1/PhoneCoupons/GetShopCouponsModel',
        method: type,
        data
    })
}


export function ShowCouponsListByOrderAPI(data, type) { //订单可使用的优惠券
    return request({
        url: '/api/v1/PhoneCoupons/ShowCouponsListByOrder',
        method: type,
        data
    })
}




export function GetUserRedPacketAPI(params, type) { //获取用户的红包
    return request({
        url: '/api/v1/PhoneCoupons/GetUserRedPacket',
        method: type,
        params
    })
}




export function UseRedPacketAPI(data, type) { //提现红包
    return request({
        url: '/api/v1/PhoneCoupons/UseRedPacket',
        method: type,
        data
    })
}


export function LoginBigWheelSynsAPI(data, type) { //提现红包
    return request({
        url: '/api/PhoneActivity/LoginBigWheelSyns',
        method: type,
        data
    })
}

