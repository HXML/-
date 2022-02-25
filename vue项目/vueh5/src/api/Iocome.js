import request from '@/common/js/request'


export function ApplyBalanceAPI(data, type) { //提现申请
    return request({
        url: '/api/v1/PhoneUserOther/ApplyBalance',
        method: type,
        data
    })
}
export function LeastMoneyAPI(type) { //提现金额限制
    return request({
        url: '/api/v1/PhoneUserOther/LeastMoney',
        method: type
    })
}
export function TrueValIDCodeVerifyAPI(params) { //获取验证码 get 参数    Mobile
    return request({
        url: '/api/v1/PhoneUserOther/TrueValIDCodeVerify',
        method: "get",
        params
    })
}
export function TrueValIDAPI(data) { //获取验证码 get 参数    Mobile
    return request({
        url: '/api/v1/PhoneUserOther/TrueValID',
        method: "post",
        data
    })
}