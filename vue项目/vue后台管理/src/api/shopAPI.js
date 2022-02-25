import request from '@/common/js/request'

export function GetFGAPI(type) { //文件分组
    return request({
        url: '/api/ShopFile/GetFG',
        method: type
    })
}

export function GetListAPI(params, type) { //文件分组
    return request({
        url: '/api/ShopFile/GetList',
        method: type,
        params
    })
}

export function AddFileAPI(data, type, contentType) { //上传文件
    return request({
        url: '/api/ShopFile/AddFile',
        method: type,
        contentType,
        data
    })
}

export function GetConfigAPI(type) { //查询店铺文件配置
    return request({
        url: '/api/ShopFile/GetConfig',
        method: type
    })
}

export function FileItemAPI(params, type) { //查询文件信息
    return request({
        url: '/api/ShopFile/FileItem',
        method: type,
        params
    })
}

export function DelFileAPI(params, type) { //删除文件
    return request({
        url: '/api/ShopFile/DelFile/',
        method: type,
        params
    })
}

export function ShiftAPI(gId, params, type) { //修改文件所在分组
    return request({
        url: '/api/ShopFile/Shift/' + gId,
        method: type,
        params
    })
}

export function GroupAddAPI(params, type) { //新增文件分组
    return request({
        url: '/api/ShopFile/GroupAdd',
        method: type,
        params
    })
}

export function DELGAPI(params, type) { //删除文件分组
    return request({
        url: '/api/ShopFile/DELG/' + params,
        method: type
    })
}



export function CongifModelAPI(params, type) { //删除文件分组
    return request({
        url: '/api/ShopConfig/CongifModel/',
        method: type
    })
}

export function ShopAdListAPI(params, type) { //删除文件分组
    return request({
        url: '/api/ShopConfig/ShopAdList/',
        method: type
    })
}


export function ShopAdListUpdatedAPI(data, type, contentType) { //上传文件
    return request({
        url: '/api/ShopConfig/ShopAdListUpdated',
        method: type,
        contentType,
        data
    })
}
export function EditPicInfoAPI(data, type) { //修改文件
    return request({
        url: '/api/ShopFile/EditPicInfo',
        method: type,
        data
    })
}





export function CongifModelUpdateAPI(data, type, contentType) { //上传文件
    return request({
        url: '/api/ShopConfig/CongifModelUpdate',
        method: type,
        contentType,
        data
    })
}


export function GetMessagePageAPI(params, type) { //店铺消息
    return request({
        url: '/api/ShopMessage/GetMessagePage',
        method: type,
        params
    })
}
export function GetMessageInfoAPI(params, type) { //店铺消息
    return request({
        url: '/api/ShopMessage/GetMessageInfo',
        method: type,
        params
    })
}


export function GetNoticeAPI(type) { //店铺公告(首页6条)
    return request({
        url: '/api/ShopMessage/GetNotice',
        method: type
    })
}

export function GetNoticePageAPI(params, type) { //店铺公告列表
    return request({
        url: '/api/ShopMessage/GetNoticePage',
        method: type,
        params
    })
}

export function NoticeInfoAPI(params, type) { //店铺公告详情
    return request({
        url: '/api/ShopMessage/NoticeInfo',
        method: type,
        params
    })
}



export function ShopIndexInfoAPI(type) { //店铺详情
    return request({
        url: '/api/ShopConfig/ShopIndexInfo',
        method: type
    })
}

export function IsEnabledMerchantAPI(data) { //上传图片
    return request({
        url: '/api/ShopConfig/IsEnabledMerchant',
        method: 'get',
        data
    })
}


export function GetshopDtailUrlAPI() { //上传图片
    return request({
        url: '/api/ShopConfig/GetshopDtailUrl',
        method: 'get'
    })
}



export function PagerOrderMsgNumAPI() { //获取新的订单数量API
    return request({
        url: '/api/ShopMessage/PagerOrderMsgNum',
        method: 'get'
    })
}