<template>
  <div class="addGoods">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/add' }">添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--提示区域-->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤栏区域-->
      <el-steps :space="200" :active="parseInt(activeStepIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--信息填写tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px"
      class="demo-ruleForm" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeStepIndex"
        :before-leave="beforeChangeTabs" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-scrollbar class="scroll" style="height: 380px">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="{ expandTrigger: 'hover' ,
                             label: 'cat_name',
                             value: 'cat_id',
                             children: 'children'}"
                  @change="handleChange" clearable></el-cascader>
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData"
                          :key="item.attr_id">
            <!--使用复选框渲染所有的动态参数属性,且因为复选框双向绑定了attr_vals，
            所以复选框的状态改变会直接删除attr_vals数组的数据-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(item2,index2) in item.attr_vals" :label="item2"
                :key="index2"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                    :headers="requestHeader"
                    class="upload-demo"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture" :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
          <!--引入一个富文本编辑器-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <!--添加商品的按钮-->
            <el-button type="primary" style="margin-top: 15px" @click="determineAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--预览图片的dialog-->
    <el-dialog title="图片预览" :visible.sync="showPreviewDialog" width="40%">
      <img :src="previewUrl" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  //获取商品分类列表的方法
  import {getCategoriesMenuData} from 'network/category'
  //根据商品分类id获取商品参数的方法
  import {getCateAttributes} from  'network/cate_params'
  //将要添加的商品信息提交到服务器
  import {putNewGoodsInfo} from 'network/addGoods'
  //导入富文本编辑框的样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  //导入富文本编辑器组件
  import {quillEditor} from 'vue-quill-editor'
  export default {
    name: "AddGoods",
    data() {
      return {
        //将步骤条激活态index和tab栏的name进行绑定
        activeStepIndex: 0,
        //添加商品输入框的绑定数据
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          //保存已经上传图片服务器路径的数组
          pics: [],
          //商品的详情描述
          goods_introduce: '',
          //保存修改后的动态参数和静态属性
          attrs: []
        },
        //添加商品信息输入框的规则
        addFormRules: {
          goods_name: [
            {required: true,message: '请输入商品名称',trigger: 'blur'}
          ],
          goods_price: [
            {required: true,message: '请输入商品价格',trigger: 'blur'}
          ],
          goods_weight: [
            {required: true,message: '请输入商品重量',trigger: 'blur'}
          ],
          goods_number: [
            {required: true,message: '请输入商品数量',trigger: 'blur'}
          ],
          goods_cat: [
            {required: true,message: '请选择商品分类',trigger: 'blur'}
          ]
        },
        //所有分类的数据
        cateList: [],
        //所选分类的对应动态参数数据,即商品参数tab选项对应数据
        manyTableData: [],
        //所选分类的对应静态属性数据,即商品属性tab选项对应数据
        onlyTableData: [],
        //上传图片的远程服务器地址
        // uploadUrl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
        //为upload设置请求头
        requestHeader: {
          Authorization: window.sessionStorage.getItem('token'),
        },
        previewUrl: '',
        //显示预览的dialog
        showPreviewDialog: false,
        //上传图片到本地数据库地址
        uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      }
    },
    activated() {
      //当此路由被激活时，获取
      //1.所有商品分类信息
      this._getCategoriesMenuData();
      //2.根据1选中的分类id获取分类的动态参数
      this._getCateAttributes('many');
      //3.根据1选中的分类id获取分类的静态属性
      this._getCateAttributes('only');
    },
    methods: {
      //获取基本信息页面所有分类数据的方法
      _getCategoriesMenuData() {
        getCategoriesMenuData().then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg);
          }
          this.cateList = res.data.data;
        }).catch(err => {
          console.log(err);
        })
      },
      _getCateAttributes(type) {
        getCateAttributes(this.addForm.goods_cat[2],type).then(res => {
          if(res.data.meta.status !== 200) {
            return
          }
          if(type === 'many') {
            //将获取的的attr_vals字符串分割成数组
            res.data.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
            });
            this.manyTableData = res.data.data;
          }else {
            this.onlyTableData = res.data.data;
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //监听级联选择框选中项改变事件
      handleChange() {
        if(this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = [];
        }
      },
      //监听tab切换前的钩子函数。该函数传入两个参数：activeName,oldActiveName
      //前者为即将进入的标签页的名字，后者为即将离开的标签页的名字
      beforeChangeTabs(activeName,oldActiveName) {
        if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品所属分类')
          return false;
        }
      },
      //监听tab栏的点击事件
      tabClicked() {
        switch (this.activeStepIndex) {
          //点击基本信息获取分类
          case '0': {
            this._getCategoriesMenuData();
            break;
          }
          //点击商品参数获取分类动态参数
          case '1': {
            this._getCateAttributes('many');
            break;
          }
          //点击商品属性获取分类静态属性
          case '2': {
            this._getCateAttributes('only');
            break;
          }
          default: break
        }
      },
      //监听移除图片事件
      handleRemove(file) {
        const removeFilePath = file.response.data.tmp_path;
        const removePicIndex = this.addForm.pics.findIndex(item =>
          item.pic === removeFilePath);
        this.addForm.pics.splice(removePicIndex,1);
      },
      //触发预览图片事件的处理函数
      handlePreview(response) {
        this.previewUrl = response.response.data.url;
        this.showPreviewDialog = true;
      },
      //图片上传成功的钩子函数
      uploadSuccess(response) {
        //1.获取图图片信息保存在一个对象中
        const picInfo = {pic: response.data.tmp_path};
        //2.将图片信息对象，push到pis数组中
        this.addForm.pics.push(picInfo);
      },
      //监听步骤5的添加商品按钮的点击
      determineAddGoods() {
        //1.表单预验证
        this.$refs.addForm.validate(valid => {
          if(!valid) {
            return this.$message.error('表单预验证未通过，请检查您提交的信息')
          }
          /*putNewGoodsInfo方法传入的参数中，addForm的goods_cat需要时一个用,隔开的字符串，
          但是当前保存的是一个数组，需要对该数组进行处理。
          由于addForm中的goods_cat属性和表单数据进行了双向绑定，所以不能直接对该属性进行修改，
          所以采用深拷贝的方法拷贝一份goods_cat数据进行修改然后传入参数中。*/
          let deepCloneData = JSON.parse(JSON.stringify(this.addForm));
          //处理保存分类id的数组
          deepCloneData.goods_cat = deepCloneData.goods_cat.join(',');
          //处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            deepCloneData.attrs.push(newInfo)
          })
          //处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            deepCloneData.attrs.push(newInfo)
          })
          //添加商品数据
          putNewGoodsInfo(deepCloneData).then(res => {
            if(res.data.meta.status !== 201) {
              return
            }
            this.$message.success('添加商品成功');
            console.log(res);
            this.$router.push('/goods');
          }).catch(err => {
            console.log(err);
          })
        })
      }
    },
    components: {
      quillEditor
    }
  }
</script>

<style scoped lang="less">
  .el-cascader {
    width: 300px;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .previewImg {
    width: 100%;
  }
</style>
