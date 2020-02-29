<template>
  <div class="login_container">
    <login-box></login-box>
  </div>
</template>

<script>
  import LoginBox from "./childCpn/LoginBox";
  export default {
    name: "Login",
    components: {
      LoginBox
    }
  }
</script>

<style scoped lang="less">
  .login_container {
    background: #2b4b6b;
    height: 100vh;
  }
</style>
