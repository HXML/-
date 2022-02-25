import request from '@/common/js/request'

// 拼团
export function GetActGroupDetaiAPI(params, type) { //我收藏的商品
    return request({
        url: '/api/PhoneActivity/GetActGroupDetai',
        method: type,
        params
    })
}



// 砍价


export function GetBargainListDetaiAPI(params, type) { //砍价列表详情
    return request({
        url: '/api/PhoneActivity/GetBargainListDetai',
        method: type,
        params
    })
}

export function BargainAPI(data, type) { //参与砍价
    return request({
        url: '/api/PhoneActivity/Bargain',
        method: type,
        data
    })
}

export function InsertActBargainAPI(data, type) { //我要砍价
    return request({
        url: '/api/PhoneActivity/InsertActBargain',
        method: type,
        data
    })
}

export function MyBargainListAPI(params, type) { //个人中心砍价列表
    return request({
        url: '/api/PhoneActivity/MyBargainList',
        method: type,
        params
    })
}




// 限时秒杀





// 搭配购买


export function AddModelBuyActIDAsyncAPI(data, type) { //搭配购买
    return request({
        url: 'api/PhoneActivity/AddModelBuyActIDAsync', 
        method: type,
        data
    })
}




// 满减



//绑定微信号
export function RelieveWxOpenIDAPI(data, type) {
    return request({
        url: '/api/v1/PhoneUserOauth/RelieveWxOpenID', 
        method: type,
        data
    })
}



