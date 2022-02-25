import request from '@/common/js/request'
// 登入
export function loginAPI(data, type) { //登入 账号密码
    return request({
        url: '/api/Authentication/login',
        method: type,
        data
    })
}


export function GetPhoneTokenAPI(data, type) { //手机号密码登入
    return request({
        url: '/api/Authentication/GetPhoneToken',
        method: type,
        data
    })
}


// export function GetPhoneRegAPI(params, type) { //注册 手机号 
//     return request({
//         url: '/api/v1/PhoneUserOauth/GetPhoneReg',
//         method: type,
//         params
//     })
// }

export function GetPhoneRegAPI(params, type) { //注册 手机号 
    return request({
        url: '/api/Authentication/GetPhoneReg',
        method: type,
        params
    })
}

export function getToken2API(type) { //登入 获取续签认证Token
    return request({
        url: '/api/Authentication/getToken2',
        method: type,
    })
}

export function getSidAPI(type) { //登入 获取SID，初次访问使用，唯一标识用户
    return request({
        url: '/api/Authentication/getSid',
        method: type
    })
}


export function GetCodeVerifyAPI(params, type) { //获取短信验证码
    return request({
        url: '/api/Authentication/GetCodeVerify',
        method: type,
        params
    })
}



export function GetCodeCheckAPI(params, type) { //验证验证码
    return request({
        url: '/api/v1/PhoneUserOauth/GetCodeCheck',
        method: type,
        params
    })
}



export function GetPwdChangeAPI(data, type) { //密码修改
    return request({
        url: '/api/v1/PhoneUserOauth/GetPwdChange',
        method: type,
        data
    })
}



//修改密码 
export function chpassAPI(data, type) { 
    return request({
        url: '/api/v1/PhoneUserOauth/Chpass',
        method: type,
        data
    })
}



//登入之后获取验证码修改密码vi
export function ChangePwdCodeVerifyAPI(type) { 
    return request({
        url: '/api/v1/PhoneUserOauth/ChangePwdCodeVerify',
        method: type,
    })
}

