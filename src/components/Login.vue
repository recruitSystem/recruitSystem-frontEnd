<template>
  <div class="container">
    <el-card class="login-box">
      <h1 class="login-box-header">登录</h1>
      <el-form
        :label-position="labelPosition"
        :model="ruleForm"
        status-icon :rules="rules"
        ref="ruleForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button class="submit-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import fetch from '../util/fetch'
  import {deepCopy, saveCookie} from '../util/utilFunc'
  import store from '../store/index'
  export default {
    name: 'Login',
    data() {
      return {
        labelPosition: 'right',
        ruleForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'change'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            fetch({
              url: '/api/admin/login',
              type: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                username: this.ruleForm.username,
                password: this.ruleForm.password
              }
            }).then(res => {
              console.log(res)
              if (res.data.code === 200) {
                saveCookie('usermessage', res.data.data);
                let data = deepCopy(res.data.data)
                this.$router.push({path: '/home', replace: false})
                store.dispatch('setLoginDataAction', data);
              }
            })
          } else {
            this.$message({
              message: '登录失败',
              type: 'error'
            })
            return false;
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../assets/the_peanuts_snoopy_and_charlie_2015_movie-wallpaper-2160x1440.jpg") 100% 100% no-repeat;
  }
  .login-box-header {
    font-size: 20px;
    text-align: center;
  }

  .submit-btn {

  }
</style>
