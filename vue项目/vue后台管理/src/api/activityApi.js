import request from '@/common/js/request'

export function GetPageAPI(params, type) { //查询优惠券分页
    return request({
        url: '/api/ShopCoupons/GetPage',
        method: type,
        params
    })
}

export function EndCouponAPI(params, type) { //结束优惠券领取
    return request({
        url: '/api/ShopCoupons/EndCoupon',
        method: type,
        params
    })
}

export function GoodsListCouponsAPI(params, type) { //查询商品
    return request({
        url: '/api/ShopCoupons/GoodsListCoupons',
        method: type,
        params
    })
}


export function ShopCouponsModelAPI(params, type) { //查询商品
    return request({
        url: '/api/ShopCoupons/ShopCouponsModel',
        method: type,
        params
    })
}


export function ShopCouponsEditAPI(data, type, contentType) { //优惠券修改
    return request({
        url: '/api/ShopCoupons/ShopCouponsEdit',
        method: type,
        contentType,
        data
    })
}




export function ShopCouponsAddAPI(data, type, contentType) { //添加运费模板
    return request({
        url: '/api/ShopCoupons/ShopCouponsAdd',
        method: type,
        contentType,
        data
    })
}


//拼团活动
export function GetActGroupListAPI(params, type) { //拼团活动列表
    return request({
        url: '/api/ShopActivity/GetActGroupList',
        method: type,
        params
    })
}
export function GetShopGoodsAPI() { //查询店铺商品
    return request({
        url: '/api/ShopActivity/GetShopGoods',
        method: 'get',
    })
}
export function GetGoodsSkuAPI(params, type) { //查询商品sku
    return request({
        url: '/api/ShopActivity/GetGoodsSku',
        method: type,
        params
    })
}
export function InsertActGroupAPI(data, type) { //新增拼团活动
    return request({
        url: '/api/ShopActivity/InsertActGroup',
        method: type,
        data
    })
}
export function GetEditActGroupInfoAPI(params, type) { //查询编辑页面活动信息
    return request({
        url: '/api/ShopActivity/GetEditActGroupInfo',
        method: type,
        params
    })
}
export function EditGroupActAPI(data, type) { //修改拼团活动
    return request({
        url: '/api/ShopActivity/EditGroupAct',
        method: type,
        data
    })
}
export function DelActGroupAPI(params, type) { //删除活动（未开始才能删除）
    return request({
        url: '/api/ShopActivity/DelActGroup',
        method: type,
        params
    })
}
export function EndActGroupAPI(params, type) { //结束活动
    return request({
        url: '/api/ShopActivity/EndActGroup',
        method: type,
        params
    })
}
//砍价活动
export function GetActBargainrgPageAPI(params, type) { //砍价活动
    return request({
        url: '/api/ShopActivity/GetActBargainrgPage',
        method: type,
        params
    })
}
export function InsertActBarginirgAPI(data, type) { //新增砍价活动
    return request({
        url: '/api/ShopActivity/InsertActBarginirg',
        method: type,
        data
    })
}
export function EditActBarginirgAPI(data, type) { //修改砍价活动
    return request({
        url: '/api/ShopActivity/EditActBarginirg',
        method: type,
        data
    })
}

export function GetActBargainirgAPI(params, type) { //获取详情
    return request({
        url: '/api/ShopActivity/GetActBargainirg',
        method: type,
        params
    })
}
export function EndActBarginirgAPI(params, type) { //结束砍价活动
    return request({
        url: '/api/ShopActivity/EndActBarginirg',
        method: type,
        params
    })
}
export function DelActBarginirgAPI(params, type) { //删除砍价活动
    return request({
        url: '/api/ShopActivity/DelActBarginirg',
        method: type,
        params
    })
}
//限时折扣活动

