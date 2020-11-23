<template>
  <el-dialog
    title="叫号"
    :visible.sync="visible"
    width="30vw"
    :before-close="closeModal"
  >
    <el-form
      :model="ruleForm"
      status-icon
      ref="ruleForm"
      label-width="30%"
      class="demo-ruleForm"
    >
      <el-form-item label="面试方式:" prop="password">
        <el-radio-group v-model="ruleForm.kind">
          <el-radio  label="1">腾讯会议</el-radio>
          <el-radio  label="2">QQ群</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="会议号或群号:" prop="kind">
        <el-input style="width:60%" v-model="ruleForm.contract" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="submit-btn">
        <el-button @click="onCancel">取 消</el-button>
        <el-button :loading="disable" class="submit-btn" type="primary" @click="onOk('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import fetch from "../../../util/fetch";
  export default {
    name: "Modal",
    props:['visible','closeModal','studentData'],
    data() {
      return {
        ruleForm: {
          kind: null,
          contract: null,
        },
        disable: false
      }
    },
    created() {

    },
    methods: {
      onOk() {
        console.log(this.ruleForm);
        this.disable = true;

        // 关闭模态框
        fetch({
          url: '/api/admin/nextQueue',
          type: 'get',
          data: {
            kind: this.ruleForm.kind,
            contract: this.ruleForm.contract
          }
        }).then(res => {
          if(res.data.code ===200) {
            console.log(res);
            this.closeModal();
            this.$message({
              message: '叫号成功',
              type: 'success'
            });
            this.disable = false;
            this.$store.dispatch('setStudentIdAction', res.data.data.id)
          }else {
            this.disable = false;
            this.$message({
              message: res.data.message,
              type: 'error'
            });
          }
        })
      },
      onCancel() {
        this.closeModal()
      },
      comment() {
        fetch({
          url:'/api/admin/submitInterview',
          type: 'post',
          data: {
            studentId: this.studentData,
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
          }
        })
      }
    }
  }
</script>

<style scoped>
  .label {
    margin-right: 10px;
  }
  .call-item {
    margin-bottom: 25px;
  }
  .call-modal {
    width: 40vw;
  }
</style>