<template>
  <div>
    <el-card class="queue-box-card" shadow="hover">
<!--      <div slot="header" class="clearfix">-->
<!--        <span :class="currentName ? 'blue-class':'red-class'">{{currentName? '当前面试者: ' + currentName: '请选择学生'}}</span>-->

<!--      </div>-->

      <div class="work-box">
        <div class="comment-list">
<!--          <h5 style="text-indent: 10px;margin: 10px 0">评价列表</h5>-->
<!--          <div v-for="item in currentStudentComment" :key="item.id" class=" text-item">-->
<!--            {{item.comment}}-->
<!--          </div>-->
          <el-table :data="currentStudentComment">
            <el-table-column min-width="400" property="comment" label="评价"></el-table-column>
            <el-table-column  property="administratorName" label="评论者"></el-table-column>
          </el-table>
        </div>

        <div class="operate-box">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
          >
          </el-input>
          <el-row>
            <el-button @click="comment" type="success"><i class="el-icon-edit"></i>评论</el-button>
            <el-button @click="callStudent" type="primary"><i class="el-icon-phone"></i>叫号</el-button>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card class="queue-list" shadow="hover">
      <el-table
        ref="singleTable"
        :data="tableData"
        v-loading="loading"
        highlight-current-row
        :row-class-name="tableRowClassName"
        style="width: 100%"
        @row-click="handelClick"
      >
        <el-table-column
          width="50"
        >
          <template scope="scope">
            <el-radio
              :label="scope.row.studentId"
              v-model="templateRadio"
              @change.native="getTemplateRow(scope.$index,scope.row)"
            >
              {{''}}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="student.name"
          label="姓名"
          width="70"
        >
        </el-table-column>
        <el-table-column
          prop="orderCount"
          label="序号"
          width="70"
        >
        </el-table-column>
        <el-table-column
          prop="student.phone"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="student.schoolId"
          label="学号"
        >
        </el-table-column>
        <el-table-column
          prop="student.direction"
          label="方向"
        >
        </el-table-column>
        <el-table-column
          prop="interviewed"
          label="是否已面试"
        >
        </el-table-column>
        <el-table-column
          prop="student.pass"
          label="通过状态"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template >
            <el-button @click="finishInterview" size="mini" type="danger"><i class="el-icon-delete"></i>结束</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <Modal :visible='modalVisible' :closeModal="closeModal" :studentData="templateRadio"></Modal>
  </div>
