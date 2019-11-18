<template>
  <section class="echarts-box" :style="styleObj">
    <div class="echarts-bar" ref="echartsBar"></div>
  </section>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/bar');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  // 引入legend组件
  require("echarts/lib/component/legend");
  export default {
    props:{
      list:{
        type: Array,
        default(){
          return []
        }
      },
      styleObj:{
        type: Object,
        default(){
          return{
            height: '100%',
            width: '100%'
          }
        }
      },
      isStack:{
        type: Boolean,
        default: false
      },
      isLegend:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        legendData: [],
        xAxisData: [],
        series: [],
        myChart: null
      }
    },
    mounted() {
      this.initChart();
    },
    watch:{
      list: {
        handler(newValue, oldValue) {
          //console.log(newValue)
          this.initData(newValue)
        },
        deep: true
      }
    },
    methods:{
      initData(list){
        if (this.isLegend) {
          if (this.isStack){
            this.series = [];
            this.legendData = [];
            this.xAxisData = [];
            list.forEach((item,index)=>{
              //console.log(item)
              this.legendData.push(item.legendName);
              let seriesData = [];
              item.data.forEach(i=>{
                index === 0 && this.xAxisData.push(i.name);
                seriesData.push(i.value);
              });
              this.series.push({
                name: item.legendName,
                type: 'bar',
                stack: 'value',
                barGap: 0.01,
                barWidth: 40,
                data: seriesData
              })
            });
          } else{

          }
        }else {
          let seriesData = [];
          this.xAxisData = [];
          list.forEach(item=>{
            this.xAxisData.push(item.name);
            seriesData.push(item.value);
          });
          this.series = [{
            name: '',
            type: 'bar',
            barGap: 0.01,
            barWidth: 40,
            data: seriesData
          }];
        }

        // console.log(this.series)
        this.setOption();
      },
      initChart(){
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(this.$refs.echartsBar);
        // 绘制图表
        this.setOption();
      },
      setOption(){
        this.myChart.setOption({
          color: ['#38A0FF','#4CCA73'],
          title: {
            show: false,
            text: ''
          },
          legend: {
            show: this.isLegend,
            data: this.legendData,
            textStyle:{
              color:'#000'
            },
            bottom: '1%'
          },
          grid: {
            left: 0,
            right: 0,
            bottom: this.isLegend ? '8%' : 0,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle:{
                color: '#D3F5F3',
                opacity: 0.5
              }
            },
           //formatter: '{b0}: {c0}<br />{b1}: {c1}'
            formatter: function (params, ticket, callback) {
              if (params.length>1){
                let str = params[0].axisValue
                params.forEach((item,index)=>{
                  str += '<br/>'+item.marker + item.seriesName.replace('\n','')+': '+item.data
                })
                return str
              } else{
                return params[0].marker + params[0].name.replace('\n','')+': '+params[0].data;
              };
            }
          },
          xAxis: {
            type : 'category',
            //data: this.xAxisData,
            data: this.xAxisData.map(function (str) {
              if (str.length>8) {
                let c = str.substr(8,1) ;
                let s = str.replace(c,c+'\n');
                return s
              }else{
                return str
              }
            }),
            axisLine: { show: true },
            axisTick: { show: true },
            axisLabel: {
              interval: 0,
              textStyle: { color: '#666'}
            }
          },
          yAxis: {
            type : 'value',
            splitLine: {lineStyle:{type:'dashed'}},
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              textStyle: { color: '#666' }
            }
          },
          series: this.series/*[
            {
              name: '已报价',
              type: 'bar',
              barGap: 0.01,
              data: [5, 20, 36, 10, 10, 20]
            },
            {
              name: '未报价',
              type: 'bar',
              data: [50, 200, 360, 100, 100, 200]
            }
          ]*/,

        });

      }
    },
    beforeDestroy() {
      if (!this.myChart) {
        return
      }
      this.myChart.dispose()
      this.myChart = null;
    }
  };
</script>

<style lang="scss" scoped>
  .echarts-box{
    height:700px;
    width: 1000px;
    .echarts-bar{
      height: 100%;
      width: 100%;
    }
  }
</style>
