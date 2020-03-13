# managementsystem

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
> 此项目默认登录用户： 用户名: admin 密码:123456
> 此项目使用的远程服务器端为接口为公开接口，可能同时被多人使用。
> 所以在项目运行时，尽量不要过多删减数据，以免影响其他人学习使用。
### Compiles and minifies for production
```
npm run build

```
### 其他问题

1. 此项目order模块的搜索和添加功能模块未进行后端支持，所以该功能无效
2. 此项目在远程服务器端未将获取用户信息列表的rid和配置角色的rid绑定起来，所以直接执行在此远程服务器端时，给用户分配角色信息无效。如果需要可以查看首页联系我，获取后执行本地数据库脚本进行该有效操作。

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
