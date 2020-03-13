<template>
  <div class="orders">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    class="input-with-select" @input="searchOrder"
                    clearable @clear="_getOrdersData(queryInfo)">
            <el-button slot="append" icon="el-icon-search"
                       @click="_getOrdersData(queryInfo)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加订单</el-button>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="修改地址" placement="left" effect="light">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="物流进度" placement="bottom" effect="light">
              <el-button type="success" icon="el-icon-location" size="mini"
                         @click="handleQuery(scope.row)"></el-button>
            </el-tooltip>
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

    <!--修改订单地址的对话框-->
    <el-dialog  title="修改地址信息"
               :visible.sync="isShowEditDialog"
               width="50%" @close="resetDialog">
      <el-form :model="addressForm" :rules="addressFormRules"
      ref="addressForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
                  v-model="addressForm.address1"
                  :options="citydata"
                  :props="{ expandTrigger: 'hover' ,
                             label: 'label',
                             value: 'value',
                             children: 'children'}"
                  @change="handleChange" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowEditDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框-->
    <el-dialog title="物流进度"
               :visible.sync="LogisticsDialog"
               width="50%">
      <el-scrollbar class="scroll">
        <!--展示物流信息的时间线-->
        <el-timeline>
          <el-timeline-item
                  v-for="(activity, index) in LogisticsInfo"
                  :key="index"
                  :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
  import {getOrdersData,getLogisticsInfo} from "network/orders";
  import {debounce,formatDate} from "Bcommon/utils";
  import citydata from "Bcommon/citydata";
  export default {
    name: "orders",
    data() {
      return {
        queryInfo: {
          //查询条件，可为空
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        total: 0,
        orderList: [],
        isShowEditDialog: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1:[
            {required: true,message: "请选择省市区/县",trigger: "blur"},
          ],
          address2:[
            {required: true,message: "请输入详细地址",trigger: "blur"},
          ]
        },
        citydata: [],
        LogisticsDialog: false,
        LogisticsInfo: []
      }
    },
    activated() {
      this._getOrdersData(this.queryInfo);
    },
    methods: {
      //给elseInfo一个默认值，指定该参数可传可不传，不传时为{}
      _getOrdersData(queryInfo,elseInfo = {}) {
        getOrdersData(queryInfo,elseInfo).then(res => {
          if(res.data.meta.status !== 200 ) {
            return this.$message.error(res.data.meta.msg);
          }
          this.total = res.data.data.total;
          this.orderList = res.data.data.goods;
        }).catch(err => {
          console.log(err);
        })
      },
      //搜索栏输入搜索防抖
      searchOrder() {
        const searchOrder = debounce(this._getOrdersData,200);
        searchOrder(this.queryInfo);
      },
      //编辑地址操作
      handleEdit(row) {
        //将citydata值赋给级联选择框数据源
        this.citydata = citydata;
        this.isShowEditDialog = true;
      },
      //监听编辑地址dialog的关闭事件
      resetDialog() {
        //重置表单数据项
        this.$refs.addressForm.resetFields();
      },
      //物流信息查询操作
      handleQuery(row) {
        this.LogisticsDialog = true;
        //根据快递单号获取物流信息的方法
        getLogisticsInfo('877402818297586614').then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg);
          }
          this.LogisticsInfo = res.data.data;
        }).catch(err => {
          console.log(err);
        })
      },
      //监听分页控制size改变事件
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this._getOrdersData(this.queryInfo);
      },
      //监听分页控制页面num改变事件
      handleCurrentChange(newnum) {
        this.queryInfo.pagenum = newnum;
        this._getOrdersData(this.queryInfo);
      },
      //监听编辑地址的dialog的级联选择框选项改变事件
      handleChange() {

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
  .scroll {
    height: 350px;
  }
</style>
