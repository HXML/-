import request from '@/common/js/request'

export function ApplySettleAPI(data, type) { //申请门店入住
    return request({
        url: '/api/v1/Store/ApplySettle',
        method: type,
        data
    })
}

export function CodeVerifyAPI(params, type) { //申请门店发送验证码
    return request({
        url: '/api/v1/Store/CodeVerify',
        method: type,
        params
    })
}

export function GoodListAPI(params, type) { //当前门店产品列表
    return request({
        url: '/api/v1/Store/GoodList',
        method: type,
        params
    })
}


export function DetailsAPI(params, type) { //门店详情(首次从门店列表入)
    return request({
        url: '/api/v1/Store/Details',
        method: type,
        params
    })
}

export function GetGoodsShopCategoryListAPI(params, type) { //获取门店所拥有的店铺一级分类
    return request({
        url: '/api/v1/Store/GetGoodsShopCategoryList',
        method: type,
        params
    })
}

export function ShopPickupPointGoodsListAPI(params, type) { //点击一级分类显示二级产品分类以及商品
    return request({
        url: '/api/v1/Store/ShopPickupPointGoodsList',
        method: type,
        params
    })
}
export function GetCashOutAPI(params, type) { //获取店铺 提现方式
    return request({
        url: '/api/v1/Store/GetCashOut',
        method: type,
        params
    })
}
export function AddAPI(params, type) { //新增提现
    return request({
        url: '/api/v1/Store/Add',
        method: type,
        params
    })
}
export function GetCashTypeListAPI(type) { //提现设置类型列表
    return request({
        url: '/api/v1/Store/GetCashTypeList',
        method: type,
    })
}
export function GetStorePersonalCenterAPI(params, type) { //门店个人中心
    return request({
        url: '/api/v1/Store/GetStorePersonalCenter',
        method: type,
        params
    })
}
export function GetStoreInformationAPI(params, type) { //店铺信息
    return request({
        url: '/api/v1/Store/GetStoreInformation',
        method: type,
        params
    })
}
export function GetCashTypeDetailsAPI(params, type) { //提现设置类型详情
    return request({
        url: '/api/v1/Store/GetCashTypeDetails',
        method: type,
        params
    })
}
export function CashTypeOperatingAPI(data, type) { //提现方式添加、修改
    return request({
        url: '/api/v1/Store/CashTypeOperating',
        method: type,
        data
    })
}

export function GetPointOrderpageListAsyncAPI(params, type) { //异步获取门店订单列表信息
    return request({
        url: '/api/v1/PhoneStore/GetPointOrderpageListAsync',
        method: type,
        params
    })
}

export function StoreListAPI(params, type) { //门店列表
    return request({
        url: '/api/v1/Store/StoreList',
        method: type,
        params
    })
}

export function OperatingPointUserAPI(data, type) { //选择、更换门店
    return request({
        url: '/api/v1/Store/OperatingPointUser',
        method: type,
        data
    })
}
export function SetPickupImgAPI(params, type) { //修改门店图片
    return request({
        url: '/api/v1/Store/SetPickupImg',
        method: type,
        params
    })
}

export function CalculationOfDistanceAPI(params, type) { //计算两点间的距离（经纬度）
    return request({
        url: '/api/v1/Store/CalculationOfDistance',
        method: type,
        params
    })
}
export function GetWithdrawByTypeAPI(params, type) { //计算两点间的距离（经纬度）
    return request({
        url: '/api/v1/Store/GetWithdrawByType',
        method: type,
        params
    })
}

export function SharePickupAPI(params, type) { //门店分享时需要的信息
    return request({
        url: '/api/v1/Store/SharePickup',
        method: type,
        params
    })
}


