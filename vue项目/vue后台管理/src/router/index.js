import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        name: 'login',
        path: '/login',
        component: () =>
            import('@/views/login'),
    },
    {
        name: 'shop',
        path: '/shop', //店铺
        component: () =>
            import('@/views/shop'),
        redirect: '/shop/template', //默认显示template
        children: [{
                name: 'template',
                path: '/shop/template', //店铺模板
                meta: {
                    secondTitle: '店铺',
                    thirdTitle: '店铺模板'
                },
                component: () =>
                    import('@/views/shop/template/index'),
            },
            {
                name: 'picture',
                path: '/picture', //图片空间
                meta: {
                    secondTitle: '店铺',
                    thirdTitle: '图片空间'
                },
                component: () =>
                    import('@/views/shop/picture/index'),
            },
            {
                name: 'shopSetting',
                path: '/shopSetting', //店铺设置
                meta: {
                    secondTitle: '店铺',
                    thirdTitle: '店铺设置'
                },
                component: () =>
                    import('@/views/shop/shopSetting/index'),
            },
            // {
            //     name: 'shopIntro',
            //     path: '/shopIntro', //店铺简介
            //     component: () =>
            //         import('@/views/shop/shopIntro/index'),
            // },
            {
                name: 'Message',
                path: '/Message', //店铺消息
                meta: {
                    secondTitle: '店铺',
                    thirdTitle: '店铺消息'
                },
                component: () =>
                    import('@/views/shop/Message/index'),
            },
            {
                name: 'Notice',
                path: '/Notice', //店铺公告
                meta: {
                    secondTitle: '店铺',
                    thirdTitle: '店铺公告'
                },
                component: () =>
                    import('@/views/shop/Notice/index'),
            },

        ]
    },
    {
        name: "goods", //商品
        path: '/goods',
        component: () =>
            import('@/views/goods'),
        redirect: '/goods/release', //默认显示release
        children: [{
                name: 'release',
                path: '/goods/release', //发布商品
                meta: {
                    secondTitle: '商品管理',
                    thirdTitle: '发布商品'
                },
                component: () =>
                    import('@/views/goods/release/index'),
            },
            {
                name: 'onSale',
                path: '/onSale', //在售的商品
                meta: {
                    secondTitle: '商品管理',
                    thirdTitle: '在售的商品'
                },
                component: () =>
                    import('@/views/goods/onSale/index'),
            },
            {
                name: 'releaseComponet',
                path: '/releaseComponet', //发布商品
                meta: {
                    secondTitle: '商品管理',
                    thirdTitle: '发布商品'
                },
                component: () =>
                    import('@/views/goods/releaseComponet/index'),
            },
            {
                name: 'goodsClassify',
                path: '/goodsClassify', //商品自定义分类
                meta: {
                    secondTitle: '商品管理',
                    thirdTitle: '商品自定义分类'
                },
                component: () =>
                    import('@/views/goods/goodsClassify/index'),
            },
            {
                name: 'recycleGoods',
                path: '/recycleGoods', //回收站的商品
                meta: {
                    secondTitle: '商品管理',
                    thirdTitle: '回收站的商品'
                },
                component: () =>
                    import('@/views/goods/recycleGoods/index'),
            },
            {
                name: 'offlineGoods',
                path: '/offlineGoods', //下架的商品
                meta: {
                    secondTitle: '商品管理',
                    thirdTitle: '仓库中的商品'
                },
                component: () =>
                    import('@/views/goods/offlineGoods/index'),
            },
            {
                name: 'comment',
                path: '/comment', //品论
                meta: {
                    secondTitle: '评价管理',
                    thirdTitle: '商品评价'
                },
                component: () =>
                    import('@/views/goods/comment/index'),
            },
        ],
    },
    {
        name: "transaction", //交易
        path: '/transaction',
        component: () =>
            import('@/views/transaction'),
        redirect: '/transaction/saleOrder', //默认显示release
        children: [{
                name: 'saleOrder',
                path: '/transaction/saleOrder', //发布商品
                meta: {
                    secondTitle: '交易管理',
                    thirdTitle: '已卖出的商品'
                },
                component: () =>
                    import('@/views/transaction/saleOrder/index'),
            },
            {
                name: 'refundOrder',
                path: '/refundOrder', //发布商品
                meta: {
                    secondTitle: '退款售后',
                    thirdTitle: '退款订单'
                },
                component: () =>
                    import('@/views/transaction/refundOrder/index'),
            },
            {
                name: 'refundOrderDetail',
                path: '/refundOrderDetail', //退款
                meta: {
                    secondTitle: '退款售后',
                    thirdTitle: '退款详情'
                },
                component: () =>
                    import('@/views/transaction/refundOrder/refundOrderDetail'),
            },
            {
                name: 'complaint',
                path: '/complaint', //发布商品
                component: () =>
                    import('@/views/transaction/complaint/index'),
            },
            {
                name: 'OrderDetil',
                path: '/OrderDetil', //订单详情
                component: () =>
                    import('@/views/transaction/OrderDetil/index'),
            }, {
                name: 'batchdel',
                path: '/batchdel', //订单详情
                component: () =>
                    import('@/views/transaction/batchdel/index'),
            },
        ]
    },
    {
        name: "settlement", //品台结算
        path: '/settlement',
        component: () =>
            import('@/views/settlement'),
        redirect: '/settlement/revenue', //默认显示release
        children: [{
                name: 'revenue',
                path: '/settlement/revenue', //营收概况
                meta: {
                    secondTitle: '财务管理',
                    thirdTitle: '营收概况'
                },
                component: () =>
                    import('@/views/settlement/revenue/index'),
            },
            {
                name: 'accountBalance',
                path: '/accountBalance', //收入明细
                meta: {
                    secondTitle: '财务管理',
                    thirdTitle: '收入明细'
                },
                component: () =>
                    import('@/views/settlement/accountBalance/index'),
            },
            {
                name: 'expenditure',
                path: '/expenditure', //支出明细
                meta: {
                    secondTitle: '财务管理',
                    thirdTitle: '支出明细'
                },
                component: () =>
                    import('@/views/settlement/expenditure/index'),
            },
            {
                name: 'wdrecord',
                path: '/wdrecord', //提现记录.
                meta: {
                    secondTitle: '财务管理',
                    thirdTitle: '提现记录'
                },
                component: () =>
                    import('@/views/settlement/wdrecord/index'),
            },
            {
                name: 'OrderRecord',
                path: '/OrderRecord', //订单明细
                component: () =>
                    import('@/views/settlement/OrderRecord/index'),
            }

        ]
    },
    {
        name: "marketing", //营销
        path: '/marketing',
        component: () =>
            import('@/views/marketing'),
        redirect: '/marketing/DiscountCoupon', //默认显示
        children: [{
                name: "DiscountCoupon",
                path: "/marketing/DiscountCoupon", //优惠券
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "优惠券"
                },
                component: () =>
                    import('@/views/marketing/DiscountCoupon/index')
            },
            {
                name: 'CouponsDetil',
                path: '/CouponsDetil', //订单详情
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "添加优惠券"
                },
                component: () =>
                    import('@/views/marketing/CouponsDetil/index'),
            },
            {
                name: "matchMax",
                path: "/marketing/matchMax", //搭配满减
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "搭配满减"
                },
                component: () =>
                    import('@/views/marketing/matchMax/index')
            },
            {
                name: "matchMaxDetail",
                path: "/marketing/matchMax/Detail", //搭配满减
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "搭配满减"
                },
                component: () =>
                    import('@/views/marketing/matchMax/Detail/index')
            },
            {
                name: "freeShipping",
                path: "/marketing/freeShipping", //满包邮
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "满减包邮"
                },
                component: () =>
                    import('@/views/marketing/freeShipping/index')
            },
            {
                name: "freeShippingDetail",
                path: "/marketing/freeShipping/Detail", //满包邮
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "满减包邮"
                },
                component: () =>
                    import('@/views/marketing/freeShipping/Detail/index')
            },
            {
                name: "makeGroup",
                path: "/marketing/makeGroup", //拼团
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "拼团"
                },
                component: () =>
                    import('@/views/marketing/makeGroup/index')
            },
            {
                name: "makeGroupDetail",
                path: "/marketing/makeGroup/Detail", //拼团
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "拼团"
                },
                component: () =>
                    import('@/views/marketing/makeGroup/Detail/index')
            },
            {
                name: "bargaining",
                path: "/marketing/bargaining", //砍价
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "砍价"
                },
                component: () =>
                    import('@/views/marketing/bargaining/index')
            },
            {
                name: "bargainingDetail",
                path: "/marketing/bargaining/Detail", //砍价
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "砍价"
                },
                component: () =>
                    import('@/views/marketing/bargaining/Detail/index')
            },

            {
                name: "limitDiscount",
                path: "/marketing/limitDiscount", //限时折扣
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "限时折扣"
                },
                component: () =>
                    import('@/views/marketing/limitDiscount/index')
            },
            {
                name: "limitDiscountDetail",
                path: "/marketing/limitDiscount/Detail", //限时折扣
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "限时折扣"
                },
                component: () =>
                    import('@/views/marketing/limitDiscount/Detail/index')
            },
            {
                name: "proCoupon",
                path: "/marketing/proCoupon/index", //推广优惠券
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "推广优惠券"
                },
                component: () =>
                    import('@/views/marketing/proCoupon/index')
            },
            {
                name: "proCouponDetail",
                path: "/marketing/proCoupon/Detail/index", //推广优惠券
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "添加推广惠券"
                },
                component: () =>
                    import('@/views/marketing/proCoupon/Detail/index')
            },
            {
                name: "newTestPlan",
                path: "/marketing/newTestPlan/index", //推广优惠券
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "新品试用"
                },
                component: () =>
                    import('@/views/marketing/newTestPlan/index')
            },
            {
                name: "newTestPlanDetail",
                path: "/marketing/newTestPlan/Detail/index", //推广优惠券
                meta: {
                    secondTitle: "营销活动",
                    thirdTitle: "新品试用详情"
                },
                component: () =>
                    import('@/views/marketing/newTestPlan/Detail/index')
            },

        ]
    },
    {
        name: "statistics", //统计
        path: '/statistics',
        component: () =>
            import('@/views/statistics'),
    },
    {
        name: "setting", //设置
        path: '/setting',
        redirect: '/setting/ExpressTemset', //默认显示
        component: () =>
            import('@/views/setting'),
        children: [{
                name: 'ExpressTemset',
                path: '/setting/ExpressTemset', //快递模板设置
                meta: {
                    secondTitle: '配送设置',
                    thirdTitle: '快递模板设置'
                },
                component: () =>
                    import('@/views/setting/ExpressTemset/index'),
            },
            {
                name: 'Returnaddress',
                path: '/Returnaddress', //退货地址设置
                meta: {
                    secondTitle: '配送设置',
                    thirdTitle: '退货地址设置'
                },
                component: () =>
                    import('@/views/setting/Returnaddress/index'),
            },
            {
                name: 'customerserAdm',
                path: '/customerserAdm', //客服设置

                component: () =>
                    import('@/views/setting/customerserAdm/index'),
            },
            {
                name: 'shopData',
                path: '/shopData', //店铺设置
                meta: {
                    secondTitle: '店铺设置',
                    thirdTitle: '店铺资料'
                },
                component: () =>
                    import('@/views/setting/shopData/index'),
            },
            {
                name: 'Role',
                path: '/Role', //角色
                meta: {
                    secondTitle: '账号权限',
                    thirdTitle: '人员管理'
                },
                component: () =>
                    import('@/views/setting/Role/index'),
            },
            {
                name: 'AddUser',
                path: '/AddUser', //角色

                component: () =>
                    import('@/views/setting/AddUser/index'),
            },
            {
                name: 'Log',
                path: '/Log', //日志
                meta: {
                    secondTitle: '账号权限',
                    thirdTitle: '操作日志'
                },
                component: () =>
                    import('@/views/setting/Log/index'),
            }, {
                name: 'ExpressTemsetAdd',
                path: '/ExpressTemsetAdd', //日志
                component: () =>
                    import('@/views/setting/ExpressTemsetAdd/index'),
            }
        ]
    },

    {
        name: "storeManagement", //门店
        path: '/storeManagement',
        redirect: '/storeManagement/storeApply', //默认显示
        component: () =>
            import('@/views/storeManagement'),
        children: [{
                name: 'storeApply',
                path: '/storeManagement/storeApply', //门店入驻申请
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '门店入驻申请'
                },
                component: () =>
                    import('@/views/storeManagement/storeApply/index'),
            },
            {
                name: 'storeApplydDetail',
                path: '/storeManagement/storeApplydDetail', //详情
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '申请详情'
                },
                component: () =>
                    import('@/views/storeManagement/storeApply/detail/index'),
            },
            {
                name: 'storeList',
                path: '/storeManagement/storeList', //门店列表
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '门店列表'
                },
                component: () =>
                    import('@/views/storeManagement/storeList/index'),
            },
            {
                name: 'storeDetail',
                path: '/storeManagement/storeDetail', //门店列表
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '添加门店'
                },
                component: () =>
                    import('@/views/storeManagement/storeList/detail/index'),
            },
            {
                name: 'storeProfile',
                path: '/storeManagement/storeProfile', //概况
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '门店概况'
                },
                component: () =>
                    import('@/views/storeManagement/storeProfile/index'),
            },
            {
                name: 'storeProfileDetail',
                path: '/storeManagement/storeProfileDetail', //概况
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '余额明细'
                },
                component: () =>
                    import('@/views/storeManagement/storeProfile/storeProfileDetail/index'),
            },
            {
                name: 'storeRanking',
                path: '/storeManagement/storeRanking', //排行榜
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '门店余额'
                },
                component: () =>
                    import('@/views/storeManagement/storeRanking/index'),
            },
            {
                name: 'storeRankingDetail',
                path: '/storeManagement/storeRankingDetail', //排行榜
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '余额明细'
                },
                component: () =>
                    import('@/views/storeManagement/storeRanking/storeRankingDetail/index'),
            },
            {
                name: 'storeWithdrawal',
                path: '/storeManagement/storeWithdrawal', //排行榜
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '门店提现'
                },
                component: () =>
                    import('@/views/storeManagement/storeWithdrawal/index'),
            },
            {
                name: 'storeSetting',
                path: '/storeManagement/storeSetting', //设置
                meta: {
                    secondTitle: '门店管理',
                    thirdTitle: '门店设置'
                },
                component: () =>
                    import('@/views/storeManagement/storeSetting/index'),
            },

        ]
    },

    {
        name: "promote", //推广
        path: '/promote',
        redirect: '/promote/wantToPromote', //默认显示
        component: () =>
            import('@/views/promote/index.vue'),
        children: [{
                name: 'wantToPromote',
                path: '/promote/wantToPromote', //我要推广
                meta: {
                    secondTitle: '推广',
                    thirdTitle: '我要推广'
                },
                component: () =>
                    import('@/views/promote/wantToPromote/index'),
            },
            {
                name: 'promotePlan',
                path: '/promote/promotePlan', //推广计划
                meta: {
                    secondTitle: '推广',
                    thirdTitle: '推广计划'
                },
                component: () =>
                    import('@/views/promote/promotePlan/index'),
            },
            {
                name: 'addPlan',
                path: '/promote/promotePlan/addPlan', //推广计划
                meta: {
                    secondTitle: '推广',
                    thirdTitle: '新建推广计划'
                },
                component: () =>
                    import('@/views/promote/promotePlan/addPlan/index'),
            },
            {
                name: 'promotionReport',
                path: '/promote/promotionReport', //推广报表
                meta: {
                    secondTitle: '推广',
                    thirdTitle: '推广报表'
                },
                component: () =>
                    import('@/views/promote/promotionReport/index'),
            },
        ]
    },

    {
        path: 'DEMO',
        path: '/DEMO',
        component: () =>
            import('@/views/DEMO'),
    },
    {
        path: '404',
        path: '/404',
        component: () =>
            import('@/views/404'),
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router