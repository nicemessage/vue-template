/** 元素自动获取焦点 * */
export default {
  directiveName: 'autoFocus',
  lifeCycle: {
    bind() {
      // 只调用一次，指令第一次绑定到元素时调用
    },
    inserted(el) {
      // 被绑定元素插入父节点时调用
      console.log(el);
      el.focus();
    },
    unbind() {
      // 只调用一次，指令与元素解绑时调用
    },
  },
};
