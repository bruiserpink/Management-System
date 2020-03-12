import axios from "axios"
//导入实现浏览器顶部网络请求进度条的包
import NProgress from 'nprogress'
//为了节省打包后包的体积，在public/index.html中引入此样式的cdn包
import 'nprogress/nprogress.css'
export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://127.0.0.1:8888/api/private/v1',
    //此服务器接口写的有问题，未将获取用户信息列表的rid和配置角色的rid绑定起来
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1',
    timeout: 5000
  })
  //axios拦截器
  //1.请求拦截器
    instance.interceptors.request.use(config=>{
      //为请求头对象添加token的值
      config.headers.Authorization = window.sessionStorage.getItem('token');
      //显示网络请求进度条
      NProgress.start();
      return config;
    },err=>{
      console.log(err);
    });
    //2.响应拦截器
    instance.interceptors.response.use(config=>{
      //隐藏网络请求进度条
      NProgress.done();
      return config;
    },err=>{
      console.log(err);
    })
  //发送网络请求
  return instance(config);
}