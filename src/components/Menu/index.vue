<template>
  <el-menu
    class="menu-list"
    :active-text-color="theme.activeColor"
    :background-color="theme.bgColor"
    :text-color="theme.textColor"
    :default-active="activeItem"
    :router="true"
    :collapse="isCollapse"
    :default-openeds="openedsItem"
    @select="menuSelect"
  >
    <MenuList :menuList="menuList" :initCfg="initCfg"></MenuList>
    <el-tooltip v-if="hasCollapseBtn" effect="dark" content="显示/隐藏菜单" placement="right-end">
      <div class="menu-collapse" @click="collapse">
        <i :class="{'el-icon-s-fold':!isCollapse,'el-icon-s-unfold':isCollapse}"></i>
      </div>
    </el-tooltip>
  </el-menu>
</template>

<script>
/**
 * @name 组件名
 * @author your name
 * @description 简单描述
 */
export default {
  name: 'Menu',
  components: {},
  props: {
    // 菜单key映射
    initCfg: {
      type: Object,
      default: () => ({
        path: 'path',
        title: 'title',
        icon: 'icon',
        children: 'children',
      }),
    },
    // 菜单列表
    menuList: {
      type: Array,
      default: () => [],
    },
    // 选中标识
    activeItem: {
      type: String,
      default: '',
    },
    // 主题颜色
    theme: {
      type: Object,
      default: () => ({
        activeColor: '#0766FF',
        bgColor: '#2a3150',
        textColor: '#fff',
      }),
    },
    // 展开按钮
    hasCollapseBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openedsItem: [],
      isCollapse: false,
    };
  },
  methods: {
    menuSelect(index, indexPath) {
      const { openedsItem } = this;
      this.$emit('menuSelect', { index, indexPath, openedsItem });
    },
    // 导航折叠
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-list {
  position: relative;
  &.el-menu--collapse {
    min-width: 60px !important;
    width: 60px;
  }
  .menu-collapse {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    border-top: 1px solid rgba(235, 194, 194, 0.5);
    cursor: pointer;
  }
}
</style>
