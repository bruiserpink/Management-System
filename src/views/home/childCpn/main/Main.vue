<template>
  <div class="main">
    <keep-alive>
      <router-view ></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: "Main"
  }
</script>

<style scoped lang="less">
  .main {
    background: #EAEDF1;
  }
</style>
