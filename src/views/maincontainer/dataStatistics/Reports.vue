<template>
  <div class="reports">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/welcome' }">数据统计</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reports' }">数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="chart" ref="chart"></div>
    </el-card>
  </div>
</template>

<script>
  //导入绘制图表插件
  import echarts from 'echarts'
  //获取图表所需数据
  import {getReportsData} from 'network/reports'
  export default {
    name: "reports",
    data() {
      return {
        chartOption: {
          title: {
            text: '用户来源',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        },
      }
    },
    activated() {

    },
    mounted() {
      //创建Echart实例
      const mychart = echarts.init(this.$refs.chart);
      this._getReportsData(mychart);
    },
    methods: {
      _getReportsData(mychart) {
        getReportsData(mychart).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg);
          }
          // 使用配置项和数据显示图表。
          res.data.data.xAxis[0].boundaryGap = false;
          const option = Object.assign(res.data.data,this.chartOption);
          mychart.setOption(option);
        }).catch(err => {
          console.log(err);
        })
      }
    },
  }
</script>

<style scoped lang="less">
  #chart {
    width: 750px;
    height: 400px;
  }
</style>
