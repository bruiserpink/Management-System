<template>
  <div class="goods">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    class="input-with-select" @input="searchGoods"
                    clearable @clear="_getGoodsListData(queryInfo)">
            <el-button slot="append" icon="el-icon-search"
            @click="_getGoodsListData(queryInfo)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--table表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"  width="95px"></el-table-column>
        <el-table-column label="商品重量(g)" prop="goods_weight" width="95px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteGoodById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import {getGoodsListData,deleteGoods} from 'network/goodsList'
  import {formatDate,debounce} from 'Bcommon/utils'
  export default {
    name: "goods",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        goodsList: [],
        total: 0
      }
    },
    activated() {
      this._getGoodsListData(this.queryInfo);
    },
    methods: {
      _getGoodsListData(queryInfo) {
        getGoodsListData(queryInfo).then(res => {
          if(res.data.meta.status !== 200) {
            return;
          }
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
        }).catch(err => {
          console.log(err);
        })
      },
      //搜索商品的方法做防抖处理
      searchGoods() {
        const searchGoods = debounce(this._getGoodsListData,200);
        searchGoods(this.queryInfo);
      },
      //监听编辑按钮点击事件
      handleEdit(row) {
        console.log(row);
      },
      //监听删除按钮点击事件
      deleteGoodById(goodsId) {
        //显示提示弹窗
        this.$confirm('此操作将删除该商品数据，是否继续?','提示',{
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods(goodsId).then(res => {
            if(res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            }
            this._getGoodsListData(this.queryInfo);
          }).catch(err => {
            this.$message.error('删除商品失败')
          })
        }).catch(() => {

        })
      },
      //监听分页控制size改变事件
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this._getGoodsListData(this.queryInfo);
      },
      //监听分页控制页面num改变事件
      handleCurrentChange(newnum) {
        this.queryInfo.pagenum = newnum;
        this._getGoodsListData(this.queryInfo);
      },
      goAddpage() {
        this.$router.push('/goods/add')
      }
    },
    filters: {
      showDate: function(value) {
        let date = new Date(value*1000);
        return formatDate(date, 'yyyy/MM/dd hh:mm:ss')
      }
    }
  }
</script>

<style scoped lang="less">
  .el-table {
    font-size: 12px;
  }
</style>
