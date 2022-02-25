import {
    getToken2API
} from '@/api/commonApi'
// import {
//     _setFlag,
//     _setEndTime,
//     _setToken,
// } from '@/common/js/storage'
export function RenewalToken() {
    getToken2API().then(res => { //更新token 并更新登陆时间
        // console.log(res)
        window.localStorage.setItem("Token", res.data);
        window.localStorage.setItem("Flag", true);

        // console.log(new Date(new Date()),"grfsgsgs")
        // console.log(new Date(Date.parse(new Date(new Date())) + 60000),"grfsgsgs222222222")

        window.localStorage.setItem(
            "EndTime",
            new Date(Date.parse(new Date(new Date())) + 86400000)
        );

    })
}