</template>
<style lang="less">
  .blue-class {
    color: #409EFF
  }

  .red-class {
    color: #F56C6C;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .queue-box-card {
    height: 35vh;
  }
  .work-box {
    height: 30vh;
    display: flex;
    justify-content: space-between;
    /*控制整个滚动条*/

    .comment-list::-webkit-scrollbar {
      background-color: lightgray;
      width: 10px;
      height: 10px;
      background-clip: padding-box;
    }

    /*滚动条两端方向按钮*/

    .comment-list::-webkit-scrollbar-button {
      display: none;
    }

    /*滚动条中间滑动部分*/

    .comment-list::-webkit-scrollbar-thumb {
      background-color: #D2D2D2;
      border-radius: 5px;
    }

    .comment-list::-webkit-scrollbar-track {
      background-color: #fff;
    }

    /*滚动条右下角区域*/

    .comment-list::-webkit-scrollbar-corner {
      background-color: #fff;
    }

    .comment-list {
      width: 50%;
      border: #eeeeee solid 1px;
      overflow-y: scroll;

      .text-item {
        word-break: break-all;
        word-wrap: break-word;
        min-height: 40px;
        display: flex;
        align-items: center;
        border: #eeeeee solid 1px;
        margin: 5px 0;
        padding: 0 15px;
      }
    }

    .operate-box {
      width: 50%;
      border: #eeeeee solid 1px;
      height: 100%;

      .el-textarea {
        height: 70%;
      }

      .el-row {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .queue-list {
    height: 50vh;
    overflow-y: scroll;
  }
</style>
<script>
  import fetch from "../../../util/fetch";
  import {deepCopy} from "../../../util/utilFunc";
  import {TIME} from "../../../util/viariable"
  import Modal from "./modal";

  export default {
    name: 'interviewing',
    components: {
      'Modal': Modal,
      // 'CommentModal':CommentModal
    },
    data() {
      return {
        tableData: [], // 表格数据
        loading: false,
        timer: {
          getList: '',
          getComment: '',
        }, // 轮询定时器
        currentStudentComment: [],// 评论列表
        modalVisible: false, //叫号模态框
        // currentStudent: null, // 当前
        templateRadio: null, // 单选框选择的学生id
        textarea: '',
        currentName: null // 当前面试学生的名字
      }
    },
    created() {
      this.getStudentList();
      this.timer.getList = setInterval(() => {
        this.getStudentList();
        this.getCommentDetail()
      }, TIME)
    },
    updated() {
      // this.scrollToBottom()
    },
    destroyed() {
      clearInterval(this.timer.getList)
    },
    computed: {
      studentId() {
        return this.$store.state.studentId
      }
    },
    methods: {
      handelClick(row) {
        this.templateRadio = row.studentId;
        this.$store.dispatch('setStudentIdAction',row.studentId);
        this.getCommentDetail();
      },
      scrollToBottom() {
        this.$nextTick(() => {
          let container = this.$el.querySelector(".comment-list");
          container.scrollTop = container.scrollHeight;
        })
      },
      //高亮函数
      tableRowClassName({row}) {
        if (!row.isInterviewed) {
          return 'success-row';
        } else if (row.isInterviewed) {
          return 'warning-row';
        }
        return '';
      },
      getStudentList(data) {
        let paramObj = {
          url: '/api/admin/nowQueue',
          type: 'get'
        };
        if (data) {
          paramObj.data = data
        }
        fetch(paramObj).then(res => {
          if (res.data.code === 200 && res.data.data) {
            let tableData = deepCopy(res.data.data);
            tableData.forEach(item => {
              item.student.direction = this.getDirection(item.student.direction);
              item.student.pass = this.switchStatus(item.student.pass);
              item.interviewed = item.interviewed === 0? '未面试': '已面试';
            });
            this.tableData = tableData;
            this.loading = false;
          }
        })
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
      passInterview(row, isPass) {
        fetch({
          url: '/api/admin/setPass',
          type: 'post',
          data: {
            studentId: row.student.id,
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
      },
      // 结束面试
      finishInterview() {
        if (!this.templateRadio) {
          this.$message({
            message: '请选择学生',
            type: 'error'
          })
        }
        fetch({
          url: '/api/admin/setInterviewed',
          type: 'get',
          data: {
            studentId: this.studentId,
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '面试结束',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      },
      getCommentDetail() {
        if (this.templateRadio) {
          fetch({
            url: '/api/admin/getInterview',
            type: 'get',
            data: {
              studentId: this.studentId
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.currentStudentComment = deepCopy(res.data.data);
            }
          })
        }
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
      // 关闭模态框函数
      closeModal() {
        this.modalVisible = false;
        this.commentModalVisible = false
      },
      callStudent() {
        this.modalVisible = true;
      },
      getTemplateRow(index, row) {
        // console.log('选中')
        this.currentName = row.student.name;
        this.$store.dispatch('setStudentIdAction', row.student.id)
        this.getCommentDetail();
      },
      comment() {
        // console.log(this.templateRadio,this.textarea)
        if (!this.templateRadio) {
          this.$message({
            message: '请选择评论者',
            type: 'error'
          });
          return false
        }
        if (this.textarea === '') {
          this.$message({
            message: '请填写评论',
            type: 'error'
          });
          return false
        }
        fetch({
          url: '/api/admin/submitInterview',
          type: 'post',
          data: {
            studentId: this.studentId,
            comment: this.textarea
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.textarea = '';
            this.$message({
              message: '评价成功',
              type: 'success'
            });
          }
        })
      }
    }
  }

</script>