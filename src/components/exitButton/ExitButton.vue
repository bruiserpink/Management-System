<template>
  <div class="exit-button">
    <el-button type="info" @click="exit" size="small">退出</el-button>
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
