<template>
  <div class="exit-button">
    <el-button type="info" @click="exit">退出登录</el-button>
  </div>
</template>

<script>
  export default {
    name: "ExitButton",
    methods: {
      exit() {
        window.sessionStorage.removeItem('token');
        this.$router.push("/login");
      }
    }
  }
</script>

<style scoped>

</style>
