module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // 静态资源目录
    assetsDir: './static',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    configureWebpack: () => {
        // 配置参考： https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
    },
    // 修改 Loader 选项
    chainWebpack: () => {
        // 配置参考：https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        // extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        host: 'localhost',
        port: 8080,
        https: false,
        hotOnly: true,
        hot: true,
        proxy: {
            // 设置代理
            '/upload': {
                target: 'http://10.102.17.57:8081',
                changeOrigin: true,
                pathRewrite: {
                  '^/upload': '/upload'
                }
            },

           
        }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
};