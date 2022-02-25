import request from '@/common/js/request'

export function PhoneShopOtherAPI(data, type) { //商家入驻申请
    return request({
        url: '/api/v1/PhoneShopOther/ToApply',
        method: type,
        data
    })
}
export function CollectionShopAPI(params, type) { //我收藏的商品
    return request({
        url: '/api/v1/MyPersonalCenter/CollectionShop',
        method: type,
        params
    })
}
export function CollectionGoodsAPI(params, type) { //我收藏的店铺
    return request({
        url: '/api/v1/MyPersonalCenter/CollectionGoods',
        method: type,
        params
    })
}

export function DeleteCollectionAPI(params, type) { //删除收藏记录
    return request({
        url: `/api/v1/MyPersonalCenter/Delete/${params}`,
        method: type
    })
}


export function GetlistAPI(params, type) { //地址
    return request({
        url: '/api/PhoneUserAddress/getlist',
        method: type,
        params
    })
}

export function PostAddUserAddressAPI(data, type) { //增地址信息数据
    return request({
        url: '/api/PhoneUserAddress/PostAddUserAddress',
        method: type,
        data
    })
}
export function getlistAPI(params, type) { //获取地址分页列表
    return request({
        url: `/api/PhoneUserAddress/getlist`,
        method: type,
        params
    })
}
export function addressUpdateAPI(data, type) { //更新地址数据
    return request({
        url: '/api/PhoneUserAddress/Update',
        method: type,
        data
    })
}
export function DeleteUserAddressAPI(params, type) { //删除地址数据
    return request({
        url: '/api/PhoneUserAddress/DeleteUserAddress',
        method: type,
        params
    })
}

export function getAddressDefaultAPI(type) { //获取默认地址
    return request({
        url: '/api/PhoneUserAddress/getAddressDefault',
        method: type
    })
}

export function MyFriendsAPI(params, type) { //我的好友
    return request({
        url: '/api/v1/PhoneUserOther/MyFriends',
        method: type,
        params
    })
}



export function MyBaseDataAPI(type) { //个人中心
    return request({
        url: '/api/v1/MyPersonalCenter/MyBaseData',
        method: type,
    })
}

export function MyInfoAPI(params, type) { //登入 我的信息（设置）
    return request({
        url: '/api/v1/MyPersonalCenter/MyInfo',
        method: type,
        params
    })
}

export function SetSexAPI(data, type) { //修改我的性别
    return request({
        url: '/api/v1/MyPersonalCenter/SetSex',
        method: type,
        data
    })
}
export function SetHeadImgAPI(data, type) { //修改我的头像
    return request({
        url: '/api/v1/MyPersonalCenter/SetHeadImg',
        method: type,
        data
    })
}
export function SetNickNameAPI(data, type) { //修改我的昵称
    return request({
        url: '/api/v1/MyPersonalCenter/SetNickName',
        method: type,
        data
    })
}




export function MyAccountRunsAPI(params, type) { //收入
    return request({
        url: `/api/v1/PhoneUserOther/MyAccountRuns`,
        method: type,
        params
    })
}

export function GetBusGoodsCategorylistAPI(params, type) { //获取商品分类 一级
    return request({
        url: '/api/v1/PhoneBusGoods/GetBusGoodsCategorylist',
        method: type,
        params
    })
}

export function GetBusGoodsCategoryNextlistAPI(params, type) { //获取商品分类 二级三级
    return request({
        url: '/api/v1/PhoneBusGoods/GetBusGoodsCategoryNextlist',
        method: type,
        params
    })
}


export function ZkShopAdAPI(params, type) { //获取首页轮播图
    return request({
        url: '/api/v1/ZkHome/ZkShopAd',
        method: type,
        params
    })
}



export function ZkShopAdJXAPI(params, type) { //获取首页轮播图
    return request({
        url: '/api/v1/ZkHome/ZkShopAdJX',
        method: type,
        params
    })
}



