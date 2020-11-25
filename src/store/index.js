import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    loginData: {

    },
    group: null,
    studentId: null
  },
  getters:{
    // 参数列表state指的是state数据
    getLoginData(state){
      return state.loginData;
    },
    getGroup(state){
      return state.group;
    },
    getStudentId(state) {
      return state.studentId;
    }
  },
  // 3. actions
  // 通常跟api接口打交道
  actions:{
    // 参数列表：{commit, state}
    // state指的是state数据
    // commit调用mutations的方法
    // name就是调用此方法时要传的参数
    setLoginDataAction({commit}, data){

      commit("setLoginData", data);
    },
    setGroupAction({commit}, data){
      // 跟后台打交道
      // 调用mutaions里面的方法
      commit("setGroup", data);
    },
    setStudentIdAction({commit}, data) {
      // console.log('数据',data)
      commit('setStudentId',data)
    }
  },
  // 4. mutations
  mutations:{
    // state指的是state的数据
    // name传递过来的数据
    setLoginData(state, data){
      state.loginData = data;
    },
    setGroup(state, data){
      state.group = Number(data);
    },
    setStudentId(state,data) {
      state.studentId = Number(data);
    }
  }
});
export default store