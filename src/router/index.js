import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from '../components/Login'
import interviewing from '../components/contenIn/interviewing/interviewing'
import studentSetting from "../components/contenIn/studentManagement/index";
import interviwerSetting from "../components/contenIn/interviwerSetting";
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/home',
      component:Home,
      children: [
        {
          path: '/home',
          component: interviwerSetting
        },
        {
          path: '/home/interviewer',
          component: interviewing
        },
        {
          path: '/home/student',
          component: studentSetting
        }
        ]
    },
    {
      path: '/',
      component:Login
    },
  ]
})