import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Myorder from '../views/My/Myorder'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        meta: {
            navShow: true,
            // keepAlive: true // 需要被缓存
        },
        component: Home
    },
    {
        path: '/GoodsDetails', //商品详情
        name: 'GoodsDetails',
        meta: {
            navShow: false,
            // requiresAuth: true
        },
        component: () =>
            import('@/views/Home/GoodsDetails/index')
    },
    {
        path: '/GoodsDetails/GroupDetails', //拼团详情
        name: 'GroupDetails',
        meta: {
            navShow: false,
            // requiresAuth: true
        },
        component: () =>
            import('@/views/Home/GoodsDetails/GroupDetails/index')
    },
    {
        path: '/GoodsDetails/Bargain', //砍价
        name: 'Bargain',
        meta: {
            navShow: false,
            // requiresAuth: true
        },
        component: () =>
            import('@/views/Home/GoodsDetails/Bargain/index')
    },
    {
        path: '/ProductList', //商品列表
        name: 'ProductList',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/ProductList/index')
    },
    {
        path: '/ReceiveCoupon', //领取优惠券
        name: 'ReceiveCoupon',
        meta: {
            navShow: false,
            requiresAuth: true
        },
        component: () =>
            import('@/views/Home/ReceiveCoupon/index')
    },
    {
        path: '/GoodsDetails/OrderConfirmation', //商品详情下面的订单详情
        name: 'OrderConfirmation',
        meta: {
            navShow: false,
            requiresAuth: true
        },
        component: () =>
            import('@/views/Home/GoodsDetails/OrderConfirmation/index')
    },
    {
        path: '/GoodsDetails/pay', //商品详情下面的订单详情
        name: 'pay',
        meta: {
            navShow: false,
            requiresAuth: true
        },
        component: () =>
            import('@/views/Home/GoodsDetails/pay/index')
    },
    {
        path: '/GoodsDetails/CartOrderConfirmation', //购物车下面的订单详情
        name: 'CartOrderConfirmation',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/CartOrderConfirmation/index')
    },
    {
        path: '/GoodsDetails/Store', //商品详情 下面的店铺首页
        name: 'Store',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/Store/index')
    },
    {
        path: '/GD', //商品详情 下面的店铺首页
        name: 'GD',
        meta: {
            navShow: false
        }
    },
    {
        path: '/GoodsDetails/StoreAll', //商品详情 下面的店铺全部
        name: 'StoreAll',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/StoreAll/index')
    },
    {
        path: '/GoodsDetails/StoreCart', //店铺购物车
        name: 'StoreCart',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/StoreCart/index')
    },
    {
        path: '/GoodsDetails/StoreClass', //商品详情 下面的店铺分类
        name: 'StoreClass',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/StoreClass/index')
    },
    {
        path: '/GoodsDetails/StoreContact', //商品详情 下面的店铺联系我们
        name: 'StoreContact',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/StoreContact/index')
    },
    {
        path: '/GoodsDetails/StoreSearch', //商品详情 下面的搜索
        name: 'StoreSearch',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/StoreSearch/index')
    },
    {
        path: '/GoodsDetails/StoreProdList', //商品详情 下面的搜索
        name: 'StoreProdList',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/StoreProdList/index')
    },
    {
        path: '/GoodsDetails/ProprietaryStore', //商品详情 下面的兆客自营
        name: 'ProprietaryStore',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietaryStore/index')
    },
    {
        path: '/GoodsDetails/ProprietaryClass', //商品详情 下面的兆客自营分类
        name: 'ProprietaryClass',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietaryClass/index')
    },
    {
        path: '/GoodsDetails/ProprietaryCart', //商品详情 下面的兆客自营购物车
        name: 'ProprietaryCart',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietaryCart/index')
    },
    {
        path: '/GoodsDetails/ProprietaryMy', //商品详情 下面的兆客自营个人
        name: 'ProprietaryMy',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietaryMy/index')
    },
    {
        path: '/GoodsDetails/ProprietaryEnter', //商品详情 下面的兆客自营入住
        name: 'ProprietaryEnter',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietaryEnter/index')
    },
    {
        path: '/GoodsDetails/ProprietaryLocation', //商品详情 下面的兆客自营 选择位置
        name: 'ProprietaryLocation',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietaryLocation/index')
    },
    {
        path: '/GoodsDetails/ProprietarySelect', //选择门店
        name: 'ProprietarySelect',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/GoodsDetails/ProprietarySelect/index')
    },
    {
        path: '/My/PShop/PHome', //门店首页
        name: 'PHome',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/PHome/index')
    },
    {
        path: '/My/PShop/PWithdraw', //门店提现
        name: 'PWithdraw',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/PWithdraw')
    },
    {
        path: '/My/PShop/PSet', //门店设置
        name: 'PSet',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/PSet')
    },
    {
        path: '/My/PShop/PChange', //门店设置修改
        name: 'PChange',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/PChange')
    },
    {
        path: '/My/PShop/PMessage', //门店信息
        name: 'PMessage',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/PMessage')
    },
    {
        path: '/My/PShop/Porder', //门店信息
        name: 'Porder',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/Porder')
    },
    {
        path: '/My/PShop/PShare', //门店分享
        name: 'PShare',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views//My/PShop/PShare')
    },
    {
        path: '/Search', //搜索
        name: 'Search',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/Home/Search/index')
    },
    {
        path: '/Calssify', //分类
        name: 'Calssify',
        meta: {
            navShow: true
        },
        component: () =>
            import('@/views/Calssify/index')
    },
    {
        path: '/Message', //消息
        name: 'Message',
        meta: {
            navShow: true,
            requiresAuth: true
        },
        component: () =>
            import('@/views/Message/index'),

        // beforeEnter: (to, from, next) => {
        //   // ...
        //   console.log(store.getters.currentUser);
        //   next();
        // }
    },
    {
        path: '/shoppingCart', //购物车
        name: 'shoppingCart',
        meta: {
            navShow: true
        },
        component: () =>
            import('@/views/shoppingCart/index')
    },
    {
        path: '/My', //个人中心
        name: 'My',
        meta: {
            navShow: true,
            requiresAuth: true
        },
        component: () =>
            import('@/views/My/index')
    },
    {
        path: '/My/SetUp', //设置
        name: 'SetUp',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/SetUp/index')
    },
    {
        path: '/My/Income', //收入
        name: 'Income',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Income/index')
    },
    {
        path: '/My/realName', //实名认证页面
        name: 'realName',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/realName/index')
    },
    {
        path: '/My/Income/Withdraw', //收入 提现
        name: 'Withdraw',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Income/Withdraw/index')
    },
    {
        path: '/My/Income/Attestation', //认证条款
        name: 'Attestation',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Income/Attestation/index')
    },
    {
        path: '/My/Income/Withdraw/Successedtow', //收入 提现 成功
        name: 'Successedtow',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Income/Withdraw/Successedtow/index')
    },
    {
        path: '/My/SetUp/AccountSecurity', //账号安全
        name: 'AccountSecurity',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/SetUp/AccountSecurity/index')
    },
    {
        path: '/My/SetUp/AccountSecurity/Changecode', //修改登入密码
        name: 'Changecode',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/SetUp/AccountSecurity/Changecode/index')
    },
    {
        path: '/My/SetUp/AccountSecurity/ChangeLoginPassword', //修改登入密码  验证码修改
        name: 'ChangeLoginPassword',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/SetUp/AccountSecurity/ChangeLoginPassword/index')
    },
    {
        path: '/My/Collection', //收藏
        name: 'Collection',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Collection/index')
    },
    {
        path: '/My/Coupons', //优惠券
        name: 'Coupons',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Coupons/index')
    },
    // {
    //     path: '/My/CouponsLocal', //本地缓存优惠券
    //     name: 'CouponsLocal',
    //     meta: {
    //         navShow: false
    //     },
    //     component: () =>
    //         import ('@/views/My/CouponsLocal/index')
    // },
    {
        path: '/My/Friends', //好友
        name: 'Friends',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Friends/index')
    },
    {
        path: '/My/InviteFriends', //邀请好友
        name: 'InviteFriends',
        meta: {
            navShow: false,
            requiresAuth: true
        },
        component: () =>
            import('@/views/My/InviteFriends/index')
    },
    {
        path: '/My/Myorder', //我的订单
        name: 'Myorder',
        meta: {
            navShow: false
        },
        component: Myorder
    },
    {
        path: '/My/AfterSales', //我的售后
        name: 'AfterSales',
        meta: {
            navShow: false,
            keepAlive: true,
            scrollTop: 0
        },
        component: () =>
            import('@/views/My/AfterSales/index')
    },
    {
        path: '/My/Myorder/OrderDetails', //我的订单下面的订单详情
        name: 'OrderDetails',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/index')
    },
    {
        path: '/My/Myorder/paysuccess', //支付成功
        name: 'paysuccess',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/paysuccess/index')
    },
    {
        path: '/My/bigWheel', //大转盘
        name: 'bigWheel',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/bigWheel/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ApplyRefund', //我的订单下面的订单详情  申请退款
        name: 'ApplyRefund',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ApplyRefund/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ToEvaluate', //我的订单下面的订单详情  去评价
        name: 'ToEvaluate',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ToEvaluate/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund', //我的订单下面的订单详情  申请退款 仅退款
        name: 'OnlyRefund',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund', //我的订单下面的订单详情  申请退款 退货退款
        name: 'ReturnRefund',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/RefundOf', //我的订单下面的订单详情  申请退款 仅退款 退款中
        name: 'RefundOf',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/RefundOf/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund/ReturnAndRefund', //我的订单下面的订单详情  申请退款 退货退款中
        name: 'ReturnAndRefund',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ApplyRefund/ReturnRefund/ReturnAndRefund/index')
    },
    {
        path: '/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/NegotiationHistory', //我的订单下面的订单详情  申请退款 仅退款 协商历史
        name: 'NegotiationHistory',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/Myorder/OrderDetails/ApplyRefund/OnlyRefund/NegotiationHistory/index')
    },
    {
        path: '/My/UsedAddress', //常用地址
        name: 'UsedAddress',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/UsedAddress/index'),
    },
    {
        path: '/My/ApplyEnter', //申请入住
        name: 'ApplyEnter',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/ApplyEnter/index'),
    },
    {
        path: '/My/BargainList', //我的砍价
        name: 'BargainList',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/BargainList/index'),
    },
    {
        path: '/My/ApplyEnter/Successed', //申请入住 成功的提示
        name: 'Successed',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/ApplyEnter/Successed/index'),
    },
    { //添加地址
        path: '/My/UsedAddress/AddAddress', //常用地址
        name: 'AddAddress',
        meta: {
            navShow: false
        },
        component: () =>
            import('@/views/My/UsedAddress/AddAddress/index')
    },
    {
        path: '/My/Login/LoginRegistered',
        name: 'LoginRegistered',
        meta: {
            navShow: false,
            title: ''
        },
        component: () =>
            import('@/views/My/Login/LoginRegistered/index')
    },
    {
        path: '/My/Login/LoginEnter',
        name: 'LoginEnter',
        meta: {
            navShow: false,
            title: '兆客账户登录'
        },
        component: () =>
            import('@/views/My/Login/LoginEnter/index')
    },
    {
        path: '/My/Login/LoginRegisteredTow',
        name: 'LoginRegisteredTow',
        meta: {
            navShow: false,
            title: '兆客注册'
        },
        component: () =>
            import('@/views/My/Login/LoginRegisteredTow/index')
    },
    {
        path: '/My/Login/Privacy',
        name: 'Privacy',
        meta: {
            navShow: false,
        },
        component: () =>
            import('@/views/My/Login/Privacy/index')
    },
    {
        path: '/My/prizeList',
        name: 'prizeList',
        meta: {
            navShow: false,
            title: '中奖记录'
        },
        component: () =>
            import('@/views/My/prizeList')
    },
    {
        path: '/My/Login/LoginValidation',
        name: 'LoginValidation',
        meta: {
            navShow: false,
            title: '身份验证'
        },
        component: () =>
            import('@/views/My/Login/LoginValidation/index')
    },
    {
        path: '/My/Login/LoginResetpassword',
        name: 'LoginResetpassword',
        meta: {
            navShow: false,
            title: '重置密码'
        },
        component: () =>
            import('@/views/My/Login/LoginResetpassword/index')
    },
    {
        path: '/404',
        name: '404',
        meta: {
            navShow: false,
            title: '404'
        },
        component: () =>
            import('@/views/404/index')
    },
    {
        path: '/505',
        name: '505',
        meta: {
            navShow: false,
            title: '505'
        },
        component: () =>
            import('@/views/505/index')
    },
    {
        path: '/demo',
        name: 'demo',
        meta: {
            navShow: false,
            title: 'demo'
        },
        component: () =>
            import('@/views/demo/index')
    },
    {
        path: '/demo/demo1',
        name: 'demo1',
        meta: {
            navShow: false,
            title: 'demo1'
        },
        component: () =>
            import('@/views/demo/demo1/index')
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router