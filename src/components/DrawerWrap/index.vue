<template>
  <el-drawer
    class="drawer-wrap"
    ref="drawerRef"
    :title="drawerCfg.title"
    :visible.sync="drawerCfg.visible"
    :show-close="showClose"
    :direction="direction"
    :size="width"
    :before-close="beforeClose"
    @close="closeCallback"
    @open="openCallback"
  >
    <div class="drawer-wrap-title" slot="title">
      <span class="title-centent">{{drawerCfg.title}}</span>
      <div class="drawer-btns">
        <el-button
          class="mini-btn--supmini"
          type="primary"
          size="mini"
          :hasConfrim="hasConfrim"
          :loading="drawerCfg.loading"
          @click="handleConfirm"
        >{{ drawerCfg.loading ? '提交中...' : '提交' }}</el-button>
        <el-button class="mini-btn--supmini" size="mini" @click="handleCancel">取 消</el-button>
      </div>
    </div>
    <div class="drawer-wrap-body">
      <slot></slot>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'DrawerWrap',
  components: {},
  props: {
    drawerCfg: {
      type: Object,
      default: () => ({
        title: 'drawerTitle',
        visible: false,
        loading: false,
      }),
    },
    // 是否有提交按钮 默认有
    hasConfrim: {
      type: Boolean,
      default: true,
    },
    // 是否有x  默认没有
    showClose: {
      type: Boolean,
      default: false,
    },
    // 展开方向 默认从右到左
    direction: {
      type: String,
      default: 'rtl',
    },
    // size 百分比宽度
    width: {
      type: String,
      default: '60%',
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {
    drawerCfg: {
      handler(val) {
        this.$emit('updata:drawerCfg', val);
      },
    },
  },
  methods: {
    // 打开之后
    openCallback() {
      this.$emit('openCallback');
    },
    // 提交
    handleConfirm() {
      this.$emit('handleConfirm');
    },
    // 取消
    handleCancel() {
      this.$emit('handleCancel');
    },
    // 关闭之前
    beforeClose(down) {
      this.$emit('beforeClose', down);
    },
    // 关闭之后
    closeCallback() {
      this.$emit('closeCallback');
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-wrap {
  width: 100%;
  height: 100%;
  .drawer-wrap-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-centent {
      color: #333;
      font-weight: 700;
      font-size: 18px;
    }
    .drawer-btns {
      .mini-btn--supmini {
        padding: 7px 14px;
      }
    }
  }
}
</style>
