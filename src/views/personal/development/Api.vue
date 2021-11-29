<template>
  <div class="page page-personal page-api">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Api',
  components: {},
  data() {
    return {};
  },
  props: [],
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {},
  },
};
</script>

<style lang="scss" scoped>
</style>