export function ZkGoodGoodsAPI(params, type) { //获取精选商品
    return request({
        url: '/api/v1/ZkHome/ZkGoodGoods',
        method: type,
        params
    })
}


export function GetbusgoodsmodelAPI(params, type) { //根据序号查询商品详情 异步
    return request({
        url: '/api/v1/PhoneBusGoods/Getbusgoodsmodel',
        method: type,
        params
    })
}


export function GetUserCartCountAPI(params, type) { //根据序号查询购物车数量
    return request({
        url: '/api/v1/PhoneBusGoods/GetUserCartCount',
        method: type,
        params
    })
}


export function GetbusgoodsmodelRecAPI(params, type) { //根据序号查询商品详情里面商品的评价
    return request({
        url: '/api/v1/PhoneBusGoods/GetbusgoodsmodelRec',
        method: type,
        params
    })
}




export function CollectionAddAPI(params, type) { //添加收藏记录
    return request({
        url: '/api/v1/MyPersonalCenter/Add',
        method: type,
        params
    })
}

export function DeleteByGoodsIdAPI(params, type) { //根据商品id删除收藏记录
    return request({
        url: `/api/v1/MyPersonalCenter/DeleteByGoodsId/${params}`,
        method: type,
        params
    })
}

export function DeleteByShopIdAPI(params, type) { //根据店铺id删除收藏记录
    return request({
        url: `/api/v1/MyPersonalCenter/DeleteByShopId/${params}`,
        method: type,
        params
    })
}



export function GetUserAddressAPI(params, type) { //根据地址序号获取用户地址
    return request({
        url: '/api/PhoneUserAddress/GetUserAddress',
        method: type,
        params
    })
}

export function PhoneUserAddressAPI(data, params, type) { ///api/PhoneUserAddress/Update/{id}
    return request({
        url: `/api/PhoneUserAddress/Update/${params}`,
        method: type,
        data
    })
}


export function getbusgoodslistAPI(params, type) { //根据  搜索名称 || 店铺id || 店铺分类id 获取商品列表
    return request({
        url: '/api/v1/PhoneBusGoods/getbusgoodslist',
        method: type,
        params
    })
}

export function GetCityListAPI(params, type) { //商品列表 筛选 城市
    return request({
        url: '/api/v1/PhoneBusArea/GetCityList',
        method: type,
        params
    })
}

export function GetProvinceListAPI(params, type) { //商品列表 筛选 省份
    return request({
        url: '/api/v1/PhoneBusArea/GetProvinceList',
        method: type,
        params
    })
}


export function GetBusOrderpageListAsyncAPI(params, type) { //个人中心》》》异步获取订单列表信息
    return request({
        url: '/api/v1/PhoneBusOrder/GetBusOrderpageListAsync',
        method: type,
        params
    })
}

export function GetReturnOrderListAsyncAPI(params, type) { //个人中心》》》订单售后  退货订单
    return request({
        url: '/api/v1/PhoneBusOrder/GetReturnOrderListAsync',
        method: type,
        params
    })
}


export function GetBusOrderDetailListAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情
    return request({
        url: '/api/v1/PhoneBusOrder/GetBusOrderDetailListAsync',
        method: type,
        params
    })
}


export function GetReturnShopOrderListAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  退款商品信息获取
    return request({
        url: '/api/v1/PhoneBusOrder/GetReturnShopOrderListAsync',
        method: type,
        params
    })
}

export function GetReturnOrderModelByOrderNoAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  退款订单详情获取
    return request({
        url: '/api/v1/PhoneBusOrder/GetReturnOrderModelByOrderNoAsync',
        method: type,
        params
    })
}



export function GetReturnReasonListAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  获取退款原因
    return request({
        url: '/api/v1/PhoneBusOrder/GetReturnReasonListAsync',
        method: type,
        params
    })
}



export function ReturnShopOrderAsyncAPI(data, type) { //  个人中心>>异步获取订单列表信息>>订单详情  提交退款信息
    return request({
        url: '/api/v1/PhoneBusOrder/ReturnShopOrderAsync',
        method: type,
        data
    })
}


