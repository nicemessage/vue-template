<template>
  <Menu
    class="aside-menu"
    :menuList="menuList"
    :activeItem="activeItem"
    :hasCollapseBtn="true"
    :initCfg="{
      path: 'path',
      title: 'name',
      icon: 'icon',
      children: 'children'
      }"
  />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Aside',
  components: {},
  props: [],
  data() {
    return {
      activeItem: '',
      openedsItem: [],
      menuList: [],
    };
  },
  computed: {
    ...mapGetters(['authInfoGet', 'routesGet']),
  },
  watch: {
    $route: {
      handler(val) {
        const reg = /^\/\w+/;
        const filname = val.fullPath.match(reg);
        if (filname === '/') return;
        this.menuList = this.routesGet;
        this.activeItem = val.fullPath;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 查找子导航
    findChildren(pathName, routes) {
      console.log(pathName, routes);
      return routes.find(item => item.path === pathName).children || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.aside-menu {
  position: relative;
  width: 220px;
  height: 100%;
  background-color: #2a3150;
  color: #fff;
  /deep/ .is-active {
    background-color: $activeColor !important;
    color: $asideTextColor !important;
  }
}
.icon {
  color: #fff;
  font-size: 20px;
  margin-right: 15px;
}
</style>
