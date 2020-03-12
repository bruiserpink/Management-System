module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'Bcommon': '@/common',
        'Lcommon': 'components/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'store': '@/store',
      }
    }
  },
  chainWebpack: config => {
    //判断当前运行环境选择入口
    //指定发布模式
    config.when(process.env.NODE_ENV === 'production',config => {
      config.entry('app').clear().add('./src/main-prod.js')
      //根据当前模式将其模式值传给public/index.html主页，从而指定不同的主页数据
      config.plugin('html').tap(args => {
        args[0].isProd = true;
        return args;
      })
      //在发布模式声明以下包在build时不打包，而是使用外部cdn资源
      config.set('externals',{
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'Nprogress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    config.when(process.env.NODE_ENV === 'development',config => {
      config.entry('app').clear().add('./src/main-dev.js')
      //根据当前模式将其模式值传给public/index.html主页，从而指定不同的主页数据
      config.plugin('html').tap(args => {
        args[0].isProd = false;
        return args;
      })
    })
  }
}
