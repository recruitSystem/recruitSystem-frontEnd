<template>
  <div class="home-page">
    <el-container class="big-container" style="height: 100vh; border: 1px solid #eee">
      <el-container>
        <el-header id="header" style="height: 8vh; text-align: right; font-size: 15px">
          <MyMenu></MyMenu>
        </el-header>
        <el-main>
          <el-row :gutter="10">
            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
              <div class="grid-content bg-purple">
                <CurrentStudentMessage></CurrentStudentMessage>
              </div>
            </el-col>
            <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
              <div class="grid-content bg-purple-light">
                <router-view class="contentIn"></router-view>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
  .home-page {
    height: 100vh;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 8vh;
  }

  .el-main {
    height: 100%;
  }

  .el-aside {
    color: #333;
  }
  .el-main {
    height: 85vh;
  }

  .el-card__body {
    padding: 0 !important;
  }

</style>

<script>
  import store from "../store";
  import CurrentStudentMessage from "./CurrentStudentMessage";
  import MyMenu from "./menu/index"

  export default {
    name: 'Home',
    components: {
      'CurrentStudentMessage': CurrentStudentMessage,
      'MyMenu': MyMenu
    },
    created() {

    },
    data() {
      return {
        lightIndex: '/',
      }
    },
    methods: {
      setDefault() {

      }
    },
    computed: {
      group: () => {
        return store.state.loginData.group;
      }
    }
  };
</script>