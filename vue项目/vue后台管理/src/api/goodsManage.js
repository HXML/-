import request from '@/common/js/request'
//商品管理模块

export function GetS_API(params, type) { //登录Api
    return request({
        url: '/api/ShopGoods/GetS',
        method: type,
        params
    })
}
export function ShopCateListAPI(params, type) { //获取店铺内部分类
    return request({
        url: '/api/ShopGoods/ShopCateList',
        method: type,
        params
    })
}
export function GetSkuAPI(params, type) { //通过id获取商品的
    return request({
        url: '/api/ShopGoods/GetSku',
        method: type,
        params
    })
}
export function Del_API(params, type) { //删除商品 删除进入回收站
    return request({
        url: `/api/ShopGoods/Del/${params}`,
        method: type,
    })
}
export function IsShelfAPI(ids, params, type) { //上下架
    return request({
        url: `/api/ShopGoods/Shelf/${ids}`,
        method: type,
        params
    })
}
export function WarehouseGoods_API(params, type) { //仓库中的商品
    return request({
        url: '/api/ShopGoods/WarehouseGoods',
        method: type,
        params
    })
}


export function RecycleList_API(params, type) { //商品回收站列表查询
    return request({
        url: '/api/ShopGoods/RecycleList',
        method: type,
        params
    })
}
export function EditP_API(id, params, type) { //修改价格
    return request({
        url: `/api/ShopGoods/EditP/${id}`,
        method: type,
        params
    })
}

export function EditS_API(id, params, type) { //修改库存
    return request({
        url: `/api/ShopGoods/EditS/${id}`,
        method: type,
        params
    })
}
export function GoodsCateListAPI(params, type) { //获取分类列表
    return request({
        url: `/api/ShopGoods/GoodsCateList`,
        method: type,
        params
    })
}
export function GetProperListAPI(params, type) { //通过最后一个分类的Id获取分类下的信息
    return request({
        url: `/api/ShopGoods/Details`,
        method: type,
        params
    })
}

export function AddGoodsAPI(data, type) { //上传商品
    return request({
        url: "/api/ShopGoods/Add",
        method: type,
        data
    })
}
export function GoodsEditSaveAPI(data, type) { //编辑保存
    return request({
        url: "/api/ShopGoods/Edit",
        method: type,
        data
    })
}

export function GetGoodsDtailUrlAPI(type) { //查询商品详情地址
    return request({
        url: "/api/ShopGoods/GetGoodsDtailUrl",
        method: type
    })
}