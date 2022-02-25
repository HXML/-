import request from '@/common/js/request'

export function ShopCateListAPI(type) { //查询分类
    return request({
        url: '/api/ShopGoods/ShopCateList',
        method: type
    })
}

export function AddSTypeAPI(data, type, contentType) { //新增/修改分类
    return request({
        url: '/api/ShopGoods/AddSType',
        method: type,
        contentType,
        data
    })
}

export function StorAPI(params, type, id) { //修改排序分类
    return request({
        url: '/api/ShopGoods/Stor/' + id,
        method: type,
        params
    })
}

export function ShopCateDelAPI(params, type) { //删除分类
    return request({
        url: '/api/ShopGoods/ShopCateDel',
        method: type,
        params
    })
}