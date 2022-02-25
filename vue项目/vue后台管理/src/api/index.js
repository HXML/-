import request from '@/common/js/request'

export function StoreStatisticsAPI(params, type) { //登录Api
    return request({
        url: '/api/BI/StoreStatistics',
        method: type,
        params
    })
}