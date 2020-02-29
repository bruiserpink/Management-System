<template>
  <div class="home">
    <home-header></home-header>
    <div class="container">
      <home-aside class="aside" :menuList="menuList"></home-aside>
      <home-main class="main"></home-main>
    </div>
  </div>
</template>

<script>
  import homeHeader from "./childCpn/header/Header";
  import homeMain from "./childCpn/main/Main";
  import homeAside from "./childCpn/aside/Aside";

  import {getMenuData} from "network/home";
  export default {
    name: "Home",
    components: {
      homeHeader,
      homeMain,
      homeAside
    },
    data() {
      return {
        menuList: []
      }
    },
    methods: {
      _getMenuData() {
        getMenuData().then(res => {
          this.menuList = res.data.data;
        }).catch(err => {
          console.log(err);
        })
      }
    },
    created() {
      //请求menu的数据
      this._getMenuData();
    }
  }
</script>

<style scoped lang="less">
  .home {
    width: 100%;
    height: 100vh;
    .container {
      width: 100%;
      display: flex;
      .main {
        flex: 1;
      }
    }
  }
</style>
