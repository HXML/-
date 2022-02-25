import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import {
    _getToken
} from '@/common/js/storage' // 从cookie中获取token
// import getPageTitle from '@/utils/get-page-title'//获取title

NProgress.configure({
    showSpinner: false
}) // 进度条配置

const whiteList = ['/login', '/auth-redirect'] // 不用重定向的白名单

router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    //   document.title = getPageTitle(to.meta.title)

    // 确定用户是否已登录
    const hasToken = _getToken()
    // console.log(hasToken, 'hasToken')
    if (hasToken) {
        // console.log(to.path)
        if (to.path === '/login') {
            // 如果已登录，则重定向到主页
            next({
                name: 'Home'
            })
            NProgress.done()
        } else {
            // 确定用户是否通过getInfo获得了他的权限角色  //在登录的时候我们会把用户的权限以及角色存起来 
            const hasRoles = true //此处先用true 来代替
            if (hasRoles) {
                next()
            } else {
                try {
                    // // 获取用户信息
                    // // 注意: 角色必须是一个数组! 例如: ['admin'] 或者['developer','editor']
                    // const {
                    //     roles
                    // } = await store.dispatch('user/getInfo')
                    // // 根据角色生成可访问的路由映射表
                    // let accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    // accessRoutes.push({
                    //     path: '*',
                    //     redirect: '/404',
                    //     hidden: true
                    // })
                    // // 动态添加可访问的路由
                    // router.addRoutes(accessRoutes)
                    // // hack方法 确保addRoutes是完整的
                    // // 设置replace: true，这样导航就不会留下历史记录
                    // next({
                    //     ...to,
                    //     replace: true
                    // })
                } catch (error) {
                    // 删除token，进入登录页面重新登录
                    // await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* 没有token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录名单中直接跳转
            next()
        } else {
            // 在空闲页面中，没有访问权限的其他页面被重定向到登录页面。登录白名单，直接去
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 进度条完成
    NProgress.done()
})