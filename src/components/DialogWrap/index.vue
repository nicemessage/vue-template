<template>
  <el-dialog
    class="dialog-wrap"
    :width="dialogWidth"
    :append-to-body="appendToBody"
    :visible.sync="dialogCfg.visible"
    @close="closeCallback"
    @open="openCallback"
  >
    <div class="dialog-wrap-title" slot="title">{{dialogCfg.title}}</div>
    <div class="dialog-wrap-body">
      <slot></slot>
    </div>
    <span slot="footer" class="dialog-wrap-footer">
      <el-button size="small" @click="handleCencel">取 消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleConfrim"
      >{{dialogCfg.loading ? '提交中...' : '确认'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogWrap',
  components: {},
  props: {
    dialogCfg: {
      type: Object,
      default: () => ({
        title: 'dialogTitle',
        visible: false,
        loading: false,
      }),
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    dialogWidth: {
      type: [String],
      default: '50%',
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogType: '',
    };
  },
  computed: {},
  watch: {
    dialogCfg: {
      handler(val) {
        this.$emit('updata:dialogOps', val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleConfrim() {
      this.$emit('handleConfrim');
    },
    handleCencel() {
      this.$emit('handleCencel');
    },
    openCallback() {
      this.$emit('openCallback');
    },
    closeCallback() {
      this.$emit('closeCallback');
    },
  },
};
</script>

<style scoped lang="scss">
</style>
