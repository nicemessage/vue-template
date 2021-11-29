<template>
  <el-container>
    <AsideView />
    <el-main>
      <Breadcrumb />
      <transition name="slide-left" appear>
        <router-view class="view"></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import AsideView from '../Aside/index';

export default {
  name: 'Container',
  components: {
    AsideView,
  },
  props: [],
  data() {
    return {};
  },
  computed: {},
  created() {},
};
</script>

<style lang="scss" scoped>
.el-main {
  background: #f4f7fe;
  padding: 10px;
}
.view {
  width:100%;
  transition: transform 0.3s ease-out;
}
.slide-left-enter{
  opacity: 1;
}
.slide-left-leave-active{
  opacity: 0;
}
</style>
