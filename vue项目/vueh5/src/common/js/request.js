import axios from 'axios'
import {
    Toast,
    Dialog
} from 'vant'
import router from '../../router'
import {
    RenewalToken
} from '@/common/js/upDateToken'
//axios.defaults.withCredentials=true;//Vue中axios解决sessionid不一致
// create an axios instance
// console.log(process.env.VUE_APP_URL)
const agent = navigator.userAgent
const service = axios.create({
    // baseURL: process.env.VUE_APP_URL, // api的base_url
    // baseURL: "http://dev-api.zk-mall.net/", // api的base_url+
    baseURL: "/", // api的base_url+
    // baseURL: "/", // api的base_url+
    timeout: 15000 // request timeout
})
service.interceptors.response.use(
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    response => {
        let Flag = window.localStorage.getItem("Flag")
        let EndTime = window.localStorage.getItem("EndTime")
        // console.log(new Date(EndTime) - new Date() < 30000,"new Date(EndTime) - new Date() < 30000")
        if (Flag == "true" && new Date(EndTime) - new Date() < 30000) { //时间差小于半分钟以及flag等于true
            window.localStorage.setItem("Flag", false)
            RenewalToken() //续签token
        }
        if (response.data.code == 0) {
            if (response.data.msg == '用户登录信息已失效！') {
                Dialog.alert({
                    title: '提示',
                    message: '您的身份已过期,请重新登录',
                }).then(() => {
                    // on close
                    localStorage.clear();

                    router.push({
                        name: 'LoginRegistered'
                    })
                });
                return
            } else {
                Toast(response.data.msg)
            }
        } else if (response.data.code == 102) {
            Toast("登录超时")
        } else if (response.data.code == 103) {
            // Toast("您的身份已过期,请重新登录")
            // _removeToken()
            localStorage.clear();
            // Dialog.alert({
            //     title: '提示',
            //     message: '您的身份已过期,请重新登录',
            // }).then(() => {
            //     // on close
            //     localStorage.clear();
            //     router.push({
            //         name: 'LoginRegistered'
            //     })
            // });
        } else if (response.data.code == 104) {
            Toast("不允许频繁刷新")
        } else {
            return response.data
        }
        return response.data
    },
    error => {
        // console.log(error.response.status) // for debug
        if (error && error.response.status === 500) {
            // Toast(error.response.msg)
        } else if (error && error.response.status === 404) {
            Toast("404")
        } else if (error && error.response.status === 401) {

            if (!window.localStorage.getItem("Token")) {
                var messagetext = '去登录'
            } else {
                var messagetext = '您的身份已过期,请重新登录'
            }
            Dialog.alert({
                title: '提示',
                message: messagetext,
            }).then(() => {
                // on close
                router.push({
                    name: 'LoginRegistered'
                })
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i); //获取本地存储的Key
                    // console.log(key);
                    // console.log(localStorage.getItem(key)); //所有value
                    // console.log("---------------------------------");
                    if (key !== "couponsList" || key !== "envelopeList" || key !== "CouponTimes") {
                        window.localStorage.removeItem('key')
                    }
                }
                // localStorage.clear();
            });
        } else {
            // Toast('网络异常!')
        }
    }
)
// request interceptor
service.interceptors.request.use(config => {
    // Do something before request is sent

    let Token = window.localStorage.getItem("Token")
    let sid = window.localStorage.getItem("Sid")
    let agent = window.localStorage.getItem('model');

    if (Token) {
        config.headers['Authorization'] = 'Bearer ' + Token //设置请求头
    }
    if (config.contentType === 2) {
        config.headers['Content-Type'] = false
    }
    if (config.contentType === 3) {
        config.headers['Content-Type'] = " application/json"
    }

    if (sid) {
        config.headers['zk-agent'] = `ZK-SHOP, h5,${agent},1.0,${sid}`
    } else {
        config.headers['zk-agent'] = `ZK-SHOP, h5,${agent},1.0,0`
    }
    return config
}, error => {
    // Do something with request error
    Promise.reject(error)
})

export default service