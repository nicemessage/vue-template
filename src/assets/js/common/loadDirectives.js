// 获取当前components下所有文件路径
const context = require.context('@/directives', true, /\.js$/);
// 获取文件路径
const fileList = context.keys();

// 过滤非必要加载文件
const filter = [];

export default {
  install(Vue) {
    fileList.filter((item) => {
      return !filter.filter(fd => item.includes(fd)).length;
    }).forEach(item => {
      // 加载文件
      const model = context(item);
      const directive = model.default || model;
      console.log(directive);
      Vue.directive(directive.directiveName, { ...directive.lifeCycle });
    });
  },
};
