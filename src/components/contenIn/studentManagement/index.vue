<template>
  <el-card shadow="hover" style="height: 85vh">
    <div class="student-box" style="height: 100%">
      <div class="search-box">
        <template>
          方向:
          <el-select style="width: 10vw;margin-right: 1vw" v-model="direction" placeholder="方向">
            <el-option
              v-for="item in directionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          状态:
          <el-select style="width: 10vw;margin-right: 1vw" v-model="status" placeholder="状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          类型:
          <el-select style="width: 10vw;margin-right: 1vw" v-model="value" placeholder="搜索类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 15vw;margin-right: 3px" v-model="input" placeholder="请输入内容"></el-input>
          <el-button @click="search" type="primary" icon="el-icon-search" plain></el-button>
        </template>
      </div>
      <el-table
        ref="singleTable"
        :data="tableData"
        v-loading="loading"
        highlight-current-row
        style="width: 100%"
        @row-click="handelClick"
      >
        <el-table-column
          width="50"
        >
          <template scope="scope">
            <el-radio :label="scope.row.id" v-model="templateRadio"
                      @change.native="getTemplateRow(scope.$index,scope.row)">{{'  '}}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名字"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="schoolId"
          label="学号">
        </el-table-column>
        <el-table-column
          prop="major"
          label="专业年级">
        </el-table-column>
        <el-table-column
          prop="direction"
          label="方向">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="comment(scope.$index, scope.row)">填写评价
            </el-button
            >

            <el-popover
              placement="left"
              width="45vw"
              trigger="click"
              :content="content"
            >
              <el-table :data="gridData" v-loading="commentLoading">
                <el-table-column width="300" property="comment" label="评价"></el-table-column>
                <el-table-column width="100" property="administratorName" label="评论者"></el-table-column>
              </el-table>
              <el-button
                size="mini"
                type="info"
                @click="viewComment(scope.$index, scope.row)"
                slot="reference"
              >查看评价
              </el-button>

            </el-popover>
          </template>
        </el-table-column>
      </el-table>
     <div>
       <el-pagination
         :current-page="pageNumber"
         @size-change="handleSizeChange"
         background
         layout="total, prev, pager, next"
         :total="total"
         @current-change="changePage"
       >
       </el-pagination>
     </div>
    </div>
    <Modal :visible='modalVisible' :closeModal="closeModal" :studentData="currentStudent"></Modal>
  </el-card>
