const port = process.env.port || 9528 // dev port
let cdn = { css: [], js: [] }
// 通过环境变量 来区分是否使用cdn
const isProd = process.env.NODE_ENV === 'production' // 判断是否是生产环境
let externals = {}
if (isProd) {
    // 如果是生产环境 就排除打包 否则不排除
    externals = {
        // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
        'vue': 'Vue', // 后面的名字不能随便起 应该是 js中的全局对象名
    }
    cdn = {
        js: [
            'https://cdn.jsdelivr.net/npm/vue@2.6.14', // vuejs         
        ]
    }
}
module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
    },
    configureWebpack: {
        externals
    },
    chainWebpack (config) {
        config.plugin('html').tap((args) => {
            args[0].cdn = cdn
            return args
        })
        config.when(process.env.NODE_ENV !== 'development', config => {
            config.optimization.minimizer('terser').tap(options => {
                options[0].terserOptions.compress.drop_console = true
                return options
            })
        })
    }
}


