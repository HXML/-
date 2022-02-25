import request from '@/common/js/request'

export function GetListALLNouserAPI(data,type,contentType) { // 未登录用户添加购物车
    return request({
        url: '/api/v1/PhoneBusShoppingCart/GetListALLNouser',
        method: type,
        contentType,
        data
    })
}

