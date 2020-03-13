<template>
  <div class="welcome">
    <el-row class="header">
      <el-col class="logo" :span="5">
        <img src="~assets/logo.png" alt="">
      </el-col>
      <el-col class="introduce" :span="19">
        <h1 class="title">敏捷型</h1>
        <h1>电商后台管理系统</h1> 
        <div class="buttons">
          <el-button round icon="el-icon-question" type="success">What Can I Do</el-button>
          <el-button round icon="el-icon-warning" type="warning">注意事项</el-button>
          <el-button round icon="el-icon-caret-right" type="primary">开始使用</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="tags">
      <el-col :span="8">
        <el-card>
          <div>简单</div>
          <span>简洁明了的模块化结构，无处不在的标签和提示，完整的功能说明和注意事项。
            让您能够以最少的学习成本熟悉系统功能，从一个初学者到随心所欲的添加所有你需要的商品信息，
            仅仅需要五分钟。
          </span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div>快速</div>
          <span>
            优越的服务器性能让您的请求实时快速被处理和响应，一键发送/请求，信息迅速直达商家。
            网络延迟？服务器崩溃？不存在的！！！
          </span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div>安全</div>
          <span>
            使用完善的网络协议和RSA-RSA双向非对称加密算法对您的信息进行加密传输。
            高效稳定的服务器负载能力让您的信息不会丢失或崩溃。
            多层的数据验证，尽最大限度的减少您输入数据的失误。
          </span>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="else">
      <el-col :span="8">
        <el-tag  effect="dark">
          源码地址
        </el-tag>
        <el-link :underline="false" icon="el-icon-edit"
          href="https://gitee.com/bruiserpink/Management-System">
          访问BruiserPink的gitee项目
        </el-link>
      </el-col>
      <el-col :span="8">
        <el-tag  effect="dark">
          问题反馈
        </el-tag>邮箱 : bruiserpink@163.com
      </el-col>
      <el-col :span="8">
        <el-tag  effect="dark" >
          学习交流
        </el-tag>QQ : 1609526684
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "Welcome"
  }
</script>

<style scoped lang="less">
  .welcome {
    .header {
      height: 240px;
      .logo {
        height: 100%;
        img {
          width: 80%;
          height: 80%;
          margin-left: 20%;
          margin-top: 20%;
        }
      }
      .introduce {
        color: #273849;
        height: 100%;
        padding: 34px 0 0 60px;
        .buttons {
          margin-top: 10px;
          .el-button {
            font-size: 16px;
          }
        }
      }
    }
    .tags {
      margin-top: 50px;
      .el-card {
        width: 80%;
        margin-left: 10%;
        text-align: center;
        div {
          font-size: 20px;
          margin-bottom: 10px;
          color: #6CB983;
        }
        span {
          color: #909090;
        }
      }
    }
    .else {
      text-align: center;
      color: #606266;
      font-size: 14px;
      margin-top: 60px;
      .el-tag {
        margin-right: 10px;
      }
    }
  }
</style>
