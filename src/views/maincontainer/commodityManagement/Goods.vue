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
        <el-table-column label="商品数量" prop="goods_number" width="95px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | formatDate}}
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
    <!--编辑商品信息的对话框-->
    <el-dialog :modal-append-to-body='false' title="修改商品信息"
               :visible.sync="isShowEditDialog"
               width="50%" @close="resetDialog">
      <el-form :model="goodsInfo" :rules="editFormRules" ref="goodsInfo"
               label-width="100px" >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="goodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="goodsInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="goodsInfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="goodsInfo.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getGoodsListData,deleteGoods,putEditGoodsInfo,
  putGoodsAttr} from 'network/goodsList'
  import {getCategoriesMenuData} from 'network/category'
  import {formatDate,debounce} from 'Bcommon/utils'
  export default {
    name: "goods",
    data() {
      //定义验证非负数的表达式
      var checkNumber = (rule, value, callback) => {
        setTimeout(() => {
          if (value <= 0 ) {
            callback(new Error('此属性应该大于0'));
          }
        }, 1000);
      };
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        goodsList: [],
        total: 0,
        isShowEditDialog: false,
        goodsInfo: {
          goods_name: '',
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0
        },
        editFormRules: {
          goods_name: [
            {required: true,message: "请输入商品名称",trigger: "blur"},
            {min:3,max:10,message: "商品名称应该为3-10个字符",trigger: "blur"}
          ],
          goods_price: [
            {required: true,message: "请输入商品价格",trigger: "blur"},
            {validator: checkNumber,trigger: "blur"}
          ],
          goods_number: [
            {required: true,message: "请输入商品数量",trigger: "blur"},
            {validator: checkNumber,trigger: "blur"}
          ],
          goods_weight: [
            {required: true,message: "请输入商品重量",trigger: "blur"},
            {validator: checkNumber,trigger: "blur"}
          ],
          publicCatId: 0
        },
      }
    },
    activated() {
      this._getGoodsListData(this.queryInfo);
      getCategoriesMenuData({
          type: 3,
          pagenum: 1,
          pagesize: 1,
        }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        //将第一个分类的三级分类的id作为公用分类id
        this.publicCatId = res.data.data.result[0].children[0].children[0].cat_id;

      }).catch(err => {
        console.log(err);
      })
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
        this.isShowEditDialog = true;
        //获取保存在store里面的新添加的商品信息数组
        const addGoodsArr = this.$store.state.GoodsDetailsInfo;
        //查看当前数组是不是被新添加的，如果是被添加的获得该完整信息
        const myAllData = addGoodsArr.find(item => {
          return row.goods_id === item.goods_id;
        });
        //如果不是新创建的商品，只能给他制定一个已经存在的分类id
        row.cat_id = this.publicCatId.toString();
        //如果myAllData存在，那么就说明该商品为新商品，给他全部信息.
        this.goodsInfo = myAllData || row;
      },
      //监听编辑商品信息的dialog的确定事件
      determineGoodsInfo() {
        putEditGoodsInfo(this.goodsInfo).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error('修改商品信息失败');
          }
          this._getGoodsListData(this.queryInfo);
        }).catch(err => {
          console.log(err);
        } )
        this.isShowEditDialog = false;
      },
      //重置编辑dialog的表单内容的方法
      resetDialog() {
        this.$refs.goodsInfo.resetFields();
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
        this.$router.push('/goods/add');
      }
    },
    filters: {
      formatDate: function(value) {
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
