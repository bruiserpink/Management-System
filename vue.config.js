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
  }
}