export function GetReturnOrderModelAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  退款订单详情获取  获取自己的退款信息和协商历史
    return request({
        url: '/api/v1/PhoneBusOrder/GetReturnOrderModelAsync',
        method: type,
        params
    })
}



export function PayShopCancelOrderAsynccAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  待付款订单取消
    return request({
        url: '/api/v1/PhoneBusOrder/PayShopCancelOrderAsync',
        method: type,
        params
    })
}

export function PayShopOrderAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  订单支付
    return request({
        url: '/api/v1/PhoneBusOrder/PayShopOrderAsync',
        method: type,
        params
    })
}

export function RemindOrderAsyncAPI(data, type) { //  个人中心>>异步获取订单列表信息>>订单详情  提醒发货
    return request({
        url: '/api/v1/PhoneBusOrder/RemindOrderAsync',
        method: type,
        data
    })
}


export function CanceReturnOrder(data, type) { //  退款订单取消
    return request({
        url: '/api/v1/PhoneBusOrder/CancelReturnShopOrderAsync',
        method: type,
        data
    })
}


export function GetReturnShopOrderModelAsyncAPI(params, type) { //  退款单详情获取  修改申请
    return request({
        url: '/api/v1/PhoneBusOrder/GetReturnShopOrderModelAsync',
        method: type,
        params
    })
}


export function BusExpListAPI(params, type) { //  个人中心>>异步获取订单列表信息>>退款订单快递单号填写
    return request({
        url: '/api/v1/PhoneBusOrder/BusExpList',
        method: type,
        params
    })
}

export function UpdateReturnShopOrderTransAsyncAPI(data, type) { //  个人中心>>异步获取订单列表信息>>获取物流公司信息
    return request({
        url: '/api/v1/PhoneBusOrder/UpdateReturnShopOrderTransAsync',
        method: type,
        data
    })
}

export function GetBusOrderReviewListAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  评价列表获取
    return request({
        url: '/api/v1/PhoneBusOrder/GetBusOrderReviewListAsync',
        method: type,
        params
    })
}


// export function SaveBusOrderReviewListAsyncAPI(params, type) { //  个人中心>>异步获取订单列表信息>>订单详情  评价列表提交
//     return request({
//         url: '/api/v1/PhoneBusOrder/SaveBusOrderReviewListAsync',
//         method: type,
//         params
//     })
// }

export function SaveBusOrderReview1ListAsync(data, type, contentType, orderno) { //  个人中心>>异步获取订单列表信息>>订单详情  评价列表提交
    return request({
        url: '/api/v1/PhoneBusOrder/SaveBusOrderReview1ListAsync/' + orderno,
        method: type,
        contentType,
        data
    })
}

// export function PutImageAPI(data, type) { //上传图片
//     return request({
//         url: '/api/comm/Com/PutImage/USER_HEAD',
//         method: type,
//         data
//     })
// }
export function PutImageAPI(data, type, contentType) { //上传图片
    return request({
        url: '/api/comm/Com/PutImage/USER_HEAD',
        method: 'post',
        type,
        contentType,
        data
    })
}

// 登入
export function loginAPI(data, type) { //登入 账号密码
    return request({
        url: '/api/Authentication/login',
        method: type,
        data
    })
}

export function getToken2API(data, type) { //登入 获取续签认证Token
    return request({
        url: '/api/Authentication/getToken2',
        method: type,
        data
    })
}

export function getSidAPI(type) { //登入 获取SID，初次访问使用，唯一标识用户
    return request({
        url: '/api/Authentication/getSid',
        method: type
    })
}

//登陆完之后的 将本地缓存购物车数据 后台
export function cartNouserAddAPI(data, type, contentType) {
    return request({
        url: '/api/v1/PhoneBusShoppingCart/cartNouserAdd',
        method: type,
        contentType,
        data
    })
}