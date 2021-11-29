<template>
  <fragment>
    <template v-for="item in menuList">
      <el-menu-item
        v-if="!item[initCfg.children] || !item[initCfg.children].length"
        :key="item[initCfg.path]"
        :index="item[initCfg.path]"
      >
        <i v-if="item[initCfg.icon]" :class="[ 'icon', 'iconfont' ,item[initCfg.icon]]"></i>
        <span slot="title">{{item[initCfg.title]}}</span>
      </el-menu-item>
      <el-submenu
        v-if="item[initCfg.children] && item[initCfg.children].length"
        :key="item[initCfg.path]"
        :index="item[initCfg.path]"
      >
        <template slot="title">
          <i v-if="item[initCfg.icon]" :class="[ 'icon', 'iconfont' ,item[initCfg.icon]]"></i>
          <span slot="title">{{item[initCfg.title]}}</span>
        </template>
        <MenuList :menuList="item[initCfg.children]" :initCfg="initCfg"></MenuList>
      </el-submenu>
    </template>
  </fragment>
</template>

<script>
/**
 * @name 组件名
 * @author your name
 * @description 简单描述
 */
export default {
  name: 'MenuList',
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
    // 主题颜色
    theme: {
      type: Object,
      default: () => ({
        activeColor: '#0766FF',
        bgColor: '#2a3150',
        textColor: '#fff',
      }),
    },
  },
  data() {
    return {
      openedsItem: [],
    };
  },
  methods: {
    menuSelect(index, indexPath) {
      const { openedsItem } = this;
      this.$emit('menuSelect', { index, indexPath, openedsItem });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: #fff;
  font-size: 20px;
  margin-right: 15px;
}
</style>
