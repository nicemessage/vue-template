import MenuConfig from '../menus';

const global = {
  /**
   * 通过模块路由获取菜单(区别于无header导航)
   */
  getMenus(routerPath) {
    if (routerPath === '/') {
      return [];
    }
    const modelRouter = routerPath.split('/')[1];
    return MenuConfig.PageMenu[modelRouter];
  },
};
export default global;
