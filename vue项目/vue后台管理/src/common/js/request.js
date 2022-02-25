import axios from 'axios'
import router from '../../router'
import {
    MessageBox,
    Message
} from 'element-ui';
import {
    RenewalToken
} from "@/utils/updateToken";
import {
    _getToken,
    _getEndTime,
    _removeToken,
    _setToken,
    _setFlag,
    _getSid,
    _getFlag
} from '@/common/js/storage'
// create an axios instance
const service = axios.create({
    // baseURL: "http://dev-api.zk-mall.net/", // api的base_url+
    baseURL: "/", // api的base_url+
    // baseURL: "http://192.168.2.141:2021/", // api的base_url+
    timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    // console.log(config, "config");
    let sid = _getSid()
    let agent = window.localStorage.getItem('model');
    if (config.contentType === 1) {
        config.headers['Content-Type'] = "application/x-www-form-urlencoded"
    }
    if (config.contentType === 2) {
        config.headers['Content-Type'] = false
    }
    if (config.contentType === 3) {
        config.headers['Content-Type'] = "application/json"
    }
    if (_getToken()) {
        config.headers['Authorization'] = 'Bearer ' + _getToken() //设置请求头
    }
    config.headers['zk-agent'] = `ZK-BUS, zkbusadmin,${agent},1.0,${sid?sid:'0'}` //设置请求头
    return config
}, error => {
    // Do something with request error
    // console.log("codecode") // for debug
    Promise.reject(error)
})
// console.log(service)  
// respone interceptor
service.interceptors.response.use(
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    response => {
        var isGet = false;
        if (response.config.method == "get" || response.config.method == "Get" || response.config.method == "GET") {
            isGet = true;
        }
        // console.log(isGet, "isGet");
        // console.log(response, "responseresponseresponseresponseresponse");
        // _setToken("445555");
        // console.log(_getFlag() == 'true' && new Date(_getEndTime()) - new Date() < 86400000, "new Date(_getEndTime()) - new Date()")
        if (_getFlag() == 'true' && new Date(_getEndTime()) - new Date() < 86400000) { //时间差小于一天以及flag等于true
            _setFlag(false);
            RenewalToken() //续签token
        }
        if (response.data.code === 102) {
            MessageBox.alert("登录超时")
        } else if (response.data.code === 101 && !isGet) {
            Message.error("您没有权限访问此功能！")
        } else if (response.data.code === 500) {
            console.log("系统错误!")
        } else if (response.data.code === 103) {
            MessageBox.alert("token过期,请重新登录")
            _removeToken()
        } else if (response.data.code === 104) {
            MessageBox.alert("不允许频繁刷新")
        } else {
            // console.log("aa");
            return response.data
        }
    },
    error => {
        if (error && error.response.status === 500) {
            // MessageBox.alert("网络错误", '提示', {
            //     confirmButtonText: '确定',
            // })
            console.log(500)
        } else if (error && error.response.status === 404) {
            MessageBox.alert("无法找到该页面(404)")
        } else if (error && error.response.status === 401) {
            MessageBox.confirm("您的身份过期，您可以取消以停留在此页面，或再次登录", '提示', {
                confirmButtonText: '确定',
            }).then(() => {
                _removeToken();
                window.location.reload()
            })
        } else {
            // alert('网络异常!')
        }
    }
)

export default service