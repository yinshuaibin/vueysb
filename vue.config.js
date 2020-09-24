// vue.config.js
module.exports = {
  // 选项...
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',

  // outputDir assetsDir indexPath 默认

  // filenameHashing 默认true 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希

  // pages 不知道干嘛的

  // 默认default, 将eslint错误输出到页面, 并且编译失败  true/warning: 输出编译警告 error/default编译失败, 下面是仅在生产环境使用
  lintOnSave: process.env.NODE_ENV !== 'production',

  // runtimeCompiler 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右

  // transpileDependencies默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来

  // 生成.map文件, 生产环境不需要的话设置为false, 默认true
  productionSourceMap: false,

  // crossorigin 默认undefined 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响
  // 添加这个属性， 并且服务器允许跨域后，会得到精确的报错信息。添加这个属性，但服务器不允许跨域，就会被同源策略阻止加载资源。不添加这个属性，只能知道报错，不知道具体信息
  // https://cli.vuejs.org/zh/config 官网

  devServer: {
    // 生产环境端口号
    port: 9999
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:9998',
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/': '/'
    //     }
    //   },
    //   '/foo': {
    //     target: '<other_url>'
    //   }
    // }
  }
}
