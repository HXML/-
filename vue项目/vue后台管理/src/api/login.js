import request from '@/common/js/request'

export function loginAPI(data, type, contentType) { //登录Api
    return request({
        url: '/api/Authentication/login',
        method: type,
        contentType,
        data
    })
}