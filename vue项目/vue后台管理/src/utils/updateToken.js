import {
    getToken2API
} from '@/api/commonAPI'
import {
    _setFlag,
    _setEndTime,
    _setToken,
} from '@/common/js/storage'
export function RenewalToken() {
    getToken2API().then(res => { //更新token 并更新登陆时间
        // console.log(res.data)
        _setToken(res.data)
        // _setEndTime()
        _setFlag(true);
    })
}