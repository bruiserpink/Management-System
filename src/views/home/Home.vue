<template>
  <div class="home">
    <home-header></home-header>
    <div class="container">
      <home-aside class="aside" :menuList="menuList"></home-aside>
      <el-scrollbar class="scroll">
        <home-main class="main"></home-main>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import homeHeader from "./childCpn/header/Header";
  import homeMain from "./childCpn/main/Main";
  import homeAside from "./childCpn/aside/Aside";
  import BetterScroll from "components/better-scroll/BetterScroll";

  import {getMenuData} from "network/home";
  export default {
    name: "Home",
    components: {
      BetterScroll,
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
      .scroll {
        flex: 1;
        height: 92vh;
      }
      .main {
        padding-bottom: 20px;
      }
    }
  }
</style>
