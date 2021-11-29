<template>
  <div class="header">
    <div class="header-left">
      <img class="logo" src="@/assets/images/common/header-logo.png" @click="goGalaxy" alt="银河" />
      <div class="logoText" @click="goHome">
        <span class="span">{{ headerInfo.logoText[0] }}</span>
        <span class="a">{{ headerInfo.logoText[1] }}</span>
      </div>
    </div>
    <div class="header-center">
      <Menu
        class="hander-menu"
        :menuList="handerRoutes"
        :activeItem="activeIndex"
        :initCfg="{
          path: 'path',
          title: 'name',
          icon: 'icon',
          children: 'children'
        }"
        :theme="{
          activeColor: '#fff',
          bgColor: '#141832',
          textColor: '#c0c4cc',
        }"
      />
      <!-- <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        background-color="#141832"
        text-color="#c0c4cc"
        active-text-color="#fff"
        :router="true"
      >
        <el-menu-item
          :index="item.path"
          v-for="item in routesGet"
          :key="item.path"
        >{{item.name}}</el-menu-item>
      </el-menu>-->
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
      activeIndex: '',
      handerRoutes: [],
    };
  },
  computed: {
    ...mapGetters(['authInfoGet', 'routesGet']),
  },
  watch: {
    $route: {
      handler(val) {
        this.handerRoutes = [];
        this.routesGet.forEach(item => {
          this.handerRoutes.push({
            ...item,
            children: null,
          });
        });
        const reg = /^\/\w+/;
        const fileName = val.fullPath.match(reg)[0];
        if (fileName === '/') return;
        this.activeIndex = fileName;
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
        window.location.href = `${process.env.VUE_APP_LOGOUT
          + window.location.host}${
          process.env.NODE_ENV === 'prod' ? '/gmc' : ''
        }`;
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
    overflow-x: auto;
    .hander-menu {
      min-width: 300px;
      display: flex;
      /deep/ .el-menu-item {
        font-size: 16px;
        font-weight: border;
        padding: 0 20px;
        margin: 0 20px;
      }
      /deep/ .is-active {
        color: $activeColor !important;
        border-bottom: 2px solid $activeColor !important;
      }
    }
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