</template>
<script>
  import fetch from "../../../util/fetch";
  import {deepCopy} from "../../../util/utilFunc";
  import Modal from "./modal"

  const directionOptions = [
    {
      value: null,
      label: '全部'
    },
    {
      value: '0',
      label: '前端'
    }, {
      value: '1',
      label: '后台'
    }, {
      value: '2',
      label: '安卓'
    }, {
      value: '3',
      label: 'iOS'
    }, {
      value: '4',
      label: '机器学习'
    }
  ];
  const statusOptions = [
    {
      value: null,
      label: '全部'
    },
    {
      value: 1,
      label: '报名成功，待安排面试'
    }, {
      value: 2,
      label: '面试安排，未到报道时间'
    }, {
      value: 3,
      label: '面试安排，到了排队时间'
    }, {
      value: 4,
      label: '提交排队，判断限额是否已经满了'
    }, {
      value: 5,
      label: '排队成功，当前排队状态'
    }, {
      value: 6,
      label: '面试完成，等待结果'
    }, {
      value: 7,
      label: '面试通过，发布考核内容查看地址，Q群'
    }, {
      value: 8,
      label: '面试不通过'
    }, {
      value: 9,
      label: '考核不通过（规定时间未提交代码）'
    }, {
      value: 10,
      label: '答辩安排，未到报道时间 （废弃）'
    }, {
      value: 11,
      label: '答辩安排，到了排队时间'
    }, {
      value: 12,
      label: '提交排队，判断限额是否已经满了'
    }, {
      value: 13,
      label: '报名成功，待安排面试'
    }, {
      value: 14,
      label: '排队成功，当前排队状态'
    }, {
      value: 15,
      label: '答辩通过，发布考核内容查看地址，Q群'
    }, {
      value: 16,
      label: '答辩不通过'
    }, {
      value: 17,
      label: '考核不通过（规定时间未提交代码）'
    }, {
      value: 18,
      label: '答辩安排，未到报道时间 （废弃）'
    }, {
      value: 19,
      label: '答辩安排，到了排队时间（每天限额）'
    }, {
      value: 20,
      label: '提交排队，判断限额是否已经满了'
    }, {
      value: 21,
      label: '排队成功，当前排队状态'
    }, {
      value: 22,
      label: '答辩完成，等待结果'
    }, {
      value: 23,
      label: '答辩通过，发布面试信息'
    }, {
      value: 24,
      label: '答辩不通过'
    }, {
      value: 25,
      label: '面试安排，到了排队时间（每天限额）'
    }, {
      value: 26,
      label: '提交排队，判断限额是否已经满了'
    }, {
      value: 27,
      label: '排队成功，当前排队状态'
    }, {
      value: 28,
      label: '提交排队，判断限额是否已经满了'
    }, {
      value: 29,
      label: '面试完成，等待结果'
    }, {
      value: 30,
      label: '面试不通过'
    },
  ];
  const option = [
    {
      value: null,
      label: '全部'
    },
    {
      value: 'schoolId',
      label: '学号'
    }, {
      value: 'name',
      label: '姓名'
    }];
  export default {
    name: 'studentSetting',
    components: {
      'Modal': Modal
    },
    data() {
      return {
        tableData: [],
        total: 0,
        loading: true,
        modalVisible: false,
        currentStudent: {},
        content: '',
        gridData: [],
        commentLoading: true,
        templateRadio: null,
        options: option,
        directionOptions: directionOptions,
        statusOptions: statusOptions,
        value: null, // 搜索类型
        input: null, // 搜索内容
        direction: null, //方向
        status: null,
        pageNumber: 1,
      }
    },
    created() {
      this.getStudentList();
    },
    methods: {
      switchStatus(num) {
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
            return '排队成功，当前排队状态';
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
      handelClick(row) {
        this.templateRadio = row.id;
        this.$store.dispatch('setStudentIdAction', row.id)
      },
      search() {
        this.pageNumber = 1;
        this.getStudentList()
      },
      handleSizeChange(val){
        this.pageNumber = 1;
        this.pageSize = val;
        this.getList();
      },
      getStudentList(data) {
        this.loading = true;
        let obj = {};
        if (this.value && this.input) {
          obj[this.value] = this.input;
        }
        if (this.direction) {
          obj.direction = this.direction
        }
        if (this.status) {
          obj.status = this.status
        }

        let paramObj = {
          url: '/api/admin/selectStudent',
          type: 'get',
          data: {
            size: 10,
            ...data,
            ...obj
          }
        };
        fetch(paramObj).then(res => {
          if (res.data.code === 200) {
            let tableData = deepCopy(res.data.data.records);
            tableData.forEach(item => {
              item.direction = this.getDirection(item.direction);
            });
            this.tableData = tableData;
            this.total = res.data.data.total;
            this.loading = false;
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
      comment(index, rowData) {
        // console.log('学生数据',rowData);
        let data = deepCopy(rowData);
        this.modalVisible = true;
        this.currentStudent = data
      },
      getTemplateRow(index, row) {
        // console.log('选中',row)
        this.$store.dispatch('setStudentIdAction', row.id)
      },
      // 换页
      changePage(currentPage) {
        this.getStudentList({
          current: currentPage
        });

        this.closeModal();
        this.currentStudent = {}
      },
      viewComment(index, rowData) {
        this.commentLoading = true;
        fetch({
          url: '/api/admin/getInterview',
          type: 'get',
          data: {
            studentId: rowData.id
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.gridData = deepCopy(res.data.data)
            this.commentLoading = false
          }
        })
      },
      closeModal() {
        this.modalVisible = false
      }
    }
  }
</script>
<style scoped>
  .el-card {
    overflow-y: scroll;
  }
  /*滚动条中间滑动部分*/

  .el-card.contentIn::-webkit-scrollbar-thumb {
    background-color: #D2D2D2;
    border-radius: 5px;
  }

  .el-card.contentIn::-webkit-scrollbar-track {
    background-color: #fff;
  }

  /*滚动条右下角区域*/

  .el-card.contentIn::-webkit-scrollbar-corner {
    background-color: #fff;
  }
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }

  .el-button {
    margin-right: 10px;
  }

  .el-popover {
    max-height: 40vh;
    overflow-y: scroll;
  }

  .el-popover::-webkit-scrollbar {

    width: 0;

  }
</style>