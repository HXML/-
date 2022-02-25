import request from '@/common/js/request' //引入请求接口的方法

//退款单列表界面
export function GoodsReturnListAPI(params, type) {
    return request({
        url: "api/GoodsReturn/GoodsReturnList",
        method: type,
        params
    })
}
//通过选中的ids获取
export function ReturnItemsListByIdsAPI(params, type) {
    return request({
        url: `api/GoodsReturn/ReturnItemsListByIds`,
        method: type,
        params
    })
}

//退款单详情
export function GoodsReturnDetailsAPI(params, type) {
    return request({
        url: "api/GoodsReturn/GoodsReturnDetails",
        method: type,
        params
    })
}

//退款单审核操作  //批量退款弹窗页面的确认按钮的事件
export function RefundOperationAPI(data, type) {
    return request({
        url: "api/GoodsReturn/RefundOperation",
        method: type,
        data
    })
}
