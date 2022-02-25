import request from '@/common/js/request'
export function getAddressAPI() { //获取地址
    return request({
        url: '/api/demo/Area/Get',
        method: 'get',
    })
}
export function getToken2API() { //获取地址
    return request({
        url: '/api/Authentication/getToken2',
        method: 'post',
    })
}
export function IsUserLoginAPI() { //获取地址
    return request({
        url: '/api/Authentication/IsUserLogin',
        method: 'get',
    })
}