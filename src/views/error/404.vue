<template>
  <div class="errer_404_wrapper animate__animated animate__bounce">
    <h2>OOPS!</h2>
    <img :src="require('@/assets/images/common/404.png')" alt="404" class="animated swing hinge" />
    <el-button @click="$router.push({name: 'home'})">
      <i type="home"></i>返回主页
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.errer_404_wrapper {
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  h2 {
    font-size: 25px;
    color: #666;
    text-align: center;
  }
  img {
    margin: 20px 0;
  }
  /deep/ .el-button {
    flex-shrink: 0;
    width: 100px;
    margin: auto;
  }
}
</style>
