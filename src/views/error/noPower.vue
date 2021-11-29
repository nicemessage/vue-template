<template>
  <div class="page-no-power">
    <img :src="img" />
  </div>
</template>

<script>
import imgfor404 from '@/assets/images/common/404.png';

export default {
  name: 'NoPower',
  data() {
    return {
      img: imgfor404,
    };
  },
};
</script>

<style lang="scss" scoped>
.page-404 {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
