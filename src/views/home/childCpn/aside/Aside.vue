<template>
  <div class="aside">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="no-select">
      <div class="toggle-button" @click="toggleMenu">||||||</div>
      <el-menu background-color="#333744" text-color="#fff"
               active-text-color="#409eff" unique-opened
               :collapse="isCollapse" :collapse-transition="false" router
               :default-active="activePath">
        <el-submenu :index="item.id + ''"
                    v-for="(item,index) in menuList" :key="item.id"  >
          <!--一级菜单的模板区域-->
          <template slot="title">
            <i class="iconfont" :class="iconsList[index]"></i>
            <span slot="title">{{item.authName}}</span>
          </template>
          <el-menu-item :index="'/'+subItem.path + ''" v-for="subItem in item.children"
                        :key="subItem.id" @click.native="saveNavState('/'+subItem.path)">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
  export default {
    name: "Aside",
    props: {
      menuList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        iconsList: ['icon-users','icon-tijikongjian','icon-shangpin','icon-danju','icon-baobiao'],
        isCollapse: false,
        activePath: ''
      }
    },
    methods: {
      toggleMenu() {
        this.isCollapse = !this.isCollapse;
      },
      //保存当前激活的二级菜单的router,解决刷新页面后被选中的二级菜单不高亮的问题
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath;
      },
    },
    created() {
      this.activePath = window.sessionStorage.getItem('activePath');
    }
  }
</script>

<style scoped lang="less">
  .aside {
    background: #333744;
    height: 92vh;
    .el-menu{
      border-right-width: 0;
      .iconfont {
        margin-right: 10px;
      }
    }
    .toggle-button {
      background: #4A5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.3em;
    }
  }
</style>
