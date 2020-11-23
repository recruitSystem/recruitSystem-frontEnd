<template>
  <el-dialog
    :title="studentData.name"
    :visible.sync="visible"
    width="30%"
  >
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
    <span slot="footer" class="dialog-footer">
    <el-button @click="onCancel">取 消</el-button>
    <el-button type="primary" @click="onOk">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import fetch from "../../../util/fetch";
  export default {
    name: "Modal",
    props:['visible','closeModal','studentData'],
    data() {
      return {
        commentData: '',
        textarea: ''
      }
    },
    created() {

    },
    methods: {
      onOk() {
        // console.log('ok')
        // 关闭模态框
        fetch({
          url:'/api/admin/submitInterview',
          type: 'post',
          data: {
            studentId: this.studentData.id,
            comment: this.textarea
          },
          headers: {
            'Content-Type':'application/json'
          }
        }).then(res =>{
          if(res.data.code === 200) {
            this.$message({
              message: '评价成功',
              type: 'success'
            });
            this.closeModal()
          }
        })
      },
      onCancel() {
        this.closeModal()
      }
    },
    computed: {


    }
  }
</script>

<style scoped>

</style>