<template>
  <div  class="box">
    <span>排队状态: {{code}}</span>
    <span>当天限额: {{totalAvailable}}</span>
    <span>当前编号: {{nowInterviewed}}</span>
    <span>队伍长度: {{nowQueue}}</span>
    <el-button slot="reference" @click="backLogin" style="float: right; padding: 3px 0" type="text">退出登录</el-button>
  </div>
</template>

<script>
  // import fetch from "../util/fetch";
  // import {deepCopy} from "../util/utilFunc";

  import fetch from "../util/fetch";
  import {TIME} from "../util/viariable"
  export default {
    name: "v-header",
    data() {
      return {
        code: null, //状态
        totalAvailable: null, //总额
        totalQueueLimit: null ,//队伍长度,
        nowQueue: null , //当前编号
        timer: null,
        nowInterviewed: null
      }
    },
    created() {
      this.timer = setInterval(()=> {
        this.getCurrentDetails()
      },TIME)
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      getCurrentDetails() {
        fetch({
          url: '/api/admin/queueStatus',
          type: 'get'
        }).then(res => {
          if (res.data.code === 200) {
            // console.log(res.data);
            this.code = this.getStatus(res.data.data.code);
            this.totalAvailable = res.data.data.totalAvailable;
            this.totalQueueLimit = res.data.data.totalQueueLimit;
            this.nowQueue = res.data.data.nowQueue;
            this.nowInterviewed = res.data.data.nowInterviewed;
          }
        })
      },
      getStatus(num) {
       switch (num) {
         case 0:
           return '未开启排队';
         case 1:
           return '允许排队';
         case 2:
           return '排队限额已满但未达总限额';
         case 3:
           return '总限额已满';
         case 4:
           return '已排队';
       }
      },
      backLogin() {
        this.$router.push('/')
      }
    }
  }
</script>


<style scoped lang="less">
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .setting-group {
      flex: 1;

      .el-input {
        width: 200px !important;
      }

      .el-button {
        height: 36px;
        margin-left: 10px;
      }
    }

    .view-group-item {
      flex: 1;

      span {
        margin-right: 15px;
        font-size: 16px;
      }
    }

  }
</style>