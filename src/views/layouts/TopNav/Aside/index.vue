<template>
  <div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Aside',
  components: {},
  props: [],
  data() {
    return {
      isCollapse: false,
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
        const filname = val.fullPath.match(reg)[0];

        if (filname === '/') return;
        this.menuList = this.findChildren(filname, this.routesGet);
        this.activeItem = val.fullPath;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 查找子导航
    findChildren(pathName, routes) {
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
