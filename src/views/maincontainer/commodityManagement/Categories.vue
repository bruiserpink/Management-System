<template>
  <div class="categories">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }">商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--添加角色按钮栏-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <!--使用树形表格展示数据，该插件为依赖插件，需要在main中做组件声明-->
      <!--selection-type为是否显示选择行,expand-type为是否显示展开行-->
      <tree-table class="tree-table" :data="cateList" :columns="columns"
                  :selection-type="false" :expand-type="false" show-index
                  :index-text="'#'" border>
        <!--商品是否有效插槽栏-->
        <template slot="isEffective" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success"
             :style="[{fontSize: '18px'},{color: 'lightgreen'}]"></i>
          <i v-else class="el-icon-error" :style="[{fontSize: '18px'},{color: 'red'}]"></i>
        </template>
        <!--商品排序插槽栏-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="small">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="small">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2" size="small">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="editDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"
                     @click="removeDialog(scope.row.id)">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
              :page-sizes="[2, 3, 5, 10]" @current-change="handleCurrentChange"
              :page-size="queryInfo.pagesize" @size-change="handleSizeChange()"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="queryInfo.pagenum" :total="total">
      </el-pagination>
    </el-card>
    <!--添加商品的对话框-->
    <el-dialog title="添加分类" :visible.sync="showCateAddDialog" width="50%"
    @close="resetAddCateDialog">
      <!--添加商品分类的对话框表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateForm"
               label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--options指定数据源，为一个数组。props指定数据级联规则-->
          <el-cascader
                  v-model="selectKeys"
                  :options="parentCateList"
                  :props="{expandTrigger:'hover',
                            value: 'cat_id',
                            label: 'cat_name',
                            children: 'children',
                            checkStrictly: true}"
                  @change="cateChange" clearable  size="medium" >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCateAddDialog = false">取消</el-button>
        <el-button @click="determineAddCate" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getCategoriesMenuData,postNewCategoriesInfo} from 'network/category'
  export default {
    name: "categories",
    data() {
      return {
        total: 0,
        cateList: [],
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        },
        //为tree-table的内部列的config定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },{
            label: '是否有效',
            //表示定义当前列为模板列
            type: 'template',
            //表示当前列使用模板插槽名
            template: 'isEffective'
          },{
            label: '排序',
            type: 'template',
            //表示当前列使用模板插槽名
            template: 'order'
          },{
            label: '操作',
            type: 'template',
            template: 'operation'
          }
        ],
        showCateAddDialog: false,
        //添加分类的表单数据对象
        addCateForm: {
          //要添加的分类的名称
          cat_name: '',
          //要添加的分类的父级id
          cat_pid: 0,
          //要添加的分类的层级
          cat_level: 0
        },
        //添加分类的表单数据对象的验证规则
        addCateFormRules: {
          cat_name: [
            {required: true,message: "请输入分类名称",trigger: "blur"},
            {min:3,max:10,message: "分类名应该为3-10个字符",trigger: "blur"}
          ]
        },
        //添加分类弹窗的选择结构数据
        parentCateList: [],
        //级联选择框的配置选项
        //保存被选中的级联选择项的id
        selectKeys: [],
      }
    },
    created() {
      this._getCategoriesMenuData(this.queryInfo);
    },
    methods: {
      //默认获取第一页所有层数据，且一页数据为5个
      _getCategoriesMenuData(queryInfo) {
        getCategoriesMenuData(queryInfo).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.cateList = res.data.data.result;
          this.total = res.data.data.total;
        }).catch(err => {
          console.log(err);
        })
      },
      //监听添加商品分类对话框关闭事件重置对话框内容的方法
      resetAddCateDialog() {
        this.$refs.addCateForm.resetFields();
        //重置dialog的级联菜单数据
        this.selectKeys = [];
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      },
      //添加商品分类的按钮的点击事件
      addCategory() {
        //获取父级的数据列表，在添加用户的选择栏显示
        getCategoriesMenuData({
          type: 2,
        }).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg);
          }
          this.parentCateList = res.data.data;
          this.showCateAddDialog = true;
        }).catch(err => {
          console.log(err);
        });
      },
      //监听级联选择框选择改变的change事件
      cateChange() {
        if(this.selectKeys.length > 0) {
          //说明选中父节点，获取最后一个id为父节点
          //修改添加分类的父节点和等级
          this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
          this.addCateForm.cat_level = this.selectKeys.length;
        }else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      //点击确定添加分类的函数
      determineAddCate() {
        //表单预验证
        this.$refs.addCateForm.validate(valid => {
          if(!valid) {
            return
          }
          postNewCategoriesInfo(this.addCateForm).then(res => {
            if(res.data.meta.status !==201) {
              return this.$message.error(res.data.meta.msg)
            }
            this.$message.success('添加分类成功');
            this._getCategoriesMenuData(this.queryInfo);
            this.showCateAddDialog = false;
          })
        });
      },
      //点击编辑操作的触发事件
      editDialog() {

      },
      //点击删除操作的触发事件
      removeDialog() {

      },
      //分页pagesize发生改变时触发
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this._getCategoriesMenuData(this.queryInfo);
      },
      //分页pagenum发生改变时触发
      handleCurrentChange(newpage) {
        this.queryInfo.pagenum = newpage;
        this._getCategoriesMenuData(this.queryInfo);
      },
    }
  }
</script>

<style scoped lang="less">
  .tree-table {
    margin-top: 10px;
    font-size: 14px;
  }
</style>
