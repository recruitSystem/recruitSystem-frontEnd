<template>

  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix"
    >
      <span :class="isSelect">{{studentMessage.name? '当前学生':  "请选择学生"}}</span>
    </div>
    <div class="detail-box">
      <div class="text item">
        <span class="detail-label">姓名:</span> {{studentMessage.name}}
      </div>
      <div class="text item">
        <span class="detail-label">学号:</span> {{studentMessage.schoolId}}
      </div>
      <div class="text item">
        <span class="detail-label">学院:</span> {{studentMessage.institute}}
      </div>
      <div class="text item">
        <span class="detail-label">专业: </span>{{studentMessage.major}}
      </div>
      <div class="text item">
        <span class="detail-label">性别: </span>{{studentMessage.sex}}
      </div>
      <div class="text item">
        <span class="detail-label">电话:</span> {{studentMessage.phone}}
      </div>
      <div class="text item">
        <span class="detail-label">邮箱:</span> {{studentMessage.mail}}
      </div>
      <div class="text item">
        <span class="detail-label">自我介绍:</span> {{studentMessage.introduction}}
      </div>
      <div class="text item">
        <span class="detail-label">方向:</span> {{studentMessage.direction}}
      </div>
      <div class="text item">
        <span class="detail-label">技能: </span>{{studentMessage.skill}}
      </div>
      <div class="text item">
        <span class="detail-label">对工作室的认识: </span> {{studentMessage.know}}
      </div>
      <div class="text item">
        <span class="detail-label">报名时间:</span> {{studentMessage.timestamp}}
      </div>
      <div class="text item">
        <span class="detail-label">是否通过: </span> {{studentMessage.pass}}
      </div>
      <div class="text item">
        <span class="detail-label">状态: </span> {{studentMessage.status}}
      </div>
    </div>
    <div class="oporate-box">
        <el-button size="mini" @click="passInterview(true)" type="success" round>通过</el-button>
        <el-button size="mini" @click="passInterview(false)" type="danger" round>淘汰</el-button>
    </div>
  </el-card>

</template>
<style lang="less">
  .text {
    font-size: 14px;
    line-height: 2;
  }

  .item {
    margin-bottom: 18px;
  }

  .detail-label {
    margin-right: 10px;
    color: #4792E6;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 100%;
    height: 85vh;
    .el-card__body {
      padding-right: 0 !important;
    }
    .operate-box {
      display: flex;
      align-items: center;
    }
  }
  .detail-box{
    height: 70vh;
    overflow-y: scroll;
  }
  .detail-box::-webkit-scrollbar {
    background-color: lightgray;
    width: 6px;
    height: 6px;
    background-clip: padding-box;
  }

  /*滚动条两端方向按钮*/

  .detail-box::-webkit-scrollbar-button {
    display: none;
  }

  /*滚动条中间滑动部分*/

  .detail-box::-webkit-scrollbar-thumb {
    background-color: #D2D2D2;
    border-radius: 5px;
  }

  .detail-box::-webkit-scrollbar-track {
    background-color: #fff;
  }

  /*滚动条右下角区域*/

  .detail-box::-webkit-scrollbar-corner {
    background-color: #fff;
  }
  .not-select {
    color: #F56C6C;
  }
  .selected {

  }
</style>
<script>
  import fetch from "../util/fetch";
  import {deepCopy} from "../util/utilFunc";
  import moment from "moment"

  export default {
    name: 'CurrentStudentMessage',
    data() {
      return {
        studentMessage: {},
        currentId: null
      }
    },
    computed: {
      studentId() {
        return this.$store.getters.getStudentId
      },
      isSelect() {
        if(this.studentMessage.name) {
          return 'selected'
        } else {
          return  'not-select'
        }
      }
    },
    watch: {
      studentId: function (val) {
        // console.log('new: %s, old: %s', val, oldVal)
        this.getStudentList({
          id: val
        })
      },
    },
    methods: {
      getStudentList(data) {
        let paramObj = {
          url: '/api/admin/selectStudent',
          type: 'get',
          data: {
            size: 10,
            ...data
          }
        };
        if (data) {
          paramObj.data = data
        }
        fetch(paramObj).then(res => {
          if (res.data.code === 200) {
            let tableData = deepCopy(res.data.data.records[0]);
            // console.log(tableData)
            tableData.sex = tableData.sex === 0 ? '男' : '女';
            tableData.status = this.getStatus(tableData.status);
            tableData.direction = this.getDirection(tableData.direction);
            tableData.timestamp = moment(tableData.timestamp).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
            tableData.pass = this.switchStatus(tableData.pass);
            this.studentMessage = tableData;
          }
        })
      },
      getDirection(num) {
        switch (num) {
          case 0:
            return '前端';
          case 1:
            return '后台';
          case 2:
            return '安卓';
          case 3:
            return 'iOS';
          case 4:
            return '机器学习';
        }
      },
      getStatus(num) {
        switch (num) {
          case 1:
            return '报名成功，待安排面试';
          case 2:
            return '面试安排，未到报道时间';
          case 3:
            return '面试安排，到了排队时间';
          case 4:
            return '提交排队，判断限额是否已经满了';
          case 5:
            return '排队成功，当前排队状态';
          case 6:
            return '面试完成，等待结果';
          case 7:
            return '面试通过，发布考核内容查看地址，Q群';
          case 8:
            return '面试不通过';
          case 9:
            return '考核不通过（规定时间未提交代码）';
          case 10:
            return '答辩安排，未到报道时间 （废弃）';
          case 11:
            return '答辩安排，到了排队时间（每天限额）';
          case 12:
            return '提交排队，判断限额是否已经满了（前端页面）';
          case 13:
            return '排队成功，当前排队状态（不提供取消排队，每个方向留一个微信用于协调）（前端页面）';
          case 14:
            return '答辩完成，等待结果';
          case 15:
            return '答辩通过，发布考核内容查看地址，Q群';
          case 16:
            return '答辩不通过';
          case 17:
            return '考核不通过（规定时间未提交代码）';
          case 18:
            return '答辩安排，未到报道时间 （废弃）';
          case 19:
            return '答辩安排，到了排队时间（每天限额）';
          case 20:
            return '提交排队，判断限额是否已经满了（前端页面）';
          case 21:
            return '排队成功，当前排队状态（不提供取消排队，每个方向留一个微信用于协调）（前端页面)';
          case 22:
            return '答辩完成，等待结果';
          case 23:
            return '答辩通过，发布面试信息';
          case 24:
            return '答辩不通过';
          case 25:
            return '面试安排，到了排队时间（每天限额）';
          case 26:
            return '提交排队，判断限额是否已经满了（前端页面)';
          case 27:
            return '排队成功，当前排队状态（不提供取消排队，每个方向留一个微信用于协调）（前端页面）';
          case 28:
            return '面试完成，等待结果';
          case 29:
            return '面试通过，进入工作室';
          case 30:
            return '面试不通过';
        }
      },
      switchStatus(num) {
        switch (num) {
          case 0: {
            return '无效'
          }
          case 1: {
            return '通过'
          }
          case 2: {
            return '不通过'
          }
          case 3: {
            return '切换状态'
          }
        }
      },
      // 设置学生面试预通过
      passInterview(isPass) {
        fetch({
          url: '/api/admin/setPass',
          type: 'post',
          data: {
            id: this.$store.getters.getStudentId,
            isPass: isPass
          },
          headers: {
            'Content-Type':'application/json'
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '请求成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
        this.getStudentList()
      }
    }
  }
</script>