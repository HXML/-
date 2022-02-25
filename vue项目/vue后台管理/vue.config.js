const path = require('path')
module.exports = {
    // 构建输出目录
    outputDir: 'dist',

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
            '/': {
                // target: 'http://192.168.2.201:83/', //发开联调
                // target: 'http://dev-api.zk-mall.net/', //dev
                target: 'https://t-api.zk-mall.net/', //test
                // target: 'http://192.168.2.234:5555/', //zipeng
                // target: 'https://localhost:44314/', //开发环境
                ws: false,
                changOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    },
    // pluginOptions: {
    //   'style-resources-loader': {
    //     preProcessor: 'less',
    //     patterns: []
    //   }
    // },
    //     pluginOptions: {
    //         'style-resources-loader': {
    //           preProcessor: 'less',
    //           patterns: [path.resolve(__dirname, "src/common/style/less/variable.less")] // 引入全局样式变量
    //         }
    //   }
};