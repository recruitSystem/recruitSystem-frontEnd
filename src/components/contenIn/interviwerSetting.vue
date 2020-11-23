<template>
  <div slot="header" >
    <el-card
      class="box-card"
      shadow="hover"
    >
      <div slot="header" class="clearfix header-box">
        <span>面试官列表</span>
        <div>
          <el-input
            placeholder="设置组别"
            v-model="formInline.groupId"
            clearable
            style="width: 150px; margin-right: 20px"
          />
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </div>
     <div>
       <el-table
         :data="interviewerList"
         style="width: 100%">
         <el-table-column
           prop="name"
           label="姓名"
         >
         </el-table-column>
         <el-table-column
           prop="groupId"
           label="组别"
         >
         </el-table-column>
         <el-table-column
           prop="direction"
           label="方向">
         </el-table-column>
       </el-table>
     </div>
    </el-card>
  </div>
</template>

<script>
  import fetch from "../../util/fetch";
  import {deepCopy} from "../../util/utilFunc";

  export default {
    name: "interviwerSetting",
    data() {
      return {
        // 组别
        formInline: {
          groupId: null
        },
        // 面试小组信息
        interviewerList: [{name: '曾曼青', groupId: '', direction: '前端'}]
      }
    },
    created() {
      if(this.$store.getters.getGroup) {
        this.formInline.groupId = this.$store.getters.getGroup
      }
      this.onSubmit()
    },
    methods: {
      onSubmit() {
        if(!this.formInline.groupId) {
          this.$message({
            message: '请填写组别',
            type: 'error'
          })
          return false
        }
        fetch({
          url: '/api/admin/setGroup',
          type: 'get',
          data: {
            group: this.formInline.groupId
          }
        }).then((res) => {
          if (res.data.code === 200) {
            // 将组别id保存
            this.$store.dispatch('setGroupAction',this.formInline.groupId);
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            // 获取面试官信息
            fetch({
              url: '/api/admin/getGroup',
              type: 'get',
              data: {
                group: this.formInline.groupId
              }
            }).then(res => {
              if (res.data.code === 200) {
                let list = deepCopy(res.data.data);
                list.forEach(item => {
                  item.direction = this.getDirection(item.direction)
                });
                this.interviewerList = list;
                console.log(list)
              } else {
                this.$message({
                  message: '获取小组面试官信息失败',
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '提交失败',
              type: 'error'
            })
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
      backLogin() {
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    height: 85vh;
  }
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>