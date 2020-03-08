<template>
  <div class="users">
    <!--面包屑导航栏-->
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主体card-->
    <el-card class="box-card">
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    class="input-with-select" clearable
                    @input="_getUsersMenuData(queryInfo)">
            <el-button slot="append" icon="el-icon-search"
                       @click="_getUsersMenuData(queryInfo)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <!--主体表格栏-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!--slot-scope="scope"中的scope.row代表当前行的所有数据-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       active-color="#13ce66" @change="changUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="reEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false" >
              <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="handleSetRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[2, 3, 4, 5]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog title="请输入需要添加的用户名" :visible.sync="showDialog"
    width="50%" :before-close="handleClose" @close="dialogClosed">
      <el-form :model="addUserInfo" :rules="addFormRules" ref="addForm"
      label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户信息的对话框-->
    <el-dialog title="修改用户信息" :visible.sync="isShowEditDialog"
               width="50%" @close="resetDialog">
      <el-form :model="userInfo" :rules="addFormRules" ref="modifyForm"
               label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineReUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色的对话框-->
    <el-dialog :modal-append-to-body='false' title="分配角色"
               :visible.sync="isShowRoleDialog"
               width="50%" @close="resetRolesDialog">
      <div>
        <div class="text-line"><el-tag type="info">用户名称:</el-tag>{{setRoleUserInfo.username}}</div>
        <div class="text-line"><el-tag type="info">角色描述:</el-tag>{{setRoleUserInfo.role_name}}</div>
        <div class="text-line"><el-tag type="info">分配角色:</el-tag>
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in RolesTree" :key="item.id" :label="item.roleName"
            :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getUsersMenuData,PutUserState,PutNewUserInfo,PutModifyUserInfo,
    DeleteUserInfo,GetRolesList,PutNewRole} from "network/usersMenu";

  export default {
    name: "User",
    data() {
      return {
        queryInfo: {
          query: '',
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 2,

        },
        userList: [],
        total: 0,
        showDialog: false,
        isShowEditDialog: false,
        addUserInfo: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addFormRules: {
          username: [
            {required: true,message: "请输入用户名",trigger: "blur"},
            {min:3,max:10,message: "用户名应该为3-10个字符",trigger: "blur"}
          ],
          password: [
            {required: true,message: "请输入密码",trigger: "blur"},
            {min:6,max:15,message: "用户名应该为6-15个字符",trigger: "blur"}
          ],
          email: [
            {required: true,message: "请输入邮箱",trigger: "blur"},
            {validator: this.checkEmail, trigger: "blur"}
          ],
          mobile: [
            {required: true,message: "请输入手机号码",trigger: "blur"},
            {validator: this.checkMobile, trigger: "blur"}
          ],
        },
        userInfo: {
          id: '',
          username: "",
          email: '',
          mobile: ''
        },
        isShowRoleDialog: false,
        RolesTree: [],
        setRoleUserInfo: {},
        selectedRoleId: ''
      }
    },
    created() {
      //获取users列表数据
      this._getUsersMenuData(this.queryInfo);
    },
    methods: {
      //获取整个用户表格数据的方法
      _getUsersMenuData(queryInfo){
        getUsersMenuData(queryInfo).then(res => {
          this.total = res.data.data.total;
          this.userList = res.data.data.users;
        }).catch(err => {
          console.log(err);
        })
      },
      //当分页功能的page-size个数出现变化时触发
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        //重新获取新分页的数据
        this._getUsersMenuData(this.queryInfo)
      },
      //监听页码值发生改变时触发事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        //重新获取新分页的数据
        this._getUsersMenuData(this.queryInfo)
      },
      //当用户点击state发生改变时触发此事件
      changUserState(userInfo) {
        //将修改后的新值发送到数据库修改用户状态
        PutUserState(userInfo).then(res => {

        }).catch(err => {
          console.log(err);
          //当修改服务器数据失败时，修改状态为原来的状态，即修改失败
          userInfo.msg_state = !userInfo.msg_state;
        });
      },
      //当点击关闭田添加用户的弹窗时出现
      handleClose() {
        this.showDialog = false;
      },
      //监听添加用户弹窗表单被关闭事件后重置表单
      dialogClosed() {
        //重置表单
        this.$refs.addForm.resetFields();
      },
      //点击添加用户按钮事件
      addUser() {
        this.showDialog = true;
      },
      //输入完用户信息后确定添加用户
      determineAddUser() {
        //表单内容预校验
        this.$refs.addForm.validate(valid => {
          //预校验不通过
          if(!valid) {
            return;
          }else {
            //添加信息到数据库
            PutNewUserInfo(this.addUserInfo).then(res => {
              if(res.data.meta.status !== 201) {
                return this.$message.error(res.data.meta.msg);
              }else {
                //隐藏弹窗
                this.showDialog = false;
                //重新获取用户列表信息
                this._getUsersMenuData(this.queryInfo);
                this.$message.success('更新用户数据成功')
              }
            }).catch(err => {
              console.log(err);
            })
          }
        })
      },
      //展示编辑用户的弹窗
      reEditDialog(userInfo) {
        //展示当前行用户信息
        this.userInfo.username = userInfo.username;
        this.userInfo.email = userInfo.email;
        this.userInfo.mobile = userInfo.mobile;
        this.userInfo.id = userInfo.id;
        this.isShowEditDialog = true;
      },
      //监听修改用户信息弹窗表单被关闭事件后重置弹窗表单
      resetDialog() {
        this.$refs.modifyForm.resetFields();
      },
      //确认修改用户信息的方法
      determineReUserInfo() {
        //预验证表单
        this.$refs.modifyForm.validate(valid => {
          if(!valid) {
            return;
          }else {
            PutModifyUserInfo(this.userInfo).then(res => {
              if(res.status !== 200) {
                return this.$message.error('更新用户信息失败');
              }
              //关闭对话框
              this.isShowEditDialog = false;
              //刷新数据列表
              this._getUsersMenuData(this.queryInfo);
            }).catch(err => {
              console.log(err);
            })
          }
        });
      },
      //点击删除用户的方法
      removeUser(id) {
        //显示弹窗的方法
        this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //弹窗点击确定后执行的操作
          //根据id删除用户
          DeleteUserInfo(id).then(res => {
            if(res.data.meta.status !== 200) {
              //显示提示
              this.$message({
                type: 'success',
                message: '删除失败!'});
            }
            //刷新数据列表
            this._getUsersMenuData(this.queryInfo);
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
      //验证输入表单的邮箱格式的方法
      checkEmail(rule, value, callback) {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入合法的邮箱'))
          }
        }, 100)
      },
      //验证输入表单的电话格式的方法
      checkMobile(rule, value, callback) {
        const mobileReg = /^1[3456789]\d{9}$/;
        setTimeout(() => {
          if (mobileReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入合法的手机号码'))
          }
        }, 100)
      },
      //监听分配角色按钮的点击事件
      handleSetRole(setRoleUserInfo) {
        //保存要分配角色的用户信息
        this.setRoleUserInfo = setRoleUserInfo;
        //获取所有的角色列表
        GetRolesList().then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error(res.data.data.meta.msg);
          }else {
            this.RolesTree = res.data.data;
          }
        }).catch(err => {
          console.log(err);
        })
        this.isShowRoleDialog = true
      },
      resetRolesDialog() {
        this.selectedRoleId = '';
        this.setRoleUserInfo = {}
      },
      //点击确定按钮，分配角色
      setRole() {
        if(!this.selectedRoleId){
          return this.$message.error('请选择要的分配的角色')
        }
        //提交新的角色信息到当前用户
        PutNewRole(this.setRoleUserInfo.id,this.selectedRoleId).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg);
          }
          /* const selectRole = this.RolesTree.find(item => {
            return item.id === res.data.data.rid;
          })
          this.userList.role_name = selectRole.roleName;*/
          this._getUsersMenuData(this.queryInfo);
          this.isShowRoleDialog = false;
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .scroll {
    height: 50vh;
  }
  .text-line {
    margin-top: 10px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    .el-tag {
      margin-right: 10px;
      font-size: 16px;
    }
  }
</style>
