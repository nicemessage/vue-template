// 获取当前components下所有文件路径
const context = require.context('@/components', true, /\.vue$/);
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
      const component = model.default || model;
      Vue.component(`${component.name}`, component);
    });
  },
};
