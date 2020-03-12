import Vue from 'vue'
import VueRouter from 'vue-router'

//使用路由懒加载
const Login = ()=>import(/*webpackChunkName: "login_home_welcome"*/ 'views/login/Login');
const Home = ()=>import(/*webpackChunkName: "login_home_welcome"*/ 'views/home/Home');
const Welcome = ()=>import(/*webpackChunkName: "login_home_welcome"*/'views/home/childCpn/welcome/Welcome');
const User = ()=>import('views/maincontainer/userManagement/User');
const Categories = ()=>import('views/maincontainer/commodityManagement/Categories');
const Goods = ()=>import('views/maincontainer/commodityManagement/Goods');
const Params = ()=>import('views/maincontainer/commodityManagement/Params');
const Reports = ()=>import('views/maincontainer/dataStatistics/Reports');
const Orders = ()=>import('views/maincontainer/orderManagement/Orders');
const Rights = ()=>import('views/maincontainer/privilegeManagement/Rights');
const Roles = ()=>import('views/maincontainer/privilegeManagement/Roles');
const AddGoods = ()=>import('views/maincontainer/commodityManagement/AddGoods');

import el from "element-ui/src/locale/lang/el";

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
      },{
        path: '/users',
        component: User
      },{
        path: '/roles',
        component: Roles
      },{
        path: '/rights',
        component: Rights
      },{
        path: '/goods',
        component: Goods
      },{
      path: '/goods/add',
      component: AddGoods
      },{
        path: '/params',
        component: Params
      },{
        path: '/categories',
        component: Categories
      },{
        path: '/orders',
        component: Orders
      },{
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//挂载一个路由导航守卫，用来监听直接使用url跳转到的页面时是否存在token
router.beforeEach((to,from,next) => {
  //to为将要访问的路径，from为从哪个路径跳转来，next是是一个函数,next()代表直接放行
  //next("path")为强制跳转到路径
  if(to.path === "/login") return next();
  //获取token
  const token = window.sessionStorage.getItem('token');
  //如果token值不为空，那就强制跳转到登录页面。
  /*问题一：按理来说，存在一种场景，如果用户恶意在工作台直接指定一个token值，使得token为非空，那么
  就会仍然根据url进入页面。但是在正常情况下，我们可以认为单纯的前端页面是绝对安全的，
  因为它不包含个人用户的使用数。在需要使用token请求用户个人的隐私性数据时，我们
  将token作为请求头来请求数据，这时如果该用户请求的token是一个不存在的值，那么是无法
  通过后台验证，也是无法获取用户数据的)*/
  /*问题二：在当前网页下的session storage，我们可能保存的不止一个键值对，
  当多个内容之间的key相同时，会导致后面赋值的key覆盖前面的值出现混乱，所以
  我们最好对于在session storage存储的键值对进行命名时，给其加一多位的hash*/
  if(!token) {
    return next("/login");
  }else {
    next();
  }
})

export default router
