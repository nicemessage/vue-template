<template>
  <el-main>
    <Breadcrumb />
    <transition name="slide-left" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </el-main>
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
  position: absolute;
  width:100%;
  transition: transform 0.3s ease-out;
}
.slide-left-enter{
  transform: translate(100%, 0);
}
.slide-left-leave-active{
  transform: translate(-50%, 0);
}
</style>
