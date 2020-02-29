<template>
  <div class="header">
    <div class="left no-select">
      <img src="~assets/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <exit-button class="exit"></exit-button>
  </div>
</template>

<script>
  import ExitButton from "components/exitButton/ExitButton";
  export default {
    name: "Header",
    components: {
      ExitButton
    }
  }
</script>

<style scoped lang="less">
  .header {
    background: #373d41;
    height: 8vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 55px;
        height: 50px;
        margin-left: 8px;
      }
      span {
        color: #fff;
        font-size: 20px;
        margin-left: 20px;
      }
    }
    .exit {
      margin-right: 20px;
    }
  }
</style>
