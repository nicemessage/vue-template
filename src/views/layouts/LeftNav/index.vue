<template>
  <el-container>
    <!-- 头部 -->
    <el-header height="60px">
      <HeaderView :headerInfo="headerInfo" />
    </el-header>
    <el-container>
      <AsideView />
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
    </el-container>
  </el-container>
</template>

<script>
import HeaderView from './Header/index';
import AsideView from './Aside/index';

export default {
  name: 'TopNavContainer',
  components: {
    HeaderView,
    AsideView,
  },
  props: [],
  data() {
    return {
      headerInfo: {},
    };
  },
  computed: {},
  created() {
    this.headerInfo = {
      logoText: ['Vue', 'Demo'],
      iconList: [
        {
          name: '银河',
          icon: 'el-icon-eleme',
          url: 'http://7.jd.com',
          num: 1,
        },
        {
          name: 'API分类管理',
          icon: 'el-icon-eleme',
          path: '/platform/api-classify',
        },
        {
          name: 'API开发',
          icon: 'el-icon-eleme',
          path: '/personal/api',
          num: 100,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
