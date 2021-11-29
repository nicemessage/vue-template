const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  assetsDir: 'static',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  // webpack配置
  chainWebpack: config => {
    // 别名配置
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'));

    // sass变量加载
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 全局变量资源路径
          resources: ['./src/assets/css/variable.scss', './src/assets/css/initialimixin.scss'],
          // 也可以选择全局变量路径数组, 如果你有多个文件需要成为全局,就可以采用这种方法
          // resources: ['./path/to/vars.scss', './path/to/mixins.scss']
          // resources: './path/to/vars.scss'
          // 或者你可以将多个scss文件@import到一个main.scss用第一种方法，都是可以的
        })
        .end();
    });

    // gzip加速减压
    if (process.env.NODE_ENV === 'prod') {
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
          threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        }),
      );
    }
  },
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: 'vue-demo-web.jd.com',
    port: 80,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://gateway.test.jd.com/galaxy-data-asset/', // 跨域访问
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理
        secure: false, // 将安全设置为false,才能访问https开头的
        pathRewrite: {
          '^/api': '', // 这里理解成用‘/api’代替target里面的地址
        },
      },
      '/limit': {
        // target: 'http://10.222.9.29:8081', // 跨域访问
        target: 'http://test.dataserver.jd.com:8082', // 跨域访问
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理
        secure: false, // 将安全设置为false,才能访问https开头的
        pathRewrite: {
          '^/limit': '', // 这里理解成用‘/api’代替target里面的地址
        },
      },
    },
  },
};
