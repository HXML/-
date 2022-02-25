import request from '@/common/js/request'

export function GetShopCartListAPI(params, type) { // 购物车>>购物车数据列表
    return request({
        url: '/api/v1/PhoneBusShoppingCart/GetShopCartList',
        method: type,
        params
    })
}


export function UpdateQtyAsyncAPI(params, type) { // 购物车>>购物车数据列表
    return request({
        url: '/api/v1/PhoneBusShoppingCart/UpdateQtyAsync',
        method: type,
        params
    })
}


export function DeleteCartByIDsAsyncAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/v1/PhoneBusShoppingCart/DeleteCartByIDsAsync',
        method: type,
        contentType,
        data
    })
}



export function AddToCartAPI(params, type) {  //购物车商品添加
    return request({
        url: '/api/v1/PhoneBusShoppingCart/AddToCart',
        method: type,
        params
    })
}