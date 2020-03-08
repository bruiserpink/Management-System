<template>
  <div class="goodParams">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/params' }">参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数!"
                 type="warning" show-icon></el-alert>
      <!--选择商品分类区域-->
      <el-row class="cate_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--options指定数据源，为一个数组。props指定数据级联规则-->
          <el-cascader
                  v-model="selectKeys"
                  :options="goodsCateList"
                  :props="{expandTrigger:'hover',
                            value: 'cat_id',
                            label: 'cat_name',
                            children: 'children'}"
                  clearable  size="medium" @change="selectCateChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--tab栏添加参数/属性区域-->
      <el-tabs @tab-click="tabClick" v-model="activeName">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isSelected"
          @click="showAddDialog = true">添加参数</el-button>
          <!--动态参数展示表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand" ></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="deleteAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isSelected"
          @click="showAddDialog = true">添加属性</el-button>
          <!--静态属性展示表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"  label="序号" width="50px"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="deleteAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数的对话框-->
    <el-dialog :title="'添加'+ titleText" :visible.sync="showAddDialog"
            width="50%" @close="addDialogClosed">
      <!--添加参数的内容表单-->
      <el-form :model="addForm" :rules="addFormRules"
      ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineAddParam">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑参数内容的对话框-->
    <el-dialog :title="'修改'+ titleText" :visible.sync="showEditDialog"
               width="50%" @close="editDialogClosed">
      <!--添加参数的内容表单-->
      <el-form :model="editForm" :rules="editFormRules"
               ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineEditParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getGoodsCateData,getCateAttributes,putCateAttributes,getCateAttributesInfo,
    putCateAttributesInfo,deleteCateAttributes} from 'network/cate_params'
  export default {
    name: "params",
    data() {
      return {
        queryInfo: {},
        goodsCateList: [],
        selectKeys: [],
        //el-tabs栏被选中的选项的名称
        activeName: 'many',
        isSelected: true,
        //选择的二级/三级分类的id
        selectCateId: 3098,
        //动态参数的列表数据
        manyTableData: [],
        //静态属性的列表数据
        onlyTableData: [],
        //是否展示添加参数的弹窗
        showAddDialog: false,
        //添加参数对话框的表单数据
        addForm: {
          attr_name: ''
        },
        //添加参数对话框的表单数据的验证规则
        addFormRules: {
          attr_name: [
            {required: true,message: "请输入参数名",trigger: "blur"},
            {min:3,max:10,message: "参数名应该为3-10个字符",trigger: "blur"}
          ]
        },
        //是否展示编辑参数内容的对话窗
        showEditDialog: false,
        editForm: {},
        editFormRules: {
          attr_name: [
            {required: true,message: "请输入参数名",trigger: "blur"},
            {min:3,max:10,message: "参数名应该为3-10个字符",trigger: "blur"}
          ]
        },
      }
    },
    created() {
      //因为此操作获取所有的分类数据，所以直接获取所有数据，不需要指定params
      getGoodsCateData(this.queryInfo).then(res => {
        if(res.data.meta.status !==200) {
          return this.message.error(res.data.meta.msg);
        }
        this.goodsCateList = res.data.data;
      }).catch(err => {
        console.log(err);
      });
      //获取参数
      this._getCateAttributes();
    },
    methods: {
      //监听级联选择框选择分类变化的事件,如果级联选择框不指定props属性有checkStrictly: true
      //那么默认只允许选中最底层分类，即只有底层分类发生变化时，才会触发change事件
      selectCateChange() {
        //设置添加按钮为可选状态
        if(this.selectKeys) {
          this.isSelected = false
        }
        //获取当前被选中二级/三级分类的id
        this.selectCateId  = this.selectKeys[2] || this.selectKeys[1];
        this._getCateAttributes();
      },
      //监听tab栏的点击事件
      tabClick() {
        this._getCateAttributes();
      },
      //获取参数列表数据的方法
      _getCateAttributes() {
        //获取参数
        getCateAttributes(this.selectCateId,this.activeName).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg);
          }
          if(this.activeName === 'only') {
            this.onlyTableData = res.data.data;
          }else {
            this.manyTableData = res.data.data;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //监听添加参数的对话框的关闭事件
      addDialogClosed() {
        //1.重置清空表单数据
        this.$refs.addForm.resetFields();
      },
      //监听添加参数的对话框的确定按钮点击事件
      determineAddParam() {
        //1.预验证表单数据
        this.$refs.addForm.validate(valid => {
          if(!valid) {
             return this.$message.error('表单预验证未通过');
          }
          //2.发送添加的数据到服务器
          putCateAttributes(this.selectCateId,{
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName}).then(res => {
            if(res.data.meta.status !== 201) {
              return this.$message.error(res.data.meta.msg);
            }
            //重新获取参数列表数据
            this._getCateAttributes();
            //关闭对话框
            this.showAddDialog = false;
          }).catch(err => {
            console.log(err);
          })
        });
      },
      //监听编辑按钮的点击事件
      handleEdit(attr_id) {
        this.showEditDialog = true;
        //获取参数的信息
        getCateAttributesInfo(this.selectCateId,attr_id,this.activeName)
            .then(res => {
              if(res.data.meta.status !== 200) {
                return this.$message.error(res.data.meta.msg);
              }
              this.editForm = res.data.data;
            }).catch(err => {
              console.log(err);
            })
      },
      //监听编辑参数对话框的关闭事件
      editDialogClosed() {
        this.$refs.editForm.resetFields();
      },
      //监听编辑参数的对话框的确定按钮点击事件
      determineEditParam() {
        //表单预验证
        this.$refs.editForm.validate(valid => {
          if(!valid) return;
          //提交修改后的信息给服务器
          putCateAttributesInfo(this.selectCateId,this.editForm.attr_id,{
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            if(res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            }
            this._getCateAttributes();
            this.showEditDialog = false;
          }).catch(err => {
            console.log(err);
          })
        })
      },
      //监听删除参数按钮的点击事件
      deleteAttr(attr_id) {
        //显示提示弹窗
        this.$confirm('此操作将删除该参数，是否继续?','提示',{
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCateAttributes(this.selectCateId,attr_id).then(res => {
            if(res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            }
            this._getCateAttributes();
          }).catch(err => {
            this.$message.error('删除参数失败')
          })
        }).catch(() => {

        })
      }
    },
    computed: {
      //动态计算点击添加动态参数/静态属性按钮时弹出的dialog的标题
      titleText() {
        return this.activeName === 'many' ? '动态参数' : '静态属性'
      }
    }
  }
</script>

<style scoped>
  .cate_opt {
    margin: 15px 0;
  }
  .el-cascader {
    width: 400px;
    margin-left: 15px;
  }
</style>
