<template>
  <el-menu
    class="el-menu-demo" mode="horizontal"
    :default-active="$route.path"
  >

    <el-menu-item index="/home">
      <router-link to="/home" tag="li">
        <i class="el-icon-s-tools"></i>
        <span>面试官设置</span>
      </router-link>
    </el-menu-item>
    <el-menu-item index="/home/student">
      <router-link to="/home/student" tag="li">
        <i class="el-icon-user-solid"></i>
        <span>学生列表</span>
      </router-link>
    </el-menu-item>
    <el-menu-item index="/home/interviewer">
      <router-link to="/home/interviewer" tag="li">
        <i class="el-icon-s-comment"></i>
        <span>面试队列</span>
      </router-link>
    </el-menu-item>
    <span class="message-detail">
      <MyHeader></MyHeader>
    </span>
  </el-menu>
</template>

<script>
  import MyHeader from "../myHeader"

  export default {
    name: "Menu",
    components: {
      'MyHeader': MyHeader
    }
  }
</script>

<style scoped>
  .message-detail {
    display: inline-block;
    width: 40vw;
  }
</style>