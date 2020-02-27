<template>
  <div class="login_container">
    <div class="login_box"></div>
  </div>
</template>

<script>
  export default {
    name: "Login"
  }
</script>

<style scoped lang="less">
  .login_container {
    background: #2b4b6b;
    height: 100vh;
    position: relative;
    .login_box{
      width: 450px;
      height: 300px;
      background: #fff;
      border-radius: 3px;
      left: 50%;
      top: 50%;
      position: absolute;
      transform: translate(-50%,-50%);
    }
  }
</style>
