const path = require('path')
const webpack = require('webpack')
module.exports = {
    // 构建输出目录
    outputDir: process.env.outputDir,
    // 当和baseUrl同时出现时，publicPath优先级更高
    publicPath: './',

    // 静态资源目录(js,css,img,fonts)
    assetsDir: 'static',

    // 是否开启eslint保存检测, 有效值: true || false || 'error'
    lintOnSave: false,

    // 是否生成map文件
    productionSourceMap: false,

    // configureWebpack: config => {
    //     config.externals = {
    //         'vue': 'Vue',
    //         'vue-router': 'VueRouter',
    //         'AMap': 'AMap'
    //         //  'moment': 'moment'
    //     }
    // },
    // chainWebpack: (config) => {
    //     config.resolve.alias
    //         .set('@', resolve('src'))
    //         .set('components', resolve('src/components'))
    //         .set('api', resolve('src/api'))
    //         .set('static', resolve('src/static'))
    // }
    devServer: {
        port: 8089,
        open: true,
        proxy: {
            // 配置跨域
            '/v3': {
                target: 'https://restapi.amap.com',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    '^/v3': ''
                }
            },
            '/': {
                target: 'https://t-api.zk-mall.net/', //测试环境
                ws: false,
                changOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },

        }

    },

    // pluginOptions: {
    //   'style-resources-loader': {
    //     preProcessor: 'less',
    //     patterns: []
    //   }
    // },

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, "src/common/style/less/variable.less")] // 引入全局样式变量
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    }
};