export function GetActLimitTimePageAPI(params, type) { //限时折扣活动
    return request({
        url: '/api/ShopActivity/GetActLimitTimePage',
        method: type,
        params
    })
}
export function EndActLimitTimeAPI(params, type) { //结束限时折扣活动
    return request({
        url: '/api/ShopActivity/EndActLimitTime',
        method: type,
        params
    })
}
export function DelActLimitTimeAPI(params, type) { //删除限时折扣活动
    return request({
        url: '/api/ShopActivity/DelActLimitTime',
        method: type,
        params
    })
}
export function GetActLimitTimeDetailAPI(params, type) { //获取限时折扣详情
    return request({
        url: '/api/ShopActivity/GetActLimitTimeDetail',
        method: type,
        params
    })
}
export function InsertActLimitTimeAPI(data, type) { //新增限时折扣
    return request({
        url: '/api/ShopActivity/InsertActLimitTime',
        method: type,
        data
    })
}
export function EditActLimitTimeAPI(data, type) { //新增限时折扣
    return request({
        url: '/api/ShopActivity/EditActLimitTime',
        method: type,
        data
    })
}
export function GetShopGoodsByNameAPI(params, type) { //条件查询商家商品（只能查到出售中和仓库的商品）
    return request({
        url: '/api/ShopActivity/GetShopGoodsByName',
        method: type,
        params
    })
}
// ***************满减满包邮活动列表*****************
export function GetActBargListAPI(params, type) { //获取满减包邮的
    return request({
        url: '/api/ShopActivity/GetActFreePostList',
        method: type,
        params
    })
}

export function GetActFrePostDetaiAPI(params, type) { //查询满减活动详情
    return request({
        url: '/api/ShopActivity/GetActFrePostDetai',
        method: type,
        params
    })
}

export function InsertFreePostAPI(data, type) { //新增满减满包邮活动
    return request({
        url: '/api/ShopActivity/InsertFreePost',
        method: type,
        data
    })
}

export function EditFreePostAPI(data, type) { //修改满减活动
    return request({
        url: '/api/ShopActivity/EditFreePost',
        method: type,
        data
    })
}

export function EndFreePostAPI(params, type) { //结束满减活动
    return request({
        url: '/api/ShopActivity/EndFreePost',
        method: type,
        params
    })
}

export function DelFreePostAPI(params, type) { //删除满减活动*
    return request({
        url: '/api/ShopActivity/DelFreePost',
        method: type,
        params
    })
}
////////////////搭配满减活动/////////////////////

export function GetActWithPageAPI(params, type) { //分页查询搭配满减活动*
    return request({
        url: '/api/ShopActivity/GetActWithPage',
        method: type,
        params
    })
}
export function GetActWithDetaiAPI(params, type) { //查询搭配活动详情*
    return request({
        url: '/api/ShopActivity/GetActWithDetai',
        method: type, 
        params
    })
}
export function InsertActWithAPI(data, type) { //新增搭配满减活动*
    return request({
        url: '/api/ShopActivity/InsertActWith',
        method: type,
        data
    })
}
export function EditActWithAPI(data, type) { //更新搭配活动*
    return request({
        url: '/api/ShopActivity/EditActWith',
        method: type,
        data
    })
}
export function EndActWithAPI(params, type) { //结束搭配活动*
    return request({
        url: '/api/ShopActivity/EndActWith',
        method: type,
        params
    })
}
export function DelActWithAPI(params, type) { //删除搭配活动*
    return request({
        url: '/api/ShopActivity/DelActWith',
        method: type,
        params
    })
}
////大转盘优惠券
export function GetBigWhellAwardByShopIdAPI(params, type) { //查询大转盘优惠券奖项分页*
    return request({
        url: '/api/ShopActivity/GetBigWhellAwardByShopId',
        method: type,
        params
    })
}
export function AddBigWhellAwardAPI(data, type) { //将优惠券加入大转盘奖项*
    return request({
        url: '/api/ShopActivity/AddBigWhellAward',
        method: type,
        data
    })
}
export function DelBigWhellAwardAPI(params, type) { //删除大转盘奖项*
    return request({
        url: '/api/ShopActivity/DelBigWhellAward',
        method: type,
        params
    })
}
export function EditBigWhellAwardDetaiAPI(data, type) { //bianji大转盘奖项*
    return request({
        url: '/api/ShopActivity/EditBigWhellAwardDetai',
        method: type,
        data
    })
}
export function GetBigWhellAwardDetaiAPI(params, type) { //chaxun大转盘奖项*
    return request({
        url: '/api/ShopActivity/GetBigWhellAwardDetai',
        method: type,
        params
    })
}