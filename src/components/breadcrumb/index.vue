<template>
  <div :class="{'page-breadcrumb': hasBreadcrum}">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in $route.meta.breadcrumbArry" :key="item.path" :to="item.path">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <slot name="breadcrumbButtons"></slot>
  </div>
</template>

<script>
/**
 * @name 组件名
 * @author your name
 * @description 简单描述
 */
export default {
  name: 'Breadcrumb',
  components: {},
  props: {
  },
  data() {
    return {};
  },
  computed: {
    hasBreadcrum() {
      return this.$route.meta.breadcrumbArry ? this.$route.meta.breadcrumbArry.length : false;
    },
  },
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.page-breadcrumb {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &::before {
    content: "\e638";
    font-family: "iconfont";
    font-size: 22px;
    color: #0766ff;
  }
  &.one-class{
    /deep/.el-breadcrumb__inner{
      font-weight: bolder;
    }
  }
}
</style>
