import request from '@/common/js/request'
//设置管理模块



export function LogAPI(params, type) { //日志列表
    return request({
        url: '/api/ShopLog/Log',
        method: type,
        params
    })
}

export function GetModuleAPI(type) { //操作模块下拉框
    return request({
        url: '/api/ShopLog/GetModule',
        method: type
    })
}

export function GetUAPI(type) { //操作角色下拉框
    return request({
        url: '/api/ShopLog/GetU',
        method: type
    })
}

export function GetRoleAPi(params, type) { //角色列表
    return request({
        url: '/api/ShopUserRole/GetRole',
        method: type,
        params
    })
}

export function GetUserAPi(params, type) { //角色列表
    return request({
        url: '/api/ShopUserRole/GUser',
        method: type,
        params
    })
}

export function EnableAPi(id, params, type) { //修改是否使用
    return request({
        url: '/api/ShopUserRole/Enable/' + id,
        method: type,
        params
    })
}

export function DelShopUAPi(id, type) { //删除商铺用户
    return request({
        url: '/api/ShopUserRole/DelShopU/' + id,
        method: type
    })
}

export function RoleResListAPi(id, type) { //查询角色权限信息
    return request({
        url: '/api/ShopUserRole/RoleResList/' + id,
        method: type
    })
}

export function getUserAPi(params, type) { //查询用户
    return request({
        url: '/api/ShopUserRole/getUser',
        method: type,
        params
    })
}
export function GetRoleAllAPi(type) { //查询全部可用角色
    return request({
        url: '/api/ShopUserRole/GetRoleAll',
        method: type
    })
}
export function InsertSUAPi(params, type) { //查询全部可用角色
    return request({
        url: '/api/ShopUserRole/InsertSU',
        method: type,
        params
    })
}
export function EditShopUserAPi(data, type) { //修改商铺用户角色
    return request({
        url: '/api/ShopUserRole/EditShopUser',
        method: type,
        data
    })
}
export function GetShopAPi(type) { //查询店铺信息 
    return request({
        url: '/api/ShopUserRole/GetShop',
        method: type
    })
}



export function areaAPI(params, type) { //地址三级
    return request({
        url: '/api/BusExpDeliveryTmp/area',
        method: type,
        params
    })
}

export function SRAListAPI(params, type) { //查询退货地址
    return request({
        url: '/api/BusExpDeliveryTmp/SRAList',
        method: type,
        params
    })
}

export function ExpEditModelAPI(params, type) { //查询运费模板实体
    return request({
        url: '/api/BusExpDeliveryTmp/ExpEditModel',
        method: type,
        params
    })
}

export function SRADeleteAPI(params, type) { //删除退货地址
    return request({
        url: '/api/BusExpDeliveryTmp/SRADelete',
        method: type,
        params
    })
}
export function SRAModelAPI(params, type) { //删除退货地址
    return request({
        url: '/api/BusExpDeliveryTmp/SRAModel',
        method: type,
        params
    })
}



export function ExpListAPI(params, type) { //模板列表
    return request({
        url: '/api/BusExpDeliveryTmp/ExpList',
        method: type,
        params
    })
}

export function ExpdeleteAPI(params, type) { //模板删除
    return request({
        url: '/api/BusExpDeliveryTmp/Expdelete',
        method: type,
        params
    })
}

export function ExpCopyAPI(params, type) { //模板拷贝
    return request({
        url: '/api/BusExpDeliveryTmp/ExpCopy',
        method: type,
        params
    })
}







export function SRAAddAPI(data, type, contentType) { //添加退货地址
    return request({
        url: '/api/BusExpDeliveryTmp/SRAAdd',
        method: type,
        contentType,
        data
    })
}

export function SRAEditAPI(data, type, contentType) { //修改退货地址
    return request({
        url: '/api/BusExpDeliveryTmp/SRAEdit',
        method: type,
        contentType,
        data
    })
}



export function ExpAddAPI(data, type, contentType) { //添加运费模板
    return request({
        url: '/api/BusExpDeliveryTmp/ExpAdd',
        method: type,
        contentType,
        data
    })
}

export function ExpUpdateAPI(data, type, contentType) { //添加运费模板
    return request({
        url: '/api/BusExpDeliveryTmp/ExpUpdate',
        method: type,
        contentType,
        data
    })
}