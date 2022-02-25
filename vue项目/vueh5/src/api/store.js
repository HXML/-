import request from '@/common/js/request'


export function GetShopInfoAPI(params, type) { //店铺信息 （消费者进入店铺主页）   根据店铺id获取店铺数据
    return request({
        url: '/api/v1/PhoneShopOther/GetShopInfo',
        method: type,
        params
    })
}



export function GetBusGoodsShopCategorylistAPI(params, type) { //获取店铺一级分类
    return request({
        url: '/api/v1/PhoneBusGoods/GetBusGoodsShopCategorylist',
        method: type,
        params
    })
}


export function ShopCateListAPI(type) { //获取申请入住  行业
    return request({
        url: '/api/v1/PhoneShopOther/ShopCateList',
        method: type
    })
}



export function GetbusgoodsByShoplistAPI(params, type) { //获取店铺 首页列表
    return request({
        url: '/api/v1/PhoneBusGoods/GetbusgoodsByShoplist',
        method: type,
        params
    })
}


export function GetBusShopConfigAPI(params, type) { //获取店铺 首页列表
    return request({
        url: '/api/v1/ZkHome/GetBusShopConfig',
        method: type,
        params
    })
}


export function GetShopIDAPI(params, type) { //获取店铺 首页列表
    return request({
        url: '/api/v1/PhoneShopOther/GetShopID',
        method: type,
        params
    })
}





export function FactShopInUserAddAPI(params,type) { // 添加访客记录
    return request({
        url: '/api/BI/FactShopInUserAdd',
        method: type,
        params
    })
}


// export function FactShopViewAddAPI(type) { // 添加用户浏览记录
//     return request({
//         url: '/api/BI/FactShopViewAdd',
//         method: type
//     })
// }
