<template>
  <div class="header">
    <div class="header-left">
      <img class="logo" src="@/assets/images/common/header-logo.png" @click="goGalaxy" alt="银河" />
      <div class="logoText" @click="goHome">
        <span class="span">{{ headerInfo.logoText[0] }}</span>
        <span class="a">{{ headerInfo.logoText[1] }}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="right-user">
        <img class="user-img" src="@/assets/images/common/user-icon.png" alt="默认头像" />
        <div class="user-menu">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ authInfoGet.realName ? authInfoGet.realName : '请登录' }}
              <i class="iconfont iconxiala"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @name 组件名
 * @author your name
 * @description 简单描述
 */
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  coponents: {},
  props: ['headerInfo'],
  data() {
    return {
      activeIndex: '/',
    };
  },
  computed: {
    ...mapGetters(['authInfoGet', 'routesGet']),
  },
  watch: {
    $route: {
      handler(val) {
        const reg = /^\/\w+/;
        const fileName = val.redirectedFrom || val.fullPath;
        if (fileName.match(reg)) return;
        this.activeIndex = fileName.match(reg)[0];
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    initPage() {},
    goGalaxy() {
      window.location.href = process.env.VUE_APP_GALAXY_URL;
    },
    goHome() {
      this.$router.push('/');
    },
    goLink(item) {
      if (item.path) {
        this.$router.push({ path: item.path });
      } else if (item.url) {
        window.open(item.url);
      } else {
        console.log('错误');
      }
    },
    handleCommand(command) {
      if (command === 'logout') {
        window.location.href = `${process.env.VUE_APP_LOGOUT + window.location.host}${process.env.NODE_ENV === 'prod' ? '/gmc' : ''}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .header-left {
    width: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .logo {
      width: 80px;
      height: 25px;
    }
    .logoText {
      margin-left: 10px;
      font-size: 20px;
      .span {
        color: #fff;
      }
      .a {
        color: #156dc3;
      }
    }
  }
  .header-center {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    .el-menu-item {
      padding: 0 50px;
    }
  }
  .header-right {
    display: flex;
    padding-right: 20px;
    .right-btn-link {
      display: flex;
      justify-content: center;
      align-items: center;
      .cell {
        margin-right: 30px;
      }
      .el-button {
        color: #fff;
      }
      .el-badge__content {
        background: #f44343;
        border: 0;
      }
    }
    .right-icon-link {
      display: flex;
      justify-content: center;
      align-items: center;
      .cell {
        margin-right: 30px;
        cursor: pointer;
      }
      .headerbutton {
        font-size: 24px;
        color: #fff;
      }
      .el-badge__content {
        background: #f44343;
        border: 0;
      }
    }
    .right-user {
      display: flex;
      align-items: center;
      .user-img {
        width: 30px;
        height: 30px;
      }
      .user-menu {
        margin-left: 5px;
        .el-dropdown {
          color: #fff;
          .el-dropdown-link {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
