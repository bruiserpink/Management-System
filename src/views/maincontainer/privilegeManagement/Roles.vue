<template>
  <div class="roles">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--添加角色按钮栏-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRules">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域-->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand" label="展开详情" width="80px">
          <template slot-scope="scope">
            <el-row  :class="['border-bottom',index1===0 ? 'border-top': '',
            'item-center']" v-for="(item1,index1) in scope.row.children"
            :key="item1.id">
              <!--一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二三级权限-->
              <el-col :span="19">
                <el-row :class="[index2 ===0 ? '':'border-top','item-center']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,index3) in item2.children"
                     :key="item3.id" type="warning" closable
                    @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="reEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"
            @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色的对话框-->
    <el-dialog :modal-append-to-body='false' title="请输入需要添加的用户名"
               :visible.sync="showDialog"
               width="50%" @close="dialogClosed">
      <el-form :model="addRoleInfo" :rules="addFormRules" ref="addForm"
               label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改角色信息的对话框-->
    <el-dialog :modal-append-to-body='false' title="修改角色信息"
               :visible.sync="isShowEditDialog"
               width="50%" @close="resetDialog">
      <el-form :model="roleInfo" :rules="addFormRules" ref="modifyForm"
               label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineReRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色权限的对话框-->
    <el-dialog :modal-append-to-body='false' title="分配角色权限"
               :visible.sync="isShowRightsDialog"
               width="50%" @close="resetRightsDialog">
      <el-scrollbar class="scroll">
        <!--rightsListProps为树结构绑定属性对象，show-checkbox为节点显示被选择按钮，
         default-expand-all为默认展开所有节点，node-key为数据项所绑定的节点值
         default-checked-keys为默认勾选节点key的数组
           -->
        <el-tree :data="rightsTree" :props="rightsTreeProps" show-checkbox
                 default-expand-all :default-checked-keys="defKeys"
                 node-key="id" ref="rightsTree"></el-tree>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {GetRolesMenuData,PutNewRoleInfo,PutModifyRoleInfo,
    DeleteRoleInfo,DeleteRoleRights,PutRoleRights} from "network/roles"
  import {GetRightsMenuData} from  "network/rights"
  import BetterScroll from "components/better-scroll/BetterScroll";
  export default {
    name: "rights",
    components: {BetterScroll},
    data() {
      return {
        showDialog: false,
        isShowEditDialog: false,
        isShowRightsDialog: false,
        roleId: '',
        rolesList: [],
        //树结构权限列表
        rightsTree: [],
        //树结构组件的属性绑定对象
        rightsTreeProps: {
          //每个结构的子节点的命名
          children: 'children',
          //每个结构的标题
          label: 'authName'
        },
        //默认选中的节点id值
        defKeys: [],
        roleInfo: {
          roleDesc: '',
          roleName: ''
        },
        addFormRules: {
          roleName: [
            {required: true,message: "请输入角色名称",trigger: "blur"},
            {min:3,max:10,message: "角色名称应该为3-10个字符",trigger: "blur"}
          ],
          roleDesc: [
            {required: true,message: "请输入角色描述",trigger: "blur"},
            {min:3,max:10,message: "用户名应该为3-10个字符",trigger: "blur"}
          ]
        },
        addRoleInfo: {
          roleDesc: '',
          roleName: ''
        },
      }
    },
    created() {
      this._GetRolesMenuData();
    },
    methods: {
      //请求表格信息的方法
      _GetRolesMenuData(){
        GetRolesMenuData().then(res=> {
          if(res.data.meta.status !== 200) {
            this.$message.error('获取角色列表失败');
          }else {
            this.rolesList = res.data.data;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //修改角色信息
      reEditDialog(rowRoleInfo) {
        //展示当前行角色信息
        this.roleInfo.roleName = rowRoleInfo.roleName;
        this.roleInfo.roleDesc = rowRoleInfo.roleDesc;
        this.roleInfo.id = rowRoleInfo.id;
        this.isShowEditDialog = true;
      },
      //重置编辑角色对话框的方法
      resetDialog(){
        //重置表单
        this.$refs.modifyForm.resetFields();
      },
      //重置添加觉得对话框的方法
      dialogClosed() {
        //重置表单
        this.$refs.addForm.resetFields();
      },
      //确认修改用户信息的方法
      determineReRoleInfo() {
        //预验证表单
        this.$refs.modifyForm.validate(valid => {
          if(!valid) {
            return;
          }else {
            PutModifyRoleInfo(this.roleInfo).then(res => {
              if(res.status !== 200) {
                return this.$message.error('更新角色信息失败');
              }
              //刷新数据列表
              this._GetRolesMenuData();
              this.$message.success('更新角色数据成功')
              //关闭对话框
              this.isShowEditDialog = false;
            }).catch(err => {
              console.log(err);
            })
          }
        });
      },
      //确认添加用户信息的方法
      determineAddRole() {
        //表单内容预校验
        this.$refs.addForm.validate(valid => {
          //预校验不通过
          if(!valid) {
            return;
          }else {
            //添加信息到数据库
            PutNewRoleInfo(this.addRoleInfo).then(res => {
              if(res.data.meta.status !== 201) {
                return this.$message.error("添加角色失败");
              }else {
                //刷新数据列表
                this._GetRolesMenuData();
                this.$message.success('添加角色数据成功')
                //隐藏弹窗
                this.showDialog = false;
              }
            }).catch(err => {
              console.log(err);
            })
          }
        })
      },
      //根据id删除角色的方法
      removeRole(id) {
        //显示弹窗的方法
        this.$confirm('此操作将永久删除该角色，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //弹窗点击确定后执行的操作
          //根据id删除用户
          DeleteRoleInfo(id).then(res => {
            if(res.data.meta.status !== 200) {
              //显示提示
              this.$message({
                type: 'success',
                message: '删除失败!'});
            }
            //刷新数据列表
            this._GetRolesMenuData();
            //显示提示
            this.$message({
              type: 'success',
              message: '删除成功!'});
          });
        }).catch(() => {
          ///弹窗点击取消后执行的操作
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //监听添加角色按钮点击
      addRules() {
        //显示添加角色对话框
        this.showDialog = true;
      },
      //监听权限标签的close事件，并根据其id删除该三级权限
      removeRightById(role,roleRightId) {
        //显示弹窗的方法
        this.$confirm('此操作将删除该角色的该项权限，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
          //弹窗点击确定后执行的操作
          // 根据id删除用户权限
          DeleteRoleRights(role.id,roleRightId).then(res => {
            console.log(res);
            if(res.data.meta.status !== 200) {
              //显示提示
              this.$message({
                type: 'success',
                message: '删除失败!'});
            }
            //刷新权限列表
            role.children = res.data.data;
            //显示提示
            this.$message({
              type: 'success',
              message: '删除成功!'});
          });
        }).catch(() => {
          ///弹窗点击取消后执行的操作
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //通过递归获取当前角色下所有的三级权限的id，并保存到defkeys中。一直递归调用此函数，
      // 直到其不存在children节点，那么说明为三级节点
      getLeafKeys(node,arr) {
        if(!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item,arr);
        })
      },
      //展示分配权限对话框的方法
      showSetRightDialog(role) {
        this.roleId = role.id;
        GetRightsMenuData('tree').then(res => {
          if(res.data.meta.status !== 200) {
            this.$message.error('获取权限失败')
          }else {
            this.rightsTree = res.data.data;
          }
        }).catch(err => {
          console.log(err);
        });
        this.getLeafKeys(role,this.defKeys);
        this.isShowRightsDialog = true;
      },
      //监听分配角色对话框关闭事件，重置分配角色权限的对话框
      resetRightsDialog() {
        //关闭对话框时清空保存三级节点的数组
        this.defKeys = [];
      },
      //确定分配权限
      setRoleRights() {
        //此api返回树组件的中被全选中节点的数组
        const allKeys = this.$refs.rightsTree.getCheckedKeys();
        //此api返回树组件的中被半选中节点的数组
        const halfKeys = this.$refs.rightsTree.getHalfCheckedKeys();
        //此数组保存所有123级被选中节点的id
        const keys = [...allKeys,...halfKeys];
        //由于请求的api要求传入一个字符串，所以再处理一下
        const idStr = keys.join(',');
        PutRoleRights(this.roleId,idStr).then(res => {
          if(res.data.meta.status !== 200) {
            this.$message.error('修改角色权限失败');
          }else {
            //刷新角色列表数据
            this._GetRolesMenuData();
          }
        }).catch(err => {
          console.log(err);
        })
        //关闭对话框
        this.isShowRightsDialog = false;
      },
    }
  }
</script>

<style scoped lang="less">
  .el-tag {
    margin: 7px;
  }
  .border-top {
    border-top: 1px solid #eee;
  }
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
  .item-center {
    display: flex;
    align-items: center;
  }
  .scroll {
    height: 50vh;
  }
</style>
