<template>
  <div class="rights">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {GetRightsMenuData} from "network/rights"
  export default {
    name: "rights",
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      this._GetRightsMenuData('list');
    },
    methods: {
      //请求表格信息的方法
      _GetRightsMenuData(type){
        GetRightsMenuData(type).then(res=> {
          if(res.data.meta.status !== 200) {
            this.$message.error('获取权限列表失败');
          }else {
            this.rightsList = res.data.data;
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="less">

</style>
