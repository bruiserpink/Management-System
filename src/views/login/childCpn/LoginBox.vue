<template>
  <div class="login-box">
    <div class="avatar-box">
      <img src="~assets/logo.png" alt="">
    </div>
    <el-form ref="loginFrom" class="form" :model="LoginForm" :rules="loginRules">
      <el-form-item prop="username">
        <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <el-form-item  prop="password">
        <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="Login">登录</el-button>
        <el-button type="info" @click="resetLoginInfo">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getLoginData} from "network/login"
  export default {
    name: "LoginBox",
    data() {
      return {
        LoginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          //用户名验证规则
          username: [
            {required: true, message: '请输入用户名称',trigger: 'blur'},
            {min: 5, max: 10,message: "长度在3到10个字符之间",trigger: "blur"}
          ],
          //密码验证规则
          password: [
            {required: true, message: '请输入用户密码',trigger: 'blur'},
            {min: 6, max: 15,message: "长度在6到15个字符之间",trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      //点击重置按钮清空信息
      resetLoginInfo() {
        this.$refs.loginFrom.resetFields()
      },
      //表单信息格式预验证:vaild返回一个boolean值，验证通过返回true
      Login() {
        this.$refs.loginFrom.validate(vaild => {
          if(!vaild) {
            return;
          }else {
            getLoginData(this.LoginForm).then(res => {
              if(res.status !== 200) {
                return this.$message.error("向服务器请求数据失败");
              }else {
                //请求到数据，但是验证密码/用户名失败
                if(res.data.meta.status !== 200) {
                  this.$message.error(res.data.meta.msg)
                }else{
                  //登录成功
                  //1.弹出成功弹窗
                  this.$message.success(res.data.meta.msg);
                  //2.保存token到sessionStorage中
                  window.sessionStorage.setItem('token',res.data.data.token);
                  //4.跳转页面到home
                  this.$router.push("/home");
                }
              }
            }).catch(err => {
              console.log(err)
            });
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .login-box{
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    .avatar-box {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      background: #fff;
      transform: translate(-50%,-50%);
      position: absolute;
      padding: 10px;
      left: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .form {
      position: absolute;
      bottom: 0;
      width: 90%;
      left: 5%;